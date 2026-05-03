import { useState, useEffect } from 'react';
import { Trash2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { aiAPI } from '../../services/api';
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

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterType, setFilterType] = useState('');

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 10 };
      if (filterType) params.type = filterType;
      const { data } = await aiAPI.getHistory(params);
      setHistory(data.data);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load history');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, filterType]);

  const handleDelete = async (id) => {
    try {
      await aiAPI.deleteHistory(id);
      toast.success('Deleted');
      fetchHistory();
    } catch (error) {
      toast.error('Failed to delete');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Generation History</h1>
        <p className="text-dark-400">View and manage your AI-generated content</p>
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

      {/* History List */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : history.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-dark-400">No generation history yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div key={item._id} className="card">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <span className="px-2 py-1 bg-primary-600/20 text-primary-400 text-xs rounded-full">
                    {typeLabels[item.type] || item.type}
                  </span>
                  <p className="text-sm text-dark-400 mt-2">
                    {new Date(item.createdAt).toLocaleDateString()} at{' '}
                    {new Date(item.createdAt).toLocaleTimeString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="text-dark-400 hover:text-red-400"
                >
                  <Trash2 size={18} />
                </button>
              </div>
              <p className="text-sm font-medium mb-2">Prompt: {item.prompt.substring(0, 100)}...</p>
              <details className="text-sm text-dark-300">
                <summary className="cursor-pointer text-primary-400 hover:text-primary-300">
                  View generated content
                </summary>
                <pre className="whitespace-pre-wrap mt-2 text-dark-400 bg-dark-900 p-3 rounded-lg">
                  {item.response}
                </pre>
              </details>
            </div>
          ))}
        </div>
      )}

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
          <span className="text-dark-400">
            Page {page} of {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="btn-secondary disabled:opacity-50"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
