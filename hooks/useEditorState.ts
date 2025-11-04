import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import type { State, Element, EditingTarget, SavedSite, AppIcon, Appearance, Profile, QRCode, RandomizeSettings, PwaSettings, PwaIconGeneratedConfig, Apps, Button, ButtonArray, CallToAction, BlockText, GeneratorConfig, HaikeiWaveConfig, GeneratorType, Embed, MenuSettings, MenuItem } from '../types';
import { INITIAL_STATE, AVAILABLE_FONTS, STORAGE_KEY, BUTTON_ANIMATIONS, APP_ANIMATIONS, BRAND_COLORS } from '../constants';

declare const JSZip: any;

// --- UTILS ---
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) } : null;
};
const rgbToHex = (r: number, g: number, b: number): string => "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
const rgbaToHexA = (rgba: string): { hex: string; a: number } => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return { hex: '#000000', a: 1 };
    const [, r, g, b, a] = match;
    return { hex: rgbToHex(parseInt(r), parseInt(g), parseInt(b)), a: a !== undefined ? parseFloat(a) : 1 };
};
export const rgbaToHex = (rgba: string): string => rgbaToHexA(rgba).hex;
const getContrastingTextColor = (rgba: string): string => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    if (!match) return 'rgba(31, 41, 55, 1)';
    const [, r, g, b] = match;
    const brightness = (parseInt(r) * 299 + parseInt(g) * 587 + parseInt(b) * 114) / 1000;
    return brightness > 150 ? 'rgba(31, 41, 55, 1)' : 'rgba(248, 250, 252, 1)';
};
const createSeededRandom = (s: number) => () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
const generateHaikeiSVG = (config: GeneratorConfig, width = 1920, height = 1080): string => {
  const { seed } = config; const rand = createSeededRandom(seed);
  const toPath = (pts: {x:number, y:number}[], close: boolean = true) => {
      let d = `M ${pts[0].x},${pts[0].y}`;
      for (let i = 0; i < pts.length - 1; i++) {
          const p0 = pts[i-1] || pts[0]; const p1 = pts[i]; const p2 = pts[i+1]; const p3 = pts[i+2] || p2;
          const cp1x = p1.x + (p2.x - p0.x) / 6; const cp1y = p1.y + (p2.y - p0.y) / 6;
          const cp2x = p2.x - (p3.x - p1.x) / 6; const cp2y = p2.y - (p3.y - p1.y) / 6;
          d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${p2.x},${p2.y}`;
      }
      if(close) d += ` L ${width},${height} L 0,${height} Z`; return d;
  }
  let paths = '';
  const firstColor = 'colors' in config && config.colors && config.colors[0] ? config.colors[0] : 'rgba(255,255,255,1)';
  const bgRect = `<rect width="${width}" height="${height}" fill="${rgbaToHex(firstColor)}" fill-opacity="${rgbaToHexA(firstColor).a}" />`;
  switch(config.type) {
    case 'layered-waves':
      for (let i = 0; i < config.colors.length; i++) {
        const pts = [{ x: 0, y: (height / (config.colors.length + 1)) * (i + 1) * 0.8 }];
        for (let j = 1; j <= config.complexity; j++) pts.push({ x: (j / config.complexity) * width, y: pts[0].y + (rand() - 0.5) * height * config.contrast * 0.5 });
        pts.push({x: width, y: pts[0].y}); const { hex, a } = rgbaToHexA(config.colors[i]);
        paths += `<path d="${toPath(pts)}" fill="${hex}" fill-opacity="${a}" />`;
      } break;
    case 'blob':
      for (let i = 0; i < config.colors.length; i++) {
        const pts = []; const sides = config.complexity; const centerX = width/2; const centerY = height/2; const radius = Math.min(width, height) * 0.3 * (1 + (i*0.1));
        for(let j=0; j<sides; j++){ const angle = (j/sides) * Math.PI*2; const r = radius * (1 + (rand()-0.5) * config.contrast); pts.push({x: centerX + Math.cos(angle)*r, y: centerY + Math.sin(angle)*r}); }
        pts.push(pts[0]); const { hex, a } = rgbaToHexA(config.colors[i]);
        paths += `<path d="${toPath(pts)}" fill="${hex}" fill-opacity="${a}" />`;
      } break;
    case 'blurry-gradient':
      paths += `<defs><filter id="blur-filter"><feGaussianBlur stdDeviation="${config.contrast * 50}" /></filter></defs>`;
      for (let i = 0; i < config.colors.length; i++) {
        const cx = rand() * width; const cy = rand() * height; const r = (rand() * 0.2 + 0.2) * Math.min(width, height) * (config.complexity/5);
        const { hex, a } = rgbaToHexA(config.colors[i]);
        paths += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${hex}" fill-opacity="${a}" filter="url(#blur-filter)" />`;
      } break;
    case 'low-poly':
        const points = []; const cols = config.complexity; const rows = Math.round(cols * (height/width));
        for(let i=0; i<=rows; i++) { for(let j=0; j<=cols; j++) { points.push({ x: (j/cols)*width + (rand()-0.5)*width/cols*config.contrast, y: (i/rows)*height + (rand()-0.5)*height/rows*config.contrast }); } }
        for(let i=0; i<rows; i++) {
            for(let j=0; j<cols; j++) {
                const p1 = points[i*(cols+1) + j]; const p2 = points[i*(cols+1) + j+1]; const p3 = points[(i+1)*(cols+1) + j]; const p4 = points[(i+1)*(cols+1) + j+1];
                const color1 = config.colors[Math.floor(rand()*config.colors.length)]; const color2 = config.colors[Math.floor(rand()*config.colors.length)];
                paths += `<polygon points="${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y}" fill="${rgbaToHex(color1)}" fill-opacity="${rgbaToHexA(color1).a}" />`;
                paths += `<polygon points="${p2.x},${p2.y} ${p4.x},${p4.y} ${p3.x},${p3.y}" fill="${rgbaToHex(color2)}" fill-opacity="${rgbaToHexA(color2).a}" />`;
            }
        } break;
  } return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">${bgRect}${paths}</svg>`;
};
export const getBackgroundValue = (config: GeneratorConfig): string => {
    switch(config.type) {
        case 'gradient': return `linear-gradient(${config.style}, ${config.colors[0]}, ${config.colors[1]})`;
        case 'image': return `url('${config.url}')`;
        case 'layered-waves': case 'blob': case 'blurry-gradient': case 'low-poly':
          const svg = generateHaikeiSVG(config); return `url('data:image/svg+xml;base64,${btoa(svg)}')`;
        default: return 'none';
    }
};

