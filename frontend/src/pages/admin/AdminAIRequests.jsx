import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

const typeLabels = {
  'product-generator': 'Product',
  'seo-generator': 'SEO',
  'ads-generator': 'Ads',
  'business-ideas': 'Business Ideas',
  'social-content': 'Social',
  'competitor-analysis': 'Competitor',
  'marketing-campaign': 'Campaign',
};

export default function AdminAIRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('');

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filterType) params.type = filterType;
      const { data } = await adminAPI.getAIRequests(params);
      setRequests(data.data);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load AI requests');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, [page, filterType]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">AI Requests</h1>
        <p className="text-dark-400">Monitor all AI generation requests</p>
      </div>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilterType('')}
          className={`px-3 py-1 rounded-full text-sm ${
            !filterType ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300 hover:text-white'
          }`}
        >
          All
        </button>
        {Object.entries(typeLabels).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setFilterType(key)}
            className={`px-3 py-1 rounded-full text-sm ${
              filterType === key ? 'bg-primary-600 text-white' : 'bg-dark-700 text-dark-300 hover:text-white'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Requests List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {requests.map((req) => (
              <div key={req._id} className="card">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full">
                      {typeLabels[req.type] || req.type}
                    </span>
                    <p className="text-sm font-medium mt-2">{req.user?.name}</p>
                    <p className="text-xs text-dark-400">{req.user?.email}</p>
                  </div>
                  <div className="text-right text-xs text-dark-400">
                    <p>{new Date(req.createdAt).toLocaleDateString()}</p>
                    <p>{new Date(req.createdAt).toLocaleTimeString()}</p>
                  </div>
                </div>
                <details className="text-sm">
                  <summary className="cursor-pointer text-primary-400 hover:text-primary-300">
                    View details
                  </summary>
                  <div className="mt-2 space-y-2">
                    <div>
                      <p className="text-dark-400 text-xs mb-1">Prompt:</p>
                      <p className="bg-dark-900 p-2 rounded text-xs">{req.prompt}</p>
                    </div>
                    <div>
                      <p className="text-dark-400 text-xs mb-1">Response:</p>
                      <pre className="bg-dark-900 p-2 rounded text-xs whitespace-pre-wrap max-h-48 overflow-y-auto">
                        {req.response}
                      </pre>
                    </div>
                  </div>
                </details>
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
    </div>
  );
}
