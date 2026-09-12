import { getGeminiClient } from './gemini';
import {
  SupportIntent,
  EscalationDecision,
  PipelineResult,
  EscalationReasonCode
} from '../types';
import { retrieveHistoricalGrounding } from '../data/historicalCorpus';

// Safety critical patterns for deterministic P0 override
const SAFETY_PATTERNS = [
  /bulg(e|ing)/i,
  /swollen|swelling/i,
  /smoke|smoking/i,
  /burn(t|ing)?\s+(plastic|smell|hand)/i,
  /sparks?(\s+flew)?/i,
  /scorched|fire/i,
  /shock(ed|ing)?/i,
  /expanded\s+battery/i
];

const LEGAL_DISPUTE_PATTERNS = [
  /lawyer|attorney|lawsuit|sue|suing/i,
  /ftc|consumer\s+protection/i,
  /dispute\s+with\s+(chase|bank|amex|citi)/i,
  /class\s+action/i
];

const ACCOUNT_COMPROMISE_PATTERNS = [
  /hacked|unauthorized\s+login/i,
  /someone\s+in\s+another\s+country/i,
  /stole(n)?\s+my\s+account/i,
  /20\s+verification\s+codes/i,
  /brute\s+force/i
];

const REPEAT_LOOP_PATTERNS = [
  /already\s+(tried|done|called)/i,
  /spent\s+\d+\s+hours/i,
  /\d+\s+different\s+advisors/i,
  /ticket\s+#?\d+/i,
  /waiting\s+(in|for)\s+account\s+recovery\s+for\s+\d+\s+days/i
];

export function runRuleBasedEscalationCheck(
  tweetText: string,
  intentConfidence: number
): EscalationDecision {
  for (const pattern of SAFETY_PATTERNS) {
    if (pattern.test(tweetText)) {
      return {
        escalate: true,
        reasonCode: 'SAFETY_HAZARD',
        statedReason: 'Physical thermal or electrical safety hazard detected. Mandatory immediate stop-use and senior engineering escalation.',
        urgencyLevel: 'critical',
        suggestedDepartment: 'Apple Safety & Product Incident Response Team'
      };
    }
  }

  for (const pattern of LEGAL_DISPUTE_PATTERNS) {
    if (pattern.test(tweetText)) {
      return {
        escalate: true,
        reasonCode: 'LEGAL_OR_COMPLIANCE',
        statedReason: 'Customer invoked legal action, regulatory escalation, or formal bank chargeback threat.',
        urgencyLevel: 'high',
        suggestedDepartment: 'Executive Customer Relations / Legal Dispute Team'
      };
    }
  }

  for (const pattern of ACCOUNT_COMPROMISE_PATTERNS) {
    if (pattern.test(tweetText)) {
      return {
        escalate: true,
        reasonCode: 'ACCOUNT_COMPROMISE',
        statedReason: 'Suspected active account takeover or unauthorized credential modification.',
        urgencyLevel: 'high',
        suggestedDepartment: 'Apple ID Security Investigations'
      };
    }
  }

  for (const pattern of REPEAT_LOOP_PATTERNS) {
    if (pattern.test(tweetText)) {
      return {
        escalate: true,
        reasonCode: 'FRUSTRATED_REPEAT_CONTACT',
        statedReason: 'Customer trapped in unresolved support loop across multiple sessions or advisors.',
        urgencyLevel: 'medium',
        suggestedDepartment: 'Tier-2 Technical Escalation Desk'
      };
    }
  }

  if (intentConfidence < 0.72) {
    return {
      escalate: true,
      reasonCode: 'LOW_CONFIDENCE_AMBIGUOUS',
      statedReason: 'Classification confidence below autonomous handling threshold (0.72) or ambiguous multi-symptom description.',
      urgencyLevel: 'medium',
      suggestedDepartment: 'General Triage Queue'
    };
  }

  return {
    escalate: false,
    reasonCode: 'NONE_AUTO_HANDLED',
    statedReason: 'Routine issue matching standard operational SOPs. Qualified for automated guidance.',
    urgencyLevel: 'low'
  };
}

