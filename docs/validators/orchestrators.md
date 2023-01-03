---
title: Orchestrators
sidebar_position: 2
---

# Orchestrators

Router orchestrators are entities who listen to various inbound events from other chains, attest their validity, and forward them to the Router chain. They are also responsible for attesting the validity of outbound requests before they can be picked up by the relayers. All validators must run an orchestrator instance to be a part of the Router chain ecosystem.

## Working of an Orchestrator
At a high level, a Router orchestrator works like a funnel that gathers events from various chains and posts them to the Router chain. To do so, an orchestrator uses a listener and dispatcher model wherein the listener module aggregates events while the dispatcher module forwards these events to the Router chain.

- **Listener:** The listener module of an orchestrator listens to events emitted from specific chains based on the **`chainType`** parameter in the configuration provided to it. Listeners operate as threads (goroutines) under an orchestrator. Once the listener module receives an event, it parses it into chain-specific events before passing it onto a queue.
- **Dispatcher:** The dispatcher module is essentially responsible for streamlining the incoming re- quests to the Router chain.

As mentioned above, orchestrators also verify the pending requests on the outbound module. To do so, an orchestrator has to listen to the transactions occurring on the Router chain.

## Addressing Orchestrator Scalability
Listening to multiple blockchains at the same time is a resource-intensive task, and therefore, proper measures need to be taken to guarantee the scalability of the orchestrator module:
- **Multiple Threads:** Each orchestrator can run multiple listeners as goroutines/threads, each responsible for listening to one specific chain for Router-specific events.
- **RabbitMQ for Message Queuing:** Orchestrators on the Router chain use [RabbitMQ](https://www.rabbitmq.com/), a dedicated message broker, to handle the message passing between the listener and the dispatcher module. RabbitMQ’s ability to maintain states (messages) until they are received allows for rollbacks and failover handling without any overhead.