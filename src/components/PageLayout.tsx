import Navbar from "./Navbar";
import Footer from "./Footer";

interface PageLayoutProps {
  children: React.ReactNode;
  /** Use narrow width for content-focused pages like articles */
  narrow?: boolean;
  /** Use wide width for landing pages */
  wide?: boolean;
}

export default function PageLayout({ children, narrow = false, wide = false }: PageLayoutProps) {
  const maxWidth = narrow ? 'max-w-3xl' : wide ? 'max-w-6xl' : 'max-w-5xl';
  
  return (
    <>
      <Navbar />
      <div className={`min-h-screen mx-auto px-6 ${maxWidth}`}>
        <main className="py-8">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
