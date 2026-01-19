import { Star, Folder, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  link: string;
  repo: string;
  date: string;
  stars?: number;
  slug?: string;
  showLink?: boolean;
}

function formatStars(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars.toString();
}

export default function ProjectCard({ 
  title, 
  description, 
  tags, 
  link, 
  repo, 
  date, 
  stars = 0,
  showLink = true 
}: ProjectCardProps) {
  const repoName = repo.split('/')[1] || title;
  
  return (
    <a href={link} target="_blank" rel="noopener noreferrer" className="block group">
      <div className="bg-mocha-mantle rounded-xl overflow-hidden border border-mocha-surface0 hover:border-mocha-mauve transition-colors h-full flex flex-col">
        {/* Card Header */}
        <div className="bg-mocha-crust/50 p-4 border-b border-mocha-surface0 flex justify-between items-center">
          <div className="flex items-center gap-2 text-mocha-mauve">
            <Folder size={18} />
            <span className="text-sm font-mono opacity-80">{repoName}</span>
          </div>
          <div className="flex items-center gap-3">
            {stars > 0 && (
              <div className="flex items-center gap-1 text-xs text-mocha-yellow font-mono">
                <Star size={14} className="fill-mocha-yellow" />
                <span>{formatStars(stars)}</span>
              </div>
            )}
            {showLink && (
              <ExternalLink size={14} className="text-mocha-mauve opacity-0 group-hover:opacity-100 transition-opacity" />
            )}
          </div>
        </div>

        {/* Card Body */}
        <div className="p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-baseline mb-4">
            <h3 className="text-xl font-bold text-mocha-text group-hover:text-mocha-mauve transition-colors">{title}</h3>
            <span className="text-xs text-mocha-subtext0 font-mono">{date}</span>
          </div>
          
          <p className="text-mocha-text text-sm mb-6 line-clamp-3">
            {description}
          </p>

          <div className="mt-auto flex flex-wrap gap-2">
            {tags.slice(0, 4).map((tag) => (
              <span key={tag} className="text-xs px-2 py-1 rounded bg-mocha-surface0 text-mocha-subtext1 font-mono">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </a>
  );
}
