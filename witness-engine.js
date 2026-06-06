// witness-engine.js
// Deterministic, preset-aware Witness Engine for the WCO Substrate (physics layer only)

export class WitnessEngine {
  /**
   * @param {Object} options
   * @param {Object} options.presets - Witness presets (restrictive, open, etc.)
   * @param {Object} deps
   * @param {Object} [deps.schemaValidator] - Optional schema validator with validate(type, obj)
   */
  constructor(options = {}, deps = {}) {
    this.presets = options.presets || {};
    this.schemaValidator = deps.schemaValidator || null;
  }

  /**
   * Turn a physics-surface preset into a canonical Witness object
   * that satisfies the substrate-level Witness schema.
   *
   * Presets are intentionally minimal; this function fills in all
   * required canonical fields.
   *
   * @param {Object} preset
   * @param {string} [presetName]
   * @returns {Object} canonical Witness
   */
  canonicalizePreset(preset, presetName = null) {
    const now = Date.now();

    return {
      // --- preset-driven physics surface ---
      kind: preset.kind,
      scope: preset.scope,
      visibility: preset.visibility,
      emission: preset.emission,
      retention: preset.retention,
      integrity: preset.integrity,
      protocol: preset.protocol,
      requiredCapabilities: preset.requiredCapabilities || [],

      // --- canonical substrate-level fields ---
      id: (typeof crypto !== "undefined" && crypto.randomUUID)
        ? crypto.randomUUID()
        : `witness-${now}-${Math.random().toString(16).slice(2)}`,

      createdAt: now,

      lifecycle: {
        state: "active",
        createdAt: now,
        updatedAt: now
      },

      processing: {
        version: 1,
        lastProcessed: null
      },

      metadata: {
        engine: "WitnessEngine",
        presetName
      }
    };
  }

  /**
   * Create a canonical Witness from a named preset.
   *
   * @param {string} presetName
   * @returns {Object} canonical Witness
   */
  createFromPreset(presetName) {
    const preset = this.presets[presetName];
    if (!preset) {
      throw new Error(`WitnessEngine: unknown preset "${presetName}"`);
    }

    const witness = this.canonicalizePreset(preset, presetName);
    this._validateCanonicalWitness(witness);
    return witness;
  }

  /**
   * Create a canonical Witness from an ad-hoc partial object
   * (e.g., module-provided config), still going through the
   * same canonicalization path.
   *
   * @param {Object} partial
   * @returns {Object} canonical Witness
   */
  createFromPartial(partial) {
    const witness = this.canonicalizePreset(partial, partial.presetName || null);
    this._validateCanonicalWitness(witness);
    return witness;
  }

  /**
   * Internal: validate against schema if a validator is provided.
   *
   * @param {Object} witness
   * @private
   */
  _validateCanonicalWitness(witness) {
    if (!this.schemaValidator) return;

    // Expect a schemaValidator with signature: validate("Witness", obj)
    const ok = this.schemaValidator.validate("Witness", witness);
    if (!ok) {
      const err = this.schemaValidator.errors && this.schemaValidator.errors[0];
      const msg = err
        ? `${err.instancePath || ""} ${err.message || "invalid Witness"}`
        : "invalid Witness";
      throw new Error(`WitnessEngine: schema validation failed: ${msg}`);
    }
  }
}
