# Chapter 04: Agent Harness Engineering — Spec

**Status:** Spec
**Audience:** External — shareable on LinkedIn
**Case study:** Anthropic (Claude Code / Claude Agent SDK harness design)
**Sources:** anthropic.com/engineering/effective-harnesses-for-long-running-agents · anthropic.com/engineering/harness-design-long-running-apps · faros.ai/blog/harness-engineering
**Last updated:** 2026-07-29

---

## What this is

A reader who has shipped an AI feature that "worked" in the demo and then quietly broke in production will recognize the gap this chapter names: the model didn't get worse, the scaffolding around it was never engineered. Six components walk through the concrete layers — session-bridging artifacts, mandatory verification gates, planner/generator/evaluator decomposition — that Anthropic's own engineering team built to turn one-shot generation into software that actually works, using their real reported time/cost data. No backend. No API calls.

Based on Anthropic's "Effective harnesses for long-running agents" and "Harness design for long-running application development." Built by Nishchay Vishwanath.

---

## Failure mode

You gave an agent 20 minutes and $9 and got something that looks like a working app — but the input wiring is broken and half the layout is dead space. Swapping in a smarter model doesn't fix that. The harness wrapped around the model does.

---

## Audience

**Primary:** Builders and PMs shipping AI agent features who've hit the "it worked in the demo" wall — the model output looked plausible once and then failed in a way that felt arbitrary.
**Secondary:** Anyone evaluating whether to buy/build agent tooling, who needs language for why two products on "the same model" perform completely differently.
**Not for:** Readers looking for model-selection or prompt-wording advice — this chapter is about the system built around the model, not the model or the prompt itself.

---

## Case study

