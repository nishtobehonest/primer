# Source Notes: Anthropic Engineering — Harness Design for Long-Running Application Development

**Sources:**
- https://www.anthropic.com/engineering/harness-design-long-running-apps

**Published:** Mar 24, 2026. Author: Prithvi Rajasekaran, Anthropic Labs team.

---

## Architectural Pattern: Planner → Generator → Evaluator

Three agents working together on long-running app builds:
- **Planner** — breaks the overall task into smaller chunks (sprints)
- **Generator** — builds each chunk
- **Evaluator** — reviews the output against sprint-specific criteria and sends feedback before the next chunk starts

## Case 1: Frontend Design Quality Loop

- Ran **5 to 15 iterations per generation**; full runs stretched **up to four hours**
- By the ninth iteration, produced "a clean, dark-themed landing page"; a "creative leap" appeared on the tenth iteration (a 3D spatial gallery) — used to illustrate that later iterations tend to improve, not just converge
- Before: "Claude normally gravitates toward safe, predictable layouts that are technically functional but visually unremarkable"
- After: "later implementations tended to be better as a whole," including creative leaps beyond the original brief

## Case 2: Retro Game Maker — Solo vs. Full Harness

The clearest quantified before/after in either Anthropic post. Same model, two harness conditions:

| Run | Time | Cost | Outcome |
|---|---|---|---|
| Solo (no harness) | 20 min | $9 | Broken input wiring, wasted layout space, rigid workflow |
| Full harness | 6 hr | $200 | Full-viewport canvas, working entity movement/gameplay, working input, **plus unrequested bonus features**: a sprite generator and a level designer |

Stated verbatim: the full-harness run was **"over 20x more expensive."** Sprint 3 of this build alone had **27 evaluator criteria** covering the level editor.

**This is the chapter's primary quantified case-study data point** — used in Component 01 (thesis) and the Business Outcomes ROI scaler.

## Case 3: Digital Audio Workstation (Harness V2) — Round-by-Round Breakdown

| Phase | Time | Cost |
|---|---|---|
| Planner | 4.7 min | $0.46 |
| Build Round 1 | 2h 7min | $71.08 |
| QA Round 1 | 8.8 min | $3.24 |
| Build Round 2 | 1h 2min | $36.89 |
| QA Round 2 | 6.8 min | $3.09 |
| Build Round 3 | 10.9 min | $5.88 |
| QA Round 3 | 9.6 min | $4.06 |
| **Total** | **3h 50min** | **$124.70** |

Used directly in Component 04 (Planner → Generator → Evaluator).

## Sprint Decomposition vs. Continuous Generation

- Continuous (undecomposed) generation ran "over two hours without the sprint decomposition" in one comparison — described as higher-risk because quality drift isn't visible until the whole run finishes
- Sprint decomposition gates each chunk against evaluator criteria before continuing (see Sprint 3 / 27-criteria example above)
- Models mentioned in connection with harness evolution: Claude Sonnet 4.5, Opus 4.5, Opus 4.6 — **no benchmark scores (e.g. SWE-bench) are attached to any of them in this post**

## Disclosure Summary

- **Technical performance metric (pass rate/accuracy/benchmark):** Not disclosed anywhere in this post.
- **Business/cost metric:** Disclosed — the solo-vs-harness comparison and the DAW round-by-round table above are the only hard numbers in either Anthropic post, and are the chapter's sole quantified source data.
