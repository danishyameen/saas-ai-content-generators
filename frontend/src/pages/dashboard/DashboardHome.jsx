import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Package, Search, Megaphone, Lightbulb, Share2, BarChart3, TrendingUp, Zap, Crown } from 'lucide-react';
import { aiAPI } from '../../services/api';
import useAuthStore from '../../store/authStore';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

const generators = [
  { icon: Package, title: 'Product Generator', desc: 'Generate compelling product descriptions', path: '/dashboard/product', color: 'from-blue-500 to-cyan-500' },
  { icon: Search, title: 'SEO Generator', desc: 'Create SEO-optimized content', path: '/dashboard/seo', color: 'from-green-500 to-emerald-500' },
  { icon: Megaphone, title: 'Ads Generator', desc: 'Generate high-converting ad copy', path: '/dashboard/ads', color: 'from-orange-500 to-red-500' },
  { icon: Lightbulb, title: 'Business Ideas', desc: 'Get innovative business concepts', path: '/dashboard/business-ideas', color: 'from-yellow-500 to-amber-500' },
  { icon: Share2, title: 'Social Content', desc: 'Create social media posts', path: '/dashboard/social', color: 'from-purple-500 to-pink-500' },
  { icon: BarChart3, title: 'Competitor Analysis', desc: 'Analyze your competition', path: '/dashboard/competitor', color: 'from-indigo-500 to-blue-500' },
];

export default function DashboardHome() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState({ used: 0, limit: 10 });

  useEffect(() => {
    // Fetch usage stats
    aiAPI.getHistory({ limit: 1 })
      .then(({ data }) => {
        setStats({
          used: user?.usageToday || 0,
          limit: user?.plan === 'free' ? 10 : (user?.plan === 'pro' ? 100 : 'unlimited'),
        });
      })
      .catch(() => {});
  }, [user]);

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Welcome back, {user?.name}! 👋
        </h1>
        <p className="text-dark-400">What would you like to generate today?</p>
      </motion.div>

      {/* Usage Card */}
      <motion.div variants={item} className="card">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
              <Zap size={20} className="text-primary-400" />
            </div>
            <div>
              <h3 className="font-semibold">Today's Usage</h3>
              <p className="text-sm text-dark-400">
                {stats.used} / {stats.limit} requests
              </p>
            </div>
          </div>
          {user?.plan === 'free' && (
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link to="/dashboard/billing" className="btn-primary text-sm">
                <Crown size={16} className="inline mr-1" />
                Upgrade
              </Link>
            </motion.div>
          )}
        </div>
        <div className="w-full bg-dark-700 rounded-full h-2">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${user?.plan === 'free' ? Math.min((stats.used / 10) * 100, 100) : (user?.plan === 'pro' ? Math.min((stats.used / 100) * 100, 100) : 100)}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full"
          />
        </div>
      </motion.div>

      {/* Generators Grid */}
      <motion.div variants={item}>
        <h2 className="text-xl font-semibold mb-4">Genifai Generators</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {generators.map((gen, i) => {
            const Icon = gen.icon;
            return (
              <motion.div key={i} whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
                <Link
                  to={gen.path}
                  className="card h-full hover:border-primary-500/50 transition-all duration-200 group block"
                >
                  <div className={`w-12 h-12 bg-gradient-to-br ${gen.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon size={24} className="text-white" />
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{gen.title}</h3>
                  <p className="text-sm text-dark-400">{gen.desc}</p>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: TrendingUp, label: 'Total Requests', value: user?.totalAIRequests || 0, color: 'bg-green-600/20', iconColor: 'text-green-400' },
          { icon: Crown, label: 'Current Plan', value: user?.plan, color: 'bg-primary-600/20', iconColor: 'text-primary-400', capitalize: true },
          { icon: Share2, label: 'Referrals', value: user?.referralCount || 0, color: 'bg-purple-600/20', iconColor: 'text-purple-400' },
          { icon: TrendingUp, label: 'Earnings', value: `$${user?.referralEarnings || 0}`, color: 'bg-yellow-600/20', iconColor: 'text-yellow-400' }
        ].map((stat, i) => (
          <motion.div key={i} variants={item} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${stat.capitalize ? 'capitalize' : ''}`}>{stat.value}</p>
                <p className="text-sm text-dark-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
