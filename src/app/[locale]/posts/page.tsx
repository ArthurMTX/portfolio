import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Link } from "@/i18n/routing";
import { getAllArticles, formatDate } from "@/lib/articles";
import { getTranslations } from 'next-intl/server';
import { Calendar, Clock, ArrowRight, Sparkles, PenLine } from 'lucide-react';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arthurpaly.com';

interface PostsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PostsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Posts' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${baseUrl}/${locale}/posts`,
      languages: {
        'en': `${baseUrl}/en/posts`,
        'fr': `${baseUrl}/fr/posts`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: `${baseUrl}/${locale}/posts`,
    },
  };
}

// Static generation for all locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

// Revalidate every 6 hours
export const revalidate = 21600;

export default async function Posts({ params }: PostsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('Posts');
  const articles = await getAllArticles(locale);
  
  const featuredArticles = articles.filter(a => a.featured);
  const regularArticles = articles.filter(a => !a.featured);

  return (
    <PageLayout>
      <PageHeader 
        title={t('title')} 
        subtitle={t('subtitle')}
        icon={PenLine}
      />

      {/* Featured Articles */}
      {featuredArticles.length > 0 && (
        <section className="mb-16">
          <h2 className="text-lg font-mono text-mocha-mauve mb-6 flex items-center gap-2">
            <Sparkles size={18} />
            {t('featured')}
          </h2>
          <div className="grid gap-6">
            {featuredArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/posts/${article.slug}`}
                className="group block"
              >
                <article className="bg-mocha-mantle border border-mocha-surface0 rounded-xl p-6 hover:border-mocha-mauve transition-all">
                  <div className="flex items-center gap-4 text-sm text-mocha-subtext0 mb-3">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14} />
                      {formatDate(article.date, locale)}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} />
                      {article.readingTime}
                    </span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-mocha-text group-hover:text-mocha-mauve transition-colors mb-2">
                    {article.title}
                  </h3>
                  
                  <p className="text-mocha-subtext0 mb-4 line-clamp-2">
                    {article.description}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex flex-wrap gap-2">
                      {article.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 text-xs font-mono bg-mocha-surface0 text-mocha-subtext1 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="text-mocha-mauve flex items-center gap-1 text-sm font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                      {t('readMore')} <ArrowRight size={14} />
                    </span>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* All Articles */}
      {regularArticles.length > 0 && (
        <section>
          <h2 className="text-lg font-mono text-mocha-subtext0 mb-6">
            {t('allPosts')}
          </h2>
          <div className="space-y-1">
            {regularArticles.map((article) => (
              <Link
                key={article.slug}
                href={`/posts/${article.slug}`}
                className="group flex items-baseline justify-between py-4 border-b border-mocha-surface0 hover:border-mocha-mauve transition-colors"
              >
                <div className="flex-1 min-w-0 pr-4">
                  <h3 className="text-lg font-medium text-mocha-text group-hover:text-mocha-mauve transition-colors truncate">
                    {article.title}
                  </h3>
                </div>
                <div className="flex items-center gap-4 text-sm text-mocha-subtext0 shrink-0">
                  <span className="hidden sm:inline">{article.readingTime}</span>
                  <span className="font-mono">{formatDate(article.date, locale)}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      
      {articles.length === 0 && (
        <div className="text-center py-16">
          <p className="text-mocha-subtext0 text-lg">
            {t('noPosts')}
          </p>
        </div>
      )}
    </PageLayout>
  );
}
