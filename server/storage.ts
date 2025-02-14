import { quotes, type Quote, type InsertQuote } from "@shared/schema";

export interface IStorage {
  saveQuote(quote: InsertQuote): Promise<Quote>;
  getLatestQuotes(): Promise<Quote[]>;
  getQuotesByPair(fromCurrency: string, toCurrency: string): Promise<Quote[]>;
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
    
    // Keep only last 1000 quotes per pair to prevent memory issues
    const pair = `${quote.fromCurrency}-${quote.toCurrency}`;
    const pairQuotes = this.quotes.filter(q => 
      `${q.fromCurrency}-${q.toCurrency}` === pair
    );
    
    if (pairQuotes.length > 1000) {
      const toRemove = pairQuotes[0];
      this.quotes = this.quotes.filter(q => q.id !== toRemove.id);
    }

    return quote;
  }

  async getLatestQuotes(): Promise<Quote[]> {
    const pairs = new Set(
      this.quotes.map(q => `${q.fromCurrency}-${q.toCurrency}`)
    );
    
    return Array.from(pairs).map(pair => {
      const [fromCurrency, toCurrency] = pair.split("-");
      const pairQuotes = this.quotes.filter(
        q => q.fromCurrency === fromCurrency && q.toCurrency === toCurrency
      );
      return pairQuotes[pairQuotes.length - 1];
    });
  }

  async getQuotesByPair(fromCurrency: string, toCurrency: string): Promise<Quote[]> {
    return this.quotes.filter(
      q => q.fromCurrency === fromCurrency && q.toCurrency === toCurrency
    );
  }
}

export const storage = new MemStorage();
