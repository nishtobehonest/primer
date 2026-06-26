# Chapter 03: Agentic System Design — Spec

**Status:** Built
**Audience:** External — shareable on LinkedIn
**Case study:** Fractional AI (Cando Rail outcomes + engineering blog for design depth)
**Sources:** https://engineering.fractional.ai · https://www.fractional.ai/case-studies · https://www.anthropic.com/engineering/multi-agent-research-system
**Last updated:** 2026-06-26

---

## What this is

A single scrollable page that makes multi-agent system design tangible. Most people building with AI ship a single agent, watch it fail in unpredictable ways, and don't know why — because failures in multi-agent systems are invisible by default. This chapter teaches how agentic systems are structured, where they silently break, and what design decisions prevent those breaks from reaching users.

Six core concepts, six live interactive components, one real case study. No backend. No API calls.

Based on Anthropic Engineering's multi-agent research system writeup and Fractional AI's engineering blog. Built by Nishchay Vishwanath.

---

## Failure mode

Your multi-agent system runs to completion, returns a confident answer, and nobody flagged that one agent silently failed halfway through — because failures in multi-agent systems are invisible by default.

---

## Audience

**Primary:** Engineers and PMs who have shipped or are building agentic systems — people who know what an LLM is, have seen agents demo well, and are now hitting production walls.

**Secondary:** Technical leads deciding whether to build multi-agent vs single-agent for their next project.

**Not for:** ML researchers, people already running battle-hardened production agent infrastructure.

---

## Case study

| Field | Value |
|---|---|
| Company | Fractional AI |
| Industry | Applied AI / Enterprise Agent Development |
| Engineering blog | https://engineering.fractional.ai |
| Outcomes source | https://www.fractional.ai/case-studies (Cando Rail & Terminals) |
| Concept applied | Multi-agent orchestration with automated prework, voice transcription, and minimal footprint handoffs |
| Technical metric | Assessment drafting: up to 16 hours → instant draft, cost $0.05 per report |
| Business metric | Program capacity: 6× expansion in 17% of the time |
| Reported outcome | Saves 20+ hours per assessment; enables sixfold program scale |
| Key quote | "Figuring out what parts of our system could be pared down was not obvious from looking at the logs." — Fractional AI Engineering |

**Supporting reference (Component 03):** Airbyte's Context Store reduced agent tool calls by 40% and token consumption by up to 90% (Zendesk) by pre-indexing data — a real-world example of solving context bloat at the data layer. Source: https://airbyte.com/blog/airbyte-agents

---

## Interactive theme

**Theme:** Pipeline / Flow Diagram
**Why:** The concepts are structural — how agents connect, where failures propagate, how orchestration works. The "world" is a multi-agent pipeline the reader can inspect, break, and fix. Agent spatial behavior is not the mechanism here; system topology is.

---

## The 6 concepts

| # | Concept | What the component does |
|---|---|---|
| 01 | The silent failure | Orchestrator + 3 workers. All show success externally. "Introduce failure" makes Worker B silently fail — orchestrator returns a confident wrong answer. Toggle internal/external view. |
| 02 | Orchestrator-worker pattern | Toggle "Clear task boundaries" vs "Overlapping tasks" — see duplicate work and conflicting results emerge when boundaries blur. |
| 03 | Context bloat | Agent accumulates tool calls. Token bar fills. Quality degrades. "Profile" reveals which calls consume the most tokens. Airbyte stat shown as real-world fix. |
| 04 | Sequential vs. parallel | 4 tasks, toggle sequential/parallel. Animate execution. Introduce failure: sequential chain breaks, parallel others complete. 90% time reduction shown. |
| 05 | Minimal footprint | 3 action types (reversible/semi/irreversible). Toggle minimal footprint mode — agent pauses before irreversible actions for confirmation. |
| 06 | Prototype to production | 4-stage rail: Prototype → Staging → Pre-Production → Production. Click each stage to expand new failure modes and required design decisions. |

---

### ASCII mockups

**Component 01 — The Silent Failure**
```
  EXTERNAL VIEW              INTERNAL VIEW (toggle)
  ─────────────              ──────────────────────
       [ORCHESTRATOR]              [ORCHESTRATOR]
       "Analysis complete"         "Analysis complete"
         ↙    ↓    ↘                ↙    ↓    ↘
    [A ✓]  [B ✓]  [C ✓]       [A ✓]  [B ✗]  [C ✓]
                               WRONG DATA — silent

  [ Introduce failure ]   [ Show internal state ]
```

