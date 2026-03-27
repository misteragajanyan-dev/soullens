import OpenAI from "openai";

const apiKey = process.env.YANDEX_API_KEY;
const baseURL = process.env.YANDEX_BASE_URL;

if (!apiKey) {
  throw new Error("YANDEX_API_KEY is missing");
}

if (!baseURL) {
  throw new Error("YANDEX_BASE_URL is missing");
}

export const yandex = new OpenAI({
  apiKey,
  baseURL,
});