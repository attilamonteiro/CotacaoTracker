import dotenv from "dotenv";
dotenv.config();

export const config = {
  hgBrasilToken: process.env.HG_BRASIL_TOKEN || "seu-token-aqui", // Token da HG Brasil
  currencyCodes: ["USD", "EUR"], // Códigos das moedas que queremos monitorar
  fetchIntervalSeconds: 1800, // 30 minutos
  apiBaseUrl: "https://api.hgbrasil.com/finance",
};