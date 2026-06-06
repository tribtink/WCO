// physics/identity-engine.js
export class IdentityEngine {
  constructor() {
    this.counter = 0;
  }

  nextId(prefix = "civic") {
    this.counter += 1;
    return `${prefix}-${Date.now()}-${this.counter}`;
  }
}
