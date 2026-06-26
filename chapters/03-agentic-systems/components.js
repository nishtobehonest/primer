/* ═══════════════════════════════════════════════════════════
   components.js — Chapter 03: Agentic System Design
   6 interactive components + outcomes. No external dependencies.
═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────
   01 — The Silent Failure
   An orchestrator running a research task with 3 workers.
   Introduce a silent failure in Worker B. Toggle external vs
   internal view — the orchestrator output never changes.
─────────────────────────────────────────────────────────── */
function initC01() {
  const card = document.getElementById('component-01');
  if (!card) return;

  let failureOn = false;
  let showInternal = false;
  let insightShown = false;

  const SCENARIO = {
    task: 'Analyze Q3 earnings filings and produce a revenue summary.',
    workers: [
      { name: 'Worker A', role: 'Data Retrieval', task: 'Fetch Q3 SEC filings from document store', },
      { name: 'Worker B', role: 'Metric Extraction', task: 'Extract revenue, margin, and YoY growth figures', },
      { name: 'Worker C', role: 'Synthesis', task: 'Format extracted metrics into executive summary', },
    ],
    result: '"Revenue grew 14% YoY. Gross margin improved to 68%. Q3 operating income up $2.1B."',
    failureNote: 'Worker B could not parse the new filing format. It returned plausible-looking figures extrapolated from Q2 data.',
  };

  function render() {
    const bWorker = SCENARIO.workers[1];
    const bState = failureOn && showInternal
      ? { cls: 'failed', badge: 'badge-fail', status: 'WRONG DATA', note: 'returned Q2 extrapolation — not Q3 actuals' }
      : failureOn
        ? { cls: 'worker', badge: 'badge-pass', status: 'SUCCESS', note: bWorker.task }
        : { cls: 'worker', badge: 'badge-pass', status: 'SUCCESS', note: bWorker.task };

    card.innerHTML = `
      <div class="component-setup">
        <strong>Introduce a failure in Worker B</strong> — then toggle between external view (what the orchestrator sees) and internal view (what actually happened).
      </div>

      <div style="margin-bottom:12px;padding:10px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-el);">
        <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">TASK</div>
        <div style="font-size:13px;color:var(--muted-2);">${SCENARIO.task}</div>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0;">
        <div class="agent-node orchestrator" style="width:220px;text-align:center;">
          <div class="agent-label">Orchestrator</div>
          <div class="agent-name">Lead Agent</div>
          <div class="agent-task">decomposes → delegates → synthesizes</div>
        </div>
        <div style="display:flex;width:100%;justify-content:space-around;padding:0 20px;">
          ${SCENARIO.workers.map(() => `<div style="width:2px;height:20px;background:var(--border-2);"></div>`).join('')}
        </div>
        <div class="workers-row" style="width:100%;">
          ${SCENARIO.workers.map((w, i) => {
            const isB = i === 1;
            const s = isB ? bState : { cls: 'worker', badge: 'badge-pass', status: 'SUCCESS', note: w.task };
            return `
              <div class="agent-node ${s.cls}" style="flex:1;min-width:0;">
                <div class="agent-label">${w.name}</div>
                <div class="agent-name" style="font-size:11px;">${w.role}</div>
                <div class="agent-task">${s.note}</div>
                <span class="badge ${s.badge}">${s.status}</span>
              </div>`;
          }).join('')}
        </div>
      </div>

      <div style="margin-top:16px;padding:12px 16px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-el);">
        <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">ORCHESTRATOR OUTPUT</div>
        <div style="font-size:13px;color:var(--text);line-height:1.6;">${SCENARIO.result}</div>
        ${failureOn && showInternal
          ? `<div style="margin-top:8px;font-family:var(--font-mono);font-size:11px;color:var(--red);">⚠ This output is wrong. Worker B used Q2 data. The orchestrator has no way to know.</div>`
          : ''}
      </div>

      ${failureOn && showInternal ? `
        <div style="margin-top:10px;padding:10px 14px;background:var(--red-dim);border:1px solid rgba(239,68,68,.2);border-radius:var(--radius-el);">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--red);letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">WHAT ACTUALLY HAPPENED</div>
          <div style="font-size:12px;color:var(--muted-2);">${SCENARIO.failureNote}</div>
        </div>` : ''}

      <div style="display:flex;flex-wrap:wrap;gap:8px;margin-top:16px;align-items:center;">
        <div style="display:flex;gap:6px;">
          <button class="toggle-btn ${!failureOn ? 'active' : ''}" id="c01-clean">Clean run</button>
          <button class="toggle-btn ${failureOn ? 'active' : ''}" id="c01-fail" style="${failureOn ? 'background:var(--red-dim);color:var(--red);border-color:rgba(239,68,68,.3);' : ''}">Introduce failure</button>
        </div>
        <div style="display:flex;gap:6px;${!failureOn ? 'opacity:.35;pointer-events:none;' : ''}">
          <button class="toggle-btn ${!showInternal ? 'active' : ''}" id="c01-ext">External view</button>
          <button class="toggle-btn ${showInternal ? 'active' : ''}" id="c01-int">Internal view</button>
        </div>
      </div>

      <p style="font-size:11px;color:var(--muted);margin-top:10px;font-family:var(--font-mono);">
        ${!failureOn
          ? 'All three workers returned success. The orchestrator synthesized their outputs and delivered a result.'
          : !showInternal
            ? 'Worker B failed internally. Switch to internal view to see what happened — and notice the orchestrator output didn\'t change.'
            : 'Internal view: Worker B returned Q2 extrapolations as if they were Q3 actuals. The orchestrator synthesized them as fact.'}
      </p>

      <div class="key-insight ${failureOn && showInternal ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          The orchestrator cannot distinguish a correct worker response from a plausible-looking wrong one
          without explicit validation logic. Silent failures are the default — observable failures require design.
          Anthropic added dedicated grading and tracing to their production system specifically to catch this.
        </div>
      </div>
    `;

    card.querySelector('#c01-clean').onclick = () => { failureOn = false; showInternal = false; render(); };
    card.querySelector('#c01-fail').onclick  = () => { failureOn = true; render(); };
    if (card.querySelector('#c01-ext')) {
      card.querySelector('#c01-ext').onclick = () => { showInternal = false; render(); };
      card.querySelector('#c01-int').onclick = () => { showInternal = true; render(); };
    }
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   02 — Orchestrator-Worker Pattern
   Side-by-side: clear task boundaries vs overlapping.
   Shows how duplicate work and conflicting outputs emerge.
─────────────────────────────────────────────────────────── */
function initC02() {
  const card = document.getElementById('component-02');
  if (!card) return;

  let mode = 'clear';

  const CONFIGS = {
    clear: {
      label: 'CLEAR TASK BOUNDARIES',
      tagline: 'Each worker owns one domain. Outputs are non-overlapping.',
      workers: [
        { name: 'Worker A', task: 'Extract: list all hazards identified in the inspection', conflict: false },
        { name: 'Worker B', task: 'Score: assign risk level (1–5) to each hazard', conflict: false },
        { name: 'Worker C', task: 'Draft: write mitigation recommendation per hazard', conflict: false },
      ],
      result: { ok: true, text: 'Orchestrator merged 3 distinct outputs cleanly. Assessment complete.' },
    },
    overlap: {
      label: 'OVERLAPPING TASKS',
      tagline: 'Boundaries blur — multiple workers attempt the same domain.',
      workers: [
        { name: 'Worker A', task: 'Extract hazards + score + write initial recommendations', conflict: false },
        { name: 'Worker B', task: 'Score hazards (also writing recommendations for some)', conflict: true },
        { name: 'Worker C', task: 'Write recommendations (also re-scoring 3 hazards differently)', conflict: true },
      ],
      result: { ok: false, text: 'Orchestrator received 3 conflicting recommendation sets and 2 inconsistent risk scores for the same hazards. Cannot reconcile.' },
    },
  };

  function render() {
    const cfg = CONFIGS[mode];
    card.innerHTML = `
      <div class="component-setup">
        Toggle between a clean task split and an overlapping one — watch how boundary blur creates contradictions the orchestrator can't resolve.
      </div>

      <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap;">
        <button class="toggle-btn ${mode === 'clear' ? 'active' : ''}" id="c02-clear">Clear boundaries</button>
        <button class="toggle-btn ${mode === 'overlap' ? 'active' : ''}" id="c02-overlap">Overlapping tasks</button>
      </div>

      <div style="margin-bottom:12px;">
        <div style="font-family:var(--font-mono);font-size:10px;color:${mode === 'clear' ? 'var(--green)' : 'var(--red)'};letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">${cfg.label}</div>
        <div style="font-size:12px;color:var(--muted);">${cfg.tagline}</div>
      </div>

      <div style="display:flex;flex-direction:column;align-items:center;gap:0;margin-bottom:12px;">
        <div class="agent-node orchestrator" style="width:240px;text-align:center;">
          <div class="agent-label">Orchestrator</div>
          <div class="agent-name">Safety Assessment Lead</div>
        </div>
        <div style="display:flex;width:100%;justify-content:space-around;padding:0 20px;">
          ${cfg.workers.map(() => `<div style="width:2px;height:20px;background:var(--border-2);"></div>`).join('')}
        </div>
        <div class="workers-row" style="width:100%;">
          ${cfg.workers.map(w => `
            <div class="agent-node ${w.conflict ? 'warning' : 'worker'}" style="flex:1;min-width:0;">
              <div class="agent-name" style="font-size:11px;">${w.name}</div>
              <div class="agent-task" style="text-align:left;">${w.task}${w.conflict ? ' <span class="conflict-badge">overlap</span>' : ''}</div>
            </div>`).join('')}
        </div>
      </div>

      <div style="padding:12px 14px;border-radius:var(--radius-el);border:1px solid ${cfg.result.ok ? 'rgba(34,197,94,.25)' : 'rgba(239,68,68,.25)'};background:${cfg.result.ok ? 'var(--green-dim)' : 'var(--red-dim)'};">
        <div style="font-family:var(--font-mono);font-size:10px;color:${cfg.result.ok ? 'var(--green)' : 'var(--red)'};letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">ORCHESTRATOR RESULT</div>
        <div style="font-size:12px;color:var(--muted-2);">${cfg.result.text}</div>
      </div>

      <p style="font-size:11px;color:var(--muted);margin-top:12px;font-family:var(--font-mono);">
        ${mode === 'clear'
          ? 'Three distinct domains, zero overlap. The orchestrator has one answer per domain — merge is trivial.'
          : 'Workers B and C both wrote recommendations and re-scored hazards. The orchestrator now holds 2 risk scores for the same hazard. Which is correct?'}
      </p>

      <div class="key-insight ${mode === 'overlap' ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          Task boundaries are a design artifact — they don't emerge naturally from a vague
          objective. The orchestrator can fill gaps between clear outputs. It cannot resolve
          contradictions between overlapping ones. Anthropic's fix was explicit output formats
          per worker, not smarter models.
        </div>
      </div>
    `;

    card.querySelector('#c02-clear').onclick   = () => { mode = 'clear';   render(); };
    card.querySelector('#c02-overlap').onclick = () => { mode = 'overlap'; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   03 — Context Bloat
   Uses Fractional AI's real tool names. Token bar fills as
   turns accumulate. Quality degrades. Profile reveals which
   calls are heaviest. Compact resets context.
─────────────────────────────────────────────────────────── */
function initC03() {
  const card = document.getElementById('component-03');
  if (!card) return;

  const TURNS = [
    { label: 'get_user_context',      tokens: 3800,  heavy: false, note: 'light — user metadata only' },
    { label: 'get_form_outline',      tokens: 9200,  heavy: false, note: 'moderate — section headers + structure' },
    { label: 'get_all_fields',        tokens: 34500, heavy: true,  note: 'HEAVY — returns full data dump, all fields' },
    { label: 'list_existing_reports', tokens: 18700, heavy: true,  note: 'heavy — all prior reports unfiltered' },
    { label: 'get_related_docs',      tokens: 12400, heavy: false, note: 'moderate — linked document set' },
    { label: 'summarize_previous_runs', tokens: 22100, heavy: true, note: 'heavy — full run history, not summarized' },
  ];
  const MAX_TOKENS = 128000;
  const COST_PER_1M_UNCACHED = 2.50;
  const COST_PER_1M_CACHED   = 0.25;

  let currentTurns = [];
  let showProfile  = false;
  let compacted    = false;
  let showAirbyte  = false;

  function getStats() {
    const total = currentTurns.reduce((s, t) => s + t.tokens, 0);
    const pct   = Math.min(100, Math.round((total / MAX_TOKENS) * 100));
    const quality = pct < 35 ? 100
      : pct < 60  ? 100 - ((pct - 35) * 2.0)
      : pct < 80  ? 50  - ((pct - 60) * 1.8)
      : 14;
    const cost = (total / 1_000_000) * COST_PER_1M_UNCACHED;
    return { total, pct, quality: Math.max(5, Math.round(quality)), cost };
  }

  function barColor(pct) {
    return pct < 50 ? 'var(--purple)' : pct < 75 ? 'var(--amber)' : 'var(--red)';
  }

  function render() {
    const { total, pct, quality, cost } = getStats();
    const profile = [...currentTurns].sort((a, b) => b.tokens - a.tokens);
    const profileColors = ['var(--red)', 'var(--amber)', 'var(--purple)', 'var(--teal)', 'var(--blue)', 'var(--green)'];

    card.innerHTML = `
      <div class="component-setup">
        Add tool calls one at a time — watch context fill and quality degrade — then hit <strong>Profile</strong> to see which calls are responsible.
      </div>

      <div class="c03-layout">
        <div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;">
            AGENT CONTEXT WINDOW
            ${compacted ? '<span class="badge badge-pass" style="margin-left:6px;">COMPACTED</span>' : ''}
          </div>
          <div class="c03-turns">
            ${currentTurns.length === 0
              ? `<div style="font-family:var(--font-mono);font-size:11px;color:var(--muted);padding:16px;text-align:center;border:1px dashed var(--border);border-radius:var(--radius-el);">No tool calls yet. Hit "Add turn" to start.</div>`
              : currentTurns.map((t, i) => `
                <div class="c03-turn ${t.heavy ? 'heavy' : ''}">
                  <div>
                    <div style="font-family:var(--font-mono);font-size:11px;color:${t.heavy ? 'var(--text)' : 'var(--muted-2)'};">Turn ${i+1}: ${t.label}</div>
                    <div style="font-size:10px;color:var(--muted);margin-top:2px;">${t.note}</div>
                  </div>
                  <span style="font-family:var(--font-mono);font-size:11px;color:${t.heavy ? 'var(--amber)' : 'var(--muted)'};">${(t.tokens/1000).toFixed(1)}k</span>
                </div>`).join('')}
          </div>

          <div class="c03-context-bar-wrap" style="margin-top:12px;">
            <div class="c03-context-label">
              <span>Context used</span>
              <span style="color:${barColor(pct)};font-family:var(--font-mono);">${pct}% &nbsp;·&nbsp; ${(total/1000).toFixed(0)}k / 128k tokens &nbsp;·&nbsp; ~$${cost.toFixed(3)}/run</span>
            </div>
            <div class="c03-context-bar">
              <div class="c03-context-fill" style="width:${pct}%;background:${barColor(pct)};"></div>
            </div>
          </div>

          <div class="c03-quality" style="margin-top:8px;">
            <span style="font-family:var(--font-mono);font-size:11px;color:var(--muted);">Output quality</span>
            <div class="c03-quality-bar">
              <div class="c03-quality-fill" style="width:${quality}%;background:${quality>70?'var(--green)':quality>40?'var(--amber)':'var(--red)'};"></div>
            </div>
            <span style="font-family:var(--font-mono);font-size:11px;color:${quality>70?'var(--green)':quality>40?'var(--amber)':'var(--red)'};">${quality}%</span>
          </div>
        </div>

        <div>
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;">TOKEN PROFILE</div>

          ${!showProfile
            ? `<div style="font-size:12px;color:var(--muted);font-family:var(--font-mono);padding:12px 0;line-height:1.6;">"Figuring out what parts of our system could be pared down was not obvious from looking at the logs."<br><br>Hit <strong>Profile</strong> to see which tool calls are responsible for the bloat.</div>`
            : profile.length === 0
              ? `<div style="font-size:11px;color:var(--muted);font-family:var(--font-mono);">Add turns first.</div>`
              : profile.map((p, i) => {
                  const totalTok = currentTurns.reduce((s,t) => s+t.tokens, 0);
                  const pctBar = Math.round((p.tokens/totalTok)*100);
                  return `
                    <div class="c03-bar-row">
                      <div class="c03-bar-label" title="${p.label}">${p.label}</div>
                      <div class="c03-bar-track">
                        <div class="c03-bar-fill" style="width:${pctBar}%;background:${profileColors[i%profileColors.length]};"></div>
                      </div>
                      <div class="c03-bar-pct">${pctBar}%</div>
                    </div>`;
                }).join('')}

          ${showAirbyte ? `
            <div style="margin-top:12px;padding:10px 14px;background:var(--teal-dim);border:1px solid rgba(45,212,191,.2);border-radius:var(--radius-el);">
              <div style="font-family:var(--font-mono);font-size:10px;color:var(--teal);letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">REAL-WORLD FIX — AIRBYTE</div>
              <div style="font-size:12px;color:var(--muted-2);line-height:1.6;">Pre-indexed enterprise data in a Context Store. Agents query the index instead of calling live APIs. Result: <strong style="color:var(--teal);">40% fewer tool calls, up to 90% fewer tokens</strong> on some integrations (Zendesk: –90%, Gong: –80%, Linear: –75%). Source: airbyte.com/blog/airbyte-agents</div>
            </div>` : ''}
        </div>
      </div>

      <div class="btn-row">
        ${currentTurns.length < TURNS.length
          ? `<button class="btn btn-primary" id="c03-add">+ Add turn (${currentTurns.length+1}/${TURNS.length})</button>`
          : `<button class="btn btn-ghost" disabled style="opacity:.4;">Context full</button>`}
        <button class="btn btn-ghost" id="c03-profile">${showProfile ? 'Hide profile' : 'Profile'}</button>
        <button class="btn btn-ghost" id="c03-compact">Compact context</button>
        <button class="btn btn-ghost" id="c03-airbyte">${showAirbyte ? 'Hide fix' : 'Real-world fix ↗'}</button>
      </div>

      <p style="font-size:11px;color:var(--muted);margin-top:10px;font-family:var(--font-mono);">
        ${currentTurns.length === 0
          ? 'Each tool call adds tokens. The agent doesn\'t know its context is filling — it just gets worse.'
          : pct < 50
            ? `Context at ${pct}%. Quality healthy. Cost per run: ~$${cost.toFixed(3)}.`
            : pct < 75
              ? `Context at ${pct}%. Quality degrading — agent is less reliable on complex reasoning. Cost: ~$${cost.toFixed(3)}/run.`
              : `Context critically full at ${pct}%. Severe quality degradation. The agent will start hallucinating. Compact or it will fail.`}
      </p>

      <div class="key-insight ${showProfile && currentTurns.length >= 3 ? 'visible' : ''}">
        <div class="key-insight-label">Key insight — Fractional AI finding</div>
        <div class="key-insight-text">
          In their form-updater agent, <code>get_all_fields</code> consumed the majority of
          context — because it returned a complete data dump when the agent only needed specific
          fields. The fix was a <code>string_to_match</code> filter parameter. Total cost for
          that agent: ~$0.71/run (at $2.50/M uncached vs $0.25/M cached). The insight: don't
          fetch more than you need at the current step. Optimize for signal, not coverage.
        </div>
      </div>
    `;

    const addBtn = card.querySelector('#c03-add');
    if (addBtn) addBtn.onclick = () => { currentTurns.push(TURNS[currentTurns.length]); compacted = false; render(); };
    card.querySelector('#c03-profile').onclick  = () => { showProfile = !showProfile; render(); };
    card.querySelector('#c03-compact').onclick  = () => { currentTurns = []; compacted = true; showProfile = false; render(); };
    card.querySelector('#c03-airbyte').onclick  = () => { showAirbyte = !showAirbyte; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   04 — Sequential vs. Parallel
   4 tasks, animated execution. Introduce failure in Task B.
   Sequential chain breaks; parallel others continue.
─────────────────────────────────────────────────────────── */
function initC04() {
  const card = document.getElementById('component-04');
  if (!card) return;

  const TASKS = [
    { id: 'A', name: 'Fetch filings',    desc: 'retrieve source documents', duration: 550 },
    { id: 'B', name: 'Extract metrics',  desc: 'parse revenue + margin',    duration: 750 },
    { id: 'C', name: 'Run comparisons',  desc: 'YoY and QoQ deltas',        duration: 650 },
    { id: 'D', name: 'Format output',    desc: 'produce executive summary',  duration: 480 },
  ];

  let mode      = 'sequential';
  let failureOn = false;
  let running   = false;
  let states    = TASKS.map(() => 'idle');
  let done      = false;

  function reset() { states = TASKS.map(() => 'idle'); done = false; }

  function stateColor(s) {
    return s === 'done' ? 'var(--green)' : s === 'broken' ? 'var(--red)' : s === 'running' ? 'var(--amber)' : s === 'skipped' ? 'var(--muted)' : 'var(--border-2)';
  }
  function stateBadge(s) {
    return s === 'done' ? 'badge-pass' : s === 'broken' ? 'badge-fail' : s === 'skipped' ? 'badge-muted' : s === 'running' ? 'badge-warn' : 'badge-muted';
  }
  function stateLabel(s) {
    return s === 'done' ? 'DONE' : s === 'broken' ? 'FAILED' : s === 'skipped' ? 'SKIPPED' : s === 'running' ? 'RUNNING' : 'WAITING';
  }

  function render() {
    const completedTasks = states.filter(s => s === 'done').length;
    const failedTasks    = states.filter(s => s === 'broken').length;
    const skippedTasks   = states.filter(s => s === 'skipped').length;

    card.innerHTML = `
      <div class="component-setup">
        Toggle sequential vs parallel, introduce a Task B failure, then run — see how each architecture handles it.
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        <button class="toggle-btn ${mode==='sequential'?'active':''}" id="c04-seq">Sequential</button>
        <button class="toggle-btn ${mode==='parallel'?'active':''}" id="c04-par">Parallel</button>
        <button class="toggle-btn ${failureOn?'active':''}" id="c04-fail"
          style="${failureOn?'background:var(--red-dim);color:var(--red);border-color:rgba(239,68,68,.3);':''}">
          Task B fails
        </button>
      </div>

      <div class="c04-layout">
        <div>
          <div class="c04-col-label" style="color:${mode==='parallel'?'var(--green)':'var(--muted)'};">
            ${mode === 'sequential'
              ? 'SEQUENTIAL — one task at a time'
              : 'PARALLEL — all tasks simultaneously'}
          </div>
          <div class="c04-tasks ${mode==='parallel'?'parallel':''}">
            ${TASKS.map((t, i) => `
              <div class="c04-task ${states[i]}" style="border-color:${stateColor(states[i])};">
                <div style="font-family:var(--font-mono);font-size:11px;font-weight:500;">${t.name}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:2px;">${t.desc}</div>
                ${states[i] === 'running' ? '<div style="font-size:10px;color:var(--amber);margin-top:2px;">running…</div>' : ''}
              </div>`).join('')}
          </div>

          ${mode === 'sequential' ? `
            <div style="margin-top:12px;font-family:var(--font-mono);font-size:11px;color:var(--muted);">
              Steps: <span style="color:var(--text);">${states.filter(s=>s!=='idle').length} / ${TASKS.length}</span>
              &nbsp;·&nbsp; Time units: <span style="color:${done&&!failureOn?'var(--amber)':'var(--text)'};">${states.filter(s=>s!=='idle').length}× latency</span>
            </div>` : `
            <div style="margin-top:12px;font-family:var(--font-mono);font-size:11px;color:var(--muted);">
              Steps: <span style="color:var(--text);">1 / 1</span>
              &nbsp;·&nbsp; Time units: <span style="color:${done?'var(--green)':'var(--text)'};">1× latency</span>
              ${done && !failureOn ? '&nbsp;·&nbsp; <span style="color:var(--green);">~90% faster ✓</span>' : ''}
            </div>`}
        </div>

        <div>
          <div class="c04-col-label">TASK STATUS</div>
          <div style="display:flex;flex-direction:column;gap:8px;">
            ${TASKS.map((t, i) => `
              <div style="display:flex;align-items:center;gap:10px;">
                <span class="badge ${stateBadge(states[i])}">${stateLabel(states[i])}</span>
                <span style="font-family:var(--font-mono);font-size:11px;color:var(--muted-2);">${t.name}</span>
              </div>`).join('')}
          </div>
          ${done && failureOn ? `
            <div style="margin-top:12px;padding:10px 12px;background:${mode==='sequential'?'var(--red-dim)':'var(--amber-dim)'};border:1px solid ${mode==='sequential'?'rgba(239,68,68,.2)':'rgba(245,158,11,.2)'};border-radius:var(--radius-el);">
              <div style="font-family:var(--font-mono);font-size:10px;color:${mode==='sequential'?'var(--red)':'var(--amber)'};letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px;">${mode==='sequential'?'CHAIN BROKEN':'PARTIAL SUCCESS'}</div>
              <div style="font-size:12px;color:var(--text);">
                ${mode==='sequential'
                  ? `Tasks C and D never ran. B's failure propagated forward — ${skippedTasks} task${skippedTasks!==1?'s':''} skipped.`
                  : `Tasks A, C, and D completed. Only B failed. ${completedTasks} of 4 tasks succeeded.`}
              </div>
            </div>` : ''}
        </div>
      </div>

      <div class="btn-row">
        <button class="btn btn-primary" id="c04-run" ${running?'disabled':''}>
          ${running ? 'Running…' : 'Run pipeline'}
        </button>
        <button class="btn btn-ghost" id="c04-reset">Reset</button>
      </div>

      <p style="font-size:11px;color:var(--muted);margin-top:10px;font-family:var(--font-mono);">
        ${mode === 'sequential'
          ? (failureOn ? 'Task B fails → tasks C and D are skipped. One failure takes down the whole run.'
                       : 'Each task waits for the previous. Total time = sum of all task durations.')
          : (failureOn ? 'Task B fails → A, C, D still complete. Parallel execution isolates failures.'
                       : 'All tasks run simultaneously. Total time = longest single task. Anthropic: up to 90% reduction.')}
      </p>

      <div class="key-insight ${done && failureOn ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          ${mode === 'sequential'
            ? 'Sequential execution turns one task failure into a chain failure. The downstream tasks that never ran had nothing to do with Task B — they were casualties of architectural choice, not task logic.'
            : 'Parallel execution contains failures. Task B broke, but Tasks A, C, and D completed and returned valid results. The orchestrator now handles one partial failure instead of a total abort.'}
        </div>
      </div>
    `;

    card.querySelector('#c04-seq').onclick   = () => { mode = 'sequential'; reset(); render(); };
    card.querySelector('#c04-par').onclick   = () => { mode = 'parallel';   reset(); render(); };
    card.querySelector('#c04-fail').onclick  = () => { failureOn = !failureOn; reset(); render(); };
    card.querySelector('#c04-reset').onclick = () => { reset(); render(); };
    card.querySelector('#c04-run').onclick   = () => {
      running = true; reset(); render();
      mode === 'sequential' ? runSeq(0) : runPar();
    };
  }

  function runSeq(i) {
    if (i >= TASKS.length) { running = false; done = true; render(); return; }
    states[i] = 'running'; render();
    setTimeout(() => {
      if (failureOn && i === 1) {
        states[i] = 'broken';
        for (let j = i+1; j < TASKS.length; j++) states[j] = 'skipped';
        running = false; done = true; render();
      } else {
        states[i] = 'done';
        runSeq(i+1);
      }
    }, TASKS[i].duration);
  }

  function runPar() {
    TASKS.forEach((_, i) => { states[i] = 'running'; });
    render();
    TASKS.forEach((t, i) => {
      setTimeout(() => {
        states[i] = (failureOn && i === 1) ? 'broken' : 'done';
        if (states.every(s => s === 'done' || s === 'broken')) { running = false; done = true; }
        render();
      }, t.duration);
    });
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   05 — Minimal Footprint
   Three actions with reversibility indicators. Toggle the
   principle on/off. Without it: all execute immediately.
   With it: irreversible action pauses for human confirmation.
─────────────────────────────────────────────────────────── */
function initC05() {
  const card = document.getElementById('component-05');
  if (!card) return;

  const ACTIONS = [
    {
      icon: '📄', name: 'Read prior assessments',
      desc: 'Load previous risk assessment drafts for context',
      scope: 'Reads 3 specific records you referenced',
      rev: 'yes', revLabel: 'Reversible — read-only',
    },
    {
      icon: '✏️', name: 'Write assessment draft',
      desc: 'Save generated draft to shared folder',
      scope: 'Writes 1 new file — original unchanged',
      rev: 'partial', revLabel: 'Overwritable',
    },
    {
      icon: '🗑️', name: 'Archive all prior versions',
      desc: 'Move all past assessment files to archive and remove from active folder',
      scope: 'Requested: all 47 assessment files in folder',
      rev: 'no', revLabel: 'Irreversible',
    },
  ];

  let minimalOn  = false;
  let statuses   = ACTIONS.map(() => 'idle');
  let showDialog = false;
  let confirmed  = false;
  let denied     = false;

  function reset() { statuses = ACTIONS.map(() => 'idle'); showDialog = false; confirmed = false; denied = false; }

  function render() {
    card.innerHTML = `
      <div class="component-setup">
        Toggle minimal footprint on, then run the agent — see what changes at the irreversible step.
      </div>

      <div style="display:flex;gap:8px;margin-bottom:16px;flex-wrap:wrap;">
        <button class="toggle-btn ${!minimalOn?'active':''}" id="c05-off">Minimal footprint off</button>
        <button class="toggle-btn ${minimalOn?'active':''}" id="c05-on">Minimal footprint on</button>
      </div>

      <div class="c05-actions">
        ${ACTIONS.map((a, i) => `
          <div class="c05-action ${statuses[i]}" style="${statuses[i]==='executing'?'border-color:var(--green);background:var(--green-dim);':statuses[i]==='paused'?'border-color:var(--amber);background:var(--amber-dim);':''}">
            <div class="c05-action-left">
              <div class="c05-action-icon">${a.icon}</div>
              <div class="c05-action-info">
                <div class="c05-action-name">${a.name}</div>
                <div class="c05-action-desc">${a.desc}</div>
                <div style="font-size:10px;color:var(--muted);margin-top:3px;font-family:var(--font-mono);">Scope: ${a.scope}</div>
              </div>
            </div>
            <div class="c05-action-right">
              <span class="c05-reversible ${a.rev}">${a.revLabel}</span>
              <span style="font-family:var(--font-mono);font-size:11px;color:var(--muted);min-width:80px;text-align:right;">
                ${statuses[i]==='executing'?'<span style="color:var(--green);">✓ done</span>':statuses[i]==='paused'?'<span style="color:var(--amber);">⏸ waiting</span>':'—'}
              </span>
            </div>
          </div>`).join('')}
      </div>

      ${showDialog ? `
        <div style="margin-top:14px;padding:16px;background:var(--amber-dim);border:1px solid rgba(245,158,11,.3);border-radius:var(--radius-el);">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--amber);letter-spacing:.08em;text-transform:uppercase;margin-bottom:8px;">⏸ AGENT PAUSED — CONFIRMATION REQUIRED</div>
          <div style="font-size:13px;color:var(--text);margin-bottom:4px;font-weight:500;">Archive all prior versions</div>
          <div style="font-size:12px;color:var(--text);margin-bottom:8px;line-height:1.6;">
            This action will move 47 assessment files from the active folder to archive.
            This cannot be undone automatically. The agent is requesting permission before proceeding.
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn btn-danger" id="c05-approve">Approve action</button>
            <button class="btn btn-ghost"  id="c05-deny">Deny — skip this step</button>
          </div>
        </div>` : ''}

      ${confirmed ? `
        <div style="margin-top:12px;padding:12px 14px;background:var(--green-dim);border:1px solid rgba(34,197,94,.2);border-radius:var(--radius-el);font-family:var(--font-mono);font-size:12px;color:var(--green);">
          ✓ Human approved. Agent executed the archive action with explicit confirmation on record.
        </div>` : ''}
      ${denied ? `
        <div style="margin-top:12px;padding:12px 14px;background:var(--surface-2);border:1px solid var(--border);border-radius:var(--radius-el);font-family:var(--font-mono);font-size:12px;color:var(--text);">
          Action denied. Agent skipped the archive step and completed the rest of the assessment. No files were moved.
        </div>` : ''}

      <div class="btn-row">
        <button class="btn btn-primary" id="c05-run">Run agent</button>
        <button class="btn btn-ghost"   id="c05-reset">Reset</button>
      </div>

      <p style="font-size:11px;color:var(--muted);margin-top:10px;font-family:var(--font-mono);">
        ${minimalOn
          ? 'Minimal footprint on: agent pauses before the irreversible step and surfaces a confirmation dialog.'
          : 'Minimal footprint off: agent executes all three actions immediately, including the irreversible archive.'}
      </p>

      <div class="key-insight ${(confirmed||denied) ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          ${denied
            ? 'The agent completed the assessment without the archive step. Nothing was lost. Without minimal footprint, 47 files would have been moved before anyone knew — the human review would have happened after the fact, not before.'
            : 'The archive action was explicitly approved before execution. This is an audit trail. In a regulated industry like rail safety, this distinction — agent proposes, human approves — is what makes agentic systems deployable.'}
        </div>
      </div>
    `;

    card.querySelector('#c05-off').onclick = () => { minimalOn = false; reset(); render(); };
    card.querySelector('#c05-on').onclick  = () => { minimalOn = true;  reset(); render(); };
    card.querySelector('#c05-reset').onclick = () => { reset(); render(); };

    card.querySelector('#c05-run').onclick = () => {
      reset();
      statuses[0] = 'executing';
      statuses[1] = 'executing';
      if (!minimalOn) {
        statuses[2] = 'executing';
      } else {
        statuses[2] = 'paused';
        showDialog  = true;
      }
      render();
      wireDialog();
    };

    wireDialog();
  }

  function wireDialog() {
    const ap = card.querySelector('#c05-approve');
    const dn = card.querySelector('#c05-deny');
    if (ap) ap.onclick = () => { statuses[2] = 'executing'; showDialog = false; confirmed = true; render(); };
    if (dn) dn.onclick = () => { statuses[2] = 'idle';      showDialog = false; denied    = true; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   06 — Prototype to Production
   4-stage rail with real failure classes and design decisions
   per stage. Click to expand with examples from Anthropic.
─────────────────────────────────────────────────────────── */
function initC06() {
  const card = document.getElementById('component-06');
  if (!card) return;

  const STAGES = [
    {
      num: '01', name: 'Prototype',
      title: 'Prototype — it works in the demo',
      intro: 'The prototype validates the concept. It is not the system — it\'s evidence that the system is worth building. Keep it simple: one agent, one task, one happy path.',
      failures: [
        { text: 'Happy path only — clean test inputs chosen specifically to work', example: 'Your prompt works perfectly on the 3 examples you tested it on' },
        { text: 'No error handling — any unexpected input breaks the whole run', example: 'A malformed API response throws an unhandled exception, run aborts' },
        { text: 'No state persistence — every failure means starting from scratch', example: '30 minutes into a research run, a timeout means restarting at step 1' },
      ],
      solutions: [
        { text: 'One agent, one task, minimum viable architecture', example: 'Resist the urge to add more agents because it "seems more capable"' },
        { text: 'Validate concept first — don\'t build infrastructure for a system that might not work', example: 'Anthropic: "Start with the simplest solution"' },
      ],
    },
    {
      num: '02', name: 'Staging',
      title: 'Staging — error handling and tool design',
      intro: 'The first production wall: tools misbehave, context fills silently, and agents spawn more subagents than necessary. This is where most prototypes die.',
      failures: [
        { text: 'Vague tool descriptions — agent picks the wrong tool consistently', example: 'Anthropic: "If humans can\'t definitively identify the right tool, agents will perform worse"' },
        { text: 'Context window filling silently — quality degrades without warning or error', example: 'Fractional AI: get_all_fields consuming majority of context, invisible from logs' },
        { text: 'Excessive subagent spawning — agents delegate simple queries that didn\'t need delegation', example: 'Anthropic: early iterations spawning subagents for single-step lookups' },
      ],
      solutions: [
        { text: 'Invest in tool descriptions — treat your ACI with the same care as your API', example: 'Explicit parameter names, examples, expected formats, edge case behavior' },
        { text: 'Add context monitoring — token profiling to identify which calls over-fetch', example: 'Fractional AI built a profiler; Anthropic added token budgets to orchestrator prompts' },
        { text: 'Add effort budgets to prompts — embed scaling rules so agents right-size delegation', example: '"For queries under X complexity, handle directly; only delegate if Y"' },
      ],
    },
    {
      num: '03', name: 'Pre-Prod',
      title: 'Pre-Production — checkpointing and oversight',
      intro: 'The second wall: long-running processes fail mid-run, irreversible actions happen without review, and you can\'t debug non-deterministic failures because you can\'t see inside them.',
      failures: [
        { text: 'Long-running agents lose state on timeout or process restart', example: 'A 20-minute research run fails at minute 18 — no way to resume, restart from zero' },
        { text: 'Irreversible actions taken without human approval', example: 'Agent deletes "processed" files — they were still needed downstream' },
        { text: 'No tracing — non-deterministic failures impossible to reproduce or debug', example: 'Agent hallucinated on one query but not on identical rerun — no log to diagnose' },
      ],
      solutions: [
        { text: 'Add checkpointing — agents save state to external memory before context limits', example: 'Anthropic: agents store plan + progress to file before context window boundary' },
        { text: 'Implement minimal footprint — pause for human confirmation before irreversible actions', example: 'Fractional AI: agents draft, human approves before any record is finalized' },
        { text: 'Add full production tracing — log every tool call, every agent decision, every output', example: 'Anthropic: "Full production tracing is essential for debugging non-deterministic systems"' },
      ],
    },
    {
      num: '04', name: 'Production',
      title: 'Production — observability and cost control',
      intro: 'The final class of problems: costs are unpredictable, deploys break running sessions, and the system is slower or more expensive than your estimates. These are engineering discipline problems, not capability problems.',
      failures: [
        { text: 'Cost explosion — no token profiling, bloat accumulates invisibly', example: 'Fractional AI: coordinator agents accumulating hundreds of thousands of tokens per run' },
        { text: 'Deploys disrupt active sessions — code updates break agents mid-task', example: 'A new model version deployed mid-run; agent context becomes incompatible' },
        { text: 'Sequential bottleneck — system slower than expected because tasks are chained', example: 'Anthropic: research tasks taking 4× longer than necessary due to sequential tool calls' },
      ],
      solutions: [
        { text: 'Add token profiling — identify which tool calls are responsible for bloat', example: 'Fractional AI: cProfile-inspired profiler attributing cost per tool call per agent' },
        { text: 'Rainbow deployments — gradual traffic shifting so running agents complete on old version', example: 'Anthropic: deployed new Claude versions without disrupting in-progress research runs' },
        { text: 'Switch qualifying tasks to parallel — target the 90% time reduction', example: 'Anthropic: "Parallel tool calling reduced complex research time by up to 90%"' },
      ],
    },
  ];

  let activeStage = 0;

  function render() {
    const s = STAGES[activeStage];
    card.innerHTML = `
      <div class="component-setup">
        Click through all four stages — each one introduces a failure class invisible at the previous stage.
      </div>

      <div class="c06-rail">
        ${STAGES.map((st, i) => `
          <div class="c06-stage ${activeStage===i?'active':''}" data-idx="${i}">
            <div class="c06-stage-num">${st.num}</div>
            <div class="c06-stage-name">${st.name}</div>
          </div>`).join('')}
      </div>

      <div class="c06-detail">
        <div class="c06-detail-title">${s.title}</div>
        <p style="font-size:13px;color:var(--text);margin-bottom:16px;line-height:1.65;">${s.intro}</p>
        <div class="c06-cols">
          <div>
            <div class="c06-col-head failures">NEW FAILURE MODES</div>
            ${s.failures.map(f => `
              <div class="c06-item">
                <div class="c06-dot red" style="margin-top:6px;"></div>
                <div>
                  <div>${f.text}</div>
                  <div style="font-size:11px;color:var(--muted);margin-top:3px;font-style:italic;">${f.example}</div>
                </div>
              </div>`).join('')}
          </div>
          <div>
            <div class="c06-col-head solutions">DESIGN DECISIONS REQUIRED</div>
            ${s.solutions.map(sol => `
              <div class="c06-item">
                <div class="c06-dot green" style="margin-top:6px;"></div>
                <div>
                  <div>${sol.text}</div>
                  <div style="font-size:11px;color:var(--muted);margin-top:3px;font-style:italic;">${sol.example}</div>
                </div>
              </div>`).join('')}
          </div>
        </div>
      </div>

      <p style="font-size:11px;color:var(--muted);margin-top:12px;font-family:var(--font-mono);">
        ${ activeStage===0 ? 'Stage 1 of 4. The prototype is the easiest part. Click → to advance.'
         : activeStage===1 ? 'Stage 2: most prototypes fail here. Tool descriptions and context management are underestimated.'
         : activeStage===2 ? 'Stage 3: long-running agents and irreversible actions require explicit architectural decisions.'
         : 'Stage 4: congratulations — you\'re thinking about production. These are solvable with engineering discipline, not model upgrades.' }
      </p>

      <div class="key-insight ${activeStage === 3 ? 'visible' : ''}">
        <div class="key-insight-label">Key insight — Anthropic Engineering</div>
        <div class="key-insight-text">
          "The last mile often becomes most of the journey." Production multi-agent systems
          fail in classes — each class invisible until you reach that stage. Prototype to
          staging is effort budgeting and tool design. Staging to pre-prod is checkpointing
          and observability. Pre-prod to production is cost control and deploy safety.
          None of it is about the model. All of it is about the architecture around the model.
        </div>
      </div>
    `;

    card.querySelectorAll('.c06-stage').forEach(el => {
      el.onclick = () => { activeStage = parseInt(el.dataset.idx); render(); };
    });
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   Outcomes — Fractional AI × Cando Rail
   Attribution chain with expandable nodes + ROI scaler.
─────────────────────────────────────────────────────────── */
function initOutcomes() {
  const card = document.getElementById('component-outcomes');
  if (!card) return;

  const CHAIN = [
    {
      label: 'DESIGN',
      value: 'Orchestrated multi-agent system',
      sub: 'prework agent + voice transcription + human approval gate',
      expand: 'Fractional AI built Peter the Safety Agent using three coordinated agents: a prework agent that researches the site and prior assessments before the meeting, a real-time transcription agent (Recall.ai + GPT-4 Realtime) that captures the expert interview live, and a draft generation agent that synthesizes both into a structured assessment. Critically, the final step — publishing the assessment — requires human expert approval. The agent never finalizes anything alone. This is the minimal footprint principle in a real production deployment.',
    },
    {
      label: 'TECHNICAL METRIC',
      value: '16 hours → instant draft',
      sub: 'per assessment cycle',
      expand: 'Manual risk assessments for Cando Rail previously consumed up to 16 hours of expert time per assessment — a combination of preparation, the meeting itself, documentation, and multiple revision cycles. With the agentic system, prework is automated before the meeting, transcription happens in real time during it, and a complete structured draft is available the moment the meeting ends.',
    },
    {
      label: 'UNIT ECONOMICS',
      value: '$0.05 per report',
      sub: 'fully loaded compute cost',
      expand: 'Each assessment report is generated for less than $0.05 in compute cost. This is the direct result of the minimal footprint and context discipline principles: the agents fetch only what they need, prework is structured rather than open-ended, and the transcription-to-draft pipeline is tight. The cost asymmetry with manual documentation (hours of expert time at professional rates) is the business case.',
    },
    {
      label: 'BUSINESS OUTCOME',
      value: '6× program scale',
      sub: 'in 17% of the time',
      expand: 'Cando Rail & Terminals expanded their risk assessment program sixfold — running 6× more assessments per period — using the same expert headcount, in just 17% of the time the manual process required. This was structurally impossible with manual documentation regardless of how many people were hired. The agentic system didn\'t just make the existing workflow faster — it made a new scale of operations viable.',
    },
  ];

  let activeNode  = null;
  let assessments = 20;

  function render() {
    const hours   = assessments * 20;
    const savings = hours * 50;
    const cost    = assessments * 0.05;

    card.innerHTML = `
      <div class="chain-diagram">
        ${CHAIN.map((n, i) => `
          <div class="chain-node ${activeNode===i?'active':''}" data-idx="${i}">
            <div class="chain-node-label">${n.label}</div>
            <div class="chain-node-value">${n.value}</div>
            <div class="chain-node-sub">${n.sub}</div>
          </div>`).join('')}
      </div>

      <div class="chain-expand ${activeNode!==null?'visible':''}" id="chain-expand">
        ${activeNode !== null ? CHAIN[activeNode].expand : ''}
      </div>

      <p style="font-size:11px;color:var(--muted);margin-bottom:20px;font-family:var(--font-mono);">
        Click any node to expand. Source:
        <a href="https://www.fractional.ai/case-studies" target="_blank" rel="noopener" style="color:var(--muted);text-decoration:underline;">fractional.ai/case-studies</a>
        — Cando Rail &amp; Terminals case study.
      </p>

      <div class="roi-scaler">
        <div class="roi-label">ROI SCALER — illustrative, based on Cando Rail reported figures (20+ hours saved per assessment)</div>
        <div class="roi-slider-row">
          <label style="font-size:13px;color:var(--text);">Assessments / month</label>
          <input type="range" min="1" max="200" value="${assessments}" id="roi-slider">
          <span class="roi-num" id="roi-num">${assessments}</span>
        </div>
        <div class="roi-outputs">
          <div class="roi-stat">
            <div class="roi-stat-num" id="roi-hours">${hours}</div>
            <div class="roi-stat-label">hours saved / mo</div>
          </div>
          <div class="roi-stat">
            <div class="roi-stat-num" id="roi-savings">$${savings>=1000?(savings/1000).toFixed(0)+'k':savings}</div>
            <div class="roi-stat-label">est. value @ $50/hr</div>
          </div>
          <div class="roi-stat">
            <div class="roi-stat-num" id="roi-cost">$${cost.toFixed(2)}</div>
            <div class="roi-stat-label">agent compute / mo</div>
          </div>
        </div>
        <div class="roi-disclaimer">Illustrative. Based on Fractional AI's reported 20+ hours saved per assessment and $0.05/report compute cost.</div>
      </div>
    `;

    card.querySelectorAll('.chain-node').forEach(el => {
      el.onclick = () => { activeNode = activeNode===parseInt(el.dataset.idx) ? null : parseInt(el.dataset.idx); render(); };
    });

    const slider = card.querySelector('#roi-slider');
    if (slider) {
      slider.oninput = (e) => {
        assessments = parseInt(e.target.value);
        const h = assessments * 20;
        const s = h * 50;
        const c = assessments * 0.05;
        card.querySelector('#roi-num').textContent     = assessments;
        card.querySelector('#roi-hours').textContent   = h;
        card.querySelector('#roi-savings').textContent = '$'+(s>=1000?(s/1000).toFixed(0)+'k':s);
        card.querySelector('#roi-cost').textContent    = '$'+c.toFixed(2);
      };
    }
  }

  render();
}
