/** @type {import("next").NextConfig} */
const nextConfig = {
  output: "standalone",
  experimental: {
    ppr: "incremental",
  },
  // For legacy links, we need to redirect them to the new format
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