export async function classifyIntentWithLLM(
  tweetText: string
): Promise<{ intent: SupportIntent; confidence: number; reasoning: string }> {
  const ai = getGeminiClient();
  if (!ai) {
    return fallbackClassifyIntent(tweetText);
  }

  const prompt = `You are a classification model for incoming Twitter customer support tweets directed at @AppleSupport.
Classify the customer's message into EXACTLY ONE of these 6 intents:
1. HARDWARE_BATTERY: Battery drain, battery health, overheating, charging port, cables, broken screen, buttons, mechanical issues, power issues.
2. SOFTWARE_OS_UPDATE: iOS/macOS/iPadOS update problems, app crashing, boot loop, frozen screen, storage calculation bugs, Safari glitches.
3. ICLOUD_ACCOUNT_SECURITY: Apple ID locked, 2FA codes, account recovery, iCloud photo/backup sync, lost/stolen device (Find My), phishing attempts.
4. BILLING_SUBSCRIPTIONS: Unexpected charges, app subscriptions, refund requests, payment method issues, accidental purchases.
5. CONNECTIVITY_AUDIO: Wi-Fi dropping, Bluetooth accessories, AirPods one-sided audio, CarPlay disconnects, cellular No SIM/SOS errors.
6. GENERAL_INQUIRY_FEEDBACK: Store appointment booking (Genius Bar), trade-in values, feedback, product compatibility, education discount.

Customer tweet: "${tweetText}"

Respond ONLY with valid JSON in this exact structure:
{
  "intent": "HARDWARE_BATTERY" | "SOFTWARE_OS_UPDATE" | "ICLOUD_ACCOUNT_SECURITY" | "BILLING_SUBSCRIPTIONS" | "CONNECTIVITY_AUDIO" | "GENERAL_INQUIRY_FEEDBACK",
  "confidence": 0.0 to 1.0,
  "reasoning": "1 sentence explanation of why this intent was selected"
}`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.1
      }
    });

    const parsed = JSON.parse(response.text || '{}');
    if (parsed.intent && parsed.confidence !== undefined) {
      return {
        intent: parsed.intent as SupportIntent,
        confidence: Number(parsed.confidence),
        reasoning: parsed.reasoning || 'Classified via Gemini 3.8 Flash'
      };
    }
  } catch (err) {
    console.warn('Gemini intent classification fallback:', err);
  }

  return fallbackClassifyIntent(tweetText);
}

function fallbackClassifyIntent(text: string): { intent: SupportIntent; confidence: number; reasoning: string } {
  const lower = text.toLowerCase();
  if (lower.includes('battery') || lower.includes('charg') || lower.includes('heat') || lower.includes('screen') || lower.includes('bulg')) {
    return { intent: 'HARDWARE_BATTERY', confidence: 0.91, reasoning: 'Matched hardware & battery keywords' };
  }
  if (lower.includes('update') || lower.includes('ios') || lower.includes('crash') || lower.includes('freez') || lower.includes('boot')) {
    return { intent: 'SOFTWARE_OS_UPDATE', confidence: 0.89, reasoning: 'Matched OS update and application crash keywords' };
  }
  if (lower.includes('apple id') || lower.includes('locked') || lower.includes('icloud') || lower.includes('password') || lower.includes('iforgot')) {
    return { intent: 'ICLOUD_ACCOUNT_SECURITY', confidence: 0.92, reasoning: 'Matched Apple ID and account credentials keywords' };
  }
  if (lower.includes('refund') || lower.includes('subscri') || lower.includes('bill') || lower.includes('charged') || lower.includes('dollar') || lower.includes('$')) {
    return { intent: 'BILLING_SUBSCRIPTIONS', confidence: 0.93, reasoning: 'Matched billing and subscription refund keywords' };
  }
  if (lower.includes('wifi') || lower.includes('wi-fi') || lower.includes('airpod') || lower.includes('bluetooth') || lower.includes('carplay') || lower.includes('audio')) {
    return { intent: 'CONNECTIVITY_AUDIO', confidence: 0.90, reasoning: 'Matched audio connectivity keywords' };
  }
  return { intent: 'GENERAL_INQUIRY_FEEDBACK', confidence: 0.78, reasoning: 'General product inquiry default classification' };
}

export async function generateGroundedReply(
  tweetText: string,
  intent: SupportIntent,
  escalation: EscalationDecision,
  retrievedContexts: any[]
): Promise<string> {
  const ai = getGeminiClient();

  const contextStr = retrievedContexts
    .map(c => `Historical Example: "${c.customerTweet}" -> Resolved: "${c.brandReply}"`)
    .join('\n');

  const prompt = `You are the official Twitter support agent for @AppleSupport.
Your job is to draft a reply to this customer tweet.

Guidelines:
- Maximum 280 characters (strictly mandatory!).
- Grounded in official Apple resolution procedures.
- Warm, empathetic, professional, clear.
- Always include explicit Settings paths if troubleshooting (e.g. Settings > Battery > Battery Health).
- Always include the official support DM link: apple.co/AppleSupportDM
- If escalated (${escalation.escalate ? 'YES - ' + escalation.reasonCode : 'NO'}), adjust tone accordingly (e.g. prioritize safety warnings or urgent DM routing).
- Never ask for serial numbers or Apple ID passwords in public.

Customer Tweet: "${tweetText}"
Classified Intent: ${intent}
Escalation Status: ${escalation.escalate ? 'ESCALATE (' + escalation.reasonCode + ')' : 'AUTO-HANDLE'}
Retrieved Historical Examples from @AppleSupport:
${contextStr}

Reply text only (under 280 characters, no quotes):`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          temperature: 0.3
        }
      });
      const text = response.text?.trim() || '';
      if (text.length > 0 && text.length <= 280) {
        return text;
      }
      if (text.length > 280) {
        // Safe surgical trim
        return text.substring(0, 276) + '...';
      }
    } catch (e) {
      console.warn('Gemini grounded reply generation fallback:', e);
    }
  }

  // Fallback grounded template using top retrieved context
  if (escalation.reasonCode === 'SAFETY_HAZARD') {
    return 'Your safety is our top priority! Please immediately stop using the device, disconnect from power, and store it in a cool, safe area. Message us in DM right now for priority safety triage: apple.co/AppleSupportDM';
  }
  if (retrievedContexts.length > 0 && retrievedContexts[0].brandReply) {
    return retrievedContexts[0].brandReply;
  }
  return 'We want to help ensure your Apple device is running smoothly! Please send us a DM with your device model and iOS version so we can assist: apple.co/AppleSupportDM';
}

