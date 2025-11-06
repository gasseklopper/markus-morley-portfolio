import { $, Resource, component$, useResource$, useSignal, useStylesScoped$ } from "@builder.io/qwik";
import { useLocation, useRequestEvent, type DocumentHead } from "@builder.io/qwik-city";
import siteConfig from "~/config/siteConfig.json";
import { buildHead } from "~/utils/head";
import type { TodoItem } from "~/utils/todo-types";
import styles from "./index.scss?inline";

const formatTimestamp = (timestamp: string) =>
  new Date(timestamp).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });

export default component$(() => {
  useStylesScoped$(styles);

  const location = useLocation();
  const requestEvent = useRequestEvent();
  const refreshSignal = useSignal(0);
  const newTodo = useSignal("");
  const isSubmitting = useSignal(false);
  const errorMessage = useSignal<string | null>(null);

  const todosResource = useResource$<TodoItem[]>(async ({ track }) => {
    track(() => refreshSignal.value);

    const todosEndpoint = import.meta.env.SSR
      ? new URL("/api/todos", location.url).toString()
      : "/api/todos";
    const cookieHeader =
      import.meta.env.SSR && requestEvent
        ? requestEvent.request.headers.get("cookie") ?? undefined
        : undefined;

    const response = await fetch(todosEndpoint, {
      credentials: "include",
      ...(cookieHeader ? { headers: { Cookie: cookieHeader } } : {}),
    });

    if (!response.ok) {
      throw new Error("Failed to load todos");
    }

    const todos = (await response.json()) as TodoItem[];
    return todos;
  });

  const addTodo = $(async () => {
    const title = newTodo.value.trim();

    if (!title) {
      errorMessage.value = "Add a task title before submitting.";
      return;
    }

    isSubmitting.value = true;

    try {
      const todosEndpoint = import.meta.env.SSR
        ? new URL("/api/todos", location.url).toString()
        : "/api/todos";
      const response = await fetch(todosEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
        credentials: "include",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Unable to add todo");
      }

      newTodo.value = "";
      errorMessage.value = null;
      refreshSignal.value++;
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Unable to add todo";
    } finally {
      isSubmitting.value = false;
    }
  });

  const toggleCompletion = $(async (todo: TodoItem) => {
    try {
      const todosEndpoint = import.meta.env.SSR
        ? new URL("/api/todos", location.url).toString()
        : "/api/todos";
      const response = await fetch(todosEndpoint, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: todo.id, completed: !todo.completed }),
        credentials: "include",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Unable to update todo");
      }

      refreshSignal.value++;
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Unable to update todo";
    }
  });

  const removeTodo = $(async (id: string) => {
    try {
      const deleteEndpoint = import.meta.env.SSR
        ? new URL(`/api/todos?id=${encodeURIComponent(id)}`, location.url).toString()
        : `/api/todos?id=${encodeURIComponent(id)}`;
      const response = await fetch(deleteEndpoint, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => null)) as { message?: string } | null;
        throw new Error(payload?.message ?? "Unable to delete todo");
      }

      refreshSignal.value++;
    } catch (error) {
      errorMessage.value =
        error instanceof Error ? error.message : "Unable to delete todo";
    }
  });

  return (
    <section class="todo-app">
      <header>
        <h1>Studio Todo List</h1>
        <p class="todo-description">
          A lightweight backlog backed by Qwik City server endpoints. Track tasks
          for the team, mark them complete, or clear them entirely—perfect for
          showcasing how a Netlify-hosted backend can power UI interactions.
        </p>
        <p class="todo-description">
          Todos live in a secure, per-browser cookie, so your list survives new
          deployments while remaining private to this device.
        </p>
      </header>

      <form
        class="todo-form"
        preventdefault:submit
        onSubmit$={addTodo}
        aria-label="Add a task to the todo list"
      >
        <input
          type="text"
          name="title"
          placeholder="Ship homepage animation refinements"
          value={newTodo.value}
          onInput$={(event) => {
            const target = event.target as HTMLInputElement;
            newTodo.value = target.value;
          }}
          aria-label="Todo title"
        />
        <button type="submit" disabled={isSubmitting.value}>
          {isSubmitting.value ? "Adding…" : "Add task"}
        </button>
      </form>

      {errorMessage.value ? (
        <p class="todo-error" role="alert">
          {errorMessage.value}
        </p>
      ) : null}

      <Resource
        value={todosResource}
        onPending={() => <p>Loading tasks…</p>}
        onRejected={(error) => (
          <p class="todo-error" role="alert">
            {error.message}
          </p>
        )}
        onResolved={(todos) => (
          <>
            {todos.length === 0 ? (
              <p class="todo-empty">No tasks yet. Add one to get started!</p>
            ) : (
              <ul class="todo-list">
                {todos.map((todo) => (
                  <li key={todo.id} class="todo-item">
                    <label>
                      <input
                        type="checkbox"
                        checked={todo.completed}
                        onChange$={() => toggleCompletion(todo)}
                        aria-label={`Mark ${todo.title} as ${todo.completed ? "incomplete" : "complete"}`}
                      />
                      <span
                        class={"todo-title" + (todo.completed ? " completed" : "")}
                      >
                        {todo.title}
                      </span>
                    </label>
                    <div class="todo-meta">
                      Added {formatTimestamp(todo.createdAt)}
                    </div>
                    <div class="todo-actions">
                      <button
                        type="button"
                        onClick$={() => removeTodo(todo.id)}
                        aria-label={`Remove ${todo.title}`}
                      >
                        Remove
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      />
    </section>
  );
});

export const head: DocumentHead = buildHead(
  `Todo List - ${siteConfig.metadata.title}`,
  "Collaborative task list demonstrating a Netlify-backed Qwik City API.",
);
