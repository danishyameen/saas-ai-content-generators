import { useState, useEffect } from 'react';
import { Loader2, Award } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminAffiliates() {
  const [affiliates, setAffiliates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getAffiliates()
      .then(({ data }) => setAffiliates(data.data))
      .catch(() => toast.error('Failed to load affiliates'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 size={32} className="animate-spin text-primary-400" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Affiliate Management</h1>
        <p className="text-dark-400">View all affiliate accounts and performance</p>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-dark-700">
              <th className="text-left py-3 px-2">#</th>
              <th className="text-left py-3 px-2">User</th>
              <th className="text-left py-3 px-2">Referral Code</th>
              <th className="text-left py-3 px-2">Total Referrals</th>
              <th className="text-left py-3 px-2">Converted</th>
              <th className="text-left py-3 px-2">Earnings</th>
            </tr>
          </thead>
          <tbody>
            {affiliates.map((affiliate, i) => (
              <tr key={affiliate._id} className="border-b border-dark-800">
                <td className="py-3 px-2">
                  {i < 3 && <Award size={16} className={`inline mr-1 ${
                    i === 0 ? 'text-yellow-400' : i === 1 ? 'text-gray-400' : 'text-amber-600'
                  }`} />}
                  {i + 1}
                </td>
                <td className="py-3 px-2">
                  <div>
                    <p className="font-medium">{affiliate.user?.name}</p>
                    <p className="text-dark-400 text-xs">{affiliate.user?.email}</p>
                  </div>
                </td>
                <td className="py-3 px-2 font-mono text-xs text-primary-400">
                  {affiliate.referralCode}
                </td>
                <td className="py-3 px-2">{affiliate.totalReferrals}</td>
                <td className="py-3 px-2">{affiliate.convertedReferrals}</td>
                <td className="py-3 px-2 text-green-400 font-medium">
                  ${affiliate.earnings}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
