import React, { useState } from 'react';
import type { EditingTarget, Element, Appearance, ButtonArray, Profile, Apps, QRCode, AppIcon, RandomizeSettings, PwaSettings, PwaIconGeneratedConfig, Button, CallToAction, BlockText, GeneratorConfig, GeneratorType, Embed, MenuSettings, MenuItem } from '../types';
import { GRADIENT_OPTIONS, STYLE_OPTIONS, SHADOW_OPTIONS, AVAILABLE_FONTS, ICONS, BUTTON_ANIMATIONS, APP_ANIMATIONS, GENERATOR_OPTIONS } from '../constants';

interface EditPopoverProps {
  target: EditingTarget | null;
  appearance: Appearance;
  randomizeSettings: RandomizeSettings;
  pwaSettings: PwaSettings;
  menuSettings: MenuSettings;
  profileNameFirstLetter: string;
  onClose: () => void;
  onUpdateElement: (id: string, prop: string, value: any) => void;
  onUpdateAppearance: (prop: keyof Appearance, value: any) => void;
  onUpdateBackgroundConfig: (target: 'page' | 'card', newConfig: GeneratorConfig) => void;
  onUpdateRandomizeSetting: (prop: keyof RandomizeSettings, value: boolean) => void;
  onRemoveElement: (id: string) => void;
  onUpdateApp: (elementId: string, appIndex: number, prop: keyof AppIcon, value: any) => void;
  onRemoveApp: (elementId: string, appIndex: number) => void;
  onAddApp: (elementId: string) => void;
  onUploadCustomFont: (fontName: string, fontUrl: string) => void;
  onUpdatePwaSettings: (prop: keyof PwaSettings, value: any) => void;
  onUpdatePwaIconConfig: (prop: keyof PwaIconGeneratedConfig, value: any) => void;
  onPwaIconUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  generatePwaIconSVG: (config: PwaIconGeneratedConfig, letter: string, size?: number) => string;
  isDesktop: boolean;
  isPrimaryModalOpen: boolean;
  cardHeight: number | null;
  onUpdateButtonInArray: (elementId: string, buttonId: string, prop: keyof Button, value: any) => void;
  onRemoveButtonFromArray: (elementId: string, buttonId: string) => void;
  onAddButtonToArray: (elementId: string) => void;
  onUpdateMenuSettings: (prop: keyof MenuSettings, value: any) => void;
  onAddMenuItem: () => void;
  onUpdateMenuItem: (itemId: string, prop: keyof MenuItem, value: any) => void;
  onRemoveMenuItem: (itemId: string) => void;
}

