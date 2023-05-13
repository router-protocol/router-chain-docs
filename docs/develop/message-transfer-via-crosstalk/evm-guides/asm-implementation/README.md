---
title: ASM Implementation
sidebar_position: 1
---

:::info
To understand how Router ASM works refer [here](../../message-transfer-via-crosstalk/key-concepts/additional-security-modules#how-does-an-asm-work).
:::

The function signature named `verifyCrossChainRequest` is present in the `IAdditionalSecurityModule` interface. This function serves to provide additional security for a specific cross-chain flow.

```javascript
function verifyCrossChainRequest(
      uint256 requestIdentifier,
      uint256 requestTimestamp,
      string calldata requestSender,
      string calldata srcChainId,
      bytes calldata packet,
      address handler
) external returns (bool);
```

When a request is received on the destination chain, the `verifyCrossChainRequest` function selector is called on the specified ASM address before executing the user's contract calls. The ASM implementation can return true/false for instantly validating/invalidating the request. However, if they require more time for request validation, they can revert the request from their ASM.

As mentioned earlier, if this function returns `true`, the execution of the user contract calls will continue. If the return value is `false`, the user contract calls execution will be skipped. If the ASM implementation reverts the request, then the transaction will be reverted, and no state will be modified on the Gateway as well.

The ASM module can revert the request until it is able to validate/invalidate the request. This will ensure that the application-level validation is completed before a cross-chain request is executed on the Gateway contract and sent to the user's destination contract.

Since this function can called from the Gateway contract only, it must have the following security check.

```javascript
require(msg.sender == <the Gateway contract address>, "Caller is not Gateway");
```

In this function selector, there are 6 arguments. Within this function, any possible business logic or validation can be added in these arguments. Each argument has its own purpose in the `verifyCrossChainRequest` request:

1. `requestIdentifier` - The event nonce is a unique identifier of the request. It is added by the source chain's Gateway contract.
2. `requestTimestamp` - This is the request timestamp when a request is added/verified on the Router chain.
3. `requestSender` - This is the address of the application's contract on the source chain in string format.
4. `srcChainId` - This is the chain ID of the chain from which the request to the Router chain was initiated.
5. `packet` - This is the payload, i.e., the data to be transferred to the destination chain.
6. `handler` - This is the address of the application's smart contract on the destination chain in address format.

### Important Notes

- For ASMs to work, you need to import `IAdditionalSecurityModule.sol` file from `@routerprotocol/evm-gateway-contracts` and inherit it into your ASM. You can use either one of the following commands for the same:

  ```bash
  yarn add @routerprotocol/evm-gateway-contracts@1.1.11
  ```

  ```bash
  npm install @routerprotocol/evm-gateway-contracts@1.1.11
  ```

- `IAdditionalSecurityModule` is the interface that contains selectors for the `verifyCrossChainRequest` functions.
- Add your business logic into these functions and you're done. You just need to provide the address for this ASM contract deployed on the destination chain while initiating the cross-chain request on the source chain.
