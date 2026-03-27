"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Mode = "zodiac" | "screenshots";

export default function HomePage() {
  const router = useRouter();

  const [mode, setMode] = useState<Mode>("zodiac");

  const [user1Name, setUser1Name] = useState("");
  const [user1Birthdate, setUser1Birthdate] = useState("");
  const [user2Name, setUser2Name] = useState("");
  const [user2Birthdate, setUser2Birthdate] = useState("");

  const [user1Image, setUser1Image] = useState<File | null>(null);
  const [user2Image, setUser2Image] = useState<File | null>(null);
  const [relationshipContext, setRelationshipContext] = useState("");

  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState("");
  const [error, setError] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const updateIsMobile = () => {
      setIsMobile(window.innerWidth < 900);
    };

    updateIsMobile();
    window.addEventListener("resize", updateIsMobile);

    return () => window.removeEventListener("resize", updateIsMobile);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (mode === "zodiac") {
        setLoadingText("Считываем динамику вашей пары...");

        const res = await fetch("/api/create-reading", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            mode,
            user1_name: user1Name,
            user1_birthdate: user1Birthdate,
            user2_name: user2Name,
            user2_birthdate: user2Birthdate,
          }),
        });

        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.error || "Ошибка при создании разбора");
        }

        router.push(result.result_url);
        return;
      }

      if (!user1Image || !user2Image) {
        throw new Error("Загрузи оба скриншота профилей");
      }

      setLoadingText("Анализируем цифровой образ и совместимость...");

      const formData = new FormData();
      formData.append("mode", "screenshots");
      formData.append("user1_name", user1Name);
      formData.append("user2_name", user2Name);
      formData.append("relationship_context", relationshipContext);
      formData.append("user1_image", user1Image);
      formData.append("user2_image", user2Image);

      const res = await fetch("/api/create-reading", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Ошибка при создании разбора");
      }

      router.push(result.result_url);
    } catch (err: any) {
      setError(err.message || "Что-то пошло не так");
    } finally {
      setLoading(false);
      setLoadingText("");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #f6f7fb 0%, #ffffff 45%, #ffffff 100%)",
        color: "#111827",
        fontFamily:
          "Inter, Arial, ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: isMobile ? "20px 14px 56px" : "32px 20px 70px",
        }}
      >
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: isMobile ? "flex-start" : "center",
            marginBottom: isMobile ? 22 : 30,
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div style={{ fontSize: isMobile ? 18 : 22, fontWeight: 700 }}>
            SoulLens
          </div>
          <div
            style={{
              color: "#6b7280",
              fontSize: isMobile ? 13 : 14,
              maxWidth: isMobile ? "100%" : undefined,
            }}
          >
            AI-анализ совместимости
          </div>
        </header>

        <section
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "1fr"
              : "minmax(0, 1.1fr) minmax(320px, 0.9fr)",
            gap: isMobile ? 18 : 28,
            alignItems: "start",
          }}
        >
          <div style={{ order: isMobile ? 1 : 1 }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: isMobile ? "7px 11px" : "8px 12px",
                borderRadius: 999,
                background: "#eef2ff",
                color: "#4338ca",
                fontSize: 13,
                fontWeight: 600,
                marginBottom: 16,
              }}
            >
              Новый формат совместимости
            </div>

            <h1
              style={{
                fontSize: isMobile ? "42px" : "clamp(34px, 7vw, 52px)",
                lineHeight: isMobile ? 1.02 : 1.05,
                letterSpacing: "-0.03em",
                margin: "0 0 14px",
                maxWidth: 700,
              }}
            >
              Узнай,
              <br />
              насколько вы совместимы на самом деле
            </h1>

            <p
              style={{
                fontSize: isMobile ? 16 : "clamp(16px, 2vw, 19px)",
                lineHeight: 1.6,
                color: "#4b5563",
                maxWidth: 700,
                margin: "0 0 24px",
              }}
            >
              Не просто шаблонный гороскоп. Получи AI-разбор по дате рождения
              или по скриншотам профилей, чтобы увидеть реальную динамику вашей
              пары, сильные стороны и скрытые точки напряжения.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: isMobile
                  ? "1fr"
                  : "repeat(auto-fit, minmax(200px, 1fr))",
                gap: 12,
                marginBottom: 16,
              }}
            >
              <FeatureCard
                title="Персонально"
                text="Разбор строится именно под вашу пару, а не по шаблону."
              />
              <FeatureCard
                title="По профилям"
                text="Можно анализировать цифровой образ по скриншотам."
              />
              <FeatureCard
                title="За 1 минуту"
                text="Быстрый результат с teaser и полным разбором."
              />
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #ececec",
                borderRadius: isMobile ? 18 : 22,
                padding: isMobile ? 16 : 18,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  marginBottom: 8,
                }}
              >
                Что это за услуга
              </div>

              <div
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  lineHeight: 1.7,
                }}
              >
                SoulLens — цифровой онлайн-сервис AI-разбора совместимости.
                После оплаты пользователь получает доступ к полному
                персональному разбору отношений. Услуга предоставляется в
                электронном виде, без физической доставки.
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #ececec",
                borderRadius: isMobile ? 18 : 22,
                padding: isMobile ? 16 : 18,
                boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  fontSize: 15,
                  marginBottom: 8,
                }}
              >
                Как пользователь получает результат
              </div>

              <div
                style={{
                  color: "#6b7280",
                  fontSize: 14,
                  lineHeight: 1.8,
                  display: "grid",
                  gap: 4,
                }}
              >
                <div>1. Пользователь вводит данные или загружает скриншоты.</div>
                <div>2. Сервис формирует предварительный AI-разбор.</div>
                <div>3. После оплаты открывается полный текст результата.</div>
                <div>4. Доступ предоставляется на странице разбора на сайте.</div>
              </div>
            </div>
          </div>

          <div style={{ order: isMobile ? 2 : 2 }}>
            <div
              style={{
                background: "rgba(255,255,255,0.94)",
                backdropFilter: "blur(14px)",
                border: "1px solid #e5e7eb",
                borderRadius: isMobile ? 22 : 28,
                padding: isMobile ? 16 : 24,
                boxShadow: "0 18px 50px rgba(15, 23, 42, 0.08)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr",
                  gap: 10,
                  marginBottom: 18,
                }}
              >
                <ModeButton
                  active={mode === "zodiac"}
                  onClick={() => setMode("zodiac")}
                  label="По дате рождения"
                  fullWidth
                />
                <ModeButton
                  active={mode === "screenshots"}
                  onClick={() => setMode("screenshots")}
                  label="По скриншотам"
                  fullWidth
                />
              </div>

              <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                {mode === "zodiac" ? (
                  <>
                    <Field label="Твоё имя">
                      <input
                        value={user1Name}
                        onChange={(e) => setUser1Name(e.target.value)}
                        placeholder="Например, Иван"
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="Твоя дата рождения">
                      <input
                        type="date"
                        value={user1Birthdate}
                        onChange={(e) => setUser1Birthdate(e.target.value)}
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="Имя партнёра">
                      <input
                        value={user2Name}
                        onChange={(e) => setUser2Name(e.target.value)}
                        placeholder="Например, Анна"
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="Дата рождения партнёра">
                      <input
                        type="date"
                        value={user2Birthdate}
                        onChange={(e) => setUser2Birthdate(e.target.value)}
                        style={inputStyle}
                      />
                    </Field>
                  </>
                ) : (
                  <>
                    <Field label="Твоё имя">
                      <input
                        value={user1Name}
                        onChange={(e) => setUser1Name(e.target.value)}
                        placeholder="Необязательно, но желательно"
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="Имя партнёра">
                      <input
                        value={user2Name}
                        onChange={(e) => setUser2Name(e.target.value)}
                        placeholder="Необязательно, но желательно"
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="Скриншот твоего профиля">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUser1Image(e.target.files?.[0] || null)}
                        style={inputStyle}
                      />
                      <small
                        style={{
                          display: "block",
                          color: "#6b7280",
                          marginTop: 8,
                          fontSize: 12,
                          lineHeight: 1.5,
                        }}
                      >
                        Подойдёт VK, Telegram, Instagram и другие профили.
                      </small>
                    </Field>

                    <Field label="Скриншот профиля партнёра">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => setUser2Image(e.target.files?.[0] || null)}
                        style={inputStyle}
                      />
                    </Field>

                    <Field label="Контекст отношений">
                      <textarea
                        value={relationshipContext}
                        onChange={(e) => setRelationshipContext(e.target.value)}
                        placeholder="Например: мы общаемся 3 месяца, часто спорим из-за ревности, хотим понять, есть ли у нас будущее"
                        rows={5}
                        style={{
                          ...inputStyle,
                          resize: "vertical",
                          minHeight: 120,
                        }}
                      />
                    </Field>
                  </>
                )}

                {error && (
                  <div
                    style={{
                      color: "#991b1b",
                      background: "#fef2f2",
                      padding: 14,
                      borderRadius: 14,
                      border: "1px solid #fecaca",
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {error}
                  </div>
                )}

                {loading && (
                  <div
                    style={{
                      background: "#eff6ff",
                      border: "1px solid #bfdbfe",
                      color: "#1d4ed8",
                      padding: 14,
                      borderRadius: 14,
                      fontSize: 14,
                      lineHeight: 1.5,
                    }}
                  >
                    {loadingText || "Создаём разбор..."}
                  </div>
                )}

                <button type="submit" disabled={loading} style={primaryButton}>
                  {loading
                    ? "Подожди немного..."
                    : mode === "zodiac"
                    ? "Получить разбор"
                    : "Проанализировать профили"}
                </button>
              </form>

              <div
                style={{
                  marginTop: 18,
                  paddingTop: 18,
                  borderTop: "1px solid #ececec",
                  color: "#6b7280",
                  fontSize: 14,
                  display: "grid",
                  gap: 8,
                  lineHeight: 1.6,
                }}
              >
                <div>✔ Персональный AI-разбор, а не шаблонный текст</div>
                <div>✔ Можно анализировать цифровой образ по профилям</div>
                <div>✔ Скриншоты используются только для анализа</div>
              </div>
            </div>
          </div>
        </section>

        <footer
          style={{
            marginTop: 30,
            paddingTop: 22,
            borderTop: "1px solid #ececec",
            display: "grid",
            gap: 14,
          }}
        >
          <div
            style={{
              color: "#6b7280",
              fontSize: 13,
              lineHeight: 1.7,
              maxWidth: 800,
            }}
          >
            SoulLens предоставляет цифровую информационную услугу в онлайн
            формате. После оплаты пользователь получает доступ к полному
            персональному разбору на сайте.
          </div>

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              fontSize: 14,
            }}
          >
            <Link href="/oferta" style={footerLink}>
              Оферта
            </Link>
            <Link href="/delivery" style={footerLink}>
              Оплата и получение доступа
            </Link>
            <Link href="/contacts" style={footerLink}>
              Контакты и реквизиты
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: 8,
          fontWeight: 600,
          color: "#111827",
          fontSize: 14,
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function ModeButton({
  active,
  onClick,
  label,
  fullWidth = false,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  fullWidth?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: fullWidth ? "100%" : undefined,
        padding: "13px 16px",
        borderRadius: 16,
        border: active ? "2px solid #111827" : "1px solid #d1d5db",
        background: active ? "#111827" : "#ffffff",
        color: active ? "#ffffff" : "#111827",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: 15,
        transition: "all 0.2s ease",
      }}
    >
      {label}
    </button>
  );
}

function FeatureCard({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div
      style={{
        background: "#ffffff",
        border: "1px solid #ececec",
        borderRadius: 20,
        padding: 18,
        boxShadow: "0 8px 24px rgba(15, 23, 42, 0.04)",
      }}
    >
      <div
        style={{
          fontWeight: 700,
          marginBottom: 8,
          fontSize: 15,
        }}
      >
        {title}
      </div>
      <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.5 }}>
        {text}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: 13,
  borderRadius: 14,
  border: "1px solid #d1d5db",
  background: "#fff",
  fontSize: 16,
  outline: "none",
  WebkitAppearance: "none",
  boxSizing: "border-box",
};

const primaryButton: React.CSSProperties = {
  width: "100%",
  background: "linear-gradient(135deg, #111827 0%, #1f2937 100%)",
  color: "#fff",
  border: "none",
  borderRadius: 16,
  padding: "16px 20px",
  fontSize: 16,
  fontWeight: 700,
  cursor: "pointer",
  boxShadow: "0 12px 24px rgba(17, 24, 39, 0.16)",
};

const footerLink: React.CSSProperties = {
  color: "#374151",
  textDecoration: "none",
  fontWeight: 500,
};