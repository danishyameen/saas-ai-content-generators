import { useState, useEffect } from 'react';
import { Copy, TrendingUp, Users, DollarSign, Award } from 'lucide-react';
import { affiliatesAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AffiliateDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      affiliatesAPI.getDashboard(),
      affiliatesAPI.getLeaderboard(),
    ])
      .then(([dashRes, leaderRes]) => {
        setDashboard(dashRes.data.data);
        setLeaderboard(leaderRes.data.data);
      })
      .catch(() => toast.error('Failed to load affiliate data'))
      .finally(() => setLoading(false));
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(dashboard?.referralLink);
    toast.success('Referral link copied!');
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Affiliate Program</h1>
        <p className="text-dark-400">Earn money by referring new users</p>
      </div>

      {/* Referral Link */}
      <div className="card">
        <h3 className="font-semibold mb-4">Your Referral Link</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={dashboard?.referralLink || ''}
            readOnly
            className="input flex-1"
          />
          <button onClick={copyReferralLink} className="btn-primary">
            <Copy size={18} className="inline mr-1" />
            Copy
          </button>
        </div>
        <p className="text-sm text-dark-400 mt-2">
          Your referral code: <span className="font-mono text-primary-400">{dashboard?.referralCode}</span>
        </p>
        <p className="text-sm text-dark-400">
          Earn $5 for every user who upgrades to a paid plan through your link.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600/20 rounded-lg flex items-center justify-center">
              <Users size={20} className="text-primary-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboard?.totalReferrals || 0}</p>
              <p className="text-sm text-dark-400">Total Referrals</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
              <TrendingUp size={20} className="text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">{dashboard?.convertedReferrals || 0}</p>
              <p className="text-sm text-dark-400">Converted</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-600/20 rounded-lg flex items-center justify-center">
              <DollarSign size={20} className="text-yellow-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">${dashboard?.earnings || 0}</p>
              <p className="text-sm text-dark-400">Earnings</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
              <Award size={20} className="text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold">
                {dashboard?.totalReferrals > 0
                  ? Math.round((dashboard.convertedReferrals / dashboard.totalReferrals) * 100)
                  : 0}%
              </p>
              <p className="text-sm text-dark-400">Conversion</p>
            </div>
          </div>
        </div>
      </div>

      {/* Referrals List */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Your Referrals</h2>
        {dashboard?.referrals?.length === 0 ? (
          <div className="card text-center py-8 text-dark-400">
            No referrals yet. Share your link to start earning!
          </div>
        ) : (
          <div className="space-y-3">
            {dashboard?.referrals?.map((ref, i) => (
              <div key={i} className="card">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{ref.referredUser?.name || 'Anonymous'}</p>
                    <p className="text-sm text-dark-400">
                      Joined {new Date(ref.joinedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    ref.converted ? 'bg-green-600/20 text-green-400' : 'bg-yellow-600/20 text-yellow-400'
                  }`}>
                    {ref.converted ? 'Converted' : 'Pending'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-semibold mb-4">🏆 Top Affiliates</h2>
        <div className="space-y-3">
          {leaderboard.slice(0, 10).map((affiliate, i) => (
            <div key={i} className={`card ${i === 0 ? 'border-yellow-500/50' : ''}`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                    i === 0 ? 'bg-yellow-500 text-black' :
                    i === 1 ? 'bg-gray-400 text-black' :
                    i === 2 ? 'bg-amber-600 text-black' :
                    'bg-dark-700 text-dark-300'
                  }`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-medium">{affiliate.user?.name || 'Anonymous'}</p>
                    <p className="text-sm text-dark-400">{affiliate.user?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold">{affiliate.totalReferrals} referrals</p>
                  <p className="text-sm text-green-400">${affiliate.earnings} earned</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
