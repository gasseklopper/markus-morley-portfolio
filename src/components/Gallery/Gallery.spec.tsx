import { createDOM } from "@builder.io/qwik/testing";
import { afterEach, expect, test, vi } from "vitest";
import { Gallery } from "./Gallery";

afterEach(() => {
  vi.unstubAllGlobals();
});

const previous = '[aria-label="Previous images"]';
const next = '[aria-label="Next images"]';

test("gallery respects desktop bounds", async () => {
  const { screen, render, userEvent } = await createDOM();
  vi.stubGlobal("window", { innerWidth: 1024 });
  await render(<Gallery />);

  expect(screen.querySelectorAll("img")).toHaveLength(5);
  expect(screen.querySelector(previous)?.hasAttribute("disabled")).toBe(true);
  await userEvent(next, "click");
  await userEvent(next, "click");
  expect(screen.querySelector(next)?.hasAttribute("disabled")).toBe(true);
  expect(screen.querySelector(".gallery__meta")?.textContent).toBe("03/03");
  await userEvent(previous, "click");
  expect(screen.querySelector(".gallery__meta")?.textContent).toBe("02/03");
});

test("gallery initializes mobile bounds on visibility", async () => {
  const { screen, render, userEvent } = await createDOM();
  vi.stubGlobal("window", { innerWidth: 767 });
  await render(<Gallery />);
  await userEvent("section", "qvisible");
  expect(screen.querySelector(".gallery__meta")?.textContent).toBe("01/05");

  for (let index = 0; index < 4; index++) await userEvent(next, "click");
  expect(screen.querySelector(".gallery__meta")?.textContent).toBe("05/05");
  expect(screen.querySelector(next)?.hasAttribute("disabled")).toBe(true);

  await userEvent(previous, "click");
  expect(screen.querySelector(".gallery__meta")?.textContent).toBe("04/05");
});
