---
title: ASM Implementation
sidebar_position: 1
---

:::info
To understand how Router ASM works, refer to this [link](../../message-transfer-via-crosstalk/key-concepts/additional-security-modules#how-does-an-asm-work).
:::

The function `verify_cross_chain_request` enhances security for a specific cross-chain flow.

When a request is received on the destination chain, the `verify_cross_chain_request` function is invoked on the specified ASM (Application Security Module) address before executing the user's contract calls. The ASM can return either `true` or `false` to instantly validate or invalidate the request. If further time is needed for validation, the ASM can revert the request.

If the function returns `true`, the execution of the user contract calls will proceed. If it returns `false`, the contract calls will be skipped. Should the ASM implementation revert the request, the transaction will be rolled back, and no state changes will occur on the Gateway.

The ASM module can continue to revert requests until it can confidently validate or invalidate them. This ensures that application-level validation is completed before any cross-chain request is executed on the Gateway contract and sent to the destination contract.

```rust
public entry fun verify_cross_contract_request(
    self: &mut AsmContract, 
    gateway_contract_obj: &mut gateway_contract::GatewayContract, 
    sent: Receiving<gateway_contract::ValidateAsm>, 
    ctx: &mut TxContext
)
```

In this function selector, there are 6 arguments that can be retrieved by calling `get_verify_cross_chain_request_args`. Within this function, any necessary business logic or validation can be added using these arguments. Each argument has its own purpose in the `verify_cross_chain_request` request:

```rust
public fun get_verify_cross_chain_request_args(self: &ValidateAsm): (
    u256, 
    u256,     
    String, 
    String, 
    vector<u8>, 
    address, 
    address
)
```

##### Return Arguments:

* `request_identifier`: A unique identifier of the request. It is added by the source chain's Gateway contract.
* `request_timestamp`: Timestamp when a request is added/verified on the Router Chain.
* `request_sender`: The address of the application's contract on the source chain, represented as a string.
* `src_chain_id`: The chain ID of the src chain, in string format.
* `packet`: dst packet bytes
* `dapp_module_address`: dapp package id
* `dapp_object_id`: dapp state id

After validation, the ASM must call the `validate_asm` function in the gateway contract, where the valid state determines if the request is valid or not.

```rust
public fun validate_asm(
    self: &mut GatewayContract, 
    validate_asm: ValidateAsm, 
    valid: bool,
    ctx: &mut TxContext
)
```

