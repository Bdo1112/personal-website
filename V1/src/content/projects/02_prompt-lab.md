---
title: "Prompt Lab — A Multi-Stage LLM Prompt Optimization Pipeline"
summary: "A personal tool for turning rough prompt intent into production-ready LLM prompts through a 4-layer processing pipeline — expanding intent, selecting reasoning strategy, enforcing output schema, and optimizing for the target model."
stack: ["Python", "TypeScript", "FastAPI", "Pydantic", "PostgreSQL", "Docker"]
featured: true
---

## Problem

Good prompts follow a consistent structure — persona, reasoning strategy, output schema — but the context changes every time. Writing them from scratch on each use is repetitive, and the structure lives in someone's head rather than somewhere reusable.

There was no way to save a prompt as a reusable template where the structure stays fixed but the context can be swapped out per use.

## High Level

Built a multi-stage pipeline with a UI for configuring each run — role, model, optimization mode, goal, context, and requirements are all configurable per use. The pipeline produces a split system prompt and user prompt, with token count, ready to paste into any LLM.

Each layer has a single responsibility and can be swapped independently:

- **Layer 1 — Intent Expander**: Takes a vague goal and expands it — clarifying the core task, required expertise, and constraints — into a richer, more specific intent using a lightweight LLM call
- **Layer 2 — Strategy Selector**: Chooses a reasoning strategy based on the task type — chain-of-thought for debugging, role-play for creative tasks, step-back for architecture decisions
- **Layer 3 — Schema Enforcer**: Forces the output to match a specified format (JSON, markdown, bullet points) by injecting structured constraints into the prompt
- **Layer 4 — Optimizer**: Counts tokens, trims context if needed, and applies model-specific formatting (e.g. XML tags for Claude)

Deployed backend services via Docker and Traefik as a reverse proxy, managing LLM service lifecycle and exposing a REST API with Pydantic-enforced contracts.

## Design Decisions

**1. Independently swappable layers**  
Each layer is isolated behind a consistent interface. Replacing or upgrading one layer — say, swapping the strategy selector from keyword matching to a classifier — doesn't affect anything else in the pipeline. This made it easy to experiment without breaking the full flow.

**2. Pydantic contracts between layers**  
Every layer has typed input and output models enforced by Pydantic. This prevented silent data corruption between stages and made it easy to test each layer independently. Type-safe data flow across pipeline stages was a deliberate choice over loose dictionaries.

**3. Optimization modes as a first-class input**  
The pipeline exposes three modes — Fast, Balanced, and Deep — each running a different subset of layers. Fast skips the more expensive steps for quick iterations; Deep runs everything. Deep currently mirrors Balanced since the RAG layer isn't implemented yet, but the architecture is designed to slot it in without changing anything else.

## Impact

Used Prompt Lab to build and save reusable prompt templates for my own internal tooling — the structure is authored once through the pipeline and stored, then reused with different context each time. Eliminated the need to reconstruct the same prompt structure repeatedly across different workflows.
