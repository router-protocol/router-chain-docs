---
title: iAck
sidebar_position: 3
---

# `iAck` Function

After executing the `iReceive` function, an acknowledgment is generated from Router's destination chain Gateway contract that specifies whether or not the calls were successful. To handle this acknowledgment, it is necessary to implement an `iAck` function in the source chain contract. The schema for the function is given below:

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) external
```

If you choose not to receive the acknowledgment, then you can create an empty function with the following schema to replace it:

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) external {}
```

If you have opted to receive the acknowledgment, it is necessary to handle it inside the `iAck` function. The function has the following parameters:

### 1) `requestIdentifier`

The nonce received while calling the `iSend()` function on the source chain Gateway contract is the same nonce that is passed to this function. With this nonce, you can map the acknowledgment to a specific request.


### 2) `execFlag`

`execFlag` is a boolean value that tells you the status of your call or request.

### 3) `execData`

The `execData` parameter of the `iAck` function represents the encoded return value from the `iReceive` function on the destination chain, delivered as bytes. After decoding this data, it can be processed on the source chain based on the requirements of the application.