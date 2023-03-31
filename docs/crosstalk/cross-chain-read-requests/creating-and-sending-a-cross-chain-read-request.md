---
title: Creating and Sending a Cross-chain Read Request
sidebar_position: 2
---

To create a cross-chain read request, one needs to call the `readQueryToDest()` function on Router’s Gateway contract with the following parameters:

### 1. contractCalls
The `contractCalls` parameter includes an array of payloads (read function calls) and an array of contract addresses on the destination chain where the respective payload should be sent. The payload will include the ABI-encoded function calls that are to be executed on the destination chain. 

### 2. requestArgs
This parameter includes a struct comprising of the following subparameters:
- **isAtomicCalls:** Since users can use the `readQueryToDest()` function to send multiple cross-chain calls in one go, the `isAtomicCalls` boolean value ensures whether the calls are atomic.
    - If this variable is set to \textbf{true`, either all the contract calls will be executed on the destination chain, or none of them will be executed.
    - If this variable is set to \textbf{false`, then even if some of the contract calls fail on the destination chain, other calls won't be affected.
- **expiryTimestamp:** The timestamp by which your cross-chain call will expire. If your call is not executed on the destination chain by this time, it will be reverted. If you don't want any expiry timestamp, pass `type(uint64).max` as the `expiryTimestamp`.

### 3. destinationChainParams
In this parameter, users can specify the gas they are willing to pay to execute their read request, along with the details of the destination chain where the request needs to be executed. This parameter needs to be passed as a struct containing the following subparameters:
- **gasLimit:** The gas limit required to execute the cross-chain read request on the destination chain.
- **gasPrice:** The gas price that the user is willing to pay for the execution of the request.
- **destChainId:** Chain ID of the destination chain in string format.
- **destChainType:** This represents the type of chain. The values for chain types are given <a href="/crosstalk/understanding-crosstalk/chainTypes" target="_blank">here</a>.
- **asmAddress:** The address of Additional Security Module (ASM) contract that acts as a plugin which enables users to seamlessly integrate their own security mechanism into their DApp.

### 4. ackGasParams
Once the cross-chain read request is executed on the destination chain, the requested data is sent back to the source chain as an acknowledgment. To handle this acknowledgment, users need to include a callback function (discussed <a href="./handling-the-acknowledgment-on-the-source-chain" target="_blank">here</a>). The ackGasParams parameter includes the `gasLimit` and `gasPrice` required to execute the callback function on the source chain when the acknowledgment is received. The gas limit depends on the complexity of the callback function, and the gas price depends on the source chain congestion. The gas limit can easily be calculated using the hardhat-gas-reporter plugin. For the gas price, you can use web3/ethers library’s `provider.getGasPrice()` function.