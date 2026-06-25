# Primer

> Interactive AI explainers — learn by doing, not by reading.  
> **Live:** https://lab.nishchay.me  
> **GitHub:** https://github.com/nishtobehonest/primer

---

## Why this exists

Every week, teams ship an AI feature, do a quick demo, and call it good. The demo worked. The AI said something smart. Ship it.

Two months later, it's embarrassing in production.

Not because anyone was careless. Because the kind of testing that catches non-deterministic failures (systems that don't give the same output every time — unlike a calculator, which always returns the same answer to the same question) looks nothing like the testing teams already know how to do. You can't run your usual unit tests against a language model and trust the results. You need a different mental model for how these systems fail and how to know when they're actually working.

This is what the AI industry calls **AI slop**: AI that looks right once, isn't measured, isn't understood, and degrades in ways no one notices until it's someone else's problem.

Primer is a library of interactive explainers — each one a single self-contained page — built to close that gap. Not with documentation. With things you can step through, break, and explore.

---

## The editorial premise

Every chapter in Primer answers a specific failure mode of the same question: **How do you avoid AI slop?**

The answer is always a specific technical practice. Evals. Feedback loops. Grounding with retrieval. Fine-tuning for specificity. The series is a progression from "how do you know if it works?" to "how do you make it actually work?" — each chapter adding one concrete tool to the builder's arsenal.

The target reader is an engineer, PM, or tech lead who is already shipping AI features and suspects they're missing something structural. Not an ML researcher running benchmark pipelines. Not a student learning what an LLM is for the first time.

---

## How it's built

No framework. No build step. No backend. No API keys.

Each chapter is a single HTML file with inline CSS and JavaScript. Agents are simulated entirely in the browser using A* pathfinding (an algorithm that finds the shortest path through a grid — the way GPS calculates a route) and scripted probability tables. Open any `index.html` directly in a browser and it runs.

This was a deliberate choice: interactivity that requires infrastructure breaks at the worst possible moment. The demos need to work anywhere, including offline.

The visual grid world — the core teaching surface across multiple chapters — uses CSS Grid with 36×36px cells and vanilla DOM updates (manipulating the page directly through JavaScript, without a library). Animations run on `requestAnimationFrame` (the browser's native hook for smooth, 60-fps updates — no timers, no jank).

---

## What's been built

### Chapter 01 — AI Evals

**"You can't tell if it works by looking at it. Evals are how you know."**

Live at: https://lab.nishchay.me/chapters/01-evals/

Six components, each teaching one concept by making you do something:

**What is an eval.** A step-by-step runner. Click the button. Watch the agent move one cell on a grid. Watch the trace (the log of what happened) update. Watch the grader fire and report an outcome (goal reached, hazard hit, max steps exceeded). The abstraction is the same whether the agent is a robot on a grid or a language model answering customer support emails.

**Eval anatomy.** A nested diagram of the full terminology stack: Suite → Harness → Task → Trial → Trace → Outcome → Grader. Every one of these terms gets conflated in practice. Hover any node to see its definition.

**Single-turn vs. multi-turn.** A toggle that shows why grading a single response (instant, self-contained) is structurally different from grading a full episode (the agent acts multiple times before you can grade anything).

**Three grader types.** The same trace, evaluated three ways: a code-based check (fastest, exact), a model-based judge (flexible, more expensive), and a human review (most nuanced, doesn't scale). Expandable cards show the tradeoffs.

**pass@k.** The most important and least understood concept in AI evals. An interactive slider (k from 1 to 20) with live probability curves for three agent types. The core insight: a non-deterministic agent that succeeds 70% of the time has a 97.5% chance of succeeding at least once in 10 tries. pass@1 (checking once and calling it done) dramatically underestimates what the agent can actually do.

**Capability vs. regression.** A maze fails. The agent improves. The card animates into a regression suite (a set of tests that must always pass, protecting against going backwards). The lifecycle of an eval, in motion.

---

### Chapter 02 — Feedback Loops

**"Agents that ramble vs. agents that plan. Here's what separates them."**

Live at: https://lab.nishchay.me/chapters/02-agentic-loops/

Five components on what separates a real agentic loop (a system that iterates toward a goal by evaluating its own output and adjusting) from a pipeline that's pretending to be one.

**The one-shot trap.** A pipeline view with a toggle that reveals the hidden assumptions baked into every node: "assumes the intent was clear," "assumes the docs are current," "assumes the output matched the spec." Most AI systems are one-shot pipelines with assumption debt, not loops. The toggle makes the debt visible.

**What a feedback loop actually is.** Three patterns compared: retry (just running again — sampling variance, not iteration), human review (true iteration, doesn't scale), evaluator-as-judge (the only pattern that scales — an automated evaluator generates a signal, and a delta computation turns that signal into an actionable change). Most systems implement retry and call it a loop.

**The iteration cycle.** An SVG diagram of the four nodes every real loop needs: Generate → Evaluate → Delta → Steer. A context panel accumulates feedback across passes. The key insight: almost every "agentic" system skips Delta entirely. Without an explicit step that translates the evaluation score into a concrete steering instruction, the loop can run forever without converging.

**The stopping problem.** A quality slider that walks through cost versus quality as the loop iterates. The problem isn't running the loop — it's knowing when to stop. Convergence criteria (the rules that say "we're done") need to be defined before the loop starts, not eyeballed after.

**Zoom out.** A frame showing where parallel sub-agents (many agents working in parallel on sub-tasks) fit in this picture. They live inside the Generate phase — multiple things generating in parallel. Feedback loops govern what happens across phases: one generation, one evaluation, one steering update per cycle.

---

## What's coming

| Chapter | Title | Problem it solves |
|---|---|---|
| 03 | RAG | Hallucinations are a retrieval problem |
| 04 | Fine-tuning | Generic model, generic output |

Chapter 03 will make retrieval-augmented generation (a system that grounds the model in real documents by searching a database and including the relevant results in the prompt) tangible: you'll build a knowledge base, watch a query retrieve from it, and see what happens when retrieval fails.

Chapter 04 will cover fine-tuning (retraining a model on your specific data so it learns your domain, your tone, your edge cases — instead of trying to prompt-engineer a general model into caring about your specific problem).

---

## Running locally

No setup required. Clone the repo and open any file in a browser:

```bash
git clone https://github.com/nishtobehonest/primer
open 2d-world-ai/index.html
```

For a specific chapter:

```bash
open 2d-world-ai/chapters/01-evals/index.html
open 2d-world-ai/chapters/02-agentic-loops/index.html
```

Deployment is Vercel — every push to `main` auto-deploys to https://lab.nishchay.me.

---

## Repo structure

```
2d-world-ai/
├── index.html                    # Chapter index — lab.nishchay.me root
├── context/                      # Source reading notes
│   ├── anthropic-evals.md        # Anthropic engineering blog (Ch01 primary source)
│   ├── hamel-evals.md            # Hamel Husain substack
│   └── handbook-evals.md         # AI Evals for Everyone handbook
└── chapters/
    ├── 01-evals/
    │   ├── index.html            # Chapter 01 page
    │   ├── style.css             # Styles
    │   ├── world.js              # Grid world, A* pathfinding, agent simulation, graders
    │   └── components.js         # Six interactive components
    └── 02-agentic-loops/
        ├── index.html            # Chapter 02 page
        ├── style.css
        └── components.js         # Five interactive components
```

---

## Credits & sources

Chapter 01 draws from:
- Anthropic Engineering: [Demystifying Evals for AI Agents](https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents)
- Hamel Husain: [Why AI Evals Are an Increasingly Valuable Skill](https://hamel.dev/blog/posts/evals/)
- *AI Evals for Everyone* — Aishwarya Naresh Reganti & Kiriti Badam

Built by [Nishchay Vishwanath](https://nishchay.me)
