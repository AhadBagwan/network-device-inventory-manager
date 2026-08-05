import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  HiUserAdd, 
  HiUsers, 
  HiSearch, 
  HiPencil, 
  HiTrash, 
  HiShieldCheck, 
  HiOutlineUser,
  HiCheckCircle,
  HiBan
} from 'react-icons/hi';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { getUsers, createUser, updateUser, deleteUser } from '../services/api';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'NOC Operator',
    password: '',
    status: 'Active'
  });

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getUsers();
      setUsers(data);
    } catch (err) {
      toast.error('Failed to load user roster.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleOpenAddModal = () => {
    setFormData({
      full_name: '',
      email: '',
      role: 'NOC Operator',
      password: '',
      status: 'Active'
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEditModal = (user) => {
    setSelectedUser(user);
    setFormData({
      full_name: user.full_name,
      email: user.email,
      role: user.role,
      password: '',
      status: user.status
    });
    setIsEditModalOpen(true);
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email || !formData.password) {
      toast.error('Name, email, and password are required.');
      return;
    }

    try {
      await createUser(formData);
      toast.success(`User ${formData.full_name} created successfully!`);
      setIsAddModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create user.');
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, formData);
      toast.success(`User ${formData.full_name} updated successfully!`);
      setIsEditModalOpen(false);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user.');
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to remove user "${user.full_name}"?`)) return;

    try {
      await deleteUser(user.id);
      toast.success(`User ${user.full_name} removed.`);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete user.');
    }
  };

  const filteredUsers = users.filter((u) =>
    u.full_name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors flex">
      <Toaster position="top-right" />
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        <Navbar />

        <main className="flex-1 p-4 lg:p-8 space-y-6 overflow-y-auto">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <HiUsers className="w-7 h-7 text-[var(--accent-color)]" />
                <h1 className="text-2xl font-extrabold text-[var(--text-main)]">
                  NOC Operators & User Roster
                </h1>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono mt-1">
                Manage team member access, roles, and administrative credentials
              </p>
            </div>

            <button
              onClick={handleOpenAddModal}
              className="px-4 py-2.5 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all flex items-center justify-center gap-2 shrink-0"
            >
              <HiUserAdd className="w-4 h-4" />
              <span>Add New Operator</span>
            </button>
          </div>

          {/* Search & Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 relative">
              <HiSearch className="absolute left-3.5 top-3.5 w-4 h-4 text-[var(--text-muted)]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search team members by name, email, or role (e.g. John, Admin)..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] text-[var(--text-main)] font-mono text-xs focus:outline-none focus:border-[var(--accent-color)] shadow-sm"
              />
            </div>

            <div className="noc-card p-3 rounded-xl flex items-center justify-between font-mono text-xs">
              <span className="text-[var(--text-muted)]">Total Team Roster:</span>
              <span className="font-bold text-[var(--accent-color)] text-sm">{users.length} Users</span>
            </div>
          </div>

          {/* User Roster Table */}
          <div className="noc-card rounded-2xl border border-[var(--border-color)] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="bg-[var(--bg-hover)]/40 border-b border-[var(--border-color)] text-[var(--text-muted)] uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="px-5 py-3.5">Operator</th>
                    <th className="px-5 py-3.5">Email Address</th>
                    <th className="px-5 py-3.5">Role</th>
                    <th className="px-5 py-3.5">Status</th>
                    <th className="px-5 py-3.5">Registered</th>
                    <th className="px-5 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {loading ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-[var(--text-muted)]">
                        Loading team roster...
                      </td>
                    </tr>
                  ) : filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-8 text-center text-[var(--text-muted)]">
                        No team members matching search criteria.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((u) => {
                      const initials = u.full_name
                        ? u.full_name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2)
                        : 'OP';

                      return (
                        <tr key={u.id} className="hover:bg-[var(--bg-hover)]/40 transition-colors">
                          <td className="px-5 py-4 font-semibold text-[var(--text-main)]">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/30 text-[var(--accent-color)] font-bold flex items-center justify-center shrink-0">
                                {initials}
                              </div>
                              <span>{u.full_name}</span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-[var(--text-muted)]">{u.email}</td>
                          <td className="px-5 py-4">
                            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-bold text-[10px]">
                              {u.role}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            {u.status === 'Active' ? (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px]">
                                <HiCheckCircle className="w-3 h-3" />
                                <span>Active</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[10px]">
                                <HiBan className="w-3 h-3" />
                                <span>Suspended</span>
                              </span>
                            )}
                          </td>
                          <td className="px-5 py-4 text-[var(--text-muted)]">
                            {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                          </td>
                          <td className="px-5 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                onClick={() => handleOpenEditModal(u)}
                                className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--accent-color)] transition-colors"
                                title="Edit Operator"
                              >
                                <HiPencil className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUser(u)}
                                className="p-1.5 rounded-lg border border-[var(--border-color)] hover:bg-rose-500/10 text-[var(--text-muted)] hover:text-rose-400 transition-colors"
                                title="Remove User"
                              >
                                <HiTrash className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      {/* CREATE USER MODAL */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md noc-card p-6 rounded-2xl space-y-4 border border-[var(--border-color)] shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <HiUserAdd className="w-5 h-5 text-[var(--accent-color)]" />
              <span>Add New Team Member</span>
            </h3>

            <form onSubmit={handleCreateSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[var(--text-muted)] mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="e.g. John Doe"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1">Email Address</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john.doe@netpulse.noc"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1">Role / Job Title</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                >
                  <option value="NOC Operator">NOC Operator</option>
                  <option value="Network Engineer">Network Engineer</option>
                  <option value="Cyber Security Specialist">Cyber Security Specialist</option>
                  <option value="NOC Operations Lead">NOC Operations Lead</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1">Password</label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Admin@123"
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold"
                >
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER MODAL */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md noc-card p-6 rounded-2xl space-y-4 border border-[var(--border-color)] shadow-2xl">
            <h3 className="text-lg font-bold text-[var(--text-main)] flex items-center gap-2">
              <HiPencil className="w-5 h-5 text-[var(--accent-color)]" />
              <span>Edit Team Member</span>
            </h3>

            <form onSubmit={handleUpdateSubmit} className="space-y-3 text-xs font-mono">
              <div>
                <label className="block text-[var(--text-muted)] mb-1">Full Name</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1">Role / Job Title</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                >
                  <option value="NOC Operator">NOC Operator</option>
                  <option value="Network Engineer">Network Engineer</option>
                  <option value="Cyber Security Specialist">Cyber Security Specialist</option>
                  <option value="NOC Operations Lead">NOC Operations Lead</option>
                  <option value="Super Admin">Super Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-[var(--text-muted)] mb-1">Account Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