**Component 02 — Orchestrator-Worker**
```
  CLEAR BOUNDARIES              OVERLAPPING
  ────────────────              ────────────
  [Orchestrator]                [Orchestrator]
  ├── A: fetch data             ├── A: fetch + analyze
  ├── B: analyze                ├── B: analyze section 2  ←── duplicate
  └── C: format                 └── C: analyze + format   ←── conflict

  Result: ✓ clean               Result: 2 conflicting summaries ✗

  [ Toggle mode ]
```

**Component 03 — Context Bloat**
```
  CONTEXT WINDOW              TOKEN PROFILE
  Turn 1: get_user ─────────  get_fields      ████████  61%
  Turn 2: get_report          get_report        ████    24%
  Turn 3: get_fields          get_user            █      9%
  Turn 4: summarize           user_messages       █      6%
  ████████████████░░░░  82%
  Quality: ██████░░░░ degrading

  [ Add turn ]  [ Profile ]  [ Compact ]
```

**Component 04 — Sequential vs. Parallel**
```
  SEQUENTIAL (4 steps)    PARALLEL (1 step)
  [Fetch]                 [Fetch] ─┐
    ↓                    [Analyze]─┤──► done
  [Analyze]              [Process]─┤    time: 1×
    ↓                    [Format] ─┘
  [Process]
    ↓
  [Format]    time: 4×

  B fails → chain breaks   B fails → others finish ✓

  [ Toggle ]  [ Run ]  [ Introduce failure ]
```

**Component 05 — Minimal Footprint**
```
  ACTION              REVERSIBLE?   MINIMAL FOOTPRINT OFF  ON
  ─────────────────── ─────────     ─────────────────────  ──
  Read config file    ✓ yes         → execute              → execute
  Write summary       ~ partial     → execute              → execute
  Delete all logs     ✗ no          → execute              → confirm ⏸

  [ Toggle minimal footprint ]
```

**Component 06 — Prototype to Production**
```
  ●────────────────────────────────────────●
  Prototype    Staging    Pre-Prod    Production

  [click to expand each stage]

  Prototype:    1 agent · happy path · no errors
  Staging:      + error handling · + tool validation
  Pre-Prod:     + checkpointing · + human escalation
  Production:   + observability · + cost profiling · + async
```

---

## Business outcomes section

**Attribution chain:**
Agentic system design (orchestrator + voice agent + automated prework + minimal footprint handoffs)
→ Assessment drafting: 16 hours → instant
→ Cost per report: $0.05
→ Program capacity: 6× expansion
→ Business outcome: sixfold scale in 17% of the time

**ROI scaler:** "Assessments per month" slider (1–200) → "Hours saved per month" (N × 20) → "At $50/hr, approximately $[N × 1000]/month"

**Source:** https://www.fractional.ai/case-studies (Cando Rail & Terminals — saves 20+ hours per assessment, $0.05 per report)

---

## Page layout

```
┌──────────────────────────────────────────────────────────────┐
│  [TOP-NAV]  ← Primer                          nishchay.me ↗  │
├──────────────────────────────────────────────────────────────┤
│  [HEADER]  Agentic System Design                              │
│            Based on Anthropic Engineering + Fractional AI    │
├──────────────────────────────────────────────────────────────┤
│  [INTRO]   Failure mode hook + case study attribution        │
├──────────────────────────────────────────────────────────────┤
│  01  THE SILENT FAILURE                                       │
│  02  ORCHESTRATOR-WORKER PATTERN                              │
│  03  CONTEXT BLOAT                                            │
│  04  SEQUENTIAL VS. PARALLEL                                  │
│  05  MINIMAL FOOTPRINT                                        │
│  06  PROTOTYPE TO PRODUCTION                                  │
├──────────────────────────────────────────────────────────────┤
│  [OUTCOMES]  Fractional AI × Cando Rail attribution + ROI    │
├──────────────────────────────────────────────────────────────┤
│  [FOOTER]  Built by Nishchay · Sources                       │
└──────────────────────────────────────────────────────────────┘
```

---

## Design notes

| Token | Used for |
|---|---|
| `--blue` | Orchestrator agent, chapter number, primary accent |
| `--teal` | Worker/subagent nodes, active state |
| `--green` | Success state, checkpointed, confirmed, parallel pass |
| `--amber` | In-progress, context warning threshold, overlapping tasks |
| `--red` | Silent failure, broken chain, irreversible action, context danger |
| `--purple` | Context window fill, token budget, memory |

---

## Done when

- [x] All 6 components are interactive and correct
- [x] Intro section works for a cold visitor with zero context
- [x] Case study (Fractional AI) cited in intro and footer
- [x] Business outcomes section shows attribution chain and ROI scaler
- [x] Page loads with no errors, no backend, no API key
- [x] Top-nav is present (← Primer / nishchay.me ↗)
- [x] Light and dark themes both work
- [ ] Card added to root index.html in slop-fix voice
- [ ] LinkedIn post drafted
