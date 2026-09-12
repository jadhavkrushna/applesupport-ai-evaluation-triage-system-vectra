import { SupportIntent, GroundedHistoricalSnippet } from '../types';

export interface HistoricalResolutionRecord {
  id: string;
  tweetId: string;
  intent: SupportIntent;
  customerQuerySnippet: string;
  brandResponseText: string;
  coreAction: string;
  keywords: string[];
}

export const APPLE_SUPPORT_HISTORICAL_CORPUS: HistoricalResolutionRecord[] = [
  // HARDWARE & BATTERY
  {
    id: 'apple_hist_001',
    tweetId: '115821',
    intent: 'HARDWARE_BATTERY',
    customerQuerySnippet: '@AppleSupport my iPhone 11 battery drops from 80% to 20% in like an hour after latest update, getting super hot too',
    brandResponseText: 'We want to help with your iPhone battery and temperature concerns! Check Settings > Battery > Battery Health & Charging. What is the Maximum Capacity shown there? DM us your iOS version: apple.co/AppleSupportDM',
    coreAction: 'Inspect Settings > Battery > Battery Health & Charging Maximum Capacity, verify recent update indexation, move to DM.',
    keywords: ['battery', 'drain', 'percentage', 'hot', 'overheating', 'drops', 'charge', 'capacity']
  },
  {
    id: 'apple_hist_002',
    tweetId: '115822',
    intent: 'HARDWARE_BATTERY',
    customerQuerySnippet: '@AppleSupport phone won\'t charge unless I wiggle the cable at an exact 45 degree angle. Tried 3 cables.',
    brandResponseText: 'Having reliable charging is essential. Take a look inside the Lightning port with a flashlight for any lint or debris, and gently clean it with a non-metallic pick. If that persists, send us a DM to set up service: apple.co/AppleSupportDM',
    coreAction: 'Advise checking charging port for debris with non-metallic tool; recommend authorized service booking via DM.',
    keywords: ['charge', 'cable', 'port', 'angle', 'loose', 'lightning', 'usb-c', 'wiggle']
  },
  {
    id: 'apple_hist_003',
    tweetId: '115823',
    intent: 'HARDWARE_BATTERY',
    customerQuerySnippet: '@AppleSupport the back of my phone is bulging and screen is lifting up! Smells like burnt plastic!',
    brandResponseText: 'Your safety is our top priority. Please immediately disconnect from power and stop using the device. Store it in a safe, cool, well-ventilated area away from flammable materials. Join us in DM now for immediate priority service: apple.co/AppleSupportDM',
    coreAction: 'EMERGENCY SAFETY PROTOCOL: Stop usage immediately, unplug, avoid flammable items, route to Safety Incident team.',
    keywords: ['bulging', 'swollen', 'smoke', 'burnt', 'smell', 'lifting', 'expanding', 'explosion']
  },
  {
    id: 'apple_hist_004',
    tweetId: '115824',
    intent: 'HARDWARE_BATTERY',
    customerQuerySnippet: '@AppleSupport my iPad screen went completely black but it still vibrates when notifications come in.',
    brandResponseText: 'Let\'s get that iPad display working properly. Have you tried a forced restart yet? Press and quickly release Volume Up, then Volume Down, then hold the Top button until the Apple logo appears. Let us know what happens in DM: apple.co/AppleSupportDM',
    coreAction: 'Provide forced restart key sequence for iPad without home button; request result in DM.',
    keywords: ['black screen', 'display', 'blank', 'vibrates', 'sound', 'unresponsive']
  },

  // SOFTWARE & OS UPDATES
  {
    id: 'apple_hist_005',
    tweetId: '115831',
    intent: 'SOFTWARE_OS_UPDATE',
    customerQuerySnippet: '@AppleSupport iOS update is stuck on "Preparing Update..." for over 4 hours. Storage is not full.',
    brandResponseText: 'We\'re here to help get your update finished! Try going to Settings > General > iPhone Storage, locate the downloaded iOS update file, tap Delete Update, then restart your device and download it again. DM us if it stays stuck: apple.co/AppleSupportDM',
    coreAction: 'Delete cached downloaded update file from iPhone Storage, restart, and re-download.',
    keywords: ['stuck', 'preparing update', 'installing', 'verifying', 'ios update', 'frozen']
  },
  {
    id: 'apple_hist_006',
    tweetId: '115832',
    intent: 'SOFTWARE_OS_UPDATE',
    customerQuerySnippet: '@AppleSupport Instagram and Camera app crash immediately whenever I open them after updating last night.',
    brandResponseText: 'App crashes can be frustrating. Please check the App Store for any pending updates for those apps, then restart your iPhone. If it continues, try offloading the app in Settings > General > iPhone Storage. Connect with us in DM for more steps: apple.co/AppleSupportDM',
    coreAction: 'Check App Store updates for app compatibility, restart device, advise offloading app.',
    keywords: ['crash', 'closes', 'shuts down', 'opens and closes', 'camera', 'instagram', 'app error']
  },
  {
    id: 'apple_hist_007',
    tweetId: '115833',
    intent: 'SOFTWARE_OS_UPDATE',
    customerQuerySnippet: '@AppleSupport iPhone is in a continuous boot loop showing only the Apple logo repeatedly after updating.',
    brandResponseText: 'We know how important your device is. You can connect your iPhone to a computer, open Finder/iTunes, put the device into Recovery Mode, and choose "Update" to reinstall iOS without erasing your data. Meet us in DM for guided help: apple.co/AppleSupportDM',
    coreAction: 'Guide recovery mode connect to Mac/PC, select Update instead of Restore to preserve data.',
    keywords: ['boot loop', 'apple logo', 'restarting continuously', 'flashing logo', 'recovery mode']
  },

  // ICLOUD & ACCOUNT SECURITY
  {
    id: 'apple_hist_008',
    tweetId: '115841',
    intent: 'ICLOUD_ACCOUNT_SECURITY',
    customerQuerySnippet: '@AppleSupport my Apple ID has been locked for security reasons and I can\'t receive the SMS code because my old number changed!',
    brandResponseText: 'We understand regaining account access is critical. You can request Account Recovery at iforgot.apple.com to verify your identity with alternate details. Because this involves private account data, please DM us your case number: apple.co/AppleSupportDM',
    coreAction: 'Direct to iforgot.apple.com account recovery flow; never request credentials on public Twitter; move to secure DM.',
    keywords: ['apple id', 'locked', 'password', '2fa', 'verification code', 'two-factor', 'old number', 'iforgot']
  },
  {
    id: 'apple_hist_009',
    tweetId: '115842',
    intent: 'ICLOUD_ACCOUNT_SECURITY',
    customerQuerySnippet: '@AppleSupport someone in another country just tried to log into my iCloud and changed my trusted email! Help!',
    brandResponseText: 'We take your account security very seriously. Please go to iforgot.apple.com immediately to secure your Apple ID password and revoke unknown devices in your Apple ID settings. Join us in DM right away so an advisor can assist: apple.co/AppleSupportDM',
    coreAction: 'HIGH SECURITY ALERT: Immediate password change, revoke sessions, route to Tier-2 Security Specialist.',
    keywords: ['hacked', 'compromised', 'unauthorized', 'foreign login', 'stolen account', 'security breach']
  },
  {
    id: 'apple_hist_010',
    tweetId: '115843',
    intent: 'ICLOUD_ACCOUNT_SECURITY',
    customerQuerySnippet: '@AppleSupport my iCloud photos aren\'t syncing across my iPad and Mac. Both are on the same Wi-Fi.',
    brandResponseText: 'Let\'s get your photos syncing smoothly. On both devices, confirm you\'re signed in with the same Apple ID in Settings > [Your Name], and that iCloud Photos is toggled ON under iCloud > Photos. Also check if Low Power Mode is on. DM us: apple.co/AppleSupportDM',
    coreAction: 'Verify identical Apple ID credentials, ensure iCloud Photos toggle is active, disable Low Power Mode.',
    keywords: ['icloud', 'photos', 'sync', 'mac', 'ipad', 'cloud', 'not syncing', 'library']
  },

  // BILLING & SUBSCRIPTIONS
  {
    id: 'apple_hist_011',
    tweetId: '115851',
    intent: 'BILLING_SUBSCRIPTIONS',
    customerQuerySnippet: '@AppleSupport I was charged $69.99 for an annual app subscription that I cancelled during the 3-day trial!',
    brandResponseText: 'We\'re here to help review that charge! You can view your purchase history and request a refund directly at reportaproblem.apple.com. You can also manage active subscriptions in Settings > [Your Name] > Subscriptions. DM us if you need help: apple.co/AppleSupportDM',
    coreAction: 'Direct to reportaproblem.apple.com for self-service refund request; provide Subscriptions settings path.',
    keywords: ['charged', 'subscription', 'refund', 'trial', 'unauthorized charge', 'apple bill', 'receipt']
  },
  {
    id: 'apple_hist_012',
    tweetId: '115852',
    intent: 'BILLING_SUBSCRIPTIONS',
    customerQuerySnippet: '@AppleSupport how do I cancel my Apple Music family plan before it renews on Friday?',
    brandResponseText: 'You can easily manage this right on your iPhone! Head to Settings > [Your Name] > Subscriptions, select Apple Music, and tap Cancel Subscription. It will remain active until the billing cycle ends. Reach out in DM if you run into any trouble: apple.co/AppleSupportDM',
    coreAction: 'Provide direct in-OS path: Settings > [Name] > Subscriptions > Cancel Subscription.',
    keywords: ['cancel', 'apple music', 'family plan', 'renew', 'subscription', 'how to cancel']
  },
  {
    id: 'apple_hist_013',
    tweetId: '115853',
    intent: 'BILLING_SUBSCRIPTIONS',
    customerQuerySnippet: '@AppleSupport there are 6 charges on my card from apple.com/bill for $9.99 each that I never authorized! I will contact my bank and lawyer!',
    brandResponseText: 'We take unexpected charges very seriously. You can view all linked accounts and family member charges at reportaproblem.apple.com. Please connect with us directly in DM so our billing specialists can pull up your invoice details securely: apple.co/AppleSupportDM',
    coreAction: 'LEGAL/BILLING ESCALATION: Acknowledge high distress, route to Billing Triage, provide secure DM link.',
    keywords: ['fraud', 'lawyer', 'bank', 'dispute', 'multiple charges', 'unauthorized', 'stolen card']
  },

  // CONNECTIVITY & AUDIO
  {
    id: 'apple_hist_014',
    tweetId: '115861',
    intent: 'CONNECTIVITY_AUDIO',
    customerQuerySnippet: '@AppleSupport my right AirPod is completely silent while the left one works fine. Reset didn\'t help.',
    brandResponseText: 'Audio issues are no fun. Place both AirPods in their charging case, connect to power for 30 minutes, then press and hold the setup button on the case until the status light flashes amber then white. Let us know if the right one responds in DM: apple.co/AppleSupportDM',
    coreAction: 'Provide full 30-min case charge procedure + Amber/White light reset sequence; route to hardware DM.',
    keywords: ['airpods', 'one side', 'silent', 'quiet', 'left airpod', 'right airpod', 'audio cutting']
  },
  {
    id: 'apple_hist_015',
    tweetId: '115862',
    intent: 'CONNECTIVITY_AUDIO',
    customerQuerySnippet: '@AppleSupport Wi-Fi keeps disconnecting every 5 minutes at home on iOS 17. Other devices work fine.',
    brandResponseText: 'Consistent connectivity is vital. Try going to Settings > Wi-Fi, tap the "i" next to your network, choose Forget This Network, and reconnect. You can also try Settings > General > Transfer or Reset iPhone > Reset > Reset Network Settings. DM us: apple.co/AppleSupportDM',
    coreAction: 'Advise Forget Network reconnect followed by Reset Network Settings.',
    keywords: ['wifi', 'disconnects', 'dropping', 'wi-fi', 'internet', 'network', 'router']
  },

  // GENERAL INQUIRY & FEEDBACK
  {
    id: 'apple_hist_016',
    tweetId: '115871',
    intent: 'GENERAL_INQUIRY_FEEDBACK',
    customerQuerySnippet: '@AppleSupport how do I book a Genius Bar appointment at the Fifth Ave store for battery replacement?',
    brandResponseText: 'We\'d love to get you scheduled with a Genius! You can easily reserve an appointment using the Apple Support app or visiting getsupport.apple.com. Choose your device, select Battery Service, and pick your preferred store and time. DM us: apple.co/AppleSupportDM',
    coreAction: 'Direct to getsupport.apple.com or Apple Support iOS App to book Genius Bar appointment.',
    keywords: ['genius bar', 'appointment', 'store', 'reserve', 'book', 'schedule', 'walk-in']
  },
  {
    id: 'apple_hist_017',
    tweetId: '115872',
    intent: 'GENERAL_INQUIRY_FEEDBACK',
    customerQuerySnippet: '@AppleSupport can I trade in my cracked iPhone 12 towards the new 15 Pro? How much value will it lose?',
    brandResponseText: 'You can trade in devices in varying conditions! Check your estimated trade-in value right now at apple.co/tradein by selecting your model and answering condition questions. DM us if you have any questions along the way: apple.co/AppleSupportDM',
    coreAction: 'Provide official trade-in valuation tool link (apple.co/tradein) and clarify condition grading.',
    keywords: ['trade in', 'value', 'upgrade', 'cracked screen', 'estimate', 'exchange']
  }
];

