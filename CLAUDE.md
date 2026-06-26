# Primer (2d-world-ai)

Interactive AI explainer library — learn by doing, not by reading. Each chapter teaches one concept through a live demo you can step through, break, and explore.

**Editorial theme:** "How to avoid AI slop?" — every chapter title, description, and LinkedIn post should connect back to this question. AI slop = AI that looks right once but isn't reliable, measured, or understood. The answer is always a specific technical concept (evals, agents, RAG, fine-tuning).

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
    ├── 01-evals/             # Chapter 01: AI Evals (live)
    │   ├── SPEC.md           # Full build spec
    │   ├── index.html        # The page — lab.nishchay.me/chapters/01-evals/
    │   ├── style.css         # Styles (nishtobehonest design tokens)
    │   ├── world.js          # Grid rendering + agent simulation
    │   └── components.js     # The 6 interactive components
    └── 02-agentic-loops/     # Chapter 02: Feedback Loops (live)
        ├── index.html        # The page — lab.nishchay.me/chapters/02-agentic-loops/
        ├── style.css         # Styles (nishtobehonest design tokens)
        └── components.js     # The 5 interactive components
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
| 02 | Feedback Loops | Live | /chapters/02-agentic-loops/ |
| 03 | RAG | Planned | — |
| 04 | Fine-tuning | Planned | — |

Chapter card copy pattern (index.html):
- Each chapter description should answer a specific failure mode from the "How to avoid AI slop?" theme
- Ch01: "You can't tell if it works by looking at it. Evals are how you know."
- Ch02: "Your agent retried and failed again. Without a feedback loop, retrying is just hoping — here's what iteration actually means."
- Ch03: "Hallucinations are a retrieval problem. Grounding your AI in real data is how you fix it."
- Ch04: "Generic model, generic output. Fine-tuning is how you make AI care about your specific problem."

When adding a new chapter:
1. Create `chapters/NN-slug/` with `index.html`, `style.css`, component JS
2. Add the top-nav to the chapter's `index.html` (after the theme-toggle button, before `<header>`):
   ```html
   <nav class="top-nav">
     <div class="container top-nav-inner">
       <a href="../../">← Primer</a>
       <a href="https://nishchay.me" target="_blank" rel="noopener">nishchay.me ↗</a>
     </div>
   </nav>
   ```
   And add the matching CSS to `style.css` (copy from Ch01 or Ch02 — `.top-nav`, `.top-nav-inner`, `.top-nav a`).
3. Keep chapters independent — no "The previous chapter covered..." references. Each chapter should stand alone.
4. Add a LIVE card to the root `index.html` chapter grid — write the description in the "slop fix" voice above
5. Push to main — Vercel auto-deploys
6. Write a LinkedIn post using the template in the Content section below

## Content — LinkedIn posts

Each chapter gets a LinkedIn post on launch. Voice and structure:

```
How to avoid AI slop?

[One sentence naming the failure mode this chapter addresses.]

[2–3 short paragraphs: the problem, why most people skip this, what the chapter teaches.]

[Bullet list of the specific concepts covered — 5–7 items, each one line.]

Chapter NN of Primer — a series on how to avoid AI slop.

👉 [URL]
```

Key voice rules:
- Open with "How to avoid AI slop?" as the hook
- Name the failure mode first (e.g. "Most teams ship AI features and cross their fingers.")
- No em dashes in the list items — use plain bullets
- Em dashes are fine in prose for rhythm and contrast
- Keep paragraphs short — 2–3 sentences max
- End with the series line + link

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

## Chapter 02: Feedback Loops

Sources: [Anthropic — Building Effective Agents](https://www.anthropic.com/news/building-effective-agents) · [Self-Refine, Madaan et al., NeurIPS 2023](https://selfrefine.info/)

5 interactive components, each teaching one feedback loop concept:

| # | Concept | What the component does |
|---|---|---|
| 01 | The one-shot trap | Toggle between linear pipeline view and "what's actually happening between the boxes" |
| 02 | What a feedback loop actually is | Three tabs: retry-on-error vs. human review vs. evaluator-as-judge — trigger, signal, what changes |
| 03 | The iteration cycle | Step through Generate → Evaluate → Delta → Steer; watch context window build across passes |
| 04 | The stopping problem | Drag a quality threshold bar; feel the cost/quality tradeoff as iterations change |
| 05 | Zoom out | Click to zoom in on where parallelism (spatial) and iteration (temporal) connect |
