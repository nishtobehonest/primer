(function () {
  'use strict';

  // ── Data: Section A — Pick a wedge ─────────────────────────────
  // Which wedge and why the others lost lives in the essay above, not here.
  // These 4 stages are purely how the chosen wedge (tool-use reliability)
  // gets executed, in order — each narrative states why that stage sits
  // at that point in the sequence, not just what the stage is.
  const WEDGE = [
    {
      priority: 1,
      action: `Build real things, not just consume content`,
      narrative: `This is the first real step because reading roadmap tables doesn't count as learning it. Before I let myself move on to failure modes, I need to have actually built something with 2-3 tool calls, watched it break under an ambiguous instruction, and logged what happened.`,
      resources: [
        { label: `Anthropic: Building Effective Agents`, url: `https://www.anthropic.com/research/building-effective-agents` },
      ],
      topics: [
        { key: 'p2-0', text: `A single-agent project with 2-3 tool calls (search, file read/write, API call)`, desc: `The smallest real thing that can actually fail, with enough surface area to hit real tool-selection and error-handling problems without building a whole system.` },
        { key: 'p2-1', text: `A small multi-step workflow that breaks under ambiguous instructions`, desc: `Ambiguity is where agents actually fall over in production. Deliberately underspecifying the task is the fastest way to find that.` },
        { key: 'p2-2', text: `A minimal agent harness you can poke at and log`, desc: `Without your own logging you're debugging blind. A harness you built yourself is the only one you can actually instrument.` },
      ],
    },
    {
      priority: 2,
      action: `Go deep on failure modes, not capabilities`,
      narrative: `Once something's actually built, this is where the real learning is, not what agents can do, but the specific ways they break. I need to be able to name and diagnose each of these on sight before I'd call the wedge "learned."`,
      resources: [
        { label: `Fractional AI: I wrote a profiling tool for agents`, url: `https://engineering.fractional.ai/i-wrote-a-profiling-tool-for-agents` },
      ],
      topics: [
        { key: 'p3-0', text: `Wrong tool selection`, desc: `The agent picks a plausible-sounding tool instead of the correct one. Usually a tool-description or naming problem, not a model problem.` },
        { key: 'p3-1', text: `Hallucinated tool calls`, desc: `The agent invents a tool, parameter, or return value that doesn't exist, a sign it's pattern-matching instead of grounding in the actual schema.` },
        { key: 'p3-2', text: `Context drift over long runs`, desc: `Instructions from turn one quietly stop being honored by turn twenty. That's the failure mode that makes long agent runs unreliable.` },
        { key: 'p3-3', text: `Infinite loop / retry failures`, desc: `The agent retries the same failed action indefinitely instead of escalating or stopping. A missing stopping condition, not just bad luck.` },
        { key: 'p3-4', text: `Poor error recovery`, desc: `The agent gets a tool error back and doesn't adapt its next move, treating a signal it should act on as noise.` },
        { key: 'p3-5', text: `State management bugs`, desc: `The agent loses track of what it already did and repeats or contradicts earlier steps, usually a context or memory design issue, not the model itself.` },
      ],
    },
    {
      priority: 3,
      action: `Document while you learn, don't wait to be expert first`,
      narrative: `Writing is what makes the previous two steps actually stick. I log the build failures the day they happen, not after I've "figured it all out." Waiting for expertise before publishing is just a way to never publish.`,
      topics: [
        { key: 'p4-0', text: `A build log post per failure (what broke, why, the fix)`, desc: `Write it the day it breaks. Waiting until you fully understand it means it never gets written.` },
        { key: 'p4-1', text: `A short weekly thread on one lesson`, desc: `Forces you to distill one lesson instead of dumping everything you learned that week.` },
        { key: 'p4-2', text: `A longer write-up once you've got 3-4 logged failures forming a pattern`, desc: `Patterns only become visible after a few data points. This is the synthesis step, not the first one.` },
      ],
    },
    {
      priority: 4,
      action: `Talk to practitioners, not just thought leaders`,
      narrative: `Last, because it's the highest-leverage but lowest-frequency move. One conversation with someone who's deployed an agent past a demo is worth more than the other three steps combined, but only once I have my own failures to compare notes against.`,
      topics: [
        { key: 'p5-0', text: `Engineers shipping agent products in production (not just AI Twitter voices)`, desc: `They've already hit the failure modes above in a real system, the fastest way to skip past the ones you'd take months to find yourself.` },
        { key: 'p5-1', text: `People in your network already touching agent tooling`, desc: `Lower-friction than cold outreach, and often close enough to your own context to compare notes directly.` },
        { key: 'p5-2', text: `Anyone who's deployed agents past a demo stage`, desc: `The demo-to-production gap is where most of the actual lessons live. Anyone past it has already paid for that knowledge.` },
      ],
    },
  ];

  // ── Data: Section B — Claude Code feature adoption tracker ─────
  // Merged/deduped from two overlapping source tables; priority: now|soon|lower|other
  const FEATURES = [
    { key: 'plan-mode', name: `Plan Mode`, desc: `Claude explores and proposes a plan before editing; you approve first`, priority: 'now', next: `Use on your next non-trivial task` },
    { key: 'checkpoints-rewind', name: `Checkpoints / /rewind`, desc: `Auto-snapshots before edits; rewind code, conversation, or both`, priority: 'now', next: `Make an edit, practice /rewind to undo it` },
    { key: 'permission-modes', name: `Permission Modes`, desc: `acceptEdits, plan, auto, dontAsk, bypassPermissions control how much Claude asks before acting`, priority: 'now', next: `Know the difference between plan and acceptEdits` },
    { key: 'context-cmd', name: `/context`, desc: `Visual breakdown of what's eating your context window`, priority: 'now', next: `Run it once context starts feeling sluggish` },
    { key: 'claude-md-memory', name: `CLAUDE.md / Auto Memory`, desc: `Project-level instructions file, plus Claude's self-written memory`, priority: 'now', next: `Run /init in a real project if you haven't` },
    { key: 'sessions-resume-fork', name: `Sessions: resume / fork`, desc: `/resume picks up a past conversation; fork branches without losing the original`, priority: 'now', next: `Resume yesterday's session instead of starting fresh` },
    { key: 'compact-cmd', name: `/compact [instructions]`, desc: `Frees context, optionally focused on what to keep`, priority: 'now', next: `Use with focus instructions instead of the default` },
    { key: 'commands-overview', name: `Commands (overview)`, desc: `Built-in / commands (/compact, /diff, /rewind, /tasks, etc.) plus custom skill-based commands`, priority: 'now', next: `Skim /help, learn /rewind, /diff, /context first, highest daily value` },
    { key: 'diff-cmd', name: `/diff`, desc: `Interactive diff viewer for uncommitted changes and per-turn diffs; arrow keys to browse files and turns`, priority: 'now', next: `Use it instead of git diff next time you review Claude's edits` },

    { key: 'skills', name: `Skills`, desc: `Reusable SKILL.md files Claude loads automatically or via /skill-name`, priority: 'soon', next: `Build one from a task you keep repeating` },
    { key: 'subagents', name: `Subagents`, desc: `Specialized configs with their own tools, model, system prompt`, priority: 'soon', next: `Build one via /agents (e.g. code reviewer)` },
    { key: 'agent-view-dispatch', name: `Agent View / Dispatch`, desc: `claude agents manages many background sessions from one screen`, priority: 'soon', next: `Dispatch one task, let it run while you switch windows` },
    { key: 'loop-cmd', name: `/loop`, desc: `Re-runs a prompt on an interval inside a live session; dies on exit`, priority: 'soon', next: `Try /loop 10m check if tests pass` },
    { key: 'hooks', name: `Hooks`, desc: `Scripts firing on lifecycle events (PreToolUse, Stop, SessionStart, etc.)`, priority: 'soon', next: `Set up one: auto-format after edits` },
    { key: 'output-styles', name: `Output Styles`, desc: `Persistent system-prompt-level personas/formats for a session`, priority: 'soon', next: `Try a built-in one via /config` },
    { key: 'effort-levels', name: `Effort Levels`, desc: `low/medium/high/max/auto, trades speed/cost for reasoning depth`, priority: 'soon', next: `Set /effort high for one hard debugging task` },
    { key: 'headless-mode', name: `Headless / -p mode`, desc: `Non-interactive Claude Code, pipe data in/out, scripting/CI use`, priority: 'soon', next: `Pipe a file through Claude on the command line once` },
    { key: 'tasks-background-bash', name: `/tasks / background bash`, desc: `List/manage background shell commands inside a session`, priority: 'soon', next: `Background a long build with !, check via /tasks` },

    { key: 'routines', name: `Routines`, desc: `Saved configs running on Anthropic cloud infra, on schedule/API/GitHub event`, priority: 'lower', next: `Create one at claude.ai/code/routines, start with nightly` },
    { key: 'claude-code-web', name: `Claude Code on the Web`, desc: `Full cloud sessions in a managed environment, linked to GitHub`, priority: 'lower', next: `Start one at claude.ai/code, teleport it back to terminal` },
    { key: 'remote-control', name: `Remote Control`, desc: `/rc makes a local session visible/controllable from claude.ai or mobile`, priority: 'lower', next: `Run /rc mid-session, check from your phone` },
    { key: 'workflows', name: `Workflows`, desc: `Claude writes and saves a reusable multi-step automation`, priority: 'lower', next: `Ask Claude to "write a workflow" for a repeated task` },
    { key: 'worktrees-manual', name: `Worktrees (manual)`, desc: `Parallel git branches you control directly`, priority: 'lower', next: `Run two sessions on two branches of the same repo` },
    { key: 'agent-teams', name: `Agent Teams`, desc: `Multiple Claude instances as teammates, messaging and claiming tasks`, priority: 'lower', next: `Try only after you're comfortable with subagents + dispatch` },
    { key: 'scheduled-tasks-desktop', name: `Scheduled Tasks (Desktop)`, desc: `Local recurring tasks with file access`, priority: 'lower', next: `Compare against Routines for the same job` },
    { key: 'fast-mode', name: `Fast Mode`, desc: `Trades quality for speed/cost on simpler tasks`, priority: 'lower', next: `Toggle on for quick mechanical edits` },
    { key: 'statusline', name: `Statusline`, desc: `Custom terminal status bar (git status, cost, context %)`, priority: 'lower', next: `Run /statusline, auto-configure from shell prompt` },
    { key: 'sandboxing', name: `Sandboxing`, desc: `OS-level filesystem/network isolation for the Bash tool`, priority: 'lower', next: `Check availability on your platform (/sandbox)` },
    { key: 'auto-mode', name: `Auto Mode`, desc: `Classifier auto-approves safe actions, fewer prompts`, priority: 'lower', next: `Only after acceptEdits feels routine` },
    { key: 'extended-thinking', name: `Extended Thinking`, desc: `Deeper reasoning, can be requested ad hoc ("ultrathink")`, priority: 'lower', next: `Use on a genuinely hard architecture decision` },
    { key: 'goal-cmd', name: `/goal`, desc: `Sets a condition; Claude works autonomously until met`, priority: 'lower', next: `Try on a well-defined task like "all tests pass"` },
    { key: 'auto-compaction', name: `Auto-compaction`, desc: `Automatic context summarization when window fills`, priority: 'lower', next: `Passive, just know it's happening` },

    { key: 'mcp', name: `MCP`, desc: `Connects external tools/services as callable tools`, priority: 'other', next: `Already covered via existing MCP Apps` },
    { key: 'voice-dictation', name: `Voice Dictation`, desc: `Push-to-talk dictation into the prompt box`, priority: 'other', next: `Skip unless you actually want to talk to your terminal` },
    { key: 'claude-in-chrome', name: `Claude in Chrome`, desc: `Browser automation, testing, form-filling from Claude Code`, priority: 'other', next: `Only relevant for frontend/web work` },

    { key: 'agent-sdk', name: `Claude Agent SDK`, desc: `Build your own agent products on the same harness that powers Claude Code: custom tools, custom permission logic, your own UI`, priority: 'expert', next: `Read the SDK overview, scaffold a minimal custom agent` },
    { key: 'custom-mcp-servers', name: `Building custom MCP servers`, desc: `Go from consuming MCP servers to writing your own, exposing your own tools/data to any MCP-compatible agent`, priority: 'expert', next: `Wrap one internal script or API as an MCP tool` },
    { key: 'long-running-harness', name: `Long-running agent harness design`, desc: `The initializer-agent + coding-agent pattern for agents that operate across many context windows unattended`, priority: 'expert', next: `Read the harness post, sketch how /goal or /loop approximates this` },
    { key: 'tool-writing-for-agents', name: `Writing tools for agents`, desc: `Design and evaluate the tools an agent calls, not just the prompts: parameter clarity, error surfaces, evaluation loops`, priority: 'expert', next: `Rewrite one MCP tool description using the clarity checklist` },
    { key: 'context-engineering-scale', name: `Context engineering at scale`, desc: `Sub-agent context isolation, compaction strategy, and multi-session state for long, coherent agent runs`, priority: 'expert', next: `Compare /compact's default behavior against a custom compaction strategy` },
  ];

  const TIER_RESOURCES = {
    now: [
      { label: `Claude Code Docs: Overview`, url: `https://code.claude.com/docs/en/overview` },
    ],
    soon: [
      { label: `Anthropic: Equipping agents for the real world with Agent Skills`, url: `https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills` },
    ],
    lower: [
      { label: `Claude Code for Beginners [Full Course]`, url: `https://www.youtube.com/watch?v=gh2_PhgZGsM` },
    ],
    expert: [
      { label: `Anthropic: Building agents with the Claude Agent SDK`, url: `https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk` },
      { label: `Anthropic: Effective harnesses for long-running agents`, url: `https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents` },
    ],
  };

  // ── Data: Section C — LLM production knowledge ─────────────────
  const CURRICULUM = [
    {
      tier: 1,
      resources: [
        { label: `Anthropic: Demystifying evals for AI agents`, url: `https://www.anthropic.com/engineering/demystifying-evals-for-ai-agents` },
        { label: `Andrej Karpathy: Deep Dive into LLMs like ChatGPT`, url: `https://www.youtube.com/@AndrejKarpathy` },
        { label: `Chip Huyen: AI Engineering`, url: `https://huyenchip.com/books/` },
        { label: `Eugene Yan: Patterns for Building LLM Systems`, url: `https://eugeneyan.com/writing/llm-patterns/` },
      ],
      topics: [
        { key: 'eval-frameworks', name: `Evaluation Frameworks &amp; Metrics`, desc: `Design evals for accuracy, hallucination rate, latency, cost. Precision/recall, confusion matrices, human annotation workflows.` },
        { key: 'llm-fundamentals-deployment', name: `LLM Fundamentals for Deployment`, desc: `Tokens and costs, context windows, model variants, rate limits, fallback endpoints, prompt caching.` },
        { key: 'rag-system-design', name: `RAG System Design`, desc: `Chunking strategies, embedding models, retrieval ranking, re-ranking, query optimization. Vector databases and retrieval quality problems.` },
        { key: 'prompt-optimization-reliability', name: `Prompt Optimization for Reliability`, desc: `Structured outputs (JSON mode), few-shot examples at scale, prompt templates, version control, A/B testing prompt variants.` },
      ],
    },
    {
      tier: 2,
      resources: [
        { label: `Eugene Yan: Patterns for Building LLM Systems`, url: `https://eugeneyan.com/writing/llm-patterns/` },
        { label: `Anthropic: How we built our multi-agent research system`, url: `https://www.anthropic.com/engineering/multi-agent-research-system` },
      ],
      topics: [
        { key: 'error-analysis-debugging', name: `Error Analysis &amp; Production Debugging`, desc: `Root cause analysis for failures. Structured logging, sampling failures methodically, iterating on fixes based on data.` },
        { key: 'multi-agent-orchestration', name: `Multi-Agent Orchestration`, desc: `Design patterns for agent coordination (map-reduce, hierarchical, state machines). Tool orchestration, routing logic, agent dependencies.` },
        { key: 'integration-patterns-apis', name: `Integration Patterns &amp; APIs`, desc: `REST APIs, webhooks, async task queues, database connections. Error handling, retry logic, idempotency.` },
        { key: 'cost-optimization-rate-limiting', name: `Cost Optimization &amp; Rate Limiting`, desc: `Calculate cost per task. Batch API, caching patterns, request coalescing. Understand unit economics.` },
        { key: 'latency-profiling-optimization', name: `Latency Profiling &amp; Optimization`, desc: `Measure time at each stage (API calls, retrieval, parsing). Identify bottlenecks. Parallel requests, streaming, adaptive context sizing.` },
        { key: 'human-in-the-loop-design', name: `Human-in-the-Loop System Design`, desc: `When to ask users vs decide automatically. Review workflows, annotation UX, feedback loops. Collecting quality human signal.` },
      ],
    },
    {
      tier: 3,
      resources: [
        { label: `Anthropic: Effective context engineering for AI agents`, url: `https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents` },
      ],
      topics: [
        { key: 'observability-monitoring', name: `Observability &amp; Monitoring`, desc: `Structured logging, metrics (OpenTelemetry), alerting. Dashboard design. Monitoring eval scores, latency, error rates, token spend.` },
        { key: 'retrieval-strategy-optimization', name: `Retrieval Strategy Optimization`, desc: `Hybrid search (BM25 + semantic), multi-stage ranking, query expansion and rewriting. Measure retrieval precision independently.` },
        { key: 'context-window-management', name: `Context Window Management`, desc: `Trade-offs between context quality and cost. Summarization, chunking. Choose appropriate context window size for use case.` },
        { key: 'fallback-degradation-patterns', name: `Fallback &amp; Degradation Patterns`, desc: `Fallback strategies when primary model fails. Simpler models, different prompts, human escalation, graceful UX degradation.` },
      ],
    },
    {
      tier: 4,
      resources: [
        { label: `Hamel Husain: Notes on fine-tuning LLMs`, url: `https://hamel.dev/notes/llm/finetuning/` },
        { label: `Hamel Husain: Is Fine-Tuning Still Valuable?`, url: `https://hamel.dev/blog/posts/fine_tuning_valuable.html` },
      ],
      topics: [
        { key: 'model-comparison-selection', name: `Model Comparison &amp; Selection`, desc: `Understand model trade-offs (latency vs quality, cost, reasoning). When to use different models, fair benchmarking.` },
        { key: 'fine-tuning-llms', name: `Fine-Tuning LLMs`, desc: `Task-specific model training on labeled data. Useful for niche tasks with high-quality data and strict latency requirements.` },
        { key: 'advanced-prompt-engineering', name: `Advanced Prompt Engineering`, desc: `Chain-of-thought, tree-of-thought, meta-prompting, self-refinement. Trendy techniques.` },
        { key: 'model-internals-architecture', name: `Model Internals &amp; Architecture`, desc: `Transformers, attention mechanisms, token prediction mechanics.` },
        { key: 'custom-model-training', name: `Custom Model Training`, desc: `Training models from scratch, knowledge distillation, model compression.` },
      ],
    },
    {
      tier: 5,
      label: `Advanced / Expert`,
      resources: [
        { label: `Anthropic: Introducing advanced tool use`, url: `https://www.anthropic.com/engineering/advanced-tool-use` },
        { label: `Anthropic: Effective harnesses for long-running agents`, url: `https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents` },
        { label: `vLLM Blog: Inside vLLM`, url: `https://vllm.ai/blog/2025-09-05-anatomy-of-vllm` },
        { label: `Anthropic: Challenges in Red Teaming AI Systems`, url: `https://www.anthropic.com/news/challenges-in-red-teaming-ai-systems` },
        { label: `Anthropic: How we built our multi-agent research system`, url: `https://www.anthropic.com/engineering/multi-agent-research-system` },
      ],
      topics: [
        { key: 'advanced-tool-use-reliability', name: `Advanced Tool-Use &amp; Function-Calling Reliability`, desc: `Parallel tool calls, tool-result caching, error surfaces, and evaluating tool-calling reliability at scale, beyond basic function calling.` },
        { key: 'agent-harness-design', name: `Agent Harness &amp; Long-Running Autonomy Design`, desc: `The initializer + execution-loop pattern for agents that run across many context windows without a human restarting them.` },
        { key: 'model-serving-inference', name: `Model Serving &amp; Distributed Inference`, desc: `Continuous batching, PagedAttention/KV-cache management, quantization. What actually determines cost and latency at scale.` },
        { key: 'safety-red-teaming', name: `Safety, Red-Teaming &amp; Adversarial Robustness`, desc: `Adversarial testing methodology, prompt injection defense, and how frontier labs stress-test models before release.` },
        { key: 'multi-agent-architecture-scale', name: `Multi-Agent System Architecture at Scale`, desc: `Agent-to-agent protocols, emergent coordination failures, and when multi-agent adds real value vs. just overhead.` },
      ],
    },
  ];

  const PRIORITY_LABEL = { now: 'Now', soon: 'Soon', lower: 'Lower', other: 'Other', expert: 'Expert' };

  // ── Store ────────────────────────────────────────────────────────
  const STORE_KEY = 'nv-roadmap-v1';

  function defaultStore() {
    const wedge = {};
    WEDGE.forEach(function (g) { g.topics.forEach(function (t) { wedge[t.key] = false; }); });

    const features = {};
    FEATURES.forEach(function (f) { features[f.key] = f.key === 'plan-mode' || f.key === 'mcp'; });

    const curriculum = {};
    CURRICULUM.forEach(function (g) { g.topics.forEach(function (t) { curriculum[t.key] = false; }); });

    return { wedge: wedge, features: features, curriculum: curriculum };
  }

  function load() {
    const def = defaultStore();
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return def;
      const d = JSON.parse(raw);
      return {
        wedge: Object.assign(def.wedge, d.wedge),
        features: Object.assign(def.features, d.features),
        curriculum: Object.assign(def.curriculum, d.curriculum),
      };
    } catch (e) {
      return def;
    }
  }

  function persist() {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  }

  let store = load();
  let activeFilter = 'all';

  // ── Render: shared ────────────────────────────────────────────────
  function setProgressBar(fillId, labelId, done, total, suffix) {
    const fillEl = document.getElementById(fillId);
    const labelEl = document.getElementById(labelId);
    if (fillEl) fillEl.style.width = (total ? (done / total * 100) : 0) + '%';
    if (labelEl) labelEl.textContent = done + ' / ' + total + ' ' + suffix;
  }

  function resourceLinksHTML(resources) {
    if (!resources || !resources.length) return '';
    const links = resources.map(function (r) {
      return `<a href="${r.url}" target="_blank" rel="noopener">${r.label} ↗</a>`;
    }).join('');
    return `<div class="resource-links">${links}</div>`;
  }

  // ── Render: Section A ───────────────────────────────────────────
  function wedgeTopicRowHTML(t) {
    const checked = store.wedge[t.key] ? ' checked' : '';
    return `<div class="topic-row with-desc${checked}" data-store="wedge" data-key="${t.key}">
      <span class="hh-box"></span>
      <div class="topic-main">
        <div class="topic-name">${t.text}</div>
        <div class="topic-desc">${t.desc}</div>
      </div>
    </div>`;
  }

  function wedgeCardHTML(group) {
    const narrative = group.narrative ? `<p class="wedge-narrative">${group.narrative}</p>` : '';
    const resources = resourceLinksHTML(group.resources);

    const total = group.topics.length;
    const done = group.topics.filter(function (t) { return store.wedge[t.key]; }).length;
    const rows = group.topics.map(wedgeTopicRowHTML).join('');
    return `<details class="expand-card wedge-card" open data-priority="${group.priority}">
      <summary class="wedge-summary">
        <span class="wedge-num">Step ${group.priority}</span>
        <span class="wedge-action">${group.action}</span>
        <span class="wedge-count">${done}/${total}</span>
        <span class="wedge-caret">⌄</span>
      </summary>
      <div class="wedge-body">${narrative}${resources}${rows}</div>
    </details>`;
  }

  function renderWedge() {
    document.getElementById('wedge-list').innerHTML = WEDGE.map(wedgeCardHTML).join('');
  }

  // ── Render: Section B ────────────────────────────────────────────
  function featureRowHTML(f) {
    const checked = store.features[f.key] ? ' checked' : '';
    return `<div class="feat-row${checked}" data-key="${f.key}" data-priority="${f.priority}">
      <span class="hh-box"></span>
      <div class="feat-main">
        <div class="feat-name-row">
          <span class="feat-name">${f.name}</span>
          <span class="badge badge-priority-${f.priority}">${PRIORITY_LABEL[f.priority]}</span>
        </div>
        <div class="feat-desc">${f.desc}</div>
        <div class="feat-next"><span class="feat-next-label">Next:</span>${f.next}</div>
      </div>
    </div>`;
  }

  function renderFeatures() {
    const filtered = activeFilter === 'all' ? FEATURES : FEATURES.filter(function (f) { return f.priority === activeFilter; });
    document.getElementById('feat-list').innerHTML = filtered.map(featureRowHTML).join('');

    const resourcesEl = document.getElementById('feat-resource-links');
    if (resourcesEl) resourcesEl.innerHTML = resourceLinksHTML(TIER_RESOURCES[activeFilter]);

    const total = FEATURES.length;
    const done = FEATURES.filter(function (f) { return store.features[f.key]; }).length;
    setProgressBar('feat-progress-fill', 'feat-progress-label', done, total, 'adopted');
  }

  // ── Render: Section C ────────────────────────────────────────────
  function curriculumTopicRowHTML(t) {
    const checked = store.curriculum[t.key] ? ' checked' : '';
    return `<div class="topic-row with-desc${checked}" data-store="curriculum" data-key="${t.key}">
      <span class="hh-box"></span>
      <div class="topic-main">
        <div class="topic-name">${t.name}</div>
        <div class="topic-desc">${t.desc}</div>
      </div>
    </div>`;
  }

  function tierGroupHTML(group) {
    const total = group.topics.length;
    const done = group.topics.filter(function (t) { return store.curriculum[t.key]; }).length;
    const rows = group.topics.map(curriculumTopicRowHTML).join('');
    const resources = resourceLinksHTML(group.resources);
    const labelText = group.label ? `Tier ${group.tier}: ${group.label}` : `Tier ${group.tier}`;
    return `<details class="expand-card tier-group" open data-tier="${group.tier}">
      <summary class="tier-summary">
        <span class="tier-label">${labelText}</span>
        <span class="tier-count">${done}/${total}</span>
        <span class="tier-caret">⌄</span>
      </summary>
      <div class="tier-body">${resources}${rows}</div>
    </details>`;
  }

  function renderCurriculum() {
    document.getElementById('curriculum-list').innerHTML = CURRICULUM.map(tierGroupHTML).join('');
  }

  // ── Render: dashboard stats ──────────────────────────────────────
  function renderStats() {
    const wedgeTotal = WEDGE.reduce(function (n, g) { return n + g.topics.length; }, 0);
    const wedgeDone = WEDGE.reduce(function (n, g) {
      return n + g.topics.filter(function (t) { return store.wedge[t.key]; }).length;
    }, 0);
    document.getElementById('stat-wedge').textContent = wedgeDone + '/' + wedgeTotal;
    setProgressBar('wedge-progress-fill', 'wedge-progress-label', wedgeDone, wedgeTotal, 'done');

    const featTotal = FEATURES.length;
    const featDone = FEATURES.filter(function (f) { return store.features[f.key]; }).length;
    document.getElementById('stat-features').textContent = featDone + '/' + featTotal;

    const curTotal = CURRICULUM.reduce(function (n, g) { return n + g.topics.length; }, 0);
    const curDone = CURRICULUM.reduce(function (n, g) {
      return n + g.topics.filter(function (t) { return store.curriculum[t.key]; }).length;
    }, 0);
    document.getElementById('stat-curriculum').textContent = curDone + '/' + curTotal;
    setProgressBar('curriculum-progress-fill', 'curriculum-progress-label', curDone, curTotal, 'done');

    const overallTotal = wedgeTotal + featTotal + curTotal;
    const overallDone = wedgeDone + featDone + curDone;
    document.getElementById('stat-overall').textContent = overallDone + '/' + overallTotal;
  }

  function renderAll() {
    renderWedge();
    renderFeatures();
    renderCurriculum();
    renderStats();
  }

  // ── Interaction: surgical update for topic-row (preserves <details open> state) ──
  function updateGroupCount(row) {
    const card = row.closest('.expand-card');
    if (!card) return;
    const rows = card.querySelectorAll('.topic-row');
    const total = rows.length;
    const done = Array.prototype.filter.call(rows, function (r) { return r.classList.contains('checked'); }).length;
    const countEl = card.querySelector('.wedge-count, .tier-count');
    if (countEl) countEl.textContent = done + '/' + total;
  }

  function handleTopicClick(e) {
    const row = e.target.closest('.topic-row');
    if (!row) return;
    const storeName = row.dataset.store;
    const key = row.dataset.key;
    const nowChecked = !store[storeName][key];
    store[storeName][key] = nowChecked;
    row.classList.toggle('checked', nowChecked);
    persist();
    updateGroupCount(row);
    renderStats();
  }

  function handleFeatClick(e) {
    const row = e.target.closest('.feat-row');
    if (!row) return;
    const key = row.dataset.key;
    store.features[key] = !store.features[key];
    persist();
    renderFeatures();
    renderStats();
  }

  document.addEventListener('DOMContentLoaded', function () {
    renderAll();

    document.getElementById('wedge-list').addEventListener('click', handleTopicClick);
    document.getElementById('curriculum-list').addEventListener('click', handleTopicClick);
    document.getElementById('feat-list').addEventListener('click', handleFeatClick);

    document.getElementById('feat-filter-bar').addEventListener('click', function (e) {
      const btn = e.target.closest('.toggle-btn');
      if (!btn) return;
      activeFilter = btn.dataset.filter;
      document.querySelectorAll('#feat-filter-bar .toggle-btn').forEach(function (b) {
        b.classList.toggle('active', b === btn);
      });
      renderFeatures();
    });

    document.getElementById('reset-btn').addEventListener('click', function () {
      if (!window.confirm('Reset all roadmap progress? This clears every checkbox.')) return;
      store = defaultStore();
      persist();
      renderAll();
    });
  });
})();
