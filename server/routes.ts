import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { startScheduler } from "./scheduler";

export async function registerRoutes(app: Express): Promise<Server> {
  // Start the quote fetcher
  startScheduler();

  // API Routes
  app.get("/api/quotes/latest", async (_req, res) => {
    try {
      const quotes = await storage.getLatestQuotes();
      res.json({ quotes });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error getting latest quotes:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  app.get("/api/quotes/:fromCurrency/:toCurrency", async (req, res) => {
    try {
      const { fromCurrency, toCurrency } = req.params;
      const symbol = `${fromCurrency.toUpperCase()}-${toCurrency.toUpperCase()}`;
      const quotes = await storage.getQuotesBySymbol(symbol);
      res.json({ quotes });
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error getting quotes by pair:`, error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}