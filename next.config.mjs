/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Static export so Vercel (and the legacy static PWA project settings)
  // always get a real out/index.html at `/` — avoids platform NOT_FOUND.
  output: "export",
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  // Emit out/vinos/index.html so /vinos resolves on static hosts (Vercel Other/static).
  trailingSlash: true,
};

export default nextConfig;
