# Tactical Programmer PWA

A GitHub Pages-ready prototype for an adaptive Tactical Barbell-inspired training programmer.

## Important
This is deliberately a **real web app/PWA**, not a single HTML file that depends on iOS file preview.

### Deploy with GitHub Pages
1. Create a GitHub repository.
2. Upload the contents of this folder to the repository root.
3. In GitHub: Settings → Pages → Deploy from branch → `main` → `/ (root)`.
4. Open the resulting HTTPS Pages address in Safari.
5. Use Share → Add to Home Screen.

## Architecture
- `programme.js`: baseline and Operator loading rules
- `engine.js`: prescription + adaptive logic
- `library.js`: HIC/SE metadata
- `storage.js`: local persistence
- `app.js`: UI and logging
- `sw.js`: offline cache

## Current programming model
Hybrid/Operator is the indefinite baseline. Detours are temporary emphases (SE, strength, ruck, running), followed by return to baseline.

This is a prototype engine: the next development pass should expand the HIC/SE taxonomy, improve fatigue/recovery rules, add proper detour progression, and add a full long-term planner.
