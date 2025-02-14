import axios from "axios";
import { config } from "../config";
import { type BrapiQuoteResponse, type InsertQuote } from "@shared/schema";
import { storage } from "../storage";

export class CurrencyService {
  private readonly axiosInstance = axios.create({
    baseURL: config.apiBaseUrl,
    headers: {
      Authorization: `Bearer ${config.brapiToken}`,
    },
  });

  async fetchQuotes(): Promise<void> {
    try {
      const response = await this.axiosInstance.get<BrapiQuoteResponse>("/currency", {
        params: {
          currency: config.currencyPairs.join(","),
        },
      });

      for (const quote of response.data.currency) {
        const insertQuote: InsertQuote = {
          fromCurrency: quote.fromCurrency,
          toCurrency: quote.toCurrency,
          name: quote.name,
          high: Number(quote.high),
          low: Number(quote.low),
          bidVariation: Number(quote.bidVariation),
          percentageChange: Number(quote.percentageChange),
          bidPrice: Number(quote.bidPrice),
          askPrice: Number(quote.askPrice),
          updatedAt: new Date(quote.updatedAtDate),
        };

        await storage.saveQuote(insertQuote);
        console.log(`[${new Date().toISOString()}] Saved quote for ${quote.fromCurrency}-${quote.toCurrency}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error(`[${new Date().toISOString()}] API Error:`, error.response?.data || error.message);
      } else {
        console.error(`[${new Date().toISOString()}] Error fetching quotes:`, error);
      }
    }
  }
}

export const currencyService = new CurrencyService();
