export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/admin'],
      },
    ],
    sitemap: 'https://www.arenabase.co.ke/sitemap.xml',
    host: 'https://www.arenabase.co.ke',
  };
}