// --- Accordion Component for Settings ---
const AccordionItem: React.FC<{ title: string; children: React.ReactNode; isOpen: boolean; onToggle: () => void; }> = ({ title, children, isOpen, onToggle }) => {
  return (
    <div className="border-b border-slate-200 last:border-b-0">
      <button
        onClick={onToggle}
        className="w-full flex justify-between items-center py-3 text-left font-semibold text-slate-700 hover:bg-slate-50 rounded-md px-2"
        aria-expanded={isOpen}
      >
        <span>{title}</span>
        <svg
          className={`w-5 h-5 transition-transform duration-300 text-slate-500 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
      {isOpen && (
        <div className="pt-2 pb-4 px-2 space-y-4">
          {children}
        </div>
      )}
    </div>
  );
};


// Fix: Use a discriminated union to properly type the props for different element types.
type PopoverInputProps =
  ({ as?: 'input' } & React.ComponentProps<'input'>) |
  ({ as: 'textarea' } & React.ComponentProps<'textarea'>) |
  ({ as: 'select' } & React.ComponentProps<'select'>);

const PopoverInput: React.FC<PopoverInputProps> = (props) => {
  const commonClasses = "w-full p-2 border border-slate-300 rounded-md text-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500";
  if (props.as === 'textarea') {
    const { as, ...rest } = props;
    return <textarea {...rest} className={commonClasses} />;
  }
  if (props.as === 'select') {
    const { as, ...rest } = props;
    return <select {...rest} className={commonClasses}>{props.children}</select>;
  }
  const { as, ...rest } = props;
  return <input {...rest} className={commonClasses} />;
};
const Label: React.FC<{children: React.ReactNode}> = ({children}) => <label className="text-sm font-medium text-slate-600 block mb-1">{children}</label>;

// --- Color Picker with Alpha ---
const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
};
const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
};
const rgbaToHexA = (rgba: string): { hex: string; a: number } => {
    const match = rgba.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
    if (!match) return { hex: '#000000', a: 1 };
    const [, r, g, b, a] = match;
    return {
        hex: rgbToHex(parseInt(r), parseInt(g), parseInt(b)),
        a: a !== undefined ? parseFloat(a) : 1
    };
};
const hexAToRgba = (hex: string, a: number): string => {
    const rgb = hexToRgb(hex);
    if (!rgb) return 'rgba(0,0,0,1)';
    return `rgba(${rgb.r},${rgb.g},${rgb.b},${a.toFixed(2)})`;
};
const ColorPickerWithAlpha: React.FC<{ value: string, onChange: (value: string) => void }> = ({ value, onChange }) => {
    const { hex, a } = rgbaToHexA(value);
    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(hexAToRgba(e.target.value, a));
    };
    const handleAlphaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(hexAToRgba(hex, parseFloat(e.target.value)));
    };
    return (
        <div className="flex flex-col gap-2 p-2 border rounded-lg bg-slate-50">
            <div className="flex items-center gap-2">
                <input type="color" value={hex} onChange={handleColorChange} className="w-10 h-10 p-1 border border-slate-300 rounded-md flex-shrink-0" style={{'WebkitAppearance': 'none', 'MozAppearance': 'none', appearance: 'none'}}/>
                <div className="flex-1 p-2 border border-slate-300 rounded-md bg-white text-sm truncate">
                    {value}
                </div>
            </div>
            <div className="flex items-center gap-2">
                 <span className="text-xs text-slate-500 w-12 flex-shrink-0">Opacity</span>
                 <input type="range" min="0" max="1" step="0.01" value={a} onChange={handleAlphaChange} className="w-full" />
            </div>
        </div>
    );
};
// --- End Color Picker ---

const TextFormatControls: React.FC<{
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
  onUpdate: (prop: 'fontWeight' | 'fontStyle' | 'textDecoration', value: string) => void;
}> = ({ fontWeight, fontStyle, textDecoration, onUpdate }) => {
  const baseClasses = "w-10 h-10 rounded flex items-center justify-center transition-colors text-base";
  const activeClasses = "bg-blue-500 text-white";
  const inactiveClasses = "bg-slate-200 text-slate-700 hover:bg-slate-300";

  return (
    <div className="flex gap-2">
      <button
        className={`${baseClasses} ${fontWeight === 'bold' ? activeClasses : inactiveClasses}`}
        onClick={() => onUpdate('fontWeight', fontWeight === 'bold' ? 'normal' : 'bold')}
        title="Bold"
      >
        <i className="fa-solid fa-bold"></i>
      </button>
      <button
        className={`${baseClasses} ${fontStyle === 'italic' ? activeClasses : inactiveClasses}`}
        onClick={() => onUpdate('fontStyle', fontStyle === 'italic' ? 'normal' : 'italic')}
        title="Italic"
      >
        <i className="fa-solid fa-italic"></i>
      </button>
      <button
        className={`${baseClasses} ${textDecoration === 'underline' ? activeClasses : inactiveClasses}`}
        onClick={() => onUpdate('textDecoration', textDecoration === 'underline' ? 'none' : 'underline')}
        title="Underline"
      >
        <i className="fa-solid fa-underline"></i>
      </button>
    </div>
  );
};

const GeneratorControls: React.FC<{
  config: GeneratorConfig;
  onUpdate: (newConfig: GeneratorConfig) => void;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ config, onUpdate, onImageUpload }) => {
    
    const handleTypeChange = (newType: GeneratorType) => {
        let newConfig: GeneratorConfig;
        const base = { seed: Date.now() };
        switch (newType) {
            case 'gradient': newConfig = { ...base, type: 'gradient', colors: ['rgba(209, 213, 219, 1)', 'rgba(156, 163, 175, 1)'], style: 'to bottom right' }; break;
            case 'image': newConfig = { ...base, type: 'image', url: '' }; break;
            case 'layered-waves': newConfig = { ...base, type: 'layered-waves', complexity: 5, contrast: 0.7, colors: ['rgba(168, 85, 247, 1)', 'rgba(99, 102, 241, 1)', 'rgba(236, 72, 153, 1)'] }; break;
            case 'blob': newConfig = { ...base, type: 'blob', complexity: 4, contrast: 0.8, colors: ['rgba(168, 85, 247, 1)', 'rgba(99, 102, 241, 1)'] }; break;
            case 'blurry-gradient': newConfig = { ...base, type: 'blurry-gradient', complexity: 3, contrast: 1, colors: ['rgba(168, 85, 247, 1)', 'rgba(99, 102, 241, 1)', 'rgba(236, 72, 153, 1)'] }; break;
            case 'low-poly': newConfig = { ...base, type: 'low-poly', complexity: 8, contrast: 0.6, colors: ['rgba(168, 85, 247, 1)', 'rgba(99, 102, 241, 1)', 'rgba(236, 72, 153, 1)'] }; break;
            default: return;
        }
        onUpdate(newConfig);
    };

    const handlePropChange = (prop: string, value: any) => {
        onUpdate({ ...config, [prop]: value });
    };

    const handleColorChange = (index: number, newColor: string) => {
        if ('colors' in config && config.colors) {
            const newColors = [...config.colors];
            newColors[index] = newColor;
            onUpdate({ ...config, colors: newColors as any});
        }
    };
    
    const renderControls = () => {
        switch (config.type) {
            case 'gradient': return <>
                <div><Label>Color 1</Label><ColorPickerWithAlpha value={config.colors[0]} onChange={v => handleColorChange(0, v)} /></div>
                <div><Label>Color 2</Label><ColorPickerWithAlpha value={config.colors[1]} onChange={v => handleColorChange(1, v)} /></div>
                <div><Label>Gradient Style</Label><PopoverInput as="select" value={config.style} onChange={e => handlePropChange('style', e.target.value)}>{GRADIENT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.text}</option>)}</PopoverInput></div>
            </>;
            case 'image': return <>
                <div><Label>Background Image URL</Label><PopoverInput value={config.url} placeholder="https://..." onChange={e => handlePropChange('url', e.target.value)} /></div>
                <div className="text-center text-xs text-slate-500 my-2">OR</div>
                <div><Label>Upload Image</Label><PopoverInput type="file" accept="image/*" onChange={onImageUpload} className="p-1 text-xs" /></div>
            </>;
            case 'layered-waves': case 'blob': case 'blurry-gradient': case 'low-poly':
              const handleHaikeiColorChange = (index: number, newColor: string) => {
                const newColors = [...config.colors];
                newColors[index] = newColor;
                handlePropChange('colors', newColors);
              };
              const addColor = () => { if (config.colors.length < 4) handlePropChange('colors', [...config.colors, 'rgba(255,255,255,1)']); };
              const removeColor = (index: number) => { if (config.colors.length > 2) handlePropChange('colors', config.colors.filter((_, i) => i !== index)); };
              return <>
                <div><Label>Complexity ({config.complexity})</Label><input type="range" min="2" max="15" value={config.complexity} onChange={e => handlePropChange('complexity', parseInt(e.target.value, 10))} className="w-full" /></div>
                <div><Label>Contrast ({config.contrast.toFixed(2)})</Label><input type="range" min="0.1" max="1.5" step="0.05" value={config.contrast} onChange={e => handlePropChange('contrast', parseFloat(e.target.value))} className="w-full" /></div>
                <div>
                  <Label>Colors ({config.colors.length}/4)</Label>
                  <div className="space-y-2">{config.colors.map((c, i) => <div key={i} className="relative"><ColorPickerWithAlpha value={c} onChange={nc => handleHaikeiColorChange(i, nc)} />{config.colors.length > 2 && <button onClick={() => removeColor(i)} className="absolute top-0 right-0 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center translate-x-1/2 -translate-y-1/2">&times;</button>}</div>)}</div>
                  {config.colors.length < 4 && <button onClick={addColor} className="w-full h-10 border-2 border-dashed rounded-md flex items-center justify-center text-slate-400 mt-2">+</button>}
                </div>
              </>;
            default: return null;
        }
    };

    return (
      <div className="space-y-3">
        <div>
          <Label>Background Type</Label>
          <PopoverInput as="select" value={config.type} onChange={e => handleTypeChange(e.target.value as GeneratorType)}>
            {GENERATOR_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.text}</option>)}
          </PopoverInput>
        </div>
        <div className="p-3 border rounded-lg bg-slate-50 mt-2 space-y-3">
            {renderControls()}
        </div>
      </div>
    );
};


const EditPopover: React.FC<EditPopoverProps> = ({ target, appearance, randomizeSettings, pwaSettings, menuSettings, profileNameFirstLetter, onClose, onUpdateElement, onUpdateAppearance, onUpdateBackgroundConfig, onUpdateRandomizeSetting, onRemoveElement, onUpdateApp, onRemoveApp, onAddApp, onUploadCustomFont, onUpdatePwaSettings, onUpdatePwaIconConfig, onPwaIconUpload, generatePwaIconSVG, isDesktop, isPrimaryModalOpen, cardHeight, onUpdateButtonInArray, onRemoveButtonFromArray, onAddButtonToArray, onUpdateMenuSettings, onAddMenuItem, onUpdateMenuItem, onRemoveMenuItem }) => {
  if (!target) return null;
  
  const [openAccordion, setOpenAccordion] = useState<string | null>(target.type === 'settings' ? 'Appearance' : null);

  const handleElementChange = (prop: string, value: any) => onUpdateElement(target.id, prop, value);
  const handleAppearanceChange = (prop: keyof Appearance, value: any) => onUpdateAppearance(prop, value);
  
  const handleFontFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        // Create a safe font-family name from the filename
        const fontName = file.name.split('.')[0].replace(/[^a-zA-Z0-9\s]/g, '').replace(/\s+/g, ' ');
        if (reader.result) {
          onUploadCustomFont(fontName, reader.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'page' | 'card' | 'profile') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.result) {
            if (target === 'profile') {
                handleElementChange('picUrl', reader.result as string);
            } else {
                const newConfig: GeneratorConfig = { type: 'image', seed: Date.now(), url: reader.result as string };
                onUpdateBackgroundConfig(target, newConfig);
            }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const title = target.type === 'settings' ? 'App Settings' :
              target.type === 'footer' ? 'Edit Footer' :
              target.type === 'menu' ? 'Edit Menu' :
              `Edit ${target.type.charAt(0).toUpperCase() + target.type.slice(1)}`;
  
  const toggleAccordion = (accordionTitle: string) => {
    setOpenAccordion(prev => prev === accordionTitle ? null : accordionTitle);
  };

  const renderContent = () => {
    switch (target.type) {
      case 'profile':
        const profile = target as Profile;
        return (
          <div className="space-y-4">
            <div><Label>Profile Picture URL</Label><PopoverInput data-prop="picUrl" value={profile.picUrl} onChange={e => handleElementChange('picUrl', e.target.value)} /></div>
            <div>
                <div className="text-center text-xs text-slate-500 my-2">OR</div>
                <Label>Upload Profile Picture</Label>
                <PopoverInput type="file" accept="image/*" onChange={e => handleImageUpload(e, 'profile')} className="p-1 text-xs" />
            </div>
            <div className="flex gap-2">
                <button onClick={() => handleElementChange('picUrl', `https://picsum.photos/seed/${Math.random()}/200`)} className="w-1/2 bg-slate-100 p-2 rounded text-sm">Generate Placeholder</button>
                <button onClick={() => handleElementChange('picUrl', 'https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg')} className="w-1/2 bg-red-50 p-2 rounded text-sm">Reset</button>
            </div>
            <div><Label>Name</Label><PopoverInput data-prop="name" value={profile.name} onChange={e => handleElementChange('name', e.target.value)} /></div>
            <TextFormatControls
              fontWeight={profile.nameFontWeight}
              fontStyle={profile.nameFontStyle}
              textDecoration={profile.nameTextDecoration}
              onUpdate={(p, v) => handleElementChange(`name${p.charAt(0).toUpperCase() + p.slice(1)}`, v)}
            />
            
            <div className='pt-2'><Label>Description</Label><PopoverInput as="textarea" rows={3} data-prop="description" value={profile.description} onChange={e => handleElementChange('description', e.target.value)} /></div>
            <TextFormatControls
              fontWeight={profile.descriptionFontWeight}
              fontStyle={profile.descriptionFontStyle}
              textDecoration={profile.descriptionTextDecoration}
              onUpdate={(p, v) => handleElementChange(`description${p.charAt(0).toUpperCase() + p.slice(1)}`, v)}
            />

            <div><Label>Image Shadow</Label><PopoverInput as="select" value={profile.picShadow} onChange={e => handleElementChange('picShadow', e.target.value)}>{SHADOW_OPTIONS.map(s => <option key={s} value={s}>{s.replace('shadow-','').replace('-',' ')}</option>)}</PopoverInput></div>
            <div className="pt-4 border-t space-y-4">
                <div><Label>Profile Picture Size ({appearance.profilePicSize}px)</Label><input type="range" min="80" max="200" step="1" value={appearance.profilePicSize} onChange={e => onUpdateAppearance('profilePicSize', parseInt(e.target.value, 10))} className="w-full" /></div>
                <div><Label>Name Color</Label><ColorPickerWithAlpha value={appearance.profileNameColor} onChange={v => onUpdateAppearance('profileNameColor', v)} /></div>
                <div><Label>Description Color</Label><ColorPickerWithAlpha value={appearance.profileDescriptionColor} onChange={v => onUpdateAppearance('profileDescriptionColor', v)} /></div>
                <div><Label>Profile Name Size ({appearance.profileNameFontSize}px)</Label><input type="range" min="16" max="36" step="1" value={appearance.profileNameFontSize} onChange={e => onUpdateAppearance('profileNameFontSize', parseInt(e.target.value, 10))} className="w-full" /></div>
                <div><Label>Profile Description Size ({appearance.profileDescriptionFontSize}px)</Label><input type="range" min="10" max="20" step="1" value={appearance.profileDescriptionFontSize} onChange={e => onUpdateAppearance('profileDescriptionFontSize', parseInt(e.target.value, 10))} className="w-full" /></div>
            </div>
            <button onClick={() => onRemoveElement(target.id)} className="w-full mt-3 text-sm text-red-600 hover:text-red-800">Remove Profile</button>
          </div>
        );
      case 'buttonarray':
        const buttonArray = target as ButtonArray;
        return (
          <div className="space-y-4">
            <div className="p-3 border rounded-lg bg-slate-50 space-y-3">
              <h4 className="text-sm font-semibold text-slate-500">Global Button Style</h4>
              <div><Label>Button Background Color</Label><ColorPickerWithAlpha value={appearance.buttonBgColor} onChange={v => handleAppearanceChange('buttonBgColor', v)} /></div>
              <div><Label>Button Text Color</Label><ColorPickerWithAlpha value={appearance.buttonTextColor} onChange={v => handleAppearanceChange('buttonTextColor', v)} /></div>
              <div>
                <Label>Button Text Style</Label>
                <TextFormatControls
                  fontWeight={appearance.buttonFontWeight}
                  fontStyle={appearance.buttonFontStyle}
                  textDecoration={appearance.buttonTextDecoration}
                  onUpdate={(p, v) => {
                      const propName = `button${p.charAt(0).toUpperCase() + p.slice(1)}` as keyof Appearance;
                      onUpdateAppearance(propName, v);
                  }}
                />
              </div>
              <div><Label>Button Font Size ({appearance.buttonFontSize}pt)</Label><input type="range" min="10" max="24" step="1" value={appearance.buttonFontSize} onChange={e => handleAppearanceChange('buttonFontSize', parseInt(e.target.value, 10))} className="w-full" /></div>
              <div><Label>Button Width ({appearance.buttonWidth}%)</Label><input type="range" min="40" max="100" step="1" value={appearance.buttonWidth} onChange={e => handleAppearanceChange('buttonWidth', parseInt(e.target.value, 10))} className="w-full" /></div>
              <div><Label>Button Animation</Label><PopoverInput as="select" value={appearance.buttonAnimation} onChange={e => handleAppearanceChange('buttonAnimation', e.target.value)}>{BUTTON_ANIMATIONS.map(o => <option key={o.value} value={o.value}>{o.text}</option>)}</PopoverInput></div>
            </div>
            <h4 className="text-sm font-semibold text-slate-500 pt-2">Individual Buttons</h4>
            <div className="space-y-3">
              {buttonArray.buttons.map((button) => (
                <div key={button.id} className="p-3 border rounded bg-white space-y-3 relative">
                  <button onClick={() => onRemoveButtonFromArray(buttonArray.id, button.id)} className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm flex items-center justify-center hover:bg-red-200">&times;</button>
                  <div>
                    <Label>Text & URL</Label>
                    <div className="flex gap-2">
                        <PopoverInput data-prop="text" value={button.text} placeholder="Button text" onChange={e => onUpdateButtonInArray(buttonArray.id, button.id, 'text', e.target.value)} />
                        <PopoverInput data-prop="url" value={button.url} placeholder="https://example.com" onChange={e => onUpdateButtonInArray(buttonArray.id, button.id, 'url', e.target.value)} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <Label>Shadow</Label>
                      <PopoverInput as="select" value={button.shadow} onChange={e => onUpdateButtonInArray(buttonArray.id, button.id, 'shadow', e.target.value)}>
                        {SHADOW_OPTIONS.map(s => <option key={s} value={s}>{s.replace('shadow-','').replace('-',' ')}</option>)}
                      </PopoverInput>
                    </div>
                    <div>
                      <Label>Style</Label>
                      <PopoverInput as="select" value={button.style} onChange={e => onUpdateButtonInArray(buttonArray.id, button.id, 'style', e.target.value)}>
                        {STYLE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.text}</option>)}
                      </PopoverInput>
                    </div>
                  </div>
                  <div>
                    <Label>Icon</Label>
                    <div className="flex items-center gap-2">
                      <PopoverInput as="select" className="flex-1" value={button.icon} onChange={e => onUpdateButtonInArray(buttonArray.id, button.id, 'icon', e.target.value)}>
                        {ICONS.map(i => <option key={i.label} value={i.cls}>{i.label}</option>)}
                      </PopoverInput>
                      <div className="p-2 rounded border bg-white text-lg"><i className={button.icon || 'fa-solid fa-link'}></i></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2">
              <button onClick={() => onAddButtonToArray(buttonArray.id)} className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded">+ Add Button</button>
            </div>
            <button onClick={() => onRemoveElement(target.id)} className="w-full mt-3 text-sm text-red-600 hover:text-red-800">Remove Button Array</button>
          </div>
        );
      case 'apps':
        const apps = target as Apps;
        return (
            <div className="space-y-4">
                <div className="p-3 border rounded-lg bg-slate-50 space-y-3">
                  <h4 className="text-sm font-semibold text-slate-500">Global App Icon Style</h4>
                  <div><Label>App Icon Size ({appearance.appIconSize}pt)</Label><input type="range" min="12" max="32" step="1" value={appearance.appIconSize} onChange={e => handleAppearanceChange('appIconSize', parseInt(e.target.value, 10))} className="w-full" /></div>
                  <div><Label>App Icon Animation</Label><PopoverInput as="select" value={appearance.appAnimation} onChange={e => handleAppearanceChange('appAnimation', e.target.value)}>{APP_ANIMATIONS.map(o => <option key={o.value} value={o.value}>{o.text}</option>)}</PopoverInput></div>
                </div>
                <div className="text-sm text-slate-500 pt-2">Manage up to 4 app icons.</div>
                 <div className="space-y-3">
                    {apps.apps.map((app, idx) => (
                        <div key={app.id} className="p-3 border rounded bg-white space-y-3">
                            <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 ${app.shape} flex items-center justify-center text-white text-xl flex-shrink-0`} style={{background:app.bg}}><i className={app.icon} style={{color: app.color}}></i></div>
                                <div className="flex-1 space-y-2">
                                    <PopoverInput value={app.url} placeholder="https://..." onChange={e => onUpdateApp(apps.id, idx, 'url', e.target.value)}/>
                                    <div className="flex items-center gap-2">
                                      <PopoverInput as="select" className="flex-1" value={app.icon} onChange={e => onUpdateApp(apps.id, idx, 'icon', e.target.value)}>
                                        {ICONS.map(i => <option key={i.cls} value={i.cls}>{i.label}</option>)}
                                      </PopoverInput>
                                      <div className="p-2 rounded border bg-white text-lg"><i className={app.icon || 'fa-solid fa-star'}></i></div>
                                    </div>
                                </div>
                            </div>
                            <div>
                               <Label>Shape</Label>
                               <PopoverInput as="select" value={app.shape} onChange={e => onUpdateApp(apps.id, idx, 'shape', e.target.value)}>
                                {STYLE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.text}</option>)}
                               </PopoverInput>
                            </div>
                             <div className="flex items-center gap-2">
                                <div className="flex-1"><ColorPickerWithAlpha value={app.bg} onChange={val => onUpdateApp(apps.id, idx, 'bg', val)} /></div>
                                <button className="ml-auto text-sm text-red-600" onClick={() => onRemoveApp(apps.id, idx)}>Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
                 <div className="pt-2">
                    <button onClick={() => onAddApp(apps.id)} disabled={apps.apps.length >= 4} className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded disabled:bg-indigo-300">+ Add App ({apps.apps.length}/4)</button>
                </div>
                 <button onClick={() => onRemoveElement(target.id)} className="w-full mt-3 text-sm text-red-600 hover:text-red-800">Remove Apps Bar</button>
            </div>
        )
      case 'qrcode':
        const qrcode = target as QRCode;
        return (
            <div className="space-y-4">
                <div>
                    <Label>QR Code URL</Label>
                    <PopoverInput value={qrcode.url} onChange={e => handleElementChange('url', e.target.value)} />
                </div>
                <div className="pt-4 mt-4 border-t space-y-3">
                    <h4 className="text-sm font-semibold text-slate-500 -mt-1 mb-1">QR Code Style</h4>
                    <div><Label>Dark Color</Label><ColorPickerWithAlpha value={appearance.qrCodeColorDark} onChange={v => handleAppearanceChange('qrCodeColorDark', v)} /></div>
                    <div><Label>Light Color</Label><ColorPickerWithAlpha value={appearance.qrCodeColorLight} onChange={v => handleAppearanceChange('qrCodeColorLight', v)} /></div>
                    <div>
                        <Label>QR Code Size ({appearance.qrCodeSize}px)</Label>
                        <input type="range" min="64" max="256" step="8" value={appearance.qrCodeSize} onChange={e => onUpdateAppearance('qrCodeSize', parseInt(e.target.value, 10))} className="w-full" />
                    </div>
                </div>
                <button onClick={() => onRemoveElement(target.id)} className="w-full mt-2 text-sm text-red-600 hover:text-red-800">Remove QR Code</button>
            </div>
        )
      case 'calltoaction':
        const cta = target as CallToAction;
        return (
            <div className="space-y-4">
                <div><Label>Button Text</Label><PopoverInput value={cta.text} onChange={e => handleElementChange('text', e.target.value)} /></div>
                <TextFormatControls fontWeight={cta.fontWeight} fontStyle={cta.fontStyle} textDecoration={cta.textDecoration} onUpdate={(p, v) => handleElementChange(p, v)} />
                <div><Label>Button URL</Label><PopoverInput value={cta.url} onChange={e => handleElementChange('url', e.target.value)} /></div>
                <div><Label>Background Color</Label><ColorPickerWithAlpha value={cta.bgColor} onChange={v => handleElementChange('bgColor', v)} /></div>
                <div><Label>Text Color</Label><ColorPickerWithAlpha value={cta.textColor} onChange={v => handleElementChange('textColor', v)} /></div>
                <div><Label>Vertical Padding ({cta.paddingY}px)</Label><input type="range" min="8" max="32" value={cta.paddingY} onChange={e => handleElementChange('paddingY', parseInt(e.target.value, 10))} className="w-full" /></div>
                <div><Label>Alignment</Label><PopoverInput as="select" value={cta.alignment} onChange={e => handleElementChange('alignment', e.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option></PopoverInput></div>
                <div><Label>Style</Label><PopoverInput as="select" value={cta.style} onChange={e => handleElementChange('style', e.target.value)}>{STYLE_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.text}</option>)}</PopoverInput></div>
                <div><Label>Shadow</Label><PopoverInput as="select" value={cta.shadow} onChange={e => handleElementChange('shadow', e.target.value)}>{SHADOW_OPTIONS.map(s => <option key={s} value={s}>{s.replace('shadow-','')}</option>)}</PopoverInput></div>
                <div><Label>Animation</Label><PopoverInput as="select" value={cta.animation} onChange={e => handleElementChange('animation', e.target.value)}>{BUTTON_ANIMATIONS.map(a => <option key={a.value} value={a.value}>{a.text}</option>)}</PopoverInput></div>
                <button onClick={() => onRemoveElement(target.id)} className="w-full mt-2 text-sm text-red-600 hover:text-red-800">Remove CTA</button>
            </div>
        )
      case 'blocktext':
        const textBlock = target as BlockText;
        return (
            <div className="space-y-4">
                <div><Label>Content</Label><PopoverInput as="textarea" rows={5} value={textBlock.content} onChange={e => handleElementChange('content', e.target.value)} /></div>
                <TextFormatControls fontWeight={textBlock.fontWeight} fontStyle={textBlock.fontStyle} textDecoration={textBlock.textDecoration} onUpdate={(p, v) => handleElementChange(p, v)} />
                <div><Label>Text Color</Label><ColorPickerWithAlpha value={textBlock.textColor} onChange={v => handleElementChange('textColor', v)} /></div>
                <div><Label>Background Color</Label><ColorPickerWithAlpha value={textBlock.bgColor} onChange={v => handleElementChange('bgColor', v)} /></div>
                <div><Label>Font Size ({textBlock.fontSize}px)</Label><input type="range" min="12" max="32" value={textBlock.fontSize} onChange={e => handleElementChange('fontSize', parseInt(e.target.value, 10))} className="w-full" /></div>
                <div><Label>Text Align</Label><PopoverInput as="select" value={textBlock.textAlign} onChange={e => handleElementChange('textAlign', e.target.value)}><option value="left">Left</option><option value="center">Center</option><option value="right">Right</option><option value="justify">Justify</option></PopoverInput></div>
                <div><Label>Vertical Padding ({textBlock.paddingY}px)</Label><input type="range" min="0" max="50" value={textBlock.paddingY} onChange={e => handleElementChange('paddingY', parseInt(e.target.value, 10))} className="w-full" /></div>
                <div><Label>Horizontal Padding ({textBlock.paddingX}px)</Label><input type="range" min="0" max="50" value={textBlock.paddingX} onChange={e => handleElementChange('paddingX', parseInt(e.target.value, 10))} className="w-full" /></div>
                <button onClick={() => onRemoveElement(target.id)} className="w-full mt-2 text-sm text-red-600 hover:text-red-800">Remove Text Block</button>
            </div>
        )
      case 'embed':
        const embed = target as Embed;
        return (
            <div className="space-y-4">
                <div><Label>Embed Code (HTML)</Label><PopoverInput as="textarea" rows={6} value={embed.content} onChange={e => handleElementChange('content', e.target.value)} /></div>
                <h4 className="text-sm font-semibold text-slate-500 pt-2 border-t">Styling</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Vert Padding ({embed.paddingY}px)</Label><input type="range" min="0" max="50" value={embed.paddingY} onChange={e => handleElementChange('paddingY', parseInt(e.target.value, 10))} className="w-full" /></div>
                    <div><Label>Horiz Padding ({embed.paddingX}px)</Label><input type="range" min="0" max="50" value={embed.paddingX} onChange={e => handleElementChange('paddingX', parseInt(e.target.value, 10))} className="w-full" /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div><Label>Border Width ({embed.borderWidth}px)</Label><input type="range" min="0" max="20" value={embed.borderWidth} onChange={e => handleElementChange('borderWidth', parseInt(e.target.value, 10))} className="w-full" /></div>
                    <div><Label>Border Radius ({embed.borderRadius}px)</Label><input type="range" min="0" max="40" value={embed.borderRadius} onChange={e => handleElementChange('borderRadius', parseInt(e.target.value, 10))} className="w-full" /></div>
                </div>
                <div><Label>Border Color</Label><ColorPickerWithAlpha value={embed.borderColor} onChange={v => handleElementChange('borderColor', v)} /></div>
                <div><Label>Shadow</Label><PopoverInput as="select" value={embed.shadow} onChange={e => handleElementChange('shadow', e.target.value)}>{SHADOW_OPTIONS.map(s => <option key={s} value={s}>{s.replace('shadow-','')}</option>)}</PopoverInput></div>
                <button onClick={() => onRemoveElement(target.id)} className="w-full mt-2 text-sm text-red-600 hover:text-red-800">Remove Embed</button>
            </div>
        )
      case 'footer':
        return (
            <div className="space-y-4">
                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <input type="checkbox" checked={appearance.footerEnabled} onChange={e => onUpdateAppearance('footerEnabled', e.target.checked)} />
                    Show Footer
                </label>
                {appearance.footerEnabled && (
                    <div className="mt-2 space-y-3">
                        <div>
                            <Label>Footer Content (HTML allowed)</Label>
                            <PopoverInput as="textarea" rows={3} value={appearance.footerText} onChange={e => onUpdateAppearance('footerText', e.target.value)} />
                        </div>
                        <div>
                            <Label>Footer Font Size ({appearance.footerFontSize}px)</Label>
                            <input type="range" min="8" max="18" step="1" value={appearance.footerFontSize} onChange={e => onUpdateAppearance('footerFontSize', parseInt(e.target.value, 10))} className="w-full" />
                        </div>
                    </div>
                )}
            </div>
        );
      case 'menu':
        return (
            <div className="space-y-4">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <input type="checkbox" checked={menuSettings.enabled} onChange={e => onUpdateMenuSettings('enabled', e.target.checked)} />
                  Show Menu
              </label>
              <div className="space-y-4 pt-4 border-t">
                  <div className="p-3 border rounded-lg bg-slate-50 space-y-3">
                      <h4 className="text-sm font-semibold text-slate-500">Menu Style</h4>
                      <div><Label>Menu Icon Size ({menuSettings.iconSize}px)</Label><input type="range" min="16" max="32" value={menuSettings.iconSize} onChange={e => onUpdateMenuSettings('iconSize', parseInt(e.target.value, 10))} className="w-full" /></div>
                      <div><Label>Icon Color</Label><ColorPickerWithAlpha value={menuSettings.iconColor} onChange={v => onUpdateMenuSettings('iconColor', v)} /></div>
                      <div><Label>Background Color</Label><ColorPickerWithAlpha value={menuSettings.bgColor} onChange={v => onUpdateMenuSettings('bgColor', v)} /></div>
                      <div><Label>Text Color</Label><ColorPickerWithAlpha value={menuSettings.textColor} onChange={v => onUpdateMenuSettings('textColor', v)} /></div>
                      <div><Label>Item Font Size ({menuSettings.itemFontSize}px)</Label><input type="range" min="12" max="20" value={menuSettings.itemFontSize} onChange={e => onUpdateMenuSettings('itemFontSize', parseInt(e.target.value, 10))} className="w-full" /></div>
                      <div><Label>Item Icon Size ({menuSettings.itemIconSize}px)</Label><input type="range" min="12" max="20" value={menuSettings.itemIconSize} onChange={e => onUpdateMenuSettings('itemIconSize', parseInt(e.target.value, 10))} className="w-full" /></div>
                  </div>
                  {menuSettings.enabled && (
                    <>
                      <h4 className="text-sm font-semibold text-slate-500 pt-2">Menu Items</h4>
                      <div className="space-y-3">
                          {menuSettings.items.map((item) => (
                              <div key={item.id} className="p-3 border rounded bg-white space-y-3 relative">
                                  <button onClick={() => onRemoveMenuItem(item.id)} className="absolute top-2 right-2 w-6 h-6 bg-red-100 text-red-600 rounded-full text-sm flex items-center justify-center hover:bg-red-200">&times;</button>
                                  <div><Label>Item Type</Label>
                                    <PopoverInput as="select" value={item.type} onChange={e => onUpdateMenuItem(item.id, 'type', e.target.value)}>
                                        <option value="link">External Link</option>
                                        <option value="share">Share Action</option>
                                        <option value="install">Install App Action</option>
                                    </PopoverInput>
                                  </div>
                                  <div><Label>Text</Label><PopoverInput value={item.text} onChange={e => onUpdateMenuItem(item.id, 'text', e.target.value)} /></div>
                                  {(item.type === 'link' || item.type === 'share') && (
                                    <div><Label>{item.type === 'share' ? 'Share URL' : 'URL'}</Label><PopoverInput value={item.url} placeholder="https://..." onChange={e => onUpdateMenuItem(item.id, 'url', e.target.value)} /></div>
                                  )}
                                   <div>
                                    <Label>Icon</Label>
                                    <div className="flex items-center gap-2">
                                      <PopoverInput as="select" className="flex-1" value={item.icon} onChange={e => onUpdateMenuItem(item.id, 'icon', e.target.value)}>
                                        {ICONS.map(i => <option key={i.label} value={i.cls}>{i.label}</option>)}
                                      </PopoverInput>
                                      <div className="p-2 rounded border bg-white text-lg"><i className={item.icon}></i></div>
                                    </div>
                                  </div>
                              </div>
                          ))}
                      </div>
                       <div className="pt-2">
                          <button onClick={onAddMenuItem} className="flex items-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded">+ Add Item</button>
                      </div>
                    </>
                  )}
              </div>
            </div>
        );
      case 'settings':
        return (
           <div>
              <AccordionItem title="Appearance" isOpen={openAccordion === 'Appearance'} onToggle={() => toggleAccordion('Appearance')}>
                  <div className="space-y-4">
                      <div>
                          <h4 className="text-sm font-semibold text-slate-500 mb-2">Typography</h4>
                          <div className="space-y-3">
                              <div>
                                  <Label>Font</Label>
                                  <PopoverInput as="select" value={appearance.fontFamily} onChange={e => handleAppearanceChange('fontFamily', e.target.value)}>
                                      {appearance.customFontFamily && <option value={appearance.customFontFamily}>{appearance.customFontFamily} (Custom)</option>}
                                      {AVAILABLE_FONTS.map(f => <option key={f.name} value={f.family}>{f.name}</option>)}
                                  </PopoverInput>
                              </div>
                              <div>
                                  <Label>Upload Custom Font (.ttf, .otf, .woff)</Label>
                                  <PopoverInput type="file" accept=".ttf,.otf,.woff,.woff2" onChange={handleFontFileChange} className="p-1 text-xs" />
                              </div>
                          </div>
                      </div>

                      <hr className="my-4 border-slate-200" />

                      <div>
                          <h4 className="text-sm font-semibold text-slate-500 mb-2">Card Layout & Style</h4>
                          <div className="space-y-3">
                               <GeneratorControls
                                    config={appearance.cardBackgroundConfig}
                                    onUpdate={(newConfig) => onUpdateBackgroundConfig('card', newConfig)}
                                    onImageUpload={(e) => handleImageUpload(e, 'card')}
                                />
                              <div className="pt-4 border-t">
                                  <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={appearance.cardFadeIn} onChange={e => handleAppearanceChange('cardFadeIn', e.target.checked)} /> Card Fade-in</label>
                                  {appearance.cardFadeIn && (
                                      <div className="pl-6 pt-1">
                                          <Label>Fade-in Speed ({appearance.cardFadeInSpeed}ms)</Label>
                                          <input type="range" min="200" max="2000" step="100" value={appearance.cardFadeInSpeed} onChange={e => handleAppearanceChange('cardFadeInSpeed', parseInt(e.target.value, 10))} className="w-full" />
                                      </div>
                                  )}
                              </div>
                          </div>
                      </div>

                      <hr className="my-4 border-slate-200" />
                      
                      <div>
                          <h4 className="text-sm font-semibold text-slate-500 mb-2">Page Background</h4>
                          <div className="space-y-3">
                             <GeneratorControls
                                config={appearance.pageBackgroundConfig}
                                onUpdate={(newConfig) => onUpdateBackgroundConfig('page', newConfig)}
                                onImageUpload={(e) => handleImageUpload(e, 'page')}
                             />
                          </div>
                      </div>
                  </div>
              </AccordionItem>
              <AccordionItem title="PWA Settings" isOpen={openAccordion === 'PWA Settings'} onToggle={() => toggleAccordion('PWA Settings')}>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-600">
                    <input type="checkbox" checked={pwaSettings.enabled} onChange={e => onUpdatePwaSettings('enabled', e.target.checked)} />
                    Make site an installable app
                </label>
                {pwaSettings.enabled && (
                    <div className="mt-4 space-y-4 pt-4 border-t">
                        <Label>App Icon Style</Label>
                        <div className="flex gap-2 text-sm">
                            <label className="flex items-center gap-1"><input type="radio" name="iconType" value="generated" checked={pwaSettings.iconType === 'generated'} onChange={() => onUpdatePwaSettings('iconType', 'generated')} /> Generated</label>
                            <label className="flex items-center gap-1"><input type="radio" name="iconType" value="url" checked={pwaSettings.iconType === 'url'} onChange={() => onUpdatePwaSettings('iconType', 'url')} /> URL</label>
                            <label className="flex items-center gap-1"><input type="radio" name="iconType" value="upload" checked={pwaSettings.iconType === 'upload'} onChange={() => onUpdatePwaSettings('iconType', 'upload')} /> Upload</label>
                        </div>
                        
                        {pwaSettings.iconType === 'generated' && (
                            <div className="p-3 border rounded-lg bg-slate-50 mt-2 space-y-3">
                                <div className="flex justify-center">
                                    <img src={`data:image/svg+xml;base64,${btoa(generatePwaIconSVG(pwaSettings.iconGeneratedConfig, profileNameFirstLetter, 128))}`} alt="PWA Icon Preview" className="w-24 h-24 rounded-lg shadow-md bg-white"/>
                                </div>
                                <div><Label>Letter (defaults to profile name initial)</Label><PopoverInput value={pwaSettings.iconGeneratedConfig.letter} onChange={e => onUpdatePwaIconConfig('letter', e.target.value)} maxLength={1} /></div>
                                <div><Label>Letter Font</Label><PopoverInput as="select" value={pwaSettings.iconGeneratedConfig.fontFamily} onChange={e => onUpdatePwaIconConfig('fontFamily', e.target.value)}>{AVAILABLE_FONTS.map(f=><option key={f.name} value={f.family}>{f.name}</option>)}</PopoverInput></div>
                                <div><Label>Letter Color</Label><ColorPickerWithAlpha value={pwaSettings.iconGeneratedConfig.letterColor} onChange={v => onUpdatePwaIconConfig('letterColor', v)} /></div>
                                <hr/>
                                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={pwaSettings.iconGeneratedConfig.waves} onChange={e => onUpdatePwaIconConfig('waves', e.target.checked)} /> Use Wave Pattern</label>
                                {pwaSettings.iconGeneratedConfig.waves && <>
                                    <div><Label>Wave Complexity ({pwaSettings.iconGeneratedConfig.complexity})</Label><input type="range" min="2" max="15" value={pwaSettings.iconGeneratedConfig.complexity} onChange={e => onUpdatePwaIconConfig('complexity', parseInt(e.target.value, 10))} className="w-full" /></div>
                                    <div><Label>Wave Contrast ({pwaSettings.iconGeneratedConfig.contrast.toFixed(2)})</Label><input type="range" min="0.1" max="1.5" step="0.05" value={pwaSettings.iconGeneratedConfig.contrast} onChange={e => onUpdatePwaIconConfig('contrast', parseFloat(e.target.value))} className="w-full" /></div>
                                </>}
                                <div><Label>Background Color 1</Label><ColorPickerWithAlpha value={pwaSettings.iconGeneratedConfig.bgColor1} onChange={v => onUpdatePwaIconConfig('bgColor1', v)} /></div>
                                <div><Label>Background Color 2</Label><ColorPickerWithAlpha value={pwaSettings.iconGeneratedConfig.bgColor2} onChange={v => onUpdatePwaIconConfig('bgColor2', v)} /></div>
                            </div>
                        )}
                        
                        {pwaSettings.iconType === 'url' && (
                            <div>
                                <Label>Icon Image URL</Label>
                                <PopoverInput value={pwaSettings.iconUrl} placeholder="https://example.com/icon.png" onChange={e => onUpdatePwaSettings('iconUrl', e.target.value)} />
                            </div>
                        )}

                        {pwaSettings.iconType === 'upload' && (
                            <div>
                                <Label>Upload Icon (512x512 recommended)</Label>
                                <PopoverInput type="file" accept="image/*" onChange={onPwaIconUpload} className="p-1 text-xs" />
                                {pwaSettings.iconUploadUrl && <img src={pwaSettings.iconUploadUrl} alt="uploaded icon preview" className="w-24 h-24 rounded-lg mt-2 object-cover"/>}
                            </div>
                        )}

                    </div>
                )}
              </AccordionItem>
              <AccordionItem title="Randomize Settings" isOpen={openAccordion === 'Randomize Settings'} onToggle={() => toggleAccordion('Randomize Settings')}>
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">Theme & Colors</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.pageBackground} onChange={e => onUpdateRandomizeSetting('pageBackground', e.target.checked)} /> Page Background</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.cardBackground} onChange={e => onUpdateRandomizeSetting('cardBackground', e.target.checked)} /> Card Background & Text</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.buttonColors} onChange={e => onUpdateRandomizeSetting('buttonColors', e.target.checked)} /> Button Colors</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.qrCode} onChange={e => onUpdateRandomizeSetting('qrCode', e.target.checked)} /> QR Code Colors</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.appIcons} onChange={e => onUpdateRandomizeSetting('appIcons', e.target.checked)} /> App Icon Colors (Reset)</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.pwaIcon} onChange={e => onUpdateRandomizeSetting('pwaIcon', e.target.checked)} /> PWA Icon</label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">Style & Layout</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.font} onChange={e => onUpdateRandomizeSetting('font', e.target.checked)} /> Font</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.buttonStyle} onChange={e => onUpdateRandomizeSetting('buttonStyle', e.target.checked)} /> Button Shape</label>
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-500 mb-2">Animations</h4>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.buttonAnimation} onChange={e => onUpdateRandomizeSetting('buttonAnimation', e.target.checked)} /> Button Hover Animation</label>
                      <label className="flex items-center gap-2"><input type="checkbox" checked={randomizeSettings.appAnimation} onChange={e => onUpdateRandomizeSetting('appAnimation', e.target.checked)} /> App Icon Hover Animation</label>
                    </div>
                  </div>
                </div>
              </AccordionItem>
          </div>
        )
      default:
        return null;
    }
  };

  const dynamicStyle = isDesktop && cardHeight ? { maxHeight: `${cardHeight}px` } : {};
  const popoverZIndex = isPrimaryModalOpen ? 99 : 101;

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-40 md:hidden" style={{ zIndex: popoverZIndex - 1 }} onClick={onClose}></div>
      <div 
        style={{ ...dynamicStyle, zIndex: popoverZIndex }}
        className="fixed top-36 left-1/2 -translate-x-1/2 w-full max-w-sm bg-white rounded-lg shadow-2xl p-5 max-h-[calc(100vh-10rem)] flex flex-col text-slate-800 md:sticky md:top-36 md:self-start md:transform-none md:w-96 md:max-w-none md:flex-shrink-0 transition-all duration-300"
      >
        <div className="flex-shrink-0 flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-slate-800">{title}</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-800 text-2xl font-bold">&times;</button>
        </div>
        <div className="flex-grow space-y-4 overflow-y-auto custom-scrollbar pr-2 -mr-2">
          {renderContent()}
        </div>
      </div>
    </>
  );
};

export default EditPopover;