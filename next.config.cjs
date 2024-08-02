const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

/** @type {import('next').NextConfig} */
const nextConfig = withPWA({
    pwa: {
        dest: 'public',
        runtimeCaching,
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'sgdogpg90ynaxlll.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    }
});

export default nextConfig;
