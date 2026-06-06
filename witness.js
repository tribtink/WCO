// witness.js
// Canonical substrate-level Witness model (JavaScript, no TypeScript).
// No politics, no governance, no verbs. Pure data + physics.

// --- Enumerations (capability surfaces) ---

export const WitnessScope = Object.freeze({
  LOCAL: "local",
  NATIONAL: "national",
  REGIONAL: "regional",
  GLOBAL: "global",
  ARTIFACT: "artifact",
  SWARM: "swarm",
});

export const WitnessVisibility = Object.freeze({
  PRIVATE: "private",
  SHARED: "shared",
  PUBLIC: "public",
  DELAYED_PUBLIC: "delayed-public",
  HASHED_ONLY: "hashed-only",
});

export const WitnessEmission = Object.freeze({
  NONE: "none",
  HASHES: "hashes",
  SUMMARIES: "summaries",
  RAW: "raw",
});

export const WitnessRetention = Object.freeze({
  SHORT: "short",
  MEDIUM: "medium",
  LONG: "long",
  INDEFINITE: "indefinite",
});

export const WitnessIntegrity = Object.freeze({
  NONE: "none",
  LOCAL: "local",
  NATIONAL: "national",
  GLOBAL: "global",
  MULTI_ANCHOR: "multi-anchor",
});

export const WitnessProcessing = Object.freeze({
  ALLOWED: "allowed",
  DISALLOWED: "disallowed",
});

export const WitnessLifecycle = Object.freeze({
  ACTIVE: "active",
  DORMANT: "dormant",
  ARCHIVED: "archived",
});

// --- Utility: ID + timestamp ---

function defaultId() {
  // Ephemeral civic ID; you can swap this for a stronger generator later.
  return `witness_${crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2)}`;
}

function defaultCreatedAt() {
  return new Date().toISOString();
}

// --- Validation helpers ---

function assertEnum(value, enumObj, fieldName) {
  const values = Object.values(enumObj);
  if (!values.includes(value)) {
    throw new Error(
      `[Witness] Invalid value for ${fieldName}: "${value}". Expected one of: ${values.join(", ")}`
    );
  }
}

function assertString(value, fieldName) {
  if (typeof value !== "string") {
    throw new Error(`[Witness] Field "${fieldName}" must be a string, got: ${typeof value}`);
  }
}

function assertObject(value, fieldName) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(`[Witness] Field "${fieldName}" must be a plain object`);
  }
}

// --- Canonical Witness class ---

export class Witness {
  /**
   * Canonical Witness constructor.
   *
   * Fields (canonical schema):
   * - id: ephemeral civic ID (string)
   * - createdAt: ISO timestamp (string)
   * - kind: always "witness"
   * - scope: one of WitnessScope
   * - visibility: one of WitnessVisibility
   * - emission: one of WitnessEmission
   * - retention: one of WitnessRetention
   * - integrity: one of WitnessIntegrity
   * - metadata: arbitrary module-defined object
   * - processing: one of WitnessProcessing
   * - lifecycle: one of WitnessLifecycle
   */
  constructor({
    id = defaultId(),
    createdAt = defaultCreatedAt(),
    scope = WitnessScope.LOCAL,
    visibility = WitnessVisibility.PRIVATE,
    emission = WitnessEmission.HASHES,
    retention = WitnessRetention.SHORT,
    integrity = WitnessIntegrity.NONE,
    metadata = {},
    processing = WitnessProcessing.ALLOWED,
    lifecycle = WitnessLifecycle.ACTIVE,
  } = {}) {
    // Fixed kind
    this.kind = "witness";

    // Core fields
    this.id = id;
    this.createdAt = createdAt;
    this.scope = scope;
    this.visibility = visibility;
    this.emission = emission;
    this.retention = retention;
    this.integrity = integrity;
    this.metadata = metadata;
    this.processing = processing;
    this.lifecycle = lifecycle;

    // Validate on construction
    this._validate();
  }

  // --- Internal validation (physics enforcement) ---

  _validate() {
    assertString(this.id, "id");
    assertString(this.createdAt, "createdAt");

    if (this.kind !== "witness") {
      throw new Error(`[Witness] kind must always be "witness", got: "${this.kind}"`);
    }

    assertEnum(this.scope, WitnessScope, "scope");
    assertEnum(this.visibility, WitnessVisibility, "visibility");
    assertEnum(this.emission, WitnessEmission, "emission");
    assertEnum(this.retention, WitnessRetention, "retention");
    assertEnum(this.integrity, WitnessIntegrity, "integrity");
    assertEnum(this.processing, WitnessProcessing, "processing");
    assertEnum(this.lifecycle, WitnessLifecycle, "lifecycle");

    assertObject(this.metadata, "metadata");
  }

  // --- Lifecycle transitions (still zero verbs) ---

  setLifecycle(nextLifecycle) {
    assertEnum(nextLifecycle, WitnessLifecycle, "lifecycle");
    this.lifecycle = nextLifecycle;
    return this;
  }

  setMetadata(metadata) {
    assertObject(metadata, "metadata");
    this.metadata = metadata;
    return this;
  }

  // --- Serialization helpers ---

  toJSON() {
    return {
      id: this.id,
      createdAt: this.createdAt,
      kind: this.kind,
      scope: this.scope,
      visibility: this.visibility,
      emission: this.emission,
      retention: this.retention,
      integrity: this.integrity,
      metadata: this.metadata,
      processing: this.processing,
      lifecycle: this.lifecycle,
    };
  }

  static fromJSON(json) {
    if (!json || typeof json !== "object") {
      throw new Error("[Witness] fromJSON expects a plain object");
    }
    return new Witness(json);
  }
}

// --- Canonical presets (spectrum) ---

export const WitnessPresets = Object.freeze({
  // Restrictive Witness
  RESTRICTIVE: () =>
    new Witness({
      scope: WitnessScope.LOCAL,
      visibility: WitnessVisibility.PRIVATE,
      emission: WitnessEmission.HASHES,
      retention: WitnessRetention.SHORT,
      integrity: WitnessIntegrity.LOCAL,
      processing: WitnessProcessing.ALLOWED,
      lifecycle: WitnessLifecycle.ACTIVE,
    }),

  // Liberal-Restrictive Witness
  LIBERAL_RESTRICTIVE: () =>
    new Witness({
      scope: WitnessScope.NATIONAL,
      visibility: WitnessVisibility.SHARED,
      emission: WitnessEmission.SUMMARIES,
      retention: WitnessRetention.LONG,
      integrity: WitnessIntegrity.NATIONAL,
      processing: WitnessProcessing.ALLOWED,
      lifecycle: WitnessLifecycle.ACTIVE,
    }),

  // Open Witness
  OPEN: () =>
    new Witness({
      scope: WitnessScope.GLOBAL,
      visibility: WitnessVisibility.PUBLIC,
      emission: WitnessEmission.RAW,
      retention: WitnessRetention.INDEFINITE,
      integrity: WitnessIntegrity.MULTI_ANCHOR,
      processing: WitnessProcessing.ALLOWED,
      lifecycle: WitnessLifecycle.ACTIVE,
    }),
});
