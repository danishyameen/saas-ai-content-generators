const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const User = require('../models/User');
const AIService = require('../services/aiService');

// WhatsApp verification token
const VERIFY_TOKEN = process.env.WHATSAPP_VERIFY_TOKEN || 'ai-saas-verify-token';

// @route   GET /api/whatsapp/webhook
// @desc    WhatsApp webhook verification
// @access  Public
router.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    res.status(200).send(challenge);
  } else {
    res.sendStatus(403);
  }
});

// @route   POST /api/whatsapp/webhook
// @desc    WhatsApp webhook handler
// @access  Public
router.post('/webhook', async (req, res) => {
  try {
    const body = req.body;

    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry[0];
      const changes = entry.changes[0];
      const messages = changes.value.messages;

      if (messages && messages.length > 0) {
        const message = messages[0];
        const from = message.from;
        const text = message.text?.body?.toLowerCase();

        let response = await handleWhatsAppMessage(text);

        // Send response back (mock - would use WhatsApp Business API in production)
        console.log(`Response to ${from}: ${response}`);
      }

      res.sendStatus(200);
    } else {
      res.sendStatus(404);
    }
  } catch (error) {
    console.error('WhatsApp webhook error:', error);
    res.sendStatus(500);
  }
});

async function handleWhatsAppMessage(text) {
  const greetings = ['hi', 'hello', 'hey', 'start'];
  const faqs = {
    'pricing': '💰 Our Plans:\n\n• Free: 5 AI requests/day\n• Pro: $9/month - Unlimited\n• Enterprise: $99/month - Everything\n\nUpgrade: https://ai-business-generator.com/pricing',
    'features': '🚀 Features:\n\n✅ AI Product Descriptions\n✅ SEO Content Generation\n✅ Ad Copy Creation\n✅ Business Ideas\n✅ Social Media Content\n✅ Competitor Analysis\n\nTry it free: https://ai-business-generator.com',
    'help': '📞 How can I help?\n\n• Type "pricing" for plans\n• Type "features" for features\n• Type "trial" for free trial\n• Type "support" for help',
    'trial': '🎁 Start your FREE trial!\n\nGet 5 AI requests per day at no cost.\n\nSign up: https://ai-business-generator.com/register',
    'support': '📧 Support:\n\nEmail: support@ai-business-generator.com\nLive Chat: Available on our website\nHours: Mon-Fri 9AM-6PM EST',
  };

  if (greetings.some(g => text.includes(g))) {
    return `👋 Welcome to AI Business Generator!\n\nI can help you:\n• Learn about our plans\n• Get a free trial\n• Answer questions\n\nType "help" to see all options.`;
  }

  for (const [key, value] of Object.entries(faqs)) {
    if (text.includes(key)) {
      return value;
    }
  }

  // Use AI to generate response for unknown queries
  try {
    const aiResponse = await AIService.generate('product-generator', `Answer this customer question: ${text}. Keep it brief and helpful. Promote our AI Business Generator SaaS.`);
    return aiResponse.data;
  } catch {
    return `Thanks for your message! 😊\n\nFor detailed help, visit: https://ai-business-generator.com\n\nOr type "help" for options.`;
  }
}

// @route   POST /api/whatsapp/send-promo
// @desc    Send promotional message (admin use)
// @access  Public (should be protected in production)
router.post('/send-promo', async (req, res) => {
  try {
    const { phoneNumber, message } = req.body;

    // In production, integrate with WhatsApp Business API
    console.log(`Sending promo to ${phoneNumber}: ${message}`);

    res.json({ success: true, message: 'Promo message queued' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
