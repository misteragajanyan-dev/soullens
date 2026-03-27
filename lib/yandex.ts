import OpenAI from "openai";

export const yandex = new OpenAI({
  apiKey: process.env.YANDEX_API_KEY!,
  baseURL: process.env.YANDEX_BASE_URL!,
});