---
title: High-level Workflow
sidebar_position: 1
---

In the case of Voyager v2.0, instead of locking/unlocking funds, we use permissionless entities called **Forwarders** to transfer tokens. Once a cross-chain token transfer request is initiated by the user on the source chain Voyager contract, a Forwarder will pick up the event corresponding to the request and provide the user with that token on the desired destination chain. At a later time, the forwarded can claim the user-deposited token from chain A. Step-by-step flow for the entire process is given below:

<center><figure><img src={require('./img/trustless-voyager.png').default} alt="Voyager v2.0 Workflow" style={{width: "100%", marginBottom: 12}} /><figcaption>High-level workflow of Voyager v2.0</figcaption></figure></center>

**Step 1)** User invokes the Voyager contract to transfer funds from Chain A (source) to Chain B (destination).

**Step 2)** The Voyager contract will validate the request, deduct funds from the user's account, increment event nonce and emit a `CrosschainTransferRequest` event. The event includes the following details: 
- `SrcChainId`
- `EventNonce`
- `DestChainId`
- `ReceiverAddress`
- `Token`
- `Amount`

**Step 3a)** A Forwarder will listen to the `CrosschainTransferRequest` event

**Step 3b)** Orchestrators on the Router chain will also listen to the `CrosschainTransferRequest` event and submit it to the Router chain with their attestation.

**Step 4)** The Forwarder will create a hash of the fields included in the event and submit a transaction to the destination chain Voyager contract. The hash acts as a unique identifier for the `CrosschainTransferRequest`.

**Step 4b)** After 2/3+1 validation, the Router chain will invoke the middleware Voyager contract with the event info. Upon receiving the `CrosschainTransferRequest` event, the middleware contract will persist the request (mapping to the request will be maintained using the hash of the fields included in the event).

**Step 5)** Upon receiving the tx, the Voyager contract on the destination chain will (a) transfer the defined amount from the Forwarder address to the receiver address; (b) persist the hash in the status map (to skip the replays); (c) emit a `CrosschainTransferExecuted` event confirming the execution. The event includes: 
- `ChainId`
- `EventNonce`
- `hash`
- `ForwarderAddress`

**Step 6)** Orchestrators on the Router chain listen to the `CrosschainTransferExecuted` event from the destination chain Voyager contract and submit it to the Router chain with their attestation.

**Step 7)** Upon 2/3+1 validation, the Router chain will invoke the middleware Voyager contract with the event info. Upon receiving the `CrosschainTransferExecuted` event, the middleware contract will mark the request as **Completed** and persist the Forwarder address and amount.

**Step 8)** Once the request is marked as completed, the Forwarder can claim its (funds + reward) by triggering an outbound request. The outbound request gets processed via the Router chain and existing Gateway contracts. The Gateway contract will invoke the source chain Voyager contract, which will settle the funds for Forwarder.

