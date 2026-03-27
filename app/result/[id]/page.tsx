import Link from "next/link";
import UnlockButton from "./UnlockButton";

type ReadingResponse = {
  id: string;
  user1_name: string;
  user2_name: string;
  compatibility_score: number;
  preview_text: string;
  full_text: string | null;
  is_paid: boolean;
  created_at: string;
};

async function getReading(id: string): Promise<ReadingResponse> {
  const baseUrl =
    process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

  const res = await fetch(`${baseUrl}/api/reading/${id}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Не удалось загрузить разбор");
  }

  return res.json();
}

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const reading = await getReading(id);

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #f8fafc 0%, #ffffff 45%, #ffffff 100%)",
        color: "#111827",
        fontFamily:
          "Inter, Arial, ui-sans-serif, system-ui, -apple-system, sans-serif",
      }}
    >
      <div
        style={{
          maxWidth: 920,
          margin: "0 auto",
          padding: "24px 14px 140px",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
            gap: 12,
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 20 }}>SoulLens</div>
          <div style={{ color: "#6b7280", fontSize: 13, textAlign: "right" }}>
            Персональный AI-разбор
          </div>
        </div>

        <section
          style={{
            background: "#fff",
            border: "1px solid #ececec",
            borderRadius: 24,
            padding: "22px 18px",
            boxShadow: "0 18px 50px rgba(15, 23, 42, 0.06)",
            marginBottom: 18,
          }}
        >
          <div
            style={{
              display: "inline-block",
              padding: "8px 12px",
              borderRadius: 999,
              background: "#eef2ff",
              color: "#4338ca",
              fontSize: 13,
              fontWeight: 600,
              marginBottom: 14,
            }}
          >
            Разбор готов
          </div>

          <h1
            style={{
              fontSize: "clamp(30px, 6vw, 40px)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
              margin: "0 0 12px",
              wordBreak: "break-word",
            }}
          >
            Совместимость {reading.user1_name} и {reading.user2_name}
          </h1>

          <p
            style={{
              color: "#6b7280",
              margin: 0,
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 700,
            }}
          >
            Мы уже нашли ключевую динамику в вашей паре. Ниже — краткая выжимка
            и доступ к полному персональному разбору.
          </p>
        </section>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr",
            gap: 18,
            alignItems: "start",
          }}
        >
          <aside
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #ececec",
                borderRadius: 22,
                padding: 20,
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div style={{ color: "#6b7280", fontSize: 14, marginBottom: 10 }}>
                Индекс совместимости
              </div>

              <div
                style={{
                  fontSize: 48,
                  fontWeight: 800,
                  lineHeight: 1,
                  marginBottom: 10,
                }}
              >
                {reading.compatibility_score}%
              </div>

              <div style={{ color: "#6b7280", fontSize: 14, lineHeight: 1.6 }}>
                Это ориентир для восприятия вашей динамики, притяжения и
                потенциальных зон напряжения.
              </div>
            </div>

            <div
              style={{
                background: "#ffffff",
                border: "1px solid #ececec",
                borderRadius: 22,
                padding: 20,
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 10,
                  fontSize: 16,
                }}
              >
                Что ты получишь в полном разборе
              </div>

              <div style={{ color: "#6b7280", fontSize: 15, lineHeight: 1.9 }}>
                <div>— Есть ли риск измены и двойной игры</div>
                <div>— Что человек на самом деле хочет от отношений</div>
                <div>— Есть ли скрытый расчёт или материальный интерес</div>
                <div>— Кто в паре сильнее влияет на динамику</div>
                <div>— Чем может закончиться это притяжение</div>
              </div>
            </div>
          </aside>

          <section
            style={{
              display: "grid",
              gap: 18,
            }}
          >
            <div
              style={{
                background: "#ffffff",
                border: "1px solid #ececec",
                borderRadius: 22,
                padding: 20,
                boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
              }}
            >
              <div
                style={{
                  fontSize: 14,
                  color: "#6b7280",
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                Краткий анонс
              </div>

              <div
                style={{
                  fontSize: 17,
                  lineHeight: 1.8,
                  color: "#111827",
                  whiteSpace: "pre-wrap",
                  wordBreak: "break-word",
                }}
              >
                {reading.preview_text}
              </div>
            </div>

            {!reading.is_paid ? (
              <div
                style={{
                  background: "linear-gradient(180deg, #fff7ed 0%, #ffffff 100%)",
                  border: "1px solid #fed7aa",
                  borderRadius: 22,
                  padding: 20,
                  boxShadow: "0 10px 30px rgba(124, 45, 18, 0.06)",
                }}
              >
                <div
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "#ffedd5",
                    color: "#c2410c",
                    fontSize: 13,
                    fontWeight: 700,
                    marginBottom: 14,
                  }}
                >
                  Полный разбор скрыт
                </div>

                <h2
                  style={{
                    margin: "0 0 10px",
                    fontSize: "clamp(26px, 6vw, 30px)",
                    lineHeight: 1.12,
                  }}
                >
                  Ты увидишь правду об этих отношениях
                </h2>

                <p
                  style={{
                    color: "#7c2d12",
                    lineHeight: 1.7,
                    fontSize: 16,
                    margin: "0 0 20px",
                  }}
                >
                  Мы уже разобрали вашу динамику глубже, чем это видно на
                  поверхности. Полный разбор покажет не просто совместимость, а
                  реальные скрытые мотивы, поведение и риски в этих отношениях.
                </p>

                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr",
                    gap: 14,
                    alignItems: "stretch",
                    marginBottom: 18,
                  }}
                >
                  <div
                    style={{
                      background: "#fff",
                      border: "1px solid #fdba74",
                      borderRadius: 18,
                      padding: 18,
                    }}
                  >
                    <div
                      style={{
                        fontWeight: 700,
                        fontSize: 16,
                        marginBottom: 10,
                        color: "#111827",
                      }}
                    >
                      Что входит в полный разбор
                    </div>

                    <div
                      style={{
                        color: "#6b7280",
                        fontSize: 15,
                        lineHeight: 1.9,
                      }}
                    >
                      <div>— Есть ли риск измены и склонность к двойной игре</div>
                      <div>— Что человек на самом деле хочет от этих отношений</div>
                      <div>— Есть ли скрытый расчёт или материальный интерес</div>
                      <div>— Кто в паре сильнее влияет и контролирует динамику</div>
                      <div>— Почему вас тянет друг к другу и чем это закончится</div>
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#111827",
                      color: "#fff",
                      borderRadius: 18,
                      padding: 18,
                    }}
                  >
                    <div
                      style={{
                        fontSize: 13,
                        opacity: 0.75,
                        marginBottom: 8,
                      }}
                    >
                      Разовая покупка
                    </div>

                    <div
                      style={{
                        fontSize: 34,
                        fontWeight: 800,
                        lineHeight: 1,
                        marginBottom: 10,
                      }}
                    >
                      99₽
                    </div>

                    <div
                      style={{
                        fontSize: 14,
                        lineHeight: 1.6,
                        opacity: 0.9,
                      }}
                    >
                      Откроет полный разбор скрытых мотивов, рисков и будущего
                      ваших отношений.
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: 12 }}>
                  <UnlockButton readingId={reading.id} priceRub={99} />
                </div>

                <div
                  style={{
                    background: "#fff",
                    border: "1px solid #fed7aa",
                    borderRadius: 16,
                    padding: 14,
                    marginBottom: 12,
                    color: "#7c2d12",
                    fontSize: 13,
                    lineHeight: 1.7,
                  }}
                >
                  После успешной оплаты полный текст открывается автоматически
                  на этой странице. Услуга предоставляется в электронном виде,
                  без физической доставки.
                </div>

                <div
                  style={{
                    color: "#9a3412",
                    fontSize: 13,
                    lineHeight: 1.7,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 14,
                  }}
                >
                  <Link href="/oferta" style={paywallLink}>
                    Оферта
                  </Link>
                  <Link href="/delivery" style={paywallLink}>
                    Оплата и получение доступа
                  </Link>
                  <Link href="/contacts" style={paywallLink}>
                    Контакты и реквизиты
                  </Link>
                </div>
              </div>
            ) : (
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #ececec",
                  borderRadius: 22,
                  padding: 20,
                  boxShadow: "0 10px 30px rgba(15, 23, 42, 0.05)",
                }}
              >
                <div
                  style={{
                    fontSize: 14,
                    color: "#6b7280",
                    fontWeight: 600,
                    marginBottom: 10,
                  }}
                >
                  Полный разбор
                </div>

                <div
                  style={{
                    fontSize: 16,
                    lineHeight: 1.85,
                    color: "#111827",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                  }}
                >
                  {reading.full_text}
                </div>
              </div>
            )}
          </section>
        </div>
      </div>

      {!reading.is_paid && (
        <div
          style={{
            position: "fixed",
            left: 12,
            right: 12,
            bottom: 12,
            zIndex: 50,
            maxWidth: 920,
            margin: "0 auto",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.94)",
              backdropFilter: "blur(12px)",
              border: "1px solid rgba(0,0,0,0.06)",
              boxShadow: "0 16px 40px rgba(15, 23, 42, 0.12)",
              borderRadius: 18,
              padding: 10,
            }}
          >
            <UnlockButton readingId={reading.id} priceRub={99} />

            <div
              style={{
                marginTop: 8,
                fontSize: 11,
                color: "#6b7280",
                textAlign: "center",
                lineHeight: 1.5,
              }}
            >
              После оплаты доступ откроется автоматически
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

const paywallLink: React.CSSProperties = {
  color: "#9a3412",
  textDecoration: "none",
  fontWeight: 600,
};