import type { FooterConfig, NavItem, SocialLink } from "./types";

export const headerNavigation = {
  logoText: "Markus Morley",
  nav: [
    {
      name: "Home",
      link: "/",
      folder: "src/routes",
      pattern: "index.tsx",
      type: "page",
    },
    {
      name: "404",
      link: "/404",
      folder: "src/routes/404",
      pattern: "folder/index.tsx",
      type: "page",
    },
    {
      name: "About",
      link: "/about",
      folder: "src/routes/about",
      pattern: "folder/index.tsx",
      type: "page",
    },
    {
      name: "Airplane Test",
      link: "/airplane-test",
      folder: "src/routes/airplane-test",
      pattern: "folder/index.tsx",
      type: "page",
    },
    {
      name: "API",
      link: "/api",
      folder: "src/routes/api",
      pattern: "folder",
      type: "route-group",
      children: [
        {
          name: "Todos API",
          link: "/api/todos",
          folder: "src/routes/api/todos",
          pattern: "folder/index.ts",
          type: "endpoint",
        },
      ],
    },
    {
      name: "Basic Start",
      link: "/basic-start",
      folder: "src/routes/basic-start",
      pattern: "folder/index.tsx + folder/layout.tsx",
      type: "page-with-layout",
    },
    {
      name: "Datenschutz",
      link: "/datenschutz",
      folder: "src/routes/datenschutz",
      pattern: "folder/index.tsx",
      type: "page",
    },
    {
      name: "Dynamic Buttons",
      link: "/dynamic-buttons",
      folder: "src/routes/dynamic-buttons",
      pattern: "folder/index.tsx",
      type: "page",
    },
    {
      name: "Impressum",
      link: "/impressum",
      folder: "src/routes/impressum",
      pattern: "folder/index.tsx",
      type: "page",
    },
    {
      name: "Konzept",
      link: "/konzept",
      flag: "konzept",
      folder: "src/routes/konzept",
      pattern: "folder/index.tsx",
      type: "page",
    },
    {
      name: "Portfolio",
      link: "/portfolio",
      folder: "src/routes/portfolio",
      pattern: "folder/index.tsx + folder/layout.tsx",
      type: "page-with-layout",
      children: [
        {
          name: "Color Theme",
          link: "/portfolio/color-theme",
          folder: "src/routes/portfolio/color-theme",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Farbkasten",
          link: "/portfolio/farbkasten",
          folder: "src/routes/portfolio/farbkasten",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Generative Art",
          link: "/portfolio/generative-art",
          folder: "src/routes/portfolio/generative-art",
          pattern: "folder/index.tsx",
          type: "page",
          children: [
            {
              name: "Color Palette",
              link: "/portfolio/generative-art/color-palette",
              folder: "src/routes/portfolio/generative-art/color-palette",
              pattern: "folder/index.tsx",
              type: "page",
            },
            {
              name: "Connected Agents",
              link: "/portfolio/generative-art/connected-agents",
              folder: "src/routes/portfolio/generative-art/connected-agents",
              pattern: "folder/index.tsx",
              type: "page",
            },
            {
              name: "Crayon",
              link: "/portfolio/generative-art/crayon",
              folder: "src/routes/portfolio/generative-art/crayon",
              pattern: "folder/index.tsx",
              type: "page",
            },
            {
              name: "Drip Sort",
              link: "/portfolio/generative-art/drip-sort",
              folder: "src/routes/portfolio/generative-art/drip-sort",
              pattern: "folder/index.tsx",
              type: "page",
            },
          ],
        },
        {
          name: "Project 011",
          link: "/portfolio/project011",
          folder: "src/routes/portfolio/project011",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Project 012",
          link: "/portfolio/project012",
          folder: "src/routes/portfolio/project012",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Project 013",
          link: "/portfolio/project013",
          folder: "src/routes/portfolio/project013",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Project 014",
          link: "/portfolio/project014",
          folder: "src/routes/portfolio/project014",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Project 015",
          link: "/portfolio/project015",
          folder: "src/routes/portfolio/project015",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Project 016",
          link: "/portfolio/project016",
          folder: "src/routes/portfolio/project016",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Project 017",
          link: "/portfolio/project017",
          folder: "src/routes/portfolio/project017",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Project 018",
          link: "/portfolio/project018",
          folder: "src/routes/portfolio/project018",
          pattern: "folder/index.tsx",
          type: "page",
        },
        {
          name: "Roman Numeral Converter",
          link: "/portfolio/roman-numeral-converter",
          folder: "src/routes/portfolio/roman-numeral-converter",
          pattern: "folder/index.tsx",
          type: "page",
        },
      ],
    },
    {
      name: "Scroll Transition",
      link: "/scroll-transition",
      folder: "src/routes/scroll-transition",
      pattern: "folder/index.tsx",
      type: "page",
    },
    {
      name: "Start",
      link: "/start",
      folder: "src/routes/start",
      pattern: "folder/index.tsx + folder/layout.tsx",
      type: "page-with-layout",
    },
    {
      name: "Todos",
      link: "/todos",
      folder: "src/routes/todos",
      pattern: "folder/index.tsx",
      type: "page",
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
    text: "info",
  },
  address: {
    name: "",
    link: "",
    iframeSrc: "",
  },
  promo: {
    bodytext: "Made with ♡ by Markus Morley",
    link: "https://markusmorley.de",
  },
  email: "",
  mobile: "",
  openDate: "",
  openTime: "",
  copyright: {
    enable: true,
    label: "© All rights reserved by",
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
        name: "Main Page",
        link: "/",
      },
      {
        name: "FAQ",
        link: "/faq",
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
        name: "404",
        link: "/404",
      },
      {
        name: "Datenschutz",
        link: "/datenschutz",
      },
      {
        name: "Impressum",
        link: "/impressum",
      },
      {
        name: "Contact",
        link: "/contact",
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