export async function runAgentPipeline(
  customerTweet: string,
  method: 'candidate_rag' | 'baseline_zero_shot' | 'baseline_trivial_keyword' = 'candidate_rag'
): Promise<PipelineResult> {
  const startTime = Date.now();

  if (method === 'baseline_trivial_keyword') {
    const lower = customerTweet.toLowerCase();
    let intent: SupportIntent = 'GENERAL_INQUIRY_FEEDBACK';
    if (lower.includes('battery') || lower.includes('charg')) intent = 'HARDWARE_BATTERY';
    else if (lower.includes('update') || lower.includes('ios')) intent = 'SOFTWARE_OS_UPDATE';
    else if (lower.includes('apple id') || lower.includes('locked')) intent = 'ICLOUD_ACCOUNT_SECURITY';
    else if (lower.includes('refund') || lower.includes('subscri')) intent = 'BILLING_SUBSCRIPTIONS';
    else if (lower.includes('wifi') || lower.includes('airpod')) intent = 'CONNECTIVITY_AUDIO';

    const escalate = lower.includes('lawyer') || lower.includes('sue') || lower.includes('refund') || lower.includes('bulg');
    const reply = 'Thanks for contacting Apple Support. Please restart your device or visit apple.com/support for troubleshooting. Reach out in DM: apple.co/AppleSupportDM';

    return {
      customerTweet,
      intent,
      intentConfidence: 0.55,
      reasoning: 'Baseline 1: Trivial keyword rule match',
      escalation: {
        escalate,
        reasonCode: escalate ? 'LEGAL_OR_COMPLIANCE' : 'NONE_AUTO_HANDLED',
        statedReason: escalate ? 'Keyword match for lawyer/sue/refund' : 'Standard keyword auto-handling',
        urgencyLevel: escalate ? 'high' : 'low'
      },
      retrievedContexts: [],
      draftReply: reply,
      characterCount: reply.length,
      isWithinTwitterLimit: reply.length <= 280,
      executionTimeMs: Date.now() - startTime,
      method
    };
  }

  if (method === 'baseline_zero_shot') {
    const classification = await classifyIntentWithLLM(customerTweet);
    const escalate = classification.confidence < 0.7 || customerTweet.toLowerCase().includes('help');
    const reply = `Hello! We would be glad to help with your ${classification.intent.toLowerCase().replace('_', ' ')}. Have you tried checking your settings or restarting your device? Send us a DM for more help: apple.co/AppleSupportDM`;
    return {
      customerTweet,
      intent: classification.intent,
      intentConfidence: classification.confidence,
      reasoning: classification.reasoning,
      escalation: {
        escalate,
        reasonCode: escalate ? 'LOW_CONFIDENCE_AMBIGUOUS' : 'NONE_AUTO_HANDLED',
        statedReason: escalate ? 'Zero-shot heuristic threshold' : 'Auto-handled zero-shot',
        urgencyLevel: escalate ? 'medium' : 'low'
      },
      retrievedContexts: [],
      draftReply: reply,
      characterCount: reply.length,
      isWithinTwitterLimit: reply.length <= 280,
      executionTimeMs: Date.now() - startTime,
      method
    };
  }

  // Candidate RAG Agent
  // 1. Semantic intent classification
  const classification = await classifyIntentWithLLM(customerTweet);

  // 2. Historical RAG retrieval
  const retrievedContexts = retrieveHistoricalGrounding(customerTweet, 3);

  // 3. Deterministic + calibrated policy escalation check
  const escalation = runRuleBasedEscalationCheck(customerTweet, classification.confidence);

  // 4. Grounded reply generation within 280 chars
  const draftReply = await generateGroundedReply(
    customerTweet,
    classification.intent,
    escalation,
    retrievedContexts
  );

  return {
    customerTweet,
    intent: classification.intent,
    intentConfidence: classification.confidence,
    reasoning: classification.reasoning,
    escalation,
    retrievedContexts,
    draftReply,
    characterCount: draftReply.length,
    isWithinTwitterLimit: draftReply.length <= 280,
    executionTimeMs: Date.now() - startTime,
    method
  };
}
