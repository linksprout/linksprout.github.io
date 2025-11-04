import { NETLIFY_AFFILIATE_LINK, VERCEL_AFFILIATE_LINK } from './credentials';

// --- CONFIGURATION FILE FOR THE LANDING PAGE ---
// Edit the values in this file to quickly update the content on the landing page.

// Define types for config structure for better maintainability and autocomplete.
type Feature = { icon: string; title: string; };
type ComparisonValue = 'check' | 'cross' | 'partial';
type ComparisonFeature = { feature: string; values: ComparisonValue[]; };
type Partner = { name: string; link: string; icon: string; };
type HowItWorksStep = { icon: string; title: string; description: string; };
type Testimonial = { name: string; quote: string; image: string; };
type FAQ = { q: string; a: string; };
type FooterLink = { text: string; href: string; };

export interface LandingPageConfig {
  site: {
    name: string;
    logoSvg: string;
  };
  nav: {
    editorButtonText: string;
  };
  hero: {
    title: {
      part1: string;
      highlight: string;
    };
    subtitle: string;
    ctaButtonText: string;
  };
  keyFeatures: {
    title: string;
    features: Feature[];
  };
  comparison: {
    title: string;
    mobileTitle: string;
    headers: string[];
    features: ComparisonFeature[];
  };
  about: {
    title: string;
    description: string;
  };
  partners: {
    title: string;
    description: string;
    partners: Partner[];
  };
  howItWorks: {
    title: string;
    steps: HowItWorksStep[];
  };
  testimonials: {
    title: string;
    testimonials: Testimonial[];
  };
  faq: {
    title: string;
    faqs: FAQ[];
  };
  footer: {
    links: FooterLink[];
    affiliateNotice: string;
    copyrightText: string;
    madeWithText: string;
  };
}


