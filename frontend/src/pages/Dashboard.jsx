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
import VendorChart from '../components/VendorChart';
import DeviceChart from '../components/DeviceChart';
import RecentActivity from '../components/RecentActivity';
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
  clearActivities 
} from '../services/api';
import toast, { Toaster } from 'react-hot-toast';

const Dashboard = () => {
  const [devices, setDevices] = useState([]);
  const [stats, setStats] = useState(null);
  const [activities, setActivities] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [isPingingAll, setIsPingingAll] = useState(false);
  const [pingingId, setPingingId] = useState(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [vendorFilter, setVendorFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [sortBy, setSortBy] = useState('hostname');
  const [sortOrder, setSortOrder] = useState('asc');

  // Modals & Drawer State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState({});

  const fetchTelemetry = useCallback(async () => {
    try {
      const [devicesData, statsData, activitiesData] = await Promise.all([
        getDevices({
          search: searchQuery,
          vendor: vendorFilter,
          status: statusFilter,
          type: typeFilter,
          location: locationFilter,
          sort_by: sortBy,
          sort_order: sortOrder
        }),
        getStatistics(),
        getActivities()
      ]);

      setDevices(devicesData);
      setStats(statsData);
      setActivities(activitiesData);
    } catch (err) {
      toast.error('Failed to load NOC inventory telemetry.');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, vendorFilter, statusFilter, typeFilter, locationFilter, sortBy, sortOrder]);

  useEffect(() => {
    fetchTelemetry();
  }, [fetchTelemetry]);

  // Handlers
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

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      <Toaster position="top-right" />

      {/* Navbar */}
      <Navbar
        onPingAll={handlePingAll}
        onExport={handleExport}
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
              vendors={stats?.vendor_breakdown?.map((v) => v.vendor) || []}
              types={stats?.type_breakdown?.map((t) => t.device_type) || []}
              locations={stats?.locations || []}
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
          />

          {/* Analytics Visualizations Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <VendorChart data={stats?.vendor_breakdown} />
            <DeviceChart data={stats?.type_breakdown} />
          </div>

          {/* Activity Logs Timeline */}
          <RecentActivity activities={activities} onClearLogs={handleClearLogs} />
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
