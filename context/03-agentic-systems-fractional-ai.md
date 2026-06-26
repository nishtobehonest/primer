# Source Notes: Fractional AI Engineering Blog

**Sources:**
- https://engineering.fractional.ai/i-wrote-a-profiling-tool-for-agents
- https://engineering.fractional.ai/stop-designing-chatbots
- https://www.fractional.ai/case-studies (Cando Rail & Terminals case study)

---

## I Wrote a Profiling Tool for Agents

**The problem:** Coordinator agents delegating to 4–5 subagents (each making 15–20 tool calls) accumulated tool results that "ballooned to hundreds of thousands of tokens by the end of a run." This degraded performance and inflated eval runtime costs — but it wasn't visible from logs alone.

**Key finding:** The tool revealed that in one agent, `get_fields` consumed almost all of the context tokens. Solution: add a `string_to_match` filter parameter so agents could request specific fields rather than a complete data dump.

**The profiler measures:**
- Output vs. input token usage
- Cached vs. uncached input costs (cache: $0.25/M vs. uncached: $2.50/M — 10× difference)
- Per-component attribution: user messages, each tool call

**Concrete numbers from Form Updater Agent:**
- Total cost: ~$0.71 per run
- Input tokens: 67% of total cost
- User messages: 78.4% of input tokens
- `get_form_outline` tool: 8.5% of input tokens

> "Figuring out what parts of our system could be pared down was not obvious from looking at the logs."

**The lesson for agentic system design:** Context bloat is a silent failure mode that requires dedicated tooling to see. You can't optimize what you can't measure.

---

## Stop Designing Chatbots

**Core argument:** Defaulting to a chat interface for AI features handicaps AI capabilities when applied to structured tasks or complex workflows. Design for the task, then choose the interface — not the other way around.

**Design principles for agentic systems:**
1. **Output-first design** — capture intent in natural language, but structure outputs to match task complexity
2. **Invisible AI** — integrate AI into existing interfaces rather than creating new chat windows
3. **Upstream processing** — agents handle research, analysis, and decision-making before surfacing results

**Failure modes described:**
- Information flattening: rich structured data reduced to unreadable text walls
- Interface multiplication: new chat windows instead of enhancing existing tools
- Back-and-forth overhead: conversational patterns applied to one-way execution tasks

**Case example — Airbyte Connector Builder:**
AI-powered form pre-population reduced API connector setup from hours to minutes. Result: "marked increase in connectors being built" post-launch.

**Key quote:** "Good AI design is invisible — don't build a new interface for it. Make the existing one smarter."

---

## Cando Rail & Terminals — Peter the Safety Agent

**Problem:** Manual risk assessments consumed up to 16 hours each, with extensive revision cycles. Cando needed to expand program capacity 6× without proportionally scaling expert headcount.

**Solution architecture:**
- Automated prework agent (pre-meeting research and document prep)
- Real-time voice transcription during expert meetings (Recall.ai + GPT-4 Realtime)
- Instantaneous draft generation from transcription + prework
- Human expert reviews and approves the draft

**Tech stack:** GPT-4.1, GPT-4 Realtime, Recall.ai, LangChain, Microsoft Teams integration

**Reported outcomes:**
- Saves over 20 hours per assessment
- Reports drafted for less than $0.05 each
- Enables 6× program expansion in 17% of the time (previously impossible at the expert headcount available)

**Why this is an agentic system design example:**
The system uses multiple coordinated agents (prework agent + transcription agent + drafting agent) with clear task boundaries, minimal footprint (agents prepare and draft, human approves), and structured handoffs between stages.
