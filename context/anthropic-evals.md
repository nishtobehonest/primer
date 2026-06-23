# Demystifying Evals for AI Agents — Anthropic Engineering
Source: https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents

## Core definition
An eval = a test for an AI system: give it an input, apply grading logic to its output, measure success.

## Anatomy of an eval
| Term | Meaning |
|---|---|
| Task/Problem | A single test with defined inputs + success criteria |
| Trial | One attempt at a task (run multiple to account for variance) |
| Grader | Logic that scores performance |
| Transcript/Trace | Full record of outputs, tool calls, reasoning |
| Outcome | Final env state after trial completes |
| Eval Harness | Infrastructure for running tasks + aggregating results |
| Eval Suite | Collection of related tasks measuring specific capabilities |

## Single-turn vs multi-turn
- **Single-turn**: prompt in, grade output directly
- **Multi-turn**: agent operates across many turns, calling tools, modifying state — much harder to eval

## Three grader types
| Type | Methods | Strengths | Weaknesses |
|---|---|---|---|
| Code-based | String match, binary tests, outcome verification | Fast, cheap, reproducible | Brittle to valid variations |
| Model-based | Rubric scoring, LLM-as-judge, pairwise comparison | Flexible, captures nuance | Non-deterministic, costly |
| Human | Expert review, spot-checking | Gold standard | Expensive, slow |

## Key metrics for non-determinism
- **pass@k** — probability agent succeeds in at least 1 of k attempts (flexibility)
- **pass^k** — probability ALL k trials succeed (consistency/reliability)

## Capability vs Regression evals
- **Capability evals**: start low, target things the agent struggles with
- **Regression evals**: stay near 100%, prevent performance decline
- When capability evals saturate → graduate them into the regression suite

## Roadmap: zero to effective evals
1. Start with 20-50 tasks from real user failures
2. Convert manual checks into automated test cases
3. Write unambiguous tasks with reference solutions
4. Build balanced problem sets (positive AND negative cases)
5. Grade outcomes over paths — avoid brittle step sequences
6. Read transcripts regularly to catch bad graders
7. Monitor for saturation

## Key insight for the 2D world
Coding agents rely on deterministic test outcomes ("did the test suite pass?"). Our grid world is like that — the goal cell is an objective outcome. But an LLM agent's path to the goal is non-deterministic. This is exactly where pass@k vs pass^k becomes meaningful.
