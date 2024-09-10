---
title: packet_account
sidebar_position: 1
---

## Packet Account

The Packet Account is used to store request packet information or messages that need to be delivered to the `i_receive` or `i_ack` functions of the Gateway contract.


### Packet Account Structure:

The Packet Account is serialized as follows:

1. `[0..32] - Creator`: The first 32 bytes represent the account creator.
2. `[33] - Blocked Status`: The 33rd byte indicates whether the account is blocked or not.
If the account is blocked, it can only be deleted.
3. `[34..37] - Packet Length`: Bytes 34 to 37 contain the length of the packet in little-endian format.
4. `[38..(37 + packet_length)] - Packet Data`: Starting from byte 38, the packet data is stored. The length of the data is determined by the packet_length field.

### Prefix:

```rust
const PACKET_SEED_PREFIX: &[u8] = b"PA_";
```

### Instructions:


1. `initialize_packet_account`

```rust
pub fn initialize_packet_account(
   ctx: Context<InitializePacketAccount>,
   seed: Vec<u8>,
   packet: Option<Vec<u8>>,
) -> Result<()> 
```

##### Description:
* Initializes a new Packet Account. The seed is used to generate a unique PDA (Program Derived Address), and an optional packet can be included. If no packet is passed, the packet length is set to 0.

##### Cost:
* Approximately `0.07216128 SOL`, which can be reclaimed upon deletion of the account. Only the creator of the account can delete it.

##### Parameters:

* `seed`: A unique identifier to generate the PDA.
* `packet`: Optional packet data. If None, the packet length is 0.

##### Account Context:

```rust
#[derive(Accounts)]
#[instruction(seed: Vec<u8>)]
pub struct InitializePacketAccount<'info> {
    #[account(
        init, 
        payer=signer, 
        seeds=[
            PACKET_SEED_PREFIX,
            &seed
        ], 
        bump, 
        space= PacketAccount::SIZE
    )]
    pub packet_account: AccountLoader<'info, PacketAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>,
}
```

<br/>
<hr/>
<br/>


2. `append_packet_account`
   
```rust
pub fn append_packet_account(
   ctx: Context<UpdatePacketAccount>,
   seed: Vec<u8>,
   packet: Vec<u8>,
) -> Result<()> 
```

##### Description:
* Appends additional data to an existing Packet Account. The seed used during initialization must be provided to locate the correct account.

##### Parameters:

* `seed`: The same seed used when initializing the Packet Account.
* `packet`: The data to append to the existing packet account.

##### Account Context:

```rust
#[derive(Accounts)]
#[instruction(seed: Vec<u8>)]
pub struct UpdatePacketAccount<'info> {
    #[account(
        mut,
        seeds=[PACKET_SEED_PREFIX, &seed], 
        bump, 
    )]
    pub packet_account: AccountLoader<'info, PacketAccount>,
    #[account()]
    pub signer: Signer<'info>,
}
```
<br/>
<hr/>
<br/>

3. `update_packet_account`
   
```rust
pub fn update_packet_account(
   ctx: Context<UpdatePacketAccount>,
   seed: Vec<u8>,
   slice: Vec<u8>,
   from: u64,
   to: u64,
) -> Result<()> 
```

##### Description:
* Updates a portion of the packet data in an existing Packet Account, replacing the data from index `from` to `to`.


##### Parameters:

* `seed`: The same seed used during initialization.
* `slice`: The data to replace the existing packet content.
* `from`: The starting index of the data to replace.
* `to`: The ending index of the data to replace.

<br/>
<hr/>
<br/>


4. `update_packet_creator`
   
```rust
pub fn update_packet_creator(
   ctx: Context<UpdatePacketAccount>,
   seed: Vec<u8>,
   new_owner: Pubkey,
) -> Result<()> 
```

##### Description:
* Allows the creator of the Packet Account to transfer ownership to a new public key (`new_owner`).

##### Parameters:
* `seed`: The same seed used during initialization.
* `new_owner`: The new owner (`public key`) of the packet.

<br/>
<hr/>
<br/>

5. `delete_packet_account`
   
```rust
pub fn delete_packet_account(
    _ctx: Context<DeletePacketAccount>, 
    _seed: Vec<u8>
) -> Result<()> 
```

##### Description:
* Deletes the Packet Account and refunds the remaining SOL back to the signer. Only the original creator of the account can perform this operation.

##### Parameters:
* `seed`: The same seed used during initialization.


##### Account Context:

```rust
#[derive(Accounts)]
#[instruction(seed: Vec<u8>)]
pub struct DeletePacketAccount<'info> {
    #[account(
        mut, 
        seeds=[PACKET_SEED_PREFIX, &seed], 
        bump,
        constraint = packet_account.load()?.get_creator() == signer.key() @GatewayError::OnlyCreator,
        close = signer
    )]
    pub packet_account: AccountLoader<'info, PacketAccount>,
    #[account(mut)]
    pub signer: Signer<'info>,
}
```
<br/>
<hr/>


