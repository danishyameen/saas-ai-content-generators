# Genifai - AI-Powered Content Generation Platform

![Genifai Logo](frontend/public/pwa-512x512.png)

## 🚀 Overview

Genifai is a comprehensive AI-powered SaaS platform that helps businesses and individuals generate high-quality content using advanced artificial intelligence. From product descriptions to marketing campaigns, Genifai streamlines content creation with powerful AI tools.

**Live Platform Features:**
- 🎯 10 Free AI Requests for Every New User
- 🎨 AI Logo Generation with 4 Options (PNG/JPG Download)
- 🖼️ AI Image Generation for Products (PNG/JPG Download)
- 📥 Dual Format Downloads - All images and logos in PNG or JPG
- 📱 Progressive Web App (Installable on Any Device)
- ✨ Beautiful Framer Motion Animations Throughout
- 🔐 Secure Authentication with OTP Email System
- 💳 Multiple Payment Options (Stripe + JazzCash)
- 👑 Comprehensive Admin Dashboard
- 🤝 Affiliate Program with Earnings Tracking

## ✨ Features

### 🎯 AI Content Generators
- **Product Description Generator** - Create compelling, conversion-optimized product descriptions with AI-generated images
- **SEO Content Generator** - Generate SEO-optimized content for better search rankings
- **Ads Generator** - Create high-converting advertisement copy
- **Business Ideas Generator** - Get innovative business concepts and strategies
- **Social Media Content** - Generate engaging social media posts
- **Competitor Analysis** - Analyze your competition with AI insights
- **Marketing Campaign** - Plan and create comprehensive marketing campaigns

### 💎 Subscription Plans
- **Free Plan** - 10 AI requests per day (Get free 10 AI requests)
- **Pro Plan** - 100 AI requests per day for 30 days ($20/month)
- **Enterprise Plan** - Unlimited AI requests for 90 days ($50/3 months)

### 🎨 Advanced Features
- **AI Logo Generation** - Generate 4 unique logo options based on your brand name
  - Download in PNG format (blue button)
  - Download in JPG format (green button)
  - Hover over logo to reveal download options
  - Automatic file naming with brand name
- **Image Generation/Upload** - AI-powered product image generation
  - Generate 4 high-quality product images
  - Download each image in PNG or JPG format
  - Dual download buttons appear on hover
  - Manual image upload option available
- **Company Branding** - Complete branding management system
  - Upload or generate company logo
  - Manage company details (name, address, website, phone)
  - Logo preview with download options
- **Request History** - Track all your AI generation history
- **Affiliate Program** - Earn commissions by referring new users
- **Admin Dashboard** - Comprehensive admin panel for platform management
- **Download Options** - All generated content downloadable
  - Images: PNG/JPG formats
  - Logos: PNG/JPG formats
  - Text content: TXT format
  - Color-coded buttons for easy identification

### 🔐 Security & Authentication
- Secure user authentication with JWT tokens
- Password reset via OTP (One-Time Password) sent to email
- Encrypted password storage with bcrypt
- Role-based access control (User/Admin)

### 📱 Progressive Web App (PWA)
- Install as a native app on any device
- Offline support with service workers
- Home screen installation prompt
- Fast loading and responsive design

### 💳 Payment Integration
- Stripe payment gateway integration
- JazzCash payment support (Pakistan)
- Manual payment approval by admin
- Automatic plan activation after approval

### 📊 Admin Panel Features
- User management (view, ban, upgrade users)
- Payment approval system
- AI request monitoring
- Affiliate management
- Activity logs
- Revenue tracking
- Platform statistics and analytics

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Beautiful animations
- **React Router** - Client-side routing
- **Zustand** - State management
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **Bcrypt** - Password hashing
- **Nodemailer** - Email sending
- **Resend API** - Email service for production
- **OpenAI API** - AI content generation
- **Unsplash API** - Image generation fallback
- **Stripe** - Payment processing

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn package manager

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the backend directory with the following variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
UNSPLASH_ACCESS_KEY=your_unsplash_access_key
STRIPE_SECRET_KEY=your_stripe_secret_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
RESEND_API_KEY=your_resend_api_key
FRONTEND_URL=http://localhost:5173
```

4. Start the backend server:
```bash
npm start
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the frontend directory:
```env
VITE_API_URL=http://localhost:5000/api
```

4. Start the development server:
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

### Building for Production

#### Frontend Build
```bash
cd frontend
npm run build
```

