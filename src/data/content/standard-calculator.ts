import type { CalculatorEducationalContent } from "../content-types";

const content: CalculatorEducationalContent = {
  whatItDoes:
    "The standard calculator delivers a fast, responsive four-function arithmetic interface for daily budgeting, office work, retail transactions, and household calculations. Providing clean decimal precision and support for addition, subtraction, multiplication, division, percentage offsets, square roots, sign inversion (±), and classic memory functions (M+, M−, MR, MC), it replicates the dependable workflow of classic desktop desk calculators directly in your web browser without lag, ads, or clutter.",

  howItWorks:
    "Operating the standard calculator is straightforward with either mouse clicks or direct keyboard input:\n\n1. Number Input: Click digits 0 through 9 or press them on your physical keyboard number pad. Use the decimal point '.' for precise currency and fractional inputs.\n2. Basic Arithmetic Operators: Press '+', '−', '×', or '÷' to chain calculations. The running operation is tracked visually in the display header.\n3. Percentage Key (%): Press '%' to instantly apply discounts, markups, or tax additions to the current operand.\n4. Memory Registers: Use 'M+' to add the displayed value to memory, 'M−' to subtract from memory, 'MR' to recall the stored value, and 'MC' to clear the memory register.\n5. Sign Change (±): Press '±' to toggle positive and negative signs for accounting adjustments.\n6. Clear Keys: Press 'C' to clear the current entry, or 'AC' (All Clear) to reset the entire operation history to zero.\n\nPress '=' or the Enter key on your keyboard to finalize the computation and display the result.",

  formula:
    "The standard calculator processes arithmetic according to elementary operational rules:\n\n1. Addition: A + B = Sum\n2. Subtraction: A − B = Difference\n3. Multiplication: A × B = Product\n4. Division: A ÷ B = Quotient (with B ≠ 0)\n5. Percentage Operations:\n   - Tax / Markup Addition: Total = Base × (1 + Rate / 100)\n   - Discount Reduction: Total = Base × (1 − Rate / 100)\n6. Square Root: y = √x such that y² = x (for x ≥ 0)\n7. Memory Accumulation:\n   - M+ Action: M_{new} = M_{old} + Display\n   - M− Action: M_{new} = M_{old} − Display",

  example:
    "Example 1 (Retail Billing with GST):\nA small business tallying store items and applying 18% GST:\n- Items: ₹1,500 + ₹450 − ₹180 promotional credit = ₹1,770 base\n- Applying 18% tax on a ₹1,500 product: 1500 × 1.18 = ₹1,770\n\nExample 2 (Discount Application):\nCalculating a 15% discount on a ₹2,500 purchase:\n- Discount amount: 2500 × 0.15 = ₹375\n- Net payable total: 2500 − 375 = ₹2,125\n\nExample 3 (Expense Splitting):\nDividing a monthly shared utility bill of ₹12,000 evenly among 5 roommates:\n- Per-person share: 12000 ÷ 5 = ₹2,400",

  mistakes:
    "1. Dividing by zero: Attempting to divide any number by 0 results in an 'Error' or 'Cannot divide by zero' state, as division by zero is mathematically undefined.\n2. Forgetting active memory contents: Leaving old values stored in the 'M' register will corrupt subsequent calculations when pressing M+ or MR. Always press 'MC' before starting a new memory sequence.\n3. Confusing sequential arithmetic with algebraic precedence: Standard desktop calculators evaluate operations immediately upon pressing the next operator rather than waiting to enforce algebraic order of operations. Use parentheses or our Scientific Calculator for multi-step formulas.\n4. Entering multiple decimal points: Double-clicking the decimal key (e.g. 12.3.4) causes input errors; ensure only one decimal point exists per numeric value.\n5. Premature rounding: Rounding off intermediate currency decimals before completing all multiplication and division steps causes cumulative rounding discrepancy.",

  faqs: [
    {
      question: "How do the memory keys (M+, M-, MR, MC) work?",
      answer:
        "The memory keys act as a digital scratchpad. 'M+' adds the current screen number to the stored memory total. 'M−' subtracts the screen number from memory. 'MR' (Memory Recall) brings the stored memory total back onto the screen. 'MC' (Memory Clear) resets the stored memory number back to zero.",
    },
    {
      question: "Can I use keyboard shortcuts on this calculator?",
      answer:
        "Yes, the standard calculator is fully keyboard-accessible. You can use your computer's number keys, the numpad (+, −, *, /), Enter for equals, Backspace to delete the last digit, and Escape to clear the display.",
    },
    {
      question: "What is the difference between C and AC?",
      answer:
        "'C' (Clear) erases only the most recently typed number on the screen, preserving the rest of your ongoing arithmetic equation. 'AC' (All Clear) wipes the entire calculation history, active operators, and reset values back to zero.",
    },
    {
      question: "How do I calculate percentage discounts on this calculator?",
      answer:
        "To find a 20% discount on 500, enter '500', press '×', enter '20', press '%', and then press '−' followed by '=' to view the final discounted price of 400.",
    },
    {
      question: "Does the standard calculator save my calculation history?",
      answer:
        "For maximum privacy, all calculations execute locally in your active browser session. When you reload or close the tab, the screen resets, ensuring no sensitive financial figures remain cached on your device.",
    },
  ],

  authorityLinks: [
    { text: "Department of Financial Services, Ministry of Finance", url: "https://financialservices.gov.in/" },
    { text: "Reserve Bank of India (RBI)", url: "https://www.rbi.org.in/" },
  ],

  relatedCalculators: ["percentage-calculator", "gst-calculator", "scientific-calculator", "product-profit-calculator"],
  lastReviewed: "2026-11-21",
};

export default content;
