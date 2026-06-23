/* ═══════════════════════════════════════════════════════════
   components.js — 6 interactive eval components
   Depends on world.js (window.WorldLib) loaded first.
═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────
   01 — What is an eval
   Single-step runner: click Step, watch one full eval loop tick.
   Agent walks via A* one step at a time; trace builds; grader
   fires goal_reached: 1.0 when agent reaches G.
─────────────────────────────────────────────────────────── */
function initC01() {
  const card = document.getElementById('component-01');
  if (!card) return;

  const { GridWorld, RuleBasedAgent, renderGrid, Trace, renderTrace, gradeEpisode } = window.WorldLib;

  const world = new GridWorld('simple');
  const agent = new RuleBasedAgent();
  const trace = new Trace();

  card.innerHTML = `
    <div class="row" style="align-items: flex-start; gap: 24px; flex-wrap: wrap;">
      <div class="col">
        <span class="label">environment</span>
        <div id="c01-grid"></div>
      </div>
      <div class="col" style="flex: 1; min-width: 220px;">
        <span class="label">trace</span>
        <div class="trace-panel" id="c01-trace"></div>
        <span class="label" style="margin-top: 14px;">grade</span>
        <div class="grade-display pending" id="c01-grade">goal_reached: -</div>
      </div>
    </div>
    <div style="margin-top: 20px; display: flex; gap: 10px; align-items: center; flex-wrap: wrap;">
      <button class="btn btn-primary" id="c01-step">Step →</button>
      <button class="btn btn-secondary" id="c01-reset">Reset</button>
      <span class="mono muted" id="c01-status" style="font-size: 12px;"></span>
    </div>
  `;

  const gridEl   = card.querySelector('#c01-grid');
  const traceEl  = card.querySelector('#c01-trace');
  const gradeEl  = card.querySelector('#c01-grade');
  const stepBtn  = card.querySelector('#c01-step');
  const resetBtn = card.querySelector('#c01-reset');
  const statusEl = card.querySelector('#c01-status');

  function draw() {
    renderGrid(gridEl, world);
    renderTrace(traceEl, trace);
  }

  function reset() {
    world.reset();
    agent.reset();
    trace.reset();
    gradeEl.className  = 'grade-display pending';
    gradeEl.textContent = 'goal_reached: -';
    stepBtn.disabled   = false;
    statusEl.textContent = '';
    draw();
  }

  stepBtn.addEventListener('click', () => {
    if (world.done) return;

    const action = agent.chooseAction(world);
    const { result, tick } = world.step(action);
    trace.record(tick, action, result);
    draw();

    if (result === 'goal') {
      const g = gradeEpisode(trace);
      gradeEl.textContent = `goal_reached: ${g.goal_reached.toFixed(1)}  ✓  PASS`;
      gradeEl.className   = 'grade-display pass';
      stepBtn.disabled    = true;
      statusEl.textContent = `${trace.length} step${trace.length !== 1 ? 's' : ''} · one eval · one trial · one result`;
    } else if (result === 'hazard') {
      gradeEl.textContent = 'goal_reached: 0.0  ✗  FAIL';
      gradeEl.className   = 'grade-display fail';
      stepBtn.disabled    = true;
    }
  });

  resetBtn.addEventListener('click', reset);
  reset();
}

