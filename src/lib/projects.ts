import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export interface ProjectMeta {
  slug: string;
  title: string;
  description: string;
  repo: string;
  date: string;
  tags: string[];
  featured: boolean;
  link?: string;
}

export interface Project extends ProjectMeta {
  content: string;
  stars: number;
}

const projectsDirectory = path.join(process.cwd(), 'content/projects');

// In-memory cache for GitHub stars to avoid redundant API calls within the same request cycle
const starsCache = new Map<string, { stars: number; timestamp: number }>();
const CACHE_TTL = 1000 * 60 * 60; // 1 hour in-memory cache

/**
 * Fetch real GitHub star count for a repository with in-memory caching
 */
export async function getGitHubStars(repo: string): Promise<number> {
  // Check in-memory cache first
  const cached = starsCache.get(repo);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.stars;
  }

  try {
    const response = await fetch(`https://api.github.com/repos/${repo}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add GitHub token if available for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      },
      next: { revalidate: 3600 } // Next.js cache for 1 hour
    });

    if (!response.ok) {
      console.warn(`Failed to fetch stars for ${repo}: ${response.status}`);
      return cached?.stars ?? 0; // Return stale cache if available
    }

    const data = await response.json();
    const stars = data.stargazers_count || 0;
    
    // Update in-memory cache
    starsCache.set(repo, { stars, timestamp: Date.now() });
    
    return stars;
  } catch (error) {
    console.error(`Error fetching stars for ${repo}:`, error);
    return cached?.stars ?? 0; // Return stale cache if available
  }
}

/**
 * Get all project slugs for a specific locale
 */
export function getProjectSlugs(locale: string): string[] {
  const localeDir = path.join(projectsDirectory, locale);
  
  if (!fs.existsSync(localeDir)) {
    return [];
  }
  
  return fs.readdirSync(localeDir)
    .filter(file => file.endsWith('.md'))
    .map(file => file.replace(/\.md$/, ''));
}

/**
 * Get project metadata and content by slug
 */
export async function getProjectBySlug(slug: string, locale: string): Promise<Project | null> {
  const fullPath = path.join(projectsDirectory, locale, `${slug}.md`);
  
  if (!fs.existsSync(fullPath)) {
    return null;
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);
  
  // Process markdown to HTML
  const processedContent = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(content);
  
  const contentHtml = processedContent.toString();
  
  // Fetch real GitHub stars
  const stars = data.repo ? await getGitHubStars(data.repo) : 0;
  
  return {
    slug,
    title: data.title || 'Untitled',
    description: data.description || '',
    repo: data.repo || '',
    date: data.date || new Date().toISOString(),
    tags: data.tags || [],
    featured: data.featured || false,
    link: data.link || (data.repo ? `https://github.com/${data.repo}` : '#'),
    content: contentHtml,
    stars,
  };
}

/**
 * Get all projects metadata with stars
 */
export async function getAllProjects(locale: string): Promise<Project[]> {
  const slugs = getProjectSlugs(locale);
  
  const projects = await Promise.all(
    slugs.map(async (slug) => {
      const project = await getProjectBySlug(slug, locale);
      return project;
    })
  );
  
  // Filter out nulls and sort by date (newest first)
  return projects
    .filter((project): project is Project => project !== null)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(locale: string): Promise<Project[]> {
  const projects = await getAllProjects(locale);
  return projects.filter(project => project.featured);
}

/**
 * Format date for display
 */
export function formatProjectDate(dateString: string, locale: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}
