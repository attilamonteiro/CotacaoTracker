import dotenv from "dotenv";
dotenv.config();

export const config = {
  brapiToken: "2sEFJNi1iWy9XaeMPdZeLF",
  currencyPairs: ["USD-BRL"], // Simplified to just USD-BRL for testing
  fetchIntervalSeconds: 60,
  apiBaseUrl: "https://brapi.dev/api/v2",
};