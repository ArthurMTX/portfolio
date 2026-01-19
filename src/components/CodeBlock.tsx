'use client';

import { useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

interface CodeBlockProps {
  language?: string;
  children: string;
  highlightedHtml?: string;
}

const languageLabels: Record<string, string> = {
  js: 'JavaScript',
  javascript: 'JavaScript',
  ts: 'TypeScript',
  typescript: 'TypeScript',
  tsx: 'TSX',
  jsx: 'JSX',
  py: 'Python',
  python: 'Python',
  bash: 'Bash',
  sh: 'Shell',
  shell: 'Shell',
  zsh: 'Zsh',
  css: 'CSS',
  scss: 'SCSS',
  html: 'HTML',
  json: 'JSON',
  yaml: 'YAML',
  yml: 'YAML',
  md: 'Markdown',
  markdown: 'Markdown',
  sql: 'SQL',
  go: 'Go',
  rust: 'Rust',
  rs: 'Rust',
  java: 'Java',
  c: 'C',
  cpp: 'C++',
  'c++': 'C++',
  cs: 'C#',
  csharp: 'C#',
  php: 'PHP',
  ruby: 'Ruby',
  rb: 'Ruby',
  swift: 'Swift',
  kotlin: 'Kotlin',
  kt: 'Kotlin',
  docker: 'Dockerfile',
  dockerfile: 'Dockerfile',
  nginx: 'Nginx',
  graphql: 'GraphQL',
  gql: 'GraphQL',
  vue: 'Vue',
  svelte: 'Svelte',
  toml: 'TOML',
  ini: 'INI',
  xml: 'XML',
  diff: 'Diff',
  plaintext: 'Text',
  text: 'Text',
};

export default function CodeBlock({ language, children, highlightedHtml }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);

  const handleCopy = async () => {
    // Always copy plain text, not HTML
    const code = children;
    
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const displayLanguage = language ? (languageLabels[language.toLowerCase()] || language) : null;

  return (
    <div className="code-block-wrapper group relative">
      {/* Header with language and copy button */}
      <div className="code-block-header">
        <span className="code-block-language">
          {displayLanguage || 'Code'}
        </span>
        <button
          onClick={handleCopy}
          className="code-block-copy"
          aria-label={copied ? 'Copied!' : 'Copy code'}
        >
          {copied ? (
            <>
              <Check size={14} />
              <span>Copied!</span>
            </>
          ) : (
            <>
              <Copy size={14} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      
      {/* Code content */}
      <pre ref={codeRef} className={language ? `language-${language}` : ''}>
        {highlightedHtml ? (
          <code 
            className={language ? `hljs language-${language}` : 'hljs'}
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <code className={language ? `hljs language-${language}` : 'hljs'}>
            {children}
          </code>
        )}
      </pre>
    </div>
  );
}
