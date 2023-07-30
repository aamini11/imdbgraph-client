/** @type {import('next').NextConfig} */
const nextConfig = {
    swcMinify: true,
    reactStrictMode: true,
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

module.exports = nextConfig;
