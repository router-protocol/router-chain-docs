---
title: i_send
sidebar_position: 2
---

The `i_send` function is used to send a cross-chain message or request. 

```rust
public fun i_send(    
    self: &mut GatewayContract,  
    // only owner can send mutable reference
    metadata: &mut Metadata,  
    version: u128,
    route_amount: u256,
    route_recipient: String,
    dest_chain_id: String,
    request_metadata: vector<u8>,
    request_packet: vector<u8>, 
    coin: &mut option::Option<Coin<SUI>>, 
    route: &mut option::Option<Coin<route::ROUTE>>,  
    ctx: &mut TxContext
): u256
```

##### Parameters:

* `metadata`: The metdata object that being created before.
* `version`: The current version of the Gateway contract, which can be obtained by reading the Gateway Account. Versions may change when the encoding of request_metadata changes. However, previous versions are still supported for backward compatibility with iDapps.
* `route_amount`: The amount of ROUTE tokens to be transferred to the destination chain.
Note: If a non-zero route_amount is provided, additional accounts like signer_associate_account, mint, associated_token_program, and token_program (optional) are required.
* `route_recipient`: The recipient's address on the destination chain to receive the ROUTE tokens.
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

*  `request_packet`: This is bytes encoded string consisting of two parameters:

###### Request Packet Parameters:

1. `destContractAddress`: This is the address of the destination chain's smart contract that will handle the payload sent from the source chain to the destination chain.
2. `payload`: Bytes containing the payload that you want to send to the destination chain. 

<details>
<summary>Request Packet Construction</summary>

```ts
function getRequestPacket(destinationContractAddress: string, packet: Uint8Array): string {
  return ethers.utils.defaultAbiCoder.encode(
    ["string", "bytes"],
    [destinationContractAddress, packet]
  );
}
```
</details>

* `coin`: If `i_send_fee` is greater than 0, the user must provide a SUI coin when making the call.
* `route`: If `route_amount` is greater than 0 and the user wants to transfer ROUTE tokens to the destination chain along with the packet, they must pass a ROUTE object. If no transfer is needed, this can be omitted.

