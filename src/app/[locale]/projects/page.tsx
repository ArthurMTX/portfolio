import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import ProjectCard from "@/components/ProjectCard";
import { getAllProjects, formatProjectDate } from "@/lib/projects";
import { getTranslations } from 'next-intl/server';
import { Folder } from 'lucide-react';

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
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
