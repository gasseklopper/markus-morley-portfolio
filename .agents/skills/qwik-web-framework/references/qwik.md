---
name: qwik-web-framework
description: Apply Qwik and Qwik City architecture patterns when implementing, refactoring, reviewing, or debugging this Qwik application.
---

# Qwik Web Framework

Use this skill whenever working on Qwik or Qwik City code in this repository.

Read:

- `references/qwik.md`

before making architectural decisions involving:

- Qwik components
- `$` boundaries
- `component$`
- `useSignal`
- `useStore`
- `useComputed$`
- `useTask$`
- `useVisibleTask$`
- event handlers
- slots
- route loaders
- route actions
- server functions
- serialization
- resumability

## Implementation rules

Prefer Qwik-native patterns over React-style patterns.

Preserve resumability.

Avoid unnecessary client-side execution.

Use `$` boundaries correctly.

Prefer server-side loaders/actions when data does not need to originate on the client.

Do not introduce `useVisibleTask$` when the behavior can be expressed through Qwik's resumable primitives.

Before completing a change:

1. Check the implementation against `references/qwik.md`.
2. Look for serialization problems.
3. Look for unnecessary hydration/client execution.
4. Check `$` boundaries and event handlers.
5. Check signals/stores/computed values for correct usage.
6. Run the project's existing typecheck, lint and test commands when available.