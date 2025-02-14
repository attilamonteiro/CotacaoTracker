import axios from "axios";
import { config } from "../config";
import { type BrapiQuoteResponse, type InsertQuote } from "@shared/schema";
import { storage } from "../storage";

export class CurrencyService {
  private readonly axiosInstance = axios.create({
    baseURL: config.apiBaseUrl,
  });

  async fetchQuotes(): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Fetching quotes for pairs: ${config.currencyPairs.join(",")}`);

      const response = await this.axiosInstance.get<BrapiQuoteResponse>("/currency", {
        params: {
          currency: config.currencyPairs.join(","),
          token: config.brapiToken,
        },
      });

      if (!response.data.currency || response.data.currency.length === 0) {
        console.log(`[${new Date().toISOString()}] No quotes received from API`);
        return;
      }

      for (const quote of response.data.currency) {
        const insertQuote: InsertQuote = {
          fromCurrency: quote.fromCurrency,
          toCurrency: quote.toCurrency,
          name: quote.name,
          high: quote.high,
          low: quote.low,
          bidVariation: quote.bidVariation,
          percentageChange: quote.percentageChange,
          bidPrice: quote.bidPrice,
          askPrice: quote.askPrice,
          updatedAt: new Date(quote.updatedAtDate),
        };

        await storage.saveQuote(insertQuote);
        console.log(`[${new Date().toISOString()}] Saved quote for ${quote.fromCurrency}-${quote.toCurrency}: ${quote.bidPrice}`);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        console.error(`[${new Date().toISOString()}] API Error:`, {
          status: error.response?.status,
          data: responseData,
          message: error.message,
          url: error.config?.url,
          params: error.config?.params,
        });
      } else {
        console.error(`[${new Date().toISOString()}] Error fetching quotes:`, error);
      }
    }
  }
}

export const currencyService = new CurrencyService();