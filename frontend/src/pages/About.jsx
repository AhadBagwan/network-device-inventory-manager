import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import { 
  HiInformationCircle, 
  HiCode, 
  HiChip, 
  HiUser, 
  HiGlobeAlt, 
  HiServer, 
  HiShieldCheck,
  HiExternalLink
} from 'react-icons/hi';

const NETWORKING_CONCEPTS = [
  {
    title: 'ICMP Echo Probing & Latency Calculation',
    desc: 'Measures round-trip time (RTT) to network nodes using ICMP Echo Request/Reply (Type 8/0) packets or TCP socket probing fallback.'
  },
  {
    title: 'Subnetting & IPv4 Parsing',
    desc: 'Validates strict 32-bit dotted decimal IPv4 notations using Python ipaddress parsing module to ensure proper intranet addressing.'
  },
  {
    title: 'IEEE 802 MAC Address Verification',
    desc: 'Validates 48-bit hardware MAC addresses formatted in standard colon, hyphen, or Cisco dot notations.'
  },
  {
    title: 'NOC Maintenance Windows',
    desc: 'Excludes scheduled maintenance devices from outage statistics, maintaining accurate SLA metrics.'
  },
  {
    title: 'REST Telemetry Architecture',
    desc: 'Decoupled client-server model passing JSON telemetry payloads authenticated via JWT bearer tokens.'
  }
];

const About = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--bg-main)] text-[var(--text-main)] transition-colors">
      <Navbar toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />

      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

        <main className="flex-1 p-4 lg:p-6 space-y-6 overflow-x-hidden">
          {/* Header */}
          <div className="border-b border-[var(--border-color)] pb-4">
            <h1 className="text-xl sm:text-2xl font-extrabold text-[var(--text-main)] flex items-center gap-2">
              <HiInformationCircle className="w-6 h-6 text-[var(--accent-color)]" />
              About NetPulse NOC Telemetry Manager
            </h1>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              Project overview, technical stack, networking concepts & developer details
            </p>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Purpose & Networking Concepts */}
            <div className="lg:col-span-2 space-y-6">
              {/* Purpose Card */}
              <div className="noc-card p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <HiServer className="w-5 h-5 text-[var(--accent-color)]" />
                  System Purpose & Architectural Goal
                </h3>
                <p className="text-xs text-[var(--text-muted)] font-mono leading-relaxed">
                  NetPulse NOC is designed to simulate a professional Network Operations Center asset management portal. It solves the real-world problem of fragmented network inventory tracking by centralizing device metadata, executing automated ping telemetry scans, preserving scheduled maintenance windows, and enforcing strict IP/MAC configuration rules.
                </p>
              </div>

              {/* Networking Concepts Used */}
              <div className="noc-card p-6 rounded-xl space-y-4">
                <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <HiChip className="w-5 h-5 text-[var(--accent-color)]" />
                  Networking & Engineering Concepts Implemented
                </h3>

                <div className="space-y-3">
                  {NETWORKING_CONCEPTS.map((concept, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-[var(--bg-main)] border border-[var(--border-color)] space-y-1">
                      <h4 className="text-xs font-bold text-cyan-400">{concept.title}</h4>
                      <p className="text-[11px] text-[var(--text-muted)] font-mono leading-relaxed">{concept.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Tech Stack & Developer Info */}
            <div className="space-y-6">
              {/* Tech Stack */}
              <div className="noc-card p-6 rounded-xl space-y-3">
                <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <HiCode className="w-5 h-5 text-[var(--accent-color)]" />
                  Tech Stack Summary
                </h3>

                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                    <span className="text-[var(--text-muted)]">Frontend</span>
                    <span className="font-bold text-[var(--text-main)]">React 18 + Vite</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                    <span className="text-[var(--text-muted)]">Styling</span>
                    <span className="font-bold text-[var(--text-main)]">Tailwind CSS</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                    <span className="text-[var(--text-muted)]">Auth</span>
                    <span className="font-bold text-cyan-400">Flask-JWT-Extended</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                    <span className="text-[var(--text-muted)]">Backend</span>
                    <span className="font-bold text-[var(--text-main)]">Python 3.12 + Flask</span>
                  </div>
                  <div className="flex justify-between border-b border-[var(--border-color)]/50 pb-1.5">
                    <span className="text-[var(--text-muted)]">Database</span>
                    <span className="font-bold text-[var(--text-main)]">SQLite + SQLAlchemy</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[var(--text-muted)]">Ping Engine</span>
                    <span className="font-bold text-emerald-400">Ping3 ICMP + TCP</span>
                  </div>
                </div>
              </div>

              {/* Developer Card */}
              <div className="noc-card p-6 rounded-xl space-y-3 bg-gradient-to-br from-slate-900 to-cyan-950/40 border border-cyan-500/30">
                <h3 className="text-sm font-bold text-[var(--text-main)] flex items-center gap-2 border-b border-[var(--border-color)] pb-3">
                  <HiUser className="w-5 h-5 text-[var(--accent-color)]" />
                  Developer Information
                </h3>

                <div className="space-y-2 text-xs font-mono">
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Project Engineer</span>
                    <span className="font-bold text-base text-[var(--text-main)]">Ahad Bagwan</span>
                  </div>
                  <div>
                    <span className="text-[var(--text-muted)] block text-[10px]">Specialization</span>
                    <span className="text-cyan-400 font-bold">Senior Full Stack Developer & Network Engineer</span>
                  </div>
                </div>

                <div className="pt-2">
                  <a
                    href="https://github.com/AhadBagwan/network-device-inventory-manager"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-[var(--accent-color)] text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
                  >
                    <span>View GitHub Repository</span>
                    <HiExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default About;
