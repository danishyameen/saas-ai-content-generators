import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Sparkles,
  Zap,
  Shield,
  TrendingUp,
  Check,
  ArrowRight,
  Star,
  Package,
  Search,
  Megaphone,
  Lightbulb,
  Share2,
  BarChart3,
} from 'lucide-react';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-dark-950 overflow-x-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-950/80 backdrop-blur-md border-b border-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 group cursor-pointer"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-white font-bold text-lg group-hover:text-primary-400 transition-colors">Genifai</span>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="hidden md:flex items-center gap-6"
            >
              <a href="#features" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Features</a>
              <a href="#pricing" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Pricing</a>
              <a href="#testimonials" className="text-dark-300 hover:text-white transition-colors text-sm font-medium">Testimonials</a>
              <Link to="/login" className="text-dark-300 hover:text-white transition-colors text-sm font-medium mr-2">Login</Link>
              <Link to="/register" className="btn-primary py-2 px-4 text-sm shadow-lg shadow-primary-500/20">Get Started</Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-40 pb-20 px-4 relative">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px] -z-10"></div>
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary-600/20 rounded-full mb-8 border border-primary-500/20 shadow-inner"
          >
            <Zap size={16} className="text-primary-400 animate-pulse" />
            <span className="text-primary-400 text-sm font-semibold tracking-wide uppercase">Powered by Genifai AI</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[1.1] tracking-tight"
          >
            Build Your Business
            <br />
            <span className="gradient-text"> with AI Power</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-dark-300 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Generate high-converting product descriptions, SEO content, ads, and business ideas in seconds.
            Stop wasting hours. Start building faster with <span className="text-white font-semibold">Genifai</span>.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-5 justify-center items-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/register" className="btn-primary text-lg px-10 py-5 shadow-2xl shadow-primary-500/40 flex items-center gap-3">
                Start Free Trial
                <ArrowRight size={22} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="#features" className="btn-outline text-lg px-10 py-5 bg-dark-900/50 backdrop-blur-sm">
                See Features
              </a>
            </motion.div>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-dark-500 mt-8 text-sm font-medium tracking-wide"
          >
            No credit card required • Get free 10 AI requests
          </motion.p>
        </div>
      </section>

      {/* Stats/Social Proof */}
      <section className="py-12 border-y border-dark-800 bg-dark-950/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { label: 'Users', value: '10k+' },
              { label: 'Requests', value: '1M+' },
              { label: 'Uptime', value: '99.9%' },
              { label: 'Accuracy', value: '98%' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-dark-500 font-medium uppercase tracking-widest">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem → Solution */}
      <section className="py-24 px-4 bg-dark-900/30 relative">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card border-red-500/20 bg-dark-900/80 backdrop-blur-sm p-8"
            >
              <h3 className="text-2xl font-bold text-red-400 mb-6 flex items-center gap-2">
                <span className="p-2 bg-red-400/10 rounded-lg">❌</span> The Problem
              </h3>
              <ul className="space-y-4 text-dark-300">
                {[
                  'Hiring copywriters costs $500-$5000 per project',
                  'Writing content takes hours or days of manual work',
                  'SEO experts charge $100-$300 per hour',
                  'Marketing agencies require expensive monthly retainers'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <span className="text-red-400/50 mt-1 font-bold">•</span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="card border-green-500/20 bg-dark-900/80 backdrop-blur-sm p-8 shadow-2xl shadow-green-500/5"
            >
              <h3 className="text-2xl font-bold text-green-400 mb-6 flex items-center gap-2">
                <span className="p-2 bg-green-400/10 rounded-lg">✅</span> Our Solution
              </h3>
              <ul className="space-y-4 text-dark-300">
                {[
                  'AI-generated content in seconds for pennies',
                  'Professional quality without the high price tag',
                  'Unlimited content generation on Pro plan',
                  'Start for free and upgrade as you grow'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="p-1 bg-green-400/10 rounded-full mt-0.5">
                      <Check size={14} className="text-green-400" />
                    </div>
                    <span className="font-medium text-white/90">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-4 relative">
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-600/10 rounded-full blur-[100px] -z-10"></div>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Everything You Need to
              <span className="gradient-text"> Succeed Online</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-dark-400 text-lg max-w-2xl mx-auto font-medium"
            >
              Six powerful AI tools in one platform. Generate anything you need to build and grow your business empire.
            </motion.p>
          </div>

          <motion.div
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              { icon: Package, title: 'Product Descriptions', desc: 'Generate compelling, conversion-optimized product descriptions that sell instantly.' },
              { icon: Search, title: 'SEO Content', desc: 'Create search-optimized articles and blog posts that rank on Google page 1.' },
              { icon: Megaphone, title: 'Ad Copy', desc: 'Generate high-converting ads for Facebook, Google, TikTok, and Instagram.' },
              { icon: Lightbulb, title: 'Business Ideas', desc: 'Get innovative business ideas with full market analysis and startup guides.' },
              { icon: Share2, title: 'Social Media', desc: 'Create engaging posts, captions, and scripts for all social platforms.' },
              { icon: BarChart3, title: 'Competitor Intel', desc: 'Analyze competitors and find strategic opportunities to dominate.' },
            ].map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  whileHover={{ y: -10, borderColor: 'rgba(99, 102, 241, 0.4)' }}
                  className="card bg-dark-900/50 backdrop-blur-sm border-dark-800 p-8 group transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-gradient-to-br from-primary-600/20 to-purple-600/20 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon size={28} className="text-primary-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-white group-hover:text-primary-400 transition-colors">{feature.title}</h3>
                  <p className="text-dark-400 leading-relaxed font-medium">{feature.desc}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-24 px-4 bg-dark-900/40 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Simple, Transparent
              <span className="gradient-text"> Pricing</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-dark-400 text-lg font-medium"
            >
              Start free. Upgrade when you're ready to scale.
            </motion.p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              whileHover={{ y: -5 }}
              className="card bg-dark-900 border-dark-800 flex flex-col p-8"
            >
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <div className="mb-8">
                <span className="text-5xl font-black">$0</span>
                <span className="text-dark-500 font-bold">/limited</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {['10 AI requests per day', 'Basic AI generators', 'Community support', 'Standard speed'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-dark-300 text-sm font-medium">
                    <Check size={18} className="text-green-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-outline w-full text-center py-4 font-bold tracking-wide">Get Started</Link>
            </motion.div>

            {/* Pro */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              whileHover={{ y: -10 }}
              className="card border-primary-500 bg-dark-800 p-8 relative shadow-2xl shadow-primary-500/10 flex flex-col"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-gradient-to-r from-primary-600 to-purple-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                Most Popular
              </div>
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <div className="mb-8">
                <span className="text-5xl font-black">$20</span>
                <span className="text-dark-400 font-bold">/month</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  '100 AI requests per day',
                  'All premium generators',
                  'Priority email support',
                  'Marketing campaign tools',
                  'SEO power pack',
                  'Faster generation speed'
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-white text-sm font-bold">
                    <Check size={18} className="text-primary-400 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-primary w-full text-center py-4 font-black tracking-wide shadow-xl shadow-primary-600/30">Go Pro Now</Link>
            </motion.div>

            {/* Enterprise */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -5 }}
              className="card bg-dark-900 border-dark-800 flex flex-col p-8"
            >
              <h3 className="text-xl font-bold mb-2">Business</h3>
              <div className="mb-8">
                <span className="text-5xl font-black">$99</span>
                <span className="text-dark-500 font-bold">/5 months</span>
              </div>
              <ul className="space-y-4 mb-10 flex-1">
                {[
                  'Unlimited AI requests',
                  'Everything in Pro',
                  'API Access (Beta)',
                  'Custom AI models',
                  'Dedicated Manager',
                  'Team workspaces'
                ].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-dark-300 text-sm font-medium">
                    <Check size={18} className="text-purple-500 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Link to="/register" className="btn-outline w-full text-center py-4 font-bold tracking-wide">Contact Sales</Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-black mb-6"
            >
              Loved by
              <span className="gradient-text"> Entrepreneurs</span>
            </motion.h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Sarah K.', role: 'E-commerce Owner', text: 'Genifai saved me thousands in copywriting costs. I generate all my product descriptions in minutes now.' },
              { name: 'Mike R.', role: 'Startup Founder', text: 'The business ideas generator helped me validate 3 startup concepts before committing. Absolute game changer.' },
              { name: 'Lisa T.', role: 'Marketing Manager', text: 'We use this daily for social media. What used to take hours now takes minutes. The ROI is incredible.' },
            ].map((testimonial, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card bg-dark-900/40 p-8 border-dark-800"
              >
                <div className="flex gap-1 mb-6">
                  {[...Array(5)].map((_, j) => (
                    <Star key={j} size={18} className="text-yellow-500 fill-yellow-500" />
                  ))}
                </div>
                <p className="text-dark-200 mb-8 italic font-medium">"{testimonial.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-600/20 rounded-full flex items-center justify-center font-bold text-primary-400">
                    {testimonial.name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-white">{testimonial.name}</p>
                    <p className="text-xs text-dark-500 font-bold uppercase tracking-wider">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-900/30 to-purple-900/30 -z-10"></div>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black mb-8 leading-tight"
          >
            Ready to Build Your
            <br />
            Business with AI?
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-dark-300 text-xl mb-12 max-w-2xl mx-auto font-medium"
          >
            Join thousands of entrepreneurs using Genifai to build faster, smarter, and more profitably.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Link to="/register" className="btn-primary text-xl px-12 py-6 shadow-2xl shadow-primary-600/40 inline-flex items-center gap-3">
              Start Your Free Trial
              <ArrowRight size={24} />
            </Link>
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5 }}
            className="text-dark-500 mt-8 text-sm font-bold uppercase tracking-widest"
          >
            Instant Access • Cancel Anytime
          </motion.p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 border-t border-dark-800 bg-dark-950">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Sparkles className="text-white" size={20} />
              </div>
              <span className="text-white font-black text-xl">Genifai</span>
            </div>
            <div className="flex items-center gap-8 text-dark-400 text-sm font-bold uppercase tracking-widest">
              <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
              <a href="/terms" className="hover:text-white transition-colors">Terms</a>
              <a href="/contact" className="hover:text-white transition-colors">Contact</a>
            </div>
            <p className="text-dark-500 text-sm font-medium italic">© 2026 Genifai. Built with AI for Builders.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
