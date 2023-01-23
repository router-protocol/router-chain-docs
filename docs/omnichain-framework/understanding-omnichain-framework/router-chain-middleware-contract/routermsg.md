---
title: RouterMsg
sidebar_position: 2
---

The `RouterMsg` is an enum type inside the *router-wasm-bindings*. It contains one custom message type.
- OutboundBatchRequests

In the following code snippet, one implementation of `OutboundBatchRequests` has been added. This message is used to create an outbound request. In the outbound request, you can specify the destination chain id & type, the contract addresses & instructions, the request expiry timestamp, the atomicity flag, etc.

```jsx
// import router binding message
use router_wasm_bindings::{RouterMsg, SudoMsg};
use router_wasm_bindings::types::{
    ChainType, ContractCall, OutboundBatchRequest, OutboundBatchResponse, OutboundBatchResponses,
};

let address: String = String::from("destination_contract_address");
let payload: Vec<u8> = let payload: Vec<u8> = b"sample payload data".to_vec();
// Single Outbound request with single contract call
let contract_call: ContractCall = ContractCall {
    destination_contract_address: address.clone().into_bytes(),
    payload,
};
let outbound_batch_req: OutboundBatchRequest = OutboundBatchRequest {
    destination_chain_type: ChainType::ChainTypeEvm.get_chain_code(),
    destination_chain_id: String::from("137"),
    contract_calls: vec![contract_call],
    relayer_fee: Coin {
        denom: String::from("route"),
        amount: Uint128::new(100_000u128),
    },
    outgoing_tx_fee: Coin {
        denom: String::from("route"),
        amount: Uint128::new(100_000u128),
    },
    is_atomic: false,
    exp_timestamp: 1673860261,
};
let outbound_batch_reqs: RouterMsg = RouterMsg::OutboundBatchRequests {
    outbound_batch_requests: vec![outbound_batch_req]
};

let res = Response::new()
    .add_message(outbound_batch_reqs);
Ok(res)
```

The `OutboundBatchRequest` is a data_type that helps the end user to create an outbound request to any destination chain. It has 7 arguments. 

1. **destination_chain_type:** The chain type of the chain for which the outbound request from the Router chain has been created.
2. **destination_chain_id**: The chain id of the chain for which the outbound request from the Router chain has been created.
3. **contract_calls**: An array of contract calls that need to be executed on the destination chain.  Each Contract Call contains a contract address and a payload for that contract execution.
4. **relayer_fee**: A fee that is going to the relayer service for relaying the request on the destination chain gateway contact.
5. **outgoing_tx_fee**: A fee that is required to generate an outbound request in the Router chain.
6. **is_atomic**: A boolean value that helps the destination chain gateway contact to understand the contract calls atomicity.
7. **exp_timestamp**: An expiry timestamp is a number value. If it is less than the current timestamp while execution on the destination chain, the contract calls will not be executed on the destination chain.

Since you are writing the application middleware contracts, you will have complete control over what kind of data is received in the payload. You can define the encoding and decoding of the data accordingly and perform any operation on the data.