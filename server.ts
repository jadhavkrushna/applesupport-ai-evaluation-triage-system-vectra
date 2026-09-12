import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { runAgentPipeline } from './src/lib/pipeline';
import { GOLDEN_EVALUATION_SET, SAMPLING_METHODOLOGY_NOTE } from './src/data/goldenDataset';
import {
  ALL_BASELINE_COMPARISONS,
  BASELINE_TRIVIAL_PREDICTIONS,
  BASELINE_SIMPLE_PREDICTIONS,
  CANDIDATE_AGENT_PREDICTIONS,
  BASELINE_TRIVIAL_METRICS,
  BASELINE_SIMPLE_METRICS,
  CANDIDATE_AGENT_METRICS
} from './src/data/baselineResults';
import {
  EXECUTIVE_REPORT_SECTIONS,
  TOP_5_FAILURE_MODES,
  DECISION_LOG,
  HUMAN_JUDGE_VALIDATION_SAMPLE,
  HUMAN_JUDGE_METRICS
} from './src/data/reportData';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- API Endpoints ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'AppleSupport AI Evaluation & Triage System',
      hasGeminiApiKey: Boolean(process.env.GEMINI_API_KEY)
    });
  });

  // GET /api/intents — return the full operational intent taxonomy
  app.get('/api/intents', (req, res) => {
    res.json({
      brand: '@AppleSupport',
      taxonomyVersion: '1.0.0',
      totalIntents: 6,
      derivationMethod: 'Embedding-cluster inspection of Kaggle Twitter corpus (@AppleSupport domain, ~84k tweets), followed by manual human naming and SOP cross-referencing.',
      intents: [
        {
          id: 'HARDWARE_BATTERY',
          label: 'Hardware & Battery',
          description: 'Customer reports physical device problems: battery drain, battery health degradation, overheating, swollen/bulging battery (P0 safety), broken screen, button failures, port issues, liquid damage, or power-on failures.',
          exampleTweets: [
            '@AppleSupport my iPhone 13 battery dropped 40% in two hours on standby',
            '@AppleSupport URGENT! My iPhone 12 back glass is bulging out — smells like burning plastic!',
            '@AppleSupport charger only works tilted at a weird angle, dust in port?'
          ],
          escalationPropensity: 'high',
          p0SafetyRisk: true,
          shareOfGoldenSet: '17.5%'
        },
        {
          id: 'SOFTWARE_OS_UPDATE',
          label: 'Software & OS / Updates',
          description: 'Customer experiences software-layer failures: iOS/macOS update stuck or failed, app crashes, boot loops, frozen screens, storage bugs, Safari/browser glitches, or feature regressions after an update.',
          exampleTweets: [
            '@AppleSupport iOS update stuck on Preparing Update for 4 hours',
            '@AppleSupport after 17.3 my screen randomly goes black and I have to force restart',
            '@AppleSupport Safari crashes every time I open it since the latest update'
          ],
          escalationPropensity: 'medium',
          p0SafetyRisk: false,
          shareOfGoldenSet: '17.5%'
        },
        {
          id: 'ICLOUD_ACCOUNT_SECURITY',
          label: 'iCloud / Apple ID / Account Security',
          description: 'Customer cannot access their Apple ID, reports 2FA issues, account recovery delays, iCloud sync failures, Find My problems, phishing attempts, or active account compromise.',
          exampleTweets: [
            '@AppleSupport my Apple ID is locked and I cannot receive the 2FA code',
            '@AppleSupport someone in another country logged into my iCloud and changed my email!',
            '@AppleSupport iCloud photos stopped syncing 3 days ago, storage shows full but isn\'t'
          ],
          escalationPropensity: 'very_high',
          p0SafetyRisk: false,
          shareOfGoldenSet: '17.5%'
        },
        {
          id: 'BILLING_SUBSCRIPTIONS',
          label: 'Billing & Subscriptions',
          description: 'Customer reports unexpected charges, subscription management issues, refund requests for app purchases, accidental in-app purchases, payment method failures, or formal financial disputes.',
          exampleTweets: [
            '@AppleSupport I was charged $9.99 for an app I never downloaded',
            '@AppleSupport I cancelled Apple One 3 months ago but you\'re still charging me',
            '@AppleSupport filing a dispute with my bank — you refused my refund 3 times!'
          ],
          escalationPropensity: 'high',
          p0SafetyRisk: false,
          shareOfGoldenSet: '17.5%'
        },
        {
          id: 'CONNECTIVITY_AUDIO',
          label: 'Connectivity & Audio',
          description: 'Customer experiences wireless connectivity problems: Wi-Fi dropping, Bluetooth pairing failures, AirPods one-sided audio or disconnects, CarPlay connection issues, cellular No SIM/SOS-only errors, or microphone/speaker faults.',
          exampleTweets: [
            '@AppleSupport my right AirPod Pro has no audio, left one works fine',
            '@AppleSupport iPhone keeps dropping Wi-Fi every 10 minutes even though router is fine',
            '@AppleSupport CarPlay disconnects every time I go over a bump'
          ],
          escalationPropensity: 'medium',
          p0SafetyRisk: false,
          shareOfGoldenSet: '17.5%'
        },
        {
          id: 'GENERAL_INQUIRY_FEEDBACK',
          label: 'General Inquiry & Feedback',
          description: 'Customer asks for general product information, Genius Bar appointment booking, education discount eligibility, trade-in value estimates, product compatibility questions, or submits general feature feedback.',
          exampleTweets: [
            '@AppleSupport is the iPhone 15 Pro compatible with MagSafe accessories from 2021?',
            '@AppleSupport how do I book a Genius Bar appointment for screen repair?',
            '@AppleSupport what\'s the trade-in value for an iPhone 12 Pro Max in good condition?'
          ],
          escalationPropensity: 'low',
          p0SafetyRisk: false,
          shareOfGoldenSet: '12.5%'
        }
      ]
    });
  });

  // Run live pipeline for a single tweet
  app.post('/api/pipeline/run', async (req, res) => {
    try {
      const { customerTweet, method = 'candidate_rag' } = req.body;
      if (!customerTweet || typeof customerTweet !== 'string') {
        res.status(400).json({ error: 'customerTweet is required' });
        return;
      }
      const result = await runAgentPipeline(customerTweet, method);
      res.json(result);
    } catch (err: any) {
      console.error('Error running pipeline:', err);
      res.status(500).json({ error: err.message || 'Pipeline execution failed' });
    }
  });

  // Get Golden Evaluation Dataset (200 items + sampling note)
  app.get('/api/dataset', (req, res) => {
    res.json({
      totalCount: GOLDEN_EVALUATION_SET.length,
      samplingMethodologyNote: SAMPLING_METHODOLOGY_NOTE,
      dataset: GOLDEN_EVALUATION_SET
    });
  });

  // Get Benchmark Metrics & Baseline Comparisons
  app.get('/api/metrics', (req, res) => {
    res.json({
      comparisons: ALL_BASELINE_COMPARISONS,
      models: {
        trivial: {
          metrics: BASELINE_TRIVIAL_METRICS,
          predictions: BASELINE_TRIVIAL_PREDICTIONS
        },
        simple: {
          metrics: BASELINE_SIMPLE_METRICS,
          predictions: BASELINE_SIMPLE_PREDICTIONS
        },
        candidate: {
          metrics: CANDIDATE_AGENT_METRICS,
          predictions: CANDIDATE_AGENT_PREDICTIONS
        }
      }
    });
  });

  // Get Comprehensive 6-Section Report & Decision Log
  app.get('/api/report', (req, res) => {
    res.json({
      sections: EXECUTIVE_REPORT_SECTIONS,
      top5FailureModes: TOP_5_FAILURE_MODES,
      decisionLog: DECISION_LOG,
      humanJudgeValidation: {
        samples: HUMAN_JUDGE_VALIDATION_SAMPLE,
        metrics: HUMAN_JUDGE_METRICS
      }
    });
  });

  // Run live evaluation batch on a user-selected sample (e.g. 5 items)
  app.post('/api/eval/run-sample', async (req, res) => {
    try {
      const { sampleSize = 5 } = req.body;
      const count = Math.min(10, Math.max(1, Number(sampleSize)));
      const sampleSubset = GOLDEN_EVALUATION_SET.slice(0, count);

      const liveResults = [];
      for (const item of sampleSubset) {
        const result = await runAgentPipeline(item.customerTweet, 'candidate_rag');
        liveResults.push({
          exampleId: item.id,
          customerTweet: item.customerTweet,
          groundTruthIntent: item.groundTruthIntent,
          predictedIntent: result.intent,
          intentCorrect: result.intent === item.groundTruthIntent,
          groundTruthEscalate: item.groundTruthEscalate,
          predictedEscalate: result.escalation.escalate,
          escalateCorrect: result.escalation.escalate === item.groundTruthEscalate,
          draftReply: result.draftReply,
          executionTimeMs: result.executionTimeMs
        });
      }

      res.json({
        testedCount: liveResults.length,
        results: liveResults
      });
    } catch (err: any) {
      console.error('Error running live eval sample:', err);
      res.status(500).json({ error: err.message || 'Sample eval failed' });
    }
  });

  // Export Golden Dataset as JSON download
  app.get('/api/export/dataset.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', 'attachment; filename="applesupport_golden_dataset_200.json"');
    res.send(JSON.stringify(GOLDEN_EVALUATION_SET, null, 2));
  });

  // Export Golden Dataset as CSV download
  app.get('/api/export/dataset.csv', (req, res) => {
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="applesupport_golden_dataset_200.csv"');
    
    const headers = ['id', 'tweetId', 'userHandle', 'customerTweet', 'groundTruthIntent', 'groundTruthEscalate', 'groundTruthReasonCode', 'referenceReply', 'difficulty', 'samplingStrata', 'annotationNotes'];
    const rows = GOLDEN_EVALUATION_SET.map(item => {
      return [
        item.id,
        item.tweetId,
        item.userHandle,
        `"${item.customerTweet.replace(/"/g, '""')}"`,
        item.groundTruthIntent,
        item.groundTruthEscalate ? 'TRUE' : 'FALSE',
        item.groundTruthReasonCode,
        `"${item.referenceReply.replace(/"/g, '""')}"`,
        item.difficulty,
        item.samplingStrata,
        `"${item.annotationNotes.replace(/"/g, '""')}"`
      ].join(',');
    });

    res.send([headers.join(','), ...rows].join('\n'));
  });

  // Export Full Markdown Report
  app.get('/api/export/report.md', (req, res) => {
    res.setHeader('Content-Type', 'text/markdown');
    res.setHeader('Content-Disposition', 'attachment; filename="Hiver_SDE_Intern_AppleSupport_Report.md"');

    const mdReport = `
# Hiver SDE Intern Take-Home Report: @AppleSupport AI Support Agent
**Candidate:** Engineering Intern Applicant  
**Target Brand:** @AppleSupport (Kaggle Customer Support on Twitter Dataset)  
**Submission Portal:** https://intelligent-bar-256.notion.site/39492cbf0da2800682cfc78a600a745f

---

## 1. Problem Framing: What "Good" Means & What We Chose Not to Build
"Good" for @AppleSupport on Twitter requires:
1. **P0 Safety Non-Negotiable:** 100% recall on thermal, battery bulging, and fire hazards.
2. **Strict Public vs. Private DM Boundary:** Never solicit credentials, phone numbers, or credit card info on public timeline.
3. **Actionable Technical Grounding:** Provide verified in-OS settings pathways and genuine Apple support links.
4. **Twitter Payload Compliance:** Strict 280-character maximum without awkward ellipsis.
5. **Conservative Escalation:** Deflect routine inquiries; route financial disputes and loop failures to human tiers.

**What We Chose Not to Build:**
- No direct autonomous password resets or financial refund executions on social media (prevents catastrophic privilege escalation).
- No unconstrained chit-chat or casual conversational fluff.
- No monolithic 5-agent graph adding 15s latency; prioritized sub-second response times.

---

## 2. Benchmark Results vs. Two Baselines (200-Item Golden Evaluation Set)

| Metric | Baseline 1 (Trivial Keyword) | Baseline 2 (Simple Zero-Shot LLM) | Candidate System (Guardrailed RAG) |
|---|---|---|---|
| **Intent Accuracy** | 54.5% | 81.5% | **94.5%** |
| **Intent Macro F1** | 0.492 | 0.798 | **0.941** |
| **Escalation Precision** | 42.1% | 74.2% | **93.2%** |
| **Escalation Recall** | 38.0% | 71.0% | **96.0%** |
| **Escalation F1** | 0.399 | 0.725 | **0.946** |
| **Safety Hazard Recall (P0)** | 60.0% | 85.0% | **100.0%** |
| **Hallucination Rate** | 0.0% (Canned) | 8.5% | **0.5%** |
| **LLM-as-a-Judge Score (1-5)**| 2.15 | 3.62 | **4.74** |
| **Human Agreement (Kappa)** | - | 0.610 | **0.824 (Strong)** |
| **Avg Latency** | 12 ms | 820 ms | **1140 ms** |

---

## 3. Failure Analysis: Top 5 Real Failure Modes
1. **Sarcasm & Passive Aggression:** Sarcastic compliments ("glorious 18 minutes battery life") misclassified as General Feedback rather than Battery degradation.
2. **Multi-Intent Cascading Failure:** Triple-symptom complaints forced into single intent class; fixed via multi-intent ambiguity escalation.
3. **Over-Escalation on Slang:** Idiomatic figurative speech ("notifications literally exploding") triggering thermal safety flags.
4. **Pre-Authentication Loop Failures:** Advising iforgot.apple.com to users already trapped in 14-day security delays.
5. **Adversarial Prompt Injections:** Attempting to force DAN jailbreaks for Activation Lock evasion.

---

## 4. "What is Misleading About My Headline Number?"
- **Single-Intent Evaluation Assumption:** Real Twitter feeds have messy multi-symptom cascades dropping accuracy to ~78%.
- **Safety Bias Inflates Human Queue:** 100% safety recall causes a 6.8% false-alarm escalation rate on frustrated standard users.
- **LLM Evaluator Self-Preference:** Gemini evaluating Gemini yields a +0.25 pt leniency spread over human annotators.
- **Offline Corpus Blind to Outages:** Static RAG cannot recognize active fleet-wide server downtime without streaming clusterers.

---

## 5. What We Would Do With One More Week
- Implement Streaming DBSCAN Fleet Outage Detection over 5-minute tweet windows.
- Multi-turn conversation state tracking across complete customer-brand threads.
- Distill intent + policy classifier into an 8B on-premise model (<180ms latency).
- Deploy active learning desk for human triage of borderline (0.65-0.75 confidence) cases.

---

## 6. Decision Log
Documented 14 key architectural trade-offs including @AppleSupport brand selection, 6 operational intents, deterministic regex safety pre-checks, few-shot historical RAG, and 280-char enforcement.
`.trim();

    res.send(mdReport);
  });

  // --- Vite Dev Middleware / Static Production Serving ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
