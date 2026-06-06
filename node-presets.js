// node-presets.js
// Minimal physics-surface node presets for the WCO Substrate

export default {
  "$id": "https://wco.dev/presets/node-presets.json",
  "version": "0.1",

  "presets": {
    "restrictive": {
      kind: "node",
      scope: "local",
      visibility: "private",
      emission: "summaries",
      retention: "short",
      integrity: "local",

      // Physics verbs only — no governance verbs here
      verbs: [],

      // Capabilities required for this preset
      requiredCapabilities: []
    },

    "open": {
      kind: "node",
      scope: "global",
      visibility: "shared",
      emission: "full",
      retention: "long",
      integrity: "distributed",

      verbs: ["signal", "act"],
      requiredCapabilities: ["canEmitSignals", "canAct"]
    }
  }
};
