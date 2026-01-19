import PageLayout from "@/components/PageLayout";
import PageHeader from "@/components/PageHeader";
import { Download, FileText, Briefcase, GraduationCap, MapPin } from 'lucide-react';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';

interface ResumePageProps {
  params: Promise<{ locale: string }>;
}

// Static generation for all locales
export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'fr' }];
}

// Revalidate weekly (resume rarely changes)
export const revalidate = 604800;

export default async function Resume({ params }: ResumePageProps) {
  await params;
  const t = await getTranslations('Resume');

  return (
    <PageLayout>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-12">
        <PageHeader 
          title={t('title')} 
          icon={FileText}
        />
        <div className="flex gap-2 self-start md:self-auto">
          <Link 
            href="/resume_en.pdf"
            download
            className="flex items-center gap-2 bg-mocha-surface0 hover:bg-mocha-mauve hover:text-mocha-base text-mocha-text px-4 py-2.5 rounded-lg transition-colors"
          >
            <Download size={18} />
            <span>EN</span>
          </Link>
          <Link 
            href="/resume_fr.pdf"
            download
            className="flex items-center gap-2 bg-mocha-surface0 hover:bg-mocha-mauve hover:text-mocha-base text-mocha-text px-4 py-2.5 rounded-lg transition-colors"
          >
            <Download size={18} />
            <span>FR</span>
          </Link>
        </div>
      </div>
      
      <div className="space-y-12">
        {/* Experience */}
        <section>
          <h2 className="text-xl font-bold text-mocha-text mb-6 flex items-center gap-2">
            <Briefcase size={20} className="text-mocha-mauve" />
            {t('experience')}
          </h2>
          <div className="space-y-6">
            {/* Axens */}
            <div className="border-l-2 border-mocha-mauve pl-6 relative">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-mocha-mauve" />
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                <h3 className="text-lg font-bold text-mocha-text">{t('jobs.axens.title')}</h3>
                <span className="text-sm text-mocha-subtext0 font-mono">{t('jobs.axens.period')}</span>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-full max-w-[120px]">
                    <Image src="/images/logos/axens.webp" alt="Axens" fill className="object-contain object-left" />
                  </div>
                  <span className="text-mocha-text font-semibold">{t('jobs.axens.company')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-mocha-subtext0 text-sm">
                  <MapPin size={14} className="text-mocha-mauve" />
                  <span>{t('jobs.axens.location')}</span>
                </div>
              </div>
              <ul className="text-mocha-subtext0 leading-relaxed list-disc list-inside space-y-1">
                {(t.raw('jobs.axens.duties') as string[]).map((duty, index) => (
                  <li key={index}>{duty}</li>
                ))}
              </ul>
            </div>

            {/* BEA Solutions */}
            <div className="border-l-2 border-mocha-surface0 pl-6 relative">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-mocha-surface1" />
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                <h3 className="text-lg font-bold text-mocha-text">{t('jobs.bea.title')}</h3>
                <span className="text-sm text-mocha-subtext0 font-mono">{t('jobs.bea.period')}</span>
              </div>
              <div className="flex flex-col gap-2 mb-4">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-full max-w-[120px]">
                    <Image src="/images/logos/bea.webp" alt="BEA Solutions" fill className="object-contain object-left" />
                  </div>
                  <span className="text-mocha-text font-semibold">{t('jobs.bea.company')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-mocha-subtext0 text-sm">
                  <MapPin size={14} className="text-mocha-mauve" />
                  <span>{t('jobs.bea.location')}</span>
                </div>
              </div>
              <ul className="text-mocha-subtext0 leading-relaxed list-disc list-inside space-y-1">
                {(t.raw('jobs.bea.duties') as string[]).map((duty, index) => (
                  <li key={index}>{duty}</li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xl font-bold text-mocha-text mb-6 flex items-center gap-2">
            <GraduationCap size={20} className="text-mocha-mauve" />
            {t('education')}
          </h2>
          <div className="space-y-6">
            <div className="border-l-2 border-mocha-mauve pl-6 relative">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-mocha-mauve" />
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                <h3 className="text-lg font-bold text-mocha-text">{t('educations.imt.degree')}</h3>
                <span className="text-sm text-mocha-subtext0 font-mono">{t('educations.imt.period')}</span>
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-full max-w-[120px]">
                    <Image src="/images/logos/imt.webp" alt="IMT Mines Alès" fill className="object-contain object-left" />
                  </div>
                  <span className="text-mocha-text font-semibold">{t('educations.imt.school')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-mocha-subtext0 text-sm">
                  <MapPin size={14} className="text-mocha-mauve" />
                  <span>{t('educations.imt.location')}</span>
                </div>
              </div>
              <p className="text-mocha-subtext0 leading-relaxed mt-2">
                {t('educations.imt.specialization')}
              </p>
            </div>

            <div className="border-l-2 border-mocha-surface0 pl-6 relative">
              <div className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-mocha-surface1" />
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-1 mb-2">
                <h3 className="text-lg font-bold text-mocha-text">{t('educations.cvut.degree')}</h3>
                <span className="text-sm text-mocha-subtext0 font-mono">{t('educations.cvut.period')}</span>
              </div>
              <div className="flex flex-col gap-2 mb-2">
                <div className="flex items-center gap-3">
                  <div className="relative h-8 w-full max-w-[120px]">
                    <Image src="/images/logos/cvut.webp" alt="ČVUT" fill className="object-contain object-left" />
                  </div>
                  <span className="text-mocha-text font-semibold">{t('educations.cvut.school')}</span>
                </div>
                <div className="flex items-center gap-1.5 text-mocha-subtext0 text-sm">
                  <MapPin size={14} className="text-mocha-mauve" />
                  <span>{t('educations.cvut.location')}</span>
                </div>
              </div>
              <p className="text-mocha-subtext0 leading-relaxed mt-2">
                {t('educations.cvut.specialization')}
              </p>
            </div>
          </div>
        </section>
      </div>
    </PageLayout>
  );
}
