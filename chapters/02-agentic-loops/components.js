/* ═══════════════════════════════════════════════════════════
   components.js — Chapter 02: Feedback Loops
   5 interactive components. No external dependencies.
═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────
   01 — The one-shot trap
   Toggle between "clean" pipeline view and "with gaps" view.
   Assumption badges appear between nodes, showing compounding
   unverified state.
─────────────────────────────────────────────────────────── */
function initC01() {
  const card = document.getElementById('component-01');
  if (!card) return;

  card.innerHTML = `
    <div class="pipeline-wrap">
      <div class="pipeline-toggle-row">
        <button class="toggle-btn active" id="c01-clean">Clean view</button>
        <button class="toggle-btn" id="c01-gaps">With gaps</button>
      </div>
      <div class="pipeline-diagram" id="c01-diagram">
        <!-- nodes injected below -->
      </div>
      <p class="mono muted" id="c01-caption" style="font-size:12px; line-height:1.6; transition: opacity 0.3s ease; opacity:0; min-height: 36px;"></p>
    </div>
  `;

  const diagramEl  = card.querySelector('#c01-diagram');
  const cleanBtn   = card.querySelector('#c01-clean');
  const gapsBtn    = card.querySelector('#c01-gaps');
  const captionEl  = card.querySelector('#c01-caption');

  const nodes = [
    { label: 'Input', sub: 'user prompt' },
    { label: 'Parse', sub: 'intent extraction' },
    { label: 'Retrieve', sub: 'context lookup' },
    { label: 'Generate', sub: 'LLM call' },
    { label: 'Output', sub: 'response' },
  ];

  const assumptions = [
    { text: 'assumes intent\nwas clear', cls: 'a1' },
    { text: 'assumes docs\nare current', cls: 'a2' },
    { text: 'assumes context\nis sufficient', cls: 'a1' },
    { text: 'assumes output\nwas correct', cls: 'a2' },
  ];

  const captions = {
    clean: 'Looks fine. Four steps, clean arrows. Ship it.',
    gaps: 'Each connector is an unverified assumption. They compound — a wrong intent means wrong retrieval means wrong generation. The pipeline never knew.',
  };

  /* Column widths — must match between pipeline row and badge row */
  const NODE_W = 88;
  const CONN_W = 48;

  function render(showGaps) {
    diagramEl.innerHTML = '';

    /* ── Row 1: pipeline nodes + arrows ── */
    const pipeRow = document.createElement('div');
    pipeRow.style.cssText = 'display:flex; align-items:center; overflow-x:auto; padding-bottom:2px;';

    nodes.forEach((node, i) => {
      const nodeEl = document.createElement('div');
      nodeEl.style.cssText = `flex:0 0 ${NODE_W}px; text-align:center; padding:10px 6px; border:1px solid var(--border); border-radius:6px; background:var(--surface);`;
      nodeEl.innerHTML = `
        <div style="font-family:var(--font-mono);font-size:12px;font-weight:500;color:var(--text)">${node.label}</div>
        <div style="font-family:var(--font-mono);font-size:10px;color:var(--muted);margin-top:3px">${node.sub}</div>
      `;
      pipeRow.appendChild(nodeEl);

      if (i < nodes.length - 1) {
        const arrEl = document.createElement('div');
        arrEl.style.cssText = `flex:0 0 ${CONN_W}px; text-align:center; font-size:16px; color:var(--muted);`;
        arrEl.textContent = '→';
        pipeRow.appendChild(arrEl);
      }
    });
    diagramEl.appendChild(pipeRow);

    /* ── Row 2: assumption badges (only in gaps mode) ── */
    if (showGaps) {
      const badgeRow = document.createElement('div');
      badgeRow.style.cssText = 'display:flex; align-items:flex-start; margin-top:2px; overflow-x:auto;';

      nodes.forEach((node, i) => {
        /* Spacer under each node */
        const spacer = document.createElement('div');
        spacer.style.cssText = `flex:0 0 ${NODE_W}px;`;
        badgeRow.appendChild(spacer);

        if (i < nodes.length - 1) {
          const badgeWrap = document.createElement('div');
          badgeWrap.style.cssText = `flex:0 0 ${CONN_W}px; display:flex; flex-direction:column; align-items:center; gap:4px;`;
          const badge = assumptions[i];
          badgeWrap.innerHTML = `
            <div style="width:1px; height:4px; background:var(--border);"></div>
            <div class="assumption-badge ${badge.cls}" style="opacity:0; transform:translateY(4px); transition:opacity 0.2s ease ${i * 0.07}s, transform 0.2s ease ${i * 0.07}s; white-space:nowrap;">
              ${badge.text.replace('\n', '<br>')}
            </div>
          `;
          badgeRow.appendChild(badgeWrap);
          /* Trigger animation next frame */
          requestAnimationFrame(() => {
            const b = badgeWrap.querySelector('.assumption-badge');
            if (b) { b.style.opacity = '1'; b.style.transform = 'translateY(0)'; }
          });
        }
      });
      diagramEl.appendChild(badgeRow);
    }

    captionEl.style.opacity = '0';
    setTimeout(() => {
      captionEl.textContent = captions[showGaps ? 'gaps' : 'clean'];
      captionEl.style.opacity = '1';
    }, 100);
  }

  cleanBtn.addEventListener('click', () => {
    cleanBtn.classList.add('active');
    gapsBtn.classList.remove('active');
    render(false);
  });

  gapsBtn.addEventListener('click', () => {
    gapsBtn.classList.add('active');
    cleanBtn.classList.remove('active');
    render(true);
  });

  render(false);
}

/* ───────────────────────────────────────────────────────────
   02 — What a feedback loop actually is
   Three-tab selector: Retry / Human Review / Evaluator Judge.
   Each tab shows trigger, signal, what changes.
─────────────────────────────────────────────────────────── */
function initC02() {
  const card = document.getElementById('component-02');
  if (!card) return;

  const tabs = [
    {
      id: 'retry',
      label: 'Retry',
      trigger: 'An error is thrown, or output is empty / malformed',
      signal: 'The error message — rarely the actual failure mode',
      changes: 'The prompt is re-sent, usually unchanged',
      verdict: 'Retry is sampling variance, not iteration. You get a different output, not a better-informed one.',
      verdictCls: 'retry',
    },
    {
      id: 'human',
      label: 'Human review',
      trigger: 'A person reviews the output and decides it\'s wrong',
      signal: 'Natural language critique — high nuance, low scalability',
      changes: 'The prompt is revised with the human\'s feedback incorporated',
      verdict: 'Human review is iteration — but it bottlenecks at human bandwidth. Doesn\'t scale past ~100 runs.',
      verdictCls: 'human',
    },
    {
      id: 'eval',
      label: 'Evaluator judge',
      trigger: 'A separate model (or code) grades output against a rubric',
      signal: 'Structured critique: which criteria failed and why',
      changes: 'The next generation receives the rubric, the output, and the delta — not just "try again"',
      verdict: 'Evaluator-as-judge is the only pattern that scales. The signal is explicit, the delta is articulated, the loop is closed.',
      verdictCls: 'eval',
    },
  ];

  card.innerHTML = `
    <div class="tabs-row" id="c02-tabs">
      ${tabs.map((t, i) => `<button class="tab-btn${i === 0 ? ' active' : ''}" data-tab="${t.id}">${t.label}</button>`).join('')}
    </div>
    <div id="c02-content"></div>
  `;

  const tabsRow   = card.querySelector('#c02-tabs');
  const contentEl = card.querySelector('#c02-content');

  function renderTab(tabId) {
    const tab = tabs.find(t => t.id === tabId);
    contentEl.innerHTML = `
      <div class="tab-content active">
        <div class="feedback-grid">
          <div class="feedback-cell">
            <div class="feedback-cell-label">Trigger</div>
            <div class="feedback-cell-value">${tab.trigger}</div>
          </div>
          <div class="feedback-cell">
            <div class="feedback-cell-label">Signal fed back</div>
            <div class="feedback-cell-value">${tab.signal}</div>
          </div>
          <div class="feedback-cell">
            <div class="feedback-cell-label">What changes</div>
            <div class="feedback-cell-value">${tab.changes}</div>
          </div>
        </div>
        <div class="feedback-verdict ${tab.verdictCls}">${tab.verdict}</div>
      </div>
    `;
  }

  tabsRow.addEventListener('click', (e) => {
    const btn = e.target.closest('.tab-btn');
    if (!btn) return;
    tabsRow.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderTab(btn.dataset.tab);
  });

  renderTab('retry');
}

/* ───────────────────────────────────────────────────────────
   03 — The iteration cycle
   SVG with 4 nodes: Generate (circle, teal), Evaluate (circle,
   blue), Delta (diamond, amber), Steer (circle, muted).
   User steps through nodes; context panel accumulates.
   Sub-agent branches appear on iteration 2.
─────────────────────────────────────────────────────────── */
function initC03() {
  const card = document.getElementById('component-03');
  if (!card) return;

  /* State */
  let step = 0;   /* 0 = idle, 1–4 = node active, cycles */
  let iteration = 1;

  /* Steps definition: which node is active, what to add to context */
  const steps = [
    /* Iteration 1 */
    {
      node: 'generate',
      iter: 1,
      label: 'Generate — pass 1',
      entry: null,
    },
    {
      node: 'evaluate',
      iter: 1,
      label: 'Evaluate — pass 1',
      entry: { cls: 'eval', text: 'eval: "output missing edge case handling; confidence 0.62"' },
    },
    {
      node: 'delta',
      iter: 1,
      label: 'Delta — pass 1',
      entry: { cls: 'delta', text: 'delta: "edge case for null input unhandled; retry with explicit constraint"' },
    },
    {
      node: 'steer',
      iter: 1,
      label: 'Steer — pass 1',
      entry: { cls: 'steer', text: 'steer: constraint added → "always handle null input explicitly"' },
    },
    /* Iteration 2 */
    {
      node: 'generate',
      iter: 2,
      label: 'Generate — pass 2 (parallel)',
      entry: null,
    },
    {
      node: 'evaluate',
      iter: 2,
      label: 'Evaluate — pass 2',
      entry: { cls: 'eval', text: 'eval: "null case handled; edge case coverage 0.91; PASS"' },
    },
    {
      node: 'delta',
      iter: 2,
      label: 'Delta — pass 2',
      entry: { cls: 'delta', text: 'delta: "quality target met; no new failures introduced"' },
    },
    {
      node: 'steer',
      iter: 2,
      label: 'Steer — pass 2',
      entry: { cls: 'steer', text: 'steer: convergence criteria met → loop terminates' },
    },
  ];

  const nodeColors = {
    generate: 'var(--teal)',
    evaluate: 'var(--blue)',
    delta:    'var(--amber)',
    steer:    'var(--muted)',
  };

  card.innerHTML = `
    <div class="cycle-wrap">
      <div class="cycle-diagram-area">
        <svg id="cycle-svg" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--border)" id="arrow-fill" />
            </marker>
            <marker id="arrowhead-active" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" fill="var(--blue)" />
            </marker>
          </defs>

          <!-- Arrows -->
          <path id="arr-gen-eval" d="M 195 90 Q 230 150 195 210" class="cycle-arrow" />
          <path id="arr-eval-delt" d="M 150 225 L 105 225" class="cycle-arrow" />
          <path id="arr-delt-steer" d="M 65 195 Q 50 150 65 105" class="cycle-arrow" />
          <path id="arr-steer-gen" d="M 105 75 L 150 75" class="cycle-arrow" />

          <!-- Sub-agent branches (hidden until iter 2) -->
          <g class="subagent-branch" id="subagent-branches">
            <line x1="185" y1="80" x2="215" y2="52" stroke="var(--teal)" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
            <line x1="195" y1="90" x2="232" y2="78" stroke="var(--teal)" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
            <line x1="195" y1="100" x2="228" y2="110" stroke="var(--teal)" stroke-width="1" stroke-dasharray="3,2" opacity="0.6"/>
            <circle cx="220" cy="48" r="10" fill="var(--teal-dim)" stroke="var(--teal)" stroke-width="1" />
            <text x="220" y="48" class="cycle-node-label" style="font-size:8px; fill:var(--teal)">A</text>
            <circle cx="238" cy="74" r="10" fill="var(--teal-dim)" stroke="var(--teal)" stroke-width="1" />
            <text x="238" y="74" class="cycle-node-label" style="font-size:8px; fill:var(--teal)">B</text>
            <circle cx="234" cy="114" r="10" fill="var(--teal-dim)" stroke="var(--teal)" stroke-width="1" />
            <text x="234" y="114" class="cycle-node-label" style="font-size:8px; fill:var(--teal)">C</text>
            <text x="245" y="82" class="cycle-node-sublabel" style="opacity:1; font-size:8px; fill:var(--muted)">parallel</text>
          </g>

          <!-- Node: Generate (top-right, circle, teal) -->
          <circle id="node-generate" cx="175" cy="90" r="34" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5" class="cycle-node-circle" />
          <text x="175" y="86" class="cycle-node-label">Generate</text>
          <text x="175" y="98" class="cycle-node-sublabel" id="sub-generate">sub-agents</text>

          <!-- Node: Evaluate (bottom-right, circle, blue) -->
          <circle id="node-evaluate" cx="175" cy="215" r="34" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5" class="cycle-node-circle" />
          <text x="175" y="211" class="cycle-node-label">Evaluate</text>
          <text x="175" y="223" class="cycle-node-sublabel" id="sub-evaluate">rubric</text>

          <!-- Node: Delta (bottom-left, diamond, amber) -->
          <polygon id="node-delta" points="80,225 104,202 128,225 104,248" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5" class="cycle-node-diamond" />
          <text x="104" y="224" class="cycle-node-label">Delta</text>

          <!-- Node: Steer (top-left, circle, muted) -->
          <circle id="node-steer" cx="80" cy="90" r="34" fill="var(--surface)" stroke="var(--border)" stroke-width="1.5" class="cycle-node-circle" />
          <text x="80" y="90" class="cycle-node-label">Steer</text>
        </svg>

        <div class="cycle-controls">
          <button class="btn btn-primary" id="c03-next">Next →</button>
          <button class="btn btn-ghost" id="c03-reset">Reset</button>
          <span class="active-node-label" id="c03-active-label">idle</span>
        </div>
        <div class="mono muted" id="c03-iter-label" style="font-size:11px; min-height:16px;"></div>
      </div>

      <div>
        <div class="context-panel">
          <div class="context-panel-header">Context window</div>
          <div class="context-entries" id="c03-context">
            <span class="context-empty">Nothing yet — step through the cycle.</span>
          </div>
        </div>
      </div>
    </div>
  `;

  const nextBtn      = card.querySelector('#c03-next');
  const resetBtn     = card.querySelector('#c03-reset');
  const activeLbl    = card.querySelector('#c03-active-label');
  const iterLbl      = card.querySelector('#c03-iter-label');
  const contextEl    = card.querySelector('#c03-context');
  const subBranches  = card.querySelector('#subagent-branches');
  const subGenLabel  = card.querySelector('#sub-generate');

  const nodeEls = {
    generate: card.querySelector('#node-generate'),
    evaluate: card.querySelector('#node-evaluate'),
    delta:    card.querySelector('#node-delta'),
    steer:    card.querySelector('#node-steer'),
  };

  const contextEntries = [
    { cls: 'task', text: 'task: "generate a function that handles user input validation"' },
  ];

  function clearNodeHighlights() {
    Object.entries(nodeEls).forEach(([name, el]) => {
      el.setAttribute('fill', 'var(--surface)');
      el.setAttribute('stroke', 'var(--border)');
      el.setAttribute('stroke-width', '1.5');
    });
    card.querySelectorAll('.cycle-node-label').forEach(l => l.setAttribute('fill', 'var(--muted)'));
    card.querySelectorAll('.cycle-node-sublabel').forEach(l => { l.style.opacity = '0'; });
  }

  function highlightNode(name) {
    clearNodeHighlights();
    const el = nodeEls[name];
    const color = nodeColors[name];
    el.setAttribute('fill', `rgba(${colorToRgb(name)}, 0.1)`);
    el.setAttribute('stroke', color);
    el.setAttribute('stroke-width', '2');
    /* label color */
    const labelEl = card.querySelector(`#node-${name}`).nextElementSibling;
    if (labelEl && labelEl.classList.contains('cycle-node-label')) {
      labelEl.setAttribute('fill', color);
    }
    /* sub-label */
    const subEl = card.querySelector(`#sub-${name}`);
    if (subEl) { subEl.style.opacity = '1'; subEl.setAttribute('fill', color); }
  }

  function colorToRgb(name) {
    const map = { generate: '45,212,191', evaluate: '79,142,247', delta: '245,158,11', steer: '100,116,139' };
    return map[name] || '100,116,139';
  }

  function renderContext() {
    if (contextEntries.length === 0) {
      contextEl.innerHTML = '<span class="context-empty">Nothing yet — step through the cycle.</span>';
      return;
    }
    contextEl.innerHTML = contextEntries.map(e => `<div class="context-entry ${e.cls}">${e.text}</div>`).join('');
  }

  function applyStep(s) {
    const def = steps[s];
    highlightNode(def.node);
    activeLbl.textContent = def.label;
    iterLbl.textContent = `iteration ${def.iter}`;

    if (def.entry) {
      contextEntries.push(def.entry);
      renderContext();
    }

    if (def.iter === 2 && def.node === 'generate') {
      subBranches.classList.add('visible');
      if (subGenLabel) {
        subGenLabel.style.opacity = '1';
        subGenLabel.setAttribute('fill', 'var(--teal)');
      }
    }
  }

  nextBtn.addEventListener('click', () => {
    if (step >= steps.length) {
      /* done — show complete */
      clearNodeHighlights();
      activeLbl.textContent = 'loop complete ✓';
      iterLbl.textContent = '2 iterations · converged';
      nextBtn.disabled = true;
      return;
    }
    applyStep(step);
    step++;
  });

  resetBtn.addEventListener('click', () => {
    step = 0;
    clearNodeHighlights();
    activeLbl.textContent = 'idle';
    iterLbl.textContent = '';
    subBranches.classList.remove('visible');
    nextBtn.disabled = false;
    /* Reset context to just the task */
    contextEntries.length = 0;
    contextEntries.push({ cls: 'task', text: 'task: "generate a function that handles user input validation"' });
    renderContext();
  });

  renderContext();
}

/* ───────────────────────────────────────────────────────────
   04 — The stopping problem
   Range slider (1–5). Drives loop simulation with convergence
   state and cost meter.
─────────────────────────────────────────────────────────── */
function initC04() {
  const card = document.getElementById('component-04');
  if (!card) return;

  card.innerHTML = `
    <div class="stopping-wrap">
      <div class="threshold-row">
        <span class="threshold-label">Quality target</span>
        <input type="range" class="threshold-slider" id="c04-slider" min="1" max="5" step="1" value="2" />
        <span class="threshold-value" id="c04-val">2</span>
      </div>

      <div class="loop-viz" id="c04-loop"></div>

      <div id="c04-verdict" class="stopping-verdict converged"></div>

      <div class="cost-meter">
        <div class="cost-item">
          <span class="cost-item-label">Iterations</span>
          <span class="cost-item-value" id="c04-iters">—</span>
        </div>
        <div class="cost-item">
          <span class="cost-item-label">Compute units</span>
          <span class="cost-item-value" id="c04-cost">—</span>
        </div>
        <div class="cost-item">
          <span class="cost-item-label">Status</span>
          <span class="cost-item-value" id="c04-status" style="font-size:13px">—</span>
        </div>
      </div>
    </div>
  `;

  const slider    = card.querySelector('#c04-slider');
  const valEl     = card.querySelector('#c04-val');
  const loopEl    = card.querySelector('#c04-loop');
  const verdictEl = card.querySelector('#c04-verdict');
  const itersEl   = card.querySelector('#c04-iters');
  const costEl    = card.querySelector('#c04-cost');
  const statusEl  = card.querySelector('#c04-status');

  /* Scores per iteration — fixed simulation */
  const iterScores = [0.42, 0.61, 0.74, 0.83, 0.89, 0.91, 0.92];
  const maxIters = 6;

  const thresholdConfig = {
    1: { iters: 1, verdict: 'converged',   msg: 'Converged in 1 iteration. Low bar — output is barely acceptable.' },
    2: { iters: 2, verdict: 'converged',   msg: 'Converged in 2 iterations. Reasonable target for most tasks.' },
    3: { iters: 4, verdict: 'diminishing', msg: 'Converged in 4 iterations, but gains 3→4 were marginal. Watch your costs.' },
    4: { iters: 6, verdict: 'diminishing', msg: 'Converged at iteration 6. Diminishing returns kicked in at iteration 4.' },
    5: { iters: maxIters, verdict: 'runaway', msg: 'Max iterations reached — quality target not met. Loop terminated without convergence.' },
  };

  function update(val) {
    valEl.textContent = val;
    const cfg = thresholdConfig[val];
    const targetScore = [0, 0.5, 0.65, 0.80, 0.88, 0.95][val];

    /* Render loop rows */
    loopEl.innerHTML = '';
    const showIters = cfg.verdict === 'runaway' ? maxIters : cfg.iters;
    for (let i = 0; i < showIters; i++) {
      const score = iterScores[i] || 0;
      const barWidth = Math.round(score * 180);
      const passed = score >= targetScore;
      const row = document.createElement('div');
      row.className = 'loop-iter-row';
      row.innerHTML = `
        <span class="loop-iter-num">iter ${i + 1}</span>
        <div class="loop-iter-bar" style="width:${barWidth}px; border-color:${passed ? 'var(--green)' : 'var(--blue)'}; background:${passed ? 'var(--green-dim)' : 'var(--blue-dim)'}"></div>
        <span class="loop-iter-score">${(score * 100).toFixed(0)}%</span>
        ${passed && cfg.verdict !== 'runaway' && i === showIters - 1 ? '<span class="mono" style="color:var(--green);font-size:11px"> ✓</span>' : ''}
      `;
      loopEl.appendChild(row);
    }

    /* Target line annotation */
    const targetRow = document.createElement('div');
    targetRow.style.cssText = 'display:flex;align-items:center;gap:10px;margin-top:4px;padding-top:8px;border-top:1px dashed var(--border)';
    targetRow.innerHTML = `<span class="mono muted" style="font-size:11px;min-width:72px">target</span><span class="mono" style="font-size:11px;color:var(--muted)">${Math.round(targetScore * 100)}% quality threshold</span>`;
    loopEl.appendChild(targetRow);

    /* Verdict */
    verdictEl.className = `stopping-verdict ${cfg.verdict}`;
    verdictEl.textContent = cfg.msg;

    /* Meters */
    itersEl.textContent = showIters;
    costEl.textContent  = showIters * 12 + ' cu';
    itersEl.style.color = cfg.verdict === 'runaway' ? 'var(--red)' : cfg.verdict === 'diminishing' ? 'var(--amber)' : 'var(--green)';
    costEl.style.color  = itersEl.style.color;
    statusEl.textContent = cfg.verdict === 'runaway' ? 'no convergence' : cfg.verdict === 'diminishing' ? 'diminishing returns' : 'converged';
    statusEl.style.color = itersEl.style.color;
  }

  slider.addEventListener('input', () => update(parseInt(slider.value, 10)));
  update(2);
}

/* ───────────────────────────────────────────────────────────
   05 — Zoom out
   Two-panel: left = mini iteration cycle, right = sub-agents.
   "Zoom into Generate" button expands right panel to show
   where parallelism lives inside the loop.
─────────────────────────────────────────────────────────── */
function initC05() {
  const card = document.getElementById('component-05');
  if (!card) return;

  let zoomed = false;

  card.innerHTML = `
    <div class="zoom-wrap">
      <div class="zoom-panels">
        <div class="zoom-panel">
          <div class="zoom-panel-title">The iteration cycle (temporal)</div>
          <div class="mini-cycle">
            <div class="mini-node gen">Generate</div>
            <div class="mini-arrow">→</div>
            <div class="mini-node eval">Evaluate</div>
            <div class="mini-arrow">→</div>
            <div class="mini-node delt">Delta</div>
            <div class="mini-arrow">→</div>
            <div class="mini-node steer">Steer</div>
            <div class="mini-arrow" style="color:var(--teal)">↺</div>
          </div>
          <div class="mono muted" style="font-size:11px; margin-top:12px; line-height:1.5">
            Governs what happens <em>across</em> time.<br>Memory of past attempts.
          </div>
        </div>

        <div class="zoom-panel" id="c05-right-panel">
          <div class="zoom-panel-title" id="c05-right-title">Parallel sub-agents (spatial)</div>
          <div id="c05-right-content">
            <div class="subagent-grid">
              <div class="subagent-tile active">Agent A</div>
              <div class="subagent-tile active">Agent B</div>
              <div class="subagent-tile active">Agent C</div>
              <div class="subagent-tile">—</div>
              <div class="subagent-tile">—</div>
              <div class="subagent-tile">—</div>
            </div>
            <div class="mono muted" style="font-size:11px; margin-top:12px; line-height:1.5">
              Governs what happens <em>within</em> a single step.<br>Breadth, not depth.
            </div>
          </div>
        </div>
      </div>

      <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
        <button class="btn btn-secondary" id="c05-zoom">Zoom into Generate →</button>
        <span class="mono muted" id="c05-hint" style="font-size:11px">See where sub-agents live inside the loop</span>
      </div>

      <div class="zoom-expanded-view" id="c05-expanded">
        <div class="zoom-note">
          <strong>Generate</strong> is where sub-agents run. The iteration cycle orchestrates Generate across passes — each pass, Generate can spawn N parallel agents, collect their outputs, and return the best to Evaluate. Parallelism is a property of one phase. The feedback loop governs all four.
        </div>
      </div>
    </div>
  `;

  const zoomBtn     = card.querySelector('#c05-zoom');
  const rightPanel  = card.querySelector('#c05-right-panel');
  const rightTitle  = card.querySelector('#c05-right-title');
  const rightContent= card.querySelector('#c05-right-content');
  const expandedEl  = card.querySelector('#c05-expanded');
  const hintEl      = card.querySelector('#c05-hint');

  zoomBtn.addEventListener('click', () => {
    zoomed = !zoomed;

    if (zoomed) {
      rightPanel.classList.add('highlighted');
      rightTitle.textContent = 'Inside Generate';
      rightContent.innerHTML = `
        <div style="border:1px solid var(--teal); border-radius:6px; padding:12px; background:var(--teal-dim);">
          <div class="mono" style="font-size:11px; color:var(--teal); margin-bottom:8px;">Generate (one pass)</div>
          <div class="subagent-grid">
            <div class="subagent-tile active">Agent A<br><span style="font-size:9px;opacity:0.7">angle 1</span></div>
            <div class="subagent-tile active">Agent B<br><span style="font-size:9px;opacity:0.7">angle 2</span></div>
            <div class="subagent-tile active">Agent C<br><span style="font-size:9px;opacity:0.7">angle 3</span></div>
          </div>
          <div class="mono muted" style="font-size:10px; margin-top:8px;">↓ best output passes to Evaluate</div>
        </div>
      `;
      expandedEl.classList.add('visible');
      zoomBtn.textContent = '← Zoom out';
      hintEl.textContent = '';
    } else {
      rightPanel.classList.remove('highlighted');
      rightTitle.textContent = 'Parallel sub-agents (spatial)';
      rightContent.innerHTML = `
        <div class="subagent-grid">
          <div class="subagent-tile active">Agent A</div>
          <div class="subagent-tile active">Agent B</div>
          <div class="subagent-tile active">Agent C</div>
          <div class="subagent-tile">—</div>
          <div class="subagent-tile">—</div>
          <div class="subagent-tile">—</div>
        </div>
        <div class="mono muted" style="font-size:11px; margin-top:12px; line-height:1.5">
          Governs what happens <em>within</em> a single step.<br>Breadth, not depth.
        </div>
      `;
      expandedEl.classList.remove('visible');
      zoomBtn.textContent = 'Zoom into Generate →';
      hintEl.textContent = 'See where sub-agents live inside the loop';
    }
  });
}

/* ── Bootstrap ── */
document.addEventListener('DOMContentLoaded', () => {
  initC01();
  initC02();
  initC03();
  initC04();
  initC05();
});
