---
title: iReceive
sidebar_position: 2
---

# `iReceive` Function

Once a cross-chain request is initiated from the source chain, the payload will be delivered to the contract address specified in the `contractCalls` parameter on the destination chain. To handle this payload, a function must be implemented on the destination contract:

```javascript
function iReceive(
    string memory requestSender,
    bytes memory packet,
    string memory srcChainId
  ) external returns (bytes memory)
```

The `iReceive` function implemented on the destination chain contract receives the payload initiated from the source chain, along with some information such as the address of the contract that initiated the request, the payload itself, and the source chain ID. With this information, one can process the payload and complete the cross-chain transaction.

> **Warning:** If the IDapp.sol file from `@routerprotocol/evm-gateway-contracts/contracts` has been inherited, it is necessary to implement this function on the destination chain contract to ensure successful execution of the cross-chain request. Otherwise, the call will fail.
