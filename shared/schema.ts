import { pgTable, text, numeric, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  name: text("name").notNull(),
  high: numeric("high").notNull(),
  low: numeric("low").notNull(),
  bidVariation: numeric("bid_variation").notNull(),
  percentageChange: numeric("percentage_change").notNull(),
  bidPrice: numeric("bid_price").notNull(),
  askPrice: numeric("ask_price").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true });

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

// API Types
export interface BrapiQuoteResponse {
  currency: BrapiQuote[];
}

export interface BrapiQuote {
  fromCurrency: string;
  toCurrency: string;
  name: string;
  high: string;
  low: string;
  bidVariation: string;
  percentageChange: string;
  bidPrice: string;
  askPrice: string;
  updatedAtTimestamp: string;
  updatedAtDate: string;
}
