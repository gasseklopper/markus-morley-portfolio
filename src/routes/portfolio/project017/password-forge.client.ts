export const copyPasswordToClipboard = async (password: string) => {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    throw new Error("Clipboard API unavailable");
  }

  await navigator.clipboard.writeText(password);
};
