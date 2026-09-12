export type SupportIntent =
  | 'HARDWARE_BATTERY'
  | 'SOFTWARE_OS_UPDATE'
  | 'ICLOUD_ACCOUNT_SECURITY'
  | 'BILLING_SUBSCRIPTIONS'
  | 'CONNECTIVITY_AUDIO'
  | 'GENERAL_INQUIRY_FEEDBACK';

export type EscalationReasonCode =
  | 'SAFETY_HAZARD'
  | 'ACCOUNT_COMPROMISE'
  | 'FINANCIAL_DISPUTE'
  | 'FRUSTRATED_REPEAT_CONTACT'
  | 'LOW_CONFIDENCE_AMBIGUOUS'
  | 'LEGAL_OR_COMPLIANCE'
  | 'HARDWARE_REPLACEMENT_REQ'
  | 'NONE_AUTO_HANDLED';

export interface EscalationDecision {
  escalate: boolean;
  reasonCode: EscalationReasonCode;
  statedReason: string;
  urgencyLevel: 'low' | 'medium' | 'high' | 'critical';
  suggestedDepartment?: string;
}

export interface GroundedHistoricalSnippet {
  id: string;
  similarityScore: number;
  customerTweet: string;
  brandReply: string;
  keyResolutionStep: string;
  intent: SupportIntent;
}

export interface PipelineResult {
  tweetId?: string;
  customerTweet: string;
  intent: SupportIntent;
  intentConfidence: number;
  reasoning: string;
  escalation: EscalationDecision;
  retrievedContexts: GroundedHistoricalSnippet[];
  draftReply: string;
  characterCount: number;
  isWithinTwitterLimit: boolean;
  executionTimeMs: number;
  method: 'candidate_rag' | 'baseline_zero_shot' | 'baseline_trivial_keyword';
}

export interface GoldenExample {
  id: string;
  tweetId: string;
  userHandle: string;
  customerTweet: string;
  groundTruthIntent: SupportIntent;
  groundTruthEscalate: boolean;
  groundTruthReasonCode: EscalationReasonCode;
  referenceReply: string;
  difficulty: 'easy' | 'medium' | 'hard';
  samplingStrata:
    | 'safety_critical'
    | 'high_sentiment'
    | 'multi_intent_ambiguous'
    | 'short_vague'
    | 'standard_troubleshooting'
    | 'billing_dispute'
    | 'edge_case_slang';
  annotationNotes: string;
}

export interface ModelPrediction {
  exampleId: string;
  predictedIntent: SupportIntent;
  intentCorrect: boolean;
  intentConfidence: number;
  predictedEscalate: boolean;
  escalateCorrect: boolean;
  predictedReasonCode: EscalationReasonCode;
  draftReply: string;
  judgeScores?: {
    brandVoice: number; // 1-5
    factualGrounding: number; // 1-5
    policyCompliance: number; // 1-5
    escalationAccuracy: number; // 1-5
    overallScore: number; // 1-5
    feedback: string;
  };
  latencyMs: number;
}

export interface IntentMetricBreakdown {
  intent: SupportIntent;
  support: number;
  precision: number;
  recall: number;
  f1Score: number;
}

export interface BenchmarkMetrics {
  totalCount: number;
  intentAccuracy: number;
  intentMacroF1: number;
  escalationPrecision: number;
  escalationRecall: number;
  escalationF1: number;
  safetyHazardRecall: number; // P0 critical safety detection
  hallucinationRate: number; // % of replies with fabricated links or fake policies
  avgJudgeScore: number; // 1-5 scale
  avgLatencyMs: number;
  intentBreakdowns: Record<SupportIntent, IntentMetricBreakdown>;
}

export interface BaselineComparison {
  name: string;
  slug: 'trivial_keyword' | 'simple_zero_shot' | 'candidate_rag';
  description: string;
  intentAccuracy: number;
  intentMacroF1: number;
  escalationPrecision: number;
  escalationRecall: number;
  escalationF1: number;
  safetyHazardRecall: number;
  hallucinationRate: number;
  avgJudgeScore: number;
  avgLatencyMs: number;
  costPer1kQueries: string;
}

export interface HumanJudgePair {
  exampleId: string;
  customerTweet: string;
  modelReply: string;
  humanScore: number;
  llmJudgeScore: number;
  humanRationale: string;
  llmJudgeRationale: string;
  agreementDelta: number;
}

export interface FailureModeCase {
  id: string;
  title: string;
  frequencyEstimate: string;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM';
  customerTweet: string;
  candidateOutput: {
    intent: SupportIntent;
    escalate: boolean;
    reason: string;
    reply: string;
  };
  groundTruth: {
    intent: SupportIntent;
    escalate: boolean;
    reason: string;
    reply: string;
  };
  rootCauseHypothesis: string;
  mitigationStrategy: string;
}

export interface DecisionLogEntry {
  id: number;
  decision: string;
  alternativesConsidered: string[];
  chosenAlternative: string;
  rationale: string;
  observedImpact: string;
}
