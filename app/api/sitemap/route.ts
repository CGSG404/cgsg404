import { NextResponse } from 'next/server';

export async function GET() {
  const baseUrl = 'https://gurusingapore.com';
  
  // Static pages
  const staticPages = [
    '',
    '/casinos',
    '/top-casinos',
    '/reviews',
    '/news',
    '/forum',
    '/guide',
    '/list-report',
    '/search',
    '/signin',
    '/best-bonuses',
    '/about-us',
    '/privacy-policy',
    '/terms-of-service',
    '/success-stories'
  ];

  // Dynamic casino pages
  const casinoSlugs = [
    'lucky-dreams',
    'malina',
    'rabona',
    'ducky-luck',
    'speed-sgd'
  ];

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${staticPages.map(page => `
  <url>
    <loc>${baseUrl}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${page === '' ? '1.0' : '0.8'}</priority>
  </url>`).join('')}
  ${casinoSlugs.map(slug => `
  <url>
    <loc>${baseUrl}/casinos/${slug}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>${baseUrl}/reviews/${slug}/full-review</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.7</priority>
  </url>`).join('')}
</urlset>`;

  return new NextResponse(sitemap, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600'
    }
  });
}
