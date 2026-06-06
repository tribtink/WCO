// physics/capability-engine.js
export class CapabilityEngine {
  constructor() {
    this.capabilities = new Map(); // pluginName -> Set(capability)
  }

  grant(pluginName, capability) {
    if (!this.capabilities.has(pluginName)) {
      this.capabilities.set(pluginName, new Set());
    }
    this.capabilities.get(pluginName).add(capability);
  }

  has(pluginName, capability) {
    return this.capabilities.get(pluginName)?.has(capability) ?? false;
  }
}
