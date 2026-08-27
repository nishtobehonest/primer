# Source notes — Nish's own course notes on MCP internals

Personal study notes from a video course on MCP, pasted into the planning session for Chapter 07. Not a public citable source — used for mechanics-level detail the public sources gloss over. Cross-checked against the official spec docs (see `07-mcp-sampling-spec-docs.md`) where the two overlap.

## Sampling (the course's own framing)

Sampling lets an MCP server ask the client to run a language-model generation, instead of the server calling an LLM itself. Shifts the cost of API keys, auth, and token spend from the server to the client. Flow: server creates a message request → client's sampling callback receives it → client calls its own LLM → client returns the generated text to the server. Server-side code: `create_message()`. Client-side: implement a sampling callback that returns a `create_message_result`. Main use case: a publicly-hosted MCP server that needs LLM help without eating the cost or security risk of holding its own key.

## Logging and progress notifications

A server can send `info()`-style log lines and `report_progress()` updates back to the client mid-tool-call, so the user doesn't think a long-running tool call has stalled or died. Purely a UX feature — optional, can be skipped. This is exactly the "Logging" feature the 2026-07-28 RC deprecated in favor of `stderr` (stdio) / OpenTelemetry (structured observability).

## Roots

Roots are how a user grants an MCP server access to specific files or folders ahead of time (passed as command-line args when the server starts), instead of the user having to type out a full file path every time. A `ListRoots` tool lets the server discover what it's allowed to touch. Important gotcha: the MCP SDK does **not** enforce root restrictions automatically — the server author has to manually check that any path it touches falls inside a granted root. This is exactly the "Roots" feature the 2026-07-28 RC deprecated in favor of passing paths as ordinary tool parameters or server configuration.

## Message types

MCP messages come in two shapes: request/result pairs (always paired, e.g. `call_tool_request` + `call_tool_result`) and notifications (one-way, no response expected, e.g. progress or logging updates). Either side — client or server — can originate a message. The direction a message can travel is exactly what the transport layer constrains (see below).

## Stdio transport

The client launches the server as a local subprocess and they talk over stdin/stdout. Fully bidirectional — either side can write to the pipe whenever it wants, so server-initiated requests (sampling, logging, progress) work naturally. Limitation: only works when client and server are on the same machine. Used by almost every local MCP setup (e.g. Claude Desktop's local servers).

## StreamableHTTP transport

Lets a server be hosted remotely (`mcpserver.com`) instead of running as a local subprocess — the tradeoff is that HTTP is fundamentally a client-asks, server-answers protocol. To let the server push things back to the client (sampling requests, log lines, progress), StreamableHTTP layers Server-Sent Events (SSE) on top: after the client initializes and gets a session ID, it opens a **long-lived SSE connection** the server can write into whenever it needs to reach the client, plus **short-lived SSE connections** tied to individual tool-call responses. This is the workaround that makes server-initiated messages possible at all over HTTP — and it depends entirely on the session ID keeping requests routed to the one server instance holding that open connection.

## Stateless HTTP flag

A deployment setting for horizontal scaling: multiple server copies behind a load balancer, requests routed randomly. Turning this on means:
- No session IDs assigned to clients.
- The long-lived SSE connection (the one server-initiated messages travel over) is **disabled**.
- Sampling, logging, and progress notifications **stop working** — there's no open channel left for the server to push through.
- In exchange, any server instance can handle any request — a plain round-robin load balancer is enough, no sticky routing or shared session store needed.

This is precisely the tension the 2026-07-28 RC resolved by deprecating Sampling/Roots/Logging: those features need the stateful, sticky-routed side of this tradeoff; the protocol's new direction wants the stateless, horizontally-scalable side.

## JSON response flag

A related HTTP setting: turning it on makes POST responses return the final result as one plain JSON blob instead of streaming intermediate progress/log messages — the client just waits for the whole tool call to finish. Same theme: less real-time visibility, in exchange for a simpler HTTP contract.
