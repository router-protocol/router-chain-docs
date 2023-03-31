---
title: Handling the Acknowledgment on the Source Chain
sidebar_position: 2
---

Once the read request is executed on the destination chain, the requested data is sent along with an acknowledgment to the source chain. To handle the acknowledgment, developers need to include a `handleCrossTalkAck()` function in their contract. This function will have three parameters, namely:
### 1. eventIdentifier
This is the same nonce you receive while calling the `readQueryToDest()` function on the source chain Gateway contract. Using this nonce, you can verify whether a particular request was executed on the destination chain.

### 2. execFlags
Since multiple payloads can be sent to multiple contract addresses on the destination chain, the `execFlags` is an array of boolean values that tells you the status of the individual calls.

### 3. execData
The `execData` parameter is an array of bytes that provides the return values from every read call included in the read request. Based on the application's requirement, this data can be decoded and processed on the source chain.