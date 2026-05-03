import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, BarChart3, Crown, Zap } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

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

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getStats()
      .then(({ data }) => setStats(data.data))
      .catch(() => toast.error('Failed to load stats'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={container}
      className="space-y-6"
    >
      <motion.div variants={item}>
        <h1 className="text-2xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-dark-400">Overview of your SaaS platform</p>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: Users, label: 'Total Users', value: stats?.users?.total || 0, color: 'bg-primary-600/20', iconColor: 'text-primary-400' },
          { icon: TrendingUp, label: 'Active Users', value: stats?.users?.active || 0, color: 'bg-green-600/20', iconColor: 'text-green-400' },
          { icon: DollarSign, label: 'Total Revenue', value: `$${stats?.revenue?.total || 0}`, color: 'bg-yellow-600/20', iconColor: 'text-yellow-400' },
          { icon: Zap, label: 'AI Requests', value: stats?.ai?.totalRequests || 0, color: 'bg-purple-600/20', iconColor: 'text-purple-400' }
        ].map((stat, i) => (
          <motion.div key={i} variants={item} className="card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon size={20} className={stat.iconColor} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-sm text-dark-400">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Plan Distribution */}
      <div className="grid md:grid-cols-2 gap-6">
        <motion.div variants={item} className="card">
          <h3 className="font-semibold mb-4">Plan Distribution</h3>
          <div className="space-y-3">
            {[
              { label: 'Free', value: stats?.users?.byPlan?.free || 0, color: 'bg-dark-500' },
              { label: 'Pro', value: stats?.users?.byPlan?.pro || 0, color: 'bg-primary-500' },
              { label: 'Enterprise', value: stats?.users?.byPlan?.enterprise || 0, color: 'bg-purple-500' }
            ].map((plan, i) => (
              <div key={i}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">{plan.label}</span>
                  <span className="text-sm font-medium">{plan.value}</span>
                </div>
                <div className="w-full bg-dark-700 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.users?.total ? (plan.value / stats.users.total) * 100 : 0}%` }}
                    transition={{ duration: 1, delay: i * 0.2 }}
                    className={`${plan.color} h-2 rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div variants={item} className="card">
          <h3 className="font-semibold mb-4">Revenue Breakdown</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-dark-400">Stripe</span>
              <span className="font-medium">${stats?.revenue?.stripe || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-dark-400">JazzCash</span>
              <span className="font-medium">${stats?.revenue?.jazzcash || 0}</span>
            </div>
            <hr className="border-dark-700" />
            <div className="flex justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-bold text-green-400">${stats?.revenue?.total || 0}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Today's Activity */}
      <motion.div variants={item} className="card">
        <h3 className="font-semibold mb-4">Today's Activity</h3>
        <div className="grid grid-cols-2 gap-4">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-dark-900 rounded-lg"
          >
            <Zap size={24} className="text-primary-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.ai?.todayRequests || 0}</p>
            <p className="text-sm text-dark-400">AI Requests Today</p>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="text-center p-4 bg-dark-900 rounded-lg"
          >
            <Users size={24} className="text-green-400 mx-auto mb-2" />
            <p className="text-2xl font-bold">{stats?.recentUsers?.length || 0}</p>
            <p className="text-sm text-dark-400">Recent Signups</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Recent Users */}
      <motion.div variants={item} className="card">
        <h3 className="font-semibold mb-4">Recent Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-700">
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Plan</th>
                <th className="text-left py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentUsers?.slice(0, 5).map((user, i) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="border-b border-dark-800"
                >
                  <td className="py-2">{user.name}</td>
                  <td className="py-2 text-dark-400">{user.email}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      user.plan === 'pro' ? 'bg-primary-600/20 text-primary-400' :
                      user.plan === 'enterprise' ? 'bg-purple-600/20 text-purple-400' :
                      'bg-dark-700 text-dark-300'
                    }`}>
                      {user.plan}
                    </span>
                  </td>
                  <td className="py-2 text-dark-400">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </motion.div>
  );
}
