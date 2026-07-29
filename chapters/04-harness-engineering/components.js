/* ═══════════════════════════════════════════════════════════
   components.js — Chapter 04: Agent Harness Engineering
   6 interactive components + outcomes. No external dependencies.
   All numbers sourced from Anthropic's own engineering posts —
   see chapters/04-harness-engineering/SPEC.md for citations.
═══════════════════════════════════════════════════════════ */

function termLines(lines) {
  return lines.map(l => `<span class="${l.cls || 'term-line'}">${l.text}</span>`).join('');
}

/* ───────────────────────────────────────────────────────────
   01 — Agent = Model + Harness
   Toggle solo vs full-harness run of the same task, same model.
─────────────────────────────────────────────────────────── */
function initC01() {
  const card = document.getElementById('component-01');
  if (!card) return;

  let mode = 'solo';
  let viewedSolo = true;
  let viewedHarness = false;

  const RUNS = {
    solo: {
      label: 'Solo run', cost: '$9', time: '20 min',
      lines: [
        { cls: 'term-prompt', text: '$ claude "build a retro game maker"' },
        { cls: 'term-dim', text: '> generating...' },
        { cls: 'term-ok', text: '> done in 20 min · $9' },
      ],
      checks: [
        { ok: false, text: 'input wiring broken' },
        { ok: false, text: 'half the layout unused' },
        { ok: false, text: 'rigid workflow' },
      ],
    },
    harness: {
      label: 'Full-harness run', cost: '$200', time: '6 hr',
      lines: [
        { cls: 'term-prompt', text: '$ claude "build a retro game maker" --harness=full' },
        { cls: 'term-dim', text: '> sprint 1: core loop................. done' },
        { cls: 'term-dim', text: '> sprint 2: input + physics........... done' },
        { cls: 'term-dim', text: '> sprint 3: level editor (27 criteria). done' },
        { cls: 'term-ok', text: '> 6 hr 0 min · $200' },
      ],
      checks: [
        { ok: true, text: 'working entity movement + gameplay' },
        { ok: true, text: 'sprite generator (bonus, not requested)' },
        { ok: true, text: 'level designer (bonus, not requested)' },
      ],
    },
  };

  function render() {
    const cfg = RUNS[mode];
    card.innerHTML = `
      <div class="component-setup">
        Toggle between the solo run and the full-harness run — same model both times.
      </div>

      <div class="btn-row">
        <button class="toggle-btn ${mode === 'solo' ? 'active' : ''}" id="c01-solo">Solo run</button>
        <button class="toggle-btn ${mode === 'harness' ? 'active' : ''}" id="c01-harness">Full-harness run</button>
      </div>

      <div class="term">${termLines(cfg.lines)}</div>

      <div class="c01-outcome-grid">
        <div class="c01-outcome-col">
          ${cfg.checks.map(c => `
            <div class="c01-check-item ${c.ok ? 'good' : 'bad'}">
              <span class="mark">${c.ok ? '✓' : '✗'}</span>
              <span>${c.text}</span>
            </div>`).join('')}
        </div>
        <div class="c01-outcome-col" style="display:flex;flex-direction:column;justify-content:center;">
          <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);letter-spacing:.08em;text-transform:uppercase;margin-bottom:6px;">THIS RUN</div>
          <div style="font-family:var(--font-display);font-size:1.3rem;font-weight:800;color:${mode==='solo'?'var(--red)':'var(--green)'};">${cfg.cost} · ${cfg.time}</div>
        </div>
      </div>

      <p style="font-size:11px;color:var(--muted);margin-top:12px;font-family:var(--font-mono);">
        ${mode === 'solo'
          ? 'Same model as the harness run. No verification gate, no session structure — one continuous generation.'
          : 'Same model as the solo run. Sprints, evaluator criteria, and a verification gate — no model upgrade.'}
      </p>

      <div class="key-insight ${viewedSolo && viewedHarness ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          Same model. Over 20x the cost and time on the full-harness run — and a categorically different outcome. One version shipped a demo that looks done. The other shipped software that works, plus features nobody asked for. The gap wasn't the model.
        </div>
      </div>
    `;

    card.querySelector('#c01-solo').onclick = () => { mode = 'solo'; viewedSolo = true; render(); };
    card.querySelector('#c01-harness').onclick = () => { mode = 'harness'; viewedHarness = true; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   02 — The One-Shot Ceiling
   Context bar fills across one long session. Toggle session
   bridging to see a clean handoff vs. a premature "done."
─────────────────────────────────────────────────────────── */
function initC02() {
  const card = document.getElementById('component-02');
  if (!card) return;

  let bridging = false;
  let viewedOff = true;
  let viewedOn = false;

  const OFF_LINES = [
    { cls: 'term-dim', text: '> ...still implementing feature 187 of 200+...' },
    { cls: 'term-warn', text: '> context nearly full — wrapping up now' },
    { cls: 'term-bad', text: '> "Done!" (feature untested, file left in broken state)' },
  ];
  const ON_LINES = [
    { cls: 'term-ok', text: '> feature_list.json updated: 187/200+ done' },
    { cls: 'term-dim', text: '> progress.txt written for next session' },
    { cls: 'term-dim', text: '> git commit: "clean state, feature 187 complete"' },
    { cls: 'term-divider', text: '── session ends ──' },
    { cls: 'term-divider', text: '── new session starts ──' },
    { cls: 'term-ok', text: '> reading progress.txt... resuming at feature 188' },
  ];

  function render() {
    card.innerHTML = `
      <div class="component-setup">
        Toggle session bridging off/on — same context ceiling, different handoff.
      </div>

      <div class="c02-context-wrap">
        <div class="c02-context-label">
          <span>Context window</span>
          <span style="color:var(--amber);font-family:var(--font-mono);">92%</span>
        </div>
        <div class="c02-context-bar">
          <div class="c02-context-fill" style="width:92%;background:var(--amber);"></div>
        </div>
      </div>

      <div class="btn-row">
        <button class="toggle-btn ${!bridging ? 'active' : ''}" id="c02-off">No session bridging</button>
        <button class="toggle-btn ${bridging ? 'active' : ''}" id="c02-on">Initializer + handoff</button>
      </div>

      <div class="term">${termLines(bridging ? ON_LINES : OFF_LINES)}</div>

      <p style="font-size:11px;color:var(--muted);margin-top:12px;font-family:var(--font-mono);">
        ${bridging
          ? 'The initializer agent set up feature_list.json once. Every session after it leaves a clean handoff.'
          : 'No shared state between sessions. The agent rushes to declare done as context runs out.'}
      </p>

      <div class="key-insight ${viewedOff && viewedOn ? 'visible' : ''}">
        <div class="key-insight-label">Key insight — Anthropic Engineering</div>
        <div class="key-insight-text">
          "Each new session begins with no memory of what came before — agents need a way to bridge the gap between coding sessions." One real build tracked over 200 features this way across many sessions, each one picking up exactly where the last left off.
        </div>
      </div>
    `;

    card.querySelector('#c02-off').onclick = () => { bridging = false; viewedOff = true; render(); };
    card.querySelector('#c02-on').onclick = () => { bridging = true; viewedOn = true; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   03 — The Verification Gate
   Toggle a mandatory test-before-exit step; same bug, caught
   or shipped depending on the gate.
─────────────────────────────────────────────────────────── */
function initC03() {
  const card = document.getElementById('component-03');
  if (!card) return;

  let gateOn = false;
  let viewedOff = true;
  let viewedOn = false;

  const OFF_LINES = [
    { cls: 'term-prompt', text: '$ claude "wire up the checkout button"' },
    { cls: 'term-dim', text: '> edited checkout.js' },
    { cls: 'term-dim', text: '> looks correct' },
    { cls: 'term-ok', text: '> marking task complete ✓' },
  ];
  const ON_LINES = [
    { cls: 'term-prompt', text: '$ claude "wire up the checkout button" --gate=test-before-exit' },
    { cls: 'term-dim', text: '> edited checkout.js' },
    { cls: 'term-dim', text: '> running browser-automation test...' },
    { cls: 'term-bad', text: '✗ test failed: click event not bound' },
    { cls: 'term-dim', text: '> fixing...' },
    { cls: 'term-ok', text: '> re-running test... ✓ passed' },
    { cls: 'term-ok', text: '> marking task complete ✓' },
  ];

  function render() {
    card.innerHTML = `
      <div class="component-setup">
        Toggle the test-before-exit gate — the bug in the code is identical either way.
      </div>

      <div class="btn-row">
        <button class="toggle-btn ${!gateOn ? 'active' : ''}" id="c03-off">Test-before-exit: OFF</button>
        <button class="toggle-btn ${gateOn ? 'active' : ''}" id="c03-on">Test-before-exit: ON</button>
      </div>

      <div class="term">${termLines(gateOn ? ON_LINES : OFF_LINES)}</div>

      ${!gateOn ? `
      <div class="c03-result-line">
        <span class="badge badge-warn">⚠ found later</span>
        <span style="font-size:12px;color:var(--muted-2);">checkout button doesn't fire — found by a user, not the harness</span>
      </div>` : `
      <div class="c03-result-line">
        <span class="badge badge-pass">caught before ship</span>
        <span style="font-size:12px;color:var(--muted-2);">same bug, found by the verification gate</span>
      </div>`}

      <div class="key-insight ${viewedOff && viewedOn ? 'visible' : ''}">
        <div class="key-insight-label">Key insight — Anthropic Engineering</div>
        <div class="key-insight-text">
          "Clean state" means code with no major bugs — appropriate for merging to a main branch. The coding agent runs a browser-automation test before a feature can be marked complete. The bug was identical in both runs; only one harness had a gate that could catch it before it shipped.
        </div>
      </div>
    `;

    card.querySelector('#c03-off').onclick = () => { gateOn = false; viewedOff = true; render(); };
    card.querySelector('#c03-on').onclick = () => { gateOn = true; viewedOn = true; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   04 — Planner → Generator → Evaluator
   Click through 7 real, timestamped/priced build phases from
   Anthropic's Digital Audio Workstation harness build.
─────────────────────────────────────────────────────────── */
function initC04() {
  const card = document.getElementById('component-04');
  if (!card) return;

  const STAGES = [
    { name: 'Planner',   time: '4.7 min',  cost: 0.46,  desc: 'Breaks the DAW build into buildable chunks before any code is generated.' },
    { name: 'Build R1',  time: '2h 7min',  cost: 71.08, desc: 'First generation pass — core DAW scaffolding.' },
    { name: 'QA R1',     time: '8.8 min',  cost: 3.24,  desc: 'Evaluator reviews Round 1 output against sprint criteria, sends feedback.' },
    { name: 'Build R2',  time: '1h 2min',  cost: 36.89, desc: 'Second generation pass — addresses QA Round 1 feedback.' },
    { name: 'QA R2',     time: '6.8 min',  cost: 3.09,  desc: 'Evaluator reviews Round 2 output.' },
    { name: 'Build R3',  time: '10.9 min', cost: 5.88,  desc: 'Third generation pass — final fixes.' },
    { name: 'QA R3',     time: '9.6 min',  cost: 4.06,  desc: 'Final evaluator pass before the build is marked complete.' },
  ];

  let activeStage = 0;
  let viewed = new Set([0]);

  function render() {
    const s = STAGES[activeStage];
    const total = STAGES.reduce((sum, st, i) => viewed.has(i) ? sum + st.cost : sum, 0);

    card.innerHTML = `
      <div class="component-setup">
        Click through all 7 phases — the running total only counts what you've seen.
      </div>

      <div class="c04-rail">
        ${STAGES.map((st, i) => `
          <div class="c04-stage ${activeStage === i ? 'active' : ''} ${viewed.has(i) ? 'viewed' : ''}" data-idx="${i}">
            <div class="c04-stage-num">${String(i + 1).padStart(2, '0')}</div>
            <div class="c04-stage-name">${st.name}</div>
          </div>`).join('')}
      </div>

      <div class="c04-detail">
        <div class="c04-detail-title">${s.name}</div>
        <p style="font-size:13px;color:var(--text);margin-bottom:12px;line-height:1.6;">${s.desc}</p>
        <div class="c04-detail-stats">
          <div>
            <div class="c04-detail-stat-num">${s.time}</div>
            <div class="c04-detail-stat-label">time</div>
          </div>
          <div>
            <div class="c04-detail-stat-num">$${s.cost.toFixed(2)}</div>
            <div class="c04-detail-stat-label">cost</div>
          </div>
        </div>
      </div>

      <div class="c04-total">
        <span class="c04-total-label">Running total (${viewed.size}/${STAGES.length} phases seen)</span>
        <span class="c04-total-value">$${total.toFixed(2)}</span>
      </div>

      <p style="font-size:11px;color:var(--muted);margin-top:12px;font-family:var(--font-mono);">
        ${viewed.size < STAGES.length
          ? 'Click each stage on the rail above to see its real time and cost.'
          : 'Full build: 3h 50min · $124.70 total. Three build/QA cycles, not one long generation.'}
      </p>

      <div class="key-insight ${viewed.size === STAGES.length ? 'visible' : ''}">
        <div class="key-insight-label">Key insight — Anthropic Engineering</div>
        <div class="key-insight-text">
          "A planner breaks the big task into smaller chunks. A generator builds each chunk. An evaluator reviews the output and sends feedback." Three build/QA cycles cost $124.70 and took 3h 50min — traceable, phase by phase, to a real build, not a one-shot generation with no visibility into where the time or cost went.
        </div>
      </div>
    `;

    card.querySelectorAll('.c04-stage').forEach(el => {
      el.onclick = () => {
        activeStage = parseInt(el.dataset.idx);
        viewed.add(activeStage);
        render();
      };
    });
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   05 — Sprint Decomposition
   Toggle continuous generation vs. sprint-gated generation.
─────────────────────────────────────────────────────────── */
function initC05() {
  const card = document.getElementById('component-05');
  if (!card) return;

  let mode = 'continuous';
  let viewedContinuous = true;
  let viewedSprint = false;

  const SPRINTS = [
    { name: 'Sprint 1', met: 14, total: 14 },
    { name: 'Sprint 2', met: 19, total: 19 },
    { name: 'Sprint 3', met: 22, total: 27 },
  ];

  function render() {
    card.innerHTML = `
      <div class="component-setup">
        Toggle continuous generation vs. sprint decomposition — same scope, different checkpoints.
      </div>

      <div class="btn-row">
        <button class="toggle-btn ${mode === 'continuous' ? 'active' : ''}" id="c05-cont">Continuous generation</button>
        <button class="toggle-btn ${mode === 'sprint' ? 'active' : ''}" id="c05-sprint">Sprint decomposition</button>
      </div>

      ${mode === 'continuous' ? `
        <div class="term">${termLines([
          { cls: 'term-dim', text: '> generating................................ (2h 04min)' },
          { cls: 'term-dim', text: '> generating................................' },
          { cls: 'term-warn', text: '> generating................................ still running' },
        ])}</div>
        <p style="font-size:11px;color:var(--muted);margin-top:12px;font-family:var(--font-mono);">
          No checkpoint. Quality drift is invisible until the whole run finishes — one comparison ran over two hours before any evaluation happened.
        </p>
      ` : `
        <div class="c05-sprint-list">
          ${SPRINTS.map(s => {
            const pct = Math.round((s.met / s.total) * 100);
            const blocked = s.met < s.total;
            return `
            <div class="c05-sprint-row ${blocked ? 'blocked' : ''}">
              <div class="c05-sprint-top">
                <span class="c05-sprint-name">${s.name}</span>
                <span class="c05-sprint-count">${s.met}/${s.total} criteria ${blocked ? '⚠ evaluator blocks' : '✓'}</span>
              </div>
              <div class="c05-sprint-bar-track">
                <div class="c05-sprint-bar-fill" style="width:${pct}%;"></div>
              </div>
            </div>`;
          }).join('')}
        </div>
        <p style="font-size:11px;color:var(--muted);margin-top:12px;font-family:var(--font-mono);">
          Sprint 3 alone had 27 evaluator criteria covering the level editor — 5 unmet criteria block the sprint from being marked done.
        </p>
      `}

      <div class="key-insight ${viewedContinuous && viewedSprint ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          Breaking work into evaluable chunks is a harness decision — the model never "decided" to checkpoint itself. Sprint decomposition surfaces problems chunk by chunk instead of at the end of a multi-hour run.
        </div>
      </div>
    `;

    card.querySelector('#c05-cont').onclick = () => { mode = 'continuous'; viewedContinuous = true; render(); };
    card.querySelector('#c05-sprint').onclick = () => { mode = 'sprint'; viewedSprint = true; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   06 — Harness Artifacts in the Wild
   Step through an annotated (paraphrased) Claude Code session
   opening this exact repo.
─────────────────────────────────────────────────────────── */
function initC06() {
  const card = document.getElementById('component-06');
  if (!card) return;

  const STEPS = [
    { line: { cls: 'term-prompt', text: '$ claude' }, note: null },
    { line: { cls: 'term-dim', text: '> reading Technical/CLAUDE.md...' }, note: '"career/ contains PII — do not push to a public remote"' },
    { line: { cls: 'term-dim', text: '> reading nishtobehonest/CLAUDE.md...' }, note: '"Deploys are manual, not git-triggered..."' },
    { line: { cls: 'term-warn', text: '> memory recall: draft_campaign_forge_status.md' }, note: '⚠ "this memory is 13 days old — verify before asserting"' },
    { line: { cls: 'term-ok', text: '> invoking skill: primer-chapter' }, note: 'building Chapter 04 from this exact process' },
  ];

  let step = 0;

  function render() {
    const visible = STEPS.slice(0, step + 1);
    const lines = [];
    visible.forEach(s => {
      lines.push(s.line);
    });

    card.innerHTML = `
      <div class="component-setup">
        Step through a real (paraphrased) Claude Code session opening this repo.
      </div>

      <div class="term">
        ${visible.map(s => `
          <span class="${s.line.cls}">${s.line.text}</span>
          ${s.note ? `<span class="c06-annotation">${s.note}</span>` : ''}
        `).join('')}
      </div>

      <div class="btn-row" style="margin-top:16px;">
        <button class="toggle-btn" id="c06-next" ${step >= STEPS.length - 1 ? 'disabled style="opacity:.4;"' : ''}>
          ${step >= STEPS.length - 1 ? 'End of session' : 'Next step →'}
        </button>
        <button class="toggle-btn" id="c06-reset">Reset</button>
      </div>

      <div class="key-insight ${step >= STEPS.length - 1 ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          The chapter you're reading right now is a byproduct of the same harness layers described above — a CLAUDE.md hierarchy for context, a memory system that flags its own staleness, and a skill that encodes a repeatable build process instead of re-explaining it every time.
        </div>
      </div>
    `;

    const next = card.querySelector('#c06-next');
    if (next && step < STEPS.length - 1) next.onclick = () => { step++; render(); };
    card.querySelector('#c06-reset').onclick = () => { step = 0; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   Outcomes — harness design → cost/time → completeness →
   business outcome. ROI scaler built only from Anthropic's
   own reported solo-vs-harness figures ($9/20min vs $200/6hr).
─────────────────────────────────────────────────────────── */
function initOutcomes() {
  const card = document.getElementById('component-outcomes');
  if (!card) return;

  const CHAIN = [
    {
      label: 'HARNESS DESIGN',
      value: 'Session-bridging + verification + sprint gates',
      sub: 'concrete layers, not a bigger model',
      expand: 'Anthropic\'s coding-agent harness combines an initializer/coding-agent split for cross-session continuity, a mandatory browser-automation test before a feature can be marked complete, and a planner/generator/evaluator loop that gates each chunk of work against evaluator criteria before moving on.',
    },
    {
      label: 'TIME & COST PER PHASE',
      value: '$124.70 · 3h 50min',
      sub: 'DAW build, full harness, phase by phase',
      expand: 'The Digital Audio Workstation build is traceable phase by phase: Planner ($0.46) → Build R1 ($71.08) → QA R1 ($3.24) → Build R2 ($36.89) → QA R2 ($3.09) → Build R3 ($5.88) → QA R3 ($4.06). Nothing here is a black box — every dollar and minute maps to a specific stage.',
    },
    {
      label: 'OUTPUT COMPLETENESS',
      value: 'Working software vs. a broken prototype',
      sub: 'same model, categorically different result',
      expand: 'The retro-game-maker solo run ($9, 20 min) shipped broken input wiring and dead layout space. The full-harness run ($200, 6 hr) shipped working entity movement and gameplay, plus a sprite generator and level designer nobody asked for. The model was identical in both runs.',
    },
    {
      label: 'BUSINESS OUTCOME',
      value: 'The real cost is what ships uncaught',
      sub: 'not the extra $191 or 5h 40min',
      expand: 'The extra time and cost of the full harness isn\'t the number that matters. What matters is what the $9, 20-minute version would have shipped uncaught — a demo that looks done and doesn\'t work. Harness engineering trades time and compute for software that actually works.',
    },
  ];

  let activeNode = null;
  let features = 10;

  function computeOutputs(f) {
    const soloCost = f * 9;
    const harnessCost = f * 200;
    const delta = harnessCost - soloCost;
    return { soloCost, harnessCost, delta };
  }

  function render() {
    const { soloCost, harnessCost, delta } = computeOutputs(features);

    card.innerHTML = `
      <div class="chain-diagram">
        ${CHAIN.map((n, i) => `
          <div class="chain-node ${activeNode === i ? 'active' : ''}" data-idx="${i}">
            <div class="chain-node-label">${n.label}</div>
            <div class="chain-node-value">${n.value}</div>
            <div class="chain-node-sub">${n.sub}</div>
          </div>`).join('')}
      </div>

      <div class="chain-expand ${activeNode !== null ? 'visible' : ''}" id="chain-expand">
        ${activeNode !== null ? CHAIN[activeNode].expand : ''}
      </div>

      <p style="font-size:11px;color:var(--muted);margin-bottom:20px;font-family:var(--font-mono);">
        Click any node to expand. Source:
        <a href="https://www.anthropic.com/engineering/harness-design-long-running-apps" target="_blank" rel="noopener" style="color:var(--muted);text-decoration:underline;">anthropic.com/engineering/harness-design-long-running-apps</a>
      </p>

      <div class="roi-scaler">
        <div class="roi-label">ROI SCALER — illustrative, based on Anthropic's reported figures ($9/20min solo vs. $200/6hr full-harness, per feature)</div>
        <div class="roi-slider-row">
          <label style="font-size:13px;color:var(--text);">Agent-built features / month</label>
          <input type="range" min="1" max="60" value="${features}" id="roi-slider">
          <span class="roi-num" id="roi-num">${features}</span>
        </div>
        <div class="roi-outputs">
          <div class="roi-stat">
            <div class="roi-stat-num" id="roi-solo">$${soloCost}</div>
            <div class="roi-stat-label">solo cost / mo</div>
          </div>
          <div class="roi-stat">
            <div class="roi-stat-num" id="roi-harness">$${harnessCost}</div>
            <div class="roi-stat-label">full-harness cost / mo</div>
          </div>
          <div class="roi-stat">
            <div class="roi-stat-num" id="roi-delta">$${delta}</div>
            <div class="roi-stat-label">delta — cost of not shipping slop</div>
          </div>
        </div>
        <div class="roi-disclaimer">Illustrative. Scales Anthropic's own reported per-feature figures — no benchmark or accuracy number is implied, since none was disclosed.</div>
      </div>
    `;

    card.querySelectorAll('.chain-node').forEach(el => {
      el.onclick = () => { activeNode = activeNode === parseInt(el.dataset.idx) ? null : parseInt(el.dataset.idx); render(); };
    });

    const slider = card.querySelector('#roi-slider');
    if (slider) {
      slider.oninput = (e) => {
        features = parseInt(e.target.value);
        const out = computeOutputs(features);
        card.querySelector('#roi-num').textContent = features;
        card.querySelector('#roi-solo').textContent = '$' + out.soloCost;
        card.querySelector('#roi-harness').textContent = '$' + out.harnessCost;
        card.querySelector('#roi-delta').textContent = '$' + out.delta;
      };
    }
  }

  render();
}
