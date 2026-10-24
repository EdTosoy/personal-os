import { ImageResponse } from "next/og";

export const alt = "Edberto Tosoy — Full-Stack Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: "80px", background: "#0d1117", color: "#c9d1d9", borderLeft: "14px solid #539bf5" }}>
      <div style={{ display: "flex", color: "#539bf5", fontSize: 24, marginBottom: 28 }}>REACT · TYPESCRIPT · BACKEND SYSTEMS</div>
      <div style={{ display: "flex", fontSize: 78, fontWeight: 700, marginBottom: 18 }}>Edberto Tosoy</div>
      <div style={{ display: "flex", fontSize: 42, marginBottom: 28 }}>Full-Stack Software Engineer</div>
      <div style={{ display: "flex", fontSize: 26, color: "#8b949e" }}>Production banking experience. Independent engineering work.</div>
      <div style={{ display: "flex", fontSize: 24, marginTop: 48, color: "#539bf5" }}>www.edtosoy.com</div>
    </div>,
    size,
  );
}
