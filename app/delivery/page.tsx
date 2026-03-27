export default function DeliveryPage() {
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
            Оплата и получение доступа
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
            На этой странице указано, как пользователь оплачивает цифровую
            услугу SoulLens и как получает доступ к результату.
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
              Формат услуги
            </h2>
            <div style={{ color: "#374151", fontSize: 16, lineHeight: 1.8 }}>
              <p style={{ marginTop: 0 }}>
                SoulLens предоставляет цифровую информационную услугу в онлайн
                формате.
              </p>
              <p style={{ marginBottom: 0 }}>
                Физические товары не продаются, доставка в классическом смысле
                не осуществляется.
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
              Как происходит оплата
            </h2>
            <div style={{ color: "#374151", fontSize: 16, lineHeight: 1.8 }}>
              <p style={{ marginTop: 0 }}>
                Пользователь выбирает платный доступ к полному персональному
                разбору и оплачивает услугу на сайте с помощью доступного
                платёжного метода.
              </p>
              <p style={{ marginBottom: 0 }}>
                Стоимость услуги указывается на странице результата перед
                оплатой.
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
              Как пользователь получает доступ
            </h2>
            <div style={{ color: "#374151", fontSize: 16, lineHeight: 1.8 }}>
              <p style={{ marginTop: 0 }}>
                После успешной оплаты пользователю автоматически открывается
                доступ к полному тексту разбора на странице результата.
              </p>
              <p>
                Предоставление услуги происходит в электронном виде через
                интерфейс сайта.
              </p>
              <p style={{ marginBottom: 0 }}>
                Срок предоставления доступа — как правило, сразу после
                подтверждения успешного платежа.
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
              Если возникла техническая ошибка
            </h2>
            <div style={{ color: "#374151", fontSize: 16, lineHeight: 1.8 }}>
              <p style={{ marginTop: 0 }}>
                Если после оплаты доступ к полному разбору не открылся, пользователь
                может обратиться в поддержку по контактам, указанным на странице
                «Контакты и реквизиты».
              </p>
              <p style={{ marginBottom: 0 }}>
                Обращение рассматривается по данным платежа и факту
                предоставления доступа.
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}