import PageLayout from "@/components/PageLayout";
import ArticleContent from "@/components/ArticleContent";
import { Link } from "@/i18n/routing";
import { getArticleBySlug, getAllArticles, formatDate } from "@/lib/articles";
import { getTranslations } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Calendar, Clock, ArrowLeft, Tag } from 'lucide-react';
import Image from 'next/image';
import type { Metadata } from 'next';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/JsonLd';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arthurpaly.com';

interface ArticlePageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const article = await getArticleBySlug(slug, locale);
  const alternateLocale = locale === 'en' ? 'fr' : 'en';
  
  if (!article) {
    return { title: 'Article Not Found' };
  }
  
  return {
    title: article.title,
    description: article.description,
    keywords: article.tags,
    authors: [{ name: 'Arthur Paly' }],
    alternates: {
      canonical: `${baseUrl}/${locale}/posts/${slug}`,
      languages: {
        'en': `${baseUrl}/en/posts/${slug}`,
        'fr': `${baseUrl}/fr/posts/${slug}`,
      },
    },
    openGraph: {
      type: 'article',
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      alternateLocale: alternateLocale === 'fr' ? 'fr_FR' : 'en_US',
      url: `${baseUrl}/${locale}/posts/${slug}`,
      title: article.title,
      description: article.description,
      publishedTime: article.date,
      authors: ['Arthur Paly'],
      tags: article.tags,
      images: article.cover ? [
        {
          url: article.cover,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: article.cover ? [article.cover] : [],
    },
  };
}

export async function generateStaticParams() {
  const enArticles = await getAllArticles('en');
  const frArticles = await getAllArticles('fr');
  
  const params = [
    ...enArticles.map(article => ({ locale: 'en', slug: article.slug })),
    ...frArticles.map(article => ({ locale: 'fr', slug: article.slug })),
  ];
  
  return params;
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations('Article');
  const tNav = await getTranslations('Navigation');
  const article = await getArticleBySlug(slug, locale);
  
  if (!article) {
    notFound();
  }

  return (
    <PageLayout narrow>
      {/* JSON-LD Structured Data */}
      <ArticleJsonLd
        title={article.title}
        description={article.description}
        url={`${baseUrl}/${locale}/posts/${slug}`}
        datePublished={article.date}
        author="Arthur Paly"
        image={article.cover}
        tags={article.tags}
      />
      <BreadcrumbJsonLd
        items={[
          { name: tNav('home'), url: `${baseUrl}/${locale}` },
          { name: tNav('posts'), url: `${baseUrl}/${locale}/posts` },
          { name: article.title, url: `${baseUrl}/${locale}/posts/${slug}` },
        ]}
      />

      {/* Back link */}
      <Link 
        href="/posts" 
        className="inline-flex items-center gap-2 text-mocha-subtext0 hover:text-mocha-mauve transition-colors mb-8 font-mono text-sm"
      >
        <ArrowLeft size={16} />
        {t('backToPosts')}
      </Link>

      <article>
        {/* Cover Image */}
        {article.cover && (
          <div className="relative w-full aspect-[21/9] mb-8 rounded-xl overflow-hidden">
            <Image
              src={article.cover}
              alt={article.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Header */}
        <header className="mb-12">
          <div className="flex items-center gap-4 text-sm text-mocha-subtext0 mb-4">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} />
              {formatDate(article.date, locale)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={14} />
              {article.readingTime}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-mocha-text mb-6 leading-tight">
            {article.title}
          </h1>
          
          <p className="text-lg text-mocha-subtext0 mb-6">
            {article.description}
          </p>
          
          {article.tags.length > 0 && (
            <div className="flex items-center gap-2 flex-wrap">
              <Tag size={14} className="text-mocha-mauve" />
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-sm font-mono bg-mocha-surface0 text-mocha-subtext1 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        {/* Divider */}
        <div className="w-16 h-px bg-mocha-mauve mb-12" />

        {/* Content */}
        <ArticleContent content={article.content} />
      </article>

      {/* Footer of article */}
      <div className="mt-16 pt-8 border-t border-mocha-surface0">
        <Link 
          href="/posts" 
          className="inline-flex items-center gap-2 text-mocha-mauve hover:text-mocha-text transition-colors font-mono"
        >
          <ArrowLeft size={16} />
          {t('backToPosts')}
        </Link>
      </div>
    </PageLayout>
  );
}
