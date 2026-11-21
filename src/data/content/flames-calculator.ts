import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The FLAMES calculator is a popular nostalgic algorithmic game that predicts the playful romantic or interpersonal relationship between two people based on their names. Widely cherished by Indian school and college students as a childhood pen-and-paper game, the acronym FLAMES stands for: Friends, Love, Affection, Marriage, Enemy, and Siblings. By crossing off shared letters between two names and applying cyclic elimination to the remaining letter count, it determines your nostalgic relationship acronym.\n\nDisclaimer: The FLAMES game is strictly for fun, nostalgia, and leisure entertainment. It possesses no scientific, psychological, or predictive validity regarding real-life relationships.",

  howItWorks:
    "Playing the FLAMES game follows the classic pen-and-paper steps digitized for instant play:\n\n1. First Partner's Name: Enter the full first name or nickname of the first person.\n2. Second Partner's Name: Enter the full first name or nickname of the second person.\n3. Normalization: The algorithm removes spaces, ignores capitalization, and standardizes both names into uppercase characters.\n4. Letter Cancellation: Common letters appearing in both names are crossed out in pairs.\n5. Letter Count & Elimination: The total number of remaining unmatched letters is counted, and the circular acronym F-L-A-M-E-S is eliminated step-by-step until one final letter remains.\n\nClick Calculate to reveal the final letter, its corresponding relationship outcome, and the full step-by-step elimination sequence.",

  formula:
    "The algorithmic logic replicates traditional pen-and-paper elimination:\n\nStep 1: Normalize string inputs A and B to uppercase and strip whitespace.\nStep 2: Iterate through letters. For every letter in A that exists in B, cancel one occurrence from both strings.\nStep 3: Count total remaining unmatched letters:\nN = Length(Remaining A) + Length(Remaining B)\nIf N = 0, the count defaults to 0 (or players typically consider the names perfectly matched).\n\nStep 4: Circular Elimination on list [F, L, A, M, E, S]:\nSet current position index = 0\nWhile length of list > 1:\n- Target elimination index = (current position + N − 1) mod (current list length)\n- Remove letter at target elimination index from the list\n- New current position = target elimination index (wrapping around if necessary)\n\nAcronym Meanings:\n- F: Friends\n- L: Love\n- A: Affection\n- M: Marriage\n- E: Enemy\n- S: Siblings",

  example:
    "Consider the classic Indian names 'RAHUL' and 'PRIYA':\n- Name 1: R - A - H - U - L\n- Name 2: P - R - I - Y - A\n\nStep-by-Step Cancellation:\n1. Common letter 'R' found: cross out 'R' in RAHUL and 'R' in PRIYA.\n2. Common letter 'A' found: cross out 'A' in RAHUL and 'A' in PRIYA.\n3. Remaining letters in Name 1: H, U, L (3 letters)\n4. Remaining letters in Name 2: P, I, Y (3 letters)\n5. Total unmatched count N = 3 + 3 = 6 letters.\n\nCircular Elimination on [F, L, A, M, E, S] with step size 6:\n- 1st Elimination (count 6): 'S' is eliminated. Remaining: [F, L, A, M, E]\n- 2nd Elimination (count 6 from F): 'F' is eliminated. Remaining: [L, A, M, E]\n- 3rd Elimination (count 6 from L): 'A' is eliminated. Remaining: [L, M, E]\n- 4th Elimination (count 6 from M): 'L' is eliminated. Remaining: [M, E]\n- 5th Elimination (count 6 from M): 'E' is eliminated. Final remaining letter: 'M'\n\nResult: **M - Marriage** (a fun, nostalgic game outcome!).",

  mistakes:
    "1. Taking the game results seriously in real life: FLAMES is a whimsical recreational game from youth culture; making real relationship decisions based on name anagrams is irrational.\n2. Canceling multiple letters for a single match: If Name 1 has one 'A' and Name 2 has two 'A's, only one pair is crossed off, leaving the second 'A' in the remaining count.\n3. Restarting the elimination count from letter 'F' each round: In true traditional FLAMES rules, counting resumes from the letter immediately following the eliminated character, not from the beginning of the word.\n4. Entering middle names or titles inconsistently: Adding titles like 'Mr.', 'Dr.', or varying initials drastically changes letter counts and alters the game outcome.\n5. Using special characters or non-English alphabets: The classic algorithm relies strictly on the 26 Latin letters (A–Z).",

  faqs: [
    {
      question: "Is the FLAMES calculator scientifically or psychologically accurate?",
      answer:
        "No. The FLAMES game has zero scientific, astrological, or psychological basis. It is an algorithmic party trick and schoolyard game designed purely for nostalgic fun and entertainment among friends.",
    },
    {
      question: "What does each letter in FLAMES stand for?",
      answer:
        "The letters stand for six classic relationship archetypes: F = Friends, L = Love, A = Affection, M = Marriage, E = Enemy, and S = Siblings.",
    },
    {
      question: "Does the order of the two names matter?",
      answer:
        "No. Because common letters are canceled in pairs regardless of who is entered first, the total number of unmatched remaining letters (N) is identical whether you enter 'Rahul and Priya' or 'Priya and Rahul'.",
    },
    {
      question: "What happens if both names share all identical letters?",
      answer:
        "If two names contain the exact same letters in identical counts (e.g. an anagram), the remaining count N becomes 0. In this case, the calculator displays a special playful outcome celebrating complete letter synchronicity.",
    },
    {
      question: "Can I share my FLAMES result with friends?",
      answer:
        "Yes, our calculator includes a one-click Share button so you can copy your nostalgic game result and share it with friends across WhatsApp, Instagram, or social media.",
    },
  ],

  authorityLinks: [
    { text: "National Council of Science Museums (NCSM) - Science Popularisation", url: "https://ncsm.gov.in/" },
    { text: "Ministry of Information and Broadcasting", url: "https://mib.gov.in/" },
  ],

  relatedCalculators: ["love-calculator", "percentage-calculator", "age-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
