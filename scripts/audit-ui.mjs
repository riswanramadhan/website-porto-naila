import { spawn } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

const baseUrl = process.argv[2] || "http://127.0.0.1:3000";
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const debuggingPort = 9223;
const auditDir = path.join(process.cwd(), ".next", "ui-audit");
const profileDir = path.join(auditDir, `chrome-profile-${Date.now()}`);
await fs.mkdir(profileDir, { recursive: true });

const chrome = spawn(
  chromePath,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-first-run",
    "--no-default-browser-check",
    `--remote-debugging-port=${debuggingPort}`,
    `--user-data-dir=${profileDir}`,
    "about:blank",
  ],
  { stdio: "ignore", windowsHide: true }
);

const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

const retry = async (callback, attempts = 40) => {
  let lastError;
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    try {
      return await callback();
    } catch (error) {
      lastError = error;
      await sleep(150);
    }
  }
  throw lastError;
};

let socket;
try {
  await retry(async () => {
    const response = await fetch(`http://127.0.0.1:${debuggingPort}/json/version`);
    if (!response.ok) throw new Error("Chrome DevTools is not ready");
    return response.json();
  });

  const targetResponse = await fetch(
    `http://127.0.0.1:${debuggingPort}/json/new?${encodeURIComponent(baseUrl)}`,
    { method: "PUT" }
  );
  const target = await targetResponse.json();
  socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  let messageId = 0;
  const pending = new Map();
  const consoleErrors = [];
  let imageResponses = [];
  let failedResponses = [];
  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      const { resolve, reject } = pending.get(message.id);
      pending.delete(message.id);
      if (message.error) reject(new Error(message.error.message));
      else resolve(message.result);
      return;
    }
    if (message.method === "Runtime.exceptionThrown") {
      consoleErrors.push(
        message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text
      );
    }
    if (message.method === "Log.entryAdded" && message.params.entry.level === "error") {
      consoleErrors.push(message.params.entry.text);
    }
    if (message.method === "Network.responseReceived" && message.params.type === "Image") {
      imageResponses.push({
        url: message.params.response.url,
        mimeType: message.params.response.mimeType,
        status: message.params.response.status,
      });
    }
    if (message.method === "Network.responseReceived" && message.params.response.status >= 400) {
      failedResponses.push({
        url: message.params.response.url,
        status: message.params.response.status,
        mimeType: message.params.response.mimeType,
        type: message.params.type,
      });
    }
  });

  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      messageId += 1;
      pending.set(messageId, { resolve, reject });
      socket.send(JSON.stringify({ id: messageId, method, params }));
    });

  const evaluate = async (expression) => {
    const result = await send("Runtime.evaluate", {
      expression,
      awaitPromise: true,
      returnByValue: true,
    });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };

  await send("Page.enable");
  await send("Runtime.enable");
  await send("Network.enable");
  await send("Log.enable");

  const widths = [320, 360, 390, 430, 768, 1440];
  const results = [];
  for (const width of widths) {
    imageResponses = [];
    failedResponses = [];
    await send("Emulation.setDeviceMetricsOverride", {
      width,
      height: width < 640 ? 844 : 900,
      deviceScaleFactor: 1,
      mobile: width < 768,
    });
    await send("Page.navigate", { url: `${baseUrl}/?audit=${width}` });
    await sleep(1700);

    const metrics = await evaluate(`(() => {
      const html = document.documentElement;
      const phones = Array.from(document.querySelectorAll('.editing-phone-card')).map((item) => {
        const rect = item.querySelector('.iphone-mockup')?.getBoundingClientRect();
        return rect ? { width: Math.round(rect.width * 100) / 100, height: Math.round(rect.height * 100) / 100 } : null;
      });
      const newsGrid = document.querySelector('.news-grid');
      const newsStyle = newsGrid ? getComputedStyle(newsGrid) : null;
      return {
        width: ${width},
        clientWidth: html.clientWidth,
        scrollWidth: html.scrollWidth,
        bodyScrollWidth: document.body.scrollWidth,
        overflowFree: html.scrollWidth === html.clientWidth,
        overflowElements: Array.from(document.querySelectorAll('body *'))
          .map((element) => ({ element, rect: element.getBoundingClientRect() }))
          .filter(({ rect }) => rect.width > 0 && (rect.right > html.clientWidth + 1 || rect.left < -1))
          .slice(0, 12)
          .map(({ element, rect }) => ({
            tag: element.tagName.toLowerCase(),
            className: typeof element.className === 'string' ? element.className : '',
            left: Math.round(rect.left * 10) / 10,
            right: Math.round(rect.right * 10) / 10,
            width: Math.round(rect.width * 10) / 10,
          })),
        splashVisible: Boolean(document.querySelector('.splash-screen')),
        splashClassActive: html.classList.contains('splash-active'),
        appInert: document.getElementById('app-shell')?.inert || false,
        heroRevealClass: document.querySelector('.hero-copy')?.className || '',
        heroOpacity: getComputedStyle(document.querySelector('.hero-copy')).opacity,
        heroImageLoaded: Boolean(document.querySelector('.hero-image')?.complete && document.querySelector('.hero-image')?.naturalWidth),
        phoneFrames: phones,
        phoneFramesEqual: phones.length === 2 && Math.abs(phones[0].width - phones[1].width) < 0.5 && Math.abs(phones[0].height - phones[1].height) < 0.5,
        newsSnap: newsStyle?.scrollSnapType || '',
        newsBehavior: newsStyle?.scrollBehavior || '',
        newsCardTransition: getComputedStyle(document.querySelector('.news-card')).transitionDuration,
        lazyImages: Array.from(document.images).filter((image) => image.loading === 'lazy').length,
        eagerImages: Array.from(document.images).filter((image) => image.loading === 'eager').length,
      };
    })()`);

    if (width === 390 || width === 1440) {
      const screenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
      await fs.writeFile(path.join(auditDir, `viewport-${width}.png`), Buffer.from(screenshot.data, "base64"));
    }

    if (width === 390) {
      metrics.phoneFramesSettled = await evaluate(`(async () => {
        document.querySelector('#editing')?.scrollIntoView({ behavior: 'auto' });
        await new Promise((resolve) => setTimeout(resolve, 1150));
        return Array.from(document.querySelectorAll('.editing-phone-card')).map((item) => {
          const rect = item.querySelector('.iphone-mockup')?.getBoundingClientRect();
          return rect ? { width: Math.round(rect.width * 100) / 100, height: Math.round(rect.height * 100) / 100 } : null;
        });
      })()`);
      const editingScreenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
      await fs.writeFile(path.join(auditDir, "editing-390.png"), Buffer.from(editingScreenshot.data, "base64"));
      metrics.newsAlignment = await evaluate(`(async () => {
        const grid = document.querySelector('.news-grid');
        const secondDot = document.querySelectorAll('.news-carousel-dots button')[1];
        secondDot?.click();
        await new Promise((resolve) => setTimeout(resolve, 120));
        const card = document.querySelectorAll('.news-card')[1];
        if (!grid || !card) return null;
        return Math.round((card.getBoundingClientRect().left - grid.getBoundingClientRect().left) * 100) / 100;
      })()`);
    }

    if (width === 1440) {
      metrics.projectFlip = await evaluate(`(async () => {
        const card = document.querySelector('.case-card');
        card?.scrollIntoView({ behavior: 'auto', block: 'center' });
        await new Promise((resolve) => setTimeout(resolve, 700));
        const front = card?.querySelector('.case-card-front');
        front?.click();
        await new Promise((resolve) => setTimeout(resolve, 700));
        const back = card?.querySelector('.case-card-back');
        const light = back ? getComputedStyle(back).backgroundColor : '';
        document.documentElement.dataset.theme = 'dark';
        const dark = back ? getComputedStyle(back).backgroundColor : '';
        return { flipped: card?.classList.contains('is-flipped'), light, dark, backVisible: back?.getAttribute('aria-hidden') === 'false' };
      })()`);
      const projectScreenshot = await send("Page.captureScreenshot", { format: "png", fromSurface: true });
      await fs.writeFile(path.join(auditDir, "project-flip-1440.png"), Buffer.from(projectScreenshot.data, "base64"));
    }

    metrics.imageMimeTypes = [...new Set(imageResponses.map((response) => response.mimeType))];
    metrics.failedImages = imageResponses.filter((response) => response.status >= 400).length;
    metrics.failedResponses = failedResponses;
    results.push(metrics);
  }

  const output = { baseUrl, results, consoleErrors: [...new Set(consoleErrors)] };
  await fs.writeFile(path.join(auditDir, "results.json"), JSON.stringify(output, null, 2));
  console.log(JSON.stringify(output, null, 2));
} finally {
  socket?.close();
  chrome.kill();
}
