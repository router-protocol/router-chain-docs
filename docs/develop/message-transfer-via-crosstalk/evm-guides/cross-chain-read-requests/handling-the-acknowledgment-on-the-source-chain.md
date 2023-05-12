---
title: Handling the Acknowledgment on the Source Chain
sidebar_position: 2
---

Once the read request is executed on the destination chain, the requested data is sent along with an acknowledgment to the source chain. To handle the acknowledgment, developers need to include an `iAck()` function in their contract.

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  )
```

This function will have three parameters, namely:

### 1. `requestIdentifier`

The nonce received while calling the `iSend()` function on the source chain Gateway contract is the same nonce that is passed to this function. Using this nonce, you can verify whether a particular request was executed on the destination chain.

### 2. `execFlag`

`execFlag` is a boolean value that tells you the status of your read request.

### 3. `execData`

The `execData` parameter contains the result of all the read calls made in a read request, encoded in bytes. After decoding this data, it can be processed on the source chain as per the requirements of the application.