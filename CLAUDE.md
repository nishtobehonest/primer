# Primer (2d-world-ai)

Interactive AI explainer library — learn by doing, not by reading. Each chapter teaches one concept through a live demo you can step through, break, and explore.

**Brand name:** Primer  
**Live:** https://lab.nishchay.me  
**Vercel:** https://2d-world-ai.vercel.app  
**GitHub:** https://github.com/nishtobehonest/primer  
**Deploy:** Vercel, connected to GitHub — every push to `main` auto-deploys.

## Structure

```
2d-world-ai/
├── index.html                # Primer index — lab.nishchay.me root, chapter list
├── context/                  # Source reading notes
│   ├── anthropic-evals.md    # Anthropic engineering blog — primary source for Ch01
│   ├── hamel-evals.md        # Hamel Husain substack notes
│   └── handbook-evals.md     # AI Evals for Everyone handbook notes
│
└── chapters/
    └── 01-evals/             # Chapter 01: AI Evals (live)
        ├── SPEC.md           # Full build spec
        ├── index.html        # The page — lab.nishchay.me/chapters/01-evals/
        ├── style.css         # Styles (nishtobehonest design tokens)
        ├── world.js          # Grid rendering + agent simulation
        └── components.js     # The 6 interactive components
```

## Stack

Vanilla HTML/CSS/JS — no build step, no backend, no API calls. Agents are simulated in JavaScript. Open any `index.html` directly in a browser to run locally.

## Design system

Canonical tokens: `Technical/design-system/tokens.css`  
Skill reference: `build-artifact-v2` (~/.claude/commands/)

Key color assignments for 2d-world-ai:
- `--blue` (#4F8EF7) — RuleBasedAgent, PASS states, chapter numbers (live)
- `--teal` (#2DD4BF) — LLMAgent, capability evals, agent tile
- `--amber` (#F59E0B) — RandomAgent
- `--green` (#22C55E) — goal reached, regression evals, LIVE badge
- JetBrains Mono — grid, trace, scores, section numbers, badges
- Bricolage Grotesque 800 — wordmark, section titles
- Inter — body/explanatory text

Both dark (default) and light themes supported via `[data-theme="light"]` on `<html>`. Theme persisted in `localStorage` under key `nish-theme`.

## Chapters

| # | Title | Status | URL |
|---|---|---|---|
| 01 | AI Evals | Live | /chapters/01-evals/ |
| 02 | AI Agents | Planned | — |
| 03 | RAG | Planned | — |
| 04 | Fine-tuning | Planned | — |

When adding a new chapter:
1. Create `chapters/NN-slug/` with `index.html`, `style.css`, component JS
2. Add a LIVE card to the root `index.html` chapter grid
3. Push to main — Vercel auto-deploys

## Chapter 01: AI Evals

Source: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents  
Notes: `context/anthropic-evals.md`

6 interactive components, each teaching one eval concept:

| # | Concept | What the component does |
|---|---|---|
| 01 | What is an eval | Single-step runner — click Step, watch input→grade happen once |
| 02 | Eval anatomy | Nested diagram — hover any term to reveal its definition |
| 03 | Single vs multi-turn | Toggle — shows why multi-turn grading is fundamentally different |
| 04 | Three grader types | Same trace, three graders side by side with expandable tradeoffs |
| 05 | pass@k | Slider k=1→20, three probability curves update live |
| 06 | Capability vs Regression | Fail a maze → improve → promote to regression suite |

`world.js` exposes `window.WorldLib`: grid world, A* pathfinding, three agent types (Random p=0.30, RuleBased p=1.00, LLM p=0.70), trace, grader, pass@k formula.