export function retrieveHistoricalGrounding(
  customerTweet: string,
  topK = 3
): GroundedHistoricalSnippet[] {
  const normalizedQuery = customerTweet.toLowerCase();
  const queryTokens = normalizedQuery.split(/\W+/).filter(t => t.length > 2);

  const scored = APPLE_SUPPORT_HISTORICAL_CORPUS.map(record => {
    let score = 0;
    for (const kw of record.keywords) {
      if (normalizedQuery.includes(kw.toLowerCase())) {
        score += 3;
      }
    }
    for (const token of queryTokens) {
      if (record.customerQuerySnippet.toLowerCase().includes(token)) {
        score += 1.5;
      }
      if (record.coreAction.toLowerCase().includes(token)) {
        score += 1;
      }
    }
    return {
      record,
      similarityScore: Math.min(0.98, Number((score / (queryTokens.length * 2 + 1)).toFixed(2)))
    };
  });

  scored.sort((a, b) => b.similarityScore - a.similarityScore);

  return scored.slice(0, topK).map(({ record, similarityScore }) => ({
    id: record.id,
    similarityScore: Math.max(0.45, similarityScore),
    customerTweet: record.customerQuerySnippet,
    brandReply: record.brandResponseText,
    keyResolutionStep: record.coreAction,
    intent: record.intent
  }));
}
