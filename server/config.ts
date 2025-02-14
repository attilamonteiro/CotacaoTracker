import dotenv from "dotenv";
dotenv.config();

export const config = {
  brapiToken: "2sEFJNi1iWy9XaeMPdZeLF",
  currencySymbol: "USDBRL", // Símbolo para cotação USD/BRL
  fetchIntervalSeconds: 1800, // 30 minutos conforme limite do plano gratuito
  apiBaseUrl: "https://brapi.dev/api",
};