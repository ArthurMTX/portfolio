import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeHighlight from 'rehype-highlight';
import rehypeStringify from 'rehype-stringify';
import rehypeRaw from 'rehype-raw';
import readingTime from 'reading-time';

export interface ArticleMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  tags: string[];
  featured: boolean;
  readingTime: string;
  cover?: string;
}

export interface Article extends ArticleMeta {
  content: string;
}

const articlesDirectory = path.join(process.cwd(), 'content/articles');

/**
 * Get all article slugs for a specific locale
 */
export function getArticleSlugs(locale: string): string[] {
  const localeDir = path.join(articlesDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  
  return fs.readdirSync(localeDir)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

/**
 * Get article metadata and content by slug
 */
export async function getArticleBySlug(slug: string, locale: string): Promise<Article | null> {
  const fullPath = path.join(articlesDirectory, locale, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Process markdown to HTML with syntax highlighting
  const processedContent = await unified()
    .use(remarkParse)
    .use(remarkGfm) // GitHub Flavored Markdown (tables, strikethrough, etc.)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeRaw) // Allow raw HTML in markdown
    .use(rehypeHighlight, { 
      detect: true,  // Auto-detect language if not specified
      prefix: 'hljs-', // Prefix for highlight classes
    })
    .use(rehypeStringify)
    .process(content);
  
  const contentHtml = processedContent.toString();
  const stats = readingTime(content);
  
  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    featured: data.featured || false,
    readingTime: stats.text,
    cover: data.cover || undefined,
    content: contentHtml,
  };
}

/**
 * Get all articles metadata (without content) for listing
 */
export async function getAllArticles(locale: string): Promise<ArticleMeta[]> {
  const slugs = getArticleSlugs(locale);
  
  const articles = await Promise.all(
    slugs.map(async (slug) => {
      const article = await getArticleBySlug(slug, locale);
      if (!article) return null;
      
      // Return metadata only (without content)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content: _, ...meta } = article;
      return meta;
    })
  );
  
  // Filter out nulls and sort by date (newest first)
  return articles
    .filter((article): article is ArticleMeta => article !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get featured articles
 */
export async function getFeaturedArticles(locale: string): Promise<ArticleMeta[]> {
  const articles = await getAllArticles(locale);
  return articles.filter(article => article.featured);
}

/**
 * Get articles by tag
 */
export async function getArticlesByTag(tag: string, locale: string): Promise<ArticleMeta[]> {
  const articles = await getAllArticles(locale);
  return articles.filter(article => 
    article.tags.map(t => t.toLowerCase()).includes(tag.toLowerCase())
  );
}

/**
 * Get all unique tags
 */
export async function getAllTags(locale: string): Promise<string[]> {
  const articles = await getAllArticles(locale);
  const tagsSet = new Set<string>();
  
  articles.forEach(article => {
    article.tags.forEach(tag => tagsSet.add(tag.toLowerCase()));
  });
  
  return Array.from(tagsSet).sort();
}

/**
 * Format date for display
 */
export function formatDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
