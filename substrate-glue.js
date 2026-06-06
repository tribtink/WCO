// substrate-glue.js — Substrate OS Kernel Bridge (Level-Up Version)

import { Registry } from "./registry.js";
import { getLocalState, saveLocalState } from "./storage-helpers.js";

// Load plugin manifest
async function loadManifest() {
  const url = chrome.runtime.getURL("plugins.json");
  const json = await fetch(url).then(r => r.json());
  return json.modules || [];
}

export async function createSubstrate() {
  // 1. Load Global State (namespaced per module)
  const globalState = await getLocalState();

  // 2. Context Factory — Injects OS APIs into each module
  const initContextFactory = (moduleName) => {
    if (!globalState[moduleName]) globalState[moduleName] = {};

    const ctx = {
      Registry,

      // Event bus (modules emit → registry.broadcast)
      Events: {
        emit: (type, payload = {}, meta = {}) =>
          Registry.broadcast(type, payload, meta)
      },

      // Namespaced state slice
      state: globalState[moduleName],

      // Persist module state + notify other modules
      saveState: async (newModuleState) => {
        globalState[moduleName] = newModuleState;
        await saveLocalState(globalState);
        await Registry.notifyStateChanged(moduleName, newModuleState);
      },

      // Allow module to register middleware
      useMiddleware: (fn) => Registry.use(fn)
    };

    return ctx;
  };

  // 3. Load & Initialize Modules
  const modules = await loadManifest();
  const loadedNames = [];

  for (const mod of modules) {
    try {
      const moduleUrl = chrome.runtime.getURL(mod.file);
      const moduleImpl = (await import(moduleUrl)).default;

      if (moduleImpl) {
        const ctx = initContextFactory(mod.name);

        if (typeof moduleImpl.init === "function") {
          await moduleImpl.init(ctx);
        }

        Registry.register(mod.name, moduleImpl, ctx);
        loadedNames.push(mod.name);
      }
    } catch (err) {
      console.error(`[Glue] Failed to load module ${mod.name}:`, err);
    }
  }

  // 4. Substrate Runtime API (glue-level)
  return {
    listModules: () => loadedNames,

    // Browser → Substrate → Registry
    ingestBrowserEvent: (event) => {
      Registry.broadcast("browser.event", event, {});
    },

    // Substrate tick
    tick: async () => {
      await Registry.broadcast("substrate.tick", {}, {});
      return []; // placeholder for future browser actions
    },

    // Clean shutdown
    shutdown: async () => {
      await Registry.shutdownAll();
    }
  };
}