/* ───────────────────────────────────────────────────────────
   02 — Eval anatomy
   Nested diagram of a completed episode. Click/hover any
   term label to highlight it and reveal its definition inline.
─────────────────────────────────────────────────────────── */
function initC02() {
  const card = document.getElementById('component-02');
  if (!card) return;

  const TERMS = {
    suite: {
      label: 'Suite',
      short: 'maze_01 · maze_02 · maze_trap · maze_deadend',
      def: 'The full collection of tasks run together. Your complete test battery — everything you measure in one eval run.',
    },
    harness: {
      label: 'Harness',
      short: 'runs all trials · collects traces · aggregates scores',
      def: 'The infrastructure that orchestrates eval execution: spawns agents, applies tasks, gathers traces, and rolls up final scores.',
    },
    task: {
      label: 'Task: maze_01',
      short: 'reach G · avoid X · max 30 steps',
      def: 'One problem definition — the specific goal, constraints, and success criteria for a single test case.',
    },
    trial: {
      label: 'Trial 1',
      short: 'one agent run from start to finish',
      def: 'A single execution of a task by the agent. You may run many trials per task to account for non-determinism.',
    },
    trace: {
      label: 'Trace',
      short: 'tick 0  right  ok\ntick 1  down   ok\ntick 2  right  goal',
      def: 'The full sequential record of every action and result during a trial. The raw replay log.',
    },
    outcome: {
      label: 'Outcome',
      short: 'tick 2  right  goal  ←',
      def: 'The terminal event in a trace — the moment that triggers the grader. Goal reached, hazard hit, or max steps exceeded.',
    },
    grader: {
      label: 'Grader',
      short: 'goal_reached: 1.0  ✓  PASS',
      def: 'The logic that reads a trace and returns a score. Can be a code check, a model call, or a human review.',
    },
  };

  // Build nested anatomy HTML
  card.innerHTML = `
    <div class="anatomy-diagram">

      <div class="anatomy-layer" data-term="suite">
        <span class="anatomy-term">Suite</span>
        <div class="anatomy-content mono" style="font-size:11px; color:var(--muted);">
          maze_01 &nbsp;·&nbsp; maze_02 &nbsp;·&nbsp; maze_trap &nbsp;·&nbsp; maze_deadend
        </div>
        <div class="anatomy-definition" id="def-suite"></div>

        <div style="margin-top: 14px;">
          <div class="anatomy-layer" data-term="harness">
            <span class="anatomy-term">Harness</span>
            <div class="anatomy-content mono" style="font-size:11px; color:var(--muted);">
              runs all trials · collects traces · aggregates scores
            </div>
            <div class="anatomy-definition" id="def-harness"></div>

            <div style="margin-top: 14px;">
              <div class="anatomy-layer" data-term="task">
                <span class="anatomy-term">Task: maze_01</span>
                <div class="anatomy-content mono" style="font-size:11px; color:var(--muted);">
                  reach G · avoid X · max 30 steps
                </div>
                <div class="anatomy-definition" id="def-task"></div>

                <div style="margin-top: 14px;">
                  <div class="anatomy-layer" data-term="trial">
                    <span class="anatomy-term">Trial 1</span>
                    <div class="anatomy-definition" id="def-trial"></div>

                    <div style="margin-top: 12px;">
                      <div class="anatomy-layer" data-term="trace">
                        <span class="anatomy-term">Trace</span>
                        <div class="anatomy-definition" id="def-trace"></div>
                        <div class="trace-panel" style="margin-top: 8px; min-height: 60px; pointer-events: none;">
                          <div class="trace-row" style="animation: none; opacity: 1;"><span class="tick">tick  0</span><span class="action">right </span><span class="result">ok</span></div>
                          <div class="trace-row" style="animation: none; opacity: 1;"><span class="tick">tick  1</span><span class="action">down  </span><span class="result">ok</span></div>
                          <div class="trace-row" style="animation: none; opacity: 1; display: flex; align-items: center; gap: 12px;">
                            <span class="tick">tick  2</span><span class="action">right </span><span class="result goal">goal</span>
                            <span class="anatomy-layer" data-term="outcome" style="margin: 0; padding: 2px 8px; border-radius: 3px; cursor: pointer; display: inline-flex; flex-direction: column;">
                              <span class="anatomy-term" style="font-size: 10px; margin: 0;">← Outcome</span>
                              <div class="anatomy-definition" id="def-outcome" style="display:none;"></div>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div class="anatomy-layer" data-term="grader" style="margin-top: 0; border-top: none; border-radius: 0 0 6px 6px;">
                        <span class="anatomy-term">Grader</span>
                        <div class="anatomy-definition" id="def-grader"></div>
                        <div style="margin-top: 6px;">
                          <span class="badge badge-pass">goal_reached: 1.0 &nbsp;✓&nbsp; PASS</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
    <p class="muted" style="font-size: 12px; margin-top: 16px; font-family: var(--font-body);">
      Click any highlighted term to toggle its definition.
    </p>
  `;

  // Attach click to the anatomy-term label (direct child of each layer).
  // Listening on the full layer causes stopPropagation from nested child layers
  // to silently eat clicks when the user clicks anywhere in the lower half.
  card.querySelectorAll('.anatomy-layer[data-term]').forEach(layer => {
    const termLabel = layer.querySelector(':scope > .anatomy-term');
    const clickTarget = termLabel || layer;

    clickTarget.style.cursor = 'pointer';

    clickTarget.addEventListener('click', e => {
      e.stopPropagation();
      const term = layer.dataset.term;
      const isHighlighted = layer.classList.contains('highlighted');
      layer.classList.toggle('highlighted', !isHighlighted);

      // Use :scope > to get only the direct child definition, not nested ones
      const defEl = layer.querySelector(':scope > .anatomy-definition');
      if (defEl && TERMS[term]) {
        defEl.textContent = TERMS[term].def;
        defEl.style.display = layer.classList.contains('highlighted') ? 'block' : 'none';
      }
    });
  });

}

