export default function ContactsPage() {
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
          maxWidth: 900,
          margin: "0 auto",
          padding: "32px 16px 64px",
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <div
            style={{
              fontWeight: 700,
              fontSize: 20,
              marginBottom: 8,
            }}
          >
            SoulLens
          </div>

          <h1
            style={{
              margin: 0,
              fontSize: "clamp(30px, 6vw, 42px)",
              lineHeight: 1.08,
              letterSpacing: "-0.03em",
            }}
          >
            Контакты и реквизиты
          </h1>

          <p
            style={{
              color: "#6b7280",
              fontSize: 16,
              lineHeight: 1.7,
              marginTop: 14,
              marginBottom: 0,
              maxWidth: 760,
            }}
          >
            Здесь размещены контактные данные и реквизиты исполнителя для связи
            по вопросам доступа, оплаты и возвратов.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: 18,
          }}
        >
          <section
            style={{
              background: "#ffffff",
              border: "1px solid #ececec",
              borderRadius: 24,
              padding: "22px 18px",
              boxShadow: "0 12px 40px rgba(15, 23, 42, 0.05)",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 22 }}>
              Данные исполнителя
            </h2>

            <div style={{ color: "#374151", fontSize: 16, lineHeight: 1.9 }}>
              <div>
                <strong>ФИО / Наименование:</strong> Агаджанян Артур Арменович
              </div>
              <div>
                <strong>Статус:</strong> Самозанятый
              </div>
              <div>
                <strong>ИНН:</strong> 742004087836
              </div>
              <div>
                <strong>Email:</strong> kislovsasa@yandex.ru
              </div>
              <div>
                <strong>Telegram:</strong> @soullenssupport
              </div>
            </div>
          </section>

          <section
            style={{
              background: "#ffffff",
              border: "1px solid #ececec",
              borderRadius: 24,
              padding: "22px 18px",
              boxShadow: "0 12px 40px rgba(15, 23, 42, 0.05)",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 22 }}>
              Поддержка пользователей
            </h2>

            <div style={{ color: "#374151", fontSize: 16, lineHeight: 1.8 }}>
              <p style={{ marginTop: 0 }}>
                По вопросам оплаты, доступа к полному разбору, возвратов и
                технических ошибок пользователь может обратиться по указанным
                контактам.
              </p>
              <p style={{ marginBottom: 0 }}>
                В обращении желательно указать email, дату оплаты и описание
                проблемы.
              </p>
            </div>
          </section>

          <section
            style={{
              background: "#ffffff",
              border: "1px solid #ececec",
              borderRadius: 24,
              padding: "22px 18px",
              boxShadow: "0 12px 40px rgba(15, 23, 42, 0.05)",
            }}
          >
            <h2 style={{ margin: "0 0 12px", fontSize: 22 }}>
              Режим обработки обращений
            </h2>

            <div style={{ color: "#374151", fontSize: 16, lineHeight: 1.8 }}>
              <p style={{ marginTop: 0 }}>
                Обращения пользователей принимаются ежедневно в электронном виде.
              </p>
              <p style={{ marginBottom: 0 }}>
                Средний срок ответа — от нескольких часов до 3 рабочих дней в
                зависимости от характера запроса.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}