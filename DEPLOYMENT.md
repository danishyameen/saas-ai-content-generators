# 🚀 DEPLOYMENT GUIDE - AI Business Generator SaaS

## Complete Setup & Deployment Instructions

---

## 1. PREREQUISITES

Before deploying, ensure you have:
- Node.js 18+ installed
- MongoDB Atlas account (free tier works)
- Google Gemini API key
- Stripe account (test mode for development)
- Vercel account
- Render account

---

## 2. MONGODB ATLAS SETUP

### Step 1: Create Cluster
1. Go to https://cloud.mongodb.com
2. Sign up / Log in
3. Click "Build a Database"
4. Choose **FREE** tier (M0)
5. Select your preferred cloud provider and region
6. Click "Create"

### Step 2: Configure Security
1. **Database Access**: Create a database user
   - Go to "Database Access" in left sidebar
   - Click "Add New Database User"
   - Choose "Password" authentication
   - Create username and strong password
   - Grant "Read and write to any database" privilege

2. **Network Access**: Allow connections
   - Go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

### Step 3: Get Connection String
1. Go to "Database" → Click "Connect"
2. Choose "Connect your application"
3. Copy the connection string
4. Replace `<password>` with your database user password
5. Replace `<dbname>` with `ai-saas`

Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/ai-saas?retryWrites=true&w=majority`

---

## 3. GOOGLE GEMINI API SETUP

### Step 1: Get API Key
1. Go to https://makersuite.google.com/app/apikey
2. Sign in with Google account
3. Click "Create API Key"
4. Copy the API key

### Step 2: Set Usage Limits (Optional)
1. Go to Google Cloud Console
2. Set quota limits to control costs
3. Free tier: 60 requests/minute

---

## 4. STRIPE SETUP

### Step 1: Create Stripe Account
1. Go to https://dashboard.stripe.com/register
2. Create account
3. Activate test mode (toggle in top right)

### Step 2: Create Products & Prices
1. Go to "Products" → "Add Product"
2. Create **Pro Plan**:
   - Name: "Pro"
   - Pricing: Reccurring, $9/month
   - Save and copy the **Price ID** (starts with `price_`)

3. Create **Enterprise Plan**:
   - Name: "Enterprise"
   - Pricing: Recurring, $99/month
   - Save and copy the **Price ID**

### Step 3: Get API Keys
1. Go to "Developers" → "API keys"
2. Copy **Secret key** (starts with `sk_test_`)
3. Copy **Publishable key** (starts with `pk_test_`)

### Step 4: Setup Webhook
1. Go to "Developers" → "Webhooks" → "Add endpoint"
2. Endpoint URL: `https://your-render-url.com/api/payments/stripe/webhook`
3. Select events:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.deleted`
4. Save and copy the **Webhook secret** (starts with `whsec_`)

---

## 5. BACKEND DEPLOYMENT (Render)

### Step 1: Prepare Repository
1. Push your code to GitHub
2. Ensure `backend/` folder is in the repo

### Step 2: Create Render Service
1. Go to https://render.com
2. Sign up / Log in
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: ai-business-generator-api
   - **Region**: Choose closest to your users
   - **Branch**: main
   - **Root Directory**: backend
   - **Runtime**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: Free

### Step 3: Set Environment Variables
In Render dashboard, add these environment variables:

```
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/ai-saas
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
GEMINI_API_KEY=your-gemini-api-key
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
STRIPE_PRICE_ID_PRO=price_your_pro_price_id
STRIPE_PRICE_ID_ENTERPRISE=price_your_enterprise_price_id
FRONTEND_URL=https://your-vercel-url.vercel.app
JAZZCASH_MERCHANT_ID=your_jazzcash_merchant_id
JAZZCASH_PASSWORD=your_jazzcash_password
JAZZCASH_HASH_KEY=your_jazzcash_hash_key
WHATSAPP_VERIFY_TOKEN=ai-saas-verify-token
```

### Step 4: Deploy
1. Click "Create Web Service"
2. Wait for deployment (5-10 minutes)
3. Copy your Render URL (e.g., `https://ai-business-generator-api.onrender.com`)
4. Update Stripe webhook URL with this new URL

---

## 6. FRONTEND DEPLOYMENT (Vercel)

### Step 1: Prepare Repository
Ensure `frontend/` folder is in your GitHub repo

### Step 2: Deploy to Vercel
1. Go to https://vercel.com
2. Sign up / Log in
3. Click "Add New..." → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: frontend
   - **Build Command**: `npm run build`
   - **Output Directory**: dist

### Step 3: Set Environment Variables
Add these in Vercel project settings:

```
VITE_API_URL=https://your-render-url.onrender.com/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

### Step 4: Deploy
1. Click "Deploy"
2. Wait for deployment (2-3 minutes)
3. Copy your Vercel URL

### Step 5: Update Backend
1. Go to Render dashboard
2. Update `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy backend

---

## 7. CREATE ADMIN USER

### Method 1: MongoDB Compass
1. Install MongoDB Compass: https://www.mongodb.com/products/compass
2. Connect using your MongoDB Atlas connection string
3. Navigate to `ai-saas` database → `users` collection
4. Insert a document:

```json
{
  "name": "Admin User",
  "email": "admin@yoursaas.com",
  "password": "$2a$10$YOUR_HASHED_PASSWORD",
  "role": "admin",
  "plan": "enterprise",
  "isBanned": false,
  "usageToday": 0,
  "totalAIRequests": 0,
  "referralCode": "ADMIN001",
  "referralCount": 0,
  "referralEarnings": 0,
  "createdAt": {"$date": "2026-04-15T00:00:00.000Z"}
}
```

