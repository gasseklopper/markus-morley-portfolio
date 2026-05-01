import type { RequestHandler } from "@builder.io/qwik-city";
import type { TodoItem } from "~/utils/todo-types";

const COOKIE_NAME = "studio_todos";
const COOKIE_TTL: [number, "days"] = [30, "days"];

type TodoStore = Map<string, TodoItem>;

const sortTodos = (todos: Iterable<TodoItem>) =>
  [...todos].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isTodoItem = (value: unknown): value is TodoItem => {
  if (!isPlainObject(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;

  return (
    typeof record.id === "string" &&
    typeof record.title === "string" &&
    typeof record.createdAt === "string" &&
    typeof record.completed === "boolean"
  );
};

const readStore = (event: Parameters<RequestHandler>[0]): TodoStore => {
  const cookieValue = event.cookie.get(COOKIE_NAME);

  if (!cookieValue) {
    return new Map();
  }

  try {
    const parsed = cookieValue.json<unknown>();

    if (!Array.isArray(parsed)) {
      return new Map();
    }

    const todos = parsed.filter(isTodoItem);
    return new Map(todos.map((todo) => [todo.id, todo]));
  } catch (error) {
    void error;
    return new Map();
  }
};

const persistStore = (event: Parameters<RequestHandler>[0], store: TodoStore) => {
  const sortedTodos = sortTodos(store.values());
  const { request } = event;
  const requestUrl = new URL(request.url);

  event.cookie.set(COOKIE_NAME, JSON.stringify(sortedTodos), {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_TTL,
    secure: requestUrl.protocol === "https:",
  });
};

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

export const onGet: RequestHandler = (event) => {
  const store = readStore(event);
  event.json(200, sortTodos(store.values()));
};

export const onPost: RequestHandler = async (event) => {
  const { request } = event;
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    void error;
    event.send(400, { message: "Invalid JSON payload" });
    return;
  }

  if (!isPostPayload(body)) {
    event.send(400, { message: "A non-empty title is required" });
    return;
  }

  const title = body.title.trim();

  if (!title) {
    event.send(400, { message: "A non-empty title is required" });
    return;
  }

  const store = readStore(event);
  const id = typeof crypto?.randomUUID === "function" ? crypto.randomUUID() : Date.now().toString(36);
  const todo: TodoItem = {
    id,
    title,
    completed: false,
    createdAt: new Date().toISOString(),
  };

  store.set(id, todo);
  persistStore(event, store);
  event.json(201, todo);
};

export const onPatch: RequestHandler = async (event) => {
  const { request } = event;
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    void error;
    event.send(400, { message: "Invalid JSON payload" });
    return;
  }

  if (!isPatchPayload(body)) {
    event.send(400, { message: "An id is required" });
    return;
  }

  const id = body.id.trim();

  if (!id) {
    event.send(400, { message: "An id is required" });
    return;
  }

  const store = readStore(event);
  const todo = store.get(id);

  if (!todo) {
    event.send(404, { message: "Todo not found" });
    return;
  }

  const nextTitle = body.title?.trim();

  if (nextTitle !== undefined && !nextTitle) {
    event.send(400, { message: "Updated title cannot be empty" });
    return;
  }

  if (nextTitle !== undefined) {
    todo.title = nextTitle;
  }

  if (typeof body.completed === "boolean") {
    todo.completed = body.completed;
  }

  store.set(id, todo);
  persistStore(event, store);
  event.json(200, todo);
};

export const onDelete: RequestHandler = (event) => {
  const url = new URL(event.request.url);
  const id = url.searchParams.get("id");

  if (!id) {
    event.send(400, { message: "An id query parameter is required" });
    return;
  }

  const store = readStore(event);

  if (!store.has(id)) {
    event.send(404, { message: "Todo not found" });
    return;
  }

  store.delete(id);
  persistStore(event, store);
  event.json(200, { id });
};
