import siteConfig from "~/config/siteConfig.json";

export const headerData = siteConfig.header_info;
export type HeaderData = typeof headerData;
export default headerData;
