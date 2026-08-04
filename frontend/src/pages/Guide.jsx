import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  HiBookOpen, 
  HiPlus, 
  HiPencil, 
  HiTrash, 
  HiLightningBolt, 
  HiDownload, 
  HiSearch, 
  HiFilter, 
  HiColorSwatch, 
  HiQuestionMarkCircle,
  HiChevronDown,
  HiChevronUp,
  HiShieldCheck
} from 'react-icons/hi';

const FAQS = [
  {
    q: 'What is the purpose of the Network Device Inventory Manager?',
    a: 'It provides a centralized NOC telemetry dashboard to manage hardware assets, execute live ICMP/TCP ping probing, monitor SLA availability, and export inventory data without relying on static spreadsheets.'
  },
  {
    q: 'How does Maintenance Mode (🟡) work during ping scans?',
    a: 'When an administrator marks a device status as Maintenance, the probing service preserves its status as Maintenance even if ICMP/TCP ping checks fail. This prevents scheduled maintenance windows from registering as network outages.'
  },
  {
    q: 'How does ICMP ping probing handle systems without root/admin privileges?',
    a: 'The backend ping service utilizes Python ping3 for ICMP raw sockets. If raw socket access is restricted by OS permissions, it automatically falls back to TCP socket probing on common management ports (80, 443, 22, 161, 8080) to determine device latency cleanly.'
  },
  {
    q: 'How is JWT authentication handled across sessions?',
    a: 'When a user logs in via /login, the Flask backend issues a signed JWT access token. Axios automatically attaches this token via an Authorization: Bearer header on every request. Tokens are valid for 24 hours.'
  },
  {
    q: 'Can I export the full inventory into Excel or CSV format?',
    a: 'Yes. Clicking the Export button calls the Flask /api/devices/export endpoint, which uses Pandas to generate a clean UTF-8 encoded CSV file containing all device metadata.'
  }
];

const Guide = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-x-hidden">
          {/* Header */}
          <div className="border-b border-[var(--border-color)] pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] flex items-center gap-2">
              <HiBookOpen className="w-6 h-6 text-[var(--accent-color)]" />
              NOC Operator & Administration Guide
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Complete user manual, operational procedures, and FAQs for NetPulse NOC
            </p>
          </div>

          {/* Guide Sections Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* How to Add Device */}
            <div className="noc-card p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                  <HiPlus className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text-main)]">1. How to Add a Device</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Click the <span className="text-cyan-400 font-bold">+ Add Device</span> button on the top header or Admin Portal. Fill out the required fields (*Hostname, IPv4 Address, Device Type, Vendor, Model, Location*). The system automatically validates IPv4 format, MAC regex, and checks for duplicate Hostnames or IP addresses.
              </p>
            </div>

            {/* How to Edit Device */}
            <div className="noc-card p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  <HiPencil className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text-main)]">2. How to Edit a Device</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Click the <span className="text-amber-400 font-bold">Edit (Pencil)</span> icon on any table row or from the right slide-over drawer. You can update hardware configurations, location placement, rack units, operator notes, or toggle device status to <span className="text-amber-400 font-bold">🟡 Maintenance</span>.
              </p>
            </div>

            {/* How to Delete Device */}
            <div className="noc-card p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/30">
                  <HiTrash className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text-main)]">3. How to Delete a Device</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Click the <span className="text-rose-400 font-bold">Delete (Trash)</span> icon. A confirmation modal will ask to confirm permanent removal. Upon deletion, the system updates the NOC activity audit trail.
              </p>
            </div>

            {/* How to Ping Devices */}
            <div className="noc-card p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                  <HiLightningBolt className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text-main)]">4. How to Execute Ping Probing</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Click the <span className="text-emerald-400 font-bold">Ping</span> button on a single row or click <span className="text-emerald-400 font-bold">Ping All</span> in the header to execute a network-wide scan. Latency is measured in milliseconds and statuses update in real time.
              </p>
            </div>

            {/* How to Export CSV */}
            <div className="noc-card p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/30">
                  <HiDownload className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text-main)]">5. How to Export CSV Reports</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Click the <span className="text-blue-400 font-bold">Export</span> button in the top navbar. The backend streams a Pandas-generated CSV file directly to your browser download folder.
              </p>
            </div>

            {/* How Search & Filters Work */}
            <div className="noc-card p-5 rounded-xl space-y-3">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30">
                  <HiFilter className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-sm text-[var(--text-main)]">6. Search, Filters & Themes</h3>
              </div>
              <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                Use the search input to filter across Hostname, IP, Vendor, Model, Location, and OS. Use dropdown filters to isolate specific Vendors or Maintenance statuses. Switch between 6 themes in the Theme Switcher.
              </p>
            </div>
          </div>

          {/* Frequently Asked Questions */}
          <div className="noc-card p-6 rounded-xl space-y-4">
            <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
              <HiQuestionMarkCircle className="w-5 h-5 text-[var(--accent-color)]" />
              Frequently Asked Questions (FAQ)
            </h3>

            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div key={idx} className="border border-[var(--border-color)] rounded-xl overflow-hidden bg-[var(--bg-main)]">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between p-4 text-xs font-bold text-left text-[var(--text-main)] hover:bg-[var(--bg-hover)] transition-colors"
                  >
                    <span>{faq.q}</span>
                    {openFaq === idx ? (
                      <HiChevronUp className="w-4 h-4 text-[var(--accent-color)] shrink-0" />
                    ) : (
                      <HiChevronDown className="w-4 h-4 text-[var(--text-muted)] shrink-0" />
                    )}
                  </button>
                  {openFaq === idx && (
                    <div className="p-4 pt-0 text-xs text-[var(--text-muted)] font-mono leading-relaxed border-t border-[var(--border-color)]/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Guide;
