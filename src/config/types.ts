import type { FeatureFlag } from "~/utils/feature-flags";

export type SiteMetadata = {
  author: string;
  image: string;
  description: string;
  title: string;
};

export type SiteInfo = {
  title: string;
  description: string;
  baseUrl: string;
  favicon: string;
  logo: string;
  logoDark: string;
  logoWidth: string;
  logoHeight: string;
  logo2: string;
  logoDark2: string;
  logoWidth2: string;
  logoHeight2: string;
  logoText: string;
};

export type NavItem = {
  name: string;
  link: string;
  flag?: FeatureFlag;
  children?: readonly NavItem[];
};

export type SitemapRoute = {
  name: string;
  path: string;
  flag?: FeatureFlag;
};

export type SocialLink = {
  name: string;
  link: string;
  abbr?: string;
};

export type FooterConfig = {
  isFixed: boolean;
  floatingShape: string;
  brand: {
    logo: string;
    text: string;
  };
  address: {
    name: string;
    link: string;
    iframeSrc: string;
  };
  promo: {
    bodytext: string;
    link: string;
  };
  email: string;
  mobile: string;
  openDate: string;
  openTime: string;
  copyright: {
    enable: boolean;
    label: string;
    company: string;
    link: string;
  };
  subscription: {
    enable: boolean;
    title: string;
    subTitle: string;
    inputPlaceholder: string;
    buttonLabel: string;
    submitButton: {
      enable: boolean;
      image: string;
      imageDark: string;
    };
  };
  nav: {
    column1: readonly NavItem[];
    column2: readonly NavItem[];
  };
  social: readonly Required<SocialLink>[];
};

export type PortfolioVariation = "clean" | "primary" | "secondary";

export type PortfolioCategory =
  | "Creative Coding"
  | "Data Visualization"
  | "Design Systems"
  | "Frontend Prototype"
  | "Utility";

export type PortfolioStatus = "Live" | "Prototype" | "Study";

export type PortfolioImage = {
  src: string;
  alt: string;
};

export type PortfolioPreview =
  | {
      image: PortfolioImage;
      missingReason?: never;
    }
  | {
      image: null;
      missingReason: string;
    };

export type PortfolioPage = SitemapRoute & {
  title: string;
  description: string;
  badge: string;
  date: string;
  category: PortfolioCategory;
  status: PortfolioStatus;
  tech: readonly string[];
  order: number;
  variation?: PortfolioVariation;
  preview: PortfolioPreview;
  image?: PortfolioImage;
};

export type ThemePreferences = {
  light: string;
  dark: string;
  theme: string;
  cursor: string;
  layout: string;
  layoutDirection: string;
  overlay: string;
  motion: string;
};
