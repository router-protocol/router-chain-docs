---
title: RouterMsg
sidebar_position: 2
---

The `RouterMsg` is an enum type inside the _router-wasm-bindings_. It contains one custom message type.

- CrosschainCall

In the following code snippet, we have added one implementation of CrosschainCall. This message is used to create an outbound request. In the outbound request, we can specify the destination chain id & type, the contract addresses & instructions, the request expiry timestamp, the atomicity flag, etc.

```jsx
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

The `CrosschainCall` is a data_type that helps the end user to create an cross-chain request to any destination chain. It has 6 arguments.

1. **version:** The chain type of the chain for which the outbound request from the Router Chain has been created.
2. **route_amount:** The route token amount that needs to be burned on the router chain and minted/unlocked on the destination chain.
3. **route_recipient:** The recipient address of the route token on the destination chain.
4. **destination_chain_id:** The chain ID of the chain for which the outbound request from the Router Chain has been created.
5. **request_metadata:** The request metadata is encodedPacked information that contains information destination gas limit & price, ack gas limit & price, relayer fee, ack_type, is_read_call and asm_address.
6. **request_packet:** The request packet is encoded information of destination address and payload. In example we can see how are we encoding this information.

Since the application developer is writing the application middleware contracts, they will have complete control over what kind of data is received in the payload. They can define the encoding and decoding of the data accordingly and perform any operation on the data.
