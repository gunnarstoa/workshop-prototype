# Story App — Sample Prototype

A SvelteKit + Tailwind scaffold for a presenter-driven, screen-by-screen story.

## Run it

```bash
cd workshop-prototype/story-app
npm run dev
```

Then open the URL it prints (usually `http://localhost:5173`).

If you ever clone this fresh, run `npm install` first.

## Navigate

- **Arrow keys** — left/right to move between screens
- **Dots** at the bottom — click to jump
- **Next / Back buttons** at the bottom corners

## Three example screens

| URL          | What it demonstrates                                                  |
| ------------ | --------------------------------------------------------------------- |
| `/`          | The chrome (header, accent bar, nav, dots) and the centered card pattern |
| `/products`  | Reading data from `src/lib/data/products.json` and rendering it       |
| `/play`      | Draggable 24-month timeline with reactive widgets                     |

## Edit sample data

All data lives in `src/lib/data/`:

- `products.json` — the product catalog grouped by category
- `timeline.json` — 24 months of partner adoption history with metrics

Edit either file, save, and the running dev server hot-reloads the change.

## Add a new screen

1. Create `src/routes/<slug>/+page.svelte`
2. Add an entry to `src/lib/slides.ts`

That's it — the new screen inherits the chrome automatically.

## Where things live

```
src/
├── app.css                    ← global styles + the navy/orange chrome
├── app.html                   ← shell
├── lib/
│   ├── slides.ts              ← single source of truth for the slide order
│   ├── data/
│   │   ├── products.json      ← edit this to change products
│   │   ├── timeline.json      ← edit this to change the play screen
│   │   └── index.ts           ← typed exports for the JSON
│   └── components/            ← (empty for now — extract shared bits here)
└── routes/
    ├── +layout.svelte         ← header, nav, dot row, arrow keys
    ├── +page.svelte           ← screen 1: title
    ├── products/+page.svelte  ← screen 2: product catalog
    └── play/+page.svelte      ← screen 3: draggable timeline + widgets
```
