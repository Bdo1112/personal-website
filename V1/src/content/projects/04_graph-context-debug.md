---
title: "Graph Context & Debugging System — Schema Retrieval via MCP"
summary: "A context retrieval system that ingests and indexes schema from a centralized schema store, surfacing historical evolution data to support debugging and reduce time spent identifying breaking changes across distributed services."
stack: ["TypeScript"]
featured: false
---

## Problem

Debugging breaking changes in a federated GraphQL system requires understanding how a schema evolved over time — which fields were added, removed, or modified, and when. That history was stored in a centralized schema store but was not surfaced in a way that was useful during active debugging.

Engineers had to manually trace schema history across services, which was slow and error-prone, especially when a breaking change had been introduced several versions back.

## High Level

Built a context retrieval system using MCP that connects directly to the centralized schema store:

- Ingests and indexes schema history across all registered subgraphs
- Enables querying of schema evolution by service, field, or time range
- Surfaces historical context — prior versions, change diffs, deprecation history — directly into the debugging workflow
- Reduces the manual tracing required to identify when and where a breaking change was introduced

## Design Decisions

**1. MCP as the integration layer**
Using MCP to connect the retrieval system to the schema store kept the integration decoupled from the schema store's internal structure. The system queries through a defined protocol rather than directly coupling to storage internals, making it easier to adapt as the schema store evolves.

**2. Index schema history, not just current state**
Most tooling surfaces only the current schema. The key insight here was that debugging requires the historical delta — not just what the schema is now, but what changed and when. Indexing history rather than snapshotting current state made the system genuinely useful for root cause analysis.

## Impact

Reduced the time required to identify breaking changes across distributed services by surfacing schema evolution history directly into the debugging context. Eliminated the need to manually cross-reference schema versions across multiple services during incident investigation. 
