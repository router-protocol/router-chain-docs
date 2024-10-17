---
title: Integrate ASM into Your Application
sidebar_position: 2
---

After building your ASM, you can deploy it on the desired chain. To send a request from the source chain to the destination chain, the user needs to call the following function signature.

```javascript
#[payable]
pub fn i_send(
   &mut self,
   version: U128,
   dest_chain_id: String,
   request_metadata: Vec<u8>,
   request_packet: Vec<u8>
) -> U128
```

In the above-mentioned code snippet, a `request_metadata` parameter needs to be constructed, which is an ABI-encoded parameter that can be generated on-chain or passed via arguments in a function call. Checkout this [section](../idapp-functions/i_send#5-request_metadata) to know more about the `request_metadata` parameter.

The last argument in the `request_metadata` parameter is `asm_address` in the string format. As the name suggests, this address points to the ASM contract on the destination chain. The `request_metadata` parameter can be created on-chain using the following function:

```javascript
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

   if is_read_call {
      request_metadata.append(&mut vec![1]);
   } else {
      request_metadata.append(&mut vec![0]);
   }
   request_metadata.append(&mut asm_address.as_bytes().to_vec());

   request_metadata
}
```

Alternatively, the `request_metadata` parameter can be created in TypeScript or JavaScript using the following function:

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