### Method 2: Use API (After first signup)
1. Sign up a regular user
2. Use MongoDB Compass to change `role` to `"admin"`

### Password Hashing
To generate a bcrypt hash:
```javascript
const bcrypt = require('bcryptjs');
bcrypt.hash('your-secure-password', 10).then(hash => console.log(hash));
```

---

## 8. DOMAIN SETUP (Optional)

### Vercel Custom Domain
1. Go to Vercel project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

### Render Custom Domain
1. Go to Render dashboard → Your service → Settings
2. Add custom domain
3. Update DNS CNAME record

---

## 9. TESTING CHECKLIST

After deployment, test:

### Authentication
- [ ] User registration
- [ ] User login
- [ ] Password reset
- [ ] JWT token expiration

### AI Features
- [ ] Product generator
- [ ] SEO generator
- [ ] Ads generator
- [ ] Business ideas
- [ ] Social content
- [ ] Competitor analysis
- [ ] Usage limits (free plan)

### Payments
- [ ] Stripe checkout flow
- [ ] Stripe webhook (auto-upgrade)
- [ ] JazzCash submission
- [ ] Admin payment approval
- [ ] Plan downgrade

### Admin Panel
- [ ] View stats
- [ ] Ban/unban users
- [ ] Change user plans
- [ ] Approve JazzCash payments
- [ ] View AI requests

### Affiliate System
- [ ] Referral link generation
- [ ] Referral tracking
- [ ] Leaderboard
- [ ] Earnings calculation

---

## 10. PRODUCTION CHECKLIST

### Security
- [ ] Change JWT_SECRET to a strong random string
- [ ] Enable HTTPS (automatic on Vercel/Render)
- [ ] Set CORS origin to production frontend URL
- [ ] Use environment variables for all secrets
- [ ] Enable rate limiting (already configured)
- [ ] Set up MongoDB IP whitelist (restrict to Render IPs)

### Performance
- [ ] Enable MongoDB Atlas query optimization
- [ ] Use CDN for static assets (Vercel does this)
- [ ] Consider upgrading Render instance for production
- [ ] Set up caching headers

### Monitoring
- [ ] Set up Sentry for error tracking
- [ ] Enable Render logs
- [ ] Set up MongoDB Atlas alerts
- [ ] Monitor Stripe dashboard
- [ ] Track AI usage costs (Gemini API)

### Backups
- [ ] Enable MongoDB Atlas automated backups
- [ ] Export user data regularly
- [ ] Keep Stripe transaction records

---

## 11. ENVIRONMENT VARIABLES REFERENCE

### Backend (.env)
```bash
# Required
NODE_ENV=production
MONGODB_URI=mongodb+srv://...
JWT_SECRET=change-this-to-random-64-char-string
GEMINI_API_KEY=AIza...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID_PRO=price_...
STRIPE_PRICE_ID_ENTERPRISE=price_...
FRONTEND_URL=https://your-app.vercel.app

# Optional
JAZZCASH_MERCHANT_ID=...
JAZZCASH_PASSWORD=...
JAZZCASH_HASH_KEY=...
WHATSAPP_VERIFY_TOKEN=ai-saas-verify-token
PORT=5000
```

### Frontend (.env)
```bash
VITE_API_URL=https://your-api.onrender.com/api
VITE_STRIPE_PUBLIC_KEY=pk_test_...
```

---

## 12. COST ESTIMATES

### Free Tier (Testing)
- MongoDB Atlas: FREE (M0 tier - 512MB)
- Render: FREE (with limitations)
- Vercel: FREE
- Gemini API: FREE (60 req/min)
- Stripe: Pay per transaction (2.9% + $0.30)
- **Total: $0/month** (excluding payment processing)

### Production Tier
- MongoDB Atlas: $9/month (M10 tier)
- Render: $7/month (Starter)
- Vercel: $20/month (Pro)
- Gemini API: ~$5-50/month (depending on usage)
- **Total: ~$41-86/month**

---

## 13. TROUBLESHOOTING

### Backend won't start
- Check Render logs for errors
- Verify MongoDB connection string
- Ensure all environment variables are set

### Frontend can't connect to backend
- Check VITE_API_URL is correct
- Verify CORS settings in backend
- Check browser console for errors

### Stripe webhook not working
- Verify webhook URL is correct
- Check webhook secret matches
- Test with Stripe CLI first

### AI generation fails
- Verify Gemini API key is valid
- Check API quota limits
- Review backend logs

### MongoDB connection fails
- Check IP whitelist (should include 0.0.0.0/0)
- Verify username/password
- Check connection string format

---

## 14. GOING LIVE

1. Switch Stripe from test mode to live mode
2. Update all API keys to production keys
3. Update environment variables
4. Test with real payments (small amounts first)
5. Announce launch! 🎉

---

## 15. POST-LAUNCH

### Marketing
- Submit to Product Hunt
- Share on Twitter/LinkedIn
- Post in relevant subreddits
- Create YouTube demo video
- Start affiliate program promotion

### Growth
- Monitor user feedback
- Track conversion rates
- Optimize landing page
- Add new features based on demand
- Scale infrastructure as needed

### Support
- Set up support email
- Create FAQ section
- Monitor admin dashboard
- Respond to user requests promptly

---

**🎯 Goal: $10,000 MRR**
- At $9/pro plan: Need 1,111 pro subscribers
- At $99/enterprise: Need 101 enterprise customers
- Mix: 500 pro + 50 enterprise = $9,450/month

Good luck with your SaaS launch! 🚀
