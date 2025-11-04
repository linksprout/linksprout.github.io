import React from 'react';
import { landingPageConfig } from '../landingPageConfig';

interface SiteNavProps {
  currentView: 'landing' | 'editor';
  onViewChange: (view: 'landing' | 'editor', section?: string) => void;
}

export const SiteNav: React.FC<SiteNavProps> = ({ currentView, onViewChange }) => {
  const [scrolled, setScrolled] = React.useState(false);
  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    if (currentView === 'landing') {
      window.addEventListener('scroll', handleScroll);
      handleScroll();
    } else {
        setScrolled(true);
    }
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const isSolidNav = scrolled || currentView === 'editor';
  const navClasses = `fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${ isSolidNav ? 'bg-[#1A1A1B]/90 backdrop-blur-sm shadow-lg border-b border-gray-800' : 'bg-transparent' }`;

  return (
    <nav className={navClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center" onClick={() => onViewChange('landing')} style={{cursor: 'pointer'}}>
            <div className="flex-shrink-0 flex items-center gap-2 text-white">
              <span dangerouslySetInnerHTML={{ __html: landingPageConfig.site.logoSvg.replace('className=', 'class=') }} />
              <span className="font-bold text-xl">{landingPageConfig.site.name}</span>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button onClick={() => onViewChange('editor')} className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${currentView === 'editor' ? 'bg-[#00FFA3] text-[#0F0F10]' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}>
                {landingPageConfig.nav.editorButtonText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
