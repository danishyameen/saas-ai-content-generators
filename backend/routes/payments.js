const express = require('express');
const router = express.Router();
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const User = require('../models/User');
const Payment = require('../models/Payment');
const Affiliate = require('../models/Affiliate');
const { protect } = require('../middleware/auth');

// @route   POST /api/payments/stripe/create-checkout
// @desc    Create Stripe checkout session
// @access  Private
router.post('/stripe/create-checkout', protect, async (req, res) => {
  try {
    const { plan } = req.body;
    const user = await User.findById(req.user._id);

    const priceId = plan === 'enterprise'
      ? process.env.STRIPE_PRICE_ID_ENTERPRISE
      : process.env.STRIPE_PRICE_ID_PRO;

    if (!priceId) {
      return res.status(400).json({ success: false, message: 'Plan not available' });
    }

    let customerId = user.stripeCustomerId;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: { userId: user._id.toString() },
      });
      customerId = customer.id;
      user.stripeCustomerId = customerId;
      await user.save();
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      success_url: `${process.env.FRONTEND_URL}/dashboard/billing?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/dashboard/billing?canceled=true`,
      metadata: {
        userId: user._id.toString(),
        plan,
      },
    });

    res.json({ success: true, sessionId: session.id, url: session.url });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/payments/stripe/create-portal-session
// @desc    Create Stripe billing portal session
// @access  Private
router.post('/stripe/portal', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // If manual payment or no stripe customer, we don't have a portal
    if (!user.stripeCustomerId) {
      return res.status(400).json({
        success: false,
        message: 'No active Stripe subscription found. If you paid via JazzCash, please contact support for plan changes.'
      });
    }

    const session = await stripe.billingPortal.sessions.create({
      customer: user.stripeCustomerId,
      return_url: `${process.env.FRONTEND_URL}/dashboard/billing`,
    });

    res.json({ success: true, url: session.url });
  } catch (error) {
    console.error('Stripe Portal Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/payments/stripe/webhook
// @desc    Stripe webhook handler
// @access  Public
router.post('/stripe/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        const userId = session.metadata.userId;
        const plan = session.metadata.plan;

        const user = await User.findById(userId);
        if (user) {
          user.plan = plan;
          user.stripeSubscriptionId = session.subscription;
          await user.save();

          // Update affiliate earnings if referred
          if (user.referredBy) {
            const affiliate = await Affiliate.findOne({ referralCode: user.referredBy });
            if (affiliate) {
              affiliate.convertedReferrals += 1;
              affiliate.earnings += 5; // $5 per conversion
              const referrer = await User.findById(affiliate.user);
              if (referrer) {
                referrer.referralEarnings += 5;
                await referrer.save();
              }
              await affiliate.save();
            }
          }

          await Payment.create({
            user: userId,
            method: 'stripe',
            amount: plan === 'enterprise' ? 99 : 20,
            plan,
            status: 'completed',
            stripeSubscriptionId: session.subscription,
          });
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
        const userId = subscription.metadata.userId;

        if (userId) {
          await Payment.create({
            user: userId,
            method: 'stripe',
            amount: invoice.amount_paid / 100,
            plan: subscription.metadata.plan,
            status: 'completed',
            stripePaymentIntentId: invoice.payment_intent,
          });
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;

        if (userId) {
          const user = await User.findById(userId);
          if (user) {
            user.plan = 'free';
            user.stripeSubscriptionId = null;
            await user.save();
          }
        }
        break;
      }
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   POST /api/payments/jazzcash/submit
// @desc    Submit JazzCash payment
// @access  Private
router.post('/jazzcash/submit', protect, async (req, res) => {
  try {
    const { transactionId, plan, proofImage } = req.body;
    const user = await User.findById(req.user._id);

    if (!transactionId) {
      return res.status(400).json({ success: false, message: 'Transaction ID is required' });
    }

    const amount = plan === 'enterprise' ? 99 : 20;

    await Payment.create({
      user: user._id,
      method: 'jazzcash',
      amount,
      currency: 'PKR',
      plan,
      status: 'pending',
      jazzcashTransactionId: transactionId,
      jazzcashProofImage: proofImage || null,
    });

    res.json({
      success: true,
      message: 'Payment submitted for verification. Please wait for admin approval.',
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/payments/history
// @desc    Get payment history
// @access  Private
router.get('/history', protect, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .sort({ createdAt: -1 });

    res.json({ success: true, data: payments });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// @route   GET /api/payments/pricing
// @desc    Get pricing plans
// @access  Public
router.get('/pricing', (req, res) => {
  res.json({
    success: true,
    data: {
      plans: [
        {
          name: 'Free',
          price: 0,
          period: 'limited',
          features: [
            '5 total AI requests',
            'Basic AI generators',
            'Email support',
          ],
          cta: 'Get Started',
        },
        {
          name: 'Pro',
          price: 20,
          period: 'month',
          features: [
            '100 AI requests',
            'All AI generators',
            'Priority support',
            'Marketing campaigns',
            'SEO optimization',
          ],
          cta: 'Start Pro Trial',
          popular: true,
        },
        {
          name: 'Enterprise',
          price: 99,
          period: '5 months',
          features: [
            'Unlimited AI requests',
            'Everything in Pro',
            'API access',
            'Custom AI training',
            'Dedicated account manager',
            'Team collaboration',
          ],
          cta: 'Contact Sales',
        },
      ],
    },
  });
});

module.exports = router;
