import axios from "axios";
import { config } from "../config";
import { type HGBrasilResponse, type InsertQuote, type Currency } from "@shared/schema";
import { storage } from "../storage";

export class CurrencyService {
  private readonly baseUrl = config.apiBaseUrl;

  private async waitAndRetry(delayMs: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, delayMs));
  }

  async fetchQuotes(retryCount = 0): Promise<void> {
    try {
      console.log(`[${new Date().toISOString()}] Buscando cotações para: ${config.currencyCodes.join(", ")}`);

      const url = `${this.baseUrl}?key=${config.hgBrasilToken}`;
      const response = await axios.get<HGBrasilResponse>(url);

      if (!response.data.results?.currencies) {
        console.log(`[${new Date().toISOString()}] Nenhuma cotação recebida da API`);
        return;
      }

      const currencies = response.data.results.currencies;

      // Para cada moeda que queremos monitorar
      for (const code of config.currencyCodes) {
        const currency = currencies[code] as Currency;
        if (!currency || typeof currency === 'string') continue;

        const insertQuote: InsertQuote = {
          symbol: `${code}-BRL`,
          price: currency.buy.toString(),
          change: (currency.buy - (currency.buy / (1 + currency.variation / 100))).toString(),
          changePercent: currency.variation.toString(),
          updatedAt: new Date(),
        };

        await storage.saveQuote(insertQuote);
        console.log(`[${new Date().toISOString()}] Cotação salva para ${code}-BRL: ${currency.buy}`);
      }
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