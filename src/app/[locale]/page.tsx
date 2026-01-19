import PageLayout from "@/components/PageLayout";
import ProjectCard from "@/components/ProjectCard";
import Dashboard from "@/components/Dashboard";
import { Link } from "@/i18n/routing";
import { Github, Linkedin, Twitter, ArrowRight, Star, Sparkles, Coffee, PenLine } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import { getRecentCommits } from "@/lib/github";
import { getFeaturedProjects, formatProjectDate } from "@/lib/projects";
import { getAllArticles, formatDate } from "@/lib/articles";

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

// Static generation for all locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

// Revalidate every hour
export const revalidate = 3600;

export default async function Home({ params }: HomePageProps) {
  const { locale } = await params;
  const t = await getTranslations('HomePage');
  const tProjects = await getTranslations('Projects');
  const tPosts = await getTranslations('Posts');
  const tDashboard = await getTranslations('Dashboard');
  const commits = await getRecentCommits('ArthurMTX');
  const featuredProjects = await getFeaturedProjects(locale);
  const recentPosts = await getAllArticles(locale);

  return (
    <PageLayout wide>
      {/* ===== HERO SECTION ===== */}
      <section id="about" className="mb-32 mt-4 md:mt-12 min-h-[70vh] flex flex-col justify-center">
        {/* Status indicator */}
        <div className="animate-on-load animate-fade-in-up flex items-center gap-2 mb-6">
          <span className="status-dot" />
          <span className="text-mocha-green text-sm font-mono">{t('status')}</span>
        </div>

        <div className="flex flex-col gap-3 mb-8">
          <span className="animate-on-load animate-fade-in-up delay-100 text-mocha-mauve font-mono text-base md:text-lg">
            {t('greeting')}
          </span>
          <h1 className="animate-on-load animate-fade-in-up delay-200 text-4xl md:text-6xl font-bold text-mocha-text tracking-tight">
            {t('name')}
          </h1>
          <h2 className="animate-on-load animate-fade-in-up delay-300 text-3xl md:text-5xl font-bold text-mocha-subtext0">
            {t('tagline')}
          </h2>
        </div>
        
        <div className="max-w-2xl">
          <p className="animate-on-load animate-fade-in-up delay-400 text-mocha-text text-base md:text-lg leading-relaxed mb-8" dangerouslySetInnerHTML={{__html: t.raw('description')}} />
          
          {/* CTAs */}
          <div className="animate-on-load animate-fade-in-up delay-500 flex flex-col sm:flex-row gap-4 mb-12">
            <Link 
              href="/projects" 
              className="focus-ring inline-flex items-center justify-center gap-2 px-6 py-3 bg-mocha-mauve text-mocha-base font-bold rounded-xl hover:bg-mocha-text transition-colors"
            >
              <Sparkles size={18} />
              {t('cta.projects')}
            </Link>
            <a 
              href="mailto:paly.arthur@gmail.com" 
              className="focus-ring inline-flex items-center justify-center gap-2 px-6 py-3 border border-mocha-surface0 text-mocha-text font-medium rounded-xl hover:border-mocha-mauve hover:text-mocha-mauve transition-colors"
            >
              <Coffee size={18} />
              {t('cta.contact')}
            </a>
          </div>

          {/* Social links */}
          <div className="animate-on-load animate-fade-in-up delay-600 flex items-center gap-1 text-mocha-subtext0">
            <a href="https://github.com/ArthurMTX" target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-2 px-3 py-2 rounded-lg hover:text-mocha-mauve hover:bg-mocha-surface0 transition-all">
              <Github size={18} />
              <span className="text-sm">GitHub</span>
            </a>
            <span className="text-mocha-surface1">|</span>
            <a href="https://www.linkedin.com/in/arthurpaly/" target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-2 px-3 py-2 rounded-lg hover:text-mocha-mauve hover:bg-mocha-surface0 transition-all">
              <Linkedin size={18} />
              <span className="text-sm">LinkedIn</span>
            </a>
            <span className="text-mocha-surface1">|</span>
            <a href="https://x.com/MitralyxL" target="_blank" rel="noopener noreferrer" className="focus-ring flex items-center gap-2 px-3 py-2 rounded-lg hover:text-mocha-mauve hover:bg-mocha-surface0 transition-all">
              <Twitter size={18} />
              <span className="text-sm">X</span>
            </a>
            <span className="text-mocha-surface1">|</span>
            <Link href="/about" className="focus-ring flex items-center gap-2 px-3 py-2 rounded-lg hover:text-mocha-mauve hover:bg-mocha-surface0 transition-all">
              <span className="text-sm">{t('cta.about')}</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section id="projects" className="mb-24">
        <div className="flex justify-between items-center mb-8 pb-4 border-b border-mocha-surface0">
          <h2 className="text-2xl md:text-3xl font-bold text-mocha-text flex items-center gap-3">
            <Star className="text-mocha-mauve" size={24} /> 
            {tProjects('featured')}
          </h2>
          <Link href="/projects" className="focus-ring text-mocha-subtext0 hover:text-mocha-mauve transition-colors flex items-center gap-2 font-mono text-sm px-3 py-1.5 rounded-lg hover:bg-mocha-surface0">
            {tProjects('viewAll')} <ArrowRight size={16} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProjects.slice(0, 3).map((project) => (
            <ProjectCard
              key={project.slug}
              title={project.title}
              repo={project.repo}
              date={formatProjectDate(project.date, locale)}
              description={project.description}
              tags={project.tags}
              link={project.link || `https://github.com/${project.repo}`}
              stars={project.stars}
              slug={project.slug}
            />
          ))}
        </div>
      </section>

      {/* ===== RECENT POSTS ===== */}
      {recentPosts.length > 0 && (
        <section id="posts" className="mb-24">
          <div className="flex justify-between items-center mb-8 pb-4 border-b border-mocha-surface0">
            <h2 className="text-2xl md:text-3xl font-bold text-mocha-text flex items-center gap-3">
              <PenLine className="text-mocha-mauve" size={24} /> 
              {tPosts('recentPosts')}
            </h2>
            <Link href="/posts" className="focus-ring text-mocha-subtext0 hover:text-mocha-mauve transition-colors flex items-center gap-2 font-mono text-sm px-3 py-1.5 rounded-lg hover:bg-mocha-surface0">
              {tPosts('allPosts')} <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid gap-4">
            {recentPosts.slice(0, 3).map((post) => (
              <Link
                key={post.slug}
                href={`/posts/${post.slug}`}
                className="group block bg-mocha-mantle border border-mocha-surface0 rounded-xl p-5 hover:border-mocha-mauve transition-colors"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-bold text-mocha-text group-hover:text-mocha-mauve transition-colors truncate">
                      {post.title}
                    </h3>
                    <p className="text-mocha-subtext0 text-sm mt-1 line-clamp-1">
                      {post.description}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-mocha-subtext0 shrink-0 font-mono">
                    <span>{post.readingTime}</span>
                    <span>{formatDate(post.date, locale)}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ===== DASHBOARD ===== */}
      <Dashboard 
        commits={commits} 
        articles={recentPosts}
        translations={{
          getInTouch: {
            title: tDashboard('getInTouch.title'),
            description: tDashboard('getInTouch.description')
          },
          basedIn: {
            title: tDashboard('basedIn.title'),
            location: tDashboard('basedIn.location'),
            remote: tDashboard('basedIn.remote')
          },
          recentActivity: {
            title: tDashboard('recentActivity.title'),
            viewCommit: tDashboard('recentActivity.viewCommit'),
            noActivity: tDashboard('recentActivity.noActivity'),
            checkGithub: tDashboard('recentActivity.checkGithub'),
            viewProfile: tDashboard('recentActivity.viewProfile')
          },
          latestThoughts: {
            title: tDashboard('latestThoughts.title'),
            noPosts: tDashboard('latestThoughts.noPosts'),
            checkBack: tDashboard('latestThoughts.checkBack'),
            readAll: tDashboard('latestThoughts.readAll')
          }
        }}
      />
    </PageLayout>
  );
}
