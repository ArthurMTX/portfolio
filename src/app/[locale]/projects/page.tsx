import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects, formatProjectDate } from "@/lib/projects";
import { getTranslations } from 'next-intl/server';
import { Folder } from 'lucide-react';
import type { Metadata } from 'next';

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://arthurpaly.com';

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Projects' });
  
  return {
    title: t('title'),
    description: t('subtitle'),
    alternates: {
      canonical: `${baseUrl}/${locale}/projects`,
      languages: {
        'en': `${baseUrl}/en/projects`,
        'fr': `${baseUrl}/fr/projects`,
      },
    },
    openGraph: {
      title: t('title'),
      description: t('subtitle'),
      url: `${baseUrl}/${locale}/projects`,
    },
  };
}

// Static generation for all locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

// Revalidate every 2 hours (for GitHub stars)
export const revalidate = 7200;

export default async function Projects({ params }: ProjectsPageProps) {
  const { locale } = await params;
  const t = await getTranslations('Projects');
  const projects = await getAllProjects(locale);

  return (
    <PageLayout>
      <PageHeader 
        title={t('title')} 
        subtitle={t('subtitle')}
        icon={Folder}
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
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

      {projects.length === 0 && (
        <div className="text-center py-16">
          <p className="text-mocha-subtext0 text-lg">
            {t('noProjects')}
          </p>
        </div>
      )}
    </PageLayout>
  );
}
