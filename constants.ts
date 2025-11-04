import type { State, GeneratorType } from './types';

export const AVAILABLE_FONTS = [
  { name: 'Abril Fatface', family: "'Abril Fatface', cursive" },
  { name: 'Alfa Slab One', family: "'Alfa Slab One', cursive" },
  { name: 'Anton', family: "'Anton', sans-serif" },
  { name: 'Arvo', family: "'Arvo', serif" },
  { name: 'Bebas Neue', family: "'Bebas Neue', cursive" },
  { name: 'Bitter', family: "'Bitter', serif" },
  { name: 'Caveat', family: "'Caveat', cursive" },
  { name: 'Comfortaa', family: "'Comfortaa', cursive" },
  { name: 'Cousine', family: "'Cousine', monospace" },
  { name: 'Crimson Text', family: "'Crimson Text', serif" },
  { name: 'Dancing Script', family: "'Dancing Script', cursive" },
  { name: 'Exo 2', family: "'Exo 2', sans-serif" },
  { name: 'Fjalla One', family: "'Fjalla One', sans-serif" },
  { name: 'Indie Flower', family: "'Indie Flower', cursive" },
  { name: 'Inconsolata', family: "'Inconsolata', monospace" },
  { name: 'Inter', family: "'Inter', sans-serif" },
  { name: 'Josefin Sans', family: "'Josefin Sans', sans-serif" },
  { name: 'Lato', family: "'Lato', sans-serif" },
  { name: 'Lobster', family: "'Lobster', cursive" },
  { name: 'Lora', family: "'Lora', serif" },
  { name: 'Merriweather', family: "'Merriweather', serif" },
  { name: 'Montserrat', family: "'Montserrat', sans-serif" },
  { name: 'Mukta', family: "'Mukta', sans-serif" },
  { name: 'Nunito', family: "'Nunito', sans-serif" },
  { name: 'Open Sans', family: "'Open Sans', sans-serif" },
  { name: 'Oswald', family: "'Oswald', sans-serif" },
  { name: 'PT Sans', family: "'PT Sans', sans-serif" },
  { name: 'PT Serif', family: "'PT Serif', serif" },
  { name: 'Pacifico', family: "'Pacifico', cursive" },
  { name: 'Patrick Hand', family: "'Patrick Hand', cursive" },
  { name: 'Permanent Marker', family: "'Permanent Marker', cursive" },
  { name: 'Playfair Display', family: "'Playfair Display', serif" },
  { name: 'Poppins', family: "'Poppins', sans-serif" },
  { name: 'Quicksand', family: "'Quicksand', sans-serif" },
  { name: 'Raleway', family: "'Raleway', sans-serif" },
  { name: 'Righteous', family: "'Righteous', cursive" },
  { name: 'Roboto', family: "'Roboto', sans-serif" },
  { name: 'Roboto Mono', family: "'Roboto Mono', monospace" },
  { name: 'Roboto Slab', family: "'Roboto Slab', serif" },
  { name: 'Rubik', family: "'Rubik', sans-serif" },
  { name: 'Source Code Pro', family: "'Source Code Pro', monospace" },
  { name: 'Source Sans Pro', family: "'Source Sans Pro', sans-serif" },
  { name: 'Space Mono', family: "'Space Mono', monospace" },
  { name: 'Special Elite', family: "'Special Elite', cursive" },
  { name: 'Staatliches', family: "'Staatliches', cursive" },
  { name: 'Teko', family: "'Teko', sans-serif" },
  { name: 'Ubuntu', family: "'Ubuntu', sans-serif" },
  { name: 'Vollkorn', family: "'Vollkorn', serif" },
  { name: 'Work Sans', family: "'Work Sans', sans-serif" },
  { name: 'Yanone Kaffeesatz', family: "'Yanone Kaffeesatz', sans-serif" },
];

