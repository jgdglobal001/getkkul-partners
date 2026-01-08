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
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
            }
        ],
        sitemap: 'https://partners.getkkul.com/sitemap.xml',
    }
}
