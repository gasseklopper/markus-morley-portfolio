export const API_ROOTS = [
  "https://rpg-compendium.fly.dev/api",
  "https://rpg-creature-api.freecodecamp.rocks/api",
] as const;

export const resolveApiUrl = (root: string, path: string): string => {
  if (/^https?:\/\//i.test(path)) return path;
  const normalizedRoot = root.endsWith("/") ? root : `${root}/`;
  const normalizedPath = path.replace(/^\/+/, "");
  return new URL(normalizedPath, normalizedRoot).toString();
};
