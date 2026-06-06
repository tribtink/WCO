# Civic Substrate Geometry

A minimal formal framework for describing coordination systems—peace, war, governance, institutions, trust, epistemics, and conflict—as points and trajectories in a shared high‑dimensional state space.

> “Coordination systems—ranging from interpersonal cooperation to interstate conflict—are typically described using taxonomies: layers, stages, or categories such as ‘peace,’ ‘war,’ ‘governance,’ ‘markets,’ ‘institutions.’”   

This repository treats those not as separate systems, but as **regions of one geometry**.

## Core idea

War and peace, cooperation and adversariality, individual and civilization are not different kinds of systems. They are **different configurations of the same substrate**:

- a shared **ontology** of entities and relations  
- a shared **structure** of how they are wired  
- a shared **runtime** of states and dynamics  
- a shared **context** (cooperative ↔ adversarial)  
- a shared **temporal** horizon  

The framework here:

- defines **Tier‑0 primitives** (irreducible building blocks)  
- generates **Tier‑1 composites** (agents, institutions, regimes, etc.)  
- specifies **axes of a geometry** for coordination systems  
- introduces **transition variables** for peace ↔ war  
- identifies **invariants** that persist across regimes  
- illustrates **example trajectories** through the space  

## Repository layout

- `docs/00_overview.md` — conceptual overview and motivation  
- `docs/01_tier0_primitives.md` — base ontology of primitives  
- `docs/02_tier1_composites.md` — generative grammar for composite structures   
- `docs/03_axes_geometry.md` — structural, runtime, scope, context, temporal axes   
- `docs/04_transition_dynamics.md` — minimal variables for peace ↔ war transitions   
- `docs/05_invariants.md` — what remains structurally true across regimes   
- `docs/06_example_trajectories.md` — worked example trajectories (e.g., stable peace → internal war)   
- `src/` — placeholder for future simulation / visualization modules  

## Status

This is a **conceptual and formal substrate**, not yet a full simulation engine. It is designed to be:

- **extensible** — new modules can plug into the geometry  
- **agnostic** — no commitment to specific ideologies or policies  
- **composable** — usable as a base layer for civic tools, models, and visualizers  

## Intended uses

- modeling peace ↔ war transitions  
- reasoning about institutional design and failure modes  
- exploring coordination regimes across scales (individual ↔ civilization)  
- building interactive tools for civic analysis and forecasting  

## License

See [`LICENSE`](./LICENSE).
