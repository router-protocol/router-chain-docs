---
title: requestToDest
sidebar_position: 1
---

# `requestToDest` Function

```javascript
function requestToDest(
    Utils.RequestArgs memory requestArgs,
    Utils.AckType,
    Utils.AckGasParams memory ackGasParams,
    Utils.DestinationChainParams memory destChainParams,
    Utils.ContractCalls memory contractCalls
  ) external returns (uint64);
```
By setting the parameters per their requirements, users can use this function to exercise a wide range of functionalities when it comes to cross-chain message passing. These parameters include:
### 1. requestArgs
A struct comprising of the following subparameters:
1. **expiryTimestamp:** The timestamp by which your cross-chain call will expire. If your call is not executed on the destination chain by this time, it will be reverted. If you don't want any expiry timestamp, pass **`type(uint64).max`** as the expiryTimestamp.
2. **isAtomicCalls:** Since users can use **`requestToDest`** to send multiple cross-chain calls in one go, isAtomicCalls boolean value ensures whether the calls are atomic.
  -  If this variable is set to **true**, either all the contract calls will be executed on the destination chain or none of them will be executed.
  -  If this variable is set to **false**, even if some of the contracts calls fail on the destination chain, other calls won't be affected.
3. **feePayer:** This specifies the address on the Router chain from which the cross-chain fee will be deducted. 


### 2. ackType
When the contract calls are executed on the destination chain, the Router chain receives an acknowledgment from the destination chain, which specifies whether the execution was successful or did it result in some error. We provide users the option to get this acknowledgment from the Router chain to the source chain and perform some operations based on that acknowledgment.
  ```javascript
  enum AckType {
      NO_ACK,
      ACK_ON_SUCCESS,
      ACK_ON_ERROR,
      ACK_ON_BOTH
  }
  ```
  1.  **ackType = NO_ACK:** You don't want to receive the acknowledgment on the source chain.
  2.  **ackType = ACK_ON_SUCCESS:** You only want to receive the acknowledgment on the source chain if the calls are executed successfully on the destination chain.
  3.  **ackType = ACK_ON_ERROR:** You only want to receive the acknowledgment on the source chain in case the calls failed on the destination chain.
  4.  **ackType = ACK_ON_BOTH:** You want to receive the acknowledgment on the source chain in both cases (success and error).

### 3. ackGasParams
If you opted to receive the acknowledgment on the source chain, you would need to write a callback function (discussed [here](./handleCrossTalkAck)) to handle the acknowledgment. The ackGasParams parameter includes the gas limit and gas price required to execute the callback function on the source chain when the acknowledgment is received. The gas limit depends on the complexity of the callback function, and the gas price depends on the source chain congestion.

```javascript
struct AckGasParams {
    uint64 gasLimit;
    uint64 gasPrice;
}
```

If the user does not want to handle the acknowledgment, i.e., the ackType is **NO_ACK**, then the gas limit and gas price for ackGasParams should be zero.

### 4. destinationChainParams
```javascript
struct DestinationChainParams {
    uint64 gasLimit;
    uint64 gasPrice;
    uint64 destChainType;
    string destChainId;
}
```
1.  **gasLimit:** Gas limit required to execute the cross-chain request on the destination chain.
2.  **gasPrice:** Gas price to be passed on the destination chain.
3.  **destChainType:** This represents the type of chain. The values for chain types can be found [here](./chainTypes).
4.  **destChainId:** Chain ID of the destination chain in string format.

### 5. contractCalls
```
struct ContractCalls {
    bytes[] payloads;
    bytes[] destContractAddresses;
}
```

The contractCalls parameter includes an array of payloads and contract addresses to be sent to the destination chain. All the payloads will be sent to the respective contract addresses as specified in the arrays.  The payload can include anything, i.e., you can pass whatever you want in this payload from the source chain and handle that payload on the destination chain.

To convert contract addresses to bytes and bytes to addresses, you can use the following functions:
```javascript
// Function to convert address to bytes
function toBytes(address a) public pure returns (bytes memory b){
    assembly {
        let m := mload(0x40)
        a := and(a, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
        mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
        mstore(0x40, add(m, 52))
        b := m
    }
}

// Function to convert bytes to address
function toAddress(
  bytes memory _bytes
) public pure returns (address contractAddress) {
  bytes20 srcTokenAddress;
  assembly {
    srcTokenAddress := mload(add(_bytes, 0x20))
  }
  contractAddress = address(srcTokenAddress);
}
```