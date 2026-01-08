import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: [
                    '/dashboard/',
                    '/api/',
                    '/_next/',
                    '/embed/',
                ],
            },
            {
                userAgent: 'Yeti',
                allow: ['/', '/auth/'],
            }
        ],
        sitemap: 'https://partners.getkkul.com/sitemap.xml',
    }
}
