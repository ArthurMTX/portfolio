"use client";

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const otherLocale = locale === 'en' ? 'fr' : 'en';
  
  // Save locale preference when user switches language
  const handleLocaleChange = (newLocale: string) => {
    // Save to cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Save to localStorage as backup
    localStorage.setItem('preferredLocale', newLocale);
  };

  const navItems = [
    { href: '/about', label: t('about'), isActive: pathname === '/about' },
    { href: '/posts', label: t('posts'), isActive: pathname.startsWith('/posts') },
    { href: '/projects', label: t('projects'), isActive: pathname.startsWith('/projects') },
    { href: '/resume', label: t('resume'), isActive: pathname === '/resume' },
  ];

  return (
    <nav 
      className="sticky top-0 z-50"
      style={{
        mask: 'linear-gradient(black, black, transparent)',
        WebkitMask: 'linear-gradient(black, black, transparent)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
      }}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center py-4">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-mocha-text hover:text-mocha-mauve transition-colors focus-ring rounded-lg px-2 py-1 -ml-2">
          ~/arthur
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden md:flex space-x-1 text-mocha-text font-medium text-sm items-center">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link 
                href={item.href} 
                className={`px-4 py-2 rounded-lg transition-all focus-ring ${
                  item.isActive 
                    ? 'text-mocha-mauve bg-mocha-surface0' 
                    : 'hover:text-mocha-mauve hover:bg-mocha-surface0/50'
                }`}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li className="ml-2 pl-2 border-l border-mocha-surface0">
            <Link 
              href={pathname} 
              locale={otherLocale}
              onClick={() => handleLocaleChange(otherLocale)}
              className="px-3 py-2 rounded-lg text-mocha-subtext0 hover:text-mocha-mauve hover:bg-mocha-surface0/50 transition-all uppercase text-xs font-mono focus-ring"
            >
              {otherLocale}
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden p-2 rounded-lg text-mocha-text hover:bg-mocha-surface0 transition-colors focus-ring"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-mocha-surface0 bg-mocha-mantle/95 backdrop-blur-lg">
          <ul className="px-6 py-4 space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-4 py-3 rounded-lg transition-all ${
                    item.isActive 
                      ? 'text-mocha-mauve bg-mocha-surface0' 
                      : 'text-mocha-text hover:text-mocha-mauve hover:bg-mocha-surface0/50'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="pt-2 mt-2 border-t border-mocha-surface0">
              <Link 
                href={pathname} 
                locale={otherLocale}
                onClick={() => {
                  handleLocaleChange(otherLocale);
                  setMobileMenuOpen(false);
                }}
                className="block px-4 py-3 rounded-lg text-mocha-subtext0 hover:text-mocha-mauve hover:bg-mocha-surface0/50 transition-all uppercase text-sm font-mono"
              >
                {otherLocale === 'en' ? '🇬🇧 English' : '🇫🇷 Français'}
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
