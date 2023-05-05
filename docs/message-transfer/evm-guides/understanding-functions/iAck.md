---
title: iAck
sidebar_position: 3
---

# `iAck` Function

After executing the `iReceive` function, an acknowledgment is generated from Router's destination chain Gateway contract that specifies whether the calls were successful. To handle this acknowledgment, it is necessary to implement an `iAck` function in the contract. The schema for the function is as follows, since the IDapp contract has been inherited:

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) external
```

If the user chooses not to receive the acknowledgement, they can create an empty function with the following schema to replace it:

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) external {}
```

If acknowledgment reception is opted for, handling the acknowledgment inside the function is necessary. The function has the following parameters:

### 1. requestIdentifier

The nonce received while calling the `iSend()` function on the source chain Gateway contract is the same nonce that is passed to this function. With this nonce, you can verify whether a specific request was executed on the destination chain.


### 2. execFlag

`execFlag` is a boolean value that tells you the status of your call or request.

### 3. execData

The `execData` parameter of the `iAck` function represents the encoded return value from the `iReceive` function on the destination chain, delivered as bytes. After decoding this data, it can be processed on the source chain based on the requirements of the application.