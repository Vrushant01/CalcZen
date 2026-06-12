import { Lightbulb } from "lucide-react";

type Props = {
  example: string;
};

export function CalculatorExample({ example }: Props) {
  const steps = example
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <section className="calc-example-section" aria-labelledby="calc-example-heading">
      <div className="calc-formula-header">
        <span className="calc-example-icon" aria-hidden>
          <Lightbulb className="h-5 w-5" />
        </span>
        <h2 id="calc-example-heading" className="calc-formula-title">
          Example Calculation
        </h2>
      </div>
      <ol className="calc-example-steps">
        {steps.map((step, i) => (
          <li key={i} className="calc-example-step">
            <span className="calc-example-step-num" aria-hidden>
              {i + 1}
            </span>
            <span className="calc-example-step-text">{step}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}
