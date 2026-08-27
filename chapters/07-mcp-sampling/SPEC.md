# Chapter 07: MCP Sampling — Spec

**Status:** Built
**Audience:** External — shareable on LinkedIn
**Case study:** No company case study exists for this topic (see deviation note below) — substituted with a verified spec event: the 2026-07-28 MCP Release Candidate deprecating Sampling.
**Sources:** https://modelcontextprotocol.io/specification/2025-06-18/client/sampling · https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/ · https://workos.com/blog/mcp-sampling · https://imti.co/mcp-sampling/
**Last updated:** 2026-08-27

---

## Deviation from the usual case-study format

The `/primer-chapter` skill normally requires a real company's public writeup with a quantified business metric. Web research for this chapter (four searches, four fetched sources) found **no company that reports business outcomes from using MCP Sampling** — it's a narrow protocol mechanism, not a product feature companies write ROI posts about. The one practitioner with a real production MCP server who wrote about it (IMTI, `txn2/mcp-data-platform`) explicitly describes **choosing not to use sampling**.

Rather than invent numbers or force-fit an unrelated company, this chapter substitutes a real, dated, well-documented **protocol event** for the usual case study: as of the 2026-07-28 MCP spec release candidate, Sampling was formally deprecated — about 13 months after the pattern was ratified in the 2025-06-18 spec — in favor of direct LLM-provider integration and a stateless protocol core. This is stronger material for the "AI slop" theme than a synthetic case study would be: it's proof that even a spec-level design pattern can turn out to be the wrong tradeoff once you see it at scale, and that understanding *why* (not just copying the pattern) is what lets you see that coming.

The Business Outcomes section is likewise substituted — see below.

---

## What this is

A page that makes one MCP design decision tangible: why a server asking a client to run the AI model for it (instead of calling the model directly) is a big deal, and why the protocol itself just walked that pattern back. Six core concepts, six live interactive components. No backend. No API calls — everything is simulated.

Based on the official MCP spec, the 2026-07-28 spec release candidate, and two practitioner explainers. Built by Nishchay Vishwanath.

---

## Failure mode

You gave your MCP server its own API key and called the AI model directly from it — then the protocol's own fix for that (sampling) got deprecated within about a year of shipping, because it couldn't survive the move to stateless, horizontally-scaled servers.

---

## Audience

**Primary:** Developers building or evaluating MCP servers — people who've read "MCP" in a few places and want to actually understand the request/response mechanics, not just the pitch.

**Secondary:** Anyone curious how a real, still-young protocol makes and reverses design decisions in public.

**Not for:** People who need a step-by-step "build your first MCP server" tutorial — this chapter is about one specific design decision, not a getting-started guide.

---

## Case study

| Field | Value |
|---|---|
| Company | — (no company case study exists for this topic; see deviation note above) |
| Industry | Developer tooling / AI protocol design |
| Source | https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/ |
| Concept applied | Sampling — server-initiated LLM requests routed through the client |
| Technical event | Sampling, Roots, and Logging all deprecated in the 2026-07-28 MCP spec RC |
| Stated reason | Stateless core redesign — server-initiated requests now require sticky, stateful routing that conflicts with plain round-robin horizontal scaling |
| Reported outcome | Sampling → replaced by direct LLM-provider integration; 12-month transition window before removal is even eligible |
| Key quote | "Server-initiated requests may now only be issued while the server is actively processing a client request." — MCP spec blog |

---

## Interactive theme

**Theme:** Tool Call Trace
**Why:** The entire concept is message direction and timing — who sends what, to whom, and when. Stepping through an annotated trace of the actual protocol messages demonstrates the mechanism directly; no metaphor is needed the way a grid-world or document-universe metaphor would be.

---

## The 6 concepts

| # | Concept | What the component does |
|---|---|---|
| 01 | Client-initiated vs. server-initiated | Toggle between a normal tool call (client asks server, server answers) and a sampling call (server asks client, client asks the AI, client answers back) — the arrows visibly flip direction. |
| 02 | The sampling handshake | Step through the real 8-step flow from the spec's own sequence diagram, including both required human-approval checkpoints. |
| 03 | Why servers don't hold API keys | Before/after: a server with its own API key vs. a server using sampling. Reveal what breaks when the naive version goes public. |
| 04 | Transport breaks the pattern | Pick a transport (stdio / stateful HTTP / stateless HTTP) and see whether the server-initiated sampling request can even be delivered. |
| 05 | Roots and Logging — the siblings | Three-way comparison of the features deprecated together in the same RC, and what replaces each. |
| 06 | The deprecation timeline | Click through 2024 → 2025-06-18 → 2026-07-28 to see the pattern get introduced, stabilized, then walked back — with sourced quotes at each stage. |

---

### ASCII mockups

**Component 01 — Client-initiated vs. server-initiated**
```
  NORMAL TOOL CALL                    SAMPLING CALL
  ─────────────────                   ──────────────
  [ Client ] ──ask──► [ Server ]      [ Server ] ──ask──► [ Client ]
  [ Client ] ◄─answer─ [ Server ]                              │
                                                          asks the AI
                                                                ▼
                                                          [ Client ] ──answer──► [ Server ]

  Client starts it. Server just answers.   Server starts it. Client has to go get
                                            the answer from the AI model first.

  [ Normal tool call ]  [ Sampling call ]
```

