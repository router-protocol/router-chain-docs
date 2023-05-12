---
title: Transfer of Reserve Tokens with Arbitrary Instruction
sidebar_position: 3
---

```javascript
function depositReseveTokenAndExecute(
    bool isSourceNative,
    bytes memory swapData,
    bytes memory executeData,
    bytes memory arbitraryData
) external payable
```

The flow is just the same as that of the reserve token transfer explained before. The only difference here is the arbitrary data that you need to pass.

### Arbitrary Data
**Arbitrary Data** is the abi encoded data that comprises of: 

1. **destContractAddress:** Address of the contract which will be called after the transfer is complete. This contract needs to implement the voyagerReceive function (details given below).
2. **selector:** The selector to the function that should be called on the destination contract address. This function processes the arbitrary request.
3. **data:** This is the abi encoded arguments that will be passed to the function for which the selector was passed (param 2). The data should exclude the address and amount of tokens received as the amount may vary according to the fees. The address of the token and exact amount of tokens received by the user will be accessible into the handler function directly on the destination chain.
4. **refundAddress:** When you create an arbitrary instruction, you need to specify the gas limit needed for it to execute on the destination chain**.** After the execution of the instruction on the destination chain, if some gas is left, it will be refunded to the address passed here. ****
5. **gasLimit:** The gas limit required for your function to be executed on the destination chain. The fees that we deduct from you will depend on this.
6. **gasPrice:** Current gas price of the destination chain. The fees that we deduct from you will depend on this.

### <code>voyagerReceive</code>
The arbitrary instruction that you provide here will be executed on the destination chain on the contract address that you specify. That contract must implement the **voyagerReceive** function given below.

```javascript
function voyagerReceive(
	address sourceSenderAddress, 
	bytes32 srcChainIdBytes, 
	bytes4 selector, 
	bytes memory data, 
	address settlementToken, 
	uint256 settlementAmount
) external; 
```

With this function, you will receive:

1. **sourceSenderAddress:** the address of the sender of transaction from the source chain.
2. **srcChainIdBytes:** the identifier of the source chain..
3. **selector:** Selector to the function you passed from the source chain.
4. **data:** Data for the params to the function for which the selector was received passed from the source chain.
5. **settlementToken:** Address of the token which was received to the recipient after the transfer.
6. **settlementAmount:** Amount of the settlement tokens received to the recipient after the transfer.

Inside the **voyagerReceive** function on the destination chain, you will decode the data according to the requirements of the function selector and call that function which will complete the instruction execution.