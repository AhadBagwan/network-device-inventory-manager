import React, { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCards from '../components/DashboardCards';
import SearchBar from '../components/SearchBar';
import Filters from '../components/Filters';
import DeviceTable from '../components/DeviceTable';
import DeviceDrawer from '../components/DeviceDrawer';
import DeviceModal from '../components/DeviceModal';
import DeleteModal from '../components/DeleteModal';
import ImportModal from '../components/ImportModal';
import VendorChart from '../components/VendorChart';
import DeviceChart from '../components/DeviceChart';
import RecentActivity from '../components/RecentActivity';
import RecentAlerts from '../components/RecentAlerts';
import { 
  getDevices, 
  addDevice, 
  updateDevice, 
  deleteDevice, 
  pingDevice, 
  pingAllDevices, 
  exportDevices, 
  getStatistics, 
  getActivities,
  clearActivities,
  getNotifications,
  clearNotifications,
  bulkDeleteDevices,
  bulkUpdateDeviceStatus 
} from '../services/api';
import toast, { Toaster } from 'react-hot-toast';
import { HiClock } from 'react-icons/hi';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  const [notifications, setNotifications] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [pingingId, setPingingId] = useState(null);
  const [autoRefreshInterval, setAutoRefreshInterval] = useState(0);

  // Checkboxes Multi-Select State
  const [selectedIds, setSelectedIds] = useState([]);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [tagFilter, setTagFilter] = useState('');
  const [groupFilter, setGroupFilter] = useState('');
  const [sortBy, setSortBy] = useState('hostname');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals & Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  const fetchTelemetry = useCallback(async () => {
    try {
      const [devicesData, statsData, activitiesData, notificationsData] = await Promise.all([
        getDevices({
          search: searchQuery,
          vendor: vendorFilter,
          status: statusFilter,
          type: typeFilter,
          location: locationFilter,
          tag: tagFilter,
          group: groupFilter,
          sort_by: sortBy,
          sort_order: sortOrder
        }),
        getStatistics(),
        getActivities(),
        getNotifications()
      ]);

      setDevices(devicesData);
      setStats(statsData);
      setActivities(activitiesData);
      setNotifications(notificationsData);
    } catch (err) {
      toast.error('Failed to load NOC inventory telemetry.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, vendorFilter, statusFilter, typeFilter, locationFilter, tagFilter, groupFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  // Auto Refresh Interval Effect
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      const intervalMs = autoRefreshInterval * 1000;
      const timer = setInterval(() => {
        pingAllDevices().then(() => fetchTelemetry());
      }, intervalMs);
      return () => clearInterval(timer);
    }
  }, [autoRefreshInterval, fetchTelemetry]);

  // Selection Handlers
  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAll = (paginatedIds) => {
    if (paginatedIds.length === 0) {
      setSelectedIds([]);
      return;
    }
    const allSelected = paginatedIds.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !paginatedIds.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...paginatedIds])));
    }
  };

  // Bulk Actions
  const handleBulkPing = async (ids) => {
    toast.success(`Executing ping on ${ids.length} selected assets...`);
    for (const id of ids) {
      await pingDevice(id);
    }
    fetchTelemetry();
  };

  const handleBulkStatus = async (ids, status) => {
    try {
      const res = await bulkUpdateDeviceStatus(ids, status);
      toast.success(res.message);
      setSelectedIds([]);
      fetchTelemetry();
    } catch (err) {
      toast.error('Bulk status update failed.');
    }
  };

  const handleBulkDelete = async (ids) => {
    if (!window.confirm(`Are you sure you want to permanently delete ${ids.length} selected assets?`)) return;
    try {
      const res = await bulkDeleteDevices(ids);
      toast.success(res.message);
      setSelectedIds([]);
      fetchTelemetry();
    } catch (err) {
      toast.error('Bulk deletion failed.');
    }
  };

  // Sorting & Filtering Handlers
  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setVendorFilter('');
    setStatusFilter('');
    setTypeFilter('');
    setLocationFilter('');
    setTagFilter('');
    setGroupFilter('');
    setSortBy('hostname');
    setSortOrder('asc');
  };

  const handlePingSingle = async (deviceId) => {
    setPingingId(deviceId);
    try {
      const updated = await pingDevice(deviceId);
      toast.success(`Ping executed for ${updated.hostname} -> ${updated.status}`);
      fetchTelemetry();
    } catch (err) {
      toast.error('Ping probe failed.');
    } finally {
      setPingingId(null);
    }
  };

  const handlePingAll = async () => {
    setIsPingingAll(true);
    try {
      const res = await pingAllDevices();
      toast.success(res.message);
      fetchTelemetry();
    } catch (err) {
      toast.error('Bulk ping scan failed.');
    } finally {
      setIsPingingAll(false);
    }
  };

  const handleExport = async () => {
    try {
      await exportDevices();
      toast.success('Inventory CSV exported successfully.');
    } catch (err) {
      toast.error('CSV export failed.');
    }
  };

  const handleAddSubmit = async (formData) => {
    setIsSubmitting(true);
    setApiErrors({});
    try {
      const newDev = await addDevice(formData);
      toast.success(`Added device ${newDev.hostname}`);
      setIsAddModalOpen(false);
      fetchTelemetry();
    } catch (err) {
      if (err.response?.data?.errors) {
        setApiErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Failed to add device.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditSubmit = async (formData) => {
    if (!selectedDevice) return;
    setIsSubmitting(true);
    setApiErrors({});
    try {
      const updated = await updateDevice(selectedDevice.id, formData);
      toast.success(`Updated device ${updated.hostname}`);
      setIsEditModalOpen(false);
      setSelectedDevice(null);
      fetchTelemetry();
    } catch (err) {
      if (err.response?.data?.errors) {
        setApiErrors(err.response.data.errors);
      } else {
        toast.error(err.response?.data?.message || 'Failed to update device.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedDevice) return;
    setIsSubmitting(true);
    try {
      await deleteDevice(selectedDevice.id);
      toast.success(`Deleted device ${selectedDevice.hostname}`);
      setIsDeleteModalOpen(false);
      setSelectedDevice(null);
      fetchTelemetry();
    } catch (err) {
      toast.error('Failed to delete device.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClearLogs = async () => {
    try {
      await clearActivities();
      toast.success('Activity audit logs cleared.');
      fetchTelemetry();
    } catch (err) {
      toast.error('Failed to clear logs.');
    }
  };

  const handleClearNotifications = async () => {
    try {
      await clearNotifications();
      toast.success('NOC alerts cleared.');
      fetchTelemetry();
    } catch (err) {
      toast.error('Failed to clear alerts.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      <Toaster position="top-right" />

      {/* Navbar */}
      <Navbar
        onPingAll={handlePingAll}
        onExport={handleExport}
        onImport={() => setIsImportModalOpen(true)}
        onAddDevice={() => {
          setApiErrors({});
          setIsAddModalOpen(true);
        }}
        toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        isPingingAll={isPingingAll}
      />

      {/* Main Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          selectedType={typeFilter}
          onSelectType={setTypeFilter}
          stats={stats}
        />

        {/* Content View */}
        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-x-hidden">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] font-mono">
                NOC Operations Dashboard
              </h1>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Live ICMP/TCP Probing, Maintenance Windows & Enterprise Asset Telemetry
              </p>
            </div>

            {/* Auto Refresh Select Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-[var(--text-muted)] font-mono flex items-center gap-1">
                <HiClock className="w-4 h-4 text-[var(--accent-color)]" />
                Auto-Scan:
              </span>
              <select
                value={autoRefreshInterval}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  setAutoRefreshInterval(val);
                  if (val > 0) toast.success(`Auto-scan set to every ${val}s.`);
                  else toast.success('Auto-scan disabled.');
                }}
                className="px-3 py-1.5 rounded-lg bg-[var(--bg-card)] border border-[var(--border-color)] text-xs text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)] cursor-pointer"
              >
                <option value={0}>Disabled</option>
                <option value={30}>Every 30s</option>
                <option value={60}>Every 60s</option>
                <option value={300}>Every 5m</option>
              </select>
            </div>
          </div>

          {/* Top Telemetry Cards */}
          <DashboardCards stats={stats} loading={loading} />

          {/* Search & Filter Controls */}
          <div className="space-y-3">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
            <Filters
              vendorFilter={vendorFilter}
              onVendorChange={setVendorFilter}
              statusFilter={statusFilter}
              onStatusChange={setStatusFilter}
              typeFilter={typeFilter}
              onTypeChange={setTypeFilter}
              locationFilter={locationFilter}
              onLocationChange={setLocationFilter}
              tagFilter={tagFilter}
              onTagChange={setTagFilter}
              groupFilter={groupFilter}
              onGroupChange={setGroupFilter}
              vendors={stats?.vendor_breakdown?.map((v) => v.vendor) || []}
              types={stats?.type_breakdown?.map((t) => t.device_type) || []}
              locations={stats?.locations || []}
              tags={stats?.tags || []}
              groups={stats?.groups || []}
              onReset={handleResetFilters}
            />
          </div>

          {/* Device Table */}
          <DeviceTable
            devices={devices}
            loading={loading}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
            onViewDrawer={(device) => {
              setSelectedDevice(device);
              setIsDrawerOpen(true);
            }}
            onEdit={(device) => {
              setSelectedDevice(device);
              setApiErrors({});
              setIsEditModalOpen(true);
            }}
            onDelete={(device) => {
              setSelectedDevice(device);
              setIsDeleteModalOpen(true);
            }}
            onPing={handlePingSingle}
            pingingId={pingingId}
            selectedIds={selectedIds}
            onToggleSelect={handleToggleSelect}
            onToggleSelectAll={handleToggleSelectAll}
            onBulkStatus={handleBulkStatus}
            onBulkDelete={handleBulkDelete}
            onBulkPing={handleBulkPing}
          />

          {/* Analytics Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VendorChart data={stats?.vendor_breakdown} />
            <DeviceChart data={stats?.type_breakdown} />
          </div>

          {/* Notifications & Recent Activity Audit Log Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RecentAlerts notifications={notifications} onClearNotifications={handleClearNotifications} />
            <RecentActivity activities={activities} onClearLogs={handleClearLogs} />
          </div>
        </main>
      </div>

      {/* Drawer */}
      <DeviceDrawer
        device={selectedDevice}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onEdit={(dev) => {
          setSelectedDevice(dev);
          setApiErrors({});
          setIsEditModalOpen(true);
        }}
        onDelete={(dev) => {
          setSelectedDevice(dev);
          setIsDeleteModalOpen(true);
        }}
        onPing={handlePingSingle}
        pingingId={pingingId}
      />

      {/* Add Device Modal */}
      <DeviceModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddSubmit}
        isSubmitting={isSubmitting}
        apiErrors={apiErrors}
      />

      {/* Edit Device Modal */}
      <DeviceModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSubmit={handleEditSubmit}
        initialData={selectedDevice}
        isSubmitting={isSubmitting}
        apiErrors={apiErrors}
      />

      {/* Import CSV Modal */}
      <ImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onSuccess={() => {
          setIsImportModalOpen(false);
          fetchTelemetry();
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDeleteSubmit}
        deviceHostname={selectedDevice?.hostname}
        isSubmitting={isSubmitting}
      />
    </div>
  );
};

export default Dashboard;
