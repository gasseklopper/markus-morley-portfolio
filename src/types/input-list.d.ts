/* eslint-disable @typescript-eslint/no-unused-vars */
import type { JSX } from "@builder.io/qwik";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      input: JSX.IntrinsicElements["input"] & {
        list?: string;
      };
    }
  }
}

export {};
