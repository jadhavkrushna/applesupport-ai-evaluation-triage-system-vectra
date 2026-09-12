import React, { useState, useEffect } from 'react';
import {
  Network,
  ShieldAlert,
  Cpu,
  CreditCard,
  Wifi,
  HelpCircle,
  CloudLightning,
  Loader2,
  ChevronDown,
  ChevronRight,
  MessageSquare,
  AlertTriangle,
  TrendingUp
} from 'lucide-react';

interface IntentData {
  id: string;
  label: string;
  description: string;
  exampleTweets: string[];
  escalationPropensity: string;
  p0SafetyRisk: boolean;
  shareOfGoldenSet: string;
}

interface TaxonomyResponse {
  brand: string;
  taxonomyVersion: string;
  totalIntents: number;
  derivationMethod: string;
  intents: IntentData[];
}

const INTENT_ICONS: Record<string, React.FC<{ className?: string }>> = {
  HARDWARE_BATTERY:      ({ className }) => <ShieldAlert className={className} />,
  SOFTWARE_OS_UPDATE:    ({ className }) => <Cpu className={className} />,
  ICLOUD_ACCOUNT_SECURITY: ({ className }) => <CloudLightning className={className} />,
  BILLING_SUBSCRIPTIONS: ({ className }) => <CreditCard className={className} />,
  CONNECTIVITY_AUDIO:    ({ className }) => <Wifi className={className} />,
  GENERAL_INQUIRY_FEEDBACK: ({ className }) => <HelpCircle className={className} />,
};

const INTENT_COLORS: Record<string, { gradient: string; badge: string; bar: string; glow: string }> = {
  HARDWARE_BATTERY:      { gradient: 'from-rose-500/20 to-orange-500/10',   badge: 'bg-rose-500/15 text-rose-300 border-rose-500/30',    bar: 'bg-rose-500',    glow: 'shadow-rose-500/20' },
  SOFTWARE_OS_UPDATE:    { gradient: 'from-sky-500/20 to-blue-500/10',      badge: 'bg-sky-500/15 text-sky-300 border-sky-500/30',       bar: 'bg-sky-500',     glow: 'shadow-sky-500/20' },
  ICLOUD_ACCOUNT_SECURITY: { gradient: 'from-violet-500/20 to-purple-500/10', badge: 'bg-violet-500/15 text-violet-300 border-violet-500/30', bar: 'bg-violet-500',  glow: 'shadow-violet-500/20' },
  BILLING_SUBSCRIPTIONS: { gradient: 'from-amber-500/20 to-yellow-500/10', badge: 'bg-amber-500/15 text-amber-300 border-amber-500/30',  bar: 'bg-amber-500',   glow: 'shadow-amber-500/20' },
  CONNECTIVITY_AUDIO:    { gradient: 'from-teal-500/20 to-cyan-500/10',     badge: 'bg-teal-500/15 text-teal-300 border-teal-500/30',    bar: 'bg-teal-500',    glow: 'shadow-teal-500/20' },
  GENERAL_INQUIRY_FEEDBACK: { gradient: 'from-slate-600/20 to-slate-500/10', badge: 'bg-slate-600/30 text-slate-300 border-slate-600/40', bar: 'bg-slate-500',   glow: 'shadow-slate-500/20' },
};

const PROPENSITY_COLORS: Record<string, string> = {
  low:       'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
  medium:    'bg-amber-500/15 text-amber-300 border border-amber-500/30',
  high:      'bg-orange-500/15 text-orange-300 border border-orange-500/30',
  very_high: 'bg-rose-500/15 text-rose-300 border border-rose-500/30',
};

export const IntentTaxonomyView: React.FC = () => {
  const [data, setData] = useState<TaxonomyResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>('HARDWARE_BATTERY');

  useEffect(() => {
    fetch('/api/intents')
      .then(r => r.json())
      .then(d => { setData(d); setLoading(false); })
      .catch(e => { setError(e.message); setLoading(false); });
  }, []);

  const toggle = (id: string) => setExpandedId(prev => prev === id ? null : id);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Hero */}
      <div className="relative overflow-hidden rounded-2xl p-7 bg-gradient-to-br from-slate-900 via-violet-950/30 to-slate-900 border border-violet-500/20 shadow-xl animate-fade-in-up">
        <div className="absolute inset-0 grid-overlay opacity-50 pointer-events-none" />
        <div className="relative z-10">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-violet-500 to-fuchsia-600 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Network className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                GET /api/intents
              </span>
              <h1 className="text-2xl font-bold text-white mt-0.5" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Operational Intent Taxonomy
              </h1>
            </div>
          </div>
          {data && (
            <p className="text-sm text-slate-300 max-w-3xl leading-relaxed">
              {data.derivationMethod}
            </p>
          )}
          {data && (
            <div className="mt-4 flex flex-wrap gap-3">
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <span className="font-semibold text-white">{data.totalIntents}</span>
                <span>Operational Intents</span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs text-slate-300">
                <span>Brand: <span className="font-semibold text-white">{data.brand}</span></span>
              </div>
              <div className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700/60 text-xs font-mono text-slate-300">
                v{data?.taxonomyVersion}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-20 space-x-3 text-slate-400">
          <Loader2 className="w-6 h-6 animate-spin text-violet-400" />
          <span className="text-sm">Loading intent taxonomy from /api/intents…</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-sm">
          Error loading intent taxonomy: {error}
        </div>
      )}

      {data && !loading && (
        <>
          {/* Intent Cards */}
          <div className="grid grid-cols-1 gap-4">
            {data.intents.map((intent, idx) => {
              const Icon = INTENT_ICONS[intent.id] ?? HelpCircle;
              const colors = INTENT_COLORS[intent.id] ?? INTENT_COLORS.GENERAL_INQUIRY_FEEDBACK;
              const isExpanded = expandedId === intent.id;
              const shareNum = parseFloat(intent.shareOfGoldenSet);

              return (
                <div
                  key={intent.id}
                  className={`rounded-xl border border-slate-800/80 bg-slate-900/80 overflow-hidden card-hover animate-fade-in-up shadow-md ${colors.glow}`}
                  style={{ animationDelay: `${idx * 60}ms` }}
                >
                  <button
                    className="w-full text-left"
                    onClick={() => toggle(intent.id)}
                  >
                    <div className={`p-5 bg-gradient-to-r ${colors.gradient} flex items-start gap-4`}>
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-0.5">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${colors.badge} border`}>
                          <Icon className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center flex-wrap gap-2 mb-1">
                          <span className="text-base font-bold text-white" style={{ fontFamily: 'Outfit, sans-serif' }}>
                            {intent.label}
                          </span>
                          <code className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${colors.badge}`}>
                            {intent.id}
                          </code>
                          {intent.p0SafetyRisk && (
                            <span className="flex items-center space-x-1 px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/40 text-[10px] font-bold">
                              <AlertTriangle className="w-3 h-3" />
                              <span>P0 Safety</span>
                            </span>
                          )}
                        </div>
                        <p className={`text-xs text-slate-300 leading-relaxed ${isExpanded ? '' : 'line-clamp-1'}`}>
                          {intent.description}
                        </p>

                        {/* Metrics row */}
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] text-slate-500 font-mono uppercase">Escalation Propensity</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${PROPENSITY_COLORS[intent.escalationPropensity]}`}>
                              {intent.escalationPropensity.replace('_', ' ')}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <TrendingUp className="w-3 h-3 text-slate-500" />
                            <span className="text-[10px] text-slate-400">{intent.shareOfGoldenSet} of Golden Set</span>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="mt-2.5 flex items-center space-x-2">
                          <div className="flex-1 h-1 rounded-full bg-slate-800/80 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${colors.bar} progress-bar-animated`}
                              style={{ width: `${shareNum}%` }}
                            />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono w-10 text-right">{intent.shareOfGoldenSet}</span>
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <div className="flex-shrink-0">
                        {isExpanded
                          ? <ChevronDown className="w-4 h-4 text-slate-400" />
                          : <ChevronRight className="w-4 h-4 text-slate-500" />
                        }
                      </div>
                    </div>
                  </button>

                  {/* Expanded: example tweets */}
                  {isExpanded && (
                    <div className="px-5 pb-5 border-t border-slate-800/70 animate-fade-in">
                      <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mt-4 mb-3 flex items-center space-x-1.5">
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Representative Example Tweets</span>
                      </h3>
                      <div className="space-y-2">
                        {intent.exampleTweets.map((tweet, i) => (
                          <div
                            key={i}
                            className="flex items-start space-x-2.5 p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs"
                          >
                            <span className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${colors.badge} border mt-0.5`}>
                              {i + 1}
                            </span>
                            <p className="text-slate-300 italic leading-relaxed">"{tweet}"</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* JSON Preview callout */}
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5 animate-fade-in-up">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
              Raw API Response — <code className="text-violet-400">GET /api/intents</code>
            </h3>
            <pre className="text-xs text-slate-300 font-mono overflow-x-auto bg-slate-950/60 rounded-lg p-4 border border-slate-800/60 max-h-56">
{JSON.stringify({ brand: data.brand, taxonomyVersion: data.taxonomyVersion, totalIntents: data.totalIntents, intents: data.intents.map(i => ({ id: i.id, label: i.label, escalationPropensity: i.escalationPropensity, p0SafetyRisk: i.p0SafetyRisk, shareOfGoldenSet: i.shareOfGoldenSet })) }, null, 2)}
            </pre>
          </div>
        </>
      )}
    </div>
  );
};
