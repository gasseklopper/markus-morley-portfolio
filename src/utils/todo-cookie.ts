import type { CookieValue } from "@builder.io/qwik-city";
import type { TodoItem } from "./todo-types";

export const COOKIE_NAME = "studio_todos";
export const COOKIE_TTL: [number, "days"] = [30, "days"];

export const isPlainObject = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

export const isTodoItem = (value: unknown): value is TodoItem => {
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

export const sortTodos = (todos: Iterable<TodoItem>) =>
  [...todos].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

export const readTodosFromCookie = (
  cookieValue: CookieValue | null | undefined,
): TodoItem[] => {
  if (!cookieValue) {
    return [];
  }

  try {
    const parsed = cookieValue.json<unknown>();

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.filter(isTodoItem);
  } catch (error) {
    void error;
    return [];
  }
};

export const createTodoStore = (cookieValue: CookieValue | null | undefined) =>
  new Map(readTodosFromCookie(cookieValue).map((todo) => [todo.id, todo]));
