import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { getZodiacSign } from "@/lib/zodiac";
import { yandex } from "@/lib/yandex";
import { fileToBase64 } from "@/lib/file-to-base64";
import { analyzeProfileScreenshot } from "@/lib/vision";

export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      return await handleZodiacMode(req);
    }

    if (contentType.includes("multipart/form-data")) {
      return await handleScreenshotsMode(req);
    }

    return NextResponse.json(
      { error: "Неподдерживаемый тип запроса" },
      { status: 400 }
    );
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Ошибка сервера" },
      { status: 500 }
    );
  }
}

async function handleZodiacMode(req: Request) {
  const body = await req.json();

  const {
    mode = "zodiac",
    user1_name,
    user1_birthdate,
    user2_name,
    user2_birthdate,
  } = body;

  if (!user1_name || !user1_birthdate || !user2_name || !user2_birthdate) {
    return NextResponse.json(
      { error: "Не все поля заполнены" },
      { status: 400 }
    );
  }

  const user1_sign = getZodiacSign(user1_birthdate);
  const user2_sign = getZodiacSign(user2_birthdate);

  const prompt = `
Ты — автор персональных разборов совместимости.

Сделай разбор пары на русском языке так, чтобы текст ощущался как качественный платный продукт, а не как шаблонный гороскоп.

Формат ответа строго такой:

PREVIEW:
1 короткий цепляющий абзац до 220 символов. Он должен интриговать и создавать ощущение, что в этой паре есть важная динамика, которую хочется раскрыть.

FULL:
Подробный разбор на 5–7 абзацев.

Что обязательно должно быть в FULL:
- общая динамика пары
- что их сближает
- в чём у них сильная совместимость
- где между ними слабое место
- как они могут вести себя в конфликтах
- как проявляется притяжение и эмоциональная связь
- что может укрепить отношения

Данные пары:
${user1_name} (${user1_sign})
${user2_name} (${user2_sign})

Правила:
- не перечисляй сухие характеристики знаков
- не пиши шаблонно и слишком общо
- не используй markdown, списки и символы **
- пиши так, будто это разбор именно этой пары
- текст должен быть живым, эмоционально точным и правдоподобным
`;

  const completion = await yandex.chat.completions.create({
    model: process.env.YANDEX_MODEL!,
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
  });

  const aiText = completion.choices?.[0]?.message?.content || "";

  const cleanedText = aiText
    .replace(/\*\*/g, "")
    .replace(/\\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/^PREVIEW:\s*/i, "PREVIEW:\n")
    .replace(/^FULL:\s*/im, "FULL:\n")
    .trim();

  let preview_text = "";
  let full_text = cleanedText;

  if (cleanedText.includes("FULL:")) {
    const parts = cleanedText.split("FULL:");
    preview_text = parts[0].replace("PREVIEW:", "").trim();
    full_text = parts[1]?.trim() || cleanedText;
  } else {
    preview_text = cleanedText.slice(0, 220);
    full_text = cleanedText;
  }

  const compatibility_score = Math.floor(Math.random() * 36) + 60;

  const { data, error } = await supabase
    .from("readings")
    .insert([
      {
        mode,
        user1_name,
        user1_birthdate,
        user2_name,
        user2_birthdate,
        user1_sign,
        user2_sign,
        compatibility_score,
        preview_text,
        full_text,
        is_paid: false,
        payment_status: "pending",
        source: "telegram",
      },
    ])
    .select()
    .single();

  if (error) {
    console.error(error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    data,
    result_url: `/result/${data.id}`,
  });
}

