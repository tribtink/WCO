// ------------------------------------------------------------
// Blank WCO Substrate Module
// This module intentionally does nothing.
// It exists only to show the required structure.
// ------------------------------------------------------------

export default {

  // ------------------------------------------------------------
  // name
  // This should match the "name" field in plugins.json.
  // It identifies the module inside the Substrate OS.
  // ------------------------------------------------------------
  name: "blank",


  // ------------------------------------------------------------
  // init(ctx)
  // Runs once when the module loads.
  // Leaving this empty means no startup behavior.
  // ------------------------------------------------------------
  init(ctx) {
    // No initialization logic.
  },

  // ------------------------------------------------------------
  // onSignal(type, payload, context)
  // Called when the Substrate OS broadcasts an event.
  // Leaving this empty means the module ignores all signals.
  // ------------------------------------------------------------
  onSignal(type, payload, context) {
    // No signal handling.
  },

  // ------------------------------------------------------------
  // onStateChanged(change, ctx)
  // Called when ANY module updates its saved state.
  // Leaving this empty means this module does not react.
  // ------------------------------------------------------------
  onStateChanged(change, ctx) {
    // No state reaction.
  },

  // ------------------------------------------------------------
  // onShutdown(ctx)
  // Called when the Substrate OS shuts down.
  // Leaving this empty means no cleanup is needed.
  // ------------------------------------------------------------
  onShutdown(ctx) {
    // No shutdown behavior.
  }
};
