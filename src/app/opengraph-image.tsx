import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#f1f3ec",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 40,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#b5622b",
          }}
        >
          HireCost
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 24,
            fontSize: 72,
            lineHeight: 1.15,
            color: "#1b2430",
            maxWidth: 980,
          }}
        >
          What an employee really costs
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 32,
            color: "#1f7a5c",
          }}
        >
          Salary + employer payroll taxes + benefits, by state
        </div>
      </div>
    ),
    { ...size }
  );
}
