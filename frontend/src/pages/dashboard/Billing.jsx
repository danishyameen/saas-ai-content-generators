import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Check, Loader2, CreditCard, Smartphone } from 'lucide-react';
import { paymentsAPI } from '../../services/api';
import { loadStripe } from '@stripe/stripe-js';
import toast from 'react-hot-toast';
import useAuthStore from '../../store/authStore';

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const plans = [
  {
    id: 'pro',
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
  },
  {
    id: 'enterprise',
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
  },
];

export default function Billing() {
  const [searchParams] = useSearchParams();
  const { user, refreshUser } = useAuthStore();
  const [loading, setLoading] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [jazzcashForm, setJazzcashForm] = useState({ transactionId: '', plan: 'pro' });
  const [showJazzCash, setShowJazzCash] = useState(false);

  useEffect(() => {
    if (searchParams.get('success') === 'true') {
      toast.success('Subscription activated successfully!');
      refreshUser();
    }
    if (searchParams.get('canceled') === 'true') {
      toast.error('Payment was canceled');
    }

    // Fetch payment history
    paymentsAPI.getHistory()
      .then(({ data }) => setPaymentHistory(data.data))
      .catch(() => {});
  }, []);

  const handleStripeCheckout = async (plan) => {
    setLoading(plan);
    try {
      const { data } = await paymentsAPI.createStripeCheckout({ plan });
      window.location.href = data.url;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create checkout');
      setLoading(null);
    }
  };

  const handleJazzCashSubmit = async (e) => {
    e.preventDefault();
    setLoading('jazzcash');
    try {
      await paymentsAPI.submitJazzCash(jazzcashForm);
      toast.success('Payment submitted for verification');
      setJazzcashForm({ transactionId: '', plan: 'pro', proofImage: '' });
      setShowJazzCash(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit payment');
    } finally {
      setLoading(null);
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setJazzcashForm({ ...jazzcashForm, proofImage: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Billing & Subscription</h1>
        <p className="text-dark-400">Manage your plan and payment methods</p>
      </div>

      {/* Current Plan */}
      <div className="card">
        <h3 className="font-semibold mb-2">Current Plan</h3>
        <div className="flex items-center gap-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            user?.plan === 'pro' ? 'bg-primary-600/20 text-primary-400' :
            user?.plan === 'enterprise' ? 'bg-purple-600/20 text-purple-400' :
            'bg-dark-700 text-dark-300'
          }`}>
            {user?.plan?.charAt(0).toUpperCase() + user?.plan?.slice(1)} Plan
          </div>
          {user?.plan !== 'free' && (
            <button
              onClick={async () => {
                if (!user?.stripeCustomerId) {
                  setShowJazzCash(true);
                  setJazzcashForm({ ...jazzcashForm, plan: user.plan });
                  toast.success('Opening JazzCash portal for plan management');
                  return;
                }
                try {
                  const { data } = await paymentsAPI.createStripePortal();
                  window.location.href = data.url;
                } catch (error) {
                  const msg = error.response?.data?.message || 'Failed to open billing portal';
                  toast.error(msg);
                }
              }}
              className="btn-outline text-sm"
            >
              Manage Subscription
            </button>
          )}
        </div>
      </div>

      {/* Plans */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Upgrade Your Plan</h2>
        <div className="grid md:grid-cols-2 gap-6">
          {plans.map((plan) => (
            <div key={plan.id} className="card">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div>
                  <span className="text-3xl font-bold">${plan.price}</span>
                  <span className="text-dark-400">/{plan.period}</span>
                </div>
              </div>
              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-2 text-dark-300">
                    <Check size={16} className="text-green-400" />
                    {feature}
                  </li>
                ))}
              </ul>
              <div className="space-y-2">
                <button
                  onClick={() => handleStripeCheckout(plan.id)}
                  disabled={loading === plan.id}
                  className="btn-primary w-full"
                >
                  {loading === plan.id ? (
                    <>
                      <Loader2 size={16} className="inline mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard size={16} className="inline mr-2" />
                      Pay with Stripe
                    </>
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowJazzCash(true);
                    setJazzcashForm({ ...jazzcashForm, plan: plan.id });
                  }}
                  className="btn-secondary w-full"
                >
                  <Smartphone size={16} className="inline mr-2" />
                  Pay with JazzCash
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* JazzCash Modal */}
      {showJazzCash && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="card w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">JazzCash Payment</h3>
            <div className="mb-4 p-3 bg-dark-900 rounded-lg text-sm">
              <p className="font-medium mb-2">Payment Instructions:</p>
              <ol className="list-decimal list-inside space-y-1 text-dark-300">
                <li>Send ${plans.find(p => p.id === jazzcashForm.plan)?.price} to JazzCash: +923132942320</li>
                <li>Take a screenshot of the confirmation</li>
                <li>Enter the Transaction ID below and upload the proof</li>
              </ol>
            </div>
            <form onSubmit={handleJazzCashSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Plan</label>
                <select
                  value={jazzcashForm.plan}
                  onChange={(e) => setJazzcashForm({ ...jazzcashForm, plan: e.target.value })}
                  className="input w-full"
                >
                  <option value="pro">Pro - $20/month</option>
                  <option value="enterprise">Enterprise - $99/5 months</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Transaction ID</label>
                <input
                  type="text"
                  value={jazzcashForm.transactionId}
                  onChange={(e) => setJazzcashForm({ ...jazzcashForm, transactionId: e.target.value })}
                  className="input w-full"
                  placeholder="Enter JazzCash transaction ID"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Payment Slip (Image)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="input w-full"
                  required
                />
              </div>
              <div className="flex gap-2">
                <button type="submit" disabled={loading === 'jazzcash'} className="btn-primary flex-1">
                  {loading === 'jazzcash' ? 'Submitting...' : 'Submit Payment'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowJazzCash(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Payment History</h2>
        {paymentHistory.length === 0 ? (
          <div className="card text-center py-8 text-dark-400">
            No payment history
          </div>
        ) : (
          <div className="space-y-3">
            {paymentHistory.map((payment) => (
              <div key={payment._id} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium capitalize">{payment.plan} Plan</p>
                    <p className="text-sm text-dark-400">
                      {payment.method === 'stripe' ? '💳 Stripe' : '📱 JazzCash'} •{' '}
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">${payment.amount}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      payment.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                      payment.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                      'bg-red-600/20 text-red-400'
                    }`}>
                      {payment.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
