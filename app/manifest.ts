import { MetadataRoute } from 'next'

export const runtime = 'edge';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: '겟꿀 파트너스',
        short_name: '겟꿀 파트너스',
        description: '겟꿀의 공식 파트너십 플랫폼',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#6366f1',
        icons: [
            {
                src: '/android-chrome-192x192.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any',
            },
            {
                src: '/android-chrome-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}