| Field | Value |
|---|---|
| Company | Anthropic |
| Industry | AI agent infrastructure (Claude Code / Claude Agent SDK) |
| Source 1 | [Effective harnesses for long-running agents](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents) — Nov 26, 2025, Justin Young et al. |
| Source 2 | [Harness design for long-running application development](https://www.anthropic.com/engineering/harness-design-long-running-apps) — Mar 24, 2026, Prithvi Rajasekaran, Anthropic Labs |
| Concept applied | Session-bridging artifacts (initializer agent → coding agent), mandatory verification before marking complete, planner/generator/evaluator sprint decomposition |
| Technical metric | Not disclosed. Neither post reports a pass rate, accuracy %, or benchmark score. |
| Business metric | Retro game maker case: solo run **20 min / $9**; full-harness run **6 hr / $200** — "over 20x more expensive." DAW build round-by-round: Planner 4.7min/$0.46 → Build R1 2h7m/$71.08 → QA R1 8.8min/$3.24 → Build R2 1h2m/$36.89 → QA R2 6.8min/$3.09 → Build R3 10.9min/$5.88 → QA R3 9.6min/$4.06 → **Total 3h50m / $124.70**. |
| Reported outcome | Solo run: broken input wiring, wasted layout space, rigid workflow. Full-harness run: full-viewport canvas, working entity movement/gameplay, plus unrequested bonus features (sprite generator, level designer). |
| Key quote | "Each new session begins with no memory of what came before... agents need a way to bridge the gap between coding sessions." |
| Supporting scope stat | Session-bridging test case tracked "over 200 features" in a single `feature_list.json` — scale, not a performance number. |

**Supporting reference (industry framing, cited in intro + footer, not the case study):** [Faros AI — "Harness Engineering: What Makes AI Coding Agents Work in 2026"](https://www.faros.ai/blog/harness-engineering). Supplies the "Agent = Model + Harness" formula and the "prompt engineering (2022-23) → context engineering (2024-25) → harness engineering (2026)" maturity framing used to open the intro.

**Worked example (Nish's own repo, Component 06 only):** `Technical/CLAUDE.md`'s PII guardrail on `career/` and read-only marker on `coursework/`; `nishtobehonest/CLAUDE.md`'s "Deploys are manual, not git-triggered..." context injection; `2d-world-ai/CLAUDE.md`'s own "when adding a new chapter" checklist; the `skills/` folder as a tool-design layer; the memory system's staleness warning ("this memory is 13 days old... verify before asserting as fact") as a guardrail against stale-context hallucination.

---

## Interactive theme

**Theme:** Terminal Replay
**Why:** The source material is literally about agent sessions in a terminal/dev environment. An annotated fake terminal that replays the *same* task with a harness layer toggled on vs. off demonstrates the mechanism directly — no metaphor required.

---

## The 6 concepts

| # | Concept | What the component does |
|---|---|---|
| 01 | Agent = Model + Harness (thesis) | Toggle Solo vs Full-harness run of the same task, same model. Reveals cost/time and a qualitative outcome diff. |
| 02 | The one-shot ceiling | Context bar fills across one long session; toggle session-bridging on/off to see a clean handoff vs. a premature "done." |
| 03 | The verification gate | Toggle a mandatory test-before-exit step; watch the same bug get caught or shipped. |
| 04 | Planner → Generator → Evaluator | Click through 7 real, timestamped/priced build phases from the DAW case; running cost total ticks up. |
| 05 | Sprint decomposition | Toggle continuous generation vs. sprint-gated generation; watch an evaluator-criteria checklist fill per sprint vs. one long uninterrupted run. |
| 06 | Harness artifacts in the wild | Annotated terminal replay of a Claude Code session opening this repo — CLAUDE.md context, a memory recall, a skill invocation. |

### ASCII mockups

**Component 01 — Agent = Model + Harness**
```
┌─────────────────────────────────────────────────────────┐
│  [ Solo run ]   [ Full-harness run ]   ← toggle buttons  │
│                                                           │
│  $ claude "build a retro game maker"                     │
│  > generating...                                         │
│  > done in 20 min                    (solo selected)     │
│                                                           │
│  ┌───────────────────┐   ┌─────────────────────────┐    │
│  │ preview (solo)     │   │ ✗ input wiring broken    │    │
│  │ [static mock UI]   │   │ ✗ half the layout unused │    │
│  └───────────────────┘   └─────────────────────────┘    │
│                                                           │
│  stat-chips:  $9 · 20 min          (warn, red)           │
│                                                           │
│  [Key insight — hidden until both runs are viewed]        │
│  "Same model. 20x the cost and time. Categorically       │
│   different outcome — one ships, one doesn't."            │
└─────────────────────────────────────────────────────────┘

  Toggling "Full-harness run" replays:
  $ claude "build a retro game maker" --harness=full
  > sprint 1: core loop................. done
  > sprint 2: input + physics........... done
  > sprint 3: level editor (27 criteria). done
  > 6 hr 0 min · $200
  ✓ working gameplay  ✓ sprite generator (bonus)  ✓ level designer (bonus)
  stat-chips: $200 · 6 hr (good, green) · "20x cost" (accent, blue)
```

**Component 02 — The one-shot ceiling**
```
┌─────────────────────────────────────────────────────────┐
│  Context window: [████████████████████░░] 92%           │
│                                                           │
│  [ No session bridging ]   [ Initializer + handoff ]      │
│                                                           │
│  (no bridging selected)                                   │
│  > ...still implementing feature 187 of 200+...           │
│  > context nearly full — wrapping up now                  │
│  > "Done!" (feature untested, file left in broken state)  │
│                                                           │
│  [Key insight] "Each new session begins with no memory    │
│  of what came before — agents need a way to bridge the    │
│  gap between coding sessions." — Anthropic                │
│                                                           │
│  (bridging selected)                                       │
│  > feature_list.json updated: 187/200+ done                │
│  > progress.txt written for next session                  │
│  > git commit: "clean state, feature 187 complete"          │
│  ── session ends ──                                         │
│  ── new session starts ──                                   │
│  > reading progress.txt... resuming at feature 188          │
└─────────────────────────────────────────────────────────┘
```

**Component 03 — The verification gate**
```
┌─────────────────────────────────────────────────────────┐
│  [ Test-before-exit: OFF ]   [ Test-before-exit: ON ]     │
│                                                           │
│  (OFF)                                                     │
│  > edited checkout.js                                     │
│  > looks correct                                           │
│  > marking task complete ✓                                 │
│  ...                                                        │
│  ⚠ later: checkout button doesn't fire (found by user)      │
│                                                           │
│  (ON)                                                       │
│  > edited checkout.js                                     │
│  > running browser-automation test...                      │
│  ✗ test failed: click event not bound                       │
│  > fixing...                                                 │
│  > re-running test... ✓ passed                               │
│  > marking task complete ✓                                    │
│                                                           │
│  [Key insight] The bug was identical in both runs. Only     │
│  one harness had a gate that could catch it before ship.     │
└─────────────────────────────────────────────────────────┘
```

**Component 04 — Planner → Generator → Evaluator**
```
┌─────────────────────────────────────────────────────────┐
│  ○ Planner   ○ Build R1  ○ QA R1  ○ Build R2  ○ QA R2      │
│  ○ Build R3  ○ QA R3                                        │
│  (click each stage to expand)                                │
│                                                              │
│  ▸ Planner        4.7 min   $0.46                            │
│  ▸ Build Round 1  2h 7min   $71.08                            │
│  ▸ QA Round 1     8.8 min   $3.24                             │
│  ▸ Build Round 2  1h 2min   $36.89                            │
│  ▸ QA Round 2     6.8 min   $3.09                             │
│  ▸ Build Round 3  10.9 min  $5.88                             │
│  ▸ QA Round 3     9.6 min   $4.06                             │
│  ────────────────────────────────                             │
│  Running total →  3h 50min  $124.70                            │
│                                                              │
│  stat-chips: 7 phases · 3 build/QA cycles · $124.70 total      │
└─────────────────────────────────────────────────────────┘
```

**Component 05 — Sprint decomposition**
```
┌─────────────────────────────────────────────────────────┐
│  [ Continuous generation ]   [ Sprint decomposition ]      │
│                                                              │
│  (Continuous)                                                │
│  > generating................................ (2h 04min)     │
│  > generating................................                 │
│  > generating................................ still running   │
│  (no checkpoint — quality drift invisible until the end)        │
│                                                              │
│  (Sprint decomposition)                                       │
│  Sprint 1  [criteria: 14/14 ✓]                                │
│  Sprint 2  [criteria: 19/19 ✓]                                │
│  Sprint 3  [criteria: 22/27 ⚠ — 5 unmet, evaluator blocks]      │
│                                                              │
│  [Key insight] Breaking work into evaluable chunks is a         │
│  harness decision — the model never "decided" to checkpoint.     │
└─────────────────────────────────────────────────────────┘
```

**Component 06 — Harness artifacts in the wild**
```
┌─────────────────────────────────────────────────────────┐
│  $ claude                                                    │
│  > reading Technical/CLAUDE.md...                             │
│    "career/ contains PII — do not push to a public remote"     │
│  > reading nishtobehonest/CLAUDE.md...                          │
│    "Deploys are manual, not git-triggered..."                    │
│  > memory recall: draft_campaign_forge_status.md                  │
│    ⚠ "this memory is 13 days old — verify before asserting"        │
│  > invoking skill: primer-chapter                                   │
│    building Chapter 04 from this exact process                       │
│                                                              │
│  [Key insight] The chapter you're reading right now is a         │
│  byproduct of the same harness layers described above.             │
└─────────────────────────────────────────────────────────┘
```

---

## Business outcomes section

**Attribution chain:** Harness design (session-bridging + verification gates + sprint decomposition) → time/cost per phase (DAW table: $124.70 / 3h50m) → output completeness (working software vs. a broken-looking prototype) → business outcome: the real cost isn't the extra $191 or 5h40m — it's what the $9/20-min version would have shipped uncaught.

**ROI scaler:** One input — agent-built features shipped per month. Scaled by Anthropic's own disclosed 20x cost/time multiplier (solo → full-harness). Output: illustrative budget delta at that volume. Labeled "illustrative, based on Anthropic's reported figures."

**Source:** Both Anthropic posts above; the multiplier and every number link to [harness-design-long-running-apps](https://www.anthropic.com/engineering/harness-design-long-running-apps).

---

## Page layout

```
┌──────────────────────────────────────────────┐
│ top-nav: ← Primer            nishchay.me ↗    │
├──────────────────────────────────────────────┤
│ CHAPTER 04                                    │
│ Agent Harness Engineering                     │
│ Based on Anthropic's engineering blog          │
├──────────────────────────────────────────────┤
│ intro (2 paragraphs): failure mode + case      │
│ study reference                                │
├──────────────────────────────────────────────┤
│ 01 Agent = Model + Harness        [component]  │
│ 02 The one-shot ceiling           [component]  │
│ 03 The verification gate          [component]  │
│ 04 Planner → Generator → Evaluator[component]  │
│ 05 Sprint decomposition           [component]  │
│ 06 Harness artifacts in the wild  [component]  │
├──────────────────────────────────────────────┤
│ → BUSINESS OUTCOMES                            │
│   attribution chain + ROI scaler               │
├──────────────────────────────────────────────┤
│ footer: Built by Nishchay Vishwanath ·          │
│ Sources: Anthropic (x2) · Faros AI              │
└──────────────────────────────────────────────┘
```

---

## Design notes

| Token | Used for |
|---|---|
| `--blue` | Chapter number, harness-engineered state, primary accent |
| `--teal` | Agent/session entity |
| `--green` | Verified/working/shipped, full-harness outcome |
| `--amber` | Solo/one-shot/in-progress, quick-but-risky state |
| `--red` | Broken/failed/uncaught bug |
| `--purple` | Context/memory artifacts (feature_list.json, progress notes, memory recall) |

---

## Done when

- [ ] All 6 components are interactive and correct
- [ ] Intro section works for a cold visitor with zero context
- [ ] Case study (Anthropic) is cited in the intro and footer
- [ ] Business outcomes section shows attribution chain and ROI scaler, both sourced
- [ ] No invented numbers anywhere — every figure traces to the case-study table above
- [ ] Page loads with no errors, no backend, no API key
- [ ] Top-nav is present (← Primer / nishchay.me ↗)
- [ ] Light and dark themes both work
- [ ] Card added to root index.html in slop-fix voice
- [ ] LinkedIn post drafted
