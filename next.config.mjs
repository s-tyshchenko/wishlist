/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'sgdogpg90ynaxlll.public.blob.vercel-storage.com',
                port: '',
            },
        ],
    }
};

export default nextConfig;
