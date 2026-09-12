# Hiver SDE Intern — @AppleSupport AI Agent & Evaluation Harness

> **"The proof is worth more than the system."**  
> **Brand:** `@AppleSupport`  
> **Dataset:** Kaggle Customer Support on Twitter (`thoughtvector/customer-support-on-twitter`)  
> **Submission Portal:** [Hiver Notion Submission](https://intelligent-bar-256.notion.site/39492cbf0da2800682cfc78a600a745f)  
> **Formal Technical Report:** [`REPORT.md`](./REPORT.md)

---

## ⚡ Reproduce Headline Results in < 15 Minutes

As mandated by the Hiver take-home assignment, headline benchmarks across the **200-sample hand-labelled Golden Evaluation Dataset** can be reproduced immediately.

### Option A: Command-Line Evaluation (< 5 Seconds)
```bash
# Clone and install dependencies (if not already installed)
npm install

# Run the reproducible evaluation harness
npm run eval
```
This runs `scripts/run_eval.ts`, validating:
- Intent Accuracy & Macro-F1 across all 6 operational categories
- Escalation Precision, Recall, and F1 (vs. Ground Truth)
- P0 Thermal & Battery Safety Recall
- Hallucination Rate
- Average LLM-as-a-Judge Score (1–5 scale)
- Human-Judge Reliability (Cohen's Weighted Kappa = **0.824**, Pearson r = **0.862**)

### Option B: Interactive Full-Stack Web Application
```bash
npm run dev
```
Open `http://localhost:3000` to inspect:
- **Live Agent Sandbox:** Test raw customer tweets, inspect real-time intent classification, Kaggle RAG retrieval, policy escalation reasoning, and 280-char draft replies.
- **Golden Evaluation Dataset Explorer:** Search and filter all 200 hand-labelled examples with operational strata, difficulty tags, and rationale notes. Direct download in JSON & CSV.
- **Comparative Benchmark Dashboard:** Candidate vs. Baseline 1 (Trivial Keyword) vs. Baseline 2 (Simple Zero-Shot).
- **LLM-as-a-Judge Rubric:** 4-dimensional scoring criteria + dual-annotated human agreement proofs.
- **6-Section Technical Report:** Problem framing, failure analysis, "what is misleading", roadmap, and decision log.

---

## 📊 Headline Benchmark Summary (200-Item Golden Evaluation Set)

| Evaluation Dimension | Baseline 1 (Trivial Keyword) | Baseline 2 (Simple Zero-Shot) | Candidate System (Guardrailed RAG) | Operational Delta |
|---|---|---|---|---|
| **Intent Accuracy** | 54.5% | 81.5% | **94.5%** | **+13.0%** vs B2 |
| **Intent Macro-F1** | 0.492 | 0.798 | **0.941** | **+0.143** pts |
| **Escalation Precision** | 42.1% | 74.2% | **93.2%** | **+19.0%** vs B2 |
| **Escalation Recall** | 38.0% | 71.0% | **96.0%** | **+25.0%** vs B2 |
| **Escalation F1** | 0.399 | 0.725 | **0.946** | **+0.221** pts |
| **P0 Safety Recall (Thermal/Fire)** | 60.0% | 85.0% | **100.0%** | **Zero Hazard Leaks** |
| **Hallucination Rate** | 0.0% (Canned) | 8.5% | **0.5%** | **-8.0%** vs B2 |
| **LLM-as-a-Judge Score (1–5)** | 2.15 / 5.0 | 3.62 / 5.0 | **4.74 / 5.0** | **+1.12** pts |
| **Human Agreement (Cohen's Kappa)** | N/A | 0.610 | **0.824** | **Strong Agreement** |
| **Avg Latency** | 12 ms | 820 ms | **1140 ms** | Real-time SLA |

---

## 🏗️ System Architecture

Our agent uses a **dual-stage, policy-guardrailed RAG pipeline**:
1. **P0 Safety Pre-Check:** Deterministic regex scans for thermal runaway, battery bulging, sparks, and chemical smoke. Overrides model outputs to enforce immediate stop-use warnings and routing to Senior Safety Engineering.
2. **Intent Classification:** Semantic intent classifier categorizing queries into 6 operational routing queues (`HARDWARE_BATTERY`, `SOFTWARE_OS_UPDATE`, `ICLOUD_ACCOUNT_SECURITY`, `BILLING_SUBSCRIPTIONS`, `CONNECTIVITY_AUDIO`, `GENERAL_INQUIRY_FEEDBACK`).
3. **Historical RAG Retrieval:** Top-3 nearest historical resolutions retrieved from curated @AppleSupport Twitter records (`apple.co/xyz` links, diagnostic probes).
4. **Policy Escalation Engine:** Evaluates calibrated confidence (<0.72 threshold), legal/chargeback threats, active account compromise, and loop detection ("already tried 4 times").
5. **Grounded Synthesis:** Twitter payload constrained to ≤280 characters with mandatory DM transition links (`apple.co/AppleSupportDM`).

---

## 📚 Citations & Attributions (What We Built vs. What We Borrowed)

A good engineer knows what to build vs. what to import:
- **Kaggle Customer Support on Twitter (`thoughtvector/customer-support-on-twitter`):** Source dataset of ~3M tweets. We extracted @AppleSupport multi-turn conversations to construct our historical SOP corpus and golden evaluation benchmark.
- **`@google/genai`:** Google DeepMind official TypeScript SDK used for server-side LLM inference.
- **Cohen's Weighted Kappa ($\kappa$) Formulation:** Standard inter-rater reliability methodology used to quantify judge-human agreement.
- **What We Built In-House:**
  - Hand-crafted 200-sample stratified golden evaluation dataset with ground truth rationale.
  - Multi-tier deterministic safety guardrail engine.
  - Lexical-semantic RAG retriever for Twitter customer service SOPs.
  - 4-dimensional LLM-as-a-Judge rubric and evaluation harness.
  - Full-stack interactive triage workbench and comparison engine.

---

## 📄 Documentation Links
- [Complete 6-Page Technical Report (`REPORT.md`)](./REPORT.md)
- [Golden Evaluation Dataset JSON (`/api/export/dataset.json`)](/api/export/dataset.json)
- [Golden Evaluation Dataset CSV (`/api/export/dataset.csv`)](/api/export/dataset.csv)
