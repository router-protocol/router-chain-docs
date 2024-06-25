---
title: High Level Architecture
sidebar_position: 4
description: Understanding the stateful bridging architecture 
---


## High Level Architecture

<center><img src={require('../img/high-level-workflow.png').default} alt="High Level Workflow" /></center>

For better understanding of Router's stateful bridging flow between two third-party chains, let us break down the lifecycle of a stateful cross-chain request into two flows - (a) inbound flow, and (b) outbound flow.

### Inbound Workflow

**Step 1)** A user initiates a cross-chain action on an application's smart contract on the source chain.

**Step 2)** The application contract then calls the **`iSend()`** function on the Router Gateway contract with the relevant parameters.

**Step 3)** The Gateway contract on the source chain emits an event that is listened to by the orchestrators on the Router Chain.

**Step 4)** After the event is validated, the message is sent to the application's bridge contract on the Router Chain, where it can implement its custom business logic.

### Outbound Workflow

**Step 1)** Once the transaction initiated by the bridge contract is mined on the Router Chain, an outbound request is generated.

**Step 2)** The orchestrators validate the outbound request.

**Step 3)** Once validated, the relayer polling the outbound requests of that particular bridge contract picks up the transaction and forwards the event to the Router Gateway contract on the destination chain.

**Step 4)** The Gateway contract on the destination chain calls the **`iReceive()`** function on the application contract on the destination chain.

**Step 5)** The application contract on the destination chain will take appropriate actions based on the data transferred.

**Step 6)** After the **`iReceive()`** function execution is complete on the destination chain, the destination chain's Gateway contract emits an acknowledgment event that is listened to by the orchestrators on the Router Chain.

**Step 7)** The ack is then submitted to the bridge contract ensuring the execution of Outbound Request. Upon receiving the ack, the bridge contract can mark the status of the cross-chain request as completed and take required actions.

