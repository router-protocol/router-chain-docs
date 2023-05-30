---
title: RouterMsg
sidebar_position: 1
---

The `RouterMsg` is an enum inside `router-wasm-bindings`. It contains one custom message type - `CrosschainCall`.

```javascript
// import router binding message
use router_wasm_bindings::{RouterMsg, SudoMsg};
use router_wasm_bindings::types::{
    AckType, RequestMetaData,
};
use cosmwasm_std::{SubMsg, SubMsgResult, Uint128};

let request_packet: Bytes = encode(&[
    Token::String(destination_address.clone()),
    Token::Bytes(payload),
]);
let request_metadata: RequestMetaData = RequestMetaData {
    dest_gas_limit: gas_limit,
    dest_gas_price: gas_price,
    ack_gas_limit: 300_000,
    ack_gas_price: 10_000_000,
    relayer_fee: Uint128::zero(),
    ack_type: AckType::AckOnBoth,
    is_read_call: false,
    asm_address: String::default(),
};

let i_send_request: RouterMsg = RouterMsg::CrosschainCall {
    version: 1,
    route_amount,
    route_recipient,
    dest_chain_id: destination_chain_id,
    request_metadata: request_metadata.get_abi_encoded_bytes(),
    request_packet,
};

let cross_chain_sub_msg: SubMsg<RouterMsg> = SubMsg {
    id: CREATE_OUTBOUND_REPLY_ID,
    msg: i_send_request.into(),
    gas_limit: None,
    reply_on: ReplyOn::Success,
};
let res = Response::new()
    .add_submessage(cross_chain_sub_msg.into())
Ok(res)
```

The `CrosschainCall` is a data type that helps end users create a cross-chain request to any destination chain. It takes 6 arguments:

**1) `version` -** The network type of the chain to which the request needs to be sent. 

**2) `route_amount` -** The ROUTE token amount that needs to be sent to the destination chain. To send ROUTE tokens to the specified destinaton chain, ROUTE will be burnt on the Router chain and minted on the destination chain.

**3) `route_recipient` -** The recipient address of the ROUTE token on the destination chain.

**4) `destination_chain_id` -** The network ID of the chain to which the request needs to be sent. 

**5) `request_metadata` -** The request metadata is encoded data that includes `dest_gas_limit`, `dest_gas_price`, `ack_gas_limit`, `ack_gas_price`, `relayer_fee`, `ack_type`, `is_read_call` and `asm_address`. Further details for each one of these parameters can be found [here](../../near-guides/iDapp-functions/i_send#3-request_metadata).

**6) `request_packet` -** The request packet is encoded data that includes `destination_address` and `payload`. In the example given above, you can see how this encoding needs to be performed. Further detals for both of these parameters can be found [here](../../near-guides/iDapp-functions/i_send#4-request_packet). 

