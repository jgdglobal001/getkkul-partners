import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: [
                '/dashboard/',
                '/api/',
                '/auth/',
                '/login',
                '/signup',
                '/_next/',
                '/embed/',
            ],
        },
        sitemap: 'https://partners.getkkul.com/sitemap.xml',
    }
}
