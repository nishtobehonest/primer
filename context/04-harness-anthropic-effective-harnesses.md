# Source Notes: Anthropic Engineering — Effective Harnesses for Long-Running Agents

**Sources:**
- https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents

**Published:** Nov 26, 2025. Author: Justin Young (Anthropic), with contributions from David Hershey, Prithvi Rajasekaran, Jeremy Hadfield, Naia Bouscal, Michael Tingley, Jesse Mu, Jake Eaton, Marius Buleandara, Maggie Vo, Pedram Navid, Nadine Yasser, Alex Notov.

---

## Core Definition

An agent harness is the software scaffolding around a model — the loop, tools, context management, and guardrails that turn raw intelligence into a working agent capable of completing tasks that span more than one context window.

## The Failure Mode This Post Addresses

| Failure Mode | How it manifests |
|---|---|
| One-shotting | Agent tries to do everything in a single continuous session |
| Context exhaustion mid-task | Session runs out of context before the task is done |
| Premature completion | Agent declares "done" to end gracefully rather than because the work is actually finished |
| No end-to-end testing | Agent skips verification, leaves undocumented or broken state |
| Lost continuity | Next session has no way to know what the previous one did or intended |

## Architectural Pattern: Initializer + Coding Agent

**Initializer agent** — runs once, first session only. Sets up:
- `init.sh` environment setup script
- `feature_list.json` — the full scope, broken into individually-trackable features (one real test case tracked **over 200 features** in this file)
- Git repository initialization
- Progress-tracking scaffolding

**Coding agent** — runs every subsequent session. Constraints:
- Works one feature at a time, not the whole scope at once
- Explicit instruction against over-scoping a single session
- Must leave a "clean state" before exiting: no major bugs, orderly and well-documented code, appropriate for merging to a main branch
- Runs browser-automation testing before marking a feature complete
- Writes progress notes + clean git history so the next session can resume with zero re-exploration

## Reported Numbers

Only one quantified figure appears in this post: **"over 200 features"** tracked in the `feature_list.json` for the claude.ai-clone test case. This is a scope descriptor, not a performance metric. **No pass rate, accuracy percentage, benchmark score, time-to-completion, or cost figure is disclosed in this post** — do not imply otherwise in the chapter.

## Key Quotes

- "Each new session begins with no memory of what came before... agents need a way to bridge the gap between coding sessions."
- On "clean state": "the kind of code that would be appropriate for merging to a main branch: there are no major bugs, the code is orderly and well-documented."
