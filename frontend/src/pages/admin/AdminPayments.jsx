import { useState, useEffect } from 'react';
import { Check, X, ChevronLeft, ChevronRight, Loader2, Eye } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterMethod, setFilterMethod] = useState('');
  const [selectedProof, setSelectedProof] = useState(null);

  const fetchPayments = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filterStatus) params.status = filterStatus;
      if (filterMethod) params.method = filterMethod;
      const { data } = await adminAPI.getPayments(params);
      setPayments(data.data);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [page, filterStatus, filterMethod]);

  const handleApprove = async (id) => {
    try {
      await adminAPI.approvePayment(id, { notes: 'Approved' });
      toast.success('Payment approved');
      fetchPayments();
    } catch (error) {
      toast.error('Failed to approve payment');
    }
  };

  const handleReject = async (id) => {
    try {
      await adminAPI.rejectPayment(id, { notes: 'Rejected' });
      toast.success('Payment rejected');
      fetchPayments();
    } catch (error) {
      toast.error('Failed to reject payment');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Payment Management</h1>
        <p className="text-dark-400">View and manage all payments</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="input"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={filterMethod}
          onChange={(e) => setFilterMethod(e.target.value)}
          className="input"
        >
          <option value="">All Methods</option>
          <option value="stripe">Stripe</option>
          <option value="jazzcash">JazzCash</option>
        </select>
      </div>

      {/* Payments List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {payments.map((payment) => (
              <div key={payment._id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <p className="font-medium">
                        {payment.user?.name || 'Unknown'}
                      </p>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        payment.status === 'completed' ? 'bg-green-600/20 text-green-400' :
                        payment.status === 'pending' ? 'bg-yellow-600/20 text-yellow-400' :
                        'bg-red-600/20 text-red-400'
                      }`}>
                        {payment.status}
                      </span>
                    </div>
                    <p className="text-sm text-dark-400">
                      {payment.user?.email} • {payment.method === 'stripe' ? '💳 Stripe' : '📱 JazzCash'} •{' '}
                      {payment.plan} • {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                    {payment.jazzcashTransactionId && (
                      <p className="text-xs text-dark-500 mt-1 flex items-center gap-2">
                        Transaction ID: {payment.jazzcashTransactionId}
                        {payment.jazzcashProofImage && (
                          <button
                            onClick={() => setSelectedProof(payment.jazzcashProofImage)}
                            className="text-primary-400 hover:text-primary-300 flex items-center gap-1"
                          >
                            <Eye size={12} />
                            View Proof
                          </button>
                        )}
                      </p>
                    )}
                    {payment.adminNotes && (
                      <p className="text-xs text-dark-500 mt-1">
                        Notes: {payment.adminNotes}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold">${payment.amount}</p>
                    {payment.status === 'pending' && payment.method === 'jazzcash' && (
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={() => handleApprove(payment._id)}
                          className="btn-primary text-xs px-3 py-1"
                        >
                          <Check size={14} className="inline mr-1" />
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(payment._id)}
                          className="btn-secondary text-xs px-3 py-1 text-red-400"
                        >
                          <X size={14} className="inline mr-1" />
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-secondary disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-dark-400">Page {page} of {totalPages}</span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="btn-secondary disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          )}
        </>
      )}

      {/* Proof Modal */}
      {selectedProof && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-[100] p-4" onClick={() => setSelectedProof(null)}>
          <div className="max-w-4xl max-h-[90vh] overflow-auto">
            <img src={selectedProof} alt="Payment Proof" className="rounded-lg shadow-2xl" />
          </div>
          <button
            onClick={() => setSelectedProof(null)}
            className="absolute top-4 right-4 text-white hover:text-gray-300"
          >
            <X size={32} />
          </button>
        </div>
      )}
    </div>
  );
}
