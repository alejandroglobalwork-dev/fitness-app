/** @type {import('next').NextConfig} */
const nextConfig = {
  // La interfaz vive en public/despensa.html (la misma que el artefacto de Claude).
  async rewrites() {
    return { beforeFiles: [{ source: "/", destination: "/despensa.html" }] };
  },
};
export default nextConfig;
