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
├── roadmap/                  # Personal page — Agent Learning Roadmap (not a chapter)
│   ├── index.html            # The page — lab.nishchay.me/roadmap/
│   ├── style.css              # Styles
│   └── app.js                 # Checklist state, localStorage (`nv-roadmap-v1`)
├── context/                  # Source reading notes
│   ├── README.md                       # Index of source files, key concepts per file
│   ├── anthropic-evals.md              # Anthropic engineering blog — primary source for Ch01
│   ├── hamel-evals.md                  # Hamel Husain substack notes
│   ├── handbook-evals.md               # AI Evals for Everyone handbook notes
│   ├── 03-agentic-systems-anthropic.md # Anthropic multi-agent systems posts — primary source for Ch03
│   ├── 03-agentic-systems-fractional-ai.md # Fractional AI Engineering blog — context bloat + footprint
│   ├── 04-harness-anthropic-effective-harnesses.md # Anthropic — initializer/coding-agent session bridging
│   ├── 04-harness-anthropic-harness-design.md      # Anthropic — planner/generator/evaluator, cost data
│   ├── 04-harness-faros-ai.md                      # Faros AI — Agent = Model + Harness, 5 layers
│   ├── 07-mcp-sampling-spec-docs.md                # Official MCP spec + 2026-07-28 RC deprecation
│   ├── 07-mcp-sampling-workos.md                   # WorkOS — sampling explainer
│   ├── 07-mcp-sampling-imti.md                     # IMTI — practitioner who chose not to use sampling
│   └── 07-mcp-sampling-course-notes.md             # Nish's own course notes — transport mechanics
│
└── chapters/
    ├── 01-evals/             # Chapter 01: AI Evals (live)
    │   ├── SPEC.md           # Full build spec
    │   ├── index.html        # The page — lab.nishchay.me/chapters/01-evals/
    │   ├── style.css         # Styles (nishtobehonest design tokens)
    │   ├── world.js          # Grid rendering + agent simulation
    │   └── components.js     # The 6 interactive components
    ├── 02-agentic-loops/     # Chapter 02: Feedback Loops (live)
    │   ├── index.html        # The page — lab.nishchay.me/chapters/02-agentic-loops/
    │   ├── style.css         # Styles (nishtobehonest design tokens)
    │   └── components.js     # The 5 interactive components
    ├── 03-agentic-systems/   # Chapter 03: Agentic System Design (live)
    │   ├── SPEC.md           # Full build spec
    │   ├── index.html        # The page — lab.nishchay.me/chapters/03-agentic-systems/
    │   ├── style.css         # Styles (nishtobehonest design tokens)
    │   └── components.js     # The 6 interactive components
    ├── 04-harness-engineering/  # Chapter 04: Agent Harness Engineering (live)
    │   ├── SPEC.md           # Full build spec
    │   ├── index.html        # The page — lab.nishchay.me/chapters/04-harness-engineering/
    │   ├── style.css         # Styles (nishtobehonest design tokens)
    │   └── components.js     # The 6 interactive components
    └── 07-mcp-sampling/      # Chapter 07: MCP Sampling (live)
        ├── SPEC.md           # Full build spec
        ├── index.html        # The page — lab.nishchay.me/chapters/07-mcp-sampling/
        ├── style.css         # Styles (nishtobehonest design tokens)
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
| 02 | Feedback Loops | Live | /chapters/02-agentic-loops/ |
| 03 | Agentic System Design | Live | /chapters/03-agentic-systems/ |
| 04 | Agent Harness Engineering | Live | /chapters/04-harness-engineering/ |
| 05 | RAG | Planned | — |
| 06 | Fine-tuning | Planned | — |
| 07 | MCP Sampling | Live | /chapters/07-mcp-sampling/ |

Chapter card copy pattern (index.html):
- Each chapter description should answer a specific failure mode from the "How to avoid AI slop?" theme
- Ch01: "You can't tell if it works by looking at it. Evals are how you know."
- Ch02: "Your agent retried and failed again. Without a feedback loop, retrying is just hoping — here's what iteration actually means."
- Ch03: "Your multi-agent system ran to completion and returned a confident wrong answer. Silent failures are the default — here's how to design systems that fail visibly."
- Ch04: "It looked done in 20 minutes. It didn't work. The harness around the model — not a smarter one — is what closes that gap."
- Ch05 (planned): "Hallucinations are a retrieval problem. Grounding your AI in real data is how you fix it."
- Ch06 (planned): "Generic model, generic output. Fine-tuning is how you make AI care about your specific problem."
- Ch07: "You gave your server its own API key so it could call the AI directly. The protocol's own fix for that got deprecated within a year — here's why."

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

**Writing voice — 8th-grade-simple (all chapters, not just prose above):** Every explanation on a chapter page — intro, section bodies, component-setup lines, key insights — should read at an 8th-grade level. Plain language first, the real technical term named right after, not instead of. Short sentences, one idea each. Use everyday analogies before diving into jargon. This applies to `/primer-chapter` builds going forward.

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

## Personal pages (outside the chapter series)

These aren't part of the "How to avoid AI slop?" editorial chapters — linked from
root `index.html` under "Also here", not in the chapter grid. No number, no
Live/Soon badge.

