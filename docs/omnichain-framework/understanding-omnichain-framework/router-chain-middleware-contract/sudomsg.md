---
title: SudoMsg
sidebar_position: 1
---

The *SudoMsg* is an enum and it has two different message types.

- HandleInboundReq
- HandleOutboundAck

In the following code snippet, details at the field level of the `SudoMsg` have been added. This will give you an understanding of the data that will be coming either in the inbound request or in the outbound acknowledgment request.

```jsx
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum SudoMsg {
    // Sudo msg to handle incoming requests from other chains
    HandleInboundReq {
        // the inbound initiator application contract address
        sender: String,
        // inbound request src chain type
        chain_type: u32,
        // inbound request src chain id
        source_chain_id: String,
        // the inbound request instructions in base64 format
        payload: Binary,
    },
    // Sudo msg to handle outbound message acknowledgment
    HandleOutboundAck {
        // the outbound request initiator router address
        outbound_tx_requested_by: String,
        // outbound request destination chain type
        destination_chain_type: u32,
        // outbound request destination chain id
        destination_chain_id: String,
        // outbound batch request nonce
        outbound_batch_nonce: u64,
        // outbound request execution code info
        execution_code: u64,
        // outbound request execution status info
        execution_status: bool,
        // outbound request contract calls individual execution status
        exec_flags: Vec<bool>,
        // outbound request contract calls individual execution response
        exec_data: Vec<Binary>,
    },
}
```

The sudo function is one of the entry-point in a cosmwasm contract.
It can be called internally by the chain only. You need to implement this sudo function in Router Chain to receive an incoming request. Here, in the following code snippet, the sample sudo function implementation is shown.

You can have any sort of business logic inside the `handle_in_bound_request` and `handle_out_bound_ack_request` functions.

```jsx
# import router binding message
use router_wasm_bindings::{RouterMsg, SudoMsg};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn sudo(deps: DepsMut, _env: Env, msg: SudoMsg) -> StdResult<Response<RouterMsg>> {
    match msg {
        # Sudo msg to handle incoming requests from other chains
        SudoMsg::HandleInboundReq {
            sender,
            chain_type,
            source_chain_id,
            payload,
        } => handle_in_bound_request(deps, sender, chain_type, source_chain_id, payload),
        # Sudo msg to handle outbound message acknowledgment
        SudoMsg::HandleOutboundAck {
            outbound_tx_requested_by,
            destination_chain_type,
            destination_chain_id,
            outbound_batch_nonce,
            execution_code,
            execution_status,
            exec_flags,
            exec_data,
        } => handle_out_bound_ack_request(
            deps,
            outbound_tx_requested_by,
            destination_chain_type,
            destination_chain_id,
            outbound_batch_nonce,
            execution_code,
            execution_status,
            exec_flags,
            exec_data,
        ),
    }
}
```

<details>
<summary><b>HandleInboundReq</b></summary>

The sudo message `HandleInboundReq` contains 4 arguments. This sudo function gets called when an inbound request comes for your middleware contract. We can handle this sudo request in any possible way or even skip it. As you can see in the code snippet, a function `handle_in_bound_request` has been created to handle the incoming inbound request in the cosmwasm contact. Within this function, you can apply any logic to the payload from the incoming request before creating the request for the destination chain. Each field has its own purpose and meaning in the `HandleInboundReq` request. 

1. **sender**: the application contract address on the source chain from which the request to the Router chain was sent.
2. **chain_type**: The chain type of the chain from which the inbound request to the Router chain has been initiated
3. **source_chain_id**: The chain id of the chain from which the inbound request to the Router chain has been initiated.
4. **payload**: The payload comes from the source chain contract.

</details>

<details>
<summary><b>HandleOutboundAck</b></summary>

The sudo message `HandleOutboundAck` has 8 arguments. This sudo function gets called when the acknowledgment is received by the middleware contract on the Router chain post-execution of the contract calls on the destination chain. We can handle this sudo request in any possible way or even skip it. As you can see in the code snippet, function `handle_out_bound_ack_request` has been created to handle the incoming acknowldgement request in the cosmwasm contact. Each field has its own purpose and meaning in the `HandleOutboundAck` request. 

1. **outbound_tx_requested_by**: The address of the router chain contract that initiated the outbound request from the Router chain.
2. **destination_chain_type**:  The chain type of the chain for which the outbound request from the Router chain has been created.
3. **destination_chain_id**: The chain id of the chain for which the outbound request from the Router chain has been created.
4. **outbound_batch_nonce**: The unique and incremented integer value for the outbound request.
5. **execution_code**: The execution code is a number value that helps us in understanding the outbound request execution info on the destination chain.
6. **execution_status**: The status is a boolean value that helps us (with execution_code) in understanding the outbound request execution info on the destination chain.
7. **exec_flags**: The execution status flags for all the contract calls which were made on the destination chain. This will be an array of all the execution statuses (true/false) for each request on the destination chain.
8. **exec_data**: The execution data for all the requests executed on the destination chain.

</details>