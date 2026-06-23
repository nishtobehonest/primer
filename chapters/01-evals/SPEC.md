# Chapter 01: Evals — Interactive Explainer

**Status:** Spec  
**Audience:** External — shareable on LinkedIn  
**Source material:** [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents) — Anthropic Engineering  
**Deployment target:** `evals.nishchay.me` (standalone Vercel deploy)  
**Last updated:** 2026-06-23

---

## What this is

A single scrollable page that makes AI evals tangible. If you've heard "we need evals" but never quite understood what that means in practice — this is for you. Six core concepts, six live interactive components, zero setup. Built on a 2D grid world where you can watch agents succeed and fail, then measure exactly why.

No backend. No API calls. Try it in your browser right now.

*Based on Anthropic Engineering's "Demystifying Evals for AI Agents." Built by Nishchay Vishwanath.*

---

## Audience

**Primary:** PMs, engineers, and technical leads who work with AI systems and want to understand what evals actually are — not abstractly, but concretely. Someone who has shipped an LLM feature and wondered "how do I know if this is working?"

**Secondary:** People who saw the LinkedIn post, want to understand evals, and have 10 minutes.

**Not for:** ML researchers, people who already run eval pipelines. This is a 101.

---

## Intro section (top of page — visible before scrolling)

```
┌──────────────────────────────────────────────────────────────────┐
│                                                                  │
│  AI Evals, Explained Interactively                               │  ← Bricolage Grotesque
│                                                                  │
│  Traditional software is deterministic — same input,            │
│  same output, always. AI systems aren't. That's why             │
│  we need evals: a way to measure whether an AI is               │
│  actually working, not just whether it looked right             │
│  the one time you tried it.                                      │
│                                                                  │
│  Six concepts. Six live demos. Scroll through.                   │
│                                                                  │
│  Based on Anthropic Engineering's eval framework. ↗             │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## The 6 Concepts

### 01 — What is an eval
> *"Give an AI an input, apply grading logic to its output, measure success."*  
> — Anthropic Engineering

An eval is the AI equivalent of a unit test — except instead of checking one fixed output, it grades behavior across many runs. Click **Step** below to watch the full loop happen once: the agent moves, the trace records it, the grader fires.

**Component: Single-step runner**

A 5×5 mini grid with the agent at start. One button: **Step**. Each click = one tick of the eval loop: agent observes → picks action → environment applies it → grader checks the result. The trace builds on the right.

```
  Before                   After one click
  # # # # #                # # # # #
  # @ . . #    → Step →    # . @ . #
  # . . G #                # . . G #
  # # # # #                # # # # #

                     trace:  { tick: 0, action: "right", result: "ok" }
                     grade:  goal_reached? NO
```

Keep clicking until the agent reaches G. When it does, the grader fires `goal_reached: 1.0`. That's one eval, one trial, one result.

---

### 02 — Eval anatomy
> *Task · Trial · Grader · Trace · Outcome · Harness · Suite*

The word "eval" gets used to mean six different things depending on who's talking. Here they are, defined and nested in the order they actually relate to each other. **Hover any term** to see its definition — no glossary needed.

**Component: Labeled episode diagram**

A completed episode shown as a nested diagram. Each term is bracketed and labeled. Hover or click any label to highlight it and see a one-line definition appear inline.

```
  ┌── Suite ─────────────────────────────────────────────────┐
  │  maze_01  maze_02  maze_trap  maze_deadend               │
  │                                                          │
  │  ┌── Harness ──────────────────────────────────────────┐ │
  │  │  runs all trials, collects traces, aggregates scores │ │
  │  │                                                      │ │
  │  │  ┌── Task: maze_01 ────────────────────────────────┐ │ │
  │  │  │  reach G · avoid X · max 30 steps               │ │ │
  │  │  │                                                  │ │ │
  │  │  │  ┌── Trial 1 ──────────────────────────────────┐ │ │ │
  │  │  │  │  ┌── Trace ──────────────────────────────┐  │ │ │ │
  │  │  │  │  │  tick 0  right  ok                    │  │ │ │ │
  │  │  │  │  │  tick 1  down   ok                    │  │ │ │ │
  │  │  │  │  │  tick 2  right  goal ← Outcome        │  │ │ │ │
  │  │  │  │  └───────────────────────────────────────┘  │ │ │ │
  │  │  │  │  Grader → goal_reached: 1.0  PASS           │ │ │ │
  │  │  │  └─────────────────────────────────────────────┘ │ │ │
  │  │  └──────────────────────────────────────────────────┘ │ │
  │  └────────────────────────────────────────────────────────┘ │
  └────────────────────────────────────────────────────────────┘
