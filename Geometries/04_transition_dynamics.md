# Transition dynamics

To model transitions—especially **peace ↔ war**—we introduce a minimal set of variables that act as **order parameters**.

> “From everything you’ve already built, the key levers for peace↔war are: Trust T: average cross‑boundary trust (between major blocs/factions). Containment C: strength/effectiveness of conflict‑containing institutions and norms.”   

## Core variables

- **T (Trust):** average cross‑boundary trust between major blocs/factions.  
- **C (Containment):** strength and effectiveness of conflict‑containing institutions and norms.  
- **E (Epistemic quality):** how accurate, robust, and non‑manipulated the epistemic environment is.  
- **G (Grievance/pressure):** accumulated perceived injustice, deprivation, or pressure.  
- **P (Power asymmetry):** degree of imbalance in power between blocs.  
- **κ (Context):** background context, from hostile (−1) to cooperative (+1).   

All variables are typically normalized to \([0,1]\) (or \([-1,1]\) for κ).

## Intuition

- High **T**, high **C**, high **E**, low **G**, moderate **P**, and cooperative **κ** → stable peace region.  
- Low **T**, failed **C**, degraded **E**, high **G**, extreme **P**, hostile **κ** → war region.  
- Intermediate values → unstable or hybrid regimes.  

## Generic dynamics

We can write schematic update rules such as:

- \( \dot{T} = f_T(E, C, G, shocks) \)  
- \( \dot{C} = f_C(T, P, institutional health) \)  
- \( \dot{E} = f_E(investment, manipulation, institutional design) \)  
- \( \dot{G} = f_G(outcomes, perceived fairness, propaganda) \)  
- \( \dot{P} = f_P(technology, alliances, economic growth) \)  
- \( \dot{\kappa} = f_\kappa(global context, norms, shocks) \)  

The exact functional forms are context‑dependent, but the **sign structure** is often robust:

- better epistemics (E↑) tends to increase trust (T↑) and improve containment (C↑)  
- high grievance (G↑) tends to reduce trust (T↓) and stress containment (C↓)  
- extreme power asymmetry (P↑) can either stabilize (through deterrence) or destabilize (through domination)  

## Thresholds and tipping points

Transitions often involve **thresholds**:

- below some \(T_{\text{crit}}\), containment mechanisms fail to prevent escalation  
- above some \(G_{\text{crit}}\), actors become willing to accept high costs for conflict  
- below some \(E_{\text{crit}}\), epistemic environments cannot sustain shared reality  

These thresholds define **basins of attraction** in the state–context space.

## Use in simulations

These variables can be used to:

- simulate trajectories under different policy interventions  
- explore counterfactual histories  
- test robustness of peace regimes to shocks  

They are intentionally minimal, so they can be extended with domain‑specific variables as needed.
