import React, { useState } from 'react';
import { HiX, HiUpload, HiDownload, HiCheckCircle, HiExclamationCircle } from 'react-icons/hi';
import { importDevicesCsv } from '../services/api';
import toast from 'react-hot-toast';

const ImportModal = ({ isOpen, onClose, onSuccess }) => {
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [result, setResult] = useState(null);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selected = e.target.files[0];
    if (selected && selected.name.endsWith('.csv')) {
      setFile(selected);
      setResult(null);
    } else {
      toast.error('Please select a valid .csv file.');
    }
  };

  const handleDownloadSample = () => {
    const sampleHeaders = 'hostname,ip_address,device_type,vendor,model,location,mac_address,serial_number,operating_system,firmware_version,rack,warranty_expiry,tags,device_group,notes\n';
    const sampleRow1 = 'BR-RTR-03,10.10.30.1,Router,Cisco,ISR4321,Branch West,00:1A:2B:11:22:33,FOC2418L999,Cisco IOS-XE,17.03.04a,Rack-BW1,2028-12-31,"Branch, WAN",Branch Perimeter,Secondary WAN Gateway\n';
    const sampleRow2 = 'DC-SW-03,192.168.1.12,Switch,Aruba,CX 6300,Data Center,D8:C7:C8:99:88:77,AR990812,ArubaOS-CX,10.10.1000,Rack-DC03,2027-05-31,"Core, 10G",Datacenter Core,Aggregated Core Switch\n';

    const blob = new Blob([sampleHeaders + sampleRow1 + sampleRow2], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sample_netpulse_inventory_import.csv';
    document.body.appendChild(a);
    a.click();
    a.remove();
    window.URL.revokeObjectURL(url);
    toast.success('Downloaded sample CSV import template.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a CSV file to upload.');
      return;
    }

    setIsUploading(true);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await importDevicesCsv(formData);
      setResult(res);
      toast.success(res.message);
      if (res.imported_count > 0 && onSuccess) {
        onSuccess();
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'CSV import failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-lg bg-[var(--bg-card)] border border-[var(--border-color)] rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="flex items-center justify-between p-5 border-b border-[var(--border-color)] bg-[var(--bg-main)]/60">
            <div>
              <h3 className="text-base font-bold text-[var(--text-main)]">
                Batch Import Device Inventory (CSV)
              </h3>
              <p className="text-xs text-[var(--text-muted)] font-mono">
                Upload comma-separated values inventory file
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-[var(--bg-hover)] text-[var(--text-muted)] hover:text-[var(--text-main)]"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs font-mono">
            {/* File Upload Box */}
            <div className="border-2 border-dashed border-[var(--border-color)] hover:border-[var(--accent-color)] rounded-2xl p-6 text-center space-y-3 bg-[var(--bg-main)]/50 transition-colors">
              <HiUpload className="w-10 h-10 mx-auto text-[var(--accent-color)] animate-bounce" />
              <div>
                <span className="font-bold text-[var(--text-main)] block">
                  {file ? file.name : 'Click to select or drag & drop CSV file'}
                </span>
                <span className="text-[10px] text-[var(--text-muted)]">
                  Must be UTF-8 formatted .csv file
                </span>
              </div>
              <input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="hidden"
                id="csv-file-input"
              />
              <label
                htmlFor="csv-file-input"
                className="inline-block px-4 py-2 rounded-xl bg-[var(--bg-hover)] text-[var(--text-main)] font-bold cursor-pointer border border-[var(--border-color)] hover:bg-[var(--accent-color)] hover:text-slate-950 transition-all"
              >
                Browse CSV File
              </label>
            </div>

            {/* Download Sample Template */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)]">
              <span className="text-[11px] text-[var(--text-muted)]">
                Need proper column structure?
              </span>
              <button
                type="button"
                onClick={handleDownloadSample}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 font-bold text-[11px] transition-all"
              >
                <HiDownload className="w-3.5 h-3.5" />
                <span>Sample CSV</span>
              </button>
            </div>

            {/* Import Results Summary */}
            {result && (
              <div className="p-4 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-emerald-400">
                  <HiCheckCircle className="w-5 h-5" />
                  <span>{result.message}</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                  <div className="p-2 rounded bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    Imported: <span className="font-bold">{result.imported_count} Assets</span>
                  </div>
                  <div className="p-2 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    Skipped: <span className="font-bold">{result.skipped_count} Rows</span>
                  </div>
                </div>

                {result.errors && result.errors.length > 0 && (
                  <div className="mt-2 p-2 rounded bg-rose-500/10 border border-rose-500/20 max-h-24 overflow-y-auto space-y-1 text-[10px] text-rose-400">
                    {result.errors.map((err, idx) => (
                      <div key={idx}>• {err}</div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--border-color)]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl border border-[var(--border-color)] text-[var(--text-muted)] hover:bg-[var(--bg-hover)] font-bold transition-colors"
              >
                Close
              </button>
              <button
                type="submit"
                disabled={!file || isUploading}
                className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all disabled:opacity-50"
              >
                <HiUpload className="w-4 h-4" />
                <span>{isUploading ? 'Importing CSV...' : 'Upload & Import'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ImportModal;