```

---

### 03 — Single-turn vs Multi-turn
> *Single-turn: grade one response. Multi-turn: grade an entire trajectory.*

Most people's mental model of an eval is single-turn: send a prompt, check the reply. But agents operate across many turns — and grading a full trajectory is fundamentally different. Toggle between the two modes below to feel the difference.

**Component: Mode toggle**

**Single-turn mode:** one prompt in, one action out, grade fires instantly — the result box lights up immediately. **Multi-turn mode:** the full episode plays step by step, and the grade box stays grey until the episode terminates. The delay is the point — you can't grade a multi-turn agent on one move.

---

### 04 — Three grader types
> *Code-based · Model-based · Human — each with different speed, cost, and nuance.*

There's no single right way to grade an AI. The same trace can be evaluated three different ways, each with different tradeoffs. Below is the same 5-step trace run through all three. **Click a column** to expand its tradeoff breakdown.

**Component: Three-column trace viewer**

```
  CODE-BASED              MODEL-BASED              HUMAN
  ────────────────        ─────────────────        ──────────────────
  goal_reached?           "Did the agent           [ Expert Review ]
  result == "goal"        avoid hazards
  → 1.0  ✓               proactively?"            "Good recovery
                          Score: 4 / 5             after the block
  wasted_moves?           → 0.80  ✓               at tick 3 — but
  blocked / total                                  path was not
  → 0.92  ✓                                       optimal overall."
                                                   Score: 4 / 5
  Fast. Cheap.            Nuanced. Costly.         Gold standard.
  Brittle to              Non-deterministic.       Slow. Requires
  valid variations.       Needs calibration.       expert access.
```

---

### 05 — pass@k
> *pass@k = probability the agent succeeds in at least one of k trials.*

Here's the trap: you run your AI agent once, it works, you ship it. But non-deterministic systems can't be judged on a single run. Drag the slider and watch what happens to each agent's success rate as you give it more tries.

**Component: Slider + live probability chart**

Slider from k = 1 to k = 20. Three curves update live — one per agent type.

```
  P(at least one success in k tries)

  1.00 │ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─  RuleBasedAgent
       │              ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾
  0.80 │         ╱‾‾‾                   LLMAgent
       │    ╱‾‾‾
  0.60 │╱‾‾
       │
  0.40 │   ╱‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾  RandomAgent
       │ ╱
  0.20 │╱
       └──────────────────────── k
       1    5    10    15    20

  Agent            pass@1   pass@5   pass@10   pass@20
  RandomAgent       0.30     0.68     0.88      0.98
  RuleBasedAgent    1.00     1.00     1.00      1.00
  LLMAgent          0.70     0.94     0.99      1.00
```

Fixed callout at k=1: *"At pass@1, LLMAgent looks 2× worse than it is. One run is not an eval."*

---

### 06 — Capability vs Regression
> *Capability evals target what your agent can't do yet. Once it can, they become regression evals.*

Evals aren't static. As your agent improves, the tests that used to expose failures get promoted into a regression suite — a safety net that protects against sliding backward. Try it below.

**Component: Two-column promote flow**

**Capability** column: a hard maze, agent fails (red FAIL badge). Hit **Improve Agent** — the agent uses a better strategy and now passes (green). Hit **Promote to Regression →** and the maze card animates into the **Regression** column with a lock: *"This must always pass."*

```
  BEFORE PROMOTE                       AFTER PROMOTE

  CAPABILITY    REGRESSION             CAPABILITY    REGRESSION
  ──────────    ──────────             ──────────    ──────────
  ┌──────────┐  (empty)               (empty)       ┌──────────┐
  │ maze_hard│                                       │ maze_hard│
  │  ✗ FAIL  │                                       │  ✓ PASS  │
  └──────────┘                                       │  🔒      │
  [ Improve ] [ Promote → ]                          └──────────┘
                                                   "Must always pass"
