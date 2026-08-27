# Source notes — IMTI, "Sampling: When the Server Calls Your Model Back"

**Source:** https://imti.co/mcp-sampling/

## Who wrote this

A practitioner who actually built and runs an open-source MCP server in production: `txn2/mcp-data-platform` (Apache-2.0, written in Go), which connects AI assistants to Trino, DataHub, and S3 through one MCP endpoint. This is the closest thing to a real production reference in the sampling literature — but it's a deliberate **non-adoption** story, not a success-metric case study.

## Key finding — this project chose NOT to use sampling

> "txn2/mcp-data-platform grounds the model a different way, by injecting catalog context into its tool results rather than calling back for sampling."

Instead of the server pausing mid-task to ask the client's model a question (sampling), this server just includes richer context (ownership, lineage, PII flags, data-quality info) directly in its tool-call responses. The calling model reasons over that context itself — no round-trip needed.

## The most useful quote for the chapter

> "Sampling is the tool for servers that genuinely need the host's model mid-task; many data platforms do not."

This is the practical "when should you actually reach for this" rule of thumb — used as the basis for the chapter's decision-tool component (substituting for the usual ROI-slider business-outcomes section, since no company reports a quantified metric for sampling specifically).

## What this source does NOT have

No performance numbers, no before/after metrics, no discussion of transport constraints (stdio vs. HTTP) or the 2026-07-28 deprecation. It's protocol-design reasoning, not an outcomes report.
