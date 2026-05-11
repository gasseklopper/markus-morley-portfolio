import type { FooterConfig, NavItem, SocialLink } from "./types";
import { portfolioNavItems } from "./portfolio";

export const headerNavigation = {
  logoText: "Markus Morley",
  nav: [
    {
      name: "Home",
      link: "/",
    },
    {
      name: "About",
      link: "/about",
    },
    {
      name: "Portfolio",
      link: "/portfolio",
      children: portfolioNavItems,
    },
  ],
} as const satisfies { logoText: string; nav: readonly NavItem[] };

export const siteSocialLinks = [
  {
    name: "Instagram",
    link: "https://www.instagram.com/yelrom_/",
  },
  {
    name: "Behance",
    link: "https://www.behance.net/markusmorley",
  },
  {
    name: "GitHub",
    link: "https://github.com/gasseklopper",
  },
] as const satisfies readonly SocialLink[];

export const footerConfig = {
  isFixed: false,
  floatingShape: "",
  brand: {
    logo: "/assets/favicon.png",
    text: "Markus Morley",
  },
  address: {
    name: "",
    link: "",
    iframeSrc: "",
  },
  promo: {
    bodytext: "Made with love by Markus Morley",
    link: "https://markusmorley.de",
  },
  email: "",
  mobile: "",
  openDate: "",
  openTime: "",
  copyright: {
    enable: true,
    label: "(c) All rights reserved by",
    company: "",
    link: "",
  },
  subscription: {
    enable: true,
    title: "",
    subTitle: "",
    inputPlaceholder: "Enter your email",
    buttonLabel: "submit",
    submitButton: {
      enable: true,
      image: "",
      imageDark: "",
    },
  },
  nav: {
    column1: [
      {
        name: "Home",
        link: "/",
      },
      {
        name: "Portfolio",
        link: "/portfolio",
      },
      {
        name: "About",
        link: "/about",
      },
    ],
    column2: [
      {
        name: "Datenschutz",
        link: "/datenschutz",
      },
      {
        name: "Impressum",
        link: "/impressum",
      },
    ],
  },
  social: [
    {
      name: "Instagram",
      link: "https://www.instagram.com/yelrom_/",
      abbr: "In",
    },
    {
      name: "GitHub",
      link: "https://github.com/gasseklopper",
      abbr: "Gh",
    },
    {
      name: "LinkedIn",
      link: "https://www.linkedin.com/in/markus-morley/",
      abbr: "Li",
    },
  ],
} as const satisfies FooterConfig;
