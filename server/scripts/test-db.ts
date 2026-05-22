import { findSubscriberByEmail, createSubscriber } from "../src/services/subscriberService.js";

async function main() {
  try {
    const existing = await findSubscriberByEmail("test@example.com");
    console.log("find:", existing);
    const created = await createSubscriber({
      email: `test-${Date.now()}@example.com`,
      source: "website",
      status: "active",
    });
    console.log("create:", created);
  } catch (err) {
    console.error("FAILED:", err);
    process.exit(1);
  }
}

main();
