declare module "@builder.io/qwik" {
  interface HTMLAttributes<E extends Element> {
    list?: E extends HTMLInputElement ? string : never;
  }
}

export {};
