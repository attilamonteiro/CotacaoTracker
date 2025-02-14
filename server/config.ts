import dotenv from "dotenv";
dotenv.config();

export const config = {
  brapiToken: "oo4mbXLdCG3ESXiaKhpiPU",
  currencyPairs: "USD-BRL,EUR-USD", // Monitorando múltiplas moedas
  fetchIntervalSeconds: 1800, // 30 minutos conforme limite do plano gratuito
  apiBaseUrl: "https://brapi.dev/api/v2",
};