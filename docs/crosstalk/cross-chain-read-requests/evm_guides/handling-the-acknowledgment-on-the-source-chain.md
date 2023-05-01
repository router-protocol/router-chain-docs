---
title: Handling the Acknowledgment on the Source Chain
sidebar_position: 2
---

Once the read request is executed on the destination chain, the requested data is sent along with an acknowledgment to the source chain. To handle the acknowledgment, developers need to include a `iAck()` function in their contract.

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) {}
```

This function will have three parameters, namely:

### 1. requestIdentifier

This is the same nonce you receive while calling the `iSend()` function on the source chain Gateway contract. Using this nonce, you can verify whether a particular request was executed on the destination chain.

### 2. execFlag

`execFlag` is a boolean value that tells you the status of your call or request.

### 3. execData

The `execData` parameter is the data in bytes that provides the return value from the read call included in the read request. Based on the application's requirement, this data can be decoded and processed on the source chain.
