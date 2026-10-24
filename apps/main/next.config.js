//@ts-check

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Content-Security-Policy", value: "base-uri 'self'; object-src 'none'; frame-ancestors 'none'" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      { source: "/evidence/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      { source: "/certifications/:path*", headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }] },
      { source: "/evidence/fats/:file.pdf", headers: [{ key: "X-Robots-Tag", value: "noindex, noarchive" }] },
      { source: "/Edberto_Tosoy_Resume.pdf", headers: [{ key: "Cache-Control", value: "public, max-age=0, must-revalidate" }] },
    ];
  },
  experimental: {
    optimizePackageImports: ["react-icons"],
  },
};

module.exports = nextConfig;
