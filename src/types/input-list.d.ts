import type { QwikJSX } from "@builder.io/qwik";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      input: QwikJSX.IntrinsicElements["input"] & {
        list?: string;
      };
    }
  }
}

export {};
