/** @type {import('next').NextConfig} */
const nextConfig = {
    i18n: {
        locales: ["en"],
        defaultLocale: "en",
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