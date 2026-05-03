import { useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const actionLabels = {
  ban_user: '🚫 Ban User',
  unban_user: '✅ Unban User',
  change_role: '🔄 Change Role',
  change_plan: '💎 Change Plan',
  delete_user: '🗑️ Delete User',
  approve_payment: '💰 Approve Payment',
  reject_payment: '❌ Reject Payment',
};

export default function AdminLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminAPI.getLogs()
      .then(({ data }) => setLogs(data.data))
      .catch(() => toast.error('Failed to load logs'))
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
        <h1 className="text-2xl font-bold mb-2">Activity Logs</h1>
        <p className="text-dark-400">Track all admin actions</p>
      </div>

      <div className="space-y-3">
        {logs.map((log) => (
          <div key={log._id} className="card">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-dark-700 rounded-lg flex items-center justify-center">
                  <span className="text-lg">
                    {actionLabels[log.action]?.split(' ')[0] || '📝'}
                  </span>
                </div>
                <div>
                  <p className="font-medium">
                    {actionLabels[log.action] || log.action}
                  </p>
                  <p className="text-sm text-dark-400">
                    By: {log.admin?.name} ({log.admin?.email})
                  </p>
                  {log.target && (
                    <p className="text-sm text-dark-400">
                      Target: {log.target}
                    </p>
                  )}
                  {log.details && (
                    <p className="text-xs text-dark-500 mt-1">{log.details}</p>
                  )}
                </div>
              </div>
              <span className="text-xs text-dark-400 whitespace-nowrap">
                {new Date(log.createdAt).toLocaleDateString()}{' '}
                {new Date(log.createdAt).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
