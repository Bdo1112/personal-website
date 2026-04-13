---
title: "Schema Changes Shouldn't Break Your Clients - Building a Validation Layer"
summary: "A service that ensures the safety of 2,500+ GraphQL operations against schema changes across a supergraph - catching breaking changes before production release"
stack: ["Typescript", "SpringBoot", "NoSQL"]
featured: true
---

## Problem
In a federated GraphQL system, subgraph schemas evolve independently across teams and are composed into a single supergraph that serves clients in production. A schema change that appears structurally valid can still break existing clients, not at the type level, but at query planning time. Any changes appear to be safe could still break production traffic due to failure in query planning.

There was no easy way to verify schema changes would not introduce production failure.

## High Level
Distributed validation platform that evaluates real production GraphQL operations against proposed schema changes to prevent breaking changes before deployment.

![Query validation flow](/src/assets/projects/p1/query-validation.png) 

- Composes a new supergraph from incoming schema changes
- Loads production operation data set
- Executes distributed query planning across multiple planners
- Validates planning results against baselines, checking failures and regressions
- Returns result as success/failure

## Design Decisions
Two design decisions were mainly focused on making the validation layer work at scale: parallel query planner and distributed caching. Each addressed a different performance bottleneck.

**1. Parallel Query Planning**  
Query planning is expensive and sequential validation doesn't scale to thousands of operations. We decomposed validation into independent service and moved planning into a parallel execution layer. 

**2. Distributed Caching for Baseline Query Plans**  
Regression checks require comparing a new query plan against a baseline — but baseline plans were not persisted anywhere, forcing the system to plan every query twice (2n operations). Caching baseline plans reduced planning work by 50%, cutting the cost of each validation run in half and making the system practical at scale.


## Impact
Zero production incident caused by query plan regressions across 250+ services since rollout.
