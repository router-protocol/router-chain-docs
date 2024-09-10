---
title: i_receive
sidebar_position: 3
---

The cross-chain request initiated from the source chain will deliver the payload to the destination contract address specified in the `contractCalls` parameter. On the destination contract, a function must be implemented to handle this payload:

```rust
pub fn i_receive(
    ctx: Context<DappIReceive>,
    request_sender: String,
    src_chain_id: String,
) -> Result<Vec<u8>>
```

#### Parameters:
* `request_sender`: The contract that initiated the request from the source chain.
* `src_chain_id`: The source chain id from where the cross-chain request originated.

#### Account Context
```rust
#[derive(Accounts)]
pub struct DappIReceive<'info> {
    //CHECK: dapp can have different storage structure, dapp have to validate account
    #[account(mut)]
    pub dapp_account: UncheckedAccount<'info>,
    #[account()]
    pub packet_account: AccountLoader<'info, PacketAccount>,
    #[account()]
    pub gateway_authority: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

#### Account Info:
* `packet_account`: Contains the payload being sent from the source chain.
* `gateway_authority`: The authorized signer by the Gateway contract to ensure the request is valid.

:::caution
It is mandatory to include this function in your contract on the destination chain; otherwise, the request will fail.
:::
