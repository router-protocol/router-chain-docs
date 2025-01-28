---
title: i_receive
sidebar_position: 3
---

The cross-chain request initiated from the source chain will deliver the payload to the destination contract address specified in the `contractCalls` parameter. On the destination contract, a function must be implemented to handle this payload:

```rust
public entry fun i_receive(
    self: &mut DappContract,
    gateway_contract_obj: &mut gateway_contract::GatewayContract,
    sent: Receiving<gateway_contract::ExecuteDappIReceive>,
    ctx: &mut TxContext
)
```

#### Parameters:

* `self`: The dapp package state object ID.
* `gateway_contract_obj`: The state ID of the gateway package.
* `sent`: The object being sent to the self object while making the i_receive call on the gateway contract.

To obtain the arguments required for the i_receive function, the contract should call `get_i_receive_args` in the gateway package. This function will return a tuple containing:

1. `request_Sender`: The address of the sender making the request.
2. `packet`: A vector of bytes (`vector<u8>`) representing the data packet.
3. `src_chain_id`: The source chain ID from which the request originated.

```rust
public fun get_i_receive_args(self: &ExecuteDappIReceive): (String, vector<u8>, String)
```

Note: After the execution of `i_receive`, the DApp needs to call the `executed_i_receive_dapp` function in the gateway contract to complete the flow.

```rust
public fun executed_i_receive_dapp(
    self: &mut GatewayContract, 
    execute_dapp: ExecuteDappIReceive, 
    exec_data: vector<u8>,
    exec_flag: bool, 
    ctx: &mut TxContext
)
```

:::caution
It is mandatory to include this function in your contract on the destination chain; otherwise, the request will fail.
:::
