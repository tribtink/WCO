// witness-presets.js
// Minimal physics-surface witness presets for the WCO Substrate

export default {
  "$id": "https://wco.dev/presets/witness-presets.json",
  "version": "0.1",

  "presets": {
    "restrictive": {
      kind: "witness",
      scope: "local",
      visibility: "private",
      emission: "hashes",
      retention: "short",
      integrity: "local",

      // Witnesses do not have verbs — they observe
      protocol: [],

      requiredCapabilities: []
    },

    "open": {
      kind: "witness",
      scope: "global",
      visibility: "shared",
      emission: "full",
      retention: "long",
      integrity: "distributed",

      protocol: ["observe", "attest"],
      requiredCapabilities: ["canObserve", "canAttest"]
    }
  }
};
