import { pgTable, text, numeric, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  fromCurrency: text("from_currency").notNull(),
  toCurrency: text("to_currency").notNull(),
  name: text("name").notNull(),
  high: text("high").notNull(),
  low: text("low").notNull(),
  bidVariation: text("bid_variation").notNull(),
  percentageChange: text("percentage_change").notNull(),
  bidPrice: text("bid_price").notNull(),
  askPrice: text("ask_price").notNull(),
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