import type {NextConfig} from "next";

const nextConfig: NextConfig = {
    /* config options here */
    // This is required to support PostHog trailing slash API requests
    skipTrailingSlashRedirect: true,
    async rewrites() {
        return [
            {
                // "genuine" is a nickname for PostHog's relay server
                // because we are genuine for user experience monitoring
                source: "/genuine/:path*",
                destination: process.env.NEXT_PUBLIC_POSTHOG_HOST + "/:path*",
            },
            {
                source: "/genuine/static/:path*",
                destination: "https://eu-assets.i.posthog.com/static/:path*",
            },
        ];
    },
};

export default nextConfig;