# Source notes — WorkOS, "Flipping the flow: How MCP sampling lets servers ask the AI for help"

**Source:** https://workos.com/blog/mcp-sampling

## Core framing

Sampling reverses the normal MCP request direction. Normally the client (the app / AI assistant) asks the server for things — tool calls, resources. Sampling flips that: the **server** asks the **client** to go run something through the AI model, then hands the answer back.

Three claimed benefits:
1. **Server-initiated reasoning** — the server only calls the model when it actually needs to, mid-task, instead of every capability being pre-built into a rigid tool.
2. **Human review layers** — two checkpoints (before the request goes to the model, before the response goes back to the server) — nobody's prompt or output is invisible.
3. **Structured, auditable workflows** — because it's a defined protocol message, not a freeform prompt buried in application code, it's observable and versionable.

## Concrete example — support ticket triage

A backend detects an ambiguous support ticket. It sends a `sampling/createMessage` request asking the model to classify it. The model suggests a category ("Billing-related issue"). A human reviews and approves the classification before it's used to route the ticket. Other mentioned (but not detailed) use cases: data extraction, decision-making workflows, form completion, AI-assisted testing.

## Key quote

> "It gives servers the power to think and ask. It gives humans the ability to observe and approve."

## What this source does NOT have

No quantified business metrics (no % improvement, no cost figure, no adoption numbers). No mention of the 2026-07-28 deprecation — this post predates it. Used in the chapter as the plain-language "why would a server ever need this" explainer, not as a case-study source.