| Page | Purpose | URL |
|---|---|---|
| Agent Learning Roadmap | Personal tracker: wedge learning strategy, Claude Code feature adoption checklist, LLM-production curriculum — checkboxes persist via `localStorage` (`nv-roadmap-v1`) | `/roadmap/` |

## Chapter 03: Agentic System Design

Sources: `context/03-agentic-systems-anthropic.md` · `context/03-agentic-systems-fractional-ai.md`

6 interactive components, each teaching one agentic system design concept:

| # | Concept | What the component does |
|---|---|---|
| 01 | The silent failure | Orchestrator + 3 workers; "Introduce failure" makes Worker B silently fail — toggle internal/external view |
| 02 | Orchestrator-worker pattern | Toggle "Clear task boundaries" vs "Overlapping tasks" — see duplicate work and conflicts emerge |
| 03 | Context bloat | Agent accumulates tool calls; token bar fills; quality degrades; "Profile" reveals which calls consume the most tokens |
| 04 | Sequential vs. parallel | 4 tasks, toggle sequential/parallel; introduce failure to see chain break vs. parallel completion |
| 05 | Minimal footprint | 3 action types (reversible/semi/irreversible); toggle minimal footprint mode — agent pauses before irreversible actions |
| 06 | Prototype to production | 4-stage rail: Prototype → Staging → Pre-Production → Production; click each stage to expand failure modes and design decisions |

## Chapter 04: Agent Harness Engineering

Case study: Anthropic (Claude Code / Claude Agent SDK harness design)
Sources: `context/04-harness-anthropic-effective-harnesses.md` · `context/04-harness-anthropic-harness-design.md` · `context/04-harness-faros-ai.md`

6 interactive components, each teaching one harness engineering concept — Terminal Replay theme (annotated fake terminal, toggle a harness layer on/off, replay the same task differently):

| # | Concept | What the component does |
|---|---|---|
| 01 | Agent = Model + Harness | Toggle solo run ($9/20min, broken input wiring) vs. full-harness run ($200/6hr, working gameplay + bonus features) — same model both times |
| 02 | The one-shot ceiling | Context bar fills across one long session; toggle session-bridging on/off — premature "done" vs. a clean handoff to the next session |
| 03 | The verification gate | Toggle a mandatory test-before-exit step; the same bug gets shipped or caught depending on the gate |
| 04 | Planner → Generator → Evaluator | Click through 7 real, timestamped/priced build phases from Anthropic's DAW case; running cost total ticks up to $124.70 |
| 05 | Sprint decomposition | Toggle continuous generation vs. sprint-gated generation; evaluator-criteria checklist fills per sprint vs. one uninterrupted run |
| 06 | Harness artifacts in the wild | Step through an annotated (paraphrased) Claude Code session opening this exact repo — CLAUDE.md context, a memory recall, a skill invocation |

All numbers (the $9/20min vs. $200/6hr comparison, the DAW round-by-round cost table, the 27-criteria Sprint 3 example) are Anthropic's own reported figures — no benchmark or accuracy metric is implied anywhere, since neither source discloses one.

## Chapter 07: MCP Sampling

Sources: `context/07-mcp-sampling-spec-docs.md` · `context/07-mcp-sampling-workos.md` · `context/07-mcp-sampling-imti.md` · `context/07-mcp-sampling-course-notes.md`

**No company case study exists for this topic** — MCP Sampling is a protocol mechanism, not a product companies report business outcomes from. Substituted with a verified, dated spec event: Sampling (with Roots and Logging) was formally deprecated in the 2026-07-28 MCP spec release candidate, about 13 months after shipping in the 2025-06-18 stable spec — in favor of direct LLM-provider integration and a stateless protocol core. This deviation is documented in the chapter's own SPEC.md.

6 interactive components, each teaching one part of the sampling mechanism — Tool Call Trace theme (annotated MCP message sequence across Server / Client / User / LLM):

| # | Concept | What the component does |
|---|---|---|
| 01 | Who asks whom | Toggle between a normal tool call (client asks, server answers) and a sampling call (server asks, client asks the AI) — arrows visibly flip direction |
| 02 | The sampling handshake | Step through the real 8-step flow from the spec's own sequence diagram, including both required human-approval checkpoints |
| 03 | Why servers don't hold API keys | Before/after: naive server (own key, calls the AI directly) vs. sampling server (no key) — toggle "make it public" to reveal what breaks |
| 04 | Transport breaks the pattern | Pick a transport (stdio / stateful HTTP / stateless HTTP); see whether the server-initiated sampling request can even be delivered |
| 05 | Roots and Logging — the siblings | Three-card comparison of the features deprecated in the same RC, and what replaces each |
| 06 | The deprecation timeline | Click through 2024 → 2025-06-18 → 2026-07-28 with sourced quotes at each stage |

Business outcomes section is likewise substituted: a sourced attribution chain (no API key → needs server-initiated messages → needs stateful transport → conflicts with stateless scaling → deprecated) plus a "does your server actually need this" decision tool built from a real practitioner's (IMTI) rule of thumb, in place of the usual ROI slider — since no dollar figure exists to scale.
