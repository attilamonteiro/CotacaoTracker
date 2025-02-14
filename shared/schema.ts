import { pgTable, text, numeric, timestamp, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const quotes = pgTable("quotes", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  price: text("price").notNull(),
  change: text("change").notNull(),
  changePercent: text("change_percent").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const insertQuoteSchema = createInsertSchema(quotes).omit({ id: true });

export type InsertQuote = z.infer<typeof insertQuoteSchema>;
export type Quote = typeof quotes.$inferSelect;

// API Types
export interface HGBrasilResponse {
  by: string;
  valid_key: boolean;
  results: {
    currencies: {
      source: string;
      [key: string]: {
        name: string;
        buy: number;
        sell: number;
        variation: number;
      } | string;
    };
  };
}

export interface Currency {
  code: string;
  name: string;
  buy: number;
  sell: number;
  variation: number;
}