#### Backend Production
```bash
cd backend
npm start
```

## 🚀 Deployment

### Live Production URLs

**Frontend (Genifai Platform):**
- 🌐 **Main URL**: https://genifai-five.vercel.app
- 🔗 Alternative: https://genifai-30z2a98be-danish-yameens-projects.vercel.app

**Backend (API Server):**
- 🌐 **Main URL**: https://backend-three-flax-82.vercel.app
- 🔗 Alternative: https://backend-5lcnjhljx-danish-yameens-projects.vercel.app
- 📡 API Endpoint: https://backend-three-flax-82.vercel.app/api

**Admin Login:**
- 📧 Email: danishyameennew@gmail.com
- 🔑 Password: karachi33@

### Vercel Deployment (Recommended)

#### Frontend Deployment

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Deploy frontend:
```bash
cd frontend
vercel --prod
```

3. Set environment variables in Vercel:
```bash
vercel env add VITE_API_URL production
# Enter: https://backend-three-flax-82.vercel.app/api
```

#### Backend Deployment

1. Deploy backend:
```bash
cd backend
vercel --prod
```

2. Set environment variables in Vercel dashboard or CLI:
   - `MONGODB_URI` - MongoDB Atlas connection string
   - `JWT_SECRET` - Strong secret key
   - `GROQ_API_KEY` - Groq API key for AI content generation
   - `RESEND_API_KEY` - **REQUIRED** - Resend API key for email (re_R2jUoYSz_6q4DQjpe17wpYpmfP6gsSaK2)
   - `FRONTEND_URL` - Your frontend URL (https://genifai-five.vercel.app)
   - `STRIPE_SECRET_KEY` - Stripe secret key (optional)
   - `OPENAI_API_KEY` - OpenAI API key (optional, for DALL-E)
   - `UNSPLASH_ACCESS_KEY` - Unsplash API key (optional)

### Backend Deployment Options

#### Option 1: Vercel (Serverless) ✅ Currently Deployed
- Deploy backend as serverless functions
- Configure environment variables in Vercel dashboard
- **IMPORTANT**: Add `RESEND_API_KEY` for email functionality

#### Option 2: Railway/Render/Heroku
- Connect your GitHub repository
- Set environment variables
- Deploy with automatic builds

### Critical Environment Variables

**Must Have for Production:**
- ✅ `MONGODB_URI` - Database connection
- ✅ `JWT_SECRET` - Authentication security
- ✅ `RESEND_API_KEY` - **Required for OTP emails on Vercel**
- ✅ `GROQ_API_KEY` - AI content generation
- ✅ `FRONTEND_URL` - CORS configuration

**Optional but Recommended:**
- `OPENAI_API_KEY` - For DALL-E image generation
- `UNSPLASH_ACCESS_KEY` - Image generation fallback
- `STRIPE_SECRET_KEY` - Payment processing

### Troubleshooting

**"Failed to send OTP" on Vercel:**
- Cause: Missing `RESEND_API_KEY` environment variable
- Solution: Add Resend API key to Vercel environment variables
- Get key from: https://resend.com

**Admin Login Issues:**
- Run `node backend/fix-admin.js` to recreate admin account
- Credentials: danishyameennew@gmail.com / karachi33@

### Environment Variables for Production

**Backend (Vercel/Railway/Render):**
- `MONGODB_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - Strong secret key
- `OPENAI_API_KEY` - OpenAI API key (optional, for DALL-E image generation)
- `GROQ_API_KEY` - Groq API key for AI content generation
- `UNSPLASH_ACCESS_KEY` - Unsplash API key for image fallback
- `STRIPE_SECRET_KEY` - Stripe secret key
- `RESEND_API_KEY` - **REQUIRED for production** - Resend API key for email (Vercel blocks SMTP)
- `EMAIL_USER` - Gmail address (for localhost only)
- `EMAIL_PASS` - Gmail app password (for localhost only)
- `FRONTEND_URL` - Your frontend URL

**Important for Vercel Deployment:**
- ⚠️ **RESEND_API_KEY is required** for OTP emails to work on Vercel
- Get free API key from https://resend.com
- Without it, password reset OTP will fail with "Failed to send OTP"
- Localhost uses Gmail SMTP (EMAIL_USER/EMAIL_PASS) which works fine

**Frontend (Vercel):**
- `VITE_API_URL` - Your backend API URL

## 📖 Usage Guide

### For Users

#### 1. Registration & Login
- Visit the homepage and click "Get Started"
- Register with your name, email, and password
- Login with your credentials
- Get 10 free AI requests immediately

#### 2. Using AI Generators
- Navigate to any generator from the dashboard sidebar
- Enter your prompt or use the example prompt
- Click "Generate Content" to create AI-powered content
- Copy or download the generated content as TXT file

#### 3. Product Generator with Images
- Generate product description
- Choose to upload your own image or generate one with AI
- AI will generate 4 high-quality image options
- **Hover over any image** to see download buttons:
  - **Blue button** = Download as PNG
  - **Green button** = Download as JPG
- Click your preferred format to download

#### 4. Logo Generation
- Go to Settings page
- Enter your company/brand name
- Click "AI Generate" under Brand Logo section
- Select from 4 AI-generated logo options
- **Hover over selected logo** to see download buttons:
  - **Blue button** = Download as PNG
  - **Green button** = Download as JPG
- Save your settings to keep the logo

#### 5. Upgrading Your Plan
- Go to Billing page
- Choose Pro (100 requests/day) or Enterprise (Unlimited) plan
- Complete payment via Stripe or JazzCash
- Wait for admin approval (24-48 hours)
- Your plan will be activated automatically

#### 6. Affiliate Program
- Go to Affiliate Dashboard
- Copy your unique referral code
- Share with friends and earn commissions
- Track your referrals and earnings in real-time

### For Admins

#### 1. Accessing Admin Panel
- Login with admin credentials
- Click "Admin Panel" from user menu
- Access admin-only features

#### 2. Managing Users
- View all registered users
- Ban/unban users
- Manually upgrade user plans
- View user activity and statistics

#### 3. Payment Approval
- Go to Payments section
- Review pending payments
- Approve or reject payment requests
- System automatically activates plans upon approval

#### 4. Monitoring Platform
- View platform statistics
- Track AI request usage
- Monitor revenue and growth
- Review activity logs

## 🎨 Features in Detail

### AI Content Generation
All generators use OpenAI's GPT models to create high-quality, contextual content based on your prompts. The system includes:
- Smart prompt engineering for optimal results
- Usage tracking and limits based on plan
- Request history for all generations
- Copy and download functionality
- Real-time generation with loading states

### Image Generation System
- **Primary**: OpenAI DALL-E 3 for AI image generation
- **Fallback**: Unsplash API for high-quality stock images
- **Upload**: Manual image upload support
- **Multiple Options**: Generate 4 images per request
- **Download Formats**: PNG and JPG download options for all images
- **Hover Controls**: Dual download buttons appear on image hover

### Logo Generation System
- **AI-Powered**: Generate 4 unique logo options based on brand name
- **Multiple Sources**: OpenAI DALL-E 3 + Unsplash API
- **Download Formats**: PNG and JPG download options
- **Interactive Selection**: Click to select from 4 generated options
- **Hover Controls**: Dual download buttons (PNG - blue, JPG - green)
- **Error Handling**: Robust fallback system ensures logos always generate

### Email System
- **Production**: Resend API (works on Vercel)
- **Development**: Nodemailer with Gmail SMTP
- **OTP System**: Secure 6-digit OTP for password reset
- **Templates**: Professional HTML email templates
- **Important**: Vercel blocks SMTP ports (465/587), so Resend API is required for production

**Setting up Resend for Production:**
1. Sign up at https://resend.com (free tier available)
2. Get your API key from dashboard
3. Add `RESEND_API_KEY` to Vercel environment variables
4. Redeploy your application
5. OTP emails will now work on production

### Payment Processing
- **Stripe**: International credit/debit cards
- **JazzCash**: Pakistan mobile wallet payments
- **Manual Approval**: Admin reviews and approves payments
- **Automatic Activation**: Plans activate after approval

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt (10 salt rounds)
- HTTP-only cookies for token storage
- CORS protection
- Input validation and sanitization
- Rate limiting on API endpoints
- Secure password reset with OTP expiration
- Role-based access control

## 📱 PWA Features

- **Installable**: Add to home screen on mobile and desktop
- **Offline Support**: Service worker caching
- **Fast Loading**: Optimized assets and lazy loading
- **Responsive**: Works on all screen sizes
- **App-like Experience**: Full-screen mode, splash screen

## 🎯 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/forgot-password` - Request password reset OTP
- `POST /api/auth/reset-password` - Reset password with OTP
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

### AI Generation
- `POST /api/ai/generate-product` - Generate product description
- `POST /api/ai/generate-seo` - Generate SEO content
- `POST /api/ai/generate-ads` - Generate ad copy
- `POST /api/ai/generate-business-ideas` - Generate business ideas
- `POST /api/ai/generate-social` - Generate social media content
- `POST /api/ai/generate-competitor` - Generate competitor analysis
- `POST /api/ai/generate-campaign` - Generate marketing campaign
- `POST /api/ai/generate-logo` - Generate brand logos
- `POST /api/ai/generate-images` - Generate product images
- `GET /api/ai/history` - Get generation history

### Payments
- `POST /api/payments/create-checkout` - Create Stripe checkout
- `POST /api/payments/jazzcash` - Submit JazzCash payment
- `GET /api/payments/my-payments` - Get user payments

### Admin
- `GET /api/admin/stats` - Get platform statistics
- `GET /api/admin/users` - Get all users
- `PUT /api/admin/users/:id/ban` - Ban/unban user
- `PUT /api/admin/users/:id/upgrade` - Upgrade user plan
- `GET /api/admin/payments` - Get all payments
- `PUT /api/admin/payments/:id/approve` - Approve payment
- `GET /api/admin/ai-requests` - Get all AI requests
- `GET /api/admin/affiliates` - Get affiliate data

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🔐 Admin Account

### Default Admin Credentials:
```
Email: danishyameennew@gmail.com
Password: karachi33@
```

**Production Email Service:**
- ✅ Resend API Key configured
- ✅ OTP emails working on Vercel
- ✅ Password reset functional

**Admin Features:**
- ✅ Unlimited AI requests (forever, no expiration)
- ✅ No daily limits
- ✅ Full admin panel access
- ✅ User management (ban/unban, upgrade plans)
- ✅ Payment approval system
- ✅ Platform statistics and analytics
- ✅ Revenue tracking
- ✅ Activity logs monitoring

**How to Access Admin Panel:**
1. Login with admin credentials
2. Click profile icon (top right)
3. Select "Admin Panel" from dropdown
4. Access all admin features

**Note:** Admin account has permanent unlimited access to all platform features.

## 📞 Contact & Support

- **Email**: support@genifai.com
- **Phone**: +92 313 2942320
- **Address**: Bhorapir Aslam Road, Karachi South, Sindh, Pakistan
- **Business Hours**: Monday-Friday: 9:00 AM - 6:00 PM (PKT)
- **Website**: [Contact Page](/contact) - Includes contact form and location image

### Quick Links
- [Privacy Policy](/privacy) - Comprehensive privacy and data protection information
- [Terms of Service](/terms) - Detailed terms and conditions
- [Contact Us](/contact) - Get in touch with our team

**Footer Navigation:**
All pages include footer links to Privacy Policy, Terms of Service, and Contact page for easy access.

## 🙏 Acknowledgments

- OpenAI for GPT and DALL-E APIs
- Unsplash for image API
- Stripe for payment processing
- Resend for email delivery
- All open-source libraries used in this project

## 📝 Changelog

### Version 1.0.0 (April 2026)
- Initial release
- 7 AI content generators (Product, SEO, Ads, Business Ideas, Social, Competitor, Campaign)
- User authentication and authorization with JWT
- Subscription plans (Free: 10 requests/day, Pro: 100 requests/day, Enterprise: Unlimited)
- Payment integration (Stripe, JazzCash) with manual approval workflow
- Admin dashboard with full platform management
- Affiliate program with referral tracking and earnings
- PWA support with offline capabilities and home screen installation
- Email OTP system with Resend API for production
- Logo generation (4 AI-generated options) with PNG/JPG download
- Image generation with OpenAI DALL-E and Unsplash fallback
- **Download Options**: All images and logos can be downloaded in PNG or JPG format
- Beautiful animations with Framer Motion throughout all pages
- Privacy Policy, Terms of Service, and Contact pages with working footer links
- Contact page with business information and location image
- Responsive design for all devices (mobile, tablet, desktop)
- Admin account with unlimited access forever
- Request history and usage tracking with daily reset
- Company branding management with logo upload/generation
- Enhanced error handling and user feedback with toast notifications
- Secure password reset with OTP expiration (10 minutes)
- Role-based access control (User/Admin)
- Usage limits enforcement based on subscription plan

---

**Built with ❤️ by the Genifai Team**

For more information, visit our website or contact our support team.
