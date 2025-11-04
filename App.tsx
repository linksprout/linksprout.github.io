// Fix: Corrected the React import by removing 'aistudio' which was causing a syntax error and preventing hooks from being imported.
import React, { useState, useEffect, useMemo } from 'react';
import type { State } from './types';
import { demos } from './demos';
import { ADSENSE_CLIENT_ID, ADSENSE_SLOT_ID, BUY_ME_A_COFFEE_LINK, NETLIFY_AFFILIATE_LINK, VERCEL_AFFILIATE_LINK } from './credentials';
import { EditorPage } from './components/EditorPage';
import { SiteNav } from './components/SiteNav';
import { SiteCard } from './components/SiteCard';
import { register } from 'https://cdn.jsdelivr.net/npm/swiper@11/swiper-element-bundle.min.mjs';
import { landingPageConfig } from './landingPageConfig';

register();

// Fix: Add global JSX declarations for Swiper web components.
// This ensures TypeScript recognizes them as valid JSX elements across the application.
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'swiper-container': any;
      'swiper-slide': any;
    }
  }
}

// --- START LANDING PAGE COMPONENTS ---

const HeroSection: React.FC<{ onViewChange: (view: 'editor') => void; }> = ({ onViewChange }) => (
  <section className="relative pt-32 pb-20 text-center">
    <div className="max-w-4xl mx-auto px-4">
      <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white">{landingPageConfig.hero.title.part1} <span className="text-[#00FFA3]">{landingPageConfig.hero.title.highlight}</span></h1>
      <p className="mt-6 text-lg md:text-xl text-[#9A9A9A]">{landingPageConfig.hero.subtitle}</p>
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
        <button onClick={() => onViewChange('editor')} className="w-full sm:w-auto px-8 py-3 font-semibold rounded-2xl bg-[#00FFA3] text-[#0F0F10] transition-all duration-200 ease-in-out hover:scale-105 hover:bg-[#00CC88] btn-glow-on-hover">{landingPageConfig.hero.ctaButtonText}</button>
      </div>
    </div>
  </section>
);

const KeyFeaturesSection = () => {
    return (
        <section id="features-section" className="py-20">
            <div className="max-w-5xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-white">{landingPageConfig.keyFeatures.title}</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center">
                    {landingPageConfig.keyFeatures.features.map(f => <div key={f.title} className="p-4"><div className="text-4xl mb-3">{f.icon}</div><h3 className="text-lg font-semibold text-[#EAEAEA]">{f.title}</h3></div>)}
                </div>
            </div>
        </section>
    );
};

const ComparisonTableSection = () => {
    const Check = () => <span className="text-2xl" style={{color: '#00FFA3'}}>✅</span>;
    const Cross = () => <span className="text-2xl" style={{color: '#FF4C4C'}}>❌</span>;
    const Partial = () => <span className="text-2xl" style={{color: '#FFC107'}}>⚠️</span>;
    
    const renderValue = (value: 'check' | 'cross' | 'partial') => {
        switch(value) {
            case 'check': return <Check />;
            case 'cross': return <Cross />;
            case 'partial': return <Partial />;
        }
    };

    const { title, mobileTitle, headers, features } = landingPageConfig.comparison;

    return (
      <section id="comparison-section" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 text-white hidden md:block">{title}</h2>
          <h2 className="text-4xl font-bold text-center mb-12 text-white md:hidden">{mobileTitle}</h2>

          {/* Desktop Table */}
          <div className="hidden md:block">
            <div className="overflow-x-auto comparison-table hide-scrollbar">
                <div className="bg-[#1E1E20]/50 backdrop-blur-sm rounded-2xl shadow-lg p-1 min-w-[800px]">
                <table className="w-full table-fixed">
                    <thead>
                    <tr>
                        <th className="p-4 font-semibold text-lg w-1/3"></th>
                        <th className="p-4 font-semibold text-lg text-center text-[#00FFA3]">{landingPageConfig.site.name}</th>
                        {headers.map((h) => <th key={h} className="p-4 font-semibold text-lg text-center text-white">{h}</th>)}
                    </tr>
                    </thead>
                    <tbody>
                    {features.map(({ feature, values }) => (
                        <tr key={feature} className="border-t border-gray-700">
                        <td className="p-4 font-medium text-[#EAEAEA] text-right pr-6">{feature}</td>
                        {values.map((value, i) => <td key={i} className="p-4 text-center">{renderValue(value)}</td>)}
                        </tr>
                    ))}
                    </tbody>
                </table>
                </div>
            </div>
          </div>
          
          {/* Mobile List */}
          <div className="md:hidden space-y-4">
              {features.map(({ feature }) => (
                  <div key={feature} className="bg-[#1E1E20]/50 backdrop-blur-sm rounded-lg p-4 flex justify-between items-center">
                      <span className="font-medium text-[#EAEAEA]">{feature}</span>
                      <Check />
                  </div>
              ))}
          </div>

        </div>
      </section>
    );
};

const AboutSection = () => (
  <section id="about-section" className="py-20 bg-[#1E1E20]">
    <div className="max-w-4xl mx-auto px-4 text-center">
      <h2 className="text-4xl font-bold mb-4 text-white">{landingPageConfig.about.title}</h2>
      <p className="text-lg text-[#9A9A9A]">{landingPageConfig.about.description}</p>
    </div>
  </section>
);

const PartnersSection = () => {
    return (
    <section id="partners-section" className="py-20">
      <div className="max-w-5xl mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold mb-4 text-white">{landingPageConfig.partners.title}</h2>
        <p className="text-lg text-[#9A9A9A] mb-12">{landingPageConfig.partners.description}</p>
        <div className="flex justify-center items-center gap-12 flex-wrap">
            {landingPageConfig.partners.partners.map(p => (
                <a key={p.name} href={p.link} target="_blank" rel="noopener noreferrer" className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 flex flex-col items-center gap-2">
                    <img src={p.icon} alt={p.name} className="h-12" style={p.name !== 'Self-Host' ? {filter: 'brightness(0) invert(1)'} : {}} />
                    <span className="text-sm text-gray-400">{p.name}</span>
                </a>
            ))}
        </div>
      </div>
    </section>
    );
};

const HowItWorksSection = () => {
    return (
        <section id="how-it-works-section" className="py-20">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-white">{landingPageConfig.howItWorks.title}</h2>
                <div className="grid md:grid-cols-4 gap-8">
                    {landingPageConfig.howItWorks.steps.map(s => <div key={s.title} className="text-center p-4 rounded-xl bg-[#1E1E20]/30"><div className="text-4xl mb-3">{s.icon}</div><h3 className="text-lg font-semibold text-white mb-2">{s.title}</h3><p className="text-[#9A9A9A]">{s.description}</p></div>)}
                </div>
            </div>
        </section>
    )
};

const TestimonialsSection = () => {
    return (
        <section id="testimonials-section" className="py-20 bg-[#1E1E20]">
            <div className="max-w-6xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-white">{landingPageConfig.testimonials.title}</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {landingPageConfig.testimonials.testimonials.map(t => (<div key={t.name} className="p-6 rounded-xl bg-[#2a2a2b]"><p className="text-[#EAEAEA] mb-4">"{t.quote}"</p><div className="flex items-center"><img src={t.image} alt={t.name} className="w-12 h-12 rounded-full mr-4" /><span className="font-semibold text-white">{t.name}</span></div></div>))}
                </div>
            </div>
        </section>
    );
};

const FAQSection = () => {
    const [open, setOpen] = useState<number|null>(null);
    return (
        <section id="faq-section" className="py-20">
            <div className="max-w-3xl mx-auto px-4">
                <h2 className="text-4xl font-bold text-center mb-12 text-white">{landingPageConfig.faq.title}</h2>
                <div className="space-y-4">
                    {landingPageConfig.faq.faqs.map((f, i) => (<div key={i} className="bg-[#1E1E20]/50 rounded-lg"><button onClick={() => setOpen(open === i ? null : i)} className="w-full flex justify-between items-center p-5 text-left font-semibold text-white"><span className="text-lg">{f.q}</span><span className={`transform transition-transform duration-200 ${open === i ? 'rotate-180' : ''}`}>▼</span></button>{open === i && <div className="p-5 pt-0 text-[#9A9A9A]">{f.a}</div>}</div>))}
                </div>
            </div>
        </section>
    )
};


const SiteFooter = () => {
    const hasAffiliateLinks = useMemo(() => 
        NETLIFY_AFFILIATE_LINK !== 'https://www.netlify.com' || VERCEL_AFFILIATE_LINK !== 'https://vercel.com', 
    []);
    
    return (
        <footer className="bg-[#0A0A0A] py-8 text-center text-[#9A9A9A] text-sm">
            <div className="flex justify-center gap-6 mb-4">
                {landingPageConfig.footer.links.map(link => (
                    <a key={link.text} href={link.href} className="hover:text-white">{link.text}</a>
                ))}
            </div>
            {hasAffiliateLinks && (
                <p className="text-xs text-gray-500 max-w-2xl mx-auto mb-4 px-4">
                    {landingPageConfig.footer.affiliateNotice}
                </p>
            )}
            <p>{landingPageConfig.footer.copyrightText}</p>
            <p className="mt-2">{landingPageConfig.footer.madeWithText}</p>
        </footer>
    );
};

const LandingDemoCarousel: React.FC<{}> = () => {
    const swiperRef = React.useRef<any>(null);
    const randomizedDemos = useMemo(() => [...demos].sort(() => 0.5 - Math.random()), []);
    const demosForLoop = useMemo(() => [...randomizedDemos, ...randomizedDemos], [randomizedDemos]);

    useEffect(() => {
        const swiperContainer = swiperRef.current;
        if (!swiperContainer) return;

        const params = {
            loop: true,
            keyboard: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
            },
            slidesPerView: 1,
            spaceBetween: 24,
            centeredSlides: true,
            breakpoints: {
                768: {
                    slidesPerView: 2,
                    spaceBetween: 24,
                    centeredSlides: false,
                },
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                    centeredSlides: false,
                },
                1280: {
                    slidesPerView: 3,
                    spaceBetween: 24,
                    centeredSlides: false,
                }
            }
        };

        Object.assign(swiperContainer, params);
        swiperContainer.initialize();
    }, []);

    return (
        <section id="demos-section" className="pt-20 pb-10">
            <h2 className="text-4xl font-bold text-center mb-16 text-white">{landingPageConfig.testimonials.title}</h2>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
                <swiper-container ref={swiperRef} init="false">
                    {demosForLoop.map((demo, index) => (
                        <swiper-slide key={`${demo.name}-${index}`} className="py-2 relative hover:z-20">
                            <div className="w-[280px] h-[560px] mx-auto rounded-[40px] shadow-2xl ring-8 ring-gray-800 bg-gray-900 overflow-hidden transition-transform duration-300 hover:scale-[1.03] cursor-pointer">
                                <SiteCard state={demo.state} isEditable={false} hideFooter={true} />
                            </div>
                        </swiper-slide>
                    ))}
                </swiper-container>
                <div className="absolute inset-0 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, rgb(15, 15, 16) 0%, transparent 10%, transparent 90%, rgb(15, 15, 16) 100%)' }}></div>
            </div>
        </section>
    );
};

