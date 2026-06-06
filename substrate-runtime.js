// substrate-runtime.js
// Full deterministic WCO Substrate Runtime (physics-first, MV3-safe)
// Combines: physics kernel + module loader + legacy API surface

import { createPhysicsLayer } from "./physics/physics-index.js";

async function loadModulesFromJSON() {
  const url = chrome.runtime.getURL("plugins.json");
  const res = await fetch(url);
  const data = await res.json();

  const loaded = [];

  for (const path of data.modules) {
    const moduleURL = chrome.runtime.getURL(path);
    const mod = await import(moduleURL);
    loaded.push(mod.default);
  }

  return loaded;
}

let initialized = false;
let shuttingDown = false;

let physics = null;
let ctx = null;
let loadedModules = [];
const moduleContexts = new Map();

// ---------------------------------------------------------------------------
// 1. Build global + per-module contexts
// ---------------------------------------------------------------------------
function buildCtx(physics) {
  const ctx = {
    physics,
    now: () => Date.now(),
    log: (...a) => console.log("[substrate]", ...a),
    warn: (...a) => console.warn("[substrate]", ...a),
    error: (...a) => console.error("[substrate]", ...a),
  };

  // Expose all physics engines directly
  for (const [key, engine] of Object.entries(physics)) {
    ctx[key] = engine;
  }

  return ctx;
}

function buildModuleCtx(globalCtx, moduleName) {
  const moduleCtx = Object.create(globalCtx);

  moduleCtx.module = moduleName;

  moduleCtx.log = (...a) => globalCtx.log(`[${moduleName}]`, ...a);
  moduleCtx.warn = (...a) => globalCtx.warn(`[${moduleName}]`, ...a);
  moduleCtx.error = (...a) => globalCtx.error(`[${moduleName}]`, ...a);

  return moduleCtx;
}

// ---------------------------------------------------------------------------
// 2. INIT (legacy API)
// ---------------------------------------------------------------------------
async function init(options = {}) {
  if (initialized) return { ok: true };
  initialized = true;

  physics = createPhysicsLayer(options);
  ctx = buildCtx(physics);

  ctx.log("Initializing substrate runtime…");

  loadedModules = await loadModulesFromJSON();

  for (const mod of loadedModules) {
    const name = mod.name || mod.id || "anonymous-module";
    const moduleCtx = buildModuleCtx(ctx, name);

    moduleContexts.set(mod, moduleCtx);

    if (typeof mod.init === "function") {
      await mod.init(moduleCtx);
    }
  }

  ctx.log("Substrate runtime initialized.");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// 3. TICK (legacy API)
// ---------------------------------------------------------------------------
async function tick() {
  if (!initialized || shuttingDown) return { ok: false };
  if (!physics) return { ok: false };

  // Run physics tick handlers
  physics.tick.handlers.forEach(fn => fn());

  // Notify modules
  for (const mod of loadedModules) {
    if (typeof mod.onTick === "function") {
      const moduleCtx = moduleContexts.get(mod) || ctx;
      await mod.onTick(moduleCtx);
    }
  }

  return {
    ok: true,
    actions: [] // background.js expects this
  };
}

// ---------------------------------------------------------------------------
// 4. INGEST BROWSER EVENT (legacy API)
// ---------------------------------------------------------------------------
async function ingestBrowserEvent(event) {
  if (!initialized || shuttingDown) return { ok: false };
  if (!physics) return { ok: false };

  // Record witness (if engine supports it)
  if (ctx.witness && ctx.witness.record) {
    ctx.witness.record({
      type: "browserEvent",
      payload: event,
      ts: ctx.now(),
    });
  }

  // Notify modules
  for (const mod of loadedModules) {
    if (typeof mod.onBrowserEvent === "function") {
      const moduleCtx = moduleContexts.get(mod) || ctx;
      await mod.onBrowserEvent(moduleCtx, event);
    }
  }

  return { ok: true };
}

// ---------------------------------------------------------------------------
// 5. SHUTDOWN (legacy API)
// ---------------------------------------------------------------------------
async function shutdown() {
  if (shuttingDown) return { ok: true };
  shuttingDown = true;

  ctx?.log("Shutting down substrate runtime…");

  for (const mod of loadedModules) {
    if (typeof mod.shutdown === "function") {
      const moduleCtx = moduleContexts.get(mod) || ctx;
      await mod.shutdown(moduleCtx);
    }
  }

  if (physics?.tick?.stop) {
    physics.tick.stop();
  }

  ctx?.log("Substrate runtime shut down.");
  return { ok: true };
}

// ---------------------------------------------------------------------------
// 6. MV3 message listener (legacy supervisor protocol)
// ---------------------------------------------------------------------------
chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  switch (msg?.kind) {
    case "substrate.init":
      init(msg.options).then(sendResponse);
      break;

    case "substrate.tick":
      tick().then(sendResponse);
      break;

    case "substrate.browserEvent":
      ingestBrowserEvent(msg.event).then(sendResponse);
      break;

    case "substrate.shutdown":
      shutdown().then(sendResponse);
      break;

    default:
      break;
  }

  return true; // async
});

// ---------------------------------------------------------------------------
// 7. Export for debugging
// ---------------------------------------------------------------------------
export default {
  init,
  tick,
  ingestBrowserEvent,
  shutdown,
  getCtx: () => ctx,
  getPhysics: () => physics,
};
