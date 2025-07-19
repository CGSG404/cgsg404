/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://gurusingapore.com',
  generateRobotsTxt: true,
  generateIndexSitemap: true,
  sitemapSize: 7000,
  // Vercel-safe configuration
  outDir: './public',
  // Avoid file system issues on Vercel
  transform: async (config, path) => {
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
};
