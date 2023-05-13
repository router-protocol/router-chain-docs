---
title: i_send
sidebar_position: 1
---

# `i_send` Function

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





This function allows users to configure various aspects of cross-chain message passing based on their requirements. Some of the parameters that can be configured while calling this function include:

### 1) `version`

The current version of the Gateway contract which can be obtained by calling a specific function within the Gateway contract.

```javascript
pub fn get_current_version(&self) -> U128
```

This would change whenever the encoding of `request_metadata` (parameter #5) changes. However, to remain compatible with iDapps configured to work with previous versions, Router will also support earlier versions of encoding.

### 2) `dest_chain_id`

Chain ID of the destination chain in string format.

### 3) `request_metadata`

To avoid encoding on-chain, Router allows iDapps to send static information for a request as a parameter to their iDapp, which depends upon the destination chain ID provided by the user. This information is packaged into a byte-encoded string, known as the `request_metadata` which includes the following parameters:

```javascript
dest_gas_limit: u64,
dest_gas_price: u64,
ack_gas_limit: u64,
ack_gas_price: u64,
relayer_fees: U128,
ack_type: u8,
is_read_call: bool,
asm_address: String
```

It can be achieved by adding the following function in your contract:

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

**3.1) `dest_gas_limit` -** Gas limit required for execution of the request on the destination chain.

**3.2) `dest_gas_price` -** Gas price of the destination chain. This can be calculated using the RPC of destination chain. If you don’t want to calculate it, just send **0** in its place and the Router chain will estimate the real time gas price for you.

**3.3) `ack_gas_limit` -** Gas limit required for the execution of the acknowledgment on the source chain. This can be calculated using tools like [hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter).

**3.4) `ack_gas_price` -** Gas price of the source chain. This can be calculated using the RPC of source chain.

**3.5) `relayer_fees` -** This parameter functions similarly to the priority fees on other blockchain networks. Since the Router chain relayers handle the execution of cross-chain requests on the destination chain, setting a higher `relayer_fees` will increase the likelihood of your request being prioritized by relayers. If a very low `relayer_fees` is provided, the Router chain will automatically adjust it to the minimum required amount to ensure that it is executed. 

**3.6) `ack_type` -** When the contract calls have been executed on the destination chain, the destination chain Gateway contract sends an acknowledgent back to the Router chain. iDapps have the option to get this acknowledgment from the Router chain to the source chain and execute some operations based on the ack.
   - If `ack_type` = 0, the user doesn't want the acknowledgment to be forwarded back to the source chain.
   - If `ack_type` = 1, the acknowledgment is expected to be received only if the calls were successfully executed on the destination chain, and the user intends to perform some operation on the source chain after receiving the ack.
   - If `ack_type` = 2, an acknowledgment is needed only in case of an error occurring on the destination chain. This options also allows for execution of certain operations after receiving the ack.
   - If `ack_type` = 3, an acknowledgment is needed from the destination chain regardless of whether the call succeeds or fails, and some operations need to be performed based on the ack. 

**3.7) `is_read_call` -** Router provides dApps an option to query a contract on another chain and receive the data back on the source chain as an acknowledgment. If the intention is only to query a contract on the destination chain and not perform any write operation there, then set this option to `true`.

**3.8) `asm_address` -** As part of Router's modular security framework, developers can integrate an ASM module to add an extra layer of security on top of the infra-level security provided by the Router Chain. These modules will be in the form of smart contracts on the destination chain, and their addresses should be passed as bytes in this variable. Documentation for ASM can be found [here](../../key-concepts/additional-security-modules).

### 4) `request_packet`

This is bytes encoded string consisting of two parameters:

```javascript
dest_contract_address: String,
payload: Vec<u8>
```

**4.1) `dest_contract_address` -** This is the address of the destination chain's smart contract that will handle the payload sent from the source chain to the destination chain.

**4.2) `payload` -** Bytes containing the payload that you want to send to the destination chain. This can be anything depending on your utility. For example, in the case of NFT transfers, it can contain the NFT ID, the recipient address etc. 


In other words, payload is the data that you will receive on the destination chain as packet. For transferring an NFT with a specific NFT ID and recipient address, the request packet can be created using the following code:

   ```javascript
   use ethabi::{ ethereum_types::U256, encode, Token };

   pub fn get_request_packet(
      destination_contract_address: String
   ) -> Vec<u8> {
         // Here we are passing NFT ID and the recipient address as packet.
         // However you can pass any other data as well.
         let nft_id: u64 = 1;
         let recipient_address = "RECIPIENT_ADDRESS";

         let nft_id_u256: U256 = ethabi::ethereum_types::U256::from(ack_request_identifier);
         let nft_id_token: Token = Token::Uint(nft_id_u256);
         let recipient_token: Token = Token::String(recipient_address);

         let packet: Vec<u8> = encode(&[nft_id_token, recipient_token]);
         let packet_token = Token::Bytes(packet);
         let dest_contract_address_token: Token = Token::String(destination_contract_address);

         let request_packet: Vec<u8> = encode(&[dest_contract_address_token, packet_token]);

         request_packet
   }
   ```

   In this snippet, we are using the following version for ethabi:

   ```javascript
   use ethabi::{ ethereum_types::U256, encode, Token };
   ```

After you call this function, a cross-chain request is created and relayed via the Router chain to the destination chain where the `i_receive` function is called on the destination contract address passed in the `request_packet`.