/* ───────────────────────────────────────────────────────────
   03 — Single-turn vs Multi-turn
   Toggle between modes. In single-turn: grade fires the
   instant the agent responds. In multi-turn: grade stays
   grey until the full episode terminates. The delay IS the point.
─────────────────────────────────────────────────────────── */
function initC03() {
  const card = document.getElementById('component-03');
  if (!card) return;

  const { GridWorld, RuleBasedAgent, renderGrid, Trace, renderTrace, gradeEpisode } = window.WorldLib;

  card.innerHTML = `
    <div style="margin-bottom: 20px; display: flex; align-items: center; gap: 16px; flex-wrap: wrap;">
      <div class="toggle-group">
        <button class="toggle-btn active" id="c03-btn-single">Single-turn</button>
        <button class="toggle-btn" id="c03-btn-multi">Multi-turn</button>
      </div>
      <span class="mono muted" id="c03-mode-label" style="font-size: 12px;">one prompt → one action → grade</span>
    </div>

    <!-- Single-turn panel -->
    <div id="c03-single-panel">
      <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; align-items: start;">
        <div>
          <span class="label">prompt</span>
          <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 14px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--muted); line-height: 1.7;">
            Task: maze_01<br>
            Start: (1,1)<br>
            Goal: (2,3)<br>
            Action space: [up, down, left, right]<br>
            <br>
            Choose one action.
          </div>
        </div>
        <div>
          <span class="label">response</span>
          <div style="background: var(--bg); border: 1px solid var(--border); border-radius: 6px; padding: 14px 16px; font-family: var(--font-mono); font-size: 12px; color: var(--text); min-height: 84px; display: flex; align-items: center; justify-content: center;" id="c03-single-response">
            <span class="muted">-</span>
          </div>
        </div>
        <div>
          <span class="label">grade</span>
          <div class="grade-display pending" id="c03-single-grade" style="min-height: 84px; display: flex; align-items: center;">
            action_valid: -
          </div>
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; gap: 10px;">
        <button class="btn btn-primary" id="c03-single-run">Run eval</button>
        <button class="btn btn-secondary" id="c03-single-reset">Reset</button>
      </div>
    </div>

    <!-- Multi-turn panel -->
    <div id="c03-multi-panel" style="display:none;">
      <div class="row" style="align-items: flex-start; gap: 24px; flex-wrap: wrap;">
        <div class="col">
          <span class="label">environment</span>
          <div id="c03-multi-grid"></div>
        </div>
        <div class="col" style="flex: 1; min-width: 220px;">
          <span class="label">trace</span>
          <div class="trace-panel" id="c03-multi-trace"></div>
          <span class="label" style="margin-top: 14px;">grade</span>
          <div class="grade-display pending" id="c03-multi-grade">waiting for episode to end…</div>
        </div>
      </div>
      <div style="margin-top: 16px; display: flex; gap: 10px; align-items: center;">
        <button class="btn btn-primary" id="c03-multi-run">Run eval</button>
        <button class="btn btn-secondary" id="c03-multi-reset">Reset</button>
        <span class="mono muted" id="c03-multi-status" style="font-size: 12px;"></span>
      </div>
    </div>
  `;

  // ── Toggle ──────────────────────────────────────────────
  const singleBtn = card.querySelector('#c03-btn-single');
  const multiBtn  = card.querySelector('#c03-btn-multi');
  const modeLabel = card.querySelector('#c03-mode-label');
  const singlePanel = card.querySelector('#c03-single-panel');
  const multiPanel  = card.querySelector('#c03-multi-panel');

  function setMode(mode) {
    const isSingle = mode === 'single';
    singleBtn.classList.toggle('active', isSingle);
    multiBtn.classList.toggle('active', !isSingle);
    singlePanel.style.display = isSingle ? '' : 'none';
    multiPanel.style.display  = isSingle ? 'none' : '';
    modeLabel.textContent = isSingle
      ? 'one prompt → one action → grade'
      : 'full episode → all steps → grade fires at end';
    if (!isSingle) initMulti();
  }

  singleBtn.addEventListener('click', () => setMode('single'));
  multiBtn.addEventListener('click',  () => setMode('multi'));

  // ── Single-turn logic ───────────────────────────────────
  const singleResponseEl = card.querySelector('#c03-single-response');
  const singleGradeEl    = card.querySelector('#c03-single-grade');
  const singleRunBtn     = card.querySelector('#c03-single-run');
  const singleResetBtn   = card.querySelector('#c03-single-reset');

  function singleReset() {
    singleResponseEl.innerHTML = '<span class="muted">-</span>';
    singleGradeEl.className    = 'grade-display pending';
    singleGradeEl.textContent  = 'action_valid: -';
    singleRunBtn.disabled      = false;
  }

  singleRunBtn.addEventListener('click', () => {
    singleRunBtn.disabled = true;
    // Simulate: agent replies "right"
    singleResponseEl.innerHTML = '<span class="text-teal" style="font-size: 14px; font-family: var(--font-mono);">"right"</span>';
    // Grade fires IMMEDIATELY (same tick)
    requestAnimationFrame(() => {
      singleGradeEl.textContent = 'action_valid: 1.0  ✓  PASS';
      singleGradeEl.className   = 'grade-display pass';
    });
  });

  singleResetBtn.addEventListener('click', singleReset);
  singleReset();

  // ── Multi-turn logic ────────────────────────────────────
  let multiWorld = null, multiAgent = null, multiTrace = null, multiInterval = null;

  const multiGridEl   = card.querySelector('#c03-multi-grid');
  const multiTraceEl  = card.querySelector('#c03-multi-trace');
  const multiGradeEl  = card.querySelector('#c03-multi-grade');
  const multiRunBtn   = card.querySelector('#c03-multi-run');
  const multiResetBtn = card.querySelector('#c03-multi-reset');
  const multiStatusEl = card.querySelector('#c03-multi-status');

  function initMulti() {
    if (multiWorld) return;
    multiWorld = new GridWorld('simple');
    multiAgent = new RuleBasedAgent();
    multiTrace = new Trace();
    renderGrid(multiGridEl, multiWorld);
    renderTrace(multiTraceEl, multiTrace);
  }

  function multiReset() {
    clearInterval(multiInterval);
    multiInterval = null;
    if (multiWorld) { multiWorld.reset(); multiAgent.reset(); multiTrace.reset(); }
    multiGradeEl.className   = 'grade-display pending';
    multiGradeEl.textContent = 'waiting for episode to end…';
    multiRunBtn.disabled     = false;
    multiStatusEl.textContent = '';
    if (multiWorld) {
      renderGrid(multiGridEl, multiWorld);
      renderTrace(multiTraceEl, multiTrace);
    }
  }

  multiRunBtn.addEventListener('click', () => {
    if (!multiWorld) initMulti();
    if (multiWorld.done) return;
    multiRunBtn.disabled = true;

    multiInterval = setInterval(() => {
      if (multiWorld.done) { clearInterval(multiInterval); return; }

      const action = multiAgent.chooseAction(multiWorld);
      const { result, tick } = multiWorld.step(action);
      multiTrace.record(tick, action, result);
      renderGrid(multiGridEl, multiWorld);
      renderTrace(multiTraceEl, multiTrace);

      // Grade only fires when the episode ends — that's the whole point
      if (result === 'goal' || result === 'hazard') {
        clearInterval(multiInterval);
        const g = gradeEpisode(multiTrace);
        setTimeout(() => {
          multiGradeEl.textContent = `goal_reached: ${g.goal_reached.toFixed(1)}  ${g.pass ? '✓  PASS' : '✗  FAIL'}`;
          multiGradeEl.className   = `grade-display ${g.pass ? 'pass' : 'fail'}`;
          multiStatusEl.textContent = `${multiTrace.length} steps · grade fires at end, not before`;
        }, 200);
      }
    }, 280);
  });

  multiResetBtn.addEventListener('click', () => {
    multiWorld = null; multiAgent = null; multiTrace = null;
    multiReset();
    initMulti();
    renderGrid(multiGridEl, multiWorld);
    renderTrace(multiTraceEl, multiTrace);
  });
}

