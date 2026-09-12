import React, { useState } from 'react';
import {
  ListChecks,
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  GitBranch,
  Target,
  Zap
} from 'lucide-react';
import { DECISION_LOG } from '../data/reportData';

const SEVERITY_COLORS: Record<number, { border: string; badge: string; dot: string }> = {
  1:  { border: 'border-rose-500/60',    badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',    dot: 'bg-rose-500' },
  2:  { border: 'border-amber-500/60',   badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',   dot: 'bg-amber-500' },
  3:  { border: 'border-sky-500/60',     badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',     dot: 'bg-sky-500' },
  4:  { border: 'border-violet-500/60',  badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30',  dot: 'bg-violet-500' },
  5:  { border: 'border-emerald-500/60', badge: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30', dot: 'bg-emerald-500' },
  6:  { border: 'border-cyan-500/60',    badge: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',    dot: 'bg-cyan-500' },
  7:  { border: 'border-indigo-500/60',  badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',  dot: 'bg-indigo-500' },
  8:  { border: 'border-teal-500/60',    badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',    dot: 'bg-teal-500' },
  9:  { border: 'border-pink-500/60',    badge: 'bg-pink-500/15 text-pink-300 border-pink-500/30',    dot: 'bg-pink-500' },
  10: { border: 'border-yellow-500/60',  badge: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',  dot: 'bg-yellow-500' },
  11: { border: 'border-lime-500/60',    badge: 'bg-lime-500/15 text-lime-300 border-lime-500/30',    dot: 'bg-lime-500' },
  12: { border: 'border-orange-500/60',  badge: 'bg-orange-500/15 text-orange-300 border-orange-500/30',  dot: 'bg-orange-500' },
  13: { border: 'border-fuchsia-500/60', badge: 'bg-fuchsia-500/15 text-fuchsia-300 border-fuchsia-500/30', dot: 'bg-fuchsia-500' },
  14: { border: 'border-sky-400/60',     badge: 'bg-sky-400/15 text-sky-300 border-sky-400/30',     dot: 'bg-sky-400' },
};

function getColor(id: number) {
  return SEVERITY_COLORS[id] ?? SEVERITY_COLORS[3];
}

export const DecisionLogView: React.FC = () => {
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const toggle = (id: number) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-7 bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-900 border border-indigo-500/20 shadow-xl animate-fade-in-up">
        <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <ListChecks className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Architectural Transparency
                </span>
              </div>
              <h1 className="text-2xl font-bold text-white mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Engineering Decision Log
              </h1>
            </div>
          </div>
          <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
            Every non-trivial architectural decision made during this project is documented below with
            alternatives considered, the chosen approach, the rationale, and the observed impact.
            This demonstrates engineering judgment — not just implementation.
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <GitBranch className="w-3.5 h-3.5 text-indigo-400" />
              <span className="font-semibold text-white">{DECISION_LOG.length}</span>
              <span>Architecture Decisions</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <Target className="w-3.5 h-3.5 text-sky-400" />
              <span>Each with measured impact</span>
            </div>
            <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>Alternatives considered + rationale</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative timeline-connector pl-12 space-y-4">
        {DECISION_LOG.map((entry, idx) => {
          const colors = getColor(entry.id);
          const isExpanded = expandedId === entry.id;
          return (
            <div
              key={entry.id}
              className={`relative animate-fade-in-up card-hover`}
              style={{ animationDelay: `${idx * 40}ms` }}
            >
              {/* Timeline node */}
              <div className="absolute -left-12 top-5 flex items-center justify-center">
                <div className={`w-8 h-8 rounded-full border-2 ${colors.border} bg-slate-950 flex items-center justify-center shadow-lg z-10`}>
                  <span className="text-[10px] font-bold text-white font-mono">{String(entry.id).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Card */}
              <div
                className={`rounded-xl border ${colors.border} bg-slate-900/70 overflow-hidden transition-all duration-300 ${isExpanded ? 'shadow-lg' : 'shadow-sm'}`}
              >
                {/* Header — always visible */}
                <button
                  className="w-full text-left px-5 py-4 flex items-start justify-between gap-4 group"
                  onClick={() => toggle(entry.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${colors.badge}`}>
                        Decision #{entry.id}
                      </span>
                    </div>
                    <p className="text-sm font-semibold text-slate-100 leading-snug group-hover:text-white transition-colors">
                      {entry.decision}
                    </p>
                    {!isExpanded && (
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">
                        {entry.rationale}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 mt-1">
                    {isExpanded
                      ? <ChevronDown className="w-4 h-4 text-slate-400" />
                      : <ChevronRight className="w-4 h-4 text-slate-500" />
                    }
                  </div>
                </button>

                {/* Expanded Detail */}
                {isExpanded && (
                  <div className="px-5 pb-5 border-t border-slate-800/80 space-y-4 animate-fade-in">
                    {/* Alternatives Considered */}
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                        <GitBranch className="w-3.5 h-3.5 text-slate-500" />
                        <span>Alternatives Considered</span>
                      </h3>
                      <div className="flex flex-wrap gap-1.5">
                        {entry.alternativesConsidered.map((alt, i) => {
                          const isChosen = alt === entry.chosenAlternative;
                          return (
                            <span
                              key={i}
                              className={`px-2.5 py-1 rounded-md text-xs border font-medium ${
                                isChosen
                                  ? `${colors.badge} font-semibold`
                                  : 'bg-slate-800/50 text-slate-400 border-slate-700/60 line-through opacity-60'
                              }`}
                            >
                              {isChosen && <CheckCircle2 className="w-3 h-3 inline mr-1 -mt-0.5" />}
                              {alt}
                            </span>
                          );
                        })}
                      </div>
                    </div>

                    {/* Rationale */}
                    <div>
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                        <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
                        <span>Rationale</span>
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed">
                        {entry.rationale}
                      </p>
                    </div>

                    {/* Observed Impact */}
                    <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-800/50">
                      <h3 className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1 flex items-center space-x-1.5">
                        <Zap className="w-3.5 h-3.5" />
                        <span>Observed Impact</span>
                      </h3>
                      <p className="text-sm text-emerald-300 font-medium leading-relaxed">
                        {entry.observedImpact}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Footer */}
      <div className="mt-6 p-5 rounded-xl bg-slate-900/60 border border-slate-800 text-center animate-fade-in-up">
        <p className="text-sm text-slate-400">
          <span className="text-white font-semibold">{DECISION_LOG.length} architectural decisions</span>{' '}
          documented with alternatives, rationale, and measured outcomes — demonstrating engineering judgment
          beyond implementation.
        </p>
      </div>
    </div>
  );
};
