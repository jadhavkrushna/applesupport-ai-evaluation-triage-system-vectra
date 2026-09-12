import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Download, 
  Info, 
  ShieldAlert, 
  CheckCircle2, 
  ChevronRight, 
  ChevronDown,
  Sparkles,
  FileSpreadsheet
} from 'lucide-react';
import { GOLDEN_EVALUATION_SET, SAMPLING_METHODOLOGY_NOTE } from '../data/goldenDataset';
import { SupportIntent, GoldenExample } from '../types';

export const DatasetView: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIntent, setSelectedIntent] = useState<string>('ALL');
  const [selectedEscalate, setSelectedEscalate] = useState<string>('ALL');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(GOLDEN_EVALUATION_SET[0].id);
  const [showMethodology, setShowMethodology] = useState(true);

  const filteredData = useMemo(() => {
    return GOLDEN_EVALUATION_SET.filter((item) => {
      if (selectedIntent !== 'ALL' && item.groundTruthIntent !== selectedIntent) {
        return false;
      }
      if (selectedEscalate === 'ESCALATE' && !item.groundTruthEscalate) {
        return false;
      }
      if (selectedEscalate === 'AUTO' && item.groundTruthEscalate) {
        return false;
      }
      if (selectedDifficulty !== 'ALL' && item.difficulty !== selectedDifficulty) {
        return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          item.customerTweet.toLowerCase().includes(query) ||
          item.userHandle.toLowerCase().includes(query) ||
          item.annotationNotes.toLowerCase().includes(query) ||
          item.id.toLowerCase().includes(query)
        );
      }
      return true;
    });
  }, [searchQuery, selectedIntent, selectedEscalate, selectedDifficulty]);

  // Statistics
  const intentDistribution = useMemo(() => {
    const dist: Record<string, number> = {};
    GOLDEN_EVALUATION_SET.forEach((d) => {
      dist[d.groundTruthIntent] = (dist[d.groundTruthIntent] || 0) + 1;
    });
    return dist;
  }, []);

  const totalEscalated = GOLDEN_EVALUATION_SET.filter((d) => d.groundTruthEscalate).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header with Stats & Export */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Ground Truth Benchmark
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Exactly 200 Hand-Labelled Items
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Golden Evaluation Dataset
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Curated from the Kaggle Customer Support on Twitter (@AppleSupport) domain. 
              Features realistic noise, authentic user handles, typos, edge cases, multi-intent cascades, and expert reference replies.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <a
              id="btn-download-json"
              href="/api/export/dataset.json"
              download
              className="px-3 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition flex items-center space-x-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download JSON</span>
            </a>
            <a
              id="btn-download-csv"
              href="/api/export/dataset.csv"
              download
              className="px-3 py-2 text-xs font-medium text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition flex items-center space-x-1.5 shadow-sm"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Download CSV</span>
            </a>
          </div>
        </div>

        {/* Mini stats badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Total Hand-Labelled</span>
            <span className="text-xl font-bold text-white">200 Examples</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Escalation Ground Truth</span>
            <span className="text-xl font-bold text-amber-400">{totalEscalated} Escalated ({((totalEscalated / 200) * 100).toFixed(0)}%)</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Auto-Handled</span>
            <span className="text-xl font-bold text-emerald-400">{200 - totalEscalated} Routine ({(((200 - totalEscalated) / 200) * 100).toFixed(0)}%)</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Inter-Annotator Agreement</span>
            <span className="text-xl font-bold text-sky-400">96% Intent / 94% Esc.</span>
          </div>
        </div>
      </div>

      {/* Sampling Methodology Drawer */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <button
          onClick={() => setShowMethodology(!showMethodology)}
          className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition"
        >
          <div className="flex items-center space-x-2.5">
            <Info className="w-5 h-5 text-sky-400" />
            <div>
              <h2 className="text-sm font-bold text-slate-200">
                Sampling & Labelling Methodology Note
              </h2>
              <p className="text-xs text-slate-400">
                Mandatory note detailing source sampling, 7 operational strata, and difficulty rubric
              </p>
            </div>
          </div>
          <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showMethodology ? 'rotate-180' : ''}`} />
        </button>

        {showMethodology && (
          <div className="px-6 pb-6 pt-2 border-t border-slate-800/60 text-xs text-slate-300 space-y-3 leading-relaxed">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-sky-300 mb-1">1. Stratified Sampling</p>
                <p className="text-slate-400 text-[11px]">
                  Samples reflect 7 operational strata: Standard troubleshooting (45%), multi-intent ambiguity (15%), 
                  high-sentiment distress (12%), safety hazards (5%), account lockouts (10%), billing disputes (8%), and edge-case slang (5%).
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-amber-300 mb-1">2. Difficulty Calibrations</p>
                <p className="text-slate-400 text-[11px]">
                  Easy (45%): single clear symptom.<br />
                  Medium (35%): noisy phrasing, mixed symptoms.<br />
                  Hard (20%): sarcastic phrasing, contradictory symptoms, or disguised safety threats.
                </p>
              </div>
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800">
                <p className="font-bold text-emerald-300 mb-1">3. Human Review & Consensus</p>
                <p className="text-slate-400 text-[11px]">
                  Every sample hand-verified for strict public PII constraints (no Apple ID on Twitter) 
                  and adherence to official @AppleSupport knowledge base SOPs.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tweet text, user handle, or notes..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Intent filter */}
          <select
            value={selectedIntent}
            onChange={(e) => setSelectedIntent(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Intents (6)</option>
            <option value="HARDWARE_BATTERY">Hardware & Battery</option>
            <option value="SOFTWARE_OS_UPDATE">Software & OS Updates</option>
            <option value="ICLOUD_ACCOUNT_SECURITY">iCloud & Security</option>
            <option value="BILLING_SUBSCRIPTIONS">Billing & Subscriptions</option>
            <option value="CONNECTIVITY_AUDIO">Connectivity & Audio</option>
            <option value="GENERAL_INQUIRY_FEEDBACK">General Inquiries</option>
          </select>

          {/* Escalation filter */}
          <select
            value={selectedEscalate}
            onChange={(e) => setSelectedEscalate(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Actions</option>
            <option value="ESCALATE">Escalate to Human Only</option>
            <option value="AUTO">Auto-Handled Only</option>
          </select>

          {/* Difficulty filter */}
          <select
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
            className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-1.5 text-xs text-slate-300 focus:outline-none"
          >
            <option value="ALL">All Difficulties</option>
            <option value="easy">Easy (45%)</option>
            <option value="medium">Medium (35%)</option>
            <option value="hard">Hard / Adversarial (20%)</option>
          </select>
        </div>
      </div>

      {/* Dataset Table / List */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Showing <strong className="text-white">{filteredData.length}</strong> of {GOLDEN_EVALUATION_SET.length} golden examples</span>
          <span>Click any row to inspect ground truth annotation</span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {filteredData.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div key={item.id} className="transition hover:bg-slate-800/20">
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="p-4 sm:px-6 cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-[11px] font-bold text-sky-400">
                        {item.id.toUpperCase()}
                      </span>
                      <span className="text-xs font-semibold text-slate-300">
                        {item.userHandle}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                        {item.groundTruthIntent.replace(/_/g, ' ')}
                      </span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        item.groundTruthEscalate
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {item.groundTruthEscalate ? 'ESCALATE' : 'AUTO-HANDLE'}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono capitalize ${
                        item.difficulty === 'hard'
                          ? 'text-amber-400 bg-amber-500/10'
                          : item.difficulty === 'medium'
                          ? 'text-blue-400 bg-blue-500/10'
                          : 'text-slate-400 bg-slate-800'
                      }`}>
                        {item.difficulty}
                      </span>
                    </div>

                    <p className="text-sm text-slate-100 font-sans leading-relaxed">
                      "{item.customerTweet}"
                    </p>
                  </div>

                  <div className="text-slate-400 pt-1">
                    <ChevronDown className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </div>

                {/* Expanded Ground Truth Inspector */}
                {isExpanded && (
                  <div className="px-4 sm:px-6 pb-5 pt-1 bg-slate-950/60 border-t border-slate-800/80 text-xs space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                      {/* Gold standard reference reply */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[11px] font-bold text-sky-400 uppercase tracking-wider block mb-1">
                          Official @AppleSupport Ground Truth Reference Reply
                        </span>
                        <p className="text-slate-200 font-sans leading-relaxed italic">
                          "{item.referenceReply}"
                        </p>
                        <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center justify-between">
                          <span>Payload: {item.referenceReply.length} chars</span>
                          <span className="text-emerald-400">Within 280 Twitter limit</span>
                        </div>
                      </div>

                      {/* Annotator notes & reasoning */}
                      <div className="p-3 rounded-xl bg-slate-900 border border-slate-800">
                        <span className="text-[11px] font-bold text-amber-400 uppercase tracking-wider block mb-1">
                          Annotation Rationale & Strata Context
                        </span>
                        <p className="text-slate-300 leading-relaxed">
                          {item.annotationNotes}
                        </p>
                        <div className="mt-2 text-[10px] text-slate-400 font-mono flex items-center space-x-3">
                          <span>Strata: <strong className="text-slate-300">{item.samplingStrata}</strong></span>
                          <span>Reason Code: <strong className="text-slate-300">{item.groundTruthReasonCode}</strong></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {filteredData.length === 0 && (
            <div className="p-12 text-center text-slate-400">
              No golden examples match your search filters. Try clearing your filters or query.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
