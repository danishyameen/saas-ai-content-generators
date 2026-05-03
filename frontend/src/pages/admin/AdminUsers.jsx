import { useState, useEffect } from 'react';
import { Search, Ban, UserCheck, Trash2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import { adminAPI } from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const [filterPlan, setFilterPlan] = useState('');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (search) params.search = search;
      if (filterPlan) params.plan = filterPlan;
      const { data } = await adminAPI.getUsers(params);
      setUsers(data.data);
      setTotalPages(data.pagination.pages);
    } catch (error) {
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, search, filterPlan]);

  const handleBan = async (id) => {
    try {
      await adminAPI.banUser(id);
      toast.success('User updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure? This will delete the user and all their data.')) return;
    try {
      await adminAPI.deleteUser(id);
      toast.success('User deleted');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to delete user');
    }
  };

  const handlePlanChange = async (id, plan) => {
    try {
      await adminAPI.changeUserPlan(id, { plan });
      toast.success('Plan updated');
      fetchUsers();
    } catch (error) {
      toast.error('Failed to update plan');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">User Management</h1>
        <p className="text-dark-400">Manage all users on the platform</p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users..."
            className="input w-full pl-10"
          />
        </div>
        <select
          value={filterPlan}
          onChange={(e) => setFilterPlan(e.target.value)}
          className="input"
        >
          <option value="">All Plans</option>
          <option value="free">Free</option>
          <option value="pro">Pro</option>
          <option value="enterprise">Enterprise</option>
        </select>
      </div>

      {/* Users Table */}
      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 size={32} className="animate-spin text-primary-400" />
        </div>
      ) : (
        <>
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-dark-700">
                  <th className="text-left py-3 px-2">User</th>
                  <th className="text-left py-3 px-2">Plan</th>
                  <th className="text-left py-3 px-2">Usage</th>
                  <th className="text-left py-3 px-2">Status</th>
                  <th className="text-left py-3 px-2">Joined</th>
                  <th className="text-left py-3 px-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b border-dark-800">
                    <td className="py-3 px-2">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-dark-400 text-xs">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <select
                        value={user.plan}
                        onChange={(e) => handlePlanChange(user._id, e.target.value)}
                        className="bg-dark-700 border border-dark-600 rounded px-2 py-1 text-xs"
                      >
                        <option value="free">Free</option>
                        <option value="pro">Pro</option>
                        <option value="enterprise">Enterprise</option>
                      </select>
                    </td>
                    <td className="py-3 px-2">
                      <span className="text-dark-400">
                        {user.usageToday || 0}/{user.plan === 'free' ? 5 : '∞'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {user.isBanned ? (
                        <span className="px-2 py-1 bg-red-600/20 text-red-400 text-xs rounded-full">
                          Banned
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-green-600/20 text-green-400 text-xs rounded-full">
                          Active
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-2 text-dark-400">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBan(user._id)}
                          className={`p-1 rounded ${
                            user.isBanned ? 'text-green-400 hover:bg-green-600/20' : 'text-red-400 hover:bg-red-600/20'
                          }`}
                          title={user.isBanned ? 'Unban' : 'Ban'}
                        >
                          {user.isBanned ? <UserCheck size={16} /> : <Ban size={16} />}
                        </button>
                        <button
                          onClick={() => handleDelete(user._id)}
                          className="p-1 text-red-400 hover:bg-red-600/20 rounded"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
