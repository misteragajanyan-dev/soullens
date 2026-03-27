import { yandex } from "@/lib/yandex";

type AnalyzeProfileArgs = {
  imageBase64: string;
  mimeType: string;
  personLabel: string;
};

export async function analyzeProfileScreenshot({
  imageBase64,
  mimeType,
  personLabel,
}: AnalyzeProfileArgs): Promise<string> {
  const model = process.env.YANDEX_VISION_MODEL!;

  const response = await yandex.chat.completions.create({
    model,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "text",
            text: `
Опиши профиль ${personLabel} только по тому, что реально видно на скриншоте.

Не фантазируй и не придумывай фактов, которых не видно.

Нужно описать:
1. Визуальный стиль профиля
2. Тон самопрезентации
3. Какие интересы, ценности или сигналы явно видны
4. Насколько профиль выглядит открытым или закрытым
5. Какой образ человек транслирует
6. Какие черты цифрового вайба можно осторожно предположить

Правила:
- пиши на русском языке
- без markdown
- без символов **
- без списков с тире
- не используй фразы "возможно он", "наверное она" слишком часто
- текст должен быть аккуратным, наблюдательным и конкретным
- если информации на скрине мало, честно скажи, что выводы ограничены

Сделай один цельный связный текст на 2–4 абзаца.
`,
          },
          {
            type: "image_url",
            image_url: {
              url: `data:${mimeType};base64,${imageBase64}`,
            },
          },
        ],
      },
    ],
    temperature: 0.2,
  });

  const text = response.choices?.[0]?.message?.content?.trim() || "";

  return text
    .replace(/\*\*/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}