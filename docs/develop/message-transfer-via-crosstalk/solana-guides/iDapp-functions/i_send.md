---
title: i_send
sidebar_position: 2
---

The `i_send` function is used to send a cross-chain message or request. Before calling i_send, users must initialize a Request Packet Account and append the necessary message to it. The format of the request packet should follow this structure:

<details>
<summary>Making Request To Solana</summary>

The destination contract stores account information in the following order, encoded as hex:
* `[0..32]`: Destination Program ID
* `[32..64]`: Destination Program Account
* `[64..]`: All remaining accounts in order
  
</details>

### Request Packet Structure:

* [0..4]: Length of the destination contract's UTF-8 bytes (4 bytes)
* [4..4 + utf_dst_Contract_length]: UTF-8 encoded destination contract (variable length)
* [4 + utf_dst_Contract_length..8 + utf_dst_Contract_length]: Destination payload data length (4 bytes)
* [8 + utf_dst_Contract_length..8 + utf_dst_Contract_length + dst_payload_length]: Destination payload data (variable length)

### Prefix:

```rust
const PACKET_SEED_PREFIX: &[u8] = b"PA_";
pub const GATEWAY_ACCOUNT: &[u8] = b"gateway_account";
pub const DAPP_ACCOUNT: &[u8] = b"dapp_account";
```

```rust
pub fn i_send(
   ctx: Context<ISend>,
   packet_seed: Vec<u8>,
   version: u128,
   route_amount: u64,
   route_recipient: String,
   dest_chain_id: String,
   request_metadata: Vec<u8>,
) -> Result<u128>
```

##### Parameters:

* `packet_seed`: The seed for the Request Packet Account, used to generate a Program Derived Address (PDA) for storing the request packet. This must be initialized prior to calling i_send.
* `version`: The current version of the Gateway contract, which can be obtained by reading the Gateway Account. Versions may change when the encoding of request_metadata changes. However, previous versions are still supported for backward compatibility with iDapps.
* `route_amount`: The amount of ROUTE tokens to be transferred to the destination chain.
Note: If a non-zero route_amount is provided, additional accounts like signer_associate_account, mint, associated_token_program, and token_program (optional) are required.
* route_recipient: The recipient's address on the destination chain to receive the ROUTE tokens.
If the ROUTE token transfer is not required, this parameter can be set to an empty string ("").
* `dest_chain_id`: The chain ID of the destination chain, in string format.
* `request_metadata`: A byte-encoded string that includes various cross-chain request parameters, avoiding the need for on-chain encoding. This metadata is dependent on the destination chain ID and includes the following information:

###### Request Metadata Parameters:

1. `dest_gas_limit`: Gas limit for executing the request on the destination chain.
2. `dest_gas_price`: Gas price of the destination chain. Can be set to 0 if you want the Router Chain to estimate the gas price.
3. `ack_gas_limit`: Gas limit for executing the acknowledgment on the source chain.
4. `ack_gas_price`: Gas price of the source chain. Set to 0 to have it estimated by the Router Chain.
5. `relayer_fees`: Fee to be paid to the Router Chain relayers. If set too low, it will be automatically adjusted by the Router Chain. Setting 0 will use the minimum fee required.
6. `ack_type`: Defines the type of acknowledgment:
   * 0: No acknowledgment
   * 1: Acknowledgment only on successful execution.
   * 2: Acknowledgment only on failure.
   * 3: Acknowledgment regardless of success or failure.
7. `is_read_call`: Set to `true` if the request is a read-only call on the destination chain.
8. `asm_address`: The address of the ASM Module on the destination chain for added security.

<details>
<summary>Metadata Construction</summary>

You can construct the request_metadata either in Rust or in JavaScript/TypeScript using the provided functions.

###### Rust Implementation:

```rust
fn get_request_metadata(
   dest_gas_limit: u64,
   dest_gas_price: u64,
   ack_gas_limit: u64,
   ack_gas_price: u64,
   relayer_fees: U128,
   ack_type: u8,
   is_read_call: bool,
   asm_address: String
) -> Vec<u8> {
   let mut request_metadata: Vec<u8> = vec![];
   request_metadata.append(&mut dest_gas_limit.to_be_bytes().to_vec());
   request_metadata.append(&mut dest_gas_price.to_be_bytes().to_vec());
   request_metadata.append(&mut ack_gas_limit.to_be_bytes().to_vec());
   request_metadata.append(&mut ack_gas_price.to_be_bytes().to_vec());
   request_metadata.append(&mut u128::from(relayer_fees).to_be_bytes().to_vec());
   request_metadata.append(&mut ack_type.to_be_bytes().to_vec());
   request_metadata.append(&mut vec![if is_read_call { 1 } else { 0 }]);
   request_metadata.append(&mut asm_address.as_bytes().to_vec());

   request_metadata
}
```

###### JavaScript/TypeScript Implementation:

```javascript
function getRequestMetadata(
  destGasLimit: number,
  destGasPrice: number,
  ackGasLimit: number,
  ackGasPrice: number,
  relayerFees: string,
  ackType: number,
  isReadCall: boolean,
  asmAddress: string
): string {
  return ethers.utils.solidityPack(
    [
      'uint64',
      'uint64',
      'uint64',
      'uint64',
      'uint128',
      'uint8',
      'bool',
      'string',
    ],
    [
      destGasLimit,
      destGasPrice,
      ackGasLimit,
      ackGasPrice,
      relayerFees,
      ackType,
      isReadCall,
      asmAddress,
    ]
  );
}
```

</details>


##### Account Context:

```rust
#[event_cpi]
#[derive(Accounts)]
#[instruction(packet_seed: Vec<u8>)]
pub struct ISend<'info> {
    #[account(mut, seeds = [GATEWAY_ACCOUNT], bump = gateway_account.gateway_account_bump)]
    pub gateway_account: Account<'info, GatewayAccount>,
    #[account(mut, seeds = [PACKET_SEED_PREFIX, &packet_seed], bump)]
    pub request_packet: AccountLoader<'info, PacketAccount>,
    #[account()]
    pub dapp_signer_account: Signer<'info>,
    #[account(seeds = [DAPP_ACCOUNT, dapp_signer_account.key.as_ref()], bump)]
    pub dapp_account: Account<'info, DappAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed,
        associated_token::mint = mint,
        associated_token::authority = signer,
        payer = signer,
    )]
    pub signer_associate_account: Option<Box<InterfaceAccount<'info, TokenAccount>>>,
    #[account(
        mut,
        constraint = gateway_account.route_token == mint.key()
    )]
    pub mint: Option<Box<InterfaceAccount<'info, Mint>>>,
    pub associated_token_program: Option<Program<'info, AssociatedToken>>,
    pub token_program: Option<Interface<'info, TokenInterface>>,
    pub system_program: Program<'info, System>,
}
```

:::caution
Once the message is delivered on the destination chain, the user can delete the Request Packet Account. It can also be deleted before message delivery, but this will invalidate the request.
:::

