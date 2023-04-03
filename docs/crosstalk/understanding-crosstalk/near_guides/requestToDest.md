---
title: request_to_dest
sidebar_position: 1
---

# `request_to_dest` Function

```javascript
#[payable]
pub fn request_to_dest(
    &mut self,
    request_args: RequestArgs,
    ack_type: u8,
    ack_gas_params: AckGasParams,
    dest_chain_params: DestinationChainParams,
    contract_calls: ContractCalls,
) -> bool
```

By setting the parameters per their requirements, users can use this function to exercise a wide range of functionalities when it comes to cross-chain message passing. These parameters include:

### 1. request_args:

1. **exp_timestamp:** If you want to add a specific expiry timestamp, you can mention it against this parameter. Your request will get reverted if it is not executed before the expiryTimestamp.
2. **is_atomic_calls:** Set it to true if you want to ensure that either all your contract calls are executed or none of them are executed. Set it to false if you do not require atomicity.

- If this variable is set to **true**, either all the contract calls will be executed on the destination chain or none of them will be executed.
- If this variable is set to **false**, even if some of the contracts calls fail on the destination chain, other calls won't be affected.

```rust
pub struct RequestArgs {
    pub exp_timestamp: u64,
    pub is_atomic_calls: bool,
}
```

### 2. ack_type:

When the contract calls are executed on the destination chain, the Router chain receives an acknowledgment from the destination chain, which specifies whether the execution was successful or did it result in some error. We provide users the option to get this acknowledgment from the Router chain to the source chain and perform some operations based on that acknowledgment.

1.  **ack_type = 0:** You don't want to receive the acknowledgment on the source chain.
2.  **ack_type = 1:** You only want to receive the acknowledgment on the source chain if the calls are executed successfully on the destination chain.
3.  **ack_type = 2:** You only want to receive the acknowledgment on the source chain in case the calls failed on the destination chain.
4.  **ack_type = 3:** You want to receive the acknowledgment on the source chain in both cases (success and error).

### 3. ack_gas_params:

If you opted to receive the acknowledgment on the source chain, you would need to write a callback function (discussed [here](./handleCrossTalkAck.md)) to handle the acknowledgment. The ack_gas_params parameter includes the gas limit and gas price required to execute the callback function on the source chain when the acknowledgment is received. The gas limit depends on the complexity of the callback function, and the gas price depends on the source chain congestion.

```rust
pub struct AckGasParams {
    pub gas_limit: u64,
    pub gas_price: u64,
}
```

If the user does not want to handle the acknowledgment, i.e., the ackType is **0**, then the gas limit and gas price for ack_gas_params should be zero.

### 4. destination_chain_params:

```javascript
pub struct DestinationChainParams {
    pub gas_limit: u64,
    pub gas_price: u64,
    pub dest_chain_type: u64,
    pub dest_chain_id: String,
    pub asm_address: Vec<u8>,
}
```

1.  **gas_limit:** Gas limit required to execute the cross-chain request on the destination chain.
2.  **gas_price:** Gas price to be passed on the destination chain.
3.  **dest_chain_type:** This represents the type of chain. The values for chain types can be found [here](../chainTypes.md).
4.  **dest_chain_id:** Chain ID of the destination chain in string format.
5.  **asm_address:** Address of Additional Security Module (ASM) contract that acts as a plugin which enables users to seamlessly integrate their own security mechanism into their DApp.

### 5. contract_calls:

```
pub struct ContractCalls {
    pub payloads: Vec<Vec<u8>>,
    pub dest_contract_addresses: Vec<Vec<u8>>,
}
```

The contract_calls parameter includes an array of payloads and contract addresses to be sent to the destination chain. All the payloads will be sent to the respective contract addresses as specified in the arrays. The payload can include anything, i.e. you can pass whatever you want in this payload from the source chain and handle that payload on the destination chain.

> **Note:** We would suggest passing the payload as abi encoded value so that it is easier to decode in all environments.

Please use the following format for passing the destination contract addresses:

- For EVM chains as the destination chain:

```javascript
fn convert_evm_address_to_vec(evm_address: String) -> Vec<u8> {
  let addr = evm_address.split_at(2).1;
  let addr_as_vec = hex::decode(addr);

  addr_as_vec.unwrap()
}

```
