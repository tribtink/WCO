// physics-index.js
// Unified physics layer for the WCO Substrate

import { NodeEngine } from "../node-engine.js";
import { WitnessEngine } from "../witness-engine.js";
import { TickEngine } from "./tick-engine.js";

// Future axes (stubs for now)
import { IdentityEngine } from "../physics/identity-engine.js";   // if exists
import { CapabilityEngine } from "../physics/capability-engine.js"; // if exists
import { CausalityEngine } from "../physics/causality-engine.js";   // if exists

import witnessPresets from "../witness-presets.js";
import nodePresets from "../node-presets.js";

export function createPhysicsLayer(deps = {}) {
  const witness = new WitnessEngine(
    { presets: witnessPresets.presets },
    deps
  );

  const node = new NodeEngine(
    { presets: nodePresets?.presets || {} },
    deps
  );

  const tick = new TickEngine();

  // Stubs for now
  const identity = new IdentityEngine();
  const capability = new CapabilityEngine();
  const causality = new CausalityEngine();


  return {
    witness,
    node,
    tick,
    identity,
    capability,
    causality
  };
}
