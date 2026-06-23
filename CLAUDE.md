# 2d-world-ai

A learn-by-doing lab for AI engineering concepts. Each chapter is a standalone interactive explainer — a scrollable page where you learn one concept by interacting with a live 2D grid world demo.

## Current focus

**Chapter 01: Evals** — teaching the 6 core concepts from Anthropic's "Demystifying Evals for AI Agents" post via interactive components.

Spec: `chapters/01-evals/SPEC.md`

## Structure

```
2d-world-ai/
├── context/                  # Source reading notes
│   ├── anthropic-evals.md    # Anthropic engineering blog — primary source for Ch01
│   ├── hamel-evals.md        # Hamel Husain substack notes
│   ├── handbook-evals.md     # AI Evals for Everyone handbook notes
│   └── handbook_evals_updated.pdf
│
└── chapters/
    └── 01-evals/
        ├── SPEC.md           # Full build spec for this chapter
        ├── index.html        # The page
        ├── style.css         # Styles (nishtobehonest design tokens)
        ├── world.js          # Grid rendering + agent simulation
        └── components.js     # The 6 interactive components
```

## Stack

Vanilla HTML/CSS/JS — no build step, no backend, no API calls. Agents are simulated in JavaScript. Open `index.html` directly in a browser to run.

## Design system

Inherits nishtobehonest tokens. Key assignments:
- `--blue` (#4F8EF7) — RuleBasedAgent, PASS states
- `--teal` (#2DD4BF) — LLMAgent, capability evals
- `--amber` (#F59E0B) — RandomAgent
- `--green` (#22C55E) — goal reached, regression evals
- JetBrains Mono — grid, trace, scores, section numbers
- Inter — explanatory text

## The 6 components in Chapter 01

| # | Concept | What the component does |
|---|---|---|
| 01 | What is an eval | Single-step runner — click Step, watch input→grade happen once |
| 02 | Eval anatomy | Labeled episode diagram — hover each term to define it |
| 03 | Single vs multi-turn | Toggle — shows why multi-turn grading is harder |
| 04 | Three grader types | Same trace, three graders side by side with tradeoffs |
| 05 | pass@k | Slider k=1→20, three probability curves update live |
| 06 | Capability vs Regression | Fail a maze → improve → promote to regression suite |

## Source

Primary: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents  
Notes: `context/anthropic-evals.md`
