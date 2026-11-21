import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The love calculator is an entertaining compatibility game that computes a fun relationship harmony score between two individuals based on names, optional birth dates, and relationship status. Blending recreational Pythagorean numerology letter values, life path number alignments, and zodiac elemental archetypes, it creates an amusing leisure reading to share with partners or friends.\n\nDisclaimer: The Love Calculator is purely for fun, romantic novelty, and recreational entertainment. Real relationship compatibility depends on mutual respect, effective communication, shared ethical values, and emotional empathy—not mathematical algorithms or name spellings.",

  howItWorks:
    "Exploring your playful relationship compatibility score takes just a few steps:\n\n1. First Partner's Name: Enter the first person's name or nickname.\n2. First Partner's Date of Birth (Optional): Enter their date of birth to unlock Western zodiac and Life Path numerology insights.\n3. Second Partner's Name: Enter the second person's name or nickname.\n4. Second Partner's Date of Birth (Optional): Provide their birth date for complementary astrological elements.\n5. Relationship Stage: Select whether you are crushes, dating, engaged, married, or just friends.\n\nClick Calculate to receive your overall compatibility score percentage, breakdown of name and numerology layers, and romantic narrative summary.",

  formula:
    "The calculator utilizes a deterministic, multi-layer heuristic compatibility model:\n\n1. Pythagorean Name Number Reduction:\nEach letter in both names is mapped to a Pythagorean single-digit numerical value (A,J,S=1; B,K,T=2; C,L,U=3; D,M,V=4; E,N,W=5; F,O,X=6; G,P,Y=7; H,Q,Z=8; I,R=9).\nSum of digits is iteratively reduced to a single-digit root number (1 through 9).\n\n2. Life Path Number (from Date of Birth):\nFull birth date numbers (DD-MM-YYYY) are summed and reduced to single-digit Life Path numbers, comparing harmonic resonance between pairs.\n\n3. Astrological Element Compatibility:\nBirth dates determine Western zodiac signs, grouped into the four classic elements:\n- Fire: Aries, Leo, Sagittarius\n- Earth: Taurus, Virgo, Capricorn\n- Air: Gemini, Libra, Aquarius\n- Water: Cancer, Scorpio, Pisces\nComplementary elements (e.g. Fire + Air, Earth + Water) receive positive elemental harmony modifiers.\n\n4. Composite Aggregate Score:\nOverall Compatibility Score (%) = Weighted Combination of Name Resonance + Life Path Alignment + Elemental Synergy.",

  example:
    "Consider two romantic partners trying the calculator for recreational leisure:\n- Partner 1: 'Aarav' (Name Number 7, Zodiac: Aries / Fire element)\n- Partner 2: 'Ananya' (Name Number 2, Zodiac: Aries / Fire element)\n- Relationship Stage: Dating\n\nAlgorithmic Evaluation:\n- Name Letter Resonance: 11%\n- Numerology Life Path Alignment: 66%\n- Astrological Elemental Harmony: 92% (Both share the Fire element, creating natural intuitive enthusiasm and drive)\n- Composite Overall Compatibility Score: 57% ('Promising Connection')\n\nNarrative Insight: Your shared elemental bond indicates great creative energy, shared adventurous spirit, and a fun dynamic connection.",

  mistakes:
    "1. Taking algorithmic love scores seriously: Using an online recreational novelty calculator to evaluate real relationship commitments, breakups, or marriage decisions is irrational.\n2. Relying on numerology instead of honest communication: Genuine relationship harmony is forged through active listening, healthy boundaries, and mutual emotional support.\n3. Believing low scores indicate doomed relationships: Human compatibility is extraordinarily complex, multidimensional, and evolving; no computer program can predict personal chemistry.\n4. Entering different spellings of names expecting scientific differences: Small spelling differences (e.g. 'Aarav' vs 'Arav') produce different numerical seeds without reflecting personal character.\n5. Forgetting that relationships require active dedication: Even individuals with high algorithmic compatibility will experience discord without ongoing mutual effort and respect.",

  faqs: [
    {
      question: "Is the Love Calculator accurate or based on real science?",
      answer:
        "No. The love calculator is designed exclusively for lighthearted entertainment and recreational leisure. It has no clinical, psychological, or scientific validity and should never be used as advice for actual dating or relationship decisions.",
    },
    {
      question: "How does the calculator determine the compatibility percentage?",
      answer:
        "The calculator uses an algorithmic combination of letter-value numerology (Pythagorean letter numbers), life path birth date reductions, and classic astrological elemental groupings (Fire, Earth, Air, Water) to generate a playful score between 0% and 100%.",
    },
    {
      question: "Can I use the calculator if I don't know my partner's birth date?",
      answer:
        "Yes. Birth dates are optional. If birth dates are omitted, the calculator computes the compatibility score purely based on the letters and phonetic numerology of your two names.",
    },
    {
      question: "Why do my results change if I use a nickname?",
      answer:
        "Because the algorithm assigns specific numerical values to individual letters in your name, shortening a name or using a nickname changes the total sum and produces a different recreational score.",
    },
    {
      question: "Is my personal name or partner data stored on your servers?",
      answer:
        "No. All computations execute 100% locally in your web browser. None of your names, birth dates, or romantic results are ever recorded, saved, or shared on our backend servers.",
    },
  ],

  authorityLinks: [
    { text: "Indian Psychological Association (IPA)", url: "https://www.ipa.org.in/" },
    { text: "Ministry of Information and Broadcasting", url: "https://mib.gov.in/" },
  ],

  relatedCalculators: ["flames-calculator", "couple-age-difference-calculator", "percentage-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
