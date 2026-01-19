'use client';

import { useEffect, useRef, useState } from 'react';
import type { MermaidConfig } from 'mermaid';

interface MermaidProps {
  chart: string;
}

const mermaidConfig: MermaidConfig = {
  startOnLoad: false,
  theme: 'dark' as const,
  themeVariables: {
    primaryColor: '#cba6f7',
    primaryTextColor: '#cdd6f4',
    primaryBorderColor: '#45475a',
    lineColor: '#a6adc8',
    secondaryColor: '#313244',
    tertiaryColor: '#181825',
    background: '#1e1e2e',
    mainBkg: '#313244',
    secondBkg: '#181825',
    tertiaryBkg: '#1e1e2e',
    textColor: '#cdd6f4',
    fontFamily: 'JetBrains Mono, monospace',
    fontSize: '14px',
    nodeBorder: '#45475a',
    clusterBkg: '#181825',
    clusterBorder: '#45475a',
    edgeLabelBackground: '#313244',
    nodeTextColor: '#cdd6f4',
  },
  flowchart: {
    htmlLabels: true,
    curve: 'basis',
  },
  sequence: {
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
  },
};

export default function Mermaid({ chart }: MermaidProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const renderChart = async () => {
      if (!containerRef.current) return;

      try {
        // Dynamically import mermaid only when needed
        const mermaid = (await import('mermaid')).default;
        mermaid.initialize(mermaidConfig);
        
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`;
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
        setError(null);
      } catch (err) {
        console.error('Mermaid rendering error:', err);
        setError('Failed to render diagram');
      } finally {
        setIsLoading(false);
      }
    };

    renderChart();
  }, [chart]);

  if (error) {
    return (
      <div className="mermaid-error">
        <p>⚠️ {error}</p>
        <pre><code>{chart}</code></pre>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div ref={containerRef} className="mermaid-container animate-pulse bg-mocha-surface0 rounded-lg h-48" />
    );
  }

  return (
    <div 
      ref={containerRef} 
      className="mermaid-container"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
