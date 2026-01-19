"use client";

import { Link } from '@/i18n/routing';
import { 
  Mail, 
  MapPin, 
  GitCommit, 
  FileText, 
  ExternalLink,
  ArrowRight
} from 'lucide-react';
import dynamic from 'next/dynamic';
import { GithubCommit } from '@/lib/github';
import { ArticleMeta } from '@/lib/articles';
import { useState, useEffect } from 'react';

const Map = dynamic(() => import('./Map'), { 
  ssr: false,
  loading: () => <div className="w-full h-full bg-mocha-crust animate-pulse" />
});

interface DashboardProps {
  commits?: GithubCommit[];
  articles?: ArticleMeta[];
  translations: {
    getInTouch: { title: string; description: string };
    basedIn: { title: string; location: string; remote: string };
    recentActivity: { title: string; viewCommit: string; noActivity: string; checkGithub: string; viewProfile: string };
    latestThoughts: { title: string; noPosts: string; checkBack: string; readAll: string };
  };
}

export default function Dashboard({ commits = [], articles = [], translations }: DashboardProps) {
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const franceTime = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Paris',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      setCurrentTime(franceTime);
    };

    updateTime(); // Initial update
    const interval = setInterval(updateTime, 1000); // Update every second

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="mb-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        {/* Contact Widget */}
        <div className="bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 flex flex-col justify-between h-64 hover:border-mocha-mauve transition-colors">
          <div className="flex items-center gap-2 text-mocha-text">
            <Mail size={20} className="text-mocha-mauve" />
            <span className="font-bold text-lg">{translations.getInTouch.title}</span>
          </div>
          
          <p className="text-mocha-subtext0 text-base leading-relaxed max-w-md">
            {translations.getInTouch.description}
          </p>
          
          <a href="mailto:paly.arthur@gmail.com" className="w-full py-3 rounded-xl bg-mocha-surface0 text-mocha-text font-bold hover:bg-mocha-mauve hover:text-mocha-base transition-colors flex items-center justify-center gap-2">
            <Mail size={18} />
            <span>paly.arthur@gmail.com</span>
          </a>
        </div>

        {/* Location Widget */}
        <div className="bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 flex flex-col justify-between h-64 relative overflow-hidden hover:border-mocha-mauve transition-colors">
          <div className="relative z-10 flex items-center gap-2 text-mocha-text">
            <MapPin size={20} className="text-mocha-mauve" />
            <span className="font-bold text-lg">{translations.basedIn.title}</span>
          </div>
          
          {/* Map Placeholder */}
          <div className="absolute inset-0 opacity-50">
             <Map />
          </div>
          
          <div className="relative z-10 mt-auto pointer-events-none">
            <h3 className="text-3xl font-bold text-mocha-text tracking-tight drop-shadow-md">{translations.basedIn.location}</h3>
            <div className="flex justify-between items-end mt-2">
              <span className="text-mocha-subtext0 drop-shadow-md font-medium">{translations.basedIn.remote}</span>
              <div className="flex items-center gap-2">
                <span className="text-mocha-mauve font-mono text-base font-semibold bg-mocha-surface0/80 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                  {currentTime || '00:00:00'}
                </span>
                <span className="text-mocha-yellow font-mono text-sm bg-mocha-surface0/80 backdrop-blur-sm px-2 py-1 rounded shadow-sm">
                  CET (UTC+1)
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Commits */}
        <div className="bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-mocha-text">
              <GitCommit size={20} className="text-mocha-mauve" />
              <span className="font-bold text-lg">{translations.recentActivity.title}</span>
            </div>
            <span className="text-xs text-mocha-subtext0 font-mono bg-mocha-surface0 px-2 py-1 rounded">github.com/ArthurMTX</span>
          </div>
          
          <div className="space-y-4 font-mono text-sm">
            {commits.length > 0 ? (
              commits.map((commit, index) => (
                <div key={`${commit.url}-${index}`} className="flex justify-between items-center border-b border-mocha-surface0/50 pb-2">
                  <div className="truncate max-w-[70%]">
                    <span className="text-mocha-blue">{commit.repo}:</span> <span className="text-mocha-subtext0" title={commit.message}>{commit.message}</span>
                  </div>
                  <div className="flex gap-2 text-xs">
                    <a href={commit.url} target="_blank" rel="noopener noreferrer" className="text-mocha-mauve hover:underline">{translations.recentActivity.viewCommit}</a>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-mocha-subtext0 py-4">
                <div className="text-center mb-2">{translations.recentActivity.noActivity}</div>
                <div className="text-xs text-mocha-surface2 text-center">{translations.recentActivity.checkGithub}</div>
              </div>
            )}
          </div>
          
          <div className="mt-6 flex items-center gap-2 text-xs">
            <a href="https://github.com/ArthurMTX" target="_blank" rel="noopener noreferrer" className="text-mocha-subtext0 hover:text-mocha-mauve flex items-center gap-1 transition-colors">
              {translations.recentActivity.viewProfile} <ArrowRight size={12} />
            </a>
          </div>
        </div>

        {/* Latest Posts */}
        <div className="bg-mocha-mantle p-6 rounded-2xl border border-mocha-surface0 hover:border-mocha-mauve transition-colors">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2 text-mocha-text">
              <FileText size={20} className="text-mocha-mauve" />
              <span className="font-bold text-lg">{translations.latestThoughts.title}</span>
            </div>
            <ExternalLink size={16} className="text-mocha-mauve" />
          </div>
          
          <div className="space-y-4 text-sm">
            {articles.length > 0 ? (
              articles.slice(0, 3).map((article) => (
                <Link
                  key={article.slug}
                  href={`/posts/${article.slug}`}
                  className="flex flex-col group cursor-pointer border-b border-mocha-surface0/50 pb-3 gap-2"
                >
                  <div className="flex justify-between items-start gap-2">
                    <span className="text-mocha-subtext0 group-hover:text-mocha-mauve transition-colors font-semibold">{article.title}</span>
                    <span className="text-mocha-surface2 text-xs font-mono shrink-0">{new Date(article.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  {article.description && (
                    <p className="text-mocha-subtext0/70 text-xs line-clamp-2">{article.description}</p>
                  )}
                </Link>
              ))
            ) : (
              <div className="text-mocha-subtext0 py-4">
                <div className="text-center mb-2">{translations.latestThoughts.noPosts}</div>
                <div className="text-xs text-mocha-surface2 text-center">{translations.latestThoughts.checkBack}</div>
              </div>
            )}
          </div>
          
           <div className="mt-6 flex items-center gap-2 text-xs">
            <Link href="/posts" className="text-mocha-subtext0 hover:text-mocha-mauve flex items-center gap-1 transition-colors">
              {translations.latestThoughts.readAll} <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
