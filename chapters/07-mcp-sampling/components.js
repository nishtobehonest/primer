/* ═══════════════════════════════════════════════════════════
   components.js — Chapter 07: MCP Sampling
   6 interactive components + outcomes. No external dependencies.
═══════════════════════════════════════════════════════════ */

/* ───────────────────────────────────────────────────────────
   01 — Who asks whom
   Toggle between a normal tool call (client asks, server
   answers) and a sampling call (server asks, client answers).
─────────────────────────────────────────────────────────── */
function initC01() {
  const card = document.getElementById('component-01');
  if (!card) return;

  let mode = 'normal'; // 'normal' | 'sampling'
  let insightShown = false;

  function render() {
    const isSampling = mode === 'sampling';

    card.innerHTML = `
      <div class="component-setup">
        <strong>Click "Sampling call"</strong> and watch which side starts the conversation.
      </div>

      ${!isSampling ? `
      <div class="flow-row">
        <div class="flow-node client">
          <div class="flow-node-label">Client</div>
          <div class="flow-node-name">your app</div>
        </div>
        <div class="flow-arrow-h">
          <div class="arrow-line">──►</div>
          <div class="arrow-label">"get me this file"</div>
        </div>
        <div class="flow-node server">
          <div class="flow-node-label">Server</div>
          <div class="flow-node-name">MCP server</div>
        </div>
      </div>
      <div class="flow-row" style="margin-top:6px;">
        <div class="flow-node client dim"><div class="flow-node-label">Client</div><div class="flow-node-name">your app</div></div>
        <div class="flow-arrow-h">
          <div class="arrow-line">◄──</div>
          <div class="arrow-label">"here it is"</div>
        </div>
        <div class="flow-node server dim"><div class="flow-node-label">Server</div><div class="flow-node-name">MCP server</div></div>
      </div>
      <p style="font-family:var(--font-mono);font-size:11px;color:var(--muted);margin-top:14px;text-align:center;">
        Client starts it. Server just answers. This is how almost every MCP request works.
      </p>
      ` : `
      <div class="flow-row">
        <div class="flow-node server">
          <div class="flow-node-label">Server</div>
          <div class="flow-node-name">MCP server</div>
        </div>
        <div class="flow-arrow-h reverse">
          <div class="arrow-line">──►</div>
          <div class="arrow-label">"go ask the AI this for me"</div>
        </div>
        <div class="flow-node client">
          <div class="flow-node-label">Client</div>
          <div class="flow-node-name">your app</div>
        </div>
      </div>
      <div class="flow-row" style="margin-top:6px;">
        <div class="flow-node server dim"><div class="flow-node-label">Server</div><div class="flow-node-name">MCP server</div></div>
        <div class="flow-arrow-h" style="opacity:.35;"><div class="arrow-line">◄──</div><div class="arrow-label">answer</div></div>
        <div class="flow-node client"><div class="flow-node-label">Client</div><div class="flow-node-name">your app</div></div>
      </div>
      <div class="flow-row" style="margin-top:6px;">
        <div class="flow-node client dim" style="opacity:.6;"><div class="flow-node-label">Client</div><div class="flow-node-name">your app</div></div>
        <div class="flow-arrow-h"><div class="arrow-line">──►</div><div class="arrow-label">asks</div></div>
        <div class="flow-node llm"><div class="flow-node-label">LLM</div><div class="flow-node-name">the AI model</div></div>
      </div>
      <p style="font-family:var(--font-mono);font-size:11px;color:var(--purple);margin-top:14px;text-align:center;">
        Server starts it. The client has to go get the answer from the AI before it can reply. This is sampling.
      </p>
      `}

      <div class="btn-row" style="justify-content:center;">
        <button class="toggle-btn ${!isSampling ? 'active' : ''}" id="c01-normal">Normal tool call</button>
        <button class="toggle-btn ${isSampling ? 'active purple' : ''}" id="c01-sampling">Sampling call</button>
      </div>

      <div class="key-insight ${isSampling ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          Almost every MCP interaction is client-initiated. Sampling is the one place the server gets to start
          the conversation — and that single difference is why it needs special handling everywhere else in this chapter.
        </div>
      </div>
    `;

    card.querySelector('#c01-normal').onclick = () => { mode = 'normal'; render(); };
    card.querySelector('#c01-sampling').onclick = () => { mode = 'sampling'; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   02 — The sampling handshake
   Step through the 8-step flow from the spec's own sequence
   diagram, including both human-approval checkpoints.
─────────────────────────────────────────────────────────── */
function initC02() {
  const card = document.getElementById('component-02');
  if (!card) return;

  const STEPS = [
    { active: 'server', tag: 'Step 1', desc: 'The server needs the AI\'s help mid-task, so it sends a message called <code>sampling/createMessage</code> to the client.', lane: { server: 'sending: "Classify this ticket."', client: '', user: '', llm: '' } },
    { active: 'client', tag: 'Step 2', desc: 'The client receives the request. Before doing anything else, it has to show it to a human — that\'s a rule, not optional.', lane: { server: '(waiting)', client: 'received — preparing to show you', user: '', llm: '' } },
    { active: 'user', tag: 'Step 3 — approval checkpoint', desc: 'You see the exact question the server wants to ask the AI. You can approve it as-is, edit it, or reject it.', lane: { server: '(waiting)', client: 'showing you the request', user: 'reviewing…', llm: '' } },
    { active: 'user', tag: 'Step 4', desc: 'You approve it. Only now does it move forward.', lane: { server: '(waiting)', client: 'got your approval', user: '✓ approved', llm: '' } },
    { active: 'llm', tag: 'Step 5', desc: 'The client forwards your approved request to the actual AI model.', lane: { server: '(waiting)', client: 'forwarding to the AI', user: '', llm: 'thinking…' } },
    { active: 'llm', tag: 'Step 6', desc: 'The AI model generates an answer and sends it back to the client.', lane: { server: '(waiting)', client: 'got a reply', user: '', llm: '"Billing-related issue."' } },
    { active: 'user', tag: 'Step 7 — approval checkpoint', desc: 'Before the answer goes anywhere, you see it too. Same deal — approve, edit, or reject.', lane: { server: '(waiting)', client: 'showing you the reply', user: 'reviewing…', llm: '' } },
    { active: 'server', tag: 'Step 8', desc: 'You approve the answer. The client sends it back to the server, and the server continues its task with that answer in hand.', lane: { server: 'received: "Billing-related issue."', client: 'delivered', user: '✓ approved', llm: '' } },
  ];

  let step = 0;
  let insightShown = false;

  function render() {
    const s = STEPS[step];
    card.innerHTML = `
      <div class="component-setup">
        <strong>Click "Next step"</strong> to walk through a real sampling request, start to finish.
      </div>

      <div class="c02-progress">
        ${STEPS.map((_, i) => `<div class="c02-dot ${i < step ? 'done' : i === step ? 'current' : ''}"></div>`).join('')}
      </div>

      <div class="c02-lanes">
        <div class="c02-lane ${s.active === 'server' ? 'active' : ''}">
          <div class="c02-lane-head">Server</div>
          <div class="c02-lane-msg">${s.lane.server}</div>
        </div>
        <div class="c02-lane ${s.active === 'client' ? 'active' : ''}">
          <div class="c02-lane-head">Client</div>
          <div class="c02-lane-msg">${s.lane.client}</div>
        </div>
        <div class="c02-lane ${s.active === 'user' ? 'active' : ''}">
          <div class="c02-lane-head">You</div>
          <div class="c02-lane-msg">${s.lane.user}</div>
        </div>
        <div class="c02-lane ${s.active === 'llm' ? 'active' : ''}">
          <div class="c02-lane-head">AI model</div>
          <div class="c02-lane-msg">${s.lane.llm}</div>
        </div>
      </div>

      <div class="c02-step-tag">${s.tag}</div>
      <div class="c02-step-desc">${s.desc}</div>

      <div class="btn-row">
        <button class="btn btn-ghost" id="c02-back" ${step === 0 ? 'disabled' : ''}>← Back</button>
        <button class="btn btn-primary" id="c02-next" ${step === STEPS.length - 1 ? 'disabled' : ''}>Next step →</button>
        <button class="btn btn-ghost" id="c02-reset">Reset</button>
      </div>

      <div class="key-insight ${step === STEPS.length - 1 ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          Two separate human checkpoints, on purpose — one before the request goes to the AI, one before the
          answer goes back to the server. Nothing about this flow happens without a person seeing it first.
        </div>
      </div>
    `;

    card.querySelector('#c02-back').onclick = () => { if (step > 0) { step--; render(); } };
    card.querySelector('#c02-next').onclick = () => { if (step < STEPS.length - 1) { step++; render(); } };
    card.querySelector('#c02-reset').onclick = () => { step = 0; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   03 — Why servers don't hold API keys
   Before/after: naive server (own key) vs sampling server.
─────────────────────────────────────────────────────────── */
function initC03() {
  const card = document.getElementById('component-03');
  if (!card) return;

  let published = false;

  function render() {
    card.innerHTML = `
      <div class="component-setup">
        <strong>Click "Make it public"</strong> and see what changes for each design.
      </div>

      <div class="c03-layout">
        <div class="c03-col bad">
          <div class="c03-col-head">Naive server</div>
          <div class="c03-col-sub">holds its own API key, calls the AI directly</div>
          <div class="c03-row"><span class="c03-icon" style="color:${published ? 'var(--red)' : 'var(--muted)'};">${published ? '✗' : '○'}</span><span>${published ? 'Every stranger\'s request runs on your key and your bill' : 'Works fine — just you, on your machine'}</span></div>
          <div class="c03-row"><span class="c03-icon" style="color:${published ? 'var(--red)' : 'var(--muted)'};">${published ? '✗' : '○'}</span><span>${published ? 'Nobody reviews what gets sent to the AI' : 'No one else is using it yet'}</span></div>
          <div class="c03-row"><span class="c03-icon" style="color:${published ? 'var(--red)' : 'var(--muted)'};">${published ? '✗' : '○'}</span><span>${published ? 'No record of who asked for what' : 'No audit trail needed yet'}</span></div>
        </div>
        <div class="c03-col good">
          <div class="c03-col-head">Sampling server</div>
          <div class="c03-col-sub">holds no key, asks the client to call the AI</div>
          <div class="c03-row"><span class="c03-icon" style="color:var(--green);">✓</span><span>Each user's request runs on their own account, their own cost</span></div>
          <div class="c03-row"><span class="c03-icon" style="color:var(--green);">✓</span><span>A human approves the request before it's sent</span></div>
          <div class="c03-row"><span class="c03-icon" style="color:var(--green);">✓</span><span>Every call is a logged, structured protocol message</span></div>
        </div>
      </div>

      <div class="btn-row" style="justify-content:center;">
        <button class="toggle-btn ${!published ? 'active' : ''}" id="c03-private">Just me, locally</button>
        <button class="toggle-btn ${published ? 'active' : ''}" id="c03-public" style="${published ? 'border-color:rgba(239,68,68,.3);' : ''}">Make it public</button>
      </div>

      <div class="key-insight ${published ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          Holding your own API key inside a server is fine right up until other people start using that server.
          Sampling's whole point is to make "other people are using this" a non-event — the server never becomes the thing paying the bill.
        </div>
      </div>
    `;

    card.querySelector('#c03-private').onclick = () => { published = false; render(); };
    card.querySelector('#c03-public').onclick = () => { published = true; render(); };
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   04 — Transport breaks the pattern
   Pick a transport, see whether the sampling request can be
   delivered at all.
─────────────────────────────────────────────────────────── */
function initC04() {
  const card = document.getElementById('component-04');
  if (!card) return;

  const TRANSPORTS = {
    stdio: {
      name: 'stdio (local)',
      desc: 'Server runs as a local program on your own machine. Talks to the client over an always-open pipe.',
      ok: true,
      result: '✓ delivered',
      note: 'The pipe is open in both directions the whole time — the server can write into it whenever it wants.',
    },
    stateful: {
      name: 'stateful HTTP',
      desc: 'Server is hosted remotely. The client keeps one long-lived connection open, tied to that one client.',
      ok: true,
      result: '✓ delivered',
      note: 'That one open connection is exactly the "always-open line" the server needs to reach back to this client.',
    },
    stateless: {
      name: 'stateless HTTP',
      desc: 'Server is hosted remotely, behind a load balancer that can route any request to any copy of the server.',
      ok: false,
      result: '✗ nowhere to send it',
      note: 'No connection is tied to any one client, so there\'s no open line for the server to push a request through.',
    },
  };

  let active = 'stdio';
  let insightShown = false;

  function render() {
    const t = TRANSPORTS[active];
    if (!t.ok) insightShown = true;

    card.innerHTML = `
      <div class="component-setup">
        <strong>Pick a transport</strong> and watch whether a sampling request can actually reach the client.
      </div>

      <div class="btn-row" style="margin-top:0;">
        ${Object.keys(TRANSPORTS).map(k => `<button class="toggle-btn ${active === k ? (TRANSPORTS[k].ok ? 'active' : 'active') : ''}" id="c04-${k}" style="${active === k && !TRANSPORTS[k].ok ? 'border-color:rgba(239,68,68,.35);color:var(--red);background:var(--red-dim);' : ''}">${TRANSPORTS[k].name}</button>`).join('')}
      </div>

      <div class="c04-rows">
        <div class="c04-transport-row ${t.ok ? 'ok' : 'blocked'}">
          <div class="c04-transport-name">${t.name}</div>
          <div class="c04-transport-desc">${t.desc}</div>
          <div class="c04-transport-result">${t.result}</div>
        </div>
      </div>

      <p style="font-size:12px;color:var(--muted-2);margin-top:12px;line-height:1.6;">${t.note}</p>

      <div class="key-insight ${insightShown ? 'visible' : ''}">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          Sampling isn't just a feature you turn on — it needs the transport underneath it to support the server
          reaching back to the client. Change the transport for scaling reasons, and sampling can silently stop working.
        </div>
      </div>
    `;

    Object.keys(TRANSPORTS).forEach(k => {
      card.querySelector(`#c04-${k}`).onclick = () => { active = k; render(); };
    });
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   05 — Roots and Logging, the siblings
   Three-card comparison of the features deprecated together.
─────────────────────────────────────────────────────────── */
function initC05() {
  const card = document.getElementById('component-05');
  if (!card) return;

  const CARDS = [
    { title: 'Sampling', desc: 'The server asks the client to run something through the AI model, then hands the answer back.', replacement: 'Direct integration with the AI provider\'s own API' },
    { title: 'Roots', desc: 'The client tells the server up front which folders it\'s allowed to look at, so the server doesn\'t need a full file path every time.', replacement: 'Passed as ordinary tool parameters or server config' },
    { title: 'Logging', desc: 'The server sends the client little status updates while it works, so a slow task doesn\'t look frozen.', replacement: 'stderr (local) or OpenTelemetry (hosted)' },
  ];

  card.innerHTML = `
    <div class="component-setup">
      All three of these were deprecated in the same spec release, for the same underlying reason.
    </div>
    <div class="c05-cards">
      ${CARDS.map(c => `
        <div class="c05-card">
          <div class="c05-card-title">${c.title}</div>
          <div class="c05-card-desc">${c.desc}</div>
          <div class="c05-card-arrow">now replaced by →</div>
          <div class="c05-card-replacement">${c.replacement}</div>
        </div>
      `).join('')}
    </div>
    <div class="key-insight visible" style="margin-top:20px;">
      <div class="key-insight-label">Key insight</div>
      <div class="key-insight-text">
        Notice the pattern: every one of these needs the server to reach the client on its own, whenever it wants.
        That's the exact thing a stateless, load-balanced setup can't guarantee — so all three had to go together.
      </div>
    </div>
  `;
}

/* ───────────────────────────────────────────────────────────
   06 — The deprecation timeline
   Click through 2024 → 2025-06-18 → 2026-07-28.
─────────────────────────────────────────────────────────── */
function initC06() {
  const card = document.getElementById('component-06');
  if (!card) return;

  const STAGES = [
    {
      name: '2024',
      title: 'Sampling is introduced',
      body: 'MCP adds sampling as the answer to a real problem: how does a server use an AI model without holding its own API key? The server asks, the client (and a human) decides.',
      quote: '"With no server API keys necessary." — MCP spec',
    },
    {
      name: '2025-06-18',
      title: 'Part of the stable spec',
      body: 'Sampling ships as a documented, stable part of the protocol. This is the version most of the public explainers (and this chapter\'s other components) describe.',
      quote: '"Clients that support sampling MUST declare the sampling capability during initialization." — MCP spec',
    },
    {
      name: '2026-07-28',
      title: 'Deprecated',
      body: 'The release candidate moves MCP\'s core to a stateless design so any server instance can handle any request. Sampling needs the opposite — a server that can reach one specific client whenever it wants. The spec picks statelessness and recommends calling the AI provider directly instead.',
      quote: '"Server-initiated requests may now only be issued while the server is actively processing a client request." — MCP spec blog',
    },
  ];

  let active = 2;

  function render() {
    const s = STAGES[active];
    card.innerHTML = `
      <div class="component-setup">
        <strong>Click a point on the timeline</strong> to see what changed and why.
      </div>

      <div class="c06-rail">
        ${STAGES.map((st, i) => `
          <div class="c06-stage ${i === active ? 'active' : ''}" data-i="${i}">
            <div class="c06-stage-num">${st.name}</div>
            <div class="c06-stage-name">${st.title}</div>
          </div>
        `).join('')}
      </div>

      <div class="c06-detail">
        <div class="c06-detail-title">${s.name} — ${s.title}</div>
        <div class="c06-detail-body">${s.body}</div>
        <div class="c06-detail-quote">${s.quote}</div>
      </div>

      <div class="key-insight ${active === 2 ? 'visible' : ''}" style="margin-top:16px;">
        <div class="key-insight-label">Key insight</div>
        <div class="key-insight-text">
          Sampling wasn't a mistake — it solved a real problem for about 13 months. It just turned out to need a
          tradeoff (a server that can always reach its client) that the protocol later decided wasn't worth keeping.
        </div>
      </div>
    `;

    card.querySelectorAll('.c06-stage').forEach(el => {
      el.onclick = () => { active = parseInt(el.dataset.i, 10); render(); };
    });
  }

  render();
}

/* ───────────────────────────────────────────────────────────
   Outcomes — attribution chain + "does your server need this"
   decision tool (substitutes for the usual ROI slider, since
   no company reports a quantified metric for sampling).
─────────────────────────────────────────────────────────── */
function initOutcomes() {
  const card = document.getElementById('component-outcomes');
  if (!card) return;

  const CHAIN = [
    { label: 'Design choice', value: 'No server-held API key', detail: 'Sampling exists so the server never needs its own key — it borrows the client\'s access instead.' },
    { label: 'Requirement', value: 'Server must reach client mid-task', detail: 'For that to work, the server needs to be able to send the client a message whenever it wants — not just answer when asked.' },
    { label: 'Infrastructure cost', value: 'Needs a stateful, sticky connection', detail: 'That kind of reach-back-anytime channel only exists over stdio, or HTTP with a long-lived connection tied to one client.' },
    { label: 'Conflict', value: 'Clashes with stateless scaling', detail: 'MCP\'s newer goal is servers that can run behind a plain load balancer, with any copy handling any request — which a sticky connection breaks.' },
    { label: 'Outcome', value: 'Deprecated, 2026-07-28', detail: 'When the two goals collided, the spec kept statelessness and walked sampling back in favor of calling the AI provider directly.' },
  ];

  let activeChain = null;
  let q1 = null; // true = "yes, needs the model mid-task"
  let q2 = null; // true = "yes, can ground it via tool results instead"

  function renderChain() {
    return `
      <div class="decision-label">Attribution chain — how one design choice led to a deprecation</div>
      <div class="chain-diagram">
        ${CHAIN.map((c, i) => `
          <div class="chain-node ${activeChain === i ? 'active' : ''}" data-i="${i}">
            <div class="chain-node-label">${c.label}</div>
            <div class="chain-node-value">${c.value}</div>
          </div>
        `).join('')}
      </div>
      ${activeChain !== null ? `<div class="chain-expand visible">${CHAIN[activeChain].detail}</div>` : ''}
    `;
  }

  function decisionResult() {
    if (q1 === null || q2 === null) return '';
    const needsMidTask = q1 === true;
    const canGround = q2 === true;
    // Matches the RC's own guidance: use sampling only if you genuinely need
    // the model mid-task AND can't just enrich tool results instead.
    const useSampling = needsMidTask && !canGround;
    if (useSampling) {
      return `
        <div class="decision-result visible use-sampling">
          <div class="decision-result-label">Consider sampling</div>
          <div class="decision-result-text">Your server genuinely needs the model's judgment mid-task, and you can't just hand back richer context instead. That's the exact case sampling was built for — though note it's now deprecated, so weigh a stateful transport requirement against that.</div>
        </div>`;
    }
    return `
      <div class="decision-result visible use-direct">
        <div class="decision-result-label">Use direct provider integration</div>
        <div class="decision-result-text">${canGround ? 'You can enrich your tool results with more context instead of calling back mid-task — that\'s what the RC recommends, and what real production servers like txn2/mcp-data-platform already do.' : 'Your server doesn\'t need the model mid-task at all — just call the AI provider\'s API directly where you need it, no round-trip through the client required.'}</div>
      </div>`;
  }

  function renderTool() {
    return `
      <div class="decision-tool">
        <div class="decision-label">Does your server actually need this?</div>
        <div class="decision-q">
          <div class="decision-q-text">1. Does your server need the AI model's help in the middle of a task — not just to format an answer, but to decide what to do next?</div>
          <div class="decision-q-btns">
            <button class="toggle-btn ${q1 === true ? 'active' : ''}" id="dt-q1-yes">Yes</button>
            <button class="toggle-btn ${q1 === false ? 'active' : ''}" id="dt-q1-no">No</button>
          </div>
        </div>
        <div class="decision-q">
          <div class="decision-q-text">2. Could you get the same result by just including more context in your tool's response, instead of calling back for a fresh AI judgment?</div>
          <div class="decision-q-btns">
            <button class="toggle-btn ${q2 === true ? 'active' : ''}" id="dt-q2-yes">Yes</button>
            <button class="toggle-btn ${q2 === false ? 'active' : ''}" id="dt-q2-no">No</button>
          </div>
        </div>
        ${decisionResult()}
        <div class="decision-disclaimer">Based on the IMTI practitioner post and the 2026-07-28 RC's own guidance — not a universal rule, just a starting point.</div>
      </div>
    `;
  }

  function render() {
    card.innerHTML = renderChain() + renderTool();

    card.querySelectorAll('.chain-node').forEach(el => {
      el.onclick = () => {
        const i = parseInt(el.dataset.i, 10);
        activeChain = activeChain === i ? null : i;
        render();
      };
    });
    const q1yes = card.querySelector('#dt-q1-yes');
    const q1no = card.querySelector('#dt-q1-no');
    const q2yes = card.querySelector('#dt-q2-yes');
    const q2no = card.querySelector('#dt-q2-no');
    if (q1yes) q1yes.onclick = () => { q1 = true; render(); };
    if (q1no) q1no.onclick = () => { q1 = false; render(); };
    if (q2yes) q2yes.onclick = () => { q2 = true; render(); };
    if (q2no) q2no.onclick = () => { q2 = false; render(); };
  }

  render();
}
