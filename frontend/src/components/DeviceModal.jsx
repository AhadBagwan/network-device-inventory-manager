import React, { useState, useEffect } from 'react';
import { HiX, HiCheck, HiExclamation } from 'react-icons/hi';

const DEVICE_TYPES = ['Router', 'Switch', 'Firewall', 'Server', 'Access Point', 'Load Balancer', 'Wireless Controller'];
const VENDORS = ['Cisco', 'Juniper', 'Fortinet', 'MikroTik', 'Dell', 'HP', 'Aruba', 'Ubiquiti', 'Palo Alto', 'VMware', 'F5 Networks', 'Other'];

const DeviceModal = ({ isOpen, onClose, onSubmit, initialData = null, isSubmitting = false, apiErrors = {} }) => {
  const isEdit = !!initialData;

  const [formData, setFormData] = useState({
    hostname: '',
    ip_address: '',
    device_type: 'Router',
    vendor: 'Cisco',
    model: '',
    operating_system: '',
    serial_number: '',
    mac_address: '',
    location: '',
    rack: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        hostname: initialData.hostname || '',
        ip_address: initialData.ip_address || '',
        device_type: initialData.device_type || 'Router',
        vendor: initialData.vendor || 'Cisco',
        model: initialData.model || '',
        operating_system: initialData.operating_system || '',
        serial_number: initialData.serial_number || '',
        mac_address: initialData.mac_address || '',
        location: initialData.location || '',
        rack: initialData.rack || '',
        notes: initialData.notes || ''
      });
    } else {
      setFormData({
        hostname: '',
        ip_address: '',
        device_type: 'Router',
        vendor: 'Cisco',
        model: '',
        operating_system: '',
        serial_number: '',
        mac_address: '',
        location: '',
        rack: '',
        notes: ''
      });
    }
    setErrors({});
  }, [initialData, isOpen]);

  useEffect(() => {
    if (apiErrors && Object.keys(apiErrors).length > 0) {
      setErrors(apiErrors);
    }
  }, [apiErrors]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!formData.hostname.trim()) newErrors.hostname = 'Hostname is required.';
    if (!formData.ip_address.trim()) {
      newErrors.ip_address = 'IPv4 address is required.';
    } else {
      const ipv4Regex = /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.){3}(25[0-5]|(2[0-4]|1\d|[1-9]|)\d)$/;
      if (!ipv4Regex.test(formData.ip_address.trim())) {
        newErrors.ip_address = 'Enter a valid IPv4 address (e.g., 192.168.1.1).';
      }
    }

    if (!formData.model.trim()) newErrors.model = 'Model is required.';
    if (!formData.location.trim()) newErrors.location = 'Location is required.';

    if (formData.mac_address.trim()) {
      const macRegex = /^([0-9A-Fa-f]{2}[:-]){5}([0-9A-Fa-f]{2})$/;
      if (!macRegex.test(formData.mac_address.trim())) {
        newErrors.mac_address = 'Valid MAC format: 00:1A:2B:3C:4D:5E';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-main)]/60">
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">
                {isEdit ? `Edit Device Asset: ${initialData?.hostname}` : 'Add New Network Device Asset'}
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Enter enterprise telemetry metadata
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Hostname */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Hostname <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="hostname"
                  value={formData.hostname}
                  onChange={handleChange}
                  placeholder="e.g. HQ-RTR-01"
                  className={`w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border ${
                    errors.hostname ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]`}
                />
                {errors.hostname && (
                  <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.hostname}</p>
                )}
              </div>

              {/* IPv4 Address */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  IPv4 Address <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="ip_address"
                  value={formData.ip_address}
                  onChange={handleChange}
                  placeholder="e.g. 192.168.1.1"
                  className={`w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border ${
                    errors.ip_address ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-cyan-400 font-mono font-semibold focus:outline-none focus:border-[var(--accent-color)]`}
                />
                {errors.ip_address && (
                  <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.ip_address}</p>
                )}
              </div>

              {/* Device Type */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Device Type <span className="text-rose-400">*</span>
                </label>
                <select
                  name="device_type"
                  value={formData.device_type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-sans"
                >
                  {DEVICE_TYPES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              {/* Vendor */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Vendor <span className="text-rose-400">*</span>
                </label>
                <select
                  name="vendor"
                  value={formData.vendor}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-sans"
                >
                  {VENDORS.map((v) => (
                    <option key={v} value={v}>{v}</option>
                  ))}
                </select>
              </div>

              {/* Model */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Hardware Model <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  placeholder="e.g. Catalyst 9300 / ISR4331"
                  className={`w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border ${
                    errors.model ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]`}
                />
                {errors.model && (
                  <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.model}</p>
                )}
              </div>

              {/* Operating System */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Operating System / Firmware
                </label>
                <input
                  type="text"
                  name="operating_system"
                  value={formData.operating_system}
                  onChange={handleChange}
                  placeholder="e.g. Cisco IOS-XE 17.03.04"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              {/* Serial Number */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Serial Number
                </label>
                <input
                  type="text"
                  name="serial_number"
                  value={formData.serial_number}
                  onChange={handleChange}
                  placeholder="e.g. FOC2418L09A"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>

              {/* MAC Address */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  MAC Address
                </label>
                <input
                  type="text"
                  name="mac_address"
                  value={formData.mac_address}
                  onChange={handleChange}
                  placeholder="e.g. 00:1A:2B:3C:4D:5E"
                  className={`w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border ${
                    errors.mac_address ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-cyan-400 font-mono focus:outline-none focus:border-[var(--accent-color)]`}
                />
                {errors.mac_address && (
                  <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.mac_address}</p>
                )}
              </div>

              {/* Location */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Location / Facility <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="e.g. Headquarters / Data Center"
                  className={`w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border ${
                    errors.location ? 'border-rose-500' : 'border-[var(--border-color)]'
                  } text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)]`}
                />
                {errors.location && (
                  <p className="text-rose-400 text-[10px] mt-1 font-mono">{errors.location}</p>
                )}
              </div>

              {/* Rack */}
              <div>
                <label className="block font-semibold text-[var(--text-main)] mb-1">
                  Rack Unit Placement
                </label>
                <input
                  type="text"
                  name="rack"
                  value={formData.rack}
                  onChange={handleChange}
                  placeholder="e.g. Rack-A01 / U14"
                  className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] font-mono focus:outline-none focus:border-[var(--accent-color)]"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block font-semibold text-[var(--text-main)] mb-1">
                Operational Notes
              </label>
              <textarea
                name="notes"
                rows={2}
                value={formData.notes}
                onChange={handleChange}
                placeholder="Enter connectivity details, interface info, or maintenance schedules..."
                className="w-full px-3 py-2 rounded-lg bg-[var(--bg-main)] border border-[var(--border-color)] text-[var(--text-main)] focus:outline-none focus:border-[var(--accent-color)] font-mono"
              />
            </div>

            {/* Footer Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-5 py-2 rounded-lg bg-[var(--accent-color)] hover:opacity-90 text-slate-950 font-bold shadow-lg shadow-cyan-500/20 transition-all disabled:opacity-50"
              >
                <HiCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Saving...' : isEdit ? 'Update Asset' : 'Add Device'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default DeviceModal;