/* ───────────────────────────────────────────────────────────
   04 — Three grader types
   Same 5-step trace evaluated three ways. Click any column
   to expand its speed / cost / nuance tradeoff breakdown.
─────────────────────────────────────────────────────────── */
function initC04() {
  const card = document.getElementById('component-04');
  if (!card) return;

  // Fixed demo trace — same input to all three graders
  const TRACE = [
    { tick: 1, action: 'right', result: 'ok'   },
    { tick: 2, action: 'right', result: 'wall' },   // bumped wall → inefficient
    { tick: 3, action: 'down',  result: 'ok'   },
    { tick: 4, action: 'right', result: 'ok'   },
    { tick: 5, action: 'down',  result: 'goal' },
  ];

  const GRADERS = [
    {
      id:    'code',
      title: 'Code-based',
      color: 'var(--blue)',
      scores: [
        { metric: 'goal_reached',  value: '1.0', pass: true,  detail: 'result == "goal"' },
        { metric: 'wasted_moves',  value: '0.80', pass: true, detail: 'blocked / total = 1/5' },
      ],
      speed: 'Instant',
      cost:  'Free',
      pros: ['Deterministic — same trace, same score every time', 'Runs in milliseconds at any scale'],
      cons: ['Brittle: misses valid alternative paths', 'Can\'t reason about strategy or intent'],
    },
    {
      id:    'model',
      title: 'Model-based',
      color: 'var(--teal)',
      scores: [
        { metric: 'hazard_avoidance', value: '4/5', pass: true, detail: '"Did the agent avoid hazards proactively?"' },
        { metric: 'efficiency',       value: '0.80', pass: true, detail: 'Scored holistically by the model' },
      ],
      speed: '~2 sec',
      cost:  '~$0.001/trace',
      pros: ['Captures nuance a simple rule can\'t express', 'Handles novel situations and valid variations'],
      cons: ['Non-deterministic — same trace can score differently', 'Requires calibration and prompt engineering'],
    },
    {
      id:    'human',
      title: 'Human',
      color: 'var(--amber)',
      scores: [
        { metric: 'expert_score', value: '4/5', pass: true, detail: '"Good recovery after tick 2, but not optimal."' },
      ],
      speed: 'Hours–days',
      cost:  '$5–50/trace',
      pros: ['Gold standard — highest quality judgment', 'Catches subtle failure modes no automated grader sees'],
      cons: ['Slow, expensive, doesn\'t scale to large suites', 'Inter-rater reliability requires calibration'],
    },
  ];

  card.innerHTML = `
    <div style="margin-bottom: 20px;">
      <span class="label">shared trace — same episode evaluated three ways</span>
      <div class="trace-panel" style="pointer-events: none;">
        ${TRACE.map(e => `
          <div class="trace-row" style="animation:none; opacity:1;">
            <span class="tick">tick ${e.tick}</span>
            <span class="action">${e.action.padEnd(6,' ')}</span>
            <span class="result ${e.result === 'goal' ? 'goal' : e.result === 'wall' ? 'fail' : ''}">${e.result}</span>
          </div>
        `).join('')}
      </div>
    </div>

    <div class="grader-cols" id="c04-cols"></div>
    <p class="muted" style="font-size: 12px; margin-top: 14px; font-family: var(--font-body);">
      Click any column to expand its tradeoffs.
    </p>
  `;

  const colsEl = card.querySelector('#c04-cols');

  GRADERS.forEach(g => {
    const col = document.createElement('div');
    col.className = 'grader-col';
    col.dataset.id = g.id;

    col.innerHTML = `
      <div class="grader-col-title" style="color: ${g.color};">${g.title}</div>
      ${g.scores.map(s => `
        <div class="grader-score">${s.value}</div>
        <div class="grader-label">${s.metric} ${s.pass ? '✓' : '✗'}</div>
        <div class="grader-verdict">${s.detail}</div>
      `).join('<hr style="border-color:var(--border); margin: 8px 0;">')}
      <div class="grader-tradeoffs">
        <div style="display:flex; gap:24px; margin-bottom:12px;">
          <div><span class="muted mono" style="font-size:11px;">SPEED</span><br><span class="mono" style="font-size:13px;">${g.speed}</span></div>
          <div><span class="muted mono" style="font-size:11px;">COST</span><br><span class="mono" style="font-size:13px;">${g.cost}</span></div>
        </div>
        ${g.pros.map(p => `<div class="tradeoff-item"><span class="tradeoff-pro">+ </span>${p}</div>`).join('')}
        ${g.cons.map(c => `<div class="tradeoff-item"><span class="tradeoff-con">– </span>${c}</div>`).join('')}
      </div>
    `;

    col.addEventListener('click', () => {
      const isExpanded = col.classList.contains('expanded');
      colsEl.querySelectorAll('.grader-col').forEach(c => c.classList.remove('expanded'));
      if (!isExpanded) col.classList.add('expanded');
    });

    colsEl.appendChild(col);
  });
}

