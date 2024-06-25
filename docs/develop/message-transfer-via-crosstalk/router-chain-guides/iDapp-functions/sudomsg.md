---
title: SudoMsg
sidebar_position: 2
---

The `SudoMsg` is an enum with two different message types:

- `HandleIReceive` (akin to `iReceive` for EVM chains)
- `HandleIAck` (akin to `iAck` for EVM chains)

To have a better understanding of the format in which the data will be received, we have added field-level details of `SudoMsg`.

```javascript
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

The `sudo` function is one of the entry-points in a CosmWasm contract. For contracts on the Router Chain, you need to implement this function to receive any incoming request. It can be called internally by the chain only (just like `iReceive` and `iAck` on other chains can only be called by the Router Gateway contract). Sample implementation:

```javascript
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
Developers can implement their own business logic inside the `handle_sudo_request` and `handle_sudo_ack` functions.

<details>
<summary><b>HandleIReceive</b></summary>

The sudo message `HandleIReceive` contains 4 arguments. This message type is used whenever any generic cross-chain request is received. As you can see in the code snippet, a function `handle_sudo_request` has been created to handle the incoming request in the CosmWasm contact. Within this function, you can apply your custom logic to handle the payload.  Each field has its own purpose and meaning in the `HandleIReceive` request.

**1) `request_sender` -** The application contract address on the source chain from which the request to the Router Chain was sent.

**2) `source_chain_id` -** The network ID of the chain from which the cross-chain request to the Router Chain has been initiated.

**3) `request_identifier` -** A unique identifier of the request that is added by the source chain's Gateway contract.

**4) `payload` -** The payload received from the source chain contract. 

After handling the incoming cross-chain request, if you wish, you can generate an outgoing cross-chain reques. More about this is given [here](../../stateful-bridging).

</details>

<details>
<summary><b>HandleIAck</b></summary>

The sudo message `HandleIAck` has 4 arguments. This message type is used whenever any acknowledgment is received. As you can see in the code snippet, a function named `handle_sudo_ack` has been created to handle the incoming acknowledgment request in the CosmWasm contact. Each field has its own purpose and meaning in the `HandleIAck` request.

**1) `request_identifier` -** This is same nonce you receive while calling the `CrosschainCall` function on the Router Chain. 
Using this nonce, you can map the acknowledgmemnt to a particular request. 

**2) `exec_flag` -** A boolean value that tells you the status of your cross-chain request. 

**3) `exec_data` -** The execution data for all the contract calls executed on the destination chain.

**4) `refund_amount` -** The surplus fee that was sent for the destination side contract execution.

</details>

 