import { LucideIcon } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  icon?: LucideIcon;
}

export default function PageHeader({ title, subtitle, icon: Icon }: PageHeaderProps) {
  return (
    <header className="mb-12">
      <h1 className="text-4xl md:text-5xl font-bold text-mocha-text mb-4 flex items-center gap-4">
        {Icon && <Icon className="text-mocha-mauve" size={36} />}
        {title}
      </h1>
      {subtitle && (
        <p className="text-lg text-mocha-subtext0 max-w-2xl">
          {subtitle}
        </p>
      )}
    </header>
  );
}
