import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { PlaygroundView } from './components/PlaygroundView';
import { DatasetView } from './components/DatasetView';
import { BenchmarkView } from './components/BenchmarkView';
import { JudgeRubricView } from './components/JudgeRubricView';
import { ReportView } from './components/ReportView';
import { DecisionLogView } from './components/DecisionLogView';
import { IntentTaxonomyView } from './components/IntentTaxonomyView';
import { CliModal } from './components/CliModal';
import { ExternalLink, Terminal } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('playground');
  const [isCliModalOpen, setIsCliModalOpen] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-sky-500/30 selection:text-sky-200">
      {/* Subtle animated grid overlay on body */}
      <div className="fixed inset-0 grid-overlay pointer-events-none opacity-30 z-0" />

      {/* Sticky Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenCliModal={() => setIsCliModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 relative z-10">
        {activeTab === 'playground' && <PlaygroundView />}
        {activeTab === 'dataset'    && <DatasetView />}
        {activeTab === 'benchmark'  && <BenchmarkView />}
        {activeTab === 'judge'      && <JudgeRubricView />}
        {activeTab === 'report'     && <ReportView />}
        {activeTab === 'decisions'  && <DecisionLogView />}
        {activeTab === 'intents'    && <IntentTaxonomyView />}
      </main>

      {/* Reproduction Modal */}
      <CliModal
        isOpen={isCliModalOpen}
        onClose={() => setIsCliModalOpen(false)}
      />

      {/* Production Footer */}
      <footer className="relative z-10 bg-slate-900/80 backdrop-blur border-t border-slate-800 text-slate-400 text-xs py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center shadow-sm">
              <span className="text-white text-xs font-bold"></span>
            </div>
            <div>
              <p className="font-semibold text-slate-200" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Hiver SDE Intern Assignment: @AppleSupport AI Agent
              </p>
              <p className="text-[11px] text-slate-500">
                "The proof is worth more than the system." • Kaggle Twitter Corpus (thoughtvector) • 200-Item Golden Harness
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
            <button
              onClick={() => setIsCliModalOpen(true)}
              className="text-emerald-400 hover:text-emerald-300 flex items-center space-x-1 transition-colors"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Reproduce in &lt; 15 mins</span>
            </button>
            <a
              href="https://intelligent-bar-256.notion.site/39492cbf0da2800682cfc78a600a745f"
              target="_blank"
              rel="noreferrer"
              className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 transition-colors"
            >
              <span>Submission Portal</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