```

---

## Page layout

Single scrollable page. Full-width, max-width 860px centered.

```
┌──────────────────────────────────────────────────────────────────┐
│  [HEADER]  AI Evals, Explained Interactively                     │  ← Bricolage Grotesque 800
│            Based on Anthropic Engineering ↗                      │  ← Inter --muted
├──────────────────────────────────────────────────────────────────┤
│  [INTRO]   2–3 sentence context for cold visitors                │
├──────────────────────────────────────────────────────────────────┤
│                                                                  │
│  01  WHAT IS AN EVAL                                             │  ← Bricolage Grotesque
│  ─────────────────────────────────────────────────              │
│  Source quote in muted text                                      │  ← Inter --muted
│  2–3 sentence explanation for someone with no context            │  ← Inter --text
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐     │
│  │                                                        │     │
│  │              interactive component                     │     │  ← --surface
│  │                                                        │     │
│  └────────────────────────────────────────────────────────┘     │
│                                                                  │
├──────────────────────────────────────────────────────────────────┤
│  02  EVAL ANATOMY                                                │
│  ...                                                             │
├──────────────────────────────────────────────────────────────────┤
│  [FOOTER]  Built by Nishchay Vishwanath · Source: Anthropic ↗   │
│            github.com/nishtobehonest/2d-world-ai                 │
└──────────────────────────────────────────────────────────────────┘
```

---

## Design system

Inheriting nishtobehonest tokens + plan-03 typography.

| Token | Value | Used for |
|---|---|---|
| `--bg` | `#0A0A0F` | Page background |
| `--surface` | `#12121A` | Component cards |
| `--border` | `#1E1E2E` | Card borders, section dividers |
| `--text` | `#E2E8F0` | Body copy |
| `--muted` | `#64748B` | Source quotes, attribution, secondary labels |
| `--blue` | `#4F8EF7` | RuleBasedAgent · PASS states · primary accent |
| `--teal` | `#2DD4BF` | LLMAgent · capability evals · agent tile |
| `--amber` | `#F59E0B` | RandomAgent · in-progress states |
| `--green` | `#22C55E` | Goal tile · goal reached · regression |

**Typography:**

| Font | Weight | Used for |
|---|---|---|
| Bricolage Grotesque | 800 | Page title, section headers (`01 WHAT IS AN EVAL`) |
| JetBrains Mono | 400/500 | Grid tiles, trace rows, section numbers, scores, code |
| Inter | 400 | All explanatory text, quotes, attribution |

**Grid tiles:** 36×36px cells, 3px gap. Tile color:
- Wall `#` → `--surface` fill, `--border` border
- Empty `.` → transparent, `--border` border
- Agent `@` → `--teal` background
- Goal `G` → `--green` background
- Hazard `X` → `#EF4444` (red) background

---

## Tech stack

| Layer | Choice | Reason |
|---|---|---|
| HTML/CSS/JS | Vanilla, no build step | Deploy anywhere, no tooling overhead |
| Grid rendering | CSS Grid | Readable, animatable, no library needed |
| Agent simulation | Pure JS (A* for RuleBased, random for Random, scripted for LLM) | No backend, no API key, works offline |
| Animations | CSS transitions + `requestAnimationFrame` | Smooth without a library |
| Fonts | Google Fonts (Bricolage Grotesque, JetBrains Mono, Inter) | Same CDN link as nishtobehonest |
| Deployment | Vercel (standalone deploy) | `evals.nishchay.me` — own URL, own repo |

---

## Repo + deployment

- Own GitHub repo: `nishtobehonest/2d-world-ai-evals` (or similar)
- Deployed to Vercel, connected to repo — every push auto-deploys
- URL: `evals.nishchay.me`
- Source credited in footer: Anthropic Engineering post + link

---

## Files

```
chapters/01-evals/
├── SPEC.md          ← this file
├── index.html       ← the page
├── style.css        ← tokens, typography, layout, component styles
├── world.js         ← grid rendering, agent simulation, trace recording
└── components.js    ← the 6 interactive components
```

---

## LinkedIn post (for reference when shipping)

> I built an interactive explainer for AI evals — one of those concepts everyone mentions but few people actually understand.
>
> 6 concepts. 6 live demos. No setup.
>
> Try it: evals.nishchay.me
>
> Based on Anthropic Engineering's eval framework — highly recommend the source post too.

---

## Done when

- All 6 components are interactive and correct
- Intro section works for a cold visitor with zero context
- Page loads with no errors, no backend, no API key
- Attribution to Anthropic visible in header and footer
- Deployed to `evals.nishchay.me` and link resolves
- LinkedIn post drafted and ready to send
