/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    ppr: "incremental",
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `https://api.imdbgraph.org/:path*`,
      }
    ];
  },
  async redirects() {
    return [
      {
        source: "/ratings/:id",
        destination: "/ratings?id=:id",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