export const landingPageConfig: LandingPageConfig = {
    site: {
        name: 'LinkSprout',
        logoSvg: '<svg class="h-8 w-8 text-[#00FFA3]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" xmlns="http://www.w3.org/2000/svg"><path d="M12 22 C 12 22 10 16 12 8"/><path d="M12 8 C 9 8 7 5 4 4"/><path d="M12 8 C 15 8 17 5 20 4"/></svg>'
    },
    nav: {
        editorButtonText: 'Editor'
    },
    hero: {
        title: {
            part1: 'Your Link-in-Bio,',
            highlight: 'Without Limits.'
        },
        subtitle: 'Build and deploy instantly — no logins, no subscriptions, no paywalls.',
        ctaButtonText: 'Start Building Free'
    },
    keyFeatures: {
        title: 'What Makes It Different',
        features: [
            { icon: '💸', title: '100% Free Forever' }, { icon: '🚫', title: 'No Logins or Paywalls' },
            { icon: '🌐', title: 'Deploy Anywhere' }, { icon: '🧩', title: 'Fully Customizable' },
            { icon: '⚡', title: 'Lightweight & Fast' }, { icon: '🧑‍💻', title: 'Exportable Code' },
        ]
    },
    comparison: {
        title: 'Feature Comparison',
        mobileTitle: 'Features',
        headers: ["Linktree", "Beacons", "Campsite.bio", "Carrd"],
        features: [
            { feature: 'Truly Free (no paywalls)', values: ['check', 'cross', 'cross', 'cross', 'partial'] },
            { feature: 'No Login Required', values: ['check', 'cross', 'cross', 'cross', 'cross'] },
            { feature: 'Open Deployment', values: ['check', 'cross', 'cross', 'cross', 'partial'] },
            { feature: 'Lightweight & Fast', values: ['check', 'partial', 'partial', 'partial', 'check'] },
            { feature: 'Fully Customizable', values: ['check', 'partial', 'partial', 'partial', 'check'] },
            { feature: 'Exportable Code', values: ['check', 'cross', 'cross', 'cross', 'partial'] },
            { feature: 'No Hidden Branding', values: ['check', 'cross', 'cross', 'cross', 'partial'] },
        ]
    },
    about: {
        title: 'Built for Creators and Makers',
        description: "This project's mission is rooted in openness, simplicity, and control. It's designed with a privacy-friendly philosophy: no data collection, no tracking, just pure creative freedom for you to build your corner of the internet."
    },
    partners: {
        title: 'Deploy Your Site Anywhere',
        description: 'Publish to free hosts, professional platforms, or your own server. You have full control.',
        partners: [
            { name: 'GitHub Pages', link: 'https://pages.github.com/', icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/github/github-original.svg' },
            { name: 'Netlify', link: NETLIFY_AFFILIATE_LINK, icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/netlify/netlify-original.svg' },
            { name: 'Vercel', link: VERCEL_AFFILIATE_LINK, icon: 'https://raw.githubusercontent.com/devicons/devicon/master/icons/vercel/vercel-original.svg' },
            { name: 'Self-Host', link: '#', icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHJlY3QgeD0iMiIgeT0iMiIgd2lkdGg9IjIwIiBoZWlnaHQ9IjgiIHJ4PSIyIiByeT0iMiIvPjxyZWN0IHg9IjIiIHk9IjE0IiB3aWR0aD0iMjAiIGhlaWdodD0iOCIgcng9IjIiByeT0iMiIvPjxsaW5lIHgxPSI2IiB5MT0iNiIgeDI9IjYiIHkyPSI2Ii8+PGxpbmUgeDE9IjYiIHkxPSIxOCIgeDI9IjYiIHkyPSIxOCIvPjwvc3ZnPg==' }
        ]
    },
    howItWorks: {
        title: 'How It Works',
        steps: [
            { icon: '✨', title: 'Add Elements', description: 'Choose from text, links, CTAs, embeds, and more.' },
            { icon: '✍️', title: 'Edit Inline', description: 'Use grab and pencil icons to style content directly.' },
            { icon: '👀', title: 'Preview Instantly', description: 'Real-time updates with a responsive preview.' },
            { icon: '🚀', title: 'Deploy Anywhere', description: 'Publish to a free host or export your code.' },
        ]
    },
    testimonials: {
        title: 'What People Are Saying',
        testimonials: [
            { name: 'Sarah L.', quote: "I replaced Linktree and now host my page on my own domain — for free. This is a game-changer!", image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=100&w=100'},
            { name: 'Mike R.', quote: "As a developer, being able to export the code is incredible. I can customize everything. 10/10.", image: 'https://images.unsplash.com/photo-1564564321837-a57b7070ac4f?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=100&w=100'},
            { name: 'Chloe T.', quote: "So simple and fast. I had my new page live in less than 10 minutes. No accounts, no hassle.", image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&q=80&fm=jpg&crop=faces&fit=crop&h=100&w=100'},
        ]
    },
    faq: {
        title: 'Frequently Asked Questions',
        faqs: [
            { q: "Do I need an account?", a: "No, you don't. Everything works directly in your browser without any login or signup required." },
            { q: "Is it really free?", a: "Yes, it's 100% free. There are no 'Pro' features or paywalls. All functionality is available to everyone by default." },
            { q: "Can I use my own domain?", a: "Absolutely. You can deploy your generated site to any hosting provider that supports static HTML, allowing you to use your own domain name." },
            { q: "Do you offer hosting?", a: "No, but you can deploy your site anywhere. We provide guides for free services like GitHub Pages and Netlify, or you can download the files and host them on your own server." },
            { q: "Can I self-host?", a: "Yes. You can download your site as a single HTML file or a complete zip package, ready to be hosted on your own server or any static hosting service." },
        ]
    },
    footer: {
        links: [
            { text: 'About', href: '#' },
            { text: 'GitHub', href: '#' },
            { text: 'Contact', href: '#' },
        ],
        affiliateNotice: "This page may contain affiliate links. If you use these links to sign up, we may earn a commission at no extra cost to you.",
        copyrightText: `© ${new Date().getFullYear()} LinkSprout. All Rights Reserved.`,
        madeWithText: 'Made with ❤️ in Porto'
    }
};
