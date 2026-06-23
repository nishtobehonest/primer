/* ═══════════════════════════════════════════════════════════
   world.js — Grid world, agent simulation, trace, grader
   No dependencies. Exposes window.WorldLib.
═══════════════════════════════════════════════════════════ */

// ─── Cell types ───────────────────────────────────────────
const CELL = {
  WALL:   'wall',
  EMPTY:  'empty',
  GOAL:   'goal',
  HAZARD: 'hazard',
};

// ─── Preset maze layouts ──────────────────────────────────
// '#' wall  '.' empty  'G' goal  'X' hazard  '@' agent start
const MAZES = {
  simple: [
    '#####',
    '#@..#',
    '#..G#',
    '#####',
  ],
  medium: [
    '#######',
    '#@....#',
    '#.###.#',
    '#.#G..#',
    '#.....#',
    '#######',
  ],
  hard: [
    '#########',
    '#@..#...#',
    '#.#.#.#.#',
    '#.#...#.#',
    '#.#####.#',
    '#.......#',
    '#.###.#.#',
    '#...#.#G#',
    '#########',
  ],
  trap: [
    '#######',
    '#@....#',
    '#.###.#',
    '#.#X..#',
    '#.#.#.#',
    '#...#G#',
    '#######',
  ],
  // Tighter maze for pass@k demos — hard enough that Random fails ~70% of trials
  passk: [
    '#######',
    '#@.#..#',
    '#.##..#',
    '#....##',
    '##.#..#',
    '#..#.G#',
    '#######',
  ],
};

// ─── Parse a maze string array into a usable grid ─────────
function parseMaze(lines) {
  const grid = [];
  let agentStart = null;
  let goal = null;

  for (let r = 0; r < lines.length; r++) {
    const row = [];
    for (let c = 0; c < lines[r].length; c++) {
      const ch = lines[r][c];
      if (ch === '#')      { row.push(CELL.WALL); }
      else if (ch === 'G') { row.push(CELL.GOAL);   goal = { r, c }; }
      else if (ch === 'X') { row.push(CELL.HAZARD); }
      else if (ch === '@') { row.push(CELL.EMPTY);  agentStart = { r, c }; }
      else                 { row.push(CELL.EMPTY); }
    }
    grid.push(row);
  }

  return { grid, agentStart, goal, rows: lines.length, cols: lines[0].length };
}

// ─── GridWorld ────────────────────────────────────────────
class GridWorld {
  constructor(mazeKey = 'simple') {
    this.mazeKey = mazeKey;
    this._init();
  }

  _init() {
    const parsed = parseMaze(MAZES[this.mazeKey]);
    this.grid     = parsed.grid;
    this.start    = parsed.agentStart;
    this.goal     = parsed.goal;
    this.rows     = parsed.rows;
    this.cols     = parsed.cols;
    this.agentPos = { ...this.start };
    this.done     = false;
    this.tick     = 0;
  }

  reset() { this._init(); }

  getCellType(r, c) {
    if (r < 0 || r >= this.rows || c < 0 || c >= this.cols) return CELL.WALL;
    return this.grid[r][c];
  }

  getValidActions() {
    if (this.done) return [];
    const { r, c } = this.agentPos;
    return [
      { action: 'up',    dr: -1, dc:  0 },
      { action: 'down',  dr:  1, dc:  0 },
      { action: 'left',  dr:  0, dc: -1 },
      { action: 'right', dr:  0, dc:  1 },
    ]
      .filter(({ dr, dc }) => this.getCellType(r + dr, c + dc) !== CELL.WALL)
      .map(({ action }) => action);
  }

  step(action) {
    if (this.done) return { result: 'done', pos: { ...this.agentPos }, tick: this.tick };

    const moves = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
    const [dr, dc] = moves[action] || [0, 0];
    const nr = this.agentPos.r + dr;
    const nc = this.agentPos.c + dc;

    this.tick++;
    const cellType = this.getCellType(nr, nc);

    if (cellType === CELL.WALL) {
      return { result: 'wall', pos: { ...this.agentPos }, tick: this.tick };
    }

    this.agentPos = { r: nr, c: nc };

    if (cellType === CELL.GOAL)   { this.done = true; return { result: 'goal',   pos: { ...this.agentPos }, tick: this.tick }; }
    if (cellType === CELL.HAZARD) { this.done = true; return { result: 'hazard', pos: { ...this.agentPos }, tick: this.tick }; }

    return { result: 'ok', pos: { ...this.agentPos }, tick: this.tick };
  }

