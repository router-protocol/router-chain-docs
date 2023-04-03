---
title: Creating and Sending a Cross-chain Read Request
sidebar_position: 2
---

To create a cross-chain read request, one needs to call the `read_query_to_dest()` function on Router’s Gateway contract with the following parameters:

```javascript
#[payable]
pub fn read_query_to_dest(
    &mut self,
    request_args: RequestArgs,
    ack_gas_params: AckGasParams,
    dest_chain_params: DestinationChainParams,
    contract_calls: ContractCalls,
) -> bool
```

### 1. request_args

This parameter includes a struct comprising of the following subparameters:

- **exp_timestamp:** If you want to add a specific expiry timestamp, you can mention it against this parameter. Your request will get reverted if it is not executed before the expiryTimestamp.
- **is_atomic_calls:** Since users can use the `read_query_to_dest()` function to send multiple cross-chain calls in one go, the `is_atomic_calls` boolean value ensures whether the calls are atomic.
  - If this variable is set to `true`, either all the contract calls will be executed on the destination chain, or none of them will be executed.
  - If this variable is set to `false`, then even if some of the contract calls fail on the destination chain, other calls won't be affected.

### 2. destination_chain_params

In this parameter, users can specify the gas they are willing to pay to execute their read request, along with the details of the destination chain where the request needs to be executed. This parameter needs to be passed as a struct containing the following subparameters:

- **gas_limit:** The gas limit required to execute the cross-chain read request on the destination chain.
- **gas_price:** The gas price that the user is willing to pay for the execution of the request.
- **dest_chain_id:** Chain ID of the destination chain in string format.
- **dest_chain_type:** This represents the type of chain. The values for chain types are given [here](../../understanding-crosstalk/chainTypes).
- **asm_address:** The address of Additional Security Module (ASM) contract that acts as a plugin which enables users to seamlessly integrate their own security mechanism into their DApp.

### 3. ack_gas_params

Once the cross-chain read request is executed on the destination chain, the requested data is sent back to the source chain as an acknowledgment. To handle this acknowledgment, users need to include a callback function (discussed [here](./handling-the-acknowledgment-on-the-source-chain)). The ack_gas_params parameter includes the `gas_limit` and `gas_price` required to execute the callback function on the source chain when the acknowledgment is received. The gas limit depends on the complexity of the callback function, and the gas price depends on the source chain congestion.

### 4. contract_calls

The `contract_calls` parameter includes an array of payloads (read function calls) and an array of contract addresses on the destination chain where the respective payload should be sent. The payload will include the ABI-encoded function calls that are to be executed on the destination chain.
