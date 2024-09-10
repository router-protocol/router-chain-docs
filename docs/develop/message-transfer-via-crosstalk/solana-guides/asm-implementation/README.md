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


```javascript
 pub fn verify_cross_chain_request(
    ctx: Context<VerifyCrossChainRequest>,
    request_identifier: u128,
    request_timestamp: u128,
    request_sender: String,
    src_chain_id: String,
    handler_program_pub_key: Pubkey,
    handler_account_pub_key: Pubkey,
) -> Result<bool>
```

In this function selector, there are 6 arguments. Within this function, any possible business logic or validation can be added using these arguments. Each argument has its own purpose in the `verify_cross_chain_request` request:

##### Parameters:

* `request_identifier`: A unique identifier of the request. It is added by the source chain's Gateway contract.
* `request_timestamp`: Timestamp when a request is added/verified on the Router Chain.
* `request_sender`: The address of the application's contract on the source chain, represented as a string.
* `src_chain_id`: The chain ID of the src chain, in string format.
* `handler_program_pub_key`: The program ID for which this request is intended.
* `handler_account_pub_key`: The program-derived account for the current handler program.

#### Account Context
```rust
#[derive(Accounts)]
pub struct VerifyCrossChainRequest<'info> {
    //CHECK: asm can have different storage structure, asm have to validate account
    #[account(mut)]
    pub asm_account: UncheckedAccount<'info>,
    // it is passed so that asm contract can validate if it is signed by authorised program id
    #[account()]
    pub gateway_authority: Signer<'info>,
    pub system_program: Program<'info, System>,
    //NOTE: all remaining account will be passed as well
}
```

`Security Note:` Since this function can be called from the Gateway contract only, it must validate `gateway_authority` with expected signer.

