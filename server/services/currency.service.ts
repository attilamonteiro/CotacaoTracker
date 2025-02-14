import axios from "axios";
import { config } from "../config";
import { type BrapiQuoteResponse, type InsertQuote } from "@shared/schema";
import { storage } from "../storage";

export class CurrencyService {
  private readonly axiosInstance = axios.create({
    baseURL: config.apiBaseUrl,
  });

  private async waitAndRetry(delayMs: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  async fetchQuotes(retryCount = 0): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Buscando cotação do ${config.currencySymbol}`);

      const response = await this.axiosInstance.get<BrapiQuoteResponse>(`/quote/${config.currencySymbol}`, {
        params: {
          token: config.brapiToken,
        },
      });

      if (!response.data.results || response.data.results.length === 0) {
        console.log(`[${new Date().toISOString()}] Nenhuma cotação recebida da API`);
        return;
      }

      const quote = response.data.results[0];
      const insertQuote: InsertQuote = {
        symbol: quote.symbol,
        price: quote.regularMarketPrice.toString(),
        change: quote.regularMarketChange.toString(),
        changePercent: quote.regularMarketChangePercent.toString(),
        updatedAt: new Date(quote.regularMarketTime),
      };

      await storage.saveQuote(insertQuote);
      console.log(`[${new Date().toISOString()}] Cotação salva para ${quote.symbol}: ${quote.regularMarketPrice}`);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const responseData = error.response?.data;
        const status = error.response?.status;

        console.error(`[${new Date().toISOString()}] Erro na API:`, {
          status: status,
          mensagem: responseData?.message || 'Erro desconhecido',
          detalhes: {
            url: error.config?.url,
            parametros: error.config?.params,
          }
        });

        if ((status === 429 || status === 503) && retryCount < 3) {
          const delayMs = Math.pow(2, retryCount) * 1000;
          console.log(`[${new Date().toISOString()}] Aguardando ${delayMs}ms antes de tentar novamente...`);
          await this.waitAndRetry(delayMs);
          return this.fetchQuotes(retryCount + 1);
        }
      } else {
        console.error(`[${new Date().toISOString()}] Erro ao buscar cotações:`, error);
      }
    }
  }
}

export const currencyService = new CurrencyService();