/* ───────────────────────────────────────────────────────────
   05 — pass@k
   Slider k=1→20. Three live probability curves. Table of
   key values. Callout at k=1 explaining the trap.
   Formula: P(≥1 success in k trials) = 1 − (1−p)^k
─────────────────────────────────────────────────────────── */
function initC05() {
  const card = document.getElementById('component-05');
  if (!card) return;

  const { passAtK } = window.WorldLib;

  const AGENTS = [
    { name: 'RuleBasedAgent', p: 1.00, color: 'var(--blue)',  dasharray: '6 3' },
    { name: 'LLMAgent',       p: 0.70, color: 'var(--teal)',  dasharray: ''    },
    { name: 'RandomAgent',    p: 0.30, color: 'var(--amber)', dasharray: ''    },
  ];

  const K_MAX = 20;
  const K_COLS = [1, 5, 10, 20];

  // SVG chart constants (viewBox coordinates)
  const W = 500, H = 160;
  const PAD = { top: 12, right: 10, bottom: 32, left: 44 };
  const CW = W - PAD.left - PAD.right;
  const CH = H - PAD.top  - PAD.bottom;

  function kToX(k)  { return PAD.left + ((k - 1) / (K_MAX - 1)) * CW; }
  function pToY(p)  { return PAD.top  + (1 - p) * CH; }

  function buildPolyline(agent) {
    const pts = [];
    for (let k = 1; k <= K_MAX; k++) {
      pts.push(`${kToX(k).toFixed(1)},${pToY(passAtK(agent.p, k)).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  function buildDot(agent, k) {
    const x = kToX(k);
    const y = pToY(passAtK(agent.p, k));
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }

  card.innerHTML = `
    <div class="passk-layout">

      <!-- Legend (HTML, above the chart to avoid overlap with curves) -->
      <div style="display:flex; gap:20px; flex-wrap:wrap; margin-bottom:4px;">
        ${AGENTS.map(a => `
          <div style="display:flex; align-items:center; gap:8px; font-family:var(--font-mono); font-size:12px; color:${a.color};">
            <svg width="20" height="4" style="flex-shrink:0;">
              <line x1="0" y1="2" x2="20" y2="2" stroke="${a.color}" stroke-width="2.5"
                    stroke-dasharray="${a.dasharray || 'none'}" stroke-linecap="round"/>
            </svg>
            ${a.name}
          </div>
        `).join('')}
      </div>

      <!-- Slider row -->
      <div class="passk-slider-row">
        <span class="label" style="margin:0; white-space:nowrap;">k =</span>
        <input class="passk-slider" type="range" min="1" max="${K_MAX}" value="1" id="c05-slider" />
        <span class="passk-k-label" id="c05-k-val">1</span>
      </div>

      <!-- SVG Chart -->
      <div class="passk-chart">
        <svg viewBox="0 0 ${W} ${H}" xmlns="http://www.w3.org/2000/svg"
             style="overflow:visible; width:100%; height:100%;">

          <!-- Grid lines -->
          ${[0, 0.25, 0.5, 0.75, 1.0].map(p => `
            <line x1="${PAD.left}" y1="${pToY(p).toFixed(1)}"
                  x2="${PAD.left + CW}" y2="${pToY(p).toFixed(1)}"
                  stroke="var(--border)" stroke-width="1" />
            <text x="${PAD.left - 6}" y="${(pToY(p) + 4).toFixed(1)}"
                  fill="var(--muted)" font-size="10" font-family="JetBrains Mono, monospace"
                  text-anchor="end">${p.toFixed(2)}</text>
          `).join('')}

          <!-- X-axis ticks -->
          ${[1, 5, 10, 15, 20].map(k => `
            <line x1="${kToX(k).toFixed(1)}" y1="${pToY(0) + 3}"
                  x2="${kToX(k).toFixed(1)}" y2="${pToY(0) - 1}"
                  stroke="var(--muted)" stroke-width="1" />
            <text x="${kToX(k).toFixed(1)}" y="${(pToY(0) + 15).toFixed(1)}"
                  fill="var(--muted)" font-size="10" font-family="JetBrains Mono, monospace"
                  text-anchor="middle">${k}</text>
          `).join('')}

          <!-- X-axis label -->
          <text x="${(PAD.left + CW / 2).toFixed(1)}" y="${H - 2}"
                fill="var(--muted)" font-size="10" font-family="JetBrains Mono, monospace"
                text-anchor="middle">k (number of trials)</text>

          <!-- Axes -->
          <line x1="${PAD.left}" y1="${PAD.top}" x2="${PAD.left}" y2="${pToY(0)}"
                stroke="var(--border)" stroke-width="1.5" />
          <line x1="${PAD.left}" y1="${pToY(0)}" x2="${PAD.left + CW}" y2="${pToY(0)}"
                stroke="var(--border)" stroke-width="1.5" />

          <!-- Agent curves -->
          ${AGENTS.map(a => `
            <polyline id="c05-line-${a.name}"
                      points="${buildPolyline(a)}"
                      fill="none" stroke="${a.color}" stroke-width="2.5"
                      stroke-dasharray="${a.dasharray}"
                      stroke-linecap="round" stroke-linejoin="round" />
          `).join('')}

          <!-- Cursor line -->
          <line id="c05-cursor"
                x1="${kToX(1).toFixed(1)}" y1="${PAD.top}"
                x2="${kToX(1).toFixed(1)}" y2="${pToY(0)}"
                stroke="var(--border)" stroke-width="1" stroke-dasharray="3 3" />

          <!-- Dots at current k -->
          ${AGENTS.map(a => `
            <circle id="c05-dot-${a.name}" r="5"
                    cx="${kToX(1).toFixed(1)}" cy="${pToY(passAtK(a.p, 1)).toFixed(1)}"
                    fill="${a.color}" stroke="var(--bg)" stroke-width="2" />
          `).join('')}


        </svg>
      </div>

      <!-- Value table -->
      <table class="passk-table" id="c05-table">
        <thead>
          <tr>
            <th>Agent</th>
            ${K_COLS.map(k => `<th>pass@${k}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          ${AGENTS.map(a => `
            <tr>
              <td style="color:${a.color};">${a.name}</td>
              ${K_COLS.map(k => `
                <td id="c05-cell-${a.name}-${k}">${passAtK(a.p, k).toFixed(2)}</td>
              `).join('')}
            </tr>
          `).join('')}
        </tbody>
      </table>

      <!-- Callout -->
      <div class="passk-callout" id="c05-callout">
        At pass@1, LLMAgent (0.70) looks 2× worse than RandomAgent at k=20 (0.98).
        One run is not an eval.
      </div>

    </div>
  `;

  // ── Live updates on slider input ──────────────────────
  const slider   = card.querySelector('#c05-slider');
  const kValEl   = card.querySelector('#c05-k-val');
  const cursorEl = card.querySelector('#c05-cursor');
  const callout  = card.querySelector('#c05-callout');

  function update() {
    const k = parseInt(slider.value, 10);
    kValEl.textContent = k;

    // Move cursor line
    const cx = kToX(k).toFixed(1);
    cursorEl.setAttribute('x1', cx);
    cursorEl.setAttribute('x2', cx);

    // Move dots
    AGENTS.forEach(a => {
      const p = passAtK(a.p, k);
      const dot = card.querySelector(`#c05-dot-${a.name}`);
      if (dot) {
        dot.setAttribute('cx', cx);
        dot.setAttribute('cy', pToY(p).toFixed(1));
      }
    });

    // Callout: highlight the k=1 insight
    if (k === 1) {
      callout.style.display = '';
      callout.textContent = 'At pass@1, LLMAgent looks 2× worse than RandomAgent at k=20. One run is not an eval.';
    } else {
      const llm    = passAtK(0.70, k);
      const random = passAtK(0.30, k);
      const rule   = passAtK(1.00, k);
      callout.style.display = '';
      callout.textContent =
        `At k=${k}: RandomAgent ${random.toFixed(2)}  ·  LLMAgent ${llm.toFixed(2)}  ·  RuleBasedAgent ${rule.toFixed(2)}`;
    }
  }

  slider.addEventListener('input', update);
  update();
}

/* ───────────────────────────────────────────────────────────
   06 — Capability vs Regression
   3-state flow: failing → passing → promoted.
   Capability evals expose what the agent can't do.
   Once it can, promote to regression to protect against
   sliding back.
─────────────────────────────────────────────────────────── */
function initC06() {
  const card = document.getElementById('component-06');
  if (!card) return;

  const { GridWorld, RuleBasedAgent, RandomAgent, renderGrid, runEpisode } = window.WorldLib;

  // States: 'failing' | 'passing' | 'promoted'
  let state = 'failing';

  card.innerHTML = `
    <div class="cap-reg-layout" id="c06-layout">

      <!-- CAPABILITY column -->
      <div id="c06-cap-col">
        <div class="col-header capability">Capability evals</div>
        <div id="c06-cap-slot">
          <!-- maze card rendered here -->
        </div>
        <div style="display: flex; gap: 8px; margin-top: 12px; flex-wrap: wrap;" id="c06-cap-btns">
          <button class="btn btn-secondary" id="c06-improve">Improve agent</button>
          <button class="btn btn-primary"   id="c06-promote" disabled>Promote to Regression →</button>
        </div>
      </div>

      <!-- REGRESSION column -->
      <div id="c06-reg-col">
        <div class="col-header regression">Regression suite</div>
        <div id="c06-reg-slot">
          <div class="regression-slot" id="c06-reg-empty">
            (empty — no promoted evals yet)
          </div>
        </div>
      </div>

    </div>

    <div style="margin-top: 16px;">
      <button class="btn btn-ghost" id="c06-reset" style="display:none;">↺ Reset</button>
    </div>

    <div class="passk-callout" id="c06-note" style="margin-top: 14px; display:none;"></div>
  `;

  // Build the maze card HTML (grid + badge)
  function buildMazeCard(badgeClass, badgeText, extraNote) {
    const world = new GridWorld('hard');
    const gridDiv = document.createElement('div');
    renderGrid(gridDiv, world);

    const card = document.createElement('div');
    card.className = `maze-card${badgeClass === 'badge-pass' ? ' promoted' : ''}`;
    card.innerHTML = `
      <div class="maze-card-title" style="margin-bottom:8px;">
        <span class="mono" style="font-size:12px;">maze_hard</span>
        &nbsp;
        <span class="badge ${badgeClass}">${badgeText}</span>
      </div>
    `;
    card.appendChild(gridDiv);
    if (extraNote) {
      const note = document.createElement('div');
      note.className = 'lock-note';
      note.style.marginTop = '10px';
      note.innerHTML = `🔒 ${extraNote}`;
      card.appendChild(note);
    }
    return card;
  }

  const capSlot    = card.querySelector('#c06-cap-slot');
  const regSlot    = card.querySelector('#c06-reg-slot');
  const improveBtn = card.querySelector('#c06-improve');
  const promoteBtn = card.querySelector('#c06-promote');
  const resetBtn   = card.querySelector('#c06-reset');
  const noteEl     = card.querySelector('#c06-note');

  function renderState() {
    // Clear slots
    capSlot.innerHTML = '';
    regSlot.innerHTML = '';

    if (state === 'failing') {
      capSlot.appendChild(buildMazeCard('badge-fail', '✗  FAIL', null));
      improveBtn.disabled = false;
      promoteBtn.disabled = true;
      resetBtn.style.display = 'none';
      noteEl.style.display = 'none';

    } else if (state === 'passing') {
      capSlot.appendChild(buildMazeCard('badge-pass', '✓  PASS', null));
      improveBtn.disabled = true;
      promoteBtn.disabled = false;
      resetBtn.style.display = '';
      noteEl.style.display = '';
      noteEl.textContent = 'Agent improved. Now promote this to the regression suite — it must always pass from here on.';

    } else if (state === 'promoted') {
      // Capability is empty
      const empty = document.createElement('div');
      empty.style.cssText = 'font-family:var(--font-mono);font-size:12px;color:var(--muted);padding:16px 0;';
      empty.textContent = '(eval promoted to regression)';
      capSlot.appendChild(empty);

      // Regression has the card with lock
      regSlot.appendChild(buildMazeCard('badge-pass', '✓  PASS', 'This must always pass'));

      improveBtn.disabled = true;
      promoteBtn.disabled = true;
      resetBtn.style.display = '';
      noteEl.style.display = '';
      noteEl.textContent =
        'maze_hard is now a regression eval. Every future agent version must pass it. ' +
        'If it fails, you have regressed.';
    }
  }

  // Improve: swap to RuleBasedAgent result (always passes)
  improveBtn.addEventListener('click', () => {
    improveBtn.disabled = true;
    improveBtn.textContent = 'Improving…';

    // Small delay for effect
    setTimeout(() => {
      state = 'passing';
      improveBtn.textContent = 'Improve agent';
      renderState();
    }, 500);
  });

  // Promote: animate card from capability → regression column
  promoteBtn.addEventListener('click', () => {
    const capCard = capSlot.firstElementChild;
    if (!capCard) return;

    // Fade out, then transition state
    capCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    capCard.style.opacity = '0';
    capCard.style.transform = 'translateX(20px)';

    setTimeout(() => {
      state = 'promoted';
      renderState();
    }, 320);
  });

  // Reset
  resetBtn.addEventListener('click', () => {
    state = 'failing';
    renderState();
  });

  // Initial render
  renderState();
}

/* ═══════════════════════════════════════════════════════════
   Bootstrap — init all components on DOMContentLoaded
═══════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initC01();
  initC02();
  initC03();
  initC04();
  initC05();
  initC06();
});
