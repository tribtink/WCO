// registry.js - Substrate Module Manager (Level-Up Version)

export const Registry = {
  modules: new Map(),
  contexts: new Map(),
  middlewares: [],

  use(fn) {
    if (typeof fn === "function") this.middlewares.push(fn);
  },

  register(name, moduleApi, ctx = null) {
    this.modules.set(name, moduleApi);
    if (ctx) this.contexts.set(name, ctx);
    console.log(`[Registry] Module registered: ${name}`);
  },

  async broadcast(type, payload = {}, context = {}) {
    let currentPayload = { ...payload };

    // 1. Middleware chain
    for (const mw of this.middlewares) {
      try {
        const result = await mw(type, currentPayload, context);
        if (result === false) return;
        if (result && typeof result === "object") currentPayload = result;
      } catch (err) {
        console.error(`[Registry] Middleware error on ${type}:`, err);
      }
    }

    // 2. Dispatch to modules
    for (const [name, module] of this.modules) {
      if (typeof module.onSignal === "function") {
        try {
          await module.onSignal(type, currentPayload, context);
        } catch (err) {
          console.error(`[Registry] Module ${name} failed on signal ${type}:`, err);
        }
      }
    }
  },

  async notifyStateChanged(moduleName, newState) {
    for (const [name, module] of this.modules) {
      if (typeof module.onStateChanged === "function") {
        try {
          const ctx = this.contexts.get(name);
          await module.onStateChanged(
            { module: moduleName, state: newState },
            ctx
          );
        } catch (err) {
          console.error(`[Registry] Module ${name} failed onStateChanged:`, err);
        }
      }
    }
  },

  async shutdownAll() {
    for (const [name, module] of this.modules) {
      if (typeof module.onShutdown === "function") {
        const ctx = this.contexts.get(name);
        await module.onShutdown(ctx);
      }
    }
    this.modules.clear();
    this.contexts.clear();
    this.middlewares = [];
    console.log("[Registry] All modules shut down.");
  }
};
