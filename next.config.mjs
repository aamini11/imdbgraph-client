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
            },
        ];
    },
};

export default nextConfig;
