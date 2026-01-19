import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Github, Linkedin, Mail, MapPin, Terminal, User, Compass, Target, Heart } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

// Static generation for all locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

// Revalidate daily
export const revalidate = 86400;

export default async function About({ params }: AboutPageProps) {
  await params;
  const t = await getTranslations('About');

  return (
    <PageLayout>
      <PageHeader 
        title={t('title')} 
        icon={User}
      />

      <section className="mt-8 mb-20">
        {/* Top row - Profile and Bio */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {/* Avatar Card */}
          <div className="bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors flex flex-col items-center justify-center">
            <div className="relative w-32 h-32 rounded-2xl overflow-hidden mb-4">
              <Image
                src="/images/avatar.jpeg"
                alt={t('imageAlt')}
                fill
                className="object-cover"
                priority
              />
            </div>
            <div className="flex items-center gap-2 text-mocha-subtext0 text-sm">
              <MapPin size={14} className="text-mocha-mauve" />
              <span>{t('location')}</span>
            </div>
            <div className="flex items-center gap-4 mt-4">
              <a href="https://github.com/ArthurMTX" target="_blank" rel="noopener noreferrer" className="text-mocha-subtext0 hover:text-mocha-mauve transition-colors">
                <Github size={20} />
              </a>
              <a href="https://www.linkedin.com/in/arthurpaly/" target="_blank" rel="noopener noreferrer" className="text-mocha-subtext0 hover:text-mocha-mauve transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="mailto:paly.arthur@gmail.com" className="text-mocha-subtext0 hover:text-mocha-mauve transition-colors">
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Bio Card */}
          <div className="md:col-span-2 bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors flex flex-col justify-between">
            <div className="flex items-center gap-2 text-mocha-text mb-4">
              <User size={20} className="text-mocha-mauve" />
              <span className="font-bold text-lg">{t('intro.greeting')}</span>
            </div>
            <p className="text-mocha-subtext0 leading-relaxed flex-1">
              {t('intro.description')}
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="status-dot" />
              <span className="text-mocha-green text-sm font-mono">{t('status')}</span>
            </div>
          </div>
        </div>

        {/* Toolbox Card - Full width */}
        <div className="bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors mb-4">
          <div className="flex items-center gap-2 text-mocha-text mb-6">
            <Terminal size={20} className="text-mocha-mauve" />
            <span className="font-bold text-lg">{t('sections.toolbox')}</span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Languages */}
            <div className="bg-mocha-crust/50 p-4 rounded-xl">
              <h3 className="text-mocha-text font-medium mb-3 text-sm uppercase tracking-wider">{t('toolbox.languages.title')}</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" alt="Python" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Python</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" alt="JavaScript" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">JavaScript</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bash/bash-original.svg" alt="Bash" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Bash</span>
                </div>
              </div>
            </div>

            {/* Infrastructure */}
            <div className="bg-mocha-crust/50 p-4 rounded-xl">
              <h3 className="text-mocha-text font-medium mb-3 text-sm uppercase tracking-wider">{t('toolbox.infrastructure.title')}</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg" alt="Kubernetes" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Kubernetes</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg" alt="Docker" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Docker</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/terraform/terraform-original.svg" alt="Terraform" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Terraform</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ansible/ansible-original.svg" alt="Ansible" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Ansible</span>
                </div>
              </div>
            </div>

            {/* Data & Observability */}
            <div className="bg-mocha-crust/50 p-4 rounded-xl">
              <h3 className="text-mocha-text font-medium mb-3 text-sm uppercase tracking-wider">{t('toolbox.data.title')}</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg" alt="PostgreSQL" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">PostgreSQL</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg" alt="Redis" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Redis</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/prometheus/prometheus-original.svg" alt="Prometheus" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Prometheus</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/grafana/grafana-original.svg" alt="Grafana" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Grafana</span>
                </div>
              </div>
            </div>

            {/* Environment */}
            <div className="bg-mocha-crust/50 p-4 rounded-xl">
              <h3 className="text-mocha-text font-medium mb-3 text-sm uppercase tracking-wider">{t('toolbox.environment.title')}</h3>
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg" alt="Linux" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Linux</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg" alt="Windows Server" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Windows Server</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" alt="Git" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">Git</span>
                </div>
                <div className="flex items-center gap-2 bg-mocha-surface0/50 px-3 py-2 rounded-lg">
                  <Image src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/githubactions/githubactions-original.svg" alt="CI/CD" width={24} height={24} />
                  <span className="text-mocha-text text-sm font-medium">CI/CD</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom row - Principles and Currently */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Principles Card */}
          <div className="bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors">
            <div className="flex items-center gap-2 text-mocha-text mb-6">
              <Target size={20} className="text-mocha-mauve" />
              <span className="font-bold text-lg">{t('sections.principles')}</span>
            </div>
            
            <div className="space-y-3">
              <div className="border-l-2 border-mocha-mauve pl-4 py-1">
                <p className="text-sm text-mocha-subtext0">{t('principles.curiosity')}</p>
              </div>
              <div className="border-l-2 border-mocha-blue pl-4 py-1">
                <p className="text-sm text-mocha-subtext0">{t('principles.break_to_learn')}</p>
              </div>
              <div className="border-l-2 border-mocha-green pl-4 py-1">
                <p className="text-sm text-mocha-subtext0">{t('principles.documentation')}</p>
              </div>
              <div className="border-l-2 border-mocha-peach pl-4 py-1">
                <p className="text-sm text-mocha-subtext0">{t('principles.experimentation')}</p>
              </div>
            </div>
          </div>

          {/* Currently Card */}
          <div className="bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors">
            <div className="flex items-center gap-2 text-mocha-text mb-6">
              <Compass size={20} className="text-mocha-mauve" />
              <span className="font-bold text-lg">{t('sections.currently')}</span>
            </div>
            
            <div className="space-y-3">
              <div className="bg-mocha-crust/50 p-3 rounded-lg">
                <p className="text-sm text-mocha-subtext0">{t('currently.portfolium')}</p>
              </div>
              <div className="bg-mocha-crust/50 p-3 rounded-lg">
                <p className="text-sm text-mocha-subtext0">{t('currently.cloud')}</p>
              </div>
              <div className="bg-mocha-crust/50 p-3 rounded-lg">
                <p className="text-sm text-mocha-subtext0">{t('currently.cicd')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Beyond Code Card */}
        <div className="mt-4 bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors">
          <div className="flex items-center gap-2 text-mocha-text mb-4">
            <Heart size={20} className="text-mocha-mauve" />
            <span className="font-bold text-lg">{t('sections.beyond')}</span>
          </div>
          <p className="text-mocha-subtext0 leading-relaxed text-sm">
            {t('beyond.description')}
          </p>
        </div>

        {/* Contact CTA */}
        <div className="mt-4 bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-mocha-text">{t('contact.title')}</h3>
            <p className="text-mocha-subtext0 text-sm mt-1">{t('contact.description')}</p>
          </div>
          <a 
            href="mailto:paly.arthur@gmail.com" 
            className="shrink-0 py-3 px-6 rounded-xl bg-mocha-surface0 text-mocha-text font-bold hover:bg-mocha-mauve hover:text-mocha-base transition-colors flex items-center justify-center gap-2"
          >
            <Mail size={18} />
            <span>{t('contact.cta')}</span>
          </a>
        </div>
      </section>
    </PageLayout>
  );
}
