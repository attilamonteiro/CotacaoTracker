import dotenv from "dotenv";
dotenv.config();

export const config = {
  brapiToken: "oo4mbXLdCG3ESXiaKhpiPU",
  currencySymbol: "USD-BRL", // Formato correto para API de moedas
  fetchIntervalSeconds: 1800, // 30 minutos conforme limite do plano gratuito
  apiBaseUrl: "https://brapi.dev/api/v2",
};