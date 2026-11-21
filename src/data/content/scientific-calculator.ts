import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The scientific calculator provides an advanced mathematical computing environment engineered for high-school students, engineering undergraduates, scientists, and financial analysts. It handles algebraic, trigonometric, logarithmic, and exponential operations with complete support for operator precedence (BODMAS/PEMDAS). Whether evaluating transcendent functions like sine and cosine in degrees or radians, computing base-10 and natural logarithms, raising numbers to arbitrary powers, extracting square roots, or computing factorials, it delivers instant mathematical precision directly in your browser without requiring external software.",

  howItWorks:
    "Using the scientific calculator involves entering mathematical expressions through the interactive keypad or physical keyboard:\n\n1. Arithmetic & Expression Building: Enter operands and operators (+, −, ×, ÷). Use parentheses '(' and ')' to enforce grouping and custom order of operations.\n2. Angle Mode (DEG / RAD): Toggle between Degrees and Radians before performing trigonometric calculations (e.g. sin, cos, tan, and inverse functions).\n3. Trigonometry Functions: Compute direct functions (sin, cos, tan) and inverse trigonometric functions (asin, acos, atan).\n4. Logarithms & Exponentials: Use 'log' for common logarithms (base 10) and 'ln' for natural logarithms (base e ≈ 2.71828). Use 'e^x' for natural exponents.\n5. Powers & Roots: Utilize 'x²' for squaring, 'x^y' for arbitrary powers, and '√' for square roots.\n6. Factorials & Constants: Press 'n!' for integer factorials and access mathematical constants π (pi ≈ 3.14159) and e.\n\nClick '=' to evaluate the full expression, or 'C' / 'AC' to clear and reset the display.",

  formula:
    "The calculator enforces standard algebraic operator precedence (PEMDAS / BODMAS):\n\n1. Parentheses and Brackets: Expressions inside brackets are evaluated first from the innermost outward.\n2. Exponents and Roots: Powers (x^y) and radicals (√x) are evaluated next from right to left.\n3. Multiplication and Division: Evaluated left to right with equal precedence.\n4. Addition and Subtraction: Evaluated left to right with equal precedence.\n\nCore Mathematical Formulations:\n- Trigonometry: sin(θ), cos(θ), tan(θ) where angle θ is converted to radians if in degree mode: θ_rad = θ_deg × (π / 180)\n- Common Logarithm: y = log10(x) implies 10^y = x (for x > 0)\n- Natural Logarithm: y = ln(x) implies e^y = x (where e ≈ 2.718281828)\n- Factorial: n! = n × (n − 1) × (n − 2) × ... × 2 × 1 (with 0! = 1, for non-negative integers n)\n- Power: x^y = exp(y × ln(x))",

  example:
    "Practical Mathematical Verification Examples:\n\n1. Trigonometric Evaluation:\nCompute sin(30°) in Degree Mode:\n- Input: sin(30)\n- Degree to radian conversion: 30 × (π / 180) = π / 6 radians\n- Evaluated Output: 0.5\n\n2. Arbitrary Exponentiation:\nCompute 2 raised to the power of 10:\n- Input: 2 ^ 10\n- Evaluated Output: 1024\n\n3. Logarithmic Computation:\nCompute common logarithm of 1000:\n- Input: log10(1000)\n- Logic: 10^3 = 1000\n- Evaluated Output: 3\n\n4. Factorial Operation:\nCompute 5 factorial (5!):\n- Input: 5! = 5 × 4 × 3 × 2 × 1\n- Evaluated Output: 120\n\n5. Square Root:\nCompute √144:\n- Evaluated Output: 12",

  mistakes:
    "1. Calculating trigonometric angles in the wrong angle mode: Evaluating sin(90) in Radian mode yields 0.89399 instead of the intended 1.0 (which requires Degree mode).\n2. Entering negative numbers into real logarithms: The logarithm of zero or negative numbers is undefined in real-number arithmetic (e.g. log(-5) causes an error).\n3. Omitting explicit parentheses in complex denominators: Writing '100 / 2 × 5' evaluates to 250 under standard left-to-right rules; if you intend to divide by 10, write '100 / (2 × 5)'.\n4. Applying factorials to fractional or negative inputs: Standard factorials (n!) are strictly defined for non-negative integers (0, 1, 2, ...).\n5. Confusing common log (base 10) with natural log (base e): 'log' uses base 10, while 'ln' uses Euler's constant e; using the wrong function introduces major scaling errors in physics and engineering problems.",

  faqs: [
    {
      question: "What is the difference between Radian and Degree mode?",
      answer:
        "Degrees divide a full circle into 360 equal units, commonly used in navigation, surveying, and basic geometry. Radians measure angles based on the radius of a circle, where a full circle is 2π radians (approx 6.28318 rad). Calculus, harmonic motion, and advanced physics require radians, whereas standard geometry problems typically use degrees.",
    },
    {
      question: "How does the calculator handle order of operations (BODMAS)?",
      answer:
        "The calculator processes expressions according to universal BODMAS/PEMDAS conventions: Brackets, Orders/Exponents, Division and Multiplication (left-to-right), followed by Addition and Subtraction (left-to-right). For example, entering 4 + 5 × 2 automatically evaluates multiplication first, giving 14, not 18.",
    },
    {
      question: "Why is 0! (zero factorial) equal to 1?",
      answer:
        "In combinatorics, the factorial of n represents the number of ways to arrange n distinct objects. There is exactly one way to arrange zero objects (the empty set). Mathematically, defining 0! = 1 maintains consistency across binomial expansion, Taylor series, and permutation formulas like nPr = n! / (n − r)!.",
    },
    {
      question: "What is Euler's number (e) and when is it used?",
      answer:
        "Euler's number (e ≈ 2.71828) is an irrational mathematical constant that forms the natural base of exponential growth and decay. It appears universally in continuous compound interest calculations, radioactive decay modeling, probability distributions, and electrical calculus.",
    },
    {
      question: "Can this scientific calculator work offline in the browser?",
      answer:
        "Yes, our scientific calculator runs entirely via client-side JavaScript in your browser. Once loaded, calculations are processed locally on your device without sending mathematical data to any external server.",
    },
  ],

  authorityLinks: [
    { text: "Indian Statistical Institute (ISI)", url: "https://www.isical.ac.in/" },
    { text: "National Programme on Technology Enhanced Learning (NPTEL) - Mathematics", url: "https://nptel.ac.in/" },
  ],

  relatedCalculators: ["standard-calculator", "percentage-calculator", "cgpa-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
