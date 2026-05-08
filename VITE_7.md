Recommendation: Vite 7.3.3 
Skipping straight to v7 collapses three majors (4→5→6→7) into one upgrade and earns ~12 months of runway before the next forced move.
Vite 7 has been out long enough that the plugin ecosystem has settled (plugin-react 5.x, plugin-legacy 7.x, plugin-pwa 1.x, vitest 3.x all explicitly target it).
Vite 8 is the latest tag but only weeks old; some of your plugins (e.g. @vitejs/plugin-legacy@7 peer is ^7 only — needs v8 today, plugin-react@6 is ^8 only) have a thinner v8 surface. Wait a release cycle.
Node 20.19+ is a reasonable floor for 2026; the CI/.nvmrc bump is a one-line change in two files.
Companion bumps for Vite 7 path

vite                                4.5.14 → 7.3.3
vitest                              0.33.0 → 3.2.4    ← non-trivial test migration
@vitejs/plugin-react                4.0.2  → 5.2.0
@vitejs/plugin-legacy               5.3.2  → 7.2.1
@vitejs/plugin-basic-ssl            1.2.0  → 2.3.0
vite-plugin-pwa                     0.19.2 → 1.3.0
@vite-pwa/assets-generator          0.2.4  → 1.0.2
vite-plugin-svgr                    3.2.0  → 4.5.0    ← export shape changed
vite-plugin-image-optimizer         1.1.8  → 2.0.3    ← needs sharp ≥0.34, you're on 0.32.6
vite-plugin-optimize-css-modules    1.0.4  → 1.4.0
vite-tsconfig-paths                 4.2.0  → 6.1.1
Plus sharp 0.32.6 → ≥ 0.34 if you take vite-plugin-image-optimizer@2. And:

CI Node 18.15.0 → 20.19.0 (or 22.12.0)
.nvmrc v20.11.0 → v20.19.0
Biggest migration risks to budget for
vitest 0.33 → 3.x is the heaviest part of this upgrade — test.deps, mocking API, and snapshot format all changed. This is more work than the Vite bump itself.
vite-plugin-svgr 3 → 4 changed the named export and ref-forwarding behavior; any ?react import sites need verifying.
vite-plugin-pwa 0.19 → 1.x changed default workbox behavior — re-test SW registration and manifest output.
CJS Node API removal in Vite 5: any tooling that did require('vite') will break. Quick repo scan recommended.
If you'd rather not absorb all of that at once, close this PR and go to Vite 6.4.2 (Option A) first — same Node, much smaller plugin diff. Land it, ship a release, then do v7 as a separate planned upgrade with the Node bump.