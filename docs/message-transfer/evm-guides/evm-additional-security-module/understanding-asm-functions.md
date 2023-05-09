---
title: Understanding ASM functions
sidebar_position: 1
---

:::important
**To understand how ASM works refer [here](../../understanding-message-transfer/additionalSecurityModule).**
:::

The function signature named `verifyCrossChainRequest` is present in the `IAdditionalSecurityModule` ASM interface. This function serves to provide additional security for a specific flow.

```javascript
function verifyCrossChainRequest(
      uint256 eventNonce,
      uint256 requestTimestamp,
      string calldata srcContractAddress,
      string calldata srcChainId,
      bytes calldata packet,
      address handler
) external returns (bool);
```

The `verifyCrossChainRequest` function is designed to add extra security to the CrossChain flow. When a request is received on the destination chain, this function selector is called on the provided ASM address before executing the user contract calls. The ASM implementation can return true/false if the request is validated. However, if they require more time for request validation, they can revert the request from the ASM implementation.

As mentioned earlier, if this function returns `true`, the execution of the user contract calls will continue. If the return value is `false`, the user contract calls execution will be skipped. If the ASM implementation reverts the request, then the transaction will be reverted, and no state will be modified on the gateway as well.

The ASM module can revert the request until it validates the request. This will ensure that the dApp level request validation is completed before the request is executed on the gateway contract and the user contract calls.

Since this function is called from the gateway contract only, it must have the following security check.
  ```
  require(msg.sender == <the gateway contract address>, "Caller is not gateway");
  ```

- In this function selector, there are 6 arguments. Within this function, any possible business logic or validation can be added on the provided arguments. Each argument has its own purpose and meaning in the `verifyCrossChainRequest` request.
  1. `eventNonce`: The event nonce is a unique identifier of the request. It is added by the source chain's gateway contract.
  2. `requestTimestamp`: This is the request timestamp when this request was added/verified on the Router chain.
  3. `srcContractAddress`: This is the address of the application's smart contract on the source chain in string format.
  4. `srcChainId`: This is the chain id of the chain from which the request to the Router chain was initiated.
  5. `packet`: This is the payload. Payload is the data to be transferred to the destination chain that comes from the source chain contract.
  6. `handler`: This is the address of the application's contract on the destination chain in address format.

### How to do installation?

- For this ASM to work, you need to import `IAdditionalSecurityModule.sol` file from **`@routerprotocol/evm-gateway-contracts`**. You can use the following commands for the same:
  `yarn add @routerprotocol/evm-gateway-contracts@1.1.11`
  or
  `npm install @routerprotocol/evm-gateway-contracts@1.1.11`
- Inherit `IAdditionalSecurityModule` into your ASM. `IAdditionalSecurityModule` is the interface that contains selectors for `verifyCrossChainRequest` functions.
- Note that these functions can only be called by the gateway contract on the destination chain.
- Add your business logic into these functions and you're done.
- You just need to provide the address for this ASM contract deployed on the destination chain while initiating the cross-chain request on the source chain.
