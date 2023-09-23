---
title: Orchestrators
sidebar_position: 2
---

# Orchestrators

Router orchestrators are entities that listen to incoming cross-chain requests from other chains, attest their validity, parse them into a unified format and post them on the Router chain. These attested requests can then be picked up by the relayers and forwarded to the destination chain. All validators must run an orchestrator instance to be a part of the Router chain ecosystem.

<!-- , and forward them to the Router chain. For any cross-chain request, if the destination chain is the Router chain itself, their job ends here. However, if the destination chain is some other chain, they are also responsible for attesting the validity of the processed cross-chain request before it can be picked up by the relayers.  -->

## Working of an Orchestrator
At a high level, a Router orchestrator works like a funnel that gathers events from various chains and posts them to the Router chain. To do so, an orchestrator uses a listener and dispatcher model wherein the listener module aggregates events while the dispatcher module forwards these events to the Router chain.

<center><img src={require('./img/orchestrator.png').default} alt="Orchestrator Architecture"  style={{ width: 700, marginBottom: 12 }} /></center>

- **Listener:** The listener module of an orchestrator listens to events emitted from specific chains based on the **`chainType`** parameter in the configuration provided to it. Listeners operate as threads (goroutines) under an orchestrator. All listeners subscribe to multiple types of events - a regular iSend (cross-chain send) event, an iRecieve (cross-chain receive) event, and an iAck (acknowledgment) event. Once the listener module receives an event, it waits for the preconfigured amount of network confirmations (for example, 10 network confirmations for requests originating from Mumbai/Fuji) before parsing it into a message. Once the message is prepared, the listener adds it to a transaction queue sequence database.
- **Attester:** For any request originating from the Router chain, attestations are required. The attester module will query the chain to fetch such requests, attest them, and add them to the no sequence database queue.  
- **DB Queue:** The queue is used to store and deliver transformed messages to consumers (dispatchers) in a first-in-first-out manner while ensuring that duplicate messages are discarded. 
  - **Sequence DB:** Requests present in this DB should be processed sequentially (sorted by nonce).
  - **No sequence DB:** Requests present in this DB can be process in any sequence. 
- **Dispatcher:** The dispatcher module is essentially responsible for streamlining the incoming requests by (a) listening to the queue, (b) batching the transaction (c) signing the messages, and (d) broadcasting them to the Router chain.  
.  

<!-- As mentioned above, orchestrators also verify the processed requests. To do so, an orchestrator has to listen to the transactions occurring on the Router chain. -->

<!-- ## Addressing Orchestrator Scalability
Listening to multiple blockchains at the same time is a resource-intensive task, and therefore, proper measures need to be taken to guarantee the scalability of the orchestrator module:
- **Multiple Threads:** Each orchestrator can run multiple listeners as goroutines/threads, each responsible for listening to one specific chain for Router-specific events. On top of the scalability it provides, this approach allows us to remain modular in our design. For chains that do not have support for Golang, instead of developing a new orchestrator, we can just build listeners and attach them to existing orchestrators to continue the operation.
- **RabbitMQ for Message Queuing:** Orchestrators on the Router chain use [RabbitMQ](https://www.rabbitmq.com/), a dedicated message broker, to handle the message passing between the listener and the dispatcher module. RabbitMQ’s ability to maintain states (messages) until they are received allows for rollbacks and failover handling without any overhead. -->