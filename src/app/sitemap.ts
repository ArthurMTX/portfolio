import { MetadataRoute } from 'next';
import { getAllArticles } from '@/lib/articles';
import { getAllProjects } from '@/lib/projects';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arthurpaly.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const locales = ['en', 'fr'];
  const now = new Date();

  // Static pages
  const staticPages = ['', '/about', '/posts', '/projects', '/resume'];
  
  const staticRoutes = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: now,
      changeFrequency: page === '' ? 'weekly' as const : 'monthly' as const,
      priority: page === '' ? 1 : page === '/about' ? 0.9 : 0.8,
      alternates: {
        languages: Object.fromEntries(
          locales.map((l) => [l, `${baseUrl}/${l}${page}`])
        ),
      },
    }))
  );

  // Dynamic article pages
  const articleRoutes = await Promise.all(
    locales.map(async (locale) => {
      const articles = await getAllArticles(locale);
      return articles.map((article) => ({
        url: `${baseUrl}/${locale}/posts/${article.slug}`,
        lastModified: new Date(article.date),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/posts/${article.slug}`])
          ),
        },
      }));
    })
  );

  // Dynamic project pages
  const projectRoutes = await Promise.all(
    locales.map(async (locale) => {
      const projects = await getAllProjects(locale);
      return projects.map((project) => ({
        url: `${baseUrl}/${locale}/projects/${project.slug}`,
        lastModified: new Date(project.date),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${baseUrl}/${l}/projects/${project.slug}`])
          ),
        },
      }));
    })
  );

  return [
    ...staticRoutes,
    ...articleRoutes.flat(),
    ...projectRoutes.flat(),
  ];
}
