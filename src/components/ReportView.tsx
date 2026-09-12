import React, { useState } from 'react';
import { 
  FileText, 
  AlertOctagon, 
  HelpCircle, 
  Calendar, 
  Download, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { 
  EXECUTIVE_REPORT_SECTIONS, 
  TOP_5_FAILURE_MODES, 
  DECISION_LOG 
} from '../data/reportData';

export const ReportView: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'framing' | 'baselines' | 'failures' | 'misleading' | 'roadmap' | 'decisions'>('framing');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-500/20 text-sky-400 border border-sky-500/30">
                Hiver SDE Intern Evaluation Report
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Mandatory 6-Section Academic/Industry Spec
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Technical Report: @AppleSupport AI Agent
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              "The proof is worth more than the system." Comprehensive analysis of problem framing, 
              baseline comparisons, failure modes with transcripts, metric critique, and roadmap.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <a
              id="btn-export-report-tab"
              href="/api/export/report.md"
              download
              className="px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-xl transition flex items-center space-x-2 shadow-sm"
            >
              <Download className="w-4 h-4" />
              <span>Export Full Report (MD)</span>
            </a>
          </div>
        </div>

        {/* Section Tabs Bar */}
        <div className="flex overflow-x-auto space-x-2 mt-6 pt-6 border-t border-slate-700/60 no-scrollbar">
          {[
            { id: 'framing', label: '1. Problem Framing' },
            { id: 'baselines', label: '2. Results vs Baselines' },
            { id: 'failures', label: '3. Top 5 Failure Modes' },
            { id: 'misleading', label: '4. "What is Misleading?"' },
            { id: 'roadmap', label: '5. Next Week Roadmap' },
            { id: 'decisions', label: '6. Decision Log (14)' }
          ].map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`flex-shrink-0 px-3.5 py-2 rounded-xl text-xs font-semibold transition ${
                activeSection === sec.id
                  ? 'bg-sky-500 text-white shadow-sm shadow-sky-500/20'
                  : 'bg-slate-950/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: Problem Framing */}
      {activeSection === 'framing' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              1.1 What "Good" Means for @AppleSupport on Twitter
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Support on public social media differs fundamentally from internal chat desks. For @AppleSupport, 
              a successful interaction must balance zero-tolerance physical safety, absolute customer PII secrecy, 
              strict Twitter character brevity, and high-accuracy technical diagnosis.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {EXECUTIVE_REPORT_SECTIONS.problemFraming.whatGoodMeans.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-sky-400 text-xs flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span>{item.principle}</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight text-amber-300">
              1.2 What We Chose NOT to Build (Deliberate Scope Boundaries)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              True craftsmanship in production AI is defined by what you choose NOT to automate. 
              The following architectures were explicitly evaluated and rejected based on real-world operational hazard analysis:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {EXECUTIVE_REPORT_SECTIONS.problemFraming.whatWeChoseNotToBuild.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <span className="font-bold text-amber-400 text-xs flex items-center space-x-1.5">
                    <AlertOctagon className="w-4 h-4 text-amber-500 flex-shrink-0" />
                    <span>{item.item}</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {item.reason}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: Results vs Baselines */}
      {activeSection === 'baselines' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight">
              2. Results vs. Two Distinct Baselines (Trivial & Simple)
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              We evaluated our candidate against two established baseline methodologies across the entire 200-item golden evaluation test suite:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {EXECUTIVE_REPORT_SECTIONS.baselineComparisonSummary.map((b, idx) => (
                <div key={idx} className={`p-4 rounded-xl border space-y-2 ${
                  b.slug === 'candidate_rag'
                    ? 'bg-sky-950/20 border-sky-800 text-sky-100'
                    : 'bg-slate-950 border-slate-800 text-slate-300'
                }`}>
                  <span className="text-xs font-mono font-bold block text-sky-400 uppercase">
                    {b.slug === 'candidate_rag' ? 'Candidate System' : `Baseline ${idx + 1}`}
                  </span>
                  <h3 className="text-sm font-bold text-white">{b.name}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.description}</p>
                  
                  <div className="pt-3 border-t border-slate-800/80 space-y-1 font-mono text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Intent Acc:</span>
                      <span className="font-bold text-white">{(b.intentAccuracy * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Safety Recall:</span>
                      <span className="font-bold text-rose-400">{(b.safetyHazardRecall * 100).toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Judge Score:</span>
                      <span className="font-bold text-amber-400">{b.avgJudgeScore} / 5.0</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: Failure Modes */}
      {activeSection === 'failures' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-rose-400" />
              <span>3. Top 5 Real Failure Modes: Transcripts & Hypotheses</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every production system has failure modes. Below are the top 5 empirical failure modes identified during 
              stress testing of the pipeline on adversarial, sarcastic, and cascading multi-intent customer tweets.
            </p>
          </div>

          <div className="space-y-4">
            {TOP_5_FAILURE_MODES.map((f, idx) => (
              <div key={f.id} className="bg-slate-900 rounded-2xl border border-slate-800 p-6 space-y-4 shadow-sm">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xs">
                      {idx + 1}
                    </span>
                    <h3 className="text-sm font-bold text-white">{f.title}</h3>
                  </div>
                  <div className="flex items-center space-x-2 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                      Freq: {f.frequencyEstimate}
                    </span>
                    <span className={`px-2 py-0.5 rounded font-bold ${
                      f.severity === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                    }`}>
                      {f.severity}
                    </span>
                  </div>
                </div>

                {/* Transcript */}
                <div className="space-y-2 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-400 block mb-1">Incoming Customer Tweet:</span>
                    <p className="text-slate-100 italic">"{f.customerTweet}"</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                    <div className="p-3 rounded-xl bg-rose-950/20 border border-rose-900/40">
                      <span className="font-bold text-rose-400 block mb-1">Flawed Candidate Agent Output:</span>
                      <p className="text-slate-300">{f.candidateOutput.reply}</p>
                      <div className="mt-2 text-[10px] font-mono text-rose-300">
                        Classified: {f.candidateOutput.intent} • Escalate: {f.candidateOutput.escalate ? 'YES' : 'NO'} ({f.candidateOutput.reason})
                      </div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/40">
                      <span className="font-bold text-emerald-400 block mb-1">Human Ground Truth Expected:</span>
                      <p className="text-slate-300">{f.groundTruth.reply}</p>
                      <div className="mt-2 text-[10px] font-mono text-emerald-300">
                        Classified: {f.groundTruth.intent} • Escalate: {f.groundTruth.escalate ? 'YES' : 'NO'} ({f.groundTruth.reason})
                      </div>
                    </div>
                  </div>
                </div>

                {/* Root cause and mitigation */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-amber-400 block mb-1">Root Cause Hypothesis:</span>
                    <p className="text-slate-300 leading-relaxed">{f.rootCauseHypothesis}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-sky-400 block mb-1">Engineering Mitigation Strategy:</span>
                    <p className="text-slate-300 leading-relaxed">{f.mitigationStrategy}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: What is Misleading */}
      {activeSection === 'misleading' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              <h2 className="text-lg font-bold text-white tracking-tight">
                4. "What is Misleading About My Headline Number?" (Mandatory Self-Critique)
              </h2>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed">
              Engineering honesty is the hallmark of senior software development. 
              Headline benchmarks on synthetic or stratified evaluation subsets routinely obscure real-world deployment challenges. 
              Here is what our headline 94.5% accuracy and 96.0% escalation recall do NOT tell you:
            </p>

            <div className="space-y-4 pt-2">
              {EXECUTIVE_REPORT_SECTIONS.whatIsMisleading.criticalPoints.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-start space-x-2">
                    <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-mono text-[11px] font-bold mt-0.5">
                      The Claim
                    </span>
                    <p className="text-xs font-semibold text-slate-200">
                      {item.claim}
                    </p>
                  </div>
                  <div className="flex items-start space-x-2 pl-2 border-l-2 border-amber-500/40">
                    <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold mt-0.5">
                      The Operational Reality
                    </span>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {item.reality}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: Next Week Roadmap */}
      {activeSection === 'roadmap' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <Calendar className="w-5 h-5 text-sky-400" />
              <span>5. What We Would Do With One More Week</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              With 7 additional engineering days, we would transition this prototype from an offline evaluation suite 
              to an enterprise-grade live production stream with fleet anomaly detection and model distillation.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              {EXECUTIVE_REPORT_SECTIONS.nextWeekRoadmap.map((r, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded border border-sky-500/20">
                      {r.day}
                    </span>
                    <span className="text-xs font-semibold text-white">{r.initiative}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {r.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 6: Decision Log */}
      {activeSection === 'decisions' && (
        <div className="space-y-6">
          <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-sm space-y-3">
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <span>6. Decision Log: 14 Non-Obvious Engineering & Product Trade-Offs</span>
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Every architectural, mathematical, and operational decision made during the construction of this @AppleSupport system, 
              including alternatives considered, rationales, and observed impacts.
            </p>
          </div>

          <div className="space-y-4">
            {DECISION_LOG.map((d) => (
              <div key={d.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="font-mono text-xs font-bold text-sky-400">
                    Decision #{d.id}
                  </span>
                  <span className="text-xs font-semibold text-white">
                    {d.decision}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-slate-400 block mb-1">Alternatives Considered:</span>
                    <ul className="list-disc list-inside text-slate-400 space-y-0.5">
                      {d.alternativesConsidered.map((alt, i) => (
                        <li key={i}>{alt}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-emerald-400 block mb-1">Chosen & Rationale:</span>
                    <p className="text-slate-300 leading-relaxed">{d.rationale}</p>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <span className="font-bold text-sky-400 block mb-1">Observed Impact:</span>
                    <p className="text-slate-300 leading-relaxed">{d.observedImpact}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
