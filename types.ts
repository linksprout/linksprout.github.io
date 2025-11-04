// Fix: Define and export all necessary types for the application.

export type GeneratorType = 'gradient' | 'image' | 'layered-waves' | 'blob' | 'blurry-gradient' | 'low-poly';

interface BaseGeneratorConfig {
  seed: number;
}

interface GradientConfig extends BaseGeneratorConfig {
  type: 'gradient';
  colors: [string, string];
  style: string;
}

interface ImageConfig extends BaseGeneratorConfig {
  type: 'image';
  url: string;
}

export interface HaikeiWaveConfig extends BaseGeneratorConfig {
    type: 'layered-waves';
    complexity: number;
    contrast: number;
    colors: string[];
}
interface BlobConfig extends BaseGeneratorConfig {
    type: 'blob';
    complexity: number;
    contrast: number;
    colors: string[];
}
interface BlurryGradientConfig extends BaseGeneratorConfig {
    type: 'blurry-gradient';
    complexity: number;
    contrast: number;
    colors: string[];
}
interface LowPolyConfig extends BaseGeneratorConfig {
    type: 'low-poly';
    complexity: number;
    contrast: number;
    colors: string[];
}

export type GeneratorConfig = GradientConfig | ImageConfig | HaikeiWaveConfig | BlobConfig | BlurryGradientConfig | LowPolyConfig;

export interface Appearance {
  pageBackgroundConfig: GeneratorConfig;
  cardBackgroundConfig: GeneratorConfig;
  profileNameColor: string;
  profileDescriptionColor: string;
  buttonTextColor: string;
  buttonBgColor: string;
  fontFamily: string;
  buttonWidth: number;
  appIconSize: number;
  buttonFontSize: number;
  buttonFontWeight: 'normal' | 'bold';
  buttonFontStyle: 'normal' | 'italic';
  buttonTextDecoration: 'none' | 'underline';
  profilePicSize: number;
  profileNameFontSize: number;
  profileDescriptionFontSize: number;
  buttonAnimation: string;
  appAnimation: string;
  customFontFamily: string | null;
  customFontUrl: string | null;
  cardFadeIn: boolean;
  cardFadeInSpeed: number;
  qrCodeColorDark: string;
  qrCodeColorLight: string;
  qrCodeSize: number;
  footerEnabled: boolean;
  footerText: string;
  footerFontSize: number;
}

export interface Profile {
  type: 'profile';
  id: string;
  picUrl: string;
  name: string;
  description: string;
  picShadow: string;
  nameFontWeight: 'normal' | 'bold';
  nameFontStyle: 'normal' | 'italic';
  nameTextDecoration: 'none' | 'underline';
  descriptionFontWeight: 'normal' | 'bold';
  descriptionFontStyle: 'normal' | 'italic';
  descriptionTextDecoration: 'none' | 'underline';
  nameTextShadow?: string;
  descriptionTextShadow?: string;
}

export interface Button {
  id: string;
  text: string;
  url: string;
  shadow: string;
  style: 'rounded-lg' | 'rounded-full' | 'rounded-none';
  icon: string;
}

export interface ButtonArray {
  type: 'buttonarray';
  id: string;
  buttons: Button[];
}

export interface AppIcon {
  id: string;
  icon: string;
  url: string;
  bg: string;
  color: string;
  shape: 'rounded-lg' | 'rounded-full' | 'rounded-none';
}

export interface Apps {
  type: 'apps';
  id: string;
  apps: AppIcon[];
}

export interface CallToAction {
  type: 'calltoaction';
  id: string;
  text: string;
  url: string;
  bgColor: string;
  textColor: string;
  alignment: 'left' | 'center' | 'right';
  paddingY: number;
  style: 'rounded-lg' | 'rounded-full' | 'rounded-none';
  shadow: string;
  animation: string;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
}

export interface BlockText {
  type: 'blocktext';
  id: string;
  content: string;
  textColor: string;
  fontSize: number;
  textAlign: 'left' | 'center' | 'right' | 'justify';
  bgColor: string;
  paddingY: number;
  paddingX: number;
  fontWeight: 'normal' | 'bold';
  fontStyle: 'normal' | 'italic';
  textDecoration: 'none' | 'underline';
}

export interface QRCode {
  type: 'qrcode';
  id: string;
  url: string;
}

export interface Embed {
  type: 'embed';
  id: string;
  content: string;
  paddingY: number;
  paddingX: number;
  shadow: string;
  borderWidth: number;
  borderColor: string;
  borderRadius: number;
}

export type Element = Profile | ButtonArray | Apps | CallToAction | BlockText | QRCode | Embed;

export interface RandomizeSettings {
  font: boolean;
  pageBackground: boolean;
  cardBackground: boolean;
  buttonStyle: boolean;
  buttonAnimation: boolean;
  appAnimation: boolean;
  pageWaves: boolean;
  cardWaves: boolean;
  buttonColors: boolean;
  qrCode: boolean;
  pwaIcon: boolean;
  appIcons: boolean;
}

export interface PwaIconGeneratedConfig {
  waves: boolean;
  bgColor1: string;
  bgColor2: string;
  letterColor: string;
  letter: string;
  fontFamily: string;
  complexity: number;
  contrast: number;
}

export interface PwaSettings {
  enabled: boolean;
  iconType: 'generated' | 'url' | 'upload';
  iconGeneratedConfig: PwaIconGeneratedConfig;
  iconUrl: string;
  iconUploadUrl: string | null;
}

export type MenuItemType = 'share' | 'install' | 'link';

export interface MenuItem {
  id: string;
  type: MenuItemType;
  text: string;
  url?: string;
  icon?: string;
}

export interface MenuSettings {
  enabled: boolean;
  items: MenuItem[];
  iconColor: string;
  textColor: string;
  bgColor: string;
  iconSize: number;
  itemFontSize: number;
  itemIconSize: number;
}

export interface State {
  appearance: Appearance;
  elements: Element[];
  randomizeSettings: RandomizeSettings;
  pwaSettings: PwaSettings;
  menuSettings: MenuSettings;
}

export interface SavedSite {
    id: number;
    name: string;
    state: State;
}

export type EditingTarget = Element | { type: 'settings', id: 'settings' } | { type: 'footer', id: 'footer' } | { type: 'menu', id: 'menu' };