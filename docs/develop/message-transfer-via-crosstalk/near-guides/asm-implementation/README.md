---
title: ASM Implementation
sidebar_position: 1
---

:::info
To understand how Router ASM works, refer to this [link](../../message-transfer-via-crosstalk/key-concepts/additional-security-modules#how-does-an-asm-work).
:::

The function signature named `verify_cross_chain_request` serves to provide additional security for a specific cross-chain flow.

```javascript
fn verify_cross_chain_request(
    &self,
    request_identifier: U128,
    request_timestamp: U128,
    src_chain_id: String,
    request_sender: String,
    packet: Vec<u8>,
    handler: AccountId,
) -> bool;
```

When a request is received on the destination chain, the `verify_cross_chain_request` function selector is called on the specified ASM address before executing the user's contract calls. The ASM implementation can return `true`/`false` for instantly validating/invalidating the request. However, if they require more time for request validation, they can revert the request from their ASM.

As mentioned earlier, if this function returns `true`, the execution of the user contract calls will continue. If the return value is `false`, the execution of the user's contract calls will be skipped. If the ASM implementation reverts the request, then the transaction will be reverted, and no state will be modified on the Gateway as well.

The ASM module can revert the request until it is able to validate/invalidate the request. This will ensure that the application-level validation is completed before a cross-chain request is executed on the Gateway contract and sent to the user's destination contract.

Since this function can be called from the Gateway contract only, it must have the following security check.

```javascript
if env::predecessor_account_id() != self.gateway.clone() {
  env::panic_str("Caller is not Gateway");
}
```

In this function selector, there are 6 arguments. Within this function, any possible business logic or validation can be added using these arguments. Each argument has its own purpose in the `verify_cross_chain_request` request:

**1) `request_identifier` -** A unique identifier of the request. It is added by the source chain's Gateway contract.

**2) `request_timestamp` -** Timestamp when a request is added/verified on the Router chain.

**3) `request_sender` -** Address of the application's contract on the source chain in string format.

**4) `src_chain_id` -** Network ID of the chain from which the request to the Router chain was initiated.

**5) `packet` -** This is the payload, i.e., the data to be transferred to the destination chain.

**6) `handler` -** Address of the application's smart contract on the destination chain in address format.