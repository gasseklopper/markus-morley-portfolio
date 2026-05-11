import type { SiteInfo, SiteMetadata } from "./types";

export const siteMetadata: SiteMetadata = {
  author: "Markus Morley",
  image: "",
  description: "Markus Morley personal portfolio website",
  title: "Markus Morley personal portfolio",
};

export const siteInfo: SiteInfo = {
  title: "Markus Morley personal portfolio",
  description: "",
  baseUrl: "",
  favicon: "/assets/favicon.png",
  logo: "",
  logoDark: "",
  logoWidth: "",
  logoHeight: "",
  logo2: "",
  logoDark2: "",
  logoWidth2: "",
  logoHeight2: "",
  logoText: "Markus Morley",
};

export const notFoundPage = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
  link: {
    text: "Go to Home",
    url: "/",
  },
} as const;
