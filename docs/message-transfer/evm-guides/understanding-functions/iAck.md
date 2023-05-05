---
title: iAck
sidebar_position: 3
---

# `iAck` Function

Once the **`iReceive`** function is executed, an acknowledgment is generated from Router's destination chain Gateway contract, which will specify whether the calls were successful. Since we inherited the IDapp contract, we need to implement a **`iAck`** function in our contract with the following schema.

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) external
```

If you have opted not to receive the acknowledgement, you can implement an empty function in its place in the following way:

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) external {}
```

If you've opted to receive the acknowledgment, you need to handle the acknowledgment inside this function. This function receives the following params:

### 1. requestIdentifier

This is the same nonce you receive while calling the `iSend()` function on the source chain Gateway contract. Using this nonce, you can verify whether a particular request was executed on the destination chain.

### 2. execFlag

`execFlag` is a boolean value that tells you the status of your call or request.

### 3. execData

The `execData` parameter is the data in bytes that provides the abi encoded return value from the `iReceive` call on the destination chain. Based on the application's requirement, this data can be decoded and processed on the source chain.
