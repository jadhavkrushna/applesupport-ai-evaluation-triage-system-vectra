import React, { useState, useEffect } from 'react';
import {
  Bot,
  Database,
  BarChart3,
  Scale,
  FileText,
  ListChecks,
  Terminal,
  Download,
  ShieldCheck,
  Network
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCliModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenCliModal
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [systemStatus, setSystemStatus] = useState<'checking' | 'online' | 'offline'>('checking');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    fetch('/api/health')
      .then(r => r.ok ? setSystemStatus('online') : setSystemStatus('offline'))
      .catch(() => setSystemStatus('offline'));
  }, []);

  const navItems = [
    { id: 'playground', label: 'Live Agent Sandbox', icon: Bot },
    { id: 'dataset',    label: 'Golden Dataset (200)', icon: Database },
    { id: 'benchmark',  label: 'Benchmark', icon: BarChart3 },
    { id: 'judge',      label: 'LLM-as-a-Judge', icon: Scale },
    { id: 'report',     label: 'Report & Failures', icon: FileText },
    { id: 'decisions',  label: 'Decision Log', icon: ListChecks },
    { id: 'intents',    label: 'Intent Taxonomy', icon: Network },
  ];

  return (
    <header
      className={`sticky top-0 z-40 text-slate-100 transition-all duration-300 ${
        scrolled
          ? 'bg-slate-950/95 backdrop-blur-xl shadow-xl shadow-black/30 border-b border-slate-800/80'
          : 'bg-slate-950/80 backdrop-blur border-b border-slate-800/60'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Brand */}
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 via-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-sky-500/30 glow-sky">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-white text-base tracking-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>
                  AppleSupport AI
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gradient-to-r from-sky-500/20 to-indigo-500/20 text-sky-300 border border-sky-500/30">
                  Hiver Take-Home
                </span>
              </div>
              <div className="flex items-center space-x-2 mt-0.5">
                {/* System Status */}
                <div className="flex items-center space-x-1.5">
                  {systemStatus === 'online' && (
                    <>
                      <span className="status-dot-live" />
                      <span className="text-[10px] text-emerald-400 font-medium font-mono">System Online</span>
                    </>
                  )}
                  {systemStatus === 'offline' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
                      <span className="text-[10px] text-rose-400 font-medium font-mono">Offline</span>
                    </>
                  )}
                  {systemStatus === 'checking' && (
                    <>
                      <span className="w-2 h-2 rounded-full bg-amber-400 inline-block animate-pulse" />
                      <span className="text-[10px] text-amber-400 font-mono">Checking...</span>
                    </>
                  )}
                </div>
                <span className="text-slate-600 text-[10px]">•</span>
                <span className="text-[10px] text-slate-500 font-mono">200-item Golden Harness</span>
              </div>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center space-x-0.5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
                  }`}
                >
                  {isActive && (
                    <span className="absolute inset-0 rounded-lg bg-gradient-to-r from-sky-500/20 to-indigo-600/20 border border-sky-500/30 shadow-sm shadow-sky-500/10" />
                  )}
                  <Icon className={`w-3.5 h-3.5 relative z-10 ${isActive ? 'text-sky-400' : ''}`} />
                  <span className="relative z-10">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center space-x-2">
            <button
              id="btn-open-cli"
              onClick={onOpenCliModal}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/80 hover:border-emerald-500/40 transition-all duration-200 group"
              title="15-minute reproduction commands"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span className="hidden sm:inline">Reproduce in 15m</span>
            </button>

            <a
              id="btn-export-report"
              href="/api/export/report.md"
              download
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white transition-all duration-200 shadow-md shadow-sky-900/40"
              title="Download Full Technical Report (Markdown)"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export Report</span>
            </a>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex overflow-x-auto py-2 space-x-1 border-t border-slate-800/50 no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex-shrink-0 flex items-center space-x-1 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
