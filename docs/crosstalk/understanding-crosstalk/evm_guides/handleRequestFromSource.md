---
title: handleRequestFromSource
sidebar_position: 2
---

# `handleRequestFromSource` Function

The cross-chain request initiated from the source chain will deliver the payload to the destination contract address specified in the contractCalls parameter. On the destination contract, a function needs to be implemented to handle this payload:

```javascript
function handleRequestFromSource(
	  bytes memory srcContractAddress,
	  bytes memory payload,
	  string memory srcChainId,
	  uint64 srcChainType
) external returns (bytes memory)
```

In this function, you will get the address of the contract that initiated this request from the source chain, the payload you created on the source chain, the source chain ID, and the source chain type. After receiving this information, you can process your payload and complete your cross-chain transaction.

> **Warning:** This function is necessary to implement on your contract on the destination chain; otherwise, the call will fail.