async function handleScreenshotsMode(req: Request) {
  try {
    const formData = await req.formData();

    const mode = String(formData.get("mode") || "screenshots");
    const user1_name = String(formData.get("user1_name") || "Не указано");
    const user2_name = String(formData.get("user2_name") || "Не указано");
    const relationship_context = String(
      formData.get("relationship_context") || ""
    );

    const user1_image = formData.get("user1_image");
    const user2_image = formData.get("user2_image");

    if (!(user1_image instanceof File) || !(user2_image instanceof File)) {
      return NextResponse.json(
        { error: "Нужно загрузить два скриншота" },
        { status: 400 }
      );
    }

    const user1ImageUrl = await uploadProfileImage(user1_image, "user1");
    const user2ImageUrl = await uploadProfileImage(user2_image, "user2");

    const user1Base64 = await fileToBase64(user1_image);
    const user2Base64 = await fileToBase64(user2_image);

    const profile1Summary = await analyzeProfileScreenshot({
      imageBase64: user1Base64,
      mimeType: user1_image.type || "image/png",
      personLabel: user1_name,
    });

    const profile2Summary = await analyzeProfileScreenshot({
      imageBase64: user2Base64,
      mimeType: user2_image.type || "image/png",
      personLabel: user2_name,
    });

    const prompt = `
Ты — эксперт по совместимости, цифровому образу и стилю самопрезентации.

Твоя задача — сделать персональный разбор пары на русском языке так, чтобы текст был:
- конкретным
- правдоподобным
- эмоционально точным
- без мистики
- без воды
- без markdown, без **, без списков

Формат ответа строго такой:

PREVIEW:
1 короткий абзац до 220 символов. Он должен быть интригующим и цепляющим, как teaser платного продукта.

FULL:
Подробный разбор на 5–7 абзацев.

Что обязательно должно быть в FULL:
- общая динамика пары
- что их притягивает
- в чём они похожи
- где между ними напряжение
- как они ведут себя в близости и конфликтах
- что поможет отношениям стать сильнее

Данные пары:
Имя 1: ${user1_name}
Имя 2: ${user2_name}

Описание профиля 1:
${profile1Summary}

Описание профиля 2:
${profile2Summary}

Контекст:
${relationship_context || "Не указан"}

Правила:
- не придумывай факты, которых нельзя вывести из описаний
- делай осторожные, но уверенные выводы
- сравни стиль жизни, интересы, подачу себя, уровень открытости и эмоциональный вайб
- текст должен ощущаться как платный AI-разбор
`;

    const completion = await yandex.chat.completions.create({
      model: process.env.YANDEX_MODEL!,
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
    });

    const aiText = completion.choices?.[0]?.message?.content || "";

    const cleanedText = aiText
      .replace(/\*\*/g, "")
      .replace(/\\n/g, "\n")
      .replace(/\n{3,}/g, "\n\n")
      .replace(/^PREVIEW:\s*/i, "PREVIEW:\n")
      .replace(/^FULL:\s*/im, "FULL:\n")
      .trim();

    let preview_text = "";
    let full_text = cleanedText;

    if (cleanedText.includes("FULL:")) {
      const parts = cleanedText.split("FULL:");
      preview_text = parts[0].replace("PREVIEW:", "").trim();
      full_text = parts[1]?.trim() || cleanedText;
    } else {
      preview_text = cleanedText.slice(0, 220);
      full_text = cleanedText;
    }

    const compatibility_score = Math.floor(Math.random() * 31) + 65;

    const { data, error } = await supabase
      .from("readings")
      .insert([
        {
          mode,
          user1_name,
          user1_birthdate: "0000-00-00",
          user2_name,
          user2_birthdate: "0000-00-00",
          user1_sign: "Не определён",
          user2_sign: "Не определён",
          compatibility_score,
          preview_text,
          full_text,
          relationship_context,
          user1_image_url: user1ImageUrl,
          user2_image_url: user2ImageUrl,
          is_paid: false,
          payment_status: "pending",
          source: "telegram",
        },
      ])
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data,
      result_url: `/result/${data.id}`,
    });
  } catch (err: any) {
    console.error("handleScreenshotsMode error:", err);
    return NextResponse.json(
      { error: err?.message || "Ошибка режима screenshots" },
      { status: 500 }
    );
  }
}

async function uploadProfileImage(file: File, prefix: string): Promise<string> {
  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filePath = `${prefix}-${Date.now()}.jpg`;

  const { error } = await supabase.storage
    .from("profiles")
    .upload(filePath, buffer, {
      contentType: file.type,
      upsert: false,
    });

  if (error) {
    console.error("Storage upload error:", error);
    throw new Error("Не удалось загрузить изображение");
  }

  const { data } = supabase.storage.from("profiles").getPublicUrl(filePath);

  return data.publicUrl;
}