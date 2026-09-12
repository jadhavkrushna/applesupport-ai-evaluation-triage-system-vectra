import React, { useState } from 'react';
import { 
  Send, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  HelpCircle,
  ShieldAlert,
  ArrowRight,
  RotateCcw,
  Layers,
  Cpu
} from 'lucide-react';
import { PipelineResult } from '../types';

const SAMPLE_PRESETS = [
  {
    label: 'Thermal Safety Hazard (P0)',
    category: 'HARDWARE_BATTERY',
    tweet: '@AppleSupport URGENT! My iPhone 12 back glass is bulging out and the screen has popped open. Smells like burning chemical plastic right now!'
  },
  {
    label: 'Standard Battery Drain (Auto)',
    category: 'HARDWARE_BATTERY',
    tweet: '@AppleSupport my iPhone 13 battery dropped 40% in two hours while just sitting on my desk on standby. iOS 17.2 installed last week.'
  },
  {
    label: 'Apple ID Compromise (P1)',
    category: 'ICLOUD_ACCOUNT_SECURITY',
    tweet: '@AppleSupport someone in another country just tried to log into my iCloud and changed my trusted email! Help!'
  },
  {
    label: 'Billing & Chargeback Threat',
    category: 'BILLING_SUBSCRIPTIONS',
    tweet: '@AppleSupport YOU REFUSED MY REFUND FOR A BROKEN APP 3 TIMES. I AM FILING A DISPUTE WITH CHASE BANK AND REPORTING YOU TO FTC!'
  },
  {
    label: 'Sarcastic Battery Complaint',
    category: 'HARDWARE_BATTERY',
    tweet: '@AppleSupport wonderful job team! My phone battery now lasts a glorious 18 minutes! Truly revolutionary technology!'
  },
  {
    label: 'Multi-Intent Cascading Issue',
    category: 'SOFTWARE_OS_UPDATE',
    tweet: '@AppleSupport updated to iOS 17.3 now my battery is draining 30% an hour AND my AirPods keep disconnecting AND I was billed twice for iCloud storage??'
  }
];

export const PlaygroundView: React.FC = () => {
  const [tweetInput, setTweetInput] = useState(SAMPLE_PRESETS[0].tweet);
  const [method, setMethod] = useState<'candidate_rag' | 'baseline_zero_shot' | 'baseline_trivial_keyword'>('candidate_rag');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PipelineResult | null>(null);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRun = async () => {
    if (!tweetInput.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pipeline/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerTweet: tweetInput, method })
      });
      if (!res.ok) {
        throw new Error('Pipeline call failed');
      }
      const data = await res.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to process tweet');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (result?.draftReply) {
      navigator.clipboard.writeText(result.draftReply);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Intro Banner */}
      <div className="mb-8 p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Live Interactive Triage
              </span>
              <span className="text-xs text-slate-400 font-mono">
                System: Dual-Stage Guardrailed RAG Agent
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              @AppleSupport Live Agent Sandbox
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Test incoming customer tweets against our pipeline. Observe real-time intent classification, 
              historical Kaggle retrieval, deterministic policy escalation with stated rationale, and 280-character grounded reply generation.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setTweetInput(SAMPLE_PRESETS[0].tweet);
                setResult(null);
              }}
              className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition flex items-center space-x-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Sandbox</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Input & Controls (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Presets */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center justify-between">
              <span>Quick Test Presets (Real-world Strata)</span>
              <span className="text-[11px] font-mono text-sky-400">6 Scenarios</span>
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {SAMPLE_PRESETS.map((p, idx) => (
                <button
                  key={idx}
                  id={`preset-${idx}`}
                  onClick={() => {
                    setTweetInput(p.tweet);
                    setResult(null);
                  }}
                  className="text-left p-2.5 rounded-lg text-xs bg-slate-800/80 hover:bg-slate-800 border border-slate-700/70 hover:border-sky-500/50 transition group"
                >
                  <p className="font-semibold text-slate-200 group-hover:text-sky-300 truncate">
                    {p.label}
                  </p>
                  <p className="text-[10px] text-slate-400 truncate mt-0.5">
                    {p.category}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Model Architecture Selector */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
              Inference Mode & Architecture
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setMethod('candidate_rag')}
                className={`p-2.5 rounded-lg text-xs font-semibold border transition text-center ${
                  method === 'candidate_rag'
                    ? 'bg-sky-500/20 text-sky-300 border-sky-500 shadow-sm shadow-sky-500/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="block font-bold">Candidate</span>
                <span className="text-[10px] opacity-80 font-normal">Guardrailed RAG</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('baseline_zero_shot')}
                className={`p-2.5 rounded-lg text-xs font-semibold border transition text-center ${
                  method === 'baseline_zero_shot'
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500 shadow-sm shadow-purple-500/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="block font-bold">Baseline 2</span>
                <span className="text-[10px] opacity-80 font-normal">Zero-Shot LLM</span>
              </button>
              <button
                type="button"
                onClick={() => setMethod('baseline_trivial_keyword')}
                className={`p-2.5 rounded-lg text-xs font-semibold border transition text-center ${
                  method === 'baseline_trivial_keyword'
                    ? 'bg-amber-500/20 text-amber-300 border-amber-500 shadow-sm shadow-amber-500/20'
                    : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:text-slate-200'
                }`}
              >
                <span className="block font-bold">Baseline 1</span>
                <span className="text-[10px] opacity-80 font-normal">Trivial Keyword</span>
              </button>
            </div>
          </div>

          {/* Tweet Input Box */}
          <div className="bg-slate-900 p-5 rounded-xl border border-slate-800 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="tweet-input" className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Incoming Customer Tweet (@AppleSupport)
              </label>
              <span className={`text-xs font-mono ${tweetInput.length > 280 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                {tweetInput.length} / 280
              </span>
            </div>
            <textarea
              id="tweet-input"
              rows={4}
              value={tweetInput}
              onChange={(e) => setTweetInput(e.target.value)}
              placeholder="e.g. @AppleSupport my iPhone battery dropped 30% in an hour..."
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 font-sans"
            />

            <button
              id="btn-run-pipeline"
              onClick={handleRun}
              disabled={loading || !tweetInput.trim()}
              className="mt-4 w-full py-3 px-4 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 hover:from-sky-400 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Executing Pipeline...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>Execute Pipeline & Triage</span>
                </>
              )}
            </button>

            {error && (
              <p className="mt-2 text-xs text-rose-400 bg-rose-950/40 p-2 rounded border border-rose-900">
                {error}
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Execution Traces & Triage Results (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {!result && !loading && (
            <div className="bg-slate-900/60 rounded-2xl border border-dashed border-slate-800 p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 mx-auto flex items-center justify-center text-slate-400 mb-4">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-base font-semibold text-slate-200">
                Ready for Pipeline Execution
              </h3>
              <p className="text-sm text-slate-400 max-w-md mx-auto mt-1">
                Select one of the real-world preset scenarios on the left or type your own tweet, 
                then click <span className="text-sky-400 font-semibold">Execute Pipeline & Triage</span> to inspect the multi-step decision pipeline.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-slate-900 rounded-2xl border border-slate-800 p-8 space-y-6 animate-pulse">
              <div className="h-6 bg-slate-800 rounded w-1/3" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-24 bg-slate-800 rounded-xl" />
                <div className="h-24 bg-slate-800 rounded-xl" />
              </div>
              <div className="h-32 bg-slate-800 rounded-xl" />
            </div>
          )}

          {result && !loading && (
            <div className="space-y-6">
              {/* Step 1 & 2 Cards: Intent & Escalation Decision */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Intent Card */}
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm relative overflow-hidden">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1">
                      <Layers className="w-3.5 h-3.5 text-sky-400" />
                      <span>Step 1: Intent Classified</span>
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-500/20 text-sky-300 border border-sky-500/30">
                      {(result.intentConfidence * 100).toFixed(0)}% Conf
                    </span>
                  </div>

                  <p className="text-lg font-bold text-white tracking-tight">
                    {result.intent.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    {result.reasoning}
                  </p>
                </div>

                {/* Escalation Policy Card */}
                <div className={`p-5 rounded-2xl border shadow-sm ${
                  result.escalation.escalate
                    ? 'bg-rose-950/30 border-rose-800/80 text-rose-100'
                    : 'bg-emerald-950/30 border-emerald-800/80 text-emerald-100'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider flex items-center space-x-1">
                      {result.escalation.escalate ? (
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
                      ) : (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      )}
                      <span className={result.escalation.escalate ? 'text-rose-400' : 'text-emerald-400'}>
                        Step 2: Policy Escalation
                      </span>
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      result.escalation.escalate
                        ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      {result.escalation.escalate ? 'ESCALATE' : 'AUTO-HANDLE'}
                    </span>
                  </div>

                  <p className="text-sm font-bold tracking-tight">
                    Reason: {result.escalation.reasonCode.replace(/_/g, ' ')}
                  </p>
                  <p className="text-xs mt-1 text-slate-300 leading-relaxed">
                    {result.escalation.statedReason}
                  </p>

                  {result.escalation.suggestedDepartment && (
                    <div className="mt-2 pt-2 border-t border-slate-700/50 text-[11px] text-slate-300 flex items-center space-x-1">
                      <span className="font-semibold text-slate-400">Routing Queue:</span>
                      <span className="text-white">{result.escalation.suggestedDepartment}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Step 3: Grounded Historical RAG Retrieval */}
              {result.retrievedContexts && result.retrievedContexts.length > 0 && (
                <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>Step 3: Grounded Historical Retrieval (RAG from Kaggle Corpus)</span>
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Top {result.retrievedContexts.length} Matches
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {result.retrievedContexts.map((ctx, idx) => (
                      <div key={idx} className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs">
                        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
                          <span className="font-mono font-semibold text-amber-300">
                            Historical Case #{ctx.id}
                          </span>
                          <span className="font-mono text-slate-500">
                            Relevance: {(ctx.similarityScore * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p className="text-slate-300 italic mb-1.5">
                          "{ctx.customerTweet}"
                        </p>
                        <div className="p-2 rounded bg-slate-900 border border-slate-800 text-slate-200">
                          <span className="font-semibold text-sky-400">@AppleSupport SOP: </span>
                          {ctx.brandReply}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 4: Drafted Reply (Twitter Payload & 280 Char Bar) */}
              <div className="bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
                    <Send className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Step 4: Drafted Support Reply (@AppleSupport)</span>
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs font-mono px-2 py-0.5 rounded ${
                      result.isWithinTwitterLimit
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                    }`}>
                      {result.characterCount} / 280 chars
                    </span>
                    <button
                      onClick={handleCopy}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Copy draft reply"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Simulated Twitter Card */}
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800">
                  <div className="flex items-center space-x-2.5 mb-2.5">
                    <div className="w-8 h-8 rounded-full bg-black border border-slate-700 flex items-center justify-center font-bold text-xs text-white">
                      
                    </div>
                    <div>
                      <div className="flex items-center space-x-1">
                        <span className="font-bold text-sm text-white">Apple Support</span>
                        <span className="text-sky-400 text-xs">✓</span>
                      </div>
                      <span className="text-[11px] text-slate-400">@AppleSupport</span>
                    </div>
                  </div>

                  <p className="text-sm text-slate-100 font-sans leading-relaxed whitespace-pre-wrap">
                    {result.draftReply}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center space-x-1">
                      <Clock className="w-3 h-3 text-slate-500" />
                      <span>Inference: {result.executionTimeMs} ms</span>
                    </span>
                    <span className="font-mono text-emerald-400">
                      DM Protected (apple.co/AppleSupportDM)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
