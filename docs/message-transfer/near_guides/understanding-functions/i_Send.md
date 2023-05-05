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

By setting the parameters per their requirements, users can use this function to exercise a wide range of functionalities when it comes to cross-chain message passing. These parameters include:

### **1. version:**

Current version of Gateway contract which can be queried from the Gateway contract using the following function.

```javascript
pub fn get_current_version(&self) -> U128
```

This would change whenever the encoding of **request_metadata** (parameter #5) changes. However the Router Chain will support earlier versions of encoding too for iDapps to always remain compatible.

### **2. dest_chain_id:**

Chain ID of the destination chain in string format.

### **3. request_metadata:**

Some static information for the request. This is created so that iDapps don't have to encode it on-chain, they can just send it as a parameter to their iDapp depending on the destination chain Id passed by the user. The request metadata is a bytes encoded string consisting of the following parameters:

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

It can be achieved by adding following function in your contract:

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

1. **dest_gas_limit:** Gas limit required for execution of the request on the destination chain.
2. **dest_gas_price:** Gas price of the destination chain. This can be calculated using the RPC of destination chain. However, if you don't want to calculate it, just send `0` in its place and Router Chain will handle the real time gas price for you.
3. **ack_gas_limit:** Gas limit required for execution of the acknowledgement coming from the destination chain back on the source chain.
4. **ack_gas_price:** Gas price of the destination chain. This can be calculated using the RPC of source chain. However, if you don't want to calculate it, just send `0` in its place and Router Chain will handle the real time gas price for you.
5. **relayer_fees:** This is similar to priority fees that one pays on other chains. Router chain relayers execute your requests on the destination chain. So if you want your request to be picked up by relayer faster, this should be set to a higher number. If you pass really low amount, the Router chain will adjust it to some minimum amount.
6. **ack_type:** When the contract calls have been executed on the destination chain, the iDapp has the option to get an acknowledgement back to the source chain.

   We provide the option to the user to be able to get this acknowledgement from the router chain to the source chain and perform some operation based on it.

   1. **ack_type = 0:** You don't want the acknowledgement to be forwarded back to the source chain.
   2. **ack_type = 1:** You only want to receive the acknowledgement back to the source chain in case the calls executed successfully on the destination chain and perform some operation after that.
   3. **ack_type = 2:** You only want to receive the acknowledgement back to the source chain in case the calls errored on the destination chain and perform some operation after that.
   4. **ack_type = 3:** You only want to receive the acknowledgement back to the source chain in both the cases (success and error) and perform some operation after that.

7. **is_read_call:** We provide you the option to query a contract from another chain and get the data back on the source chain through acknowledgement. If you just want to query a contract on destination chain, set this to `true`.
8. **asm_address:** We also provide modular security framework for creating an additional layer of security on top of the security provided by Router Chain. These will be in the form of smart contracts on destination chain. The address of this contract needs to be passed in the form of bytes in this variable. Documentation for ASM can be found [here](../additionalSecurityModule.md)

### **4. request_packet:**

This is bytes encoded string consisting of two parameters:

```javascript
dest_contract_address: String,
payload: Vec<u8>
```

1. **dest_contract_address:** This is the address of the smart contract on the destination chain which will handle the payload that you send from the source chain to the destination chain.
2. **payload:** This is bytes containing the payload that you want to send to the destination chain. This can be anything depending on your utility. For example, in case of NFT transfers, it can contain the NFT ID, the recipient address etc.

   This is the data that you will receive on the destination chain as packet. So you can pass any data or message that you want to pass to the destination chain.

   For transferring an NFT with some NFT ID and some recipient address, the request packet can be created using the following code:

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

After you call this function, a cross-chain request is created and relayed via router chain to the destination chain where the `i_receive` function is called on the destination contract address passed in the `request_packet`.
