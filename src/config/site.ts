import type { SiteInfo, SiteMetadata } from "./types";

export const siteMetadata: SiteMetadata = {
  author: "Markus Morley",
  image: "",
  description:
    "Personal portfolio of Markus Morley, interaction designer and frontend developer.",
  title: "Markus Morley Portfolio",
};

export const siteInfo: SiteInfo = {
  title: siteMetadata.title,
  description: siteMetadata.description,
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
  logoText: siteMetadata.author,
};

export const notFoundPage = {
  title: "404 - Page Not Found",
  description: "The page you are looking for does not exist.",
  link: {
    text: "Go to Home",
    url: "/",
  },
} as const;
