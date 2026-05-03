# API Documentation - AI Business Generator SaaS

Base URL: `http://localhost:5000/api` (development)

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <token>
```

---

## Auth Endpoints

### Register User
```
POST /auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "referralCode": "REF1234" // optional
}

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "plan": "free",
    "referralCode": "REFJOHNabc123",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: Same as register
```

### Get Current User
```
GET /auth/me
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "_id": "...",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "plan": "free",
    "usageToday": 2,
    "totalAIRequests": 15,
    "referralCode": "REFJOHNabc123",
    "referralCount": 3,
    "referralEarnings": 15
  }
}
```

### Update Profile
```
PUT /auth/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Updated",
  "email": "john.updated@example.com"
}
```

### Change Password
```
PUT /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "oldpass123",
  "newPassword": "newpass123"
}
```

---

## AI Endpoints

### Product Generator
```
POST /ai/product-generator
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "A premium wireless noise-canceling headphone..."
}

Response:
{
  "success": true,
  "data": "Generated product description...",
  "usage": {
    "used": 3,
    "limit": 5
  }
}
```

### SEO Generator
```
POST /ai/seo-generator
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "best project management software 2026"
}
```

### Ads Generator
```
POST /ai/ads-generator
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "A meal kit delivery service..."
}
```

### Business Ideas
```
POST /ai/business-ideas
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "I'm passionate about sustainability..."
}
```

### Social Content
```
POST /ai/social-content
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "A fitness coaching brand..."
}
```

### Competitor Analysis
```
POST /ai/competitor-analysis
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "An online project management tool..."
}
```

### Marketing Campaign
```
POST /ai/marketing-campaign
Authorization: Bearer <token>
Content-Type: application/json

{
  "prompt": "Launch campaign for AI resume builder..."
}
```

### Get Templates
```
GET /ai/templates
Authorization: Bearer <token>
```

### Get History
```
GET /ai/history?page=1&limit=10&type=product-generator
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": [...],
  "pagination": {
    "total": 50,
    "page": 1,
    "pages": 5
  }
}
```

### Delete History Item
```
DELETE /ai/history/:id
Authorization: Bearer <token>
```

---

## Payment Endpoints

### Create Stripe Checkout
```
POST /payments/stripe/create-checkout
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro" // or "enterprise"
}

Response:
{
  "success": true,
  "sessionId": "cs_test_...",
  "url": "https://checkout.stripe.com/pay/..."
}
```

### Create Stripe Portal Session
```
POST /payments/stripe/portal
Authorization: Bearer <token>

Response:
{
  "success": true,
  "url": "https://billing.stripe.com/p/..."
}
```

### Submit JazzCash Payment
```
POST /payments/jazzcash/submit
Authorization: Bearer <token>
Content-Type: application/json

{
  "transactionId": "JC123456789",
  "plan": "pro",
  "proofImage": "https://..." // optional
}
```

### Get Payment History
```
GET /payments/history
Authorization: Bearer <token>
```

### Get Pricing
```
GET /payments/pricing
// Public endpoint

Response:
{
  "success": true,
  "data": {
    "plans": [
      {
        "name": "Free",
        "price": 0,
        "period": "forever",
        "features": ["5 AI requests per day", ...]
      },
      ...
    ]
  }
}
```

---

## Affiliate Endpoints

### Get Affiliate Dashboard
```
GET /affiliates/dashboard
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "referralLink": "https://yoursaas.com/register?ref=REFJOHNabc123",
    "referralCode": "REFJOHNabc123",
    "totalReferrals": 10,
    "convertedReferrals": 3,
    "earnings": 15,
    "referrals": [...]
  }
}
```

### Get Leaderboard
```
GET /affiliates/leaderboard
// Public endpoint
```

### Get Affiliate Stats
```
GET /affiliates/stats
Authorization: Bearer <token>
```

---

## Admin Endpoints

All admin endpoints require:
- Valid JWT token
- User role must be "admin"

### Get Dashboard Stats
```
GET /admin/stats
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "users": {
      "total": 150,
      "active": 145,
      "banned": 5,
      "byPlan": { "free": 100, "pro": 40, "enterprise": 10 }
    },
    "revenue": {
      "total": 5000,
      "stripe": 4500,
      "jazzcash": 500
    },
    "ai": {
      "totalRequests": 5000,
      "todayRequests": 150
    },
    "recentUsers": [...],
    "topAffiliates": [...]
  }
}
```

### Get All Users
```
GET /admin/users?page=1&limit=20&search=john&plan=pro&role=user
Authorization: Bearer <token>
```

### Ban/Unban User
```
PUT /admin/users/:id/ban
Authorization: Bearer <token>
```

### Change User Role
```
PUT /admin/users/:id/role
Authorization: Bearer <token>
Content-Type: application/json

{
  "role": "admin" // or "user"
}
```

### Change User Plan
```
PUT /admin/users/:id/plan
Authorization: Bearer <token>
Content-Type: application/json

{
  "plan": "pro" // "free", "pro", "enterprise"
}
```

### Delete User
```
DELETE /admin/users/:id
Authorization: Bearer <token>
```

### Get All Payments
```
GET /admin/payments?page=1&limit=20&status=pending&method=jazzcash
Authorization: Bearer <token>
```

### Approve JazzCash Payment
```
PUT /admin/payments/:id/approve
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Approved - verified transaction"
}
```

### Reject JazzCash Payment
```
PUT /admin/payments/:id/reject
Authorization: Bearer <token>
Content-Type: application/json

{
  "notes": "Rejected - invalid transaction ID"
}
```

### Get AI Requests
```
GET /admin/ai-requests?page=1&limit=20&type=product-generator
Authorization: Bearer <token>
```

### Get Affiliates
```
GET /admin/affiliates
Authorization: Bearer <token>
```

### Get Activity Logs
```
GET /admin/logs
Authorization: Bearer <token>
```

### Get Analytics
```
GET /admin/analytics
Authorization: Bearer <token>

Response:
{
  "success": true,
  "data": {
    "aiRequestsByType": [...],
    "dailySignups": [...],
    "dailyRevenue": [...]
  }
}
```

---

## WhatsApp Bot Endpoints

### Webhook Verification
```
GET /whatsapp/webhook?hub.mode=subscribe&hub.verify_token=ai-saas-verify-token&hub.challenge=CHALLENGE_ACCEPTED
```

### Webhook Handler
```
POST /whatsapp/webhook
Content-Type: application/json

// WhatsApp Business API payload
```

---

## Error Responses

### 400 Bad Request
```json
{
  "success": false,
  "errors": [
    {
      "type": "field",
      "msg": "Valid email is required",
      "path": "email"
    }
  ]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Not authorized, no token"
}
```

### 403 Forbidden
```json
{
  "success": false,
  "message": "Not authorized as admin"
}
```

### 429 Rate Limit / Usage Exceeded
```json
{
  "success": false,
  "message": "Daily limit reached. Upgrade to Pro for unlimited access.",
  "limit": 5,
  "used": 5
}
```

### 500 Server Error
```json
{
  "success": false,
  "message": "Internal Server Error"
}
```

---

## Rate Limiting

- 100 requests per 15 minutes per IP on all endpoints
- Free users: 5 AI requests per day
- Pro/Enterprise: Unlimited AI requests

---

## Webhooks

### Stripe Webhook
URL: `/payments/stripe/webhook`
Events:
- `checkout.session.completed`
- `invoice.payment_succeeded`
- `customer.subscription.deleted`

### WhatsApp Webhook
URL: `/whatsapp/webhook`
Method: GET (verification) and POST (messages)
