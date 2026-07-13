/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@platform/core', '@platform/shared', '@platform/recommendation'],
};

export default nextConfig;
