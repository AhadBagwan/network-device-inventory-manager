import React, { useState, useEffect, useCallback } from 'react';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import VendorChart from '../components/VendorChart';
import DeviceChart from '../components/DeviceChart';
import RecentActivity from '../components/RecentActivity';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import DeviceTable from '../components/DeviceTable';
import DeviceDrawer from '../components/DeviceDrawer';
import DeviceModal from '../components/DeviceModal';
import DeleteModal from '../components/DeleteModal';
import SettingsModal from '../components/SettingsModal';
import { 
  getDevices, 
  getStatistics, 
  getActivities, 
  addDevice, 
  updateDevice, 
  deleteDevice, 
  pingDevice, 
  pingAllDevices, 
  exportDevices,
  clearActivities,
  resetInventory
} from '../services/api';

const Dashboard = () => {
  // State management
  const [devices, setDevices] = useState([]);
  const [statistics, setStatistics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Settings State (stored in LocalStorage)
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('noc_settings');
    return saved ? JSON.parse(saved) : {
      nocName: 'Enterprise Operations Center',
      autoRefresh: 10,
      pingTimeout: 2,
      maintenanceMode: false,
      subnet: '192.168.1.0/24'
    };
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [vendor, setVendor] = useState('');
  const [status, setStatus] = useState('');
  const [deviceType, setDeviceType] = useState('');
  const [location, setLocation] = useState('');

  // Sorting
  const [sortBy, setSortBy] = useState('hostname');
  const [sortOrder, setSortOrder] = useState('asc');

  // UI Drawer & Modals state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [drawerDevice, setDrawerDevice] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const [modalDevice, setModalDevice] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalApiErrors, setModalApiErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [deleteTargetDevice, setDeleteTargetDevice] = useState(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [pingingId, setPingingId] = useState(null);
  const [isPingingAll, setIsPingingAll] = useState(false);

  // Fetch stats & activity
  const fetchDashboardData = useCallback(async () => {
    try {
      const [statsData, actData] = await Promise.all([
        getStatistics(),
        getActivities()
      ]);
      setStatistics(statsData);
      setActivities(actData);
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    }
  }, []);

  // Fetch device inventory list
  const fetchDevices = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        search,
        vendor,
        status,
        type: deviceType,
        location,
        sort_by: sortBy,
        sort_order: sortOrder
      };
      const data = await getDevices(params);
      setDevices(data);
    } catch (err) {
      toast.error('Failed to fetch network inventory records.');
    } finally {
      setLoading(false);
    }
  }, [search, vendor, status, deviceType, location, sortBy, sortOrder]);

  useEffect(() => {
    fetchDevices();
  }, [fetchDevices]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  // Auto-refresh telemetry interval if enabled in settings
  useEffect(() => {
    if (!settings?.autoRefresh || settings.autoRefresh <= 0) return;
    const interval = setInterval(() => {
      fetchDevices();
      fetchDashboardData();
    }, settings.autoRefresh * 1000);
    return () => clearInterval(interval);
  }, [settings.autoRefresh, fetchDevices, fetchDashboardData]);

  // Handlers
  const handleSaveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('noc_settings', JSON.stringify(newSettings));
    toast.success('NOC preferences updated.');
  };

  const handleResetInventory = async () => {
    try {
      const res = await resetInventory();
      toast.success(res.message);
      fetchDevices();
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to reset inventory.');
    }
  };

  const handleClearActivities = async () => {
    try {
      const res = await clearActivities();
      toast.success(res.message);
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to clear activities.');
    }
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setSearch('');
    setVendor('');
    setStatus('');
    setDeviceType('');
    setLocation('');
  };

  // Add / Edit submission
  const handleModalSubmit = async (formData) => {
    setIsSubmitting(true);
    setModalApiErrors({});
    try {
      if (modalDevice) {
        // Edit mode
        await updateDevice(modalDevice.id, formData);
        toast.success(`Device asset ${formData.hostname} updated.`);
      } else {
        // Add mode
        await addDevice(formData);
        toast.success(`Added new device asset ${formData.hostname}.`);
      }
      setIsModalOpen(false);
      setModalDevice(null);
      fetchDevices();
      fetchDashboardData();
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        setModalApiErrors(err.response.data.errors);
        toast.error('Please resolve form validation issues.');
      } else {
        toast.error(err.response?.data?.message || 'Error saving device details.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete execution
  const handleDeleteConfirm = async (id) => {
    setIsDeleting(true);
    try {
      await deleteDevice(id);
      toast.success('Device asset removed from inventory.');
      setIsDeleteOpen(false);
      setDeleteTargetDevice(null);
      if (drawerDevice?.id === id) {
        setIsDrawerOpen(false);
      }
      fetchDevices();
      fetchDashboardData();
    } catch (err) {
      toast.error('Failed to delete device asset.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Single Ping execution
  const handleSinglePing = async (id) => {
    setPingingId(id);
    const toastId = toast.loading('Pinging device...');
    try {
      const updated = await pingDevice(id);
      toast.success(
        `Ping Response: ${updated.status} (${updated.latency ? `${updated.latency}ms` : 'No ICMP response'})`,
        { id: toastId }
      );
      
      setDevices((prev) => prev.map((d) => (d.id === id ? updated : d)));
      if (drawerDevice?.id === id) {
        setDrawerDevice(updated);
      }
      fetchDashboardData();
    } catch (err) {
      toast.error('ICMP Ping failed.', { id: toastId });
    } finally {
      setPingingId(null);
    }
  };

  // Bulk Ping execution
  const handlePingAll = async () => {
    setIsPingingAll(true);
    const toastId = toast.loading('Executing bulk network ping scan...');
    try {
      const res = await pingAllDevices();
      toast.success(res.message, { id: toastId, duration: 5000 });
      fetchDevices();
      fetchDashboardData();
    } catch (err) {
      toast.error('Bulk network ping scan failed.', { id: toastId });
    } finally {
      setIsPingingAll(false);
    }
  };

  // CSV Export
  const handleExportCSV = async () => {
    try {
      toast.loading('Generating inventory CSV report...', { duration: 1500 });
      await exportDevices();
    } catch (err) {
      toast.error('Failed to export inventory CSV.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--bg-card)',
            color: 'var(--text-main)',
            border: '1px solid var(--border-color)',
            fontSize: '12px',
            fontFamily: 'JetBrains Mono, monospace'
          }
        }}
      />

      {/* Top Navigation */}
      <Navbar
        onPingAll={handlePingAll}
        onExport={handleExportCSV}
        onAddDevice={() => {
          setModalDevice(null);
          setModalApiErrors({});
          setIsModalOpen(true);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isPingingAll={isPingingAll}
        settings={settings}
      />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Collapsible Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          selectedType={deviceType}
          onSelectType={(type) => setDeviceType(type)}
          onOpenSettings={() => setIsSettingsOpen(true)}
          stats={statistics}
        />

        {/* Main Telemetry & Inventory Dashboard */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-x-hidden">
          {/* Top Key Performance Stats */}
          <DashboardCards stats={statistics} />

          {/* Analytics Charts & Activity Log Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <VendorChart data={statistics?.vendor_breakdown} />
            <DeviceChart data={statistics?.type_breakdown} />
            <RecentActivity activities={activities} />
          </div>

          {/* Inventory Controls: Search & Filters Toolbar */}
          <div className="noc-card p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <SearchBar search={search} setSearch={setSearch} />
            <Filters
              vendor={vendor}
              setVendor={setVendor}
              status={status}
              setStatus={setStatus}
              type={deviceType}
              setType={setDeviceType}
              location={location}
              setLocation={setLocation}
              availableLocations={statistics?.locations}
              onReset={handleResetFilters}
            />
          </div>

          {/* Primary Network Inventory Table */}
          <DeviceTable
            devices={devices}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onViewDrawer={(dev) => {
              setDrawerDevice(dev);
              setIsDrawerOpen(true);
            }}
            onEdit={(dev) => {
              setModalDevice(dev);
              setModalApiErrors({});
              setIsModalOpen(true);
            }}
            onDelete={(dev) => {
              setDeleteTargetDevice(dev);
              setIsDeleteOpen(true);
            }}
            onPing={handleSinglePing}
            pingingId={pingingId}
          />
        </main>
      </div>

      {/* Slide-over Right Drawer */}
      <DeviceDrawer
        device={drawerDevice}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onPing={handleSinglePing}
        onEdit={(dev) => {
          setModalDevice(dev);
          setModalApiErrors({});
          setIsModalOpen(true);
        }}
        isPinging={pingingId === drawerDevice?.id}
      />

      {/* Add / Edit Device Popup Modal */}
      <DeviceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleModalSubmit}
        initialData={modalDevice}
        isSubmitting={isSubmitting}
        apiErrors={modalApiErrors}
      />

      {/* Delete Device Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDeleteConfirm}
        device={deleteTargetDevice}
        isDeleting={isDeleting}
      />

      {/* NOC Settings & Diagnostics Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSaveSettings={handleSaveSettings}
        onResetInventory={handleResetInventory}
        onClearActivities={handleClearActivities}
      />
    </div>
  );
};

export default Dashboard;
