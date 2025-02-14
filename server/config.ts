import dotenv from "dotenv";
dotenv.config();

export const config = {
  brapiToken: "oo4mbXLdCG3ESXiaKhpiPU",
  currencySymbol: "USDBRL", // Usando o formato para ações/stocks
  fetchIntervalSeconds: 1800, // 30 minutos conforme limite do plano gratuito
  apiBaseUrl: "https://brapi.dev/api",
};