---
title: SudoMsg
sidebar_position: 1
---

The _SudoMsg_ is an enum and it has two different message types.

- HandleIReceive
- HandleIAck

In the following code snippet, we added the details at the field level of the _SudoMsg_. This will helps us in building an understanding of the data that will be coming either in the inbound request or in the outbound acknowledgment request.

```jsx
#[derive(Serialize, Deserialize, Clone, Debug, PartialEq, JsonSchema)]
#[serde(rename_all = "snake_case")]
pub enum SudoMsg {
    // Sudo msg to handle incoming requests from other chains
    HandleIReceive {
        // the inbound initiator application contract address
        request_sender: String,
        // inbound request src chain id
        source_chain_id: String,
        // inbound request event nonce
        request_identifier: u64,
        // the inbound request instructions in base64 format
        payload: Binary,
    },
    // Sudo msg to handle outbound message acknowledgment
    HandleIAck {
        // cross-chain request nonce
        request_identifier: u64,
        // cross-chain request contract call execution status
        exec_flag: u64,
        // cross-chain request contract call execution
        exec_data: Binary,
        // excess fee refunded amount
        refund_amount: Coin,
    },
}
```

The sudo function is one of the entry-point in a cosmwasm contract. It can be called internally by the chain only. In Router Chain, the developer needs to implement this sudo function to receive an incoming request. Here, in the following code snippet, we have shown the sample sudo function implementation.

Developers can have any sort of business logic inside the _handle_sudo_request_ and _handle_sudo_ack_ functions.

```jsx
// import router binding message
use router_wasm_bindings::{RouterMsg, SudoMsg};

#[cfg_attr(not(feature = "library"), entry_point)]
pub fn sudo(deps: DepsMut, _env: Env, msg: SudoMsg) -> StdResult<Response<RouterMsg>> {
    match msg {
        // Sudo msg to handle incoming requests from other chains
        SudoMsg::HandleIReceive {
            request_sender,
            src_chain_id,
            request_identifier,
            payload,
        } => handle_sudo_request(
            deps,
            env,
            request_sender,
            src_chain_id,
            request_identifier,
            payload,
        ),
        // Sudo msg to handle outbound message acknowledgment
        SudoMsg::HandleIAck {
            request_identifier,
            exec_flag,
            exec_data,
            refund_amount,
        } => handle_sudo_ack(
            deps,
            env,
            request_identifier,
            exec_flag,
            exec_data,
            refund_amount,
        ),
    }
}
```

<details>
<summary><b>HandleIReceive</b></summary>

The sudo message `HandleIReceive` contains 4 arguments. This sudo function gets called when an inbound request comes for your middleware contract. We can handle this sudo request in any possible way or even skip it. As you can see in the code snippet, a function `handle_sudo_request` has been created to handle the incoming inbound request in the cosmwasm contact. Within this function, you can apply any logic to the payload from the incoming request before creating the request for the destination chain. Each field has its own purpose and meaning in the `HandleIReceive` request.

1. **request_sender:** The application contract address on the source chain from which the request to the Router chain was sent.
2. **source_chain_id:** The chain ID of the chain from which the inbound request to the Router chain has been initiated.
3. **request_identifier:** The request identifier is a unique identifier of the request that is added by the source chain's Gateway contract.
4. **payload:** The payload comes from the source chain contract.

</details>

<details>
<summary><b>HandleIAck</b></summary>

The sudo message `HandleIAck` has 4 arguments. This sudo function gets called when the acknowledgment is received by the middleware contract on the Router chain post-execution of the contract call on the destination chain. We can handle this sudo request in any possible way or even skip it. As you can see in the code snippet, the function `handle_sudo_ack` has been created to handle the incoming acknowledgment request in the cosmwasm contact. Each field has its own purpose and meaning in the `HandleIAck` request.

1. **request_identifier:** The unique and incremented integer value for the outbound request.
2. **exec_flag:** The execution status flag for the contract call which was made on the destination chain.
3. **exec_data:** The execution data for all the requests executed on the destination chain.
4. **refund_amount:** The refunded fee amount is the extra fee that we have passed for the destination side contract execution.

</details>
