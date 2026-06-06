export class CausalityEngine {
  constructor(opts = {}) {
    const {
      node = null,
      witness = null,
      nodeEngine = null,
      witnessEngine = null,
    } = opts;

    this.node = node || nodeEngine;
    this.witness = witness || witnessEngine;
  }
}
