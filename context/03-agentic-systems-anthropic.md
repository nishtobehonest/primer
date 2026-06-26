# Source Notes: Anthropic Engineering — Multi-Agent Systems

**Sources:**
- https://www.anthropic.com/engineering/multi-agent-research-system
- https://www.anthropic.com/research/building-effective-agents
- https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

---

## Key Failure Modes

| Failure Mode | How it manifests |
|---|---|
| Excessive subagent spawning | Agents spawn subagents for queries that didn't need them |
| Duplicate work | Workers overlap in scope, produce conflicting outputs |
| Poor source / tool selection | Agents pick wrong tools due to vague tool descriptions |
| Sequential bottleneck | Tasks run one at a time when they could be parallel |
| Context rot | Accumulated tool results fill context, degrading output quality |
| Silent failure | Worker fails, orchestrator receives no signal, returns confident wrong answer |

## Architectural Patterns

**Orchestrator-Workers:** Central orchestrator decomposes task, delegates to workers with clear task descriptions and output formats. Ideal when task scope is larger than one context window.

**Result Bypassing:** Subagents write results directly to filesystem/external memory rather than routing through orchestrator — avoids orchestrator context bloat.

**State Checkpointing:** Agents checkpoint progress before context window limits — enables resumption without restart.

**Rainbow Deployments:** Gradual traffic shifting between versions avoids disrupting running agent sessions during deploys.

## Minimal Footprint Principle

> "Prefer reversible over irreversible actions. Request only necessary permissions. Avoid storing sensitive information beyond immediate needs. Err on the side of doing less and confirming with users when uncertain."

Applied at every decision point where an agent must take an action with external effects.

## Performance Metrics (Anthropic Research System)

- Multi-agent (Opus 4 orchestrator + Sonnet 4 workers) outperformed single-agent by **90.2%** on internal eval
- Parallel tool calling reduced research time by **up to 90%**
- Tool description improvements (via Claude 4 prompt engineering) achieved **40% decrease in task completion time**
- Token usage explains **80% of variance** in multi-agent performance

## Context Engineering (from Effective Context Engineering post)

Key insight: "Context engineering is the art and science of curating what will go into the limited context window from that constantly evolving universe of possible information."

Design patterns to combat context rot:
1. **Compaction** — summarize history, reinitialize fresh context with distilled key decisions
2. **Structured note-taking** — agents write to external memory files, read on demand
3. **Just-in-time retrieval** — lightweight identifiers in context, retrieve full data at runtime
4. **Sub-agent clean contexts** — specialized subagents receive only what they need, return condensed summaries

## Key Quotes

- "The last mile often becomes most of the journey" — on prototype to production
- "Token usage by itself explains 80% of the variance in performance"
- "Think about how much effort goes into HCI, and plan to invest just as much effort in creating good agent-computer interfaces (ACI)"
- "Start with the simplest solution, and only add complexity when evidence supports it"
