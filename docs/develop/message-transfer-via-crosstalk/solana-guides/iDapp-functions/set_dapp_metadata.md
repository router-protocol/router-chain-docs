---
title: set_dapp_metadata
sidebar_position: 1
---

* To facilitate cross-chain transactions, it is necessary to cover the fees on the Router Chain. This is achieved using the set_dapp_metadata function available in the Gateway contracts. 
* Once the `fee_payer_address` is set, the designated fee payer must approve the request to act as the fee payer on the Router Chain. Without this approval, dApps will not be able to execute any cross-chain transactions.
* It's important to note that any fee refunds resulting from these transactions will be credited back to the dApp's `fee_payer_address` on the Router Chain. 

### Prefix:

```rust
pub const GATEWAY_ACCOUNT: &[u8] = b"gateway_account";
pub const DAPP_ACCOUNT: &[u8] = b"dapp_account";
```

```rust
pub fn set_dapp_metadata(
    ctx: Context<SetDappMetadata>,
    fee_payer_address: String,
    program_id: Pubkey,
    program_account_id: Pubkey,
) -> Result<()> 
```

##### Parameters:

* `fee_payer_address`: The account responsible for covering the transaction fees for any cross-chain requests originating from the dApp.
* `program_id`: The dapp program id for which set_dapp_metadata is done.
* `program_account_id`: The dapp program account.


#### Account Context:
```rust
#[event_cpi]
#[derive(Accounts)]
pub struct SetDappMetadata<'info> {
    #[account(mut, seeds = [GATEWAY_ACCOUNT], bump = gateway_account.gateway_account_bump)]
    pub gateway_account: Account<'info, GatewayAccount>,
    #[account()]
    pub dapp_signer_account: Signer<'info>,
    #[account(init_if_needed, seeds = [DAPP_ACCOUNT, dapp_signer_account.key.as_ref()], bump, payer = fee_payer_account, space = DISCRIMINATOR_SIZE + DappAccount::INIT_SPACE)]
    pub dapp_account: Account<'info, DappAccount>,
    #[account(mut)]
    pub fee_payer_account: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

:::caution
Without creating dApp accounts via the set_dapp_metadata function, it is not possible to make an i_send call.
:::
