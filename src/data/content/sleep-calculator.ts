import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The Sleep Calculator is a health tool designed to optimize your sleeping patterns and cycles. By utilizing the 90-minute sleep cycle standard, it calculates the most scientifically recommended bedtimes and wake-up times to ensure that you wake up at the end of a completed cycle rather than in the middle of deep sleep, helping to prevent morning grogginess (known as sleep inertia). The calculator supports calculating forward from a bedtime, backward from a target wake-up time, or planning wake-up targets if you go to sleep immediately.",

  howItWorks:
    "To use the Sleep Calculator, simply choose one of the three calculation modes: 'I want to wake up at' (Mode 1), 'I want to sleep now' (Mode 2), or 'Custom Sleep Planning' (Mode 3). For Mode 1 and 3, you enter your target times. The calculator applies a default 15-minute sleep latency (the average time it takes a healthy adult to fall asleep) and segments the rest of the night into 90-minute cycles. It then projects the exact timeline of cycles, mapping out light, deep, and REM sleep phases, and rates your planned rest from Poor to Optimal.",

  formula:
    "The sleep cycle model assumes that an average human sleep cycle lasts approximately 90 minutes. A full night of sleep consists of 5 to 6 of these cycles.\n\nOptimal Bedtimes (from wake-up time):\nBedtime = Wake-up Time - (Cycle Count × 90 minutes) - Sleep Latency (15 mins)\n\nOptimal Wake-up Times (from bedtime):\nWake-up Time = Bedtime + Sleep Latency (15 mins) + (Cycle Count × 90 minutes)\n\nCycle Count ranges from 1 to 6 (where 5-6 cycles are recommended for most adults to get 7.5 to 9 hours of sleep).",

  example:
    "Let's say you want to wake up at 6:00 AM. Working backward to calculate bedtimes:\n1. 6 cycles (9 hours): 6:00 AM - 9h = 9:00 PM. Subtracting 15 minutes to fall asleep gives a bedtime of 8:45 PM.\n2. 5 cycles (7.5 hours): 6:00 AM - 7.5h = 10:30 PM. Subtracting 15 minutes gives a bedtime of 10:15 PM.\n3. 4 cycles (6 hours): Bedtime is 11:45 PM.\n\nIf you choose to sleep at 10:15 PM, you will fall asleep around 10:30 PM, complete 5 full sleep cycles, and wake up naturally at 6:00 AM feeling refreshed.",

  mistakes:
    "The most common mistake when planning sleep is ignoring sleep latency (the time it takes to fall asleep). Going to bed exactly 7.5 hours before your alarm means you will likely only sleep for 7 hours and 15 minutes, waking up in the middle of deep sleep and feeling tired. Another mistake is ignoring consistency; sleeping 9 hours on weekends doesn't make up for sleeping 5 hours during the week. Additionally, failing to account for individual sleep cycle lengths (which can vary slightly between 80 and 110 minutes) can lead to slightly misaligned schedules.",

  faqs: [
    {
      question: "What is a sleep cycle?",
      answer:
        "A sleep cycle is a progression through stages of non-REM (NREM) and REM sleep, lasting about 90 minutes. It repeats 4 to 6 times a night.",
    },
    {
      question: "How many hours of sleep do adults need?",
      answer:
        "Most healthy adults need 7 to 9 hours of sleep per night, which corresponds to 5 or 6 complete sleep cycles.",
    },
    {
      question: "Why do I feel tired after sleeping 8 hours?",
      answer:
        "You might have woken up in the middle of a deep sleep stage. Waking up during light sleep or at the end of a cycle makes you feel refreshed.",
    },
    {
      question: "What is sleep latency?",
      answer:
        "Sleep latency is the time it takes to transition from full wakefulness to sleep. For healthy adults, the average is 10 to 20 minutes.",
    },
  ],

  relatedCalculators: [
    "water-intake-calculator",
    "calorie-calculator",
    "bmr-calculator",
    "bmi-calculator",
  ],

  authorityLinks: [
    { text: "National Sleep Foundation", url: "https://www.sleepfoundation.org" },
    { text: "American Academy of Sleep Medicine", url: "https://aasm.org" },
  ],
};

export default content;
