---
title: burn_and_call_gateway
sidebar_position: 2
---

# `burn_and_call_gateway` Function

```javascript
#[payable]
pub fn burn_and_call_gateway(
   &mut self,
   is_app_token_payer: bool,
   amount: U128,
   msg: Base64VecU8,
) -> Promise
```

This is a function in the Router token contract on the Near chain. This is used to transfer Router tokens across chain with or without instructions. These parameters include:

### **1. is_app_token_payer:**

The boolean flag determines whose Router tokens will be used to send them to the destination chain. If the flag is set to false, the end user who invokes the function will be responsible for paying for the Router tokens. Conversely, if the flag is set to true, the application that calls the function will be responsible for paying for the Router tokens.

### **2. amount:**

The amount of Router tokens to be transferred to the destination chain.

### **3. msg**

This is a base64 encoded string which consists of the `ISendParams` parameters to be sent to the gateway. The ISendParams consists of the following parameters:

```javascript
#[derive(Debug, Clone, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
#[serde(crate = "near_sdk::serde")]
pub struct ISendParams {
    pub version: U128,
    pub route_recipient: String,
    pub dest_chain_id: String,
    pub request_metadata: Vec<u8>,
    pub request_packet: Vec<u8>,
}

```

All of these parameters are explained in the [previous](./i_send) section. To encode these parameters into base64 string, you can use the following function:

```javascript
use near_sdk::{serde_json};
use near_sdk::base64::{encode};

fn encode_base64(
   version: U128,
   route_recipient: String,
   dest_chain_id: String,
   request_metadata: Vec<u8>,
   request_packet: Vec<u8>
) {
    let i_send_params: ISendParams = ISendParams {
        version,
        route_recipient,
        dest_chain_id,
        request_packet,
        request_metadata
    };

    let json_str = serde_json::to_string(&i_send_params);
    println!("{}", encode(json_str.unwrap()));
}
```

After you call this function, a cross-chain request is created and relayed via router chain to the destination chain where the `i_receive` function is called on the destination contract address passed in the `request_packet`.
