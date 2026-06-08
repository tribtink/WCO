// modules/geometry/geometry-module.js
// Generic Geometry Module for WCO Substrate
// Works with Tier-0 primitives, axes, and any domain spec (.json or .js)

import {
  Substrate,
  applyDomainSpec
} from "../../geometries.js";

export default {
  name: "geometry",

  async init(ctx) {
    ctx.log("Geometry module initializing…");

    // Create a geometry substrate instance
    const substrate = new Substrate({
      dt: 0.1,
      initialTime: 0
    });

    // Save substrate instance into module state
    await ctx.saveState({
      substrate,
      loadedSpecs: [],
      lastStep: 0
    });

    ctx.log("Geometry module ready.");
  },

  // Allow other modules to load domain specs dynamically
  async onSignal(type, payload, ctx) {
    if (type !== "geometry.loadSpec") return;

    const { spec, name } = payload;
    const s = ctx.state;

    applyDomainSpec(s.substrate, spec);
    s.loadedSpecs.push(name || "unnamed-spec");

    await ctx.saveState(s);

    ctx.log(`Loaded domain spec: ${name}`);
  },

  // Run geometry dynamics each tick
  async onTick(ctx) {
    const s = ctx.state;

    s.substrate.step();
    s.lastStep = s.substrate.time;

    await ctx.saveState(s);

    ctx.Events.emit("geometry.step", {
      time: s.substrate.time,
      variables: s.substrate.state.list()
    });
  },

  ui: {
    popupFragment: "modules/geometry/fragment.html",
    popupFragmentJS: "modules/geometry/fragment.js",
    popupPage: "modules/geometry/page.html",
    popupPageJS: "modules/geometry/page.js"
  }
};
