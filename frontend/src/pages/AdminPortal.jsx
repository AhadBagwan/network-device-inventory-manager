import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { 
  HiLockClosed, 
  HiShieldCheck, 
  HiLogout, 
  HiServer, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiRefresh, 
  HiAdjustments, 
  HiArrowLeft,
  HiCog,
  HiLightningBolt,
  HiDatabase,
  HiExclamation
} from 'react-icons/hi';
import Navbar from '../components/Navbar';
import DeviceModal from '../components/DeviceModal';
import DeleteModal from '../components/DeleteModal';
import AdminLoginModal from '../components/AdminLoginModal';
import { 
  getDevices, 
  getStatistics, 
  addDevice, 
  updateDevice, 
  deleteDevice, 
  resetInventory, 
  clearActivities 
} from '../services/api';

const AdminPortal = () => {
  const { isAdmin, adminUser, logoutAdmin } = useAuth();

  const [devices, setDevices] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('inventory');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(!isAdmin);

  // Modal states for Add/Edit/Delete
  const [modalDevice, setModalDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalApiErrors, setModalApiErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTargetDevice, setDeleteTargetDevice] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [isResetting, setIsResetting] = useState(false);

  const fetchAdminData = useCallback(async () => {
    setLoading(true);
    try {
      const [devicesData, statsData] = await Promise.all([
        getDevices(),
        getStatistics()
      ]);
      setDevices(devicesData);
      setStatistics(statsData);
    } catch (err) {
      toast.error('Failed to load administrative inventory data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchAdminData();
    }
  }, [isAdmin, fetchAdminData]);

  // Handlers
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    setModalApiErrors({});
    try {
      if (modalDevice) {
        await updateDevice(modalDevice.id, formData);
        toast.success(`Admin: Device asset ${formData.hostname} updated.`);
      } else {
        await addDevice(formData);
        toast.success(`Admin: Added new device asset ${formData.hostname}.`);
      }
      setIsModalOpen(false);
      setModalDevice(null);
      fetchAdminData();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setModalApiErrors(err.response.data.errors);
        toast.error('Please fix validation errors.');
      } else {
        toast.error('Admin operation failed.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await deleteDevice(id);
      toast.success('Admin: Device asset deleted.');
      setIsDeleteOpen(false);
      setDeleteTargetDevice(null);
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to delete device asset.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleResetInventory = async () => {
    setIsResetting(true);
    try {
      const res = await resetInventory();
      toast.success(res.message);
      fetchAdminData();
    } catch (err) {
      toast.error('Failed to reset inventory.');
    } finally {
      setIsResetting(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      const res = await clearActivities();
      toast.success(res.message);
    } catch (err) {
      toast.error('Failed to clear activity logs.');
    }
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-main)] text-[var(--text-main)] p-4">
        <Toaster />
        <div className="max-w-md w-full noc-card p-8 rounded-2xl text-center space-y-4">
          <div className="mx-auto w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
            <HiLockClosed className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-[var(--text-main)]">
            Restricted Admin Console
          </h2>
          <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
            This area requires elevated NOC Administrator credentials. Please log in with your Admin username and password.
          </p>
          <div className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] text-[11px] font-mono text-cyan-400">
            Username: <span className="font-bold text-white">Admin</span> | Password: <span className="font-bold text-white">admin@123</span>
          </div>

          <div className="pt-4 flex flex-col gap-2">
            <button
              onClick={() => setIsLoginModalOpen(true)}
              className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <HiShieldCheck className="w-5 h-5" />
              <span>Log In as Admin</span>
            </button>
            <Link
              to="/"
              className="w-full py-2.5 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] font-semibold transition-all flex items-center justify-center gap-2 text-xs"
            >
              <HiArrowLeft className="w-4 h-4" />
              <span>Return to NOC Public Dashboard</span>
            </Link>
          </div>
        </div>

        <AdminLoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onSuccess={() => fetchAdminData()}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)]">
      <Toaster />

      {/* Admin Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[var(--bg-card)]/90 backdrop-blur-md border-b border-[var(--border-color)] px-4 lg:px-6 py-3">
        <div className="flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-main)] hover:bg-[var(--bg-hover)]"
              title="Return to Public Dashboard"
            >
              <HiArrowLeft className="w-5 h-5" />
            </Link>

            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-400">
                <HiShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-lg text-[var(--text-main)]">
                    NOC Master Admin Portal
                  </h1>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                    ADMIN SESSION
                  </span>
                </div>
                <p className="text-xs text-[var(--text-muted)] hidden sm:block">
                  Authenticated User: <span className="text-cyan-400 font-bold">{adminUser}</span> • Elevated Access
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setModalDevice(null);
                setModalApiErrors({});
                setIsModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[var(--accent-color)] text-slate-950 text-xs font-bold shadow-lg shadow-cyan-500/20 transition-all"
            >
              <HiPlus className="w-4 h-4 stroke-[3]" />
              <span>Add Device</span>
            </button>

            <button
              onClick={() => {
                logoutAdmin();
                toast.success('Admin session terminated.');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold transition-all"
            >
              <HiLogout className="w-4 h-4" />
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Console */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 lg:p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="noc-card p-2 rounded-xl flex flex-wrap gap-2 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'inventory'
                ? 'bg-[var(--accent-color)] text-slate-950 font-bold'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
            }`}
          >
            <HiServer className="w-4 h-4" />
            <span>Device Inventory Master</span>
          </button>

          <button
            onClick={() => setActiveTab('database')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'database'
                ? 'bg-[var(--accent-color)] text-slate-950 font-bold'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
            }`}
          >
            <HiDatabase className="w-4 h-4" />
            <span>Database Control & Reset</span>
          </button>

          <button
            onClick={() => setActiveTab('security')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'security'
                ? 'bg-[var(--accent-color)] text-slate-950 font-bold'
                : 'text-[var(--text-muted)] hover:bg-[var(--bg-hover)] hover:text-[var(--text-main)]'
            }`}
          >
            <HiShieldCheck className="w-4 h-4" />
            <span>Security & Access Info</span>
          </button>
        </div>

        {/* Tab 1: Inventory Master */}
        {activeTab === 'inventory' && (
          <div className="noc-card rounded-xl overflow-hidden p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-[var(--border-color)] pb-3">
              <div>
                <h3 className="text-sm font-bold text-[var(--text-main)]">
                  Managed Infrastructure Assets ({devices.length})
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono">
                  Full administrative read/write privileges enabled
                </p>
              </div>
              <button
                onClick={() => {
                  setModalDevice(null);
                  setModalApiErrors({});
                  setIsModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20 text-xs font-bold"
              >
                <HiPlus className="w-4 h-4" />
                <span>Create Asset</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse font-mono">
                <thead>
                  <tr className="bg-[var(--bg-main)] text-[var(--text-muted)] border-b border-[var(--border-color)]">
                    <th className="py-3 px-4">Hostname</th>
                    <th className="py-3 px-4">IP Address</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4">Type</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Admin Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--border-color)]">
                  {devices.map((device) => (
                    <tr key={device.id} className="hover:bg-[var(--bg-hover)]">
                      <td className="py-3 px-4 font-bold text-[var(--text-main)]">{device.hostname}</td>
                      <td className="py-3 px-4 text-cyan-400">{device.ip_address}</td>
                      <td className="py-3 px-4 font-sans">{device.vendor}</td>
                      <td className="py-3 px-4 font-sans">{device.device_type}</td>
                      <td className="py-3 px-4 font-sans">{device.location}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          device.status === 'Online' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-sans">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setModalDevice(device);
                              setModalApiErrors({});
                              setIsModalOpen(true);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 text-xs font-bold"
                          >
                            <HiPencil className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>
                          <button
                            onClick={() => {
                              setDeleteTargetDevice(device);
                              setIsDeleteOpen(true);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 text-xs font-bold"
                          >
                            <HiTrash className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Database Control */}
        {activeTab === 'database' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="noc-card p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                  <HiRefresh className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    Reset Database Inventory
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Restores default 15 enterprise network devices
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Clears all custom assets and populates SQLite database with 15 standard Cisco, Fortinet, Juniper, Dell, Palo Alto, and VMware devices.
              </p>
              <button
                onClick={handleResetInventory}
                disabled={isResetting}
                className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold shadow-lg shadow-amber-500/20 transition-all disabled:opacity-50"
              >
                {isResetting ? 'Resetting Database...' : 'Execute Database Re-Seed'}
              </button>
            </div>

            <div className="noc-card p-6 rounded-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400">
                  <HiTrash className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[var(--text-main)]">
                    Clear Activity Log Audit
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] font-mono">
                    Purges NOC action audit timeline entries
                  </p>
                </div>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Wipes all stored history log entries from the activity database table while keeping inventory devices intact.
              </p>
              <button
                onClick={handleClearLogs}
                className="w-full py-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20 font-bold transition-all"
              >
                Purge NOC Audit Trail Logs
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Security & Access Info */}
        {activeTab === 'security' && (
          <div className="noc-card p-6 rounded-xl space-y-4 max-w-xl">
            <h3 className="text-base font-bold text-[var(--text-main)] flex items-center gap-2">
              <HiShieldCheck className="w-5 h-5 text-amber-400" />
              Admin Security Credentials Policy
            </h3>
            <div className="space-y-2 text-xs font-mono bg-[var(--bg-main)] p-4 rounded-xl border border-[var(--border-color)]">
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--text-muted)]">Admin Username</span>
                <span className="font-bold text-cyan-400">Admin</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--text-muted)]">Admin Password</span>
                <span className="font-bold text-amber-400">admin@123</span>
              </div>
              <div className="flex justify-between border-b border-[var(--border-color)] pb-2">
                <span className="text-[var(--text-muted)]">Session Status</span>
                <span className="font-bold text-emerald-400">AUTHENTICATED</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Access Scope</span>
                <span className="font-bold text-[var(--text-main)]">Full NOC Administrator</span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Add / Edit Device Modal */}
      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalDevice}
        isSubmitting={isSubmitting}
        apiErrors={modalApiErrors}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        device={deleteTargetDevice}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default AdminPortal;