**Component 02 — The sampling handshake**
```
  STEP 3 of 8                                    [ ● ● ● ○ ○ ○ ○ ○ ]

  SERVER          CLIENT           USER            LLM
                   ┌─────────────────────┐
                   │ "Classify this      │
                   │  ticket as..."      │ ← shown for approval
                   └─────────────────────┘
                          ▲
                   waiting on you ⏸

  [ ← Back ]  [ Next step → ]  [ Reset ]
```

**Component 03 — Why servers don't hold API keys**
```
  NAIVE SERVER                        SAMPLING SERVER
  ────────────                        ────────────────
  Holds: sk-ant-••••••••              Holds: nothing
  Calls the model directly            Asks the client to call it

  Goes public →                       Goes public →
  ✗ your API key, everyone's usage    ✓ each user's own account, own cost
  ✗ no one reviews the prompt         ✓ human approves before it sends
  ✗ no audit trail                    ✓ every call is a logged protocol message

  [ Naive server ]  [ Sampling server ]
```

**Component 04 — Transport breaks the pattern**
```
  TRANSPORT: [ stdio ] [ stateful HTTP ] [ stateless HTTP ]

  stdio           Server ──sampling request──► Client   ✓ delivered
                   (same machine, open pipe both ways)

  stateful HTTP    Server ──sampling request──► Client   ✓ delivered
                   (long-lived SSE connection stays open)

  stateless HTTP   Server ──sampling request──► ✗ nowhere to send it
                   (no session, no open connection back to this client)
```

**Component 05 — Roots and Logging, the siblings**
```
  SAMPLING              ROOTS                  LOGGING
  ────────              ─────                  ───────
  Server asks client     Client tells server    Server tells client
  to run the AI model    which folders it       what it's doing
                         can touch               mid-task

  → direct provider      → tool params /         → stderr (stdio) /
    integration            server config           OpenTelemetry

  All three: deprecated together in the 2026-07-28 RC. Same root cause —
  all three need the server to reach the client whenever it wants.
```

**Component 06 — The deprecation timeline**
```
  ●──────────────────●──────────────────●
  2024               2025-06-18          2026-07-28
  Sampling            Sampling is         Sampling is
  introduced          part of the         deprecated —
                       stable spec         replaced by direct
                                           provider integration

  [ click a point to expand ]
```

---

## Business outcomes section — substituted

No company reports a quantified business metric for adopting or dropping MCP Sampling, so this section does not use the usual attribution-chain-to-dollars format. It's replaced with:

**Attribution chain (real, sourced — a protocol-design chain, not a $ outcome):**
No server-held API key → requires the server to send messages to the client mid-task → requires a stateful, sticky-routed connection (stdio, or HTTP with an open SSE stream) → conflicts directly with the newer goal of stateless, horizontally-scalable servers → Sampling deprecated in the 2026-07-28 RC in favor of direct provider integration.

**Interactive substitute for the ROI slider — "Does your server actually need this?"**
A short decision tool built from the IMTI quote ("Sampling is the tool for servers that genuinely need the host's model mid-task; many data platforms do not.") — two questions, one plain recommendation at the end, matching what the RC itself now recommends.

**Source:** all four chapter sources, cited inline.

---

## Page layout

```
┌──────────────────────────────────────────────────────────────┐
│  [TOP-NAV]  ← Primer                          nishchay.me ↗  │
├──────────────────────────────────────────────────────────────┤
│  [HEADER]  MCP Sampling                                      │
│            Based on the official MCP spec + practitioner posts│
├──────────────────────────────────────────────────────────────┤
│  [INTRO]   Failure mode hook + deviation-honest framing       │
├──────────────────────────────────────────────────────────────┤
│  01  CLIENT-INITIATED VS. SERVER-INITIATED                    │
│  02  THE SAMPLING HANDSHAKE                                   │
│  03  WHY SERVERS DON'T HOLD API KEYS                          │
│  04  TRANSPORT BREAKS THE PATTERN                             │
│  05  ROOTS AND LOGGING — THE SIBLINGS                          │
│  06  THE DEPRECATION TIMELINE                                  │
├──────────────────────────────────────────────────────────────┤
│  [OUTCOMES]  Attribution chain + "does your server need this" │
├──────────────────────────────────────────────────────────────┤
│  [FOOTER]  Built by Nishchay · Sources                        │
└──────────────────────────────────────────────────────────────┘
```

---

## Design notes

| Token | Used for |
|---|---|
| `--blue` | Client-initiated messages, normal request direction, chapter number |
| `--purple` | Server-initiated messages (sampling / roots / logging) — the reversed direction |
| `--teal` | The LLM entity |
| `--green` | Delivered / approved / stable spec state |
| `--red` | Blocked / can't be delivered / naive-server risk |
| `--amber` | Waiting on human approval / deprecated / transitional state |

---

## Writing voice

Every explanation on this page — intro, section bodies, component setup lines, key insights — is written at an 8th-grade reading level: plain language first, the real protocol term named right after, not instead of. This is a Primer-wide standard going forward, not unique to this chapter.

---

## Done when

- [x] All 6 components are interactive and correct
- [x] Intro section works for a cold visitor with zero context
- [x] Sources cited in intro and footer
- [x] Business outcomes section shows the substituted attribution chain + decision tool
- [x] Page loads with no errors, no backend, no API key
- [x] Top-nav is present (← Primer / nishchay.me ↗)
- [x] Light and dark themes both work
- [ ] Card added to root index.html in slop-fix voice
- [ ] LinkedIn post drafted
