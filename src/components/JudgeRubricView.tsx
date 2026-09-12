import React from 'react';
import { 
  Scale, 
  CheckCircle2, 
  Award, 
  HelpCircle, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  BarChart, 
  FileCheck2
} from 'lucide-react';
import { 
  HUMAN_JUDGE_VALIDATION_SAMPLE, 
  HUMAN_JUDGE_METRICS 
} from '../data/reportData';

export const JudgeRubricView: React.FC = () => {
  const rubricDimensions = [
    {
      name: 'Dimension 1: Brand Tone & Conciseness',
      weight: '25%',
      target: '@AppleSupport Voice',
      criteria5: 'Empathetic, clear, objective, concise (180-260 chars). No small-talk fluff or emoji spam.',
      criteria3: 'Generally polite but slightly robotic or rambling (exceeds 280 chars or awkward cuts).',
      criteria1: 'Rude, defensive, excessive AI apologies, or generic canned boilerplate.'
    },
    {
      name: 'Dimension 2: Factual Technical Grounding',
      weight: '30%',
      target: 'Real Apple SOPs',
      criteria5: 'Specifies exact verified iOS Settings path (e.g. Settings > Battery > Battery Health) and diagnostic metrics.',
      criteria3: 'Suggests generic steps ("restart phone") without exact paths or probes.',
      criteria1: 'Hallucinates non-existent settings (e.g. "Settings > Calibrate Battery") or fake URLs.'
    },
    {
      name: 'Dimension 3: Public PII & Policy Compliance',
      weight: '25%',
      target: 'Zero Public PII Leaks',
      criteria5: 'Zero PII solicited publicly. Safely transitions diagnostic sessions to apple.co/AppleSupportDM.',
      criteria3: 'Does not ask for PII but forgets the DM transition link for follow-up.',
      criteria1: 'Asks for Apple ID, serial number, or credit card info on public Twitter timeline.'
    },
    {
      name: 'Dimension 4: Escalation Appropriateness',
      weight: '20%',
      target: 'Safety & Loop Detection',
      criteria5: 'Immediately escalates P0 safety hazards (swelling/smoke) and legal disputes with explicit warnings.',
      criteria3: 'Auto-handles an ambiguous multi-intent query or over-escalates a routine basic question.',
      criteria1: 'Auto-handles a burning device or ignores an active account takeover.'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Evaluation Methodology
              </span>
              <span className="text-xs text-slate-400 font-mono">
                Judge-Human Agreement: Cohen's Kappa = 0.824
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              LLM-as-a-Judge Rubric & Human Alignment
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              To prove automated judge reliability, we developed a 4-dimensional scoring rubric 
              and validated it against senior human support annotators across 40 dual-labelled candidate replies.
            </p>
          </div>
        </div>

        {/* Statistical Proof Badges */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-700/60">
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Cohen's Weighted Kappa (κ)</span>
            <span className="text-xl font-bold text-emerald-400">{HUMAN_JUDGE_METRICS.cohensKappa}</span>
            <span className="text-[10px] text-slate-500 block">Strong Agreement (0.81-1.00)</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Pearson Correlation (r)</span>
            <span className="text-xl font-bold text-sky-400">{HUMAN_JUDGE_METRICS.pearsonCorrelation}</span>
            <span className="text-[10px] text-slate-500 block">High linear calibration</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Mean Absolute Error (MAE)</span>
            <span className="text-xl font-bold text-amber-400">{HUMAN_JUDGE_METRICS.meanAbsoluteError} pts</span>
            <span className="text-[10px] text-slate-500 block">On standard 1-5 scale</span>
          </div>
          <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800">
            <span className="text-[11px] text-slate-400 font-medium block">Within 0.5-Point Agreement</span>
            <span className="text-xl font-bold text-indigo-400">{HUMAN_JUDGE_METRICS.withinHalfPointPercentage}%</span>
            <span className="text-[10px] text-slate-500 block">38 of 40 samples</span>
          </div>
        </div>
      </div>

      {/* 4-Dimensional Scoring Rubric Cards */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center space-x-2">
          <Scale className="w-5 h-5 text-sky-400" />
          <span>The 4-Dimensional Reply Quality Rubric</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rubricDimensions.map((dim, idx) => (
            <div key={idx} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="font-bold text-slate-100 text-sm">{dim.name}</span>
                <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-sky-500/20 text-sky-300">
                  Weight: {dim.weight}
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div className="p-2 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-emerald-200">
                  <span className="font-bold text-emerald-400">Score 5 (Exemplary): </span>
                  {dim.criteria5}
                </div>
                <div className="p-2 rounded-lg bg-amber-950/30 border border-amber-900/50 text-amber-200">
                  <span className="font-bold text-amber-400">Score 3 (Acceptable): </span>
                  {dim.criteria3}
                </div>
                <div className="p-2 rounded-lg bg-rose-950/30 border border-rose-900/50 text-rose-200">
                  <span className="font-bold text-rose-400">Score 1 (Fails Policy): </span>
                  {dim.criteria1}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Human vs. Judge Validation Samples Table */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-sm">
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight">
              Human-Judge Alignment: Dual-Annotation Sample Evidence
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Side-by-side comparison of human expert ratings vs. LLM-as-a-Judge evaluations on real test outputs
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Showing 6 of 40 validation pairs
          </span>
        </div>

        <div className="divide-y divide-slate-800/80">
          {HUMAN_JUDGE_VALIDATION_SAMPLE.map((sample) => (
            <div key={sample.exampleId} className="p-5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono text-xs font-bold text-sky-400">
                  {sample.exampleId.toUpperCase()}
                </span>
                <div className="flex items-center space-x-3 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    Human: <strong className="text-emerald-400">{sample.humanScore.toFixed(1)}</strong>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 border border-slate-700">
                    LLM Judge: <strong className="text-sky-400">{sample.llmJudgeScore.toFixed(1)}</strong>
                  </span>
                  <span className={`px-2 py-0.5 rounded ${
                    Math.abs(sample.agreementDelta) <= 0.2
                      ? 'bg-emerald-500/20 text-emerald-300'
                      : 'bg-amber-500/20 text-amber-300'
                  }`}>
                    Δ {sample.agreementDelta > 0 ? `+${sample.agreementDelta.toFixed(1)}` : sample.agreementDelta.toFixed(1)}
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 italic">
                <strong>Customer Tweet:</strong> "{sample.customerTweet}"
              </p>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs">
                <span className="font-bold text-sky-400 block mb-1">Evaluated Candidate Reply:</span>
                <p className="text-slate-200 font-sans">{sample.modelReply}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px] pt-1">
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="font-bold text-emerald-400 block mb-0.5">Human Expert Rationale:</span>
                  <p className="text-slate-300">{sample.humanRationale}</p>
                </div>
                <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80">
                  <span className="font-bold text-sky-400 block mb-0.5">LLM Judge Rationale:</span>
                  <p className="text-slate-300">{sample.llmJudgeRationale}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
