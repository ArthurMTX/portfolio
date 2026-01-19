'use client';

import { useEffect, useRef } from 'react';
import { createRoot } from 'react-dom/client';
import CodeBlock from './CodeBlock';
import Mermaid from './Mermaid';

interface ArticleContentProps {
  content: string;
}

export default function ArticleContent({ content }: ArticleContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isMounted = useRef(false);

  useEffect(() => {
    // Skip if already mounted (StrictMode double-render protection)
    if (isMounted.current) return;
    isMounted.current = true;

    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // Process all pre > code blocks
    const preElements = container.querySelectorAll('pre');
    
    preElements.forEach((pre) => {
      const code = pre.querySelector('code');
      if (!code) return;

      // Check if this is a mermaid block
      const isMermaid = code.classList.contains('language-mermaid') || 
                        code.classList.contains('hljs-mermaid') ||
                        code.className.includes('mermaid');

      // Get language from class
      let language = '';
      const classMatch = code.className.match(/language-(\w+)/);
      if (classMatch) {
        language = classMatch[1];
      } else {
        // Try hljs class pattern
        const hljsMatch = code.className.match(/hljs-(\w+)/);
        if (hljsMatch) {
          language = hljsMatch[1];
        }
      }

      // Get code content - both plain text (for copy) and HTML (for highlighting)
      const codeText = code.textContent || '';
      const codeHtml = code.innerHTML;

      // Create wrapper div
      const wrapper = document.createElement('div');
      wrapper.className = 'code-block-root';
      
      // Replace pre with wrapper
      pre.parentNode?.replaceChild(wrapper, pre);

      // Render React component
      const root = createRoot(wrapper);
      
      if (isMermaid || language === 'mermaid') {
        root.render(<Mermaid chart={codeText} />);
      } else {
        root.render(
          <CodeBlock language={language} highlightedHtml={codeHtml}>
            {codeText}
          </CodeBlock>
        );
      }
    });

    // Cleanup function
    return () => {
      isMounted.current = false;
    };
  }, [content]);

  return (
    <div 
      ref={containerRef}
      className="prose-article"
      dangerouslySetInnerHTML={{ __html: content }}
      suppressHydrationWarning
    />
  );
}