const NewLandingPage: React.FC<{ onViewChange: (view: 'editor') => void }> = ({ onViewChange }) => {
  return (
    <div className="bg-gradient-to-b from-[#0F0F10] to-[#1A1A1B] text-[#EAEAEA]">
      <main>
        <HeroSection onViewChange={onViewChange} />
        <LandingDemoCarousel />
        <KeyFeaturesSection />
        <ComparisonTableSection />
        <AboutSection />
        <PartnersSection />
        <HowItWorksSection />
        <TestimonialsSection />
        <FAQSection />
      </main>
      <SiteFooter />
    </div>
  )
};

export const AdBanner: React.FC = () => {
    useEffect(() => {
        if (ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID) {
            try {
                const script = document.createElement('script');
                script.src = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`;
                script.async = true;
                script.crossOrigin = 'anonymous';
                document.head.appendChild(script);

                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
                
                return () => {
                    document.head.removeChild(script);
                };
            } catch (e) {
                console.error('AdSense error:', e);
            }
        }
    }, []);

    if (ADSENSE_CLIENT_ID && ADSENSE_SLOT_ID) {
        return (
            <div className="text-center bg-gray-200 rounded-lg p-2 min-h-[100px] flex items-center justify-center">
                <ins className="adsbygoogle"
                     style={{ display: 'block', width: '100%' }}
                     data-ad-client={ADSENSE_CLIENT_ID}
                     data-ad-slot={ADSENSE_SLOT_ID}
                     data-ad-format="auto"
                     data-full-width-responsive="true"></ins>
            </div>
        );
    }

    return (
        <div className="p-4 text-center bg-amber-100 border border-amber-300 rounded-lg">
            <a href={BUY_ME_A_COFFEE_LINK} target="_blank" rel="noopener noreferrer" className="font-semibold text-amber-800 hover:underline">
                Enjoying this project? Buy me a coffee! ☕
            </a>
        </div>
    );
};


// --- END LANDING PAGE COMPONENTS ---

export const App: React.FC = () => {
    const [view, setView] = useState<'landing' | 'editor'>('landing');
    
    const handleViewChange = (newView: 'landing' | 'editor', section?: string) => {
        setView(newView);
        if (newView === 'landing' && section) {
            setTimeout(() => {
                document.getElementById(section)?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };
    
    useEffect(() => {
      const body = document.body;
      if (view === 'editor') {
          // The background is now controlled by the useEditorState hook
      } else {
        body.style.cssText = ''; // Reset body style for landing page
        body.style.fontFamily = "'Inter', sans-serif";
      }
    }, [view]);

    return (
        <>
            <SiteNav currentView={view} onViewChange={handleViewChange} />
            {view === 'landing' ? (
                <NewLandingPage onViewChange={() => setView('editor')} />
            ) : (
                <EditorPage />
            )}
        </>
    );
};