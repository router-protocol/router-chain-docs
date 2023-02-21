---
title: Orchestrators
sidebar_position: 2
---

# Orchestrators

Router orchestrators are entities who listen to various inbound events from other chains, attest their validity, and forward them to the Router chain. They are also responsible for attesting the validity of outbound requests before they can be picked up by the relayers. All validators must run an orchestrator instance to be a part of the Router chain ecosystem.

## Working of an Orchestrator
At a high level, a Router orchestrator works like a funnel that gathers events from various chains and posts them to the Router chain. To do so, an orchestrator uses a listener and dispatcher model wherein the listener module aggregates events while the dispatcher module forwards these events to the Router chain.

<center><img src={require('./img/orchestrator.png').default} alt="Orchestrator Architecture"  style={{ width: 700, marginBottom: 12 }} /></center>

- **Listener:** The listener module of an orchestrator listens to events emitted from specific chains based on the **`chainType`** parameter in the configuration provided to it. Listeners operate as threads (goroutines) under an orchestrator. All listeners subscribe to multiple types of events, including a regular inbound request, an acknowledgment request, and a CrossTalk request, among others. Once the listener module receives an event, irrespective of its type, it parses the event into the same format. Once the message is prepared, the listener adds it to the messaging queue.
- **Message Queue:** The message queues are used to enqueue and deliver transformed messages to consumers (dispatchers) in a first-in-first-out manner while ensuring that duplicate messages are automatically discarded.
- **Dispatcher:** The dispatcher module is essentially responsible for streamlining the incoming requests by (a) listening to the message queue, (b) signing the messages, and (c) broadcasting them to the Router chain.  

As mentioned above, orchestrators also verify the pending requests on the outbound module. To do so, an orchestrator has to listen to the transactions occurring on the Router chain.

## Addressing Orchestrator Scalability
Listening to multiple blockchains at the same time is a resource-intensive task, and therefore, proper measures need to be taken to guarantee the scalability of the orchestrator module:
- **Multiple Threads:** Each orchestrator can run multiple listeners as goroutines/threads, each responsible for listening to one specific chain for Router-specific events. On top of the scalability it provides, this approach allows us to remain modular in our design. For chains that do not have support for Golang, instead of developing a new orchestrator, we can just build listeners and attach them to existing orchestrators to continue the operation.
- **RabbitMQ for Message Queuing:** Orchestrators on the Router chain use [RabbitMQ](https://www.rabbitmq.com/), a dedicated message broker, to handle the message passing between the listener and the dispatcher module. RabbitMQ’s ability to maintain states (messages) until they are received allows for rollbacks and failover handling without any overhead.