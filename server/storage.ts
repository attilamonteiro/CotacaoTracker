import { quotes, type Quote, type InsertQuote } from "@shared/schema";

export interface IStorage {
  saveQuote(quote: InsertQuote): Promise<Quote>;
  getLatestQuotes(): Promise<Quote[]>;
  getQuotesBySymbol(symbol: string): Promise<Quote[]>;
}

export class MemStorage implements IStorage {
  private quotes: Quote[];
  private currentId: number;

  constructor() {
    this.quotes = [];
    this.currentId = 1;
  }

  async saveQuote(insertQuote: InsertQuote): Promise<Quote> {
    const quote: Quote = {
      ...insertQuote,
      id: this.currentId++,
    };
    this.quotes.push(quote);

    // Manter apenas as últimas 1000 cotações por símbolo para evitar problemas de memória
    const symbolQuotes = this.quotes.filter(q => q.symbol === quote.symbol);

    if (symbolQuotes.length > 1000) {
      const toRemove = symbolQuotes[0];
      this.quotes = this.quotes.filter(q => q.id !== toRemove.id);
    }

    return quote;
  }

  async getLatestQuotes(): Promise<Quote[]> {
    const symbols = new Set(this.quotes.map(q => q.symbol));

    return Array.from(symbols).map(symbol => {
      const symbolQuotes = this.quotes.filter(q => q.symbol === symbol);
      return symbolQuotes[symbolQuotes.length - 1];
    });
  }

  async getQuotesBySymbol(symbol: string): Promise<Quote[]> {
    return this.quotes.filter(q => q.symbol === symbol);
  }
}

export const storage = new MemStorage();