/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `https://api.imdbgraph.org/api/:path*`,
      }
    ];
  },
  reactStrictMode: true,
};