import { spawn } from "node:child_process";
import { mkdtemp, writeFile, rm, realpath, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";

// Native BiDi avoids Cypress 12's retired Firefox CDP dependency. Requires Node 22+.
const profile = await mkdtemp(join(tmpdir(), "portfolio-firefox-"));
const reducedMotion = process.env.REDUCED_MOTION === "1";
await writeFile(
  join(profile, "user.js"),
  `user_pref("ui.prefersReducedMotion", ${reducedMotion ? 1 : 0});`,
);
const port = 9237;
const firefox = spawn(
  process.env.FIREFOX_BIN ?? "C:/Program Files/Mozilla Firefox/firefox.exe",
  [
    "--headless",
    "--no-remote",
    "--profile",
    profile,
    "--remote-debugging-port",
    String(port),
  ],
  { windowsHide: true, stdio: "ignore" },
);
let socket;
let launchError;
firefox.on("error", (error) => {
  launchError = error;
});
const pending = new Map();
let sequence = 0;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const id = ++sequence;
    const timeout = setTimeout(() => {
      pending.delete(id);
      reject(new Error(`Timed out: ${method}`));
    }, 20000);
    pending.set(id, {
      resolve: (result) => {
        clearTimeout(timeout);
        resolve(result);
      },
      reject: (error) => {
        clearTimeout(timeout);
        reject(error);
      },
    });
    socket.send(JSON.stringify({ id, method, params }));
  });

try {
  for (let attempt = 0; attempt < 30; attempt++) {
    if (launchError) throw launchError;
    try {
      socket = new WebSocket(`ws://127.0.0.1:${port}/session`);
      await new Promise((resolve, reject) => {
        socket.addEventListener("open", resolve, { once: true });
        socket.addEventListener("error", reject, { once: true });
      });
      break;
    } catch {
      await sleep(300);
    }
  }
  if (socket?.readyState !== WebSocket.OPEN)
    throw new Error("Could not connect to Firefox BiDi");
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (message.id) {
      const request = pending.get(message.id);
      pending.delete(message.id);
      if (message.type === "error")
        request?.reject(new Error(JSON.stringify(message)));
      else request?.resolve(message.result);
    } else if (
      message.method === "log.entryAdded" &&
      message.params.level === "error"
    ) {
      console.error("Browser error:", message.params.text);
    }
  });
  const session = await send("session.new", {
    capabilities: { alwaysMatch: { acceptInsecureCerts: true } },
  });
  console.log("Firefox", session.capabilities.browserVersion);
  await send("session.subscribe", { events: ["log.entryAdded"] });
  const { context } = await send("browsingContext.create", { type: "tab" });
  await send("browsingContext.setViewport", {
    context,
    viewport: { width: 1280, height: 900 },
  });
  await send("browsingContext.navigate", {
    context,
    url: process.env.TEST_URL ?? "http://127.0.0.1:5173/",
    wait: "complete",
  });
  const evaluate = async (expression) => {
    const result = await send("script.evaluate", {
      expression,
      target: { context },
      awaitPromise: true,
    });
    if (result.type === "exception")
      throw new Error(JSON.stringify(result.exceptionDetails));
    return result.result.value;
  };
  const expect = async (expression, label) => {
    for (let attempt = 0; attempt < 60; attempt++) {
      if (await evaluate(expression)) {
        console.log(`PASS ${label}`);
        return;
      }
      await sleep(150);
    }
    throw new Error(`Failed: ${label}`);
  };
  if (reducedMotion) {
    await expect(
      `getComputedStyle(document.querySelector('[data-title-char]')).opacity === '1' && document.querySelectorAll('.pin-spacer').length === 0`,
      "reduced motion keeps content visible without pinning",
    );
    await expect(
      `(() => { const groups = document.querySelectorAll('[data-statement-group]'); return groups[1].getBoundingClientRect().top >= groups[0].getBoundingClientRect().bottom; })()`,
      "static statement groups do not overlap",
    );
  } else {
    await sleep(3500);
    await expect(
      `document.querySelectorAll('.pin-spacer').length === 2 && getComputedStyle(document.querySelector('[data-title-char]')).opacity === '1'`,
      "intro and scroll triggers initialized",
    );
    await expect(
      `getComputedStyle(document.querySelector('[data-test-codex]')).overflowY === 'visible'`,
      "no nested vertical scroll container",
    );
    console.log(
      "Initial",
      await evaluate(
        `JSON.stringify({motion:document.documentElement.dataset.motion, reduced:matchMedia('(prefers-reduced-motion: reduce)').matches, title:getComputedStyle(document.querySelector('[data-title-char]')).opacity, overflow:getComputedStyle(document.querySelector('[data-test-codex]')).overflow, pins:document.querySelectorAll('.pin-spacer').length})`,
      ),
    );
    await evaluate(
      `window.scrollTo({top:document.querySelector('[data-statement]').getBoundingClientRect().top+scrollY+700,behavior:'instant'})`,
    );
    await sleep(2000);
    await expect(
      `getComputedStyle(document.querySelector('[data-statement-phrase]')).opacity === '1' && Math.abs(document.querySelector('[data-statement]').getBoundingClientRect().top) < 2`,
      "first statement is revealed and pinned",
    );
    console.log(
      "Scrolled",
      await evaluate(
        `JSON.stringify({scrollY,top:document.querySelector('[data-statement]').getBoundingClientRect().top,group:getComputedStyle(document.querySelector('[data-statement-group]')).visibility,phrase:getComputedStyle(document.querySelector('[data-statement-phrase]')).opacity})`,
      ),
    );
    const screenshot = await send("browsingContext.captureScreenshot", {
      context,
    });
    await mkdir("cypress/screenshots/firefox", { recursive: true });
    await writeFile(
      "cypress/screenshots/firefox/home.png",
      Buffer.from(screenshot.data, "base64"),
    );
    await evaluate(`window.scrollTo({top:0,behavior:'instant'})`);
    await send("input.performActions", {
      context,
      actions: [
        {
          type: "wheel",
          id: "wheel",
          actions: [
            {
              type: "scroll",
              x: 900,
              y: 450,
              deltaX: 0,
              deltaY: 1600,
              duration: 500,
              origin: "viewport",
            },
          ],
        },
      ],
    });
    await expect(
      `scrollY > 1000 && getComputedStyle(document.querySelector('[data-statement-phrase]')).opacity === '1'`,
      "native wheel scrolling advances the animation",
    );
    await evaluate(
      `window.scrollTo({top:document.querySelector('[data-chapter-section]').getBoundingClientRect().top+scrollY-300,behavior:'instant'})`,
    );
    await expect(
      `getComputedStyle(document.querySelector('[data-chapter-card]')).opacity === '1'`,
      "later career cards reveal on scroll",
    );
    await evaluate(
      `document.querySelector('[aria-controls="site-menu"]').click()`,
    );
    await sleep(3200);
    await expect(
      `document.querySelector('[aria-controls="site-menu"]').getAttribute('aria-expanded') === 'true' && getComputedStyle(document.querySelector('#site-menu')).visibility === 'visible'`,
      "menu opens",
    );
    console.log(
      "Menu",
      await evaluate(
        `JSON.stringify({open:document.querySelector('[aria-controls="site-menu"]').getAttribute('aria-expanded'),visible:getComputedStyle(document.querySelector('#site-menu')).visibility})`,
      ),
    );
    await send("input.performActions", {
      context,
      actions: [
        {
          type: "key",
          id: "keyboard",
          actions: [
            { type: "keyDown", value: "\uE00C" },
            { type: "keyUp", value: "\uE00C" },
          ],
        },
      ],
    });
    await sleep(1600);
    await expect(
      `document.querySelector('[aria-controls="site-menu"]').getAttribute('aria-expanded') === 'false' && document.querySelector('#site-menu').inert`,
      "Escape closes menu and removes its links from tab order",
    );
    console.log(
      "Escape",
      await evaluate(
        `document.querySelector('[aria-controls="site-menu"]').getAttribute('aria-expanded')`,
      ),
    );
    await evaluate(
      `document.querySelector('[aria-controls="site-menu"]').click()`,
    );
    await sleep(3200);
    await evaluate(
      `document.querySelector('#site-menu .menu__col-links a[href="/about"]').click()`,
    );
    await sleep(3500);
    console.log(
      "Away",
      await evaluate(
        `JSON.stringify({path:location.pathname,overlay:getComputedStyle(document.querySelector('.page-transition')).display})`,
      ),
    );
    await evaluate(
      `document.querySelector('.navigation__logo a[href="/"]').click()`,
    );
    await sleep(4000);
    await expect(
      `location.pathname === '/' && document.querySelectorAll('.pin-spacer').length === 2 && getComputedStyle(document.querySelector('[data-title-char]')).opacity === '1'`,
      "homepage animations resume after navigation",
    );
    console.log(
      "Returned",
      await evaluate(
        `JSON.stringify({path:location.pathname,title:getComputedStyle(document.querySelector('[data-title-char]')).opacity,overlay:getComputedStyle(document.querySelector('.page-transition')).display,pins:document.querySelectorAll('.pin-spacer').length})`,
      ),
    );
    await evaluate(
      `window.scrollTo({top:document.querySelector('[data-statement]').getBoundingClientRect().top+scrollY+700,behavior:'instant'})`,
    );
    await expect(
      `getComputedStyle(document.querySelector('[data-statement-phrase]')).opacity === '1' && Math.abs(document.querySelector('[data-statement]').getBoundingClientRect().top) < 2`,
      "scroll animation works after returning home",
    );
  }
  await send("browser.close");
} finally {
  socket?.close();
  firefox.kill();
  await sleep(500);
  // Only remove the exact temporary profile created by this process.
  const resolved = await realpath(profile);
  if (
    dirname(resolved).toLowerCase() === (await realpath(tmpdir())).toLowerCase()
  ) {
    await rm(resolved, {
      recursive: true,
      force: true,
      maxRetries: 5,
      retryDelay: 200,
    });
  }
}
