/**
 * @type {import('next').NextConfig}
 */
module.exports = {
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
