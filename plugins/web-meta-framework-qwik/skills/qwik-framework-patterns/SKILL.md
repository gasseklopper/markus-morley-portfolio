---
name: qwik-framework-patterns
description: Use when working in Qwik or Qwik City codebases, especially with component$, signals, stores, routeLoader$, routeAction$, server$, QRLs, lazy $ boundaries, event handlers, or serialization-sensitive code.
---

# Qwik Framework Patterns

Qwik is resumable: the server serializes application state into HTML and the client resumes without re-running the component tree through hydration. Every `$` suffix marks a lazy-loading boundary. Code captured across a `$` boundary must be serializable.

## Critical Rules

- Follow the project's local conventions first. If a `CLAUDE.md`, repo README, lint config, or existing component pattern exists, treat it as authoritative.
- Wrap every Qwik component in `component$()`. Plain function components cannot use hooks, cannot use `<Slot />`, and are not optimizer-friendly lazy boundaries.
- Keep `$` closures serializable. Do not capture class instances, DOM nodes, functions, request-specific objects, or other non-serializable runtime values.
- Use `routeLoader$` for initial server data in routes instead of fetching initial data from `useTask$` or `useResource$`.
- Export `routeLoader$` and `routeAction$` from route files such as `src/routes/**/index.tsx` or `layout.tsx`; misplaced or unexported loaders/actions will not participate in routing.
- Use declarative event modifiers such as `preventdefault:click`, `preventdefault:submit`, and `stoppropagation:click` instead of calling synchronous event APIs inside lazy handlers.
- Do not destructure top-level store properties. Destructuring a `useStore()` proxy breaks reactivity because it extracts plain values.

## Imports

- Import components, hooks, QRL helpers, and signals from `@builder.io/qwik`.
- Import routing primitives, `routeLoader$`, `routeAction$`, `Form`, validation helpers, and `server$` from `@builder.io/qwik-city`.
- Use `import type` for type-only imports when the project style expects it.

## Components

Use named exports for reusable components unless the route default export pattern applies.

```tsx
import { component$, useSignal } from "@builder.io/qwik";

interface CounterProps {
  initial?: number;
  label: string;
}

export const Counter = component$<CounterProps>(({ initial = 0, label }) => {
  const count = useSignal(initial);

  return (
    <button type="button" onClick$={() => count.value++}>
      {label}: {count.value}
    </button>
  );
});
```

Avoid plain function components when they are meant to be Qwik components:

```tsx
// Bad: hooks, Slot, and optimizer behavior rely on component$().
export const Counter = (props: { label: string }) => {
  return <div>{props.label}</div>;
};
```

## State

Use `useSignal()` for primitives, element refs, and small independent values. Access and mutate through `.value`.

Use `useStore()` for structured reactive objects. Keep the store reference intact and access properties directly.

```tsx
const user = useStore({
  name: "Alice",
  preferences: {
    theme: "dark",
  },
});

user.name = "Ada";
```

Do not destructure store properties at the top level:

```tsx
// Bad: name is no longer reactive.
const { name } = useStore({ name: "Alice" });
```

Use `useComputed$()` for synchronous derived values. It auto-tracks dependencies and returns a read-only signal.

## Tasks

- `useTask$()` runs before render on server and client. Use it for initialization and reactive side effects that can run before render.
- `useVisibleTask$()` runs in the browser after render. Reserve it for DOM APIs, animation libraries, measurements, and browser-only work.
- Use `track()` inside `useTask$()` to declare dependencies.
- Use `cleanup()` for timers, subscriptions, animation handles, and observers.

```tsx
useTask$(({ track, cleanup }) => {
  const searchTerm = track(() => query.value);
  const timer = setTimeout(() => {
    debouncedQuery.value = searchTerm;
  }, 300);

  cleanup(() => clearTimeout(timer));
});
```

## Events

Qwik event handlers are lazy-loaded. Synchronous event APIs may run too late, so prefer declarative modifiers and the handler's element parameter.

```tsx
<form preventdefault:submit onSubmit$={handleSubmit}>
  <input
    value={email.value}
    onInput$={(_, element) => {
      email.value = element.value;
    }}
  />
</form>
```

For reusable handlers, wrap with `$()`:

```tsx
const handleClick = $(() => {
  isOpen.value = !isOpen.value;
});
```

## Slots

Use `<Slot />` only inside `component$()`. Named slots use `q:slot` on direct children.

```tsx
import { component$, Slot } from "@builder.io/qwik";

export const Card = component$(() => {
  return (
    <article>
      <header>
        <Slot name="header" />
      </header>
      <Slot />
    </article>
  );
});
```

## Qwik City Data

Use `routeLoader$` for route-level initial server data:

```tsx
import { component$ } from "@builder.io/qwik";
import { routeLoader$ } from "@builder.io/qwik-city";

export const useProduct = routeLoader$(async (requestEvent) => {
  const productId = requestEvent.params.id;
  return getProduct(productId);
});

export default component$(() => {
  const product = useProduct();
  return <h1>{product.value.name}</h1>;
});
```

Use `routeAction$` with `<Form>` for mutations and progressive enhancement:

```tsx
import { component$ } from "@builder.io/qwik";
import { Form, routeAction$ } from "@builder.io/qwik-city";

export const useContactAction = routeAction$(async (data) => {
  await sendContactMessage(data);
  return { success: true };
});

export default component$(() => {
  const action = useContactAction();

  return (
    <Form action={action}>
      <input name="email" type="email" />
      <button type="submit" disabled={action.isRunning}>
        {action.isRunning ? "Sending..." : "Send"}
      </button>
    </Form>
  );
});
```

Use `server$` for ad-hoc server RPC when route loaders or actions are not the right shape. Keep arguments and return values serializable.

## Red Flags

- Plain components instead of `component$()`.
- Store destructuring that breaks reactivity.
- `event.preventDefault()` or `event.stopPropagation()` inside lazy handlers.
- `routeLoader$` or `routeAction$` hidden in non-route files without route-file exports.
- Non-serializable captures in `$` closures.
- Browser-only code in `useTask$()` instead of `useVisibleTask$()`.
- Initial route data fetched in client-visible lifecycle hooks instead of `routeLoader$`.
- Inline `<style>` tags inside components when scoped styles, global styles, or project SCSS should be used.
- Over-capturing a whole store or large object in a `$` closure when only a scalar value is needed.

## Review Checklist

When reviewing or changing Qwik code:

1. Confirm every component uses `component$()`.
2. Check `$` closures for serializable captures.
3. Verify route data uses exported route loaders/actions where appropriate.
4. Confirm stores are accessed through the store object, not destructured.
5. Replace synchronous event APIs with Qwik event attributes.
6. Prefer `useTask$()` unless browser-only APIs require `useVisibleTask$()`.
7. Keep imports split between `@builder.io/qwik` and `@builder.io/qwik-city`.
