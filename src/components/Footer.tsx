import { Github, Linkedin, Twitter } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 mb-6">
      <div className="bg-mocha-mantle rounded-xl p-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm font-mono text-mocha-subtext0 border border-mocha-surface0">
        <div className="flex items-center gap-4">
          <span>&copy; {new Date().getFullYear()} Arthur Paly. All rights reserved.</span>
        </div>
        
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-4 text-mocha-text">
            <a href="https://github.com/ArthurMTX" target="_blank" rel="noopener noreferrer" className="hover:text-mocha-mauve transition-colors"><Github size={18} /></a>
            <a href="https://www.linkedin.com/in/arthurpaly/" target="_blank" rel="noopener noreferrer" className="hover:text-mocha-mauve transition-colors"><Linkedin size={18} /></a>
            <a href="https://x.com/MitralyxL" target="_blank" rel="noopener noreferrer" className="hover:text-mocha-mauve transition-colors"><Twitter size={18} /></a>
          </div>
        </div>
      </div>
    </footer>
  );
}
