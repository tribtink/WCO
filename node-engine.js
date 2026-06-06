// node-engine.js
// Unified, preset-aware Node Engine for the WCO Substrate (physics layer only)

export class NodeEngine {
  /**
   * @param {Object} options
   * @param {Object} options.presets - Node presets (restrictive, open, etc.)
   * @param {Object} deps
   * @param {Object} [deps.schemaValidator] - Optional schema validator with validate(type, obj)
   */
  constructor(options = {}, deps = {}) {
    this.presets = options.presets || {};
    this.schemaValidator = deps.schemaValidator || null;
  }

  /**
   * Turn a physics-surface preset into a canonical Node object
   * that satisfies the substrate-level Node schema.
   *
   * Presets are intentionally minimal; this function fills in all
   * required canonical fields.
   *
   * @param {Object} preset
   * @param {string} [presetName]
   * @returns {Object} canonical Node
   */
  canonicalizePreset(preset, presetName = null) {
    const now = Date.now();

    return {
      // --- preset-driven physics surface ---
      kind: preset.kind,
      scope: preset.scope,
      visibility: preset.visibility,
      capabilities: preset.capabilities || [],
      constraints: preset.constraints || {},

      // --- canonical substrate-level fields ---
      id: (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : `node-${now}-${Math.random().toString(16).slice(2)}`,

      createdAt: now,

      lifecycle: {
        state: "active",
        createdAt: now,
        updatedAt: now
      },

      metadata: {
        engine: "NodeEngine",
        presetName
      }
    };
  }

  /**
   * Create a canonical Node from a named preset.
   *
   * @param {string} presetName
   * @returns {Object} canonical Node
   */
  createFromPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) {
      throw new Error(`NodeEngine: unknown preset "${presetName}"`);
    }

    const node = this.canonicalizePreset(preset, presetName);
    this._validateCanonicalNode(node);
    return node;
  }

  /**
   * Create a canonical Node from an ad-hoc partial object
   * (e.g., module-provided config), still going through the
   * same canonicalization path.
   *
   * @param {Object} partial
   * @returns {Object} canonical Node
   */
  createFromPartial(partial) {
    const node = this.canonicalizePreset(partial, partial.presetName || null);
    this._validateCanonicalNode(node);
    return node;
  }

  /**
   * Internal: validate against schema if a validator is provided.
   *
   * @param {Object} node
   * @private
   */
  _validateCanonicalNode(node) {
    if (!this.schemaValidator) return;

    // Expect a schemaValidator with signature: validate("Node", obj)
    const ok = this.schemaValidator.validate("Node", node);
    if (!ok) {
      const err = this.schemaValidator.errors && this.schemaValidator.errors[0];
      const msg = err
        ? `${err.instancePath || ""} ${err.message || "invalid Node"}`
        : "invalid Node";
      throw new Error(`NodeEngine: schema validation failed: ${msg}`);
    }
  }
}
