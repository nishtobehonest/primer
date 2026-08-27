# Source notes — Official MCP spec + 2026-07-28 Release Candidate

**Sources:**
- https://modelcontextprotocol.io/specification/2025-06-18/client/sampling (current stable spec, Sampling)
- https://blog.modelcontextprotocol.io/posts/2026-07-28-release-candidate/ (RC blog post)

## What Sampling is (current stable spec, 2025-06-18)

> "The Model Context Protocol (MCP) provides a standardized way for servers to request LLM sampling ('completions' or 'generations') from language models via clients. This flow allows clients to maintain control over model access, selection, and permissions while enabling servers to leverage AI capabilities — with no server API keys necessary."

- Servers send a `sampling/createMessage` JSON-RPC request to the client.
- Clients that support sampling **MUST** declare the `sampling` capability during initialization.
- Servers can request text, audio, or image generations, and can suggest model preferences (`costPriority`, `speedPriority`, `intelligencePriority`, plus name `hints`) — clients make the final model choice.
- **Two human-in-the-loop checkpoints are required by the spec** (worded as SHOULD):
  1. Present the request to the user for approval/edit before sending to the LLM.
  2. Present the generated response to the user for approval/edit before returning it to the server.
- Official message flow (from the spec's own sequence diagram): `Server → Client (sampling/createMessage)` → `Client → User (present for approval)` → `User → Client (approve/modify)` → `Client → LLM (forward approved request)` → `LLM → Client (generation)` → `Client → User (present response)` → `User → Client (approve/modify)` → `Client → Server (return approved response)`.
- Error case: client returns a JSON-RPC error (e.g. `"User rejected sampling request"`) if the user declines.

## The 2026-07-28 Release Candidate — Sampling deprecated

Confirmed directly from the spec's own blog: **Sampling, Roots, and Logging are all formally deprecated** in this RC, described as "annotation-only deprecations" — they keep working for at least a 12-month transition window under the protocol's new deprecation policy, but new servers should not adopt them.

**Stated replacements:**

| Deprecated feature | Replacement |
|---|---|
| Sampling | Direct integration with LLM provider APIs |
| Roots | Tool parameters, resource URIs, or server configuration |
| Logging | `stderr` for stdio transports; OpenTelemetry for structured observability |

**Why — the stateless core redesign:** The RC removes protocol-level session management. Previously, a client needed sticky routing to one specific server instance (tracked via an `Mcp-Session-Id` header) so that server-initiated messages (sampling requests, log lines, progress updates) could find their way back to the right client over a long-lived connection. In the new design, "any MCP request can land on any server instance, and the sticky routing and shared session stores that horizontal deployments needed before are no longer required" — which means a plain round-robin load balancer works, instead of requiring dedicated sticky-session infrastructure.

**The tightened rule that makes the old sampling pattern awkward:** "Server-initiated requests may now only be issued while the server is actively processing a client request." Previously, a server could push a sampling request or log line at any time over an open SSE (server-sent events) stream. Now that window is much narrower — mid-request only.

**Framing for the chapter:** the spec doesn't say "sampling was a bad idea." It says the tradeoff moved: sampling's whole value (server borrows the client's LLM access) requires the server to be able to reach back to the client whenever it wants — which requires a stateful, sticky-routed transport. That conflicts directly with the newer goal of stateless, horizontally-scalable servers. When those two goals collided, the spec picked statelessness and pushed LLM access back to direct provider integration.
