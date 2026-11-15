import { RatesService } from "../src/services/ratesService.js";
import { env } from "../src/config/env.js";

async function main() {
  console.log("=== REAL RUN BENCHMARK & MULTIPLIER VERIFICATION ===");
  const service = new RatesService({
    metalsDevApiKey: env.metalsDevApiKey,
  });

  const rates = await service.getRates();
  if (!rates) {
    console.error("Failed to retrieve live rates!");
    process.exit(1);
  }

  console.log("--- Real Run Results ---");
  console.log(`Gold-API Spot Gold / g:  ₹${rates.spotGold24kPerGram.toFixed(2)}`);
  console.log(`Gold-API Spot Silver / g: ₹${rates.spotSilverPerGram.toFixed(2)}`);
  console.log(`Multiplier Gold:          ${rates.multiplierGold.toFixed(4)}`);
  console.log(`Multiplier Silver:        ${rates.multiplierSilver.toFixed(4)}`);
  console.log(`Adjusted Flag:            ${rates.adjusted}`);
  console.log(`Benchmark Name:           ${rates.benchmark?.name}`);
  console.log(`Benchmark Updated At:     ${rates.benchmark?.updatedAt}`);
  console.log(`Source:                   ${rates.source}`);
  console.log(`Final 24K Gold / g:       ₹${rates.gold24kPerGram.toFixed(2)}`);
  console.log(`Final 24K Gold / 10g:     ₹${Math.round(rates.gold24kPerGram * 10).toLocaleString("en-IN")}`);
  console.log(`Final Silver / g:         ₹${rates.silverPerGram.toFixed(2)}`);
  console.log(`Final Silver / kg:        ₹${Math.round(rates.silverPerGram * 1000).toLocaleString("en-IN")}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