export const INITIAL_STATE: State = {
  appearance: {
    pageBackgroundConfig: {
      type: 'gradient',
      seed: 1,
      colors: ['rgba(209, 213, 219, 1)', 'rgba(156, 163, 175, 1)'],
      style: 'to bottom right',
    },
    cardBackgroundConfig: {
      type: 'gradient',
      seed: 2,
      colors: ['rgba(243, 244, 246, 1)', 'rgba(229, 231, 235, 1)'],
      style: 'to bottom right',
    },
    profileNameColor: 'rgba(31, 41, 55, 1)',
    profileDescriptionColor: 'rgba(31, 41, 55, 1)',
    buttonTextColor: 'rgba(31, 41, 55, 1)',
    buttonBgColor: 'rgba(255, 255, 255, 1)',
    fontFamily: "'Inter', sans-serif",
    buttonWidth: 70,
    appIconSize: 22,
    buttonFontSize: 12,
    buttonFontWeight: 'normal',
    buttonFontStyle: 'normal',
    buttonTextDecoration: 'none',
    profilePicSize: 136,
    profileNameFontSize: 22,
    profileDescriptionFontSize: 14,
    buttonAnimation: 'none',
    appAnimation: 'none',
    customFontFamily: null,
    customFontUrl: null,
    cardFadeIn: true,
    cardFadeInSpeed: 500,
    qrCodeColorDark: 'rgba(31, 41, 55, 1)',
    qrCodeColorLight: 'rgba(255, 255, 255, 1)',
    qrCodeSize: 128,
    footerEnabled: true,
    footerText: 'Built with <a href="https://linksprout.github.io" target="_blank" rel="noopener noreferrer" title="Create your own free page!"><u>LinkSprout</u></a> 🌱',
    footerFontSize: 14,
  },
  elements: [
    {
      type: 'profile', id: 'profile_1', picUrl: 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg',
      name: '@yourname', description: 'Welcome to my page! Check out my links below.', picShadow: 'shadow-md',
      nameFontWeight: 'normal', nameFontStyle: 'normal', nameTextDecoration: 'none',
      descriptionFontWeight: 'normal', descriptionFontStyle: 'normal', descriptionTextDecoration: 'none',
    },
    {
      type: 'buttonarray', id: 'buttonarray_1', buttons: [
        { id: 'btn_1', text: 'Personal Site', url: 'https://example.com', shadow: 'shadow-md', style: 'rounded-lg', icon: 'fa-solid fa-globe' },
        { id: 'btn_2', text: 'LinkedIn', url: 'https://linkedin.com', shadow: 'shadow-md', style: 'rounded-lg', icon: 'fa-brands fa-linkedin' },
        { id: 'btn_3', text: 'GitHub', url: 'https://github.com', shadow: 'shadow-md', style: 'rounded-lg', icon: 'fa-brands fa-github' },
      ]
    },
    {
      type: 'apps', id: 'apps_1', apps: [
        { id: 'app_fb', icon: 'fa-brands fa-facebook-f', url: 'https://facebook.com', bg: 'rgba(24, 119, 242, 1)', color: 'rgba(255,255,255,1)', shape: 'rounded-full' },
        { id: 'app_ig', icon: 'fa-brands fa-instagram', url: 'https://instagram.com', bg: 'rgba(193, 53, 132, 1)', color: 'rgba(255,255,255,1)', shape: 'rounded-full' },
        { id: 'app_wa', icon: 'fa-brands fa-whatsapp', url: 'https://wa.me/', bg: 'rgba(37, 211, 102, 1)', color: 'rgba(255,255,255,1)', shape: 'rounded-full' },
        { id: 'app_tt', icon: 'fa-brands fa-tiktok', url: 'https://tiktok.com', bg: 'rgba(0, 0, 0, 1)', color: 'rgba(255,255,255,1)', shape: 'rounded-full' }
      ]
    },
    {
      type: 'blocktext',
      id: 'blocktext_1',
      content: 'This is a text block. Use it to share a little more about yourself or your projects!',
      textColor: 'rgba(31, 41, 55, 1)',
      fontSize: 14,
      textAlign: 'center',
      bgColor: 'rgba(243, 244, 246, 0.5)',
      paddingY: 15,
      paddingX: 20,
      fontWeight: 'normal',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    {
      type: 'calltoaction',
      id: 'cta_1',
      text: 'Subscribe!',
      url: 'https://example.com/newsletter',
      bgColor: 'rgba(99, 102, 241, 1)',
      textColor: 'rgba(255, 255, 255, 1)',
      alignment: 'center',
      paddingY: 14,
      style: 'rounded-lg',
      shadow: 'shadow-lg',
      animation: 'hover-pulse',
      fontWeight: 'bold',
      fontStyle: 'normal',
      textDecoration: 'none',
    },
    {
      type: 'qrcode', id: 'qr_1', url: 'https://example.com'
    },
  ],
  randomizeSettings: {
    font: true,
    pageBackground: true,
    cardBackground: true,
    buttonStyle: true,
    buttonAnimation: true,
    appAnimation: true,
    pageWaves: true,
    cardWaves: true,
    buttonColors: true,
    qrCode: true,
    pwaIcon: true,
    appIcons: true,
  },
  pwaSettings: {
    enabled: true,
    iconType: 'generated',
    iconGeneratedConfig: {
      waves: true,
      bgColor1: 'rgba(99, 102, 241, 1)',
      bgColor2: 'rgba(168, 85, 247, 1)',
      letterColor: 'rgba(255, 255, 255, 1)',
      letter: '',
      fontFamily: "'Inter', sans-serif",
      complexity: 4,
      contrast: 1,
    },
    iconUrl: '',
    iconUploadUrl: null,
  },
  menuSettings: {
    enabled: true,
    iconColor: 'rgba(31, 41, 55, 1)',
    textColor: 'rgba(31, 41, 55, 1)',
    bgColor: 'rgba(255, 255, 255, 0.95)',
    iconSize: 20,
    itemFontSize: 14,
    itemIconSize: 14,
    items: [
      { id: 'menu_share_1', type: 'share', text: 'Share', icon: 'fa-solid fa-share-nodes', url: 'https://example.com' },
      { id: 'menu_install_1', type: 'install', text: 'Install App', icon: 'fa-solid fa-download' },
      { id: 'menu_link_1', type: 'link', text: 'About Me', icon: 'fa-solid fa-user', url: 'https://example.com/about' },
    ],
  },
};

export const GRADIENT_OPTIONS = [
  { value: 'to bottom right', text: 'Diagonal' },
  { value: 'to right', text: 'Left to Right' },
  { value: 'to bottom', text: 'Top to Bottom' },
  { value: 'circle at center', text: 'Radial' },
];

export const GENERATOR_OPTIONS: { value: GeneratorType, text: string }[] = [
    { value: 'gradient', text: 'Gradient' },
    { value: 'image', text: 'Image' },
    { value: 'layered-waves', text: 'Layered Waves' },
    { value: 'blob', text: 'Blob' },
    { value: 'blurry-gradient', text: 'Blurry Gradient' },
    { value: 'low-poly', text: 'Low Poly' },
];

export const SHADOW_OPTIONS = ['shadow-none', 'shadow-sm', 'shadow-md', 'shadow-lg'];
export const STYLE_OPTIONS: {value: 'rounded-lg' | 'rounded-full' | 'rounded-none', text: string}[] = [
    { value: 'rounded-lg', text: 'Rounded' },
    { value: 'rounded-full', text: 'Pill' },
    { value: 'rounded-none', text: 'Square' }
];

export const ICONS = [ { label: 'None', cls: '' }, { label: 'Link', cls: 'fa-solid fa-link' }, { label: 'Website', cls: 'fa-solid fa-globe' }, { label: 'Email', cls: 'fa-solid fa-envelope' }, { label: 'Phone', cls: 'fa-solid fa-phone' }, { label: 'Location', cls: 'fa-solid fa-location-dot' }, { label: 'Profile', cls: 'fa-solid fa-user' }, { label: 'Share', cls: 'fa-solid fa-share-nodes' }, { label: 'GitHub', cls: 'fa-brands fa-github' }, { label: 'LinkedIn', cls: 'fa-brands fa-linkedin' }, { label: 'Twitter / X', cls: 'fa-brands fa-x-twitter' }, { label: 'Instagram', cls: 'fa-brands fa-instagram' }, { label: 'Facebook', cls: 'fa-brands fa-facebook-f' }, { label: 'YouTube', cls: 'fa-brands fa-youtube' }, { label: 'Spotify', cls: 'fa-brands fa-spotify' }, { label: 'Star', cls: 'fa-solid fa-star' }, { label: 'Download', cls: 'fa-solid fa-download' }, { label: 'External', cls: 'fa-solid fa-arrow-up-right-from-square' }];

export const BUTTON_ANIMATIONS = [
  { value: 'none', text: 'None' },
  { value: 'hover-pulse', text: 'Pulse' },
  { value: 'hover-glow', text: 'Glow' },
  { value: 'hover-bounce', text: 'Bounce' },
];
export const APP_ANIMATIONS = [...BUTTON_ANIMATIONS];

export const BRAND_COLORS: { [key: string]: { bg: string; color: string } } = {
  'fa-brands fa-facebook-f': { bg: 'rgba(24, 119, 242, 1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-instagram': { bg: 'rgba(193, 53, 132, 1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-whatsapp': { bg: 'rgba(37, 211, 102, 1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-tiktok': { bg: 'rgba(0, 0, 0, 1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-twitter': { bg: 'rgba(29, 161, 242, 1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-x-twitter': { bg: 'rgba(17,24,39,1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-linkedin': { bg: 'rgba(10, 102, 194, 1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-github': { bg: 'rgba(51, 51, 51, 1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-youtube': { bg: 'rgba(255, 0, 0, 1)', color: 'rgba(255,255,255,1)' },
  'fa-brands fa-spotify': { bg: 'rgba(30, 215, 96, 1)', color: 'rgba(255,255,255,1)' },
};

export const STORAGE_KEY = 'interactive_sites_v5';