  getState() {
    return { agentPos: { ...this.agentPos }, goal: { ...this.goal }, done: this.done, tick: this.tick };
  }
}

// ─── Grid renderer ────────────────────────────────────────
// Writes CSS Grid cells into container. Call after every step.
function renderGrid(container, world, agentPosOverride = null) {
  const pos = agentPosOverride || world.agentPos;

  container.innerHTML = '';
  container.className = 'grid-world';
  container.style.gridTemplateColumns = `repeat(${world.cols}, var(--cell))`;

  for (let r = 0; r < world.rows; r++) {
    for (let c = 0; c < world.cols; c++) {
      const cell = document.createElement('div');
      cell.className = 'grid-cell';
      cell.dataset.r = r;
      cell.dataset.c = c;

      const isAgent = (pos.r === r && pos.c === c);

      if (isAgent) {
        cell.classList.add('agent');
        cell.textContent = '@';
      } else {
        const t = world.getCellType(r, c);
        cell.classList.add(t);
        if (t === CELL.GOAL)   cell.textContent = 'G';
        if (t === CELL.HAZARD) cell.textContent = 'X';
      }

      container.appendChild(cell);
    }
  }
}

// Flash the goal cell green or red briefly
function flashCell(container, r, c, type) {
  const cell = container.querySelector(`[data-r="${r}"][data-c="${c}"]`);
  if (!cell) return;
  cell.classList.add(type === 'success' ? 'flash-success' : 'flash-fail');
  setTimeout(() => cell.classList.remove('flash-success', 'flash-fail'), 450);
}

// ─── Trace ────────────────────────────────────────────────
class Trace {
  constructor() { this.entries = []; }

  record(tick, action, result) {
    this.entries.push({ tick, action, result });
    return this;
  }

  reset() { this.entries = []; return this; }

  getEntries()   { return [...this.entries]; }
  getLast()      { return this.entries[this.entries.length - 1] || null; }
  get length()   { return this.entries.length; }
}

// Render trace entries into a panel element
function renderTrace(panelEl, trace, maxRows = 10) {
  const entries = trace.getEntries();
  panelEl.innerHTML = '';

  if (entries.length === 0) {
    const placeholder = document.createElement('span');
    placeholder.className = 'muted';
    placeholder.textContent = '// trace starts here';
    panelEl.appendChild(placeholder);
    return;
  }

  const toShow = entries.slice(-maxRows);
  toShow.forEach((entry, i) => {
    const row = document.createElement('div');
    row.className = 'trace-row';

    const resultCls =
      entry.result === 'goal'                        ? 'goal' :
      (entry.result === 'hazard' || entry.result === 'wall') ? 'fail' : '';

    row.innerHTML =
      `<span class="tick">tick ${String(entry.tick).padStart(2, ' ')}</span>` +
      `<span class="action">${entry.action.padEnd(6, ' ')}</span>` +
      `<span class="result ${resultCls}">${entry.result}</span>`;

    // Animate only the newest row
    if (i === toShow.length - 1) row.style.animationDelay = '0ms';

    panelEl.appendChild(row);
  });

  panelEl.scrollTop = panelEl.scrollHeight;
}

// ─── Grader ───────────────────────────────────────────────
function gradeEpisode(trace) {
  const entries = trace.getEntries ? trace.getEntries() : trace;
  const last = entries[entries.length - 1];
  const reachedGoal = last && last.result === 'goal';
  const hitHazard   = last && last.result === 'hazard';
  const walledMoves = entries.filter(e => e.result === 'wall').length;
  const totalSteps  = entries.length;
  const efficiency  = totalSteps > 0 ? +(1 - walledMoves / totalSteps).toFixed(2) : 1;

  return {
    goal_reached: reachedGoal ? 1.0 : 0.0,
    hit_hazard:   hitHazard   ? 1.0 : 0.0,
    wasted_moves: totalSteps > 0 ? +(walledMoves / totalSteps).toFixed(2) : 0,
    efficiency,
    steps: totalSteps,
    pass:  reachedGoal && !hitHazard,
  };
}

// ─── A* pathfinder ────────────────────────────────────────
function astar(world, start, goal) {
  const key = (r, c) => `${r},${c}`;
  const h   = (r, c) => Math.abs(r - goal.r) + Math.abs(c - goal.c);

  const open      = new Map();
  const cameFrom  = new Map();
  const gScore    = new Map();

  const sk = key(start.r, start.c);
  open.set(sk, { r: start.r, c: start.c, f: h(start.r, start.c) });
  gScore.set(sk, 0);

  const dirs = [
    { dr: -1, dc:  0, action: 'up'    },
    { dr:  1, dc:  0, action: 'down'  },
    { dr:  0, dc: -1, action: 'left'  },
    { dr:  0, dc:  1, action: 'right' },
  ];

  let iters = 0;
  while (open.size > 0 && iters++ < 1000) {
    // Pick node with lowest f score
    let bestKey = null, bestF = Infinity;
    for (const [k, node] of open) {
      if (node.f < bestF) { bestF = node.f; bestKey = k; }
    }

    const cur = open.get(bestKey);
    open.delete(bestKey);

    if (cur.r === goal.r && cur.c === goal.c) {
      // Reconstruct action sequence
      const actions = [];
      let k = bestKey;
      while (cameFrom.has(k)) {
        const { parentKey, action } = cameFrom.get(k);
        actions.unshift(action);
        k = parentKey;
      }
      return actions;
    }

    const gCur = gScore.get(bestKey) || 0;

    for (const { dr, dc, action } of dirs) {
      const nr = cur.r + dr;
      const nc = cur.c + dc;
      const ct = world.getCellType(nr, nc);
      if (ct === CELL.WALL || ct === CELL.HAZARD) continue;

      const nk   = key(nr, nc);
      const gNew = gCur + 1;

      if (!gScore.has(nk) || gNew < gScore.get(nk)) {
        gScore.set(nk, gNew);
        open.set(nk, { r: nr, c: nc, f: gNew + h(nr, nc) });
        cameFrom.set(nk, { parentKey: bestKey, action });
      }
    }
  }

  return null; // unreachable goal
}

// ─── Agents ───────────────────────────────────────────────

class RandomAgent {
  constructor() { this.name = 'RandomAgent'; }

  reset() {}

  chooseAction(world) {
    const valid = world.getValidActions();
    if (!valid.length) return 'up';
    return valid[Math.floor(Math.random() * valid.length)];
  }

  // Analytical pass rate for maze that is hard for random walkers
  get perTrialSuccessRate() { return 0.30; }
}

class RuleBasedAgent {
  constructor() { this.name = 'RuleBasedAgent'; this._path = null; this._idx = 0; }

  reset() { this._path = null; this._idx = 0; }

  chooseAction(world) {
    if (!this._path || this._idx >= this._path.length) {
      this._path = astar(world, world.agentPos, world.goal);
      this._idx  = 0;
    }
    if (!this._path || this._path.length === 0) {
      const valid = world.getValidActions();
      return valid[0] || 'up';
    }
    return this._path[this._idx++];
  }

  get perTrialSuccessRate() { return 1.00; }
}

class LLMAgent {
  constructor() {
    this.name = 'LLMAgent';
    // Follows optimal path but ~30% of steps are random (simulates LLM noise)
    this._base      = new RuleBasedAgent();
    this._errorRate = 0.28;
  }

  reset() { this._base.reset(); }

  chooseAction(world) {
    if (Math.random() < this._errorRate) {
      const valid = world.getValidActions();
      return valid[Math.floor(Math.random() * valid.length)] || 'up';
    }
    return this._base.chooseAction(world);
  }

  get perTrialSuccessRate() { return 0.70; }
}

// ─── pass@k formula ──────────────────────────────────────
// Probability of at least one success in k independent trials
function passAtK(p, k) {
  return 1 - Math.pow(1 - p, k);
}

// ─── Run a full episode headlessly ───────────────────────
// Returns a grade object
function runEpisode(world, agent, maxSteps = 80) {
  world.reset();
  if (agent.reset) agent.reset();
  const trace = new Trace();

  for (let i = 0; i < maxSteps; i++) {
    if (world.done) break;
    const action = agent.chooseAction(world);
    const { result, tick } = world.step(action);
    trace.record(tick, action, result);
    if (result === 'goal' || result === 'hazard') break;
  }

  return gradeEpisode(trace);
}

// ─── Expose to global scope ───────────────────────────────
window.WorldLib = {
  CELL,
  MAZES,
  parseMaze,
  GridWorld,
  renderGrid,
  flashCell,
  Trace,
  renderTrace,
  gradeEpisode,
  RandomAgent,
  RuleBasedAgent,
  LLMAgent,
  astar,
  passAtK,
  runEpisode,
};