const svgToPngBlob = (svgString: string, width: number, height: number): Promise<Blob | null> => {
    return new Promise((resolve) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');

        img.onload = () => {
            if (ctx) {
                ctx.drawImage(img, 0, 0, width, height);
                canvas.toBlob(resolve, 'image/png');
            } else {
                resolve(null);
            }
        };
        img.onerror = () => {
            resolve(null);
        };
        img.src = 'data:image/svg+xml;base64,' + btoa(svgString);
    });
};


export const useEditorState = () => {
    const [state, setState] = useState<State>(INITIAL_STATE);
    const [editingTarget, setEditingTarget] = useState<EditingTarget | null>(null);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
    const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [shareUrl, setShareUrl] = useState('');
    const [savedSites, setSavedSites] = useState<SavedSite[]>([]);
    const [installPromptEvent, setInstallPromptEvent] = useState<any>(null);

    const draggedItem = useRef<Element | null>(null);
    const dragOverItem = useRef<Element | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const customFontStyleRef = useRef<HTMLStyleElement | null>(null);

    const profileNameFirstLetter = useMemo(() => {
        const profile = state.elements.find(el => el.type === 'profile') as Profile | undefined;
        return profile?.name?.[0]?.toUpperCase() ?? 'L';
    }, [state.elements]);
    
    const generatePwaIconSVG = useCallback((config: PwaIconGeneratedConfig, letter: string, size: number = 512): string => {
        const svgConfig: HaikeiWaveConfig = {
            type: 'layered-waves',
            seed: Date.now(),
            complexity: config.complexity,
            contrast: config.contrast,
            colors: [config.bgColor1, config.bgColor2]
        };
        const wavesSvg = generateHaikeiSVG(svgConfig, size, size);
        const textYPos = size / 2 + size / 16;
        const fontSize = size * 0.6;
        const textElement = `<text x="50%" y="${textYPos}" dominant-baseline="middle" text-anchor="middle" font-size="${fontSize}" fill="${config.letterColor}" font-family="${config.fontFamily}" font-weight="bold">${letter}</text>`;
        return config.waves
            ? wavesSvg.replace('</svg>', `${textElement}</svg>`)
            : `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg"><rect width="${size}" height="${size}" fill="${config.bgColor1}" />${textElement}</svg>`;
    }, []);

    const randomizeAll = useCallback(() => {
        setState(currentState => {
            const { randomizeSettings } = currentState; const newAppearance = { ...currentState.appearance };
            let newElements = JSON.parse(JSON.stringify(currentState.elements)); const newPwaSettings = JSON.parse(JSON.stringify(currentState.pwaSettings));
            const newMenuSettings = JSON.parse(JSON.stringify(currentState.menuSettings));
            const hslToRgba = (h: number, s: number, l: number, a: number = 1) => { s /= 100; l /= 100; let c = (1 - Math.abs(2 * l - 1)) * s, x = c * (1 - Math.abs(((h / 60) % 2) - 1)), m = l - c / 2, r = 0, g = 0, b = 0; if (0 <= h && h < 60) { [r, g, b] = [c, x, 0]; } else if (60 <= h && h < 120) { [r, g, b] = [x, c, 0]; } else if (120 <= h && h < 180) { [r, g, b] = [0, c, x]; } else if (180 <= h && h < 240) { [r, g, b] = [0, x, c]; } else if (240 <= h && h < 300) { [r, g, b] = [x, 0, c]; } else if (300 <= h && h < 360) { [r, g, b] = [c, 0, x]; } return `rgba(${Math.round((r+m)*255)},${Math.round((g+m)*255)},${Math.round((b+m)*255)},${a.toFixed(2)})`; };
            const generateAestheticPalette = () => { const isDarkMode = Math.random() > 0.5; const baseHue = Math.floor(Math.random() * 360); const randomAlpha = () => 0.8 + Math.random() * 0.2; const randomSaturation = () => 40 + Math.random() * 40; const randomLightness = (isDark: boolean) => isDark ? 10 + Math.random() * 15 : 85 + Math.random() * 10; const pageHue1 = baseHue; const pageLightness1 = randomLightness(isDarkMode); const pageBg1 = hslToRgba(pageHue1, randomSaturation(), pageLightness1, randomAlpha()); const hueShift = 25 + Math.random() * 25; const pageHue2 = (pageHue1 + (Math.random() > 0.5 ? hueShift : -hueShift) + 360) % 360; const lightnessShift = 8 + Math.random() * 8; const pageLightness2 = Math.min(100, Math.max(0, pageLightness1 + (Math.random() > 0.5 ? lightnessShift : -lightnessShift))); const pageBg2 = hslToRgba(pageHue2, randomSaturation(), pageLightness2, randomAlpha()); const cardHue1 = (baseHue + 30 + Math.random() * 30) % 360; const cardLightness1 = isDarkMode ? 15 + Math.random() * 10 : 90 + Math.random() * 5; const cardBg1 = hslToRgba(cardHue1, randomSaturation() / 2, cardLightness1, randomAlpha()); const cardHue2 = (cardHue1 + (Math.random() > 0.5 ? 20 + Math.random() * 20 : -(20 + Math.random()*20)) + 360) % 360; const cardLightness2 = Math.min(100, Math.max(0, cardLightness1 + (Math.random() > 0.5 ? -(5 + Math.random()*5) : (5+Math.random()*5)))); const cardBg2 = hslToRgba(cardHue2, randomSaturation() / 2, cardLightness2, randomAlpha()); const textColor = isDarkMode ? 'rgba(248, 250, 252, 1)' : 'rgba(15, 23, 42, 1)'; const accentColor = hslToRgba((baseHue + 150 + Math.random() * 60) % 360, 75 + Math.random() * 20, 50 + Math.random() * 10, 0.95); return { pageBg1, pageBg2, cardBg1, cardBg2, textColor, accentColor }; };
            const pal = generateAestheticPalette();
            if (randomizeSettings.pageBackground) {
                const availableTypes: GeneratorType[] = ['gradient', 'layered-waves', 'blob', 'blurry-gradient', 'low-poly']; const newType = availableTypes[Math.floor(Math.random() * availableTypes.length)]; let newConfig: GeneratorConfig; const seed = Date.now();
                switch(newType) {
                    case 'layered-waves': newConfig = { type: 'layered-waves', seed, complexity: 3 + Math.floor(Math.random() * 8), contrast: 0.4 + Math.random() * 0.8, colors: [pal.pageBg1, pal.pageBg2, pal.cardBg1].sort(() => 0.5 - Math.random()) }; break;
                    case 'blob': newConfig = { type: 'blob', seed, complexity: 2 + Math.floor(Math.random() * 5), contrast: 0.5 + Math.random() * 0.5, colors: [pal.pageBg1, pal.pageBg2] }; break;
                    case 'blurry-gradient': newConfig = { type: 'blurry-gradient', seed, complexity: 2 + Math.floor(Math.random() * 4), contrast: 0.8 + Math.random() * 0.5, colors: [pal.pageBg1, pal.pageBg2, pal.cardBg1].sort(() => 0.5 - Math.random()) }; break;
                    case 'low-poly': newConfig = { type: 'low-poly', seed, complexity: 4 + Math.floor(Math.random() * 8), contrast: 0.4 + Math.random() * 0.6, colors: [pal.pageBg1, pal.pageBg2, pal.cardBg1].sort(() => 0.5 - Math.random()) }; break;
                    default: newConfig = { type: 'gradient', seed, colors: [pal.pageBg1, pal.pageBg2], style: ['to bottom right', 'to right', 'to bottom'][Math.floor(Math.random()*3)] }; break;
                } newAppearance.pageBackgroundConfig = newConfig;
            }
            if (randomizeSettings.cardBackground) { const newType = ['gradient', 'layered-waves', 'blob', 'low-poly'][Math.floor(Math.random()*4)] as GeneratorType; let newConfig: GeneratorConfig; const seed = Date.now() + 1; switch(newType) { case 'layered-waves': newConfig = { type: 'layered-waves', seed, complexity: 2 + Math.floor(Math.random() * 5), contrast: 0.2 + Math.random() * 0.5, colors: [pal.cardBg1, pal.cardBg2, pal.pageBg1].sort(() => 0.5 - Math.random()) }; break; default: newConfig = { type: 'gradient', seed, colors: [pal.cardBg1, pal.cardBg2], style: ['to bottom right', 'to right', 'to bottom'][Math.floor(Math.random()*3)] }; break; } newAppearance.cardBackgroundConfig = newConfig; newAppearance.profileNameColor = pal.textColor; newAppearance.profileDescriptionColor = pal.textColor; newMenuSettings.iconColor = pal.textColor; newMenuSettings.textColor = pal.textColor; }
            if (randomizeSettings.font) { newAppearance.fontFamily = AVAILABLE_FONTS[Math.floor(Math.random() * AVAILABLE_FONTS.length)].family; newAppearance.customFontFamily = null; newAppearance.customFontUrl = null; }
            if (randomizeSettings.buttonStyle) { const commonStyle = ['rounded-lg', 'rounded-full', 'rounded-none'][Math.floor(Math.random() * 3)] as 'rounded-lg' | 'rounded-full' | 'rounded-none'; newElements.forEach((el: Element) => { if (el.type === 'buttonarray') (el as ButtonArray).buttons.forEach(btn => btn.style = commonStyle); }); }
            if (randomizeSettings.buttonColors) { newAppearance.buttonBgColor = pal.accentColor; newAppearance.buttonTextColor = getContrastingTextColor(pal.accentColor); }
            if (randomizeSettings.qrCode) { const textColorIsLightMatch = pal.textColor.match(/rgba?\((\d+)/); if(textColorIsLightMatch) { const brightness = parseInt(textColorIsLightMatch[1]); const textColorIsLight = brightness > 128; newAppearance.qrCodeColorDark = textColorIsLight ? 'rgba(31, 41, 55, 1)' : pal.textColor; newAppearance.qrCodeColorLight = pal.cardBg1.replace(/, [\d\.]+\)$/, ', 0)'); } }
            if (randomizeSettings.pwaIcon) { newPwaSettings.iconGeneratedConfig.bgColor1 = pal.pageBg1; newPwaSettings.iconGeneratedConfig.bgColor2 = pal.cardBg1; newPwaSettings.iconGeneratedConfig.letterColor = getContrastingTextColor(pal.pageBg1); newPwaSettings.iconGeneratedConfig.waves = Math.random() > 0.3; }
            if (randomizeSettings.appIcons) { newElements.forEach((el: Element) => { if (el.type === 'apps') (el as Apps).apps.forEach(app => { const b = BRAND_COLORS[app.icon]; app.bg = b ? b.bg : 'rgba(17,24,39,1)'; app.color = b ? b.color : '#fff'; }); }); }
            if (randomizeSettings.buttonAnimation) newAppearance.buttonAnimation = BUTTON_ANIMATIONS[Math.floor(Math.random() * BUTTON_ANIMATIONS.length)].value;
            if (randomizeSettings.appAnimation) newAppearance.appAnimation = APP_ANIMATIONS[Math.floor(Math.random() * APP_ANIMATIONS.length)].value;
            return { ...currentState, appearance: newAppearance, elements: newElements, pwaSettings: newPwaSettings, menuSettings: newMenuSettings };
        });
    }, []);

    const loadSites = useCallback(() => { const data = localStorage.getItem(STORAGE_KEY); if (data) { try { const sites = JSON.parse(data); if (Array.isArray(sites)) { setSavedSites(sites); } } catch (e) { console.error("Failed to parse saved sites", e); localStorage.removeItem(STORAGE_KEY); } } }, []);

    useEffect(() => {
        const data = localStorage.getItem(STORAGE_KEY);
        if (data) {
            try {
                const sites: SavedSite[] = JSON.parse(data);
                if (Array.isArray(sites)) {
                    setSavedSites(sites);
                    if (sites.length > 0) {
                        setState(sites[sites.length - 1].state);
                    }
                }
            } catch (e) {
                console.error("Failed to parse saved sites from localStorage", e);
                localStorage.removeItem(STORAGE_KEY);
            }
        } else {
            randomizeAll();
        }
    }, [randomizeAll]);

    useEffect(() => {
        const handleBeforeInstallPrompt = (e: Event) => {
            e.preventDefault();
            setInstallPromptEvent(e);
        };
        window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }, []);

    const pageBgValue = useMemo(() => getBackgroundValue(state.appearance.pageBackgroundConfig), [state.appearance.pageBackgroundConfig]);
    useEffect(() => {
        const body = document.body;
        body.style.backgroundImage = pageBgValue;
        body.style.backgroundSize = 'cover';
        body.style.backgroundPosition = 'center';
        body.style.backgroundRepeat = 'no-repeat';
        body.style.backgroundAttachment = 'fixed';
    }, [pageBgValue]);

    useEffect(() => { const { customFontFamily, customFontUrl } = state.appearance; if (customFontFamily && customFontUrl) { if (!customFontStyleRef.current) { const styleEl = document.createElement('style'); document.head.appendChild(styleEl); customFontStyleRef.current = styleEl; } customFontStyleRef.current.innerHTML = `@font-face { font-family: '${customFontFamily}'; src: url('${customFontUrl}'); }`; } else if (customFontStyleRef.current) { customFontStyleRef.current.innerHTML = ''; } }, [state.appearance.customFontFamily, state.appearance.customFontUrl]);

    useEffect(() => { if (editingTarget && 'type' in editingTarget && editingTarget.type !== 'settings' && editingTarget.type !== 'footer' && editingTarget.type !== 'menu') { const currentElementInState = state.elements.find(e => e.id === editingTarget.id); if (currentElementInState) { if (JSON.stringify(currentElementInState) !== JSON.stringify(editingTarget)) { setEditingTarget(currentElementInState); } } else { setEditingTarget(null); } } }, [state.elements, editingTarget]);

    useEffect(() => {
        if (!state.pwaSettings.enabled) return;
        
        const profileEl = state.elements.find(e => e.type === 'profile') as Profile | undefined;
        const appName = profileEl ? `${profileEl.name}'s Links` : 'My Links';

        const getIconUrl = (size: number) => {
             return state.pwaSettings.iconType === 'generated'
                ? `data:image/svg+xml;base64,${btoa(generatePwaIconSVG(state.pwaSettings.iconGeneratedConfig, profileNameFirstLetter, size))}`
                : state.pwaSettings.iconType === 'upload' ? state.pwaSettings.iconUploadUrl : state.pwaSettings.iconUrl;
        }

        const manifest = {
            "name": appName,
            "short_name": profileEl?.name ?? "Links",
            "start_url": ".",
            "display": "standalone",
            "background_color": rgbaToHex(state.pwaSettings.iconGeneratedConfig.bgColor1),
            "theme_color": rgbaToHex(state.pwaSettings.iconGeneratedConfig.bgColor1),
            "description": profileEl?.description ?? "My personal links page.",
            "icons": [192, 512].map(size => ({ "src": getIconUrl(size) || '', "sizes": `${size}x${size}`, "type": "image/png" }))
        };
        
        const manifestUrl = `data:application/manifest+json;base64,${btoa(JSON.stringify(manifest))}`;
        
        let manifestLink = document.querySelector<HTMLLinkElement>('link[rel="manifest"]');
        if (!manifestLink) {
            manifestLink = document.createElement('link');
            manifestLink.rel = 'manifest';
            document.head.appendChild(manifestLink);
        }
        manifestLink.href = manifestUrl;
        
        let appleTouchIconLink = document.querySelector<HTMLLinkElement>('link[rel="apple-touch-icon"]');
        if (!appleTouchIconLink) {
            appleTouchIconLink = document.createElement('link');
            appleTouchIconLink.rel = 'apple-touch-icon';
            document.head.appendChild(appleTouchIconLink);
        }
        appleTouchIconLink.href = getIconUrl(192) || '';

    }, [state.pwaSettings, state.elements, profileNameFirstLetter, generatePwaIconSVG]);


    const handleUpdateAppearance = (prop: keyof Appearance, value: any) => setState(s => ({ ...s, appearance: { ...s.appearance, [prop]: value } }));
    const handleUpdateBackgroundConfig = (target: 'page' | 'card', newConfig: GeneratorConfig) => { const key = target === 'page' ? 'pageBackgroundConfig' : 'cardBackgroundConfig'; setState(s => ({ ...s, appearance: { ...s.appearance, [key]: newConfig }})); };
    const handleUpdateRandomizeSetting = (prop: keyof RandomizeSettings, value: boolean) => setState(s => ({...s, randomizeSettings: {...s.randomizeSettings, [prop]: value}}));
    const handleUpdatePwaSettings = (prop: keyof PwaSettings, value: any) => setState(s => ({...s, pwaSettings: {...s.pwaSettings, [prop]: value}}));
    const handleUpdatePwaIconConfig = (prop: keyof PwaIconGeneratedConfig, value: any) => setState(s => ({...s, pwaSettings: {...s.pwaSettings, iconGeneratedConfig: {...s.pwaSettings.iconGeneratedConfig, [prop]: value}}}));
    const handlePwaIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => { const file = e.target.files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { if (reader.result) handleUpdatePwaSettings('iconUploadUrl', reader.result as string); }; reader.readAsDataURL(file); };
    const handleUploadCustomFont = (fontFamily: string, fontUrl: string) => setState(s => ({...s, appearance: {...s.appearance, fontFamily, customFontFamily: fontFamily, customFontUrl: fontUrl }}));
    
    const handleAddElement = (type: 'buttonarray' | 'apps' | 'qrcode' | 'calltoaction' | 'blocktext' | 'embed') => {
        let newElement: Element;
        const id = `${type}_${Date.now()}`;
        switch (type) {
            case 'calltoaction': newElement = { type: 'calltoaction', id, text: 'Click Me!', url: 'https://', bgColor: state.appearance.buttonBgColor, textColor: state.appearance.buttonTextColor, alignment: 'center', paddingY: 12, style: 'rounded-lg', shadow: 'shadow-md', animation: 'none', fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' }; break;
            case 'blocktext': newElement = { type: 'blocktext', id, content: 'This is a new text block. You can edit this content.', textColor: state.appearance.profileDescriptionColor, fontSize: 14, textAlign: 'left', bgColor: 'rgba(0,0,0,0)', paddingY: 10, paddingX: 10, fontWeight: 'normal', fontStyle: 'normal', textDecoration: 'none' }; break;
            case 'apps': newElement = { type: 'apps', id: 'apps_' + Date.now(), apps: [{ id: 'app_' + Date.now(), icon: 'fa-solid fa-star', url: 'https://', bg: 'rgba(17,24,39,1)', color: 'rgba(255,255,255,1)', shape: 'rounded-full' }]}; break;
            case 'qrcode': newElement = { type: 'qrcode', id: 'qr_' + Date.now(), url: 'https://example.com' }; break;
            case 'embed': newElement = { type: 'embed', id, content: '<!-- Paste your embed code here -->\n<iframe width="100%" height="315" src="https://www.youtube.com/embed/dQw4w9WgXcQ" frameborder="0" allowfullscreen></iframe>', paddingY: 0, paddingX: 0, shadow: 'shadow-none', borderWidth: 0, borderColor: 'rgba(0,0,0,0)', borderRadius: 8 }; break;
            default: newElement = { type: 'buttonarray', id: id, buttons: [{ id: 'btn_' + Date.now(), text: 'New Button', url: 'https://', shadow: 'shadow-md', style: 'rounded-lg', icon: 'fa-solid fa-link' }] }; break;
        }
        setState(s => ({ ...s, elements: [...s.elements, newElement] }));
        setIsAddModalOpen(false);
        setEditingTarget(newElement);
    };

    const handleUpdateElement = (id: string, prop: string, value: any) => { setState(s => ({...s, elements: s.elements.map(el => el.id === id ? { ...el, [prop]: value } : el)})); if(editingTarget?.id === id) setEditingTarget(t => t ? ({...t, [prop]: value}) as Element : null); };
    const handleRemoveElement = (id: string) => { setState(s => ({ ...s, elements: s.elements.filter(el => el.id !== id) })); setEditingTarget(null); };
    
    const handleUpdateApp = (elementId: string, appIndex: number, prop: keyof AppIcon, value: any) => { setState(s => ({ ...s, elements: s.elements.map(el => { if (el.id === elementId && el.type === 'apps') { const newApps = [...(el as Apps).apps]; newApps[appIndex] = { ...newApps[appIndex], [prop]: value }; if (prop === 'icon' && BRAND_COLORS[value as string]) { newApps[appIndex].bg = BRAND_COLORS[value as string].bg; newApps[appIndex].color = BRAND_COLORS[value as string].color; } return { ...el, apps: newApps }; } return el; }) })); };
    const handleRemoveApp = (elementId: string, appIndex: number) => { setState(s => ({ ...s, elements: s.elements.map(el => { if (el.id === elementId && el.type === 'apps') { const newApps = (el as Apps).apps.filter((_, i) => i !== appIndex); return { ...el, apps: newApps }; } return el; }) })); };
    const handleAddApp = (elementId: string) => { setState(s => ({ ...s, elements: s.elements.map(el => { if (el.id === elementId && el.type === 'apps' && (el as Apps).apps.length < 4) { const newApp: AppIcon = { id: 'app_' + Date.now(), icon: 'fa-solid fa-star', url: 'https://', bg: 'rgba(17,24,39,1)', color: 'rgba(255,255,255,1)', shape: 'rounded-full' }; return { ...el, apps: [...(el as Apps).apps, newApp] }; } return el; }) })); };
    const handleUpdateButtonInArray = (elementId: string, buttonId: string, prop: keyof Button, value: any) => { setState(s => ({ ...s, elements: s.elements.map(el => { if (el.id === elementId && el.type === 'buttonarray') { const newButtons = (el as ButtonArray).buttons.map(btn => btn.id === buttonId ? { ...btn, [prop]: value } : btn); return { ...el, buttons: newButtons }; } return el; }) })); };
    const handleRemoveButtonFromArray = (elementId: string, buttonId: string) => { setState(s => ({ ...s, elements: s.elements.map(el => { if (el.id === elementId && el.type === 'buttonarray') { return { ...el, buttons: (el as ButtonArray).buttons.filter(b => b.id !== buttonId) }; } return el; }) })); };
    const handleAddButtonToArray = (elementId: string) => { setState(s => ({ ...s, elements: s.elements.map(el => { if (el.id === elementId && el.type === 'buttonarray') { const newButton: Button = { id: 'btn_' + Date.now(), text: 'New Button', url: 'https://', shadow: 'shadow-md', style: 'rounded-lg', icon: 'fa-solid fa-link' }; return { ...el, buttons: [...(el as ButtonArray).buttons, newButton] }; } return el; }) })); };

    const handleUpdateMenuSettings = (prop: keyof MenuSettings, value: any) => setState(s => ({...s, menuSettings: {...s.menuSettings, [prop]: value}}));
    const handleAddMenuItem = () => {
        const newItem: MenuItem = { id: `menu_${Date.now()}`, type: 'link', text: 'New Link', url: 'https://', icon: 'fa-solid fa-link' };
        setState(s => ({...s, menuSettings: {...s.menuSettings, items: [...s.menuSettings.items, newItem] }}));
    };
    const handleUpdateMenuItem = (itemId: string, prop: keyof MenuItem, value: any) => {
        setState(s => ({ ...s, menuSettings: { ...s.menuSettings, items: s.menuSettings.items.map(item => item.id === itemId ? {...item, [prop]: value} : item) } }));
    };
    const handleRemoveMenuItem = (itemId: string) => {
        setState(s => ({ ...s, menuSettings: { ...s.menuSettings, items: s.menuSettings.items.filter(item => item.id !== itemId) } }));
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, el: Element) => { draggedItem.current = el; setIsDragging(true); };
    const handleDragEnter = (e: React.DragEvent<HTMLDivElement>, el: Element) => { if (draggedItem.current?.type !== 'profile' && el.type !== 'profile') { dragOverItem.current = el; } };
    const handleDragEnd = () => { if (draggedItem.current && dragOverItem.current) { const newElements = [...state.elements]; const dragItemIndex = newElements.findIndex(el => el.id === draggedItem.current!.id); const dragOverItemIndex = newElements.findIndex(el => el.id === dragOverItem.current!.id); if (dragItemIndex !== -1 && dragOverItemIndex !== -1) { newElements.splice(dragItemIndex, 1); newElements.splice(dragOverItemIndex, 0, draggedItem.current); setState(s => ({ ...s, elements: newElements })); } } draggedItem.current = null; dragOverItem.current = null; setIsDragging(false); };

    const handleLoadSite = (id: number) => { const site = savedSites.find(s => s.id === id); if (site) { setState(site.state); setIsLoadModalOpen(false); } };
    const handleSaveSite = (name: string) => { const newSite = { id: Date.now(), name, state }; let updatedSites; const existingSiteIndex = savedSites.findIndex(site => site.name === name); if (existingSiteIndex !== -1) { updatedSites = savedSites.map((site, index) => index === existingSiteIndex ? { ...site, state } : site); } else { updatedSites = [...savedSites, newSite]; } setSavedSites(updatedSites); localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSites)); setIsSaveModalOpen(false); };
    const handleDeleteSite = (id: number) => { const updatedSites = savedSites.filter(s => s.id !== id); setSavedSites(updatedSites); localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSites)); };

    const generateHtml = useCallback((options?: { useLocalAssets?: boolean, inlineManifest?: boolean }): string => {
        const { useLocalAssets = false, inlineManifest = false } = options || {};
        const pageBgVal = getBackgroundValue(state.appearance.pageBackgroundConfig);
        const cardBgVal = getBackgroundValue(state.appearance.cardBackgroundConfig);
        const fontName = state.appearance.customFontFamily || state.appearance.fontFamily.split(',')[0].replace(/'/g, '');
        const profileEl = state.elements.find(e => e.type === 'profile') as Profile | undefined;
        const appName = profileEl ? `${profileEl.name}'s Links` : 'My Links';
        const shadowMap: { [key: string]: string } = { 'shadow-sm': '0 1px 2px 0 rgb(0 0 0 / 0.05)', 'shadow-md': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)', 'shadow-lg': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)', 'shadow-none': 'none' };

        let pwaHeadTags = '';
        if (state.pwaSettings.enabled) {
            const getIconUrl = (size: number) => {
                if (useLocalAssets) return `icon-${size}.png`;
                return state.pwaSettings.iconType === 'generated'
                    ? `data:image/svg+xml;base64,${btoa(generatePwaIconSVG(state.pwaSettings.iconGeneratedConfig, profileNameFirstLetter, size))}`
                    : state.pwaSettings.iconType === 'upload' ? state.pwaSettings.iconUploadUrl : state.pwaSettings.iconUrl;
            };

            const manifest = {
                "name": appName, "short_name": profileEl?.name ?? "Links", "start_url": ".", "display": "standalone", "background_color": rgbaToHex(state.pwaSettings.iconGeneratedConfig.bgColor1), "theme_color": rgbaToHex(state.pwaSettings.iconGeneratedConfig.bgColor1), "description": profileEl?.description ?? "My personal links page.",
                "icons": [192, 512].map(size => ({ "src": getIconUrl(size) || '', "sizes": `${size}x${size}`, "type": "image/png" }))
            };

            const manifestUrl = inlineManifest ? `data:application/manifest+json;base64,${btoa(JSON.stringify(manifest, null, 2))}` : 'manifest.json';
            
            pwaHeadTags = `<link rel="manifest" href="${manifestUrl}"><meta name="theme-color" content="${rgbaToHex(state.pwaSettings.iconGeneratedConfig.bgColor1)}"><link rel="apple-touch-icon" href="${getIconUrl(192)}">${useLocalAssets ? '<link rel="icon" type="image/png" href="favicon.png">' : ''}`;
        }
        
        const menuIconSize = state.menuSettings.iconSize || 20;
        const menuHtml = state.menuSettings.enabled ? `
    <div id="menu-container" style="position: absolute; top: 1rem; right: 1rem; z-index: 10;">
        <button id="menu-toggle" aria-label="Open menu" style="color: ${state.menuSettings.iconColor}; background: transparent; border: none; cursor: pointer; padding: 0.5rem;"><svg xmlns="http://www.w3.org/2000/svg" width="${menuIconSize}" height="${menuIconSize}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg></button>
        <div id="menu-dropdown" style="display: none; position: absolute; top: 100%; right: 0; margin-top: 0.5rem; width: 14rem; background-color: ${state.menuSettings.bgColor}; border-radius: 0.375rem; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1); padding: 0.25rem 0; font-family: '${state.appearance.fontFamily}', sans-serif;">
            ${state.menuSettings.items.map(item => `<a href="${item.url || '#'}" data-type="${item.type}" data-url="${item.url || ''}" class="menu-item" style="display: flex; align-items: center; gap: 0.75rem; padding: 0.5rem 1rem; color: ${state.menuSettings.textColor}; text-decoration: none; font-size: ${state.menuSettings.itemFontSize}px;">${item.icon ? `<i class="${item.icon}" style="width: 1rem; text-align: center; font-size: ${state.menuSettings.itemIconSize}px;"></i>` : ''}<span>${item.text}</span></a>`).join('')}
        </div>
    </div>` : '';

        return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${appName}</title><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"><link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@400;700&display=swap" rel="stylesheet">${state.appearance.customFontUrl ? `<style>@font-face { font-family: '${state.appearance.customFontFamily}'; src: url('${state.appearance.customFontUrl}'); }</style>` : ''}${pwaHeadTags}<style>body { margin: 0; font-family: '${state.appearance.fontFamily}', sans-serif; background: ${pageBgVal}; background-size: cover; background-position: center; background-attachment: fixed; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 2rem 1rem; box-sizing: border-box; transition: background 0.5s ease-in-out; } main { position: relative; max-width: 480px; width: 100%; background: ${cardBgVal}; background-size: cover; background-position: center; border-radius: 1rem; box-shadow: 0 10px 30px rgba(0,0,0,0.1); padding: 3rem 1.5rem 1.5rem; text-align: center; animation: fadeIn ${state.appearance.cardFadeInSpeed / 1000}s ease-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } } img.profile { width: ${state.appearance.profilePicSize}px; height: ${state.appearance.profilePicSize}px; border-radius: 50%; object-fit: cover; margin: 0 auto 0.5rem; } h2 { margin: 0.5rem 0; font-size: ${state.appearance.profileNameFontSize}px; color: ${state.appearance.profileNameColor}; } p.desc { margin: 0 0 1.5rem; font-size: ${state.appearance.profileDescriptionFontSize}px; color: ${state.appearance.profileDescriptionColor}; } .links a { display: flex; align-items: center; justify-content: center; gap: 0.5rem; background-color: ${state.appearance.buttonBgColor}; color: ${state.appearance.buttonTextColor}; padding: 0.9rem; margin: 1rem auto; text-decoration: none; font-size: ${state.appearance.buttonFontSize}pt; transition: transform 0.2s; width: ${state.appearance.buttonWidth}%; box-sizing: border-box; } .links a:hover { transform: scale(1.03); } .apps { display: flex; justify-content: center; gap: 0.5rem; margin: 1.5rem 0; } .apps a { width: 52px; height: 52px; display: inline-flex; justify-content: center; align-items: center; text-decoration: none; } .apps i { font-size: ${state.appearance.appIconSize}pt; } .embed-container iframe { max-width: 100%; display: block; margin: 0 auto; } footer { margin-top: 2rem; color: ${state.appearance.profileDescriptionColor}; opacity: 0.7; font-size: ${state.appearance.footerFontSize}px; } footer a { color: inherit; } .menu-item:hover { background-color: rgba(0,0,0,0.05); } @keyframes pulse-slow { 50% { transform: scale(1.04); } } .hover-pulse:hover { animation: pulse-slow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; } @keyframes glow { 0%, 100% { box-shadow: 0 0 5px rgba(59, 130, 246, 0.2); } 50% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.6); } } .hover-glow:hover { animation: glow 3s ease-in-out infinite; } @keyframes bounce-on-hover { 0%, 100% { transform: translateY(-25%); animation-timing-function: cubic-bezier(0.8, 0, 1, 1); } 50% { transform: translateY(0); animation-timing-function: cubic-bezier(0, 0, 0.2, 1); } } .hover-bounce:hover { animation: bounce-on-hover 1s infinite; }</style></head><body><main>${menuHtml}${state.elements.map(el => { switch(el.type) { case 'profile': return `<img src="${el.picUrl}" alt="Profile" class="profile ${el.picShadow}" style="width: ${state.appearance.profilePicSize}px; height: ${state.appearance.profilePicSize}px;"><h2 style="color:${state.appearance.profileNameColor}; font-size:${state.appearance.profileNameFontSize}px; font-weight: ${el.nameFontWeight}; font-style: ${el.nameFontStyle}; text-decoration: ${el.nameTextDecoration}; text-shadow: ${el.nameTextShadow || 'none'};">${el.name}</h2><p class="desc" style="color:${state.appearance.profileDescriptionColor}; font-size:${state.appearance.profileDescriptionFontSize}px; font-weight: ${el.descriptionFontWeight}; font-style: ${el.descriptionFontStyle}; text-decoration: ${el.descriptionTextDecoration}; text-shadow: ${el.descriptionTextShadow || 'none'};">${el.description}</p>`; case 'buttonarray': return `<div class="links">${el.buttons.map(b => `<a href="${b.url}" target="_blank" rel="noopener noreferrer" class="${b.style} ${b.shadow} ${state.appearance.buttonAnimation !== 'none' ? state.appearance.buttonAnimation : ''}" style="background-color: ${state.appearance.buttonBgColor}; color: ${state.appearance.buttonTextColor}; font-size: ${state.appearance.buttonFontSize}pt; font-weight: ${state.appearance.buttonFontWeight}; font-style: ${state.appearance.buttonFontStyle}; text-decoration: ${state.appearance.buttonTextDecoration};"><i class="${b.icon}"></i><span>${b.text}</span></a>`).join('')}</div>`; case 'apps': return `<div class="apps">${el.apps.map(a => `<a href="${a.url}" target="_blank" rel="noopener noreferrer" class="${a.shape} ${state.appearance.appAnimation !== 'none' ? state.appearance.appAnimation : ''}" style="background-color: ${a.bg};"><i class="${a.icon}" style="color: ${a.color}; font-size:${state.appearance.appIconSize}pt;"></i></a>`).join('')}</div>`; case 'qrcode': return `<div style="text-align: center; margin: 1.5rem 0;"><div id="qrcode_${el.id}" style="display:inline-block; padding: 0.5rem; background: ${state.appearance.qrCodeColorLight}; border-radius: 8px;"></div></div>`; case 'calltoaction': return `<div style="text-align: ${el.alignment}; margin: 1.5rem 0;"><a href="${el.url}" target="_blank" rel="noopener noreferrer" class="${el.style} ${el.shadow} ${el.animation !== 'none' ? el.animation : ''}" style="display: inline-block; background-color: ${el.bgColor}; color: ${el.textColor}; padding: ${el.paddingY}px 24px; text-decoration: none; font-weight: ${el.fontWeight}; font-style: ${el.fontStyle}; text-decoration: ${el.textDecoration};">${el.text}</a></div>`; case 'blocktext': return `<div style="background-color: ${el.bgColor}; color: ${el.textColor}; font-size: ${el.fontSize}px; text-align: ${el.textAlign}; padding: ${el.paddingY}px ${el.paddingX}px; border-radius: 8px; margin: 1.5rem auto; width: ${state.appearance.buttonWidth}%; box-sizing: border-box; white-space: pre-wrap; word-break: break-word; font-weight: ${el.fontWeight}; font-style: ${el.fontStyle}; text-decoration: ${el.textDecoration};">${el.content}</div>`; case 'embed': return `<div class="embed-container" style="margin: 1.5rem auto; padding: ${el.paddingY}px ${el.paddingX}px; border: ${el.borderWidth}px solid ${el.borderColor}; border-radius: ${el.borderRadius}px; box-shadow: ${shadowMap[el.shadow] || 'none'}; width: ${state.appearance.buttonWidth}%; box-sizing: border-box;">${el.content}</div>`; default: return ''; } }).join('')}${state.appearance.footerEnabled ? `<footer><p>${state.appearance.footerText}</p></footer>` : ''}</main><script src="https://cdn.jsdelivr.net/npm/qrcodejs@1.0.0/qrcode.min.js"></script><script>${state.elements.filter(el => el.type === 'qrcode').map(el => { const q = el as QRCode; return `new QRCode(document.getElementById("qrcode_${q.id}"), { text: "${q.url}", width: ${state.appearance.qrCodeSize}, height: ${state.appearance.qrCodeSize}, colorDark: "${rgbaToHex(state.appearance.qrCodeColorDark)}" });`; }).join('\n')} const menuToggle = document.getElementById('menu-toggle'); const menuDropdown = document.getElementById('menu-dropdown'); if (menuToggle && menuDropdown) { menuToggle.addEventListener('click', (e) => { e.stopPropagation(); const isHidden = menuDropdown.style.display === 'none'; menuDropdown.style.display = isHidden ? 'block' : 'none'; }); document.addEventListener('click', (e) => { if (!menuToggle.contains(e.target) && !menuDropdown.contains(e.target)) { menuDropdown.style.display = 'none'; } }); document.querySelectorAll('.menu-item').forEach(item => { item.addEventListener('click', (e) => { e.preventDefault(); const type = item.getAttribute('data-type'); const url = item.getAttribute('data-url'); if (type === 'link' && url) { window.open(url, '_blank'); } else if (type === 'share' && navigator.clipboard && url) { navigator.clipboard.writeText(url).then(() => alert('Link copied to clipboard!')); } else if (type === 'share' && url) { alert('Share this link: ' + url); } else if (type === 'install') { alert('To install, open this site in a supported browser and look for an "Install" or "Add to Home Screen" option in the browser menu.'); } menuDropdown.style.display = 'none'; }); }); }</script></body></html>`;
    }, [state, profileNameFirstLetter, generatePwaIconSVG]);
    
    const handleDownloadHtml = useCallback(() => {
        const html = generateHtml({ inlineManifest: true });
        const blob = new Blob([html], { type: 'text/html' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.download = "index.html";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setIsDownloadModalOpen(false);
    }, [generateHtml]);

    const handleDownloadZip = useCallback(async () => {
        const zip = new JSZip();
        zip.file("index.html", generateHtml({ useLocalAssets: true }));
        
        if (state.pwaSettings.enabled) {
            const profileEl = state.elements.find(e => e.type === 'profile') as Profile | undefined;
            const appName = profileEl ? `${profileEl.name}'s Links` : 'My Links';
            const manifest = { "name": appName, "short_name": profileEl?.name ?? "Links", "start_url": ".", "display": "standalone", "background_color": rgbaToHex(state.pwaSettings.iconGeneratedConfig.bgColor1), "theme_color": rgbaToHex(state.pwaSettings.iconGeneratedConfig.bgColor1), "description": profileEl?.description ?? "My personal links page.", "icons": [ { "src": "icon-192.png", "sizes": "192x192", "type": "image/png" }, { "src": "icon-512.png", "sizes": "512x512", "type": "image/png" }, ] };
            zip.file("manifest.json", JSON.stringify(manifest, null, 2));

            const iconUrl = state.pwaSettings.iconType === 'upload' ? state.pwaSettings.iconUploadUrl : null;
            if (iconUrl) {
                const response = await fetch(iconUrl);
                const blob = await response.blob();
                zip.file("icon-192.png", blob); zip.file("icon-512.png", blob); zip.file("favicon.png", blob);
            } else if (state.pwaSettings.iconType === 'generated') {
                const letter = profileNameFirstLetter;
                const svg192 = generatePwaIconSVG(state.pwaSettings.iconGeneratedConfig, letter, 192);
                const svg512 = generatePwaIconSVG(state.pwaSettings.iconGeneratedConfig, letter, 512);
                const svg32 = generatePwaIconSVG(state.pwaSettings.iconGeneratedConfig, letter, 32);
                const [blob192, blob512, blob32] = await Promise.all([ svgToPngBlob(svg192, 192, 192), svgToPngBlob(svg512, 512, 512), svgToPngBlob(svg32, 32, 32) ]);
                if (blob192) zip.file("icon-192.png", blob192); if (blob512) zip.file("icon-512.png", blob512); if (blob32) zip.file("favicon.png", blob32);
            }
        }

        zip.generateAsync({ type: "blob" }).then((content: any) => {
            const link = document.createElement("a");
            link.href = URL.createObjectURL(content);
            link.download = "linksprout-site.zip";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
        setIsDownloadModalOpen(false);
    }, [generateHtml, state.pwaSettings, state.elements, profileNameFirstLetter, generatePwaIconSVG]);

    const handleInstallPwa = useCallback(async () => {
        if (installPromptEvent) {
            await installPromptEvent.prompt();
            const { outcome } = await installPromptEvent.userChoice;
            if (outcome === 'accepted') {
                setInstallPromptEvent(null);
            }
        }
        setIsDownloadModalOpen(false);
    }, [installPromptEvent]);

    const handlePreview = useCallback(() => {
        const html = generateHtml({ inlineManifest: true });
        const blob = new Blob([html], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');
    }, [generateHtml]);

    return {
        state,
        setState,
        editingTarget,
        setEditingTarget,
        isLoadModalOpen,
        setIsLoadModalOpen,
        isAddModalOpen,
        setIsAddModalOpen,
        isSaveModalOpen,
        setIsSaveModalOpen,
        isDeployModalOpen,
        setIsDeployModalOpen,
        isDownloadModalOpen,
        setIsDownloadModalOpen,
        isShareModalOpen,
        setIsShareModalOpen,
        shareUrl,
        setShareUrl,
        savedSites,
        installPromptEvent,
        isDragging,
        draggedItem,
        dragOverItem,
        profileNameFirstLetter,
        loadSites,
        handleLoadSite,
        handleSaveSite,
        handleDeleteSite,
        handleUpdateAppearance,
        handleUpdateBackgroundConfig,
        handleUpdateRandomizeSetting,
        handleUpdatePwaSettings,
        handleUpdatePwaIconConfig,
        handlePwaIconUpload,
        handleUploadCustomFont,
        handleAddElement,
        handleUpdateElement,
        handleRemoveElement,
        handleUpdateApp,
        handleRemoveApp,
        handleAddApp,
        handleUpdateButtonInArray,
        handleRemoveButtonFromArray,
        handleAddButtonToArray,
        handleUpdateMenuSettings,
        handleAddMenuItem,
        handleUpdateMenuItem,
        handleRemoveMenuItem,
        handleDragStart,
        handleDragEnter,
        handleDragEnd,
        handleDownloadHtml,
        handleDownloadZip,
        handleInstallPwa,
        handlePreview,
        randomizeAll,
        generatePwaIconSVG
    };
};
