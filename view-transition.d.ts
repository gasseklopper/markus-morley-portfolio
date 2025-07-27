declare global {
  interface Document {
    startViewTransition?(callback: () => void | Promise<void>): void;
  }
}
export {};
