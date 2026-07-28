"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <html lang="vi">
      <body style={{ margin: 0, background: "#f5f5f5", color: "#0f172a" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "grid",
            placeItems: "center",
            padding: "32px 16px",
            fontFamily: '"Segoe UI", system-ui, sans-serif',
          }}
        >
          <section
            style={{
              position: "relative",
              width: "min(100%, 720px)",
              overflow: "hidden",
              border: "1px solid #e2e8f0",
              borderRadius: 32,
              background: "#ffffff",
              padding: "64px 24px",
              textAlign: "center",
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
            }}
          >
            <div
              aria-hidden="true"
              style={{
                margin: "0 auto 24px",
                display: "grid",
                height: 80,
                width: 80,
                placeItems: "center",
                borderRadius: 26,
                background: "linear-gradient(145deg, #f43f5e, #b91c1c)",
                color: "#ffffff",
                fontSize: 34,
                fontWeight: 800,
                boxShadow: "0 18px 36px rgba(190, 24, 93, 0.2)",
              }}
            >
              !
            </div>
            <p
              style={{
                margin: 0,
                color: "#e53935",
                fontSize: 12,
                fontWeight: 800,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              CardgameCenter
            </p>
            <h1
              style={{
                margin: "10px 0 0",
                fontSize: "clamp(28px, 5vw, 40px)",
                lineHeight: 1.2,
              }}
            >
              Hệ thống đang cần một chút thời gian
            </h1>
            <p
              style={{
                margin: "14px auto 0",
                maxWidth: 530,
                color: "#64748b",
                fontSize: 16,
                lineHeight: 1.7,
              }}
            >
              Một lỗi ngoài dự kiến vừa xảy ra. Bạn có thể thử khởi động lại
              trang hoặc quay về trang chủ để tiếp tục.
            </p>
            <div
              style={{
                marginTop: 30,
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: 12,
              }}
            >
              <button
                type="button"
                onClick={reset}
                style={{
                  minHeight: 44,
                  cursor: "pointer",
                  border: 0,
                  borderRadius: 12,
                  background: "#003087",
                  padding: "10px 22px",
                  color: "#ffffff",
                  fontSize: 14,
                  fontWeight: 700,
                }}
              >
                Thử lại
              </button>
              <Link
                href="/"
                style={{
                  display: "inline-flex",
                  minHeight: 42,
                  alignItems: "center",
                  border: "1px solid #cbd5e1",
                  borderRadius: 12,
                  padding: "0 22px",
                  color: "#334155",
                  fontSize: 14,
                  fontWeight: 700,
                  textDecoration: "none",
                }}
              >
                Về trang chủ
              </Link>
            </div>
            {error.digest ? (
              <p
                style={{
                  margin: "24px 0 0",
                  color: "#94a3b8",
                  fontSize: 12,
                }}
              >
                Mã tham chiếu: {error.digest}
              </p>
            ) : null}
          </section>
        </main>
      </body>
    </html>
  )
}
