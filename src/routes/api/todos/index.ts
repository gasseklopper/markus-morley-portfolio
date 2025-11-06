import type { RequestHandler } from "@builder.io/qwik-city";
import type { TodoItem } from "~/utils/todo-types";

type TodoStore = Map<string, TodoItem>;

declare global {
  // eslint-disable-next-line no-var
  var __todoStore: TodoStore | undefined;
}

const getStore = (): TodoStore => {
  const globalStore = globalThis as typeof globalThis & { __todoStore?: TodoStore };

  if (!globalStore.__todoStore) {
    globalStore.__todoStore = new Map<string, TodoItem>();
  }

  return globalStore.__todoStore;
};

const sortTodos = (todos: Iterable<TodoItem>) =>
  [...todos].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isPostPayload = (body: unknown): body is { title: string } => {
  if (!isPlainObject(body)) {
    return false;
  }

  const record = body as Record<string, unknown>;
  return typeof record.title === "string";
};

type PatchPayload = {
  id: string;
  title?: string;
  completed?: boolean;
};

const isPatchPayload = (body: unknown): body is PatchPayload => {
  if (!isPlainObject(body)) {
    return false;
  }

  const record = body as Record<string, unknown>;

  if (typeof record.id !== "string") {
    return false;
  }

  if ("title" in record && typeof record.title !== "string") {
    return false;
  }

  if ("completed" in record && typeof record.completed !== "boolean") {
    return false;
  }

  return true;
};

export const onGet: RequestHandler = ({ json }) => {
  const store = getStore();
  json(200, sortTodos(store.values()));
};

export const onPost: RequestHandler = async ({ request, json, send }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    void error;
    send(400, { message: "Invalid JSON payload" });
    return;
  }

  if (!isPostPayload(body)) {
    send(400, { message: "A non-empty title is required" });
    return;
  }

  const title = body.title.trim();

  if (!title) {
    send(400, { message: "A non-empty title is required" });
    return;
  }

  const store = getStore();
  const id = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : Date.now().toString(36);
  const todo: TodoItem = {
    id,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  store.set(id, todo);
  json(201, todo);
};

export const onPatch: RequestHandler = async ({ request, json, send }) => {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    void error;
    send(400, { message: "Invalid JSON payload" });
    return;
  }

  if (!isPatchPayload(body)) {
    send(400, { message: "An id is required" });
    return;
  }

  const id = body.id.trim();

  if (!id) {
    send(400, { message: "An id is required" });
    return;
  }

  const store = getStore();
  const todo = store.get(id);

  if (!todo) {
    send(404, { message: "Todo not found" });
    return;
  }

  const nextTitle = body.title?.trim();

  if (nextTitle !== undefined && !nextTitle) {
    send(400, { message: "Updated title cannot be empty" });
    return;
  }

  if (nextTitle !== undefined) {
    todo.title = nextTitle;
  }

  if (typeof body.completed === "boolean") {
    todo.completed = body.completed;
  }

  store.set(id, todo);
  json(200, todo);
};

export const onDelete: RequestHandler = ({ request, json, send }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    send(400, { message: "An id query parameter is required" });
    return;
  }

  const store = getStore();

  if (!store.has(id)) {
    send(404, { message: "Todo not found" });
    return;
  }

  store.delete(id);
  json(200, { id });
};
