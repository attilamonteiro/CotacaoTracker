import { scheduleJob } from "node-schedule";
import { currencyService } from "./services/currency.service";
import { config } from "./config";

export function startScheduler() {
  console.log(`[${new Date().toISOString()}] Starting quote scheduler...`);
  
  // Fetch immediately on startup
  currencyService.fetchQuotes();
  
  // Schedule periodic fetches
  scheduleJob(`*/${config.fetchIntervalSeconds} * * * * *`, async () => {
    await currencyService.fetchQuotes();
  });
}
