---
title: Slashing Conditions
sidebar_position: 6
---

### Condition 1 - Failure to Submit a Vote or Publishing a Conflicting Vote for Events Emitted by the Gateway Contract
An orchestrator will be slashed if it **fails to submit a vote** or submits a **conflicting vote** for any event emitted by the Gateway contract. The list of such events is as follows:
1. `CrosschainRequest` (iSend)
2. `CrosschainAckRequest` (iReceive)
3. `CrosschainAckReceipt` (iAck)
4. `ValsetUpdate`
5. `SetMetaData`
        
:::info
Orchestrators will be given a sufficient amount of time to publish their vote. The wait time period and slashing amount will be the same for all. This is because all the aforementioned events  are processed sequentially in the order of `EventNonce`. Failure to observe any one of these events will impact other events.
:::       

<details>
<summary><b>Workflow</b></summary>

At the end of each block:

**Step 1)** Get the list of active validator set.

**Step 2)** For each supported chain:
1. Get the `LastObservedEventNonce` and `LastObservedEventHeight`.
2. For each validator in the active validator set:
    1. fetch their `LastProcessedEventNonce` and `LastProcessedEventHeight`. 
    2. if the `WaitTime` > (`LastObservedEventHeight` - `LastProcessedEventHeight`), then slash the validator (`WaitTime` is custom for each chain).
    
</details>

### Condition 2 - Failure to Submit a Vote or Publishing a Conflicting Vote for Events Emitted by the Voyager Contract
An orchestrator will be slashed if it **fails to submit a vote** or submits a **conflicting vote** for any event emitted by the Voyager contract. The list of such events is as follows:
1. `FundDeposit`
2. `FundPaid`
    
:::info
Orchestrators will be given a sufficient amount of time to publish their vote. The wait time period and slashing amount will be the same for all. This is because all the aforementioned events  are processed sequentially in the order of `EventNonce`. Failure to observe any one of these events will impact other events.
:::    

### Condition 3 - Failure to Submit Confirmation for Requests Originating on the Router Chain
An orchestrator will be slashed if it **fails to submit confirmation** for any request originating on the Router Chain. The list of such requests is as follows:
1. `ValsetUpdate` 
2. `CrosschainRequest` (Outbound)
3. `CrosschainAckRequest` (OutboundAck)
    
:::info
The wait time and slashing amount **need not** be the same for aforementioned requests as all these requests are processed independently.
:::    
    