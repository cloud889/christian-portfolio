# Portfolio site

Dashboard-style portfolio for Christian John Gundino. Vite, React 19, TypeScript, GSAP.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check and production build into dist/
```

## Where things are

| Path | What it holds |
| --- | --- |
| `src/data/profile.ts` | KPIs, skills, history, certificates, contact. All facts come from the CV and profile. |
| `src/data/projects.ts` | Every project panel, its notes, and the pins for the pinned-notes story. |
| `src/data/images.json` | Generated. Paths and sizes of the optimized images. |
| `scripts/build-images.mjs` | Converts the source screenshots into WebP under `public/work/`. |
| `src/lib/motion-mode.tsx` | The Led / Mid / Off motion level. Reduced-motion users start on Off. |
| `src/components/PinStory.tsx` | Sticky browser frame, camera pan and zoom, pins that step with the notes. |
| `src/components/CaseSheet.tsx` | The case study that grows out of the clicked card. |

## Regenerate the images

The source screenshots live outside this repo. Run:

```bash
node scripts/build-images.mjs "<path to the Portfolio landing Pages folder>"
```

## Add a pin

In `src/data/projects.ts`, add an entry to `story.pins`. `x` and `y` are percentages of the page image,
so they stay in place when the image scales.

## Motion levels

- **Led**: intro, scroll reveals, card tilt, pin zoom, dot-grid wave.
- **Mid**: transitions and pin panning only.
- **Off**: static. Pins still change as you scroll.
