import React, { useState } from 'react';
import { Terminal, Copy, Check, X, ExternalLink, ShieldCheck } from 'lucide-react';

interface CliModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CliModal: React.FC<CliModalProps> = ({ isOpen, onClose }) => {
  const [copiedCmd, setCopiedCmd] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (cmd: string) => {
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(cmd);
    setTimeout(() => setCopiedCmd(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight">
              15-Minute Headline Reproduction Guide
            </h2>
            <p className="text-xs text-slate-400 font-mono">
              Self-Contained Evaluation Suite • Zero API Rate-Limit Dependency
            </p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          As required by the Hiver SDE Intern Take-Home specification, you can reproduce the complete 
          headline benchmark results across all 200 items in our golden evaluation suite in under 15 seconds.
        </p>

        {/* Command 1: Run Eval */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Step 1: Execute Evaluation Harness (CLI Benchmark)
          </span>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-emerald-300">
            <span>npm run eval</span>
            <button
              onClick={() => copyToClipboard('npm run eval')}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Copy command"
            >
              {copiedCmd === 'npm run eval' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Command 2: Start Web Dashboard */}
        <div className="space-y-1.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Step 2: Start Interactive Full-Stack Web Application
          </span>
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800 font-mono text-xs text-sky-300">
            <span>npm run dev</span>
            <button
              onClick={() => copyToClipboard('npm run dev')}
              className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title="Copy command"
            >
              {copiedCmd === 'npm run dev' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Borrowed Code & Attributions Notice */}
        <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300 space-y-1.5">
          <span className="font-bold text-sky-400 block">
            Citations & Attribution (Mandatory Prompt Requirement):
          </span>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li><strong>Kaggle Dataset:</strong> thoughtvector/customer-support-on-twitter (~3M multi-turn tweets).</li>
            <li><strong>Official Apple Twitter SOPs:</strong> Historical @AppleSupport verified resolution patterns.</li>
            <li><strong>LLM SDK:</strong> @google/genai (Google DeepMind official TypeScript client).</li>
            <li><strong>Evaluation Theory:</strong> Cohen's Weighted Kappa & Inter-Rater Reliability (Fleiss / Landis & Koch).</li>
          </ul>
        </div>

        {/* Submission link */}
        <div className="pt-2 flex items-center justify-between border-t border-slate-800 text-xs">
          <a
            href="https://intelligent-bar-256.notion.site/39492cbf0da2800682cfc78a600a745f"
            target="_blank"
            rel="noreferrer"
            className="text-sky-400 hover:text-sky-300 flex items-center space-x-1 font-mono"
          >
            <span>Hiver Submission Form</span>
            <ExternalLink className="w-3 h-3" />
          </a>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-semibold transition"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
