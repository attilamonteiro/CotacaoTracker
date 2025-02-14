import dotenv from "dotenv";
dotenv.config();

export const config = {
  brapiToken: process.env.BRAPI_TOKEN || "",
  currencyPairs: ["USD-BRL", "EUR-USD"],
  fetchIntervalSeconds: 60,
  apiBaseUrl: "https://brapi.dev/api/v2",
};
