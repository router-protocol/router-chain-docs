---
title: How to Use the CrossTalkUtils Library
sidebar_position: 2
---

### 1) Import the CrossTalkUtils library in your Contract
```javascript
pragma solidity 0.8.x;
import "@routerprotocol/router-crosstalk-utils/contracts/CrossTalkUtils.sol";
contract MyContract {}
```
- Make sure you're using version `1.0.5` of `router-crosstalk-utils`

### 2) Call the Required Function
Demonstration for different kinds of requests:

#### (a) Single Call without Acknowledgment
Consider an application that allows users to transfer their ERC20 tokens from one chain to another. In this case, the requirements are as follows:

1.  We need to send a single contract call for execution to the destination chain contract.
2.  We don't need the acknowledgment back on the source chain after the contract call is executed on the destination chain.

```javascript
function singleRequestWithoutAcknowledgement(
    address gatewayContract,
    Utils.RequestArgs memory requestArgs, 
    Utils.DestinationChainParams memory destChainParams, 
    bytes memory destinationContractAddress, 
    bytes memory payload
) internal returns(uint64)
```

<details>
<summary><b>To implement such functionality using CrossTalkUtils library, follow these steps:</b></summary>

**Step 1) Call the `singleRequestWithoutAcknowledgement` Function on the CrossTalkUtils Library**

 To create a cross-chain request from the source chain, we will call the CrossTalkUtils library's **`singleRequestWithoutAcknowledgement`** function.
 ```javascript
 uint64 nonce = CrossTalkUtils.singleRequestWithoutAcknowledgement(
	gatewayContractAddress, // in address format
     requestArgs, // format given in point 2 below
	destinationChainParams, // format given in point 3 below
	destinationContractAddress, // in bytes
	payload // bytes
);
```
While calling the **`singleRequestWithoutAcknowledgement`** function on the CrossTalkUtils library, we need to pass the following parameters:

1.  **gatewayContractAddress:** The address of the Router's Gateway contract.
2. **requestArgs:** Relevant subparameters for the function call:
```javascript
    struct Utils.RequestArgs(
        uint64 expTimestamp,
        bool isAtomicCalls // optional, since it doesn't matter in a single request
)
```
3.  **destinationChainParams:** We need to pass the destination chain gas limit, gas price, chain type, the chain ID and the address of ASM here.
```javascript
    struct Utils.DestinationChainParams(
		uint64 gasLimit, 
		uint64 gasPrice, 
		uint64 destChainType, 
		string memory destChainId,
        bytes memory asmAddress
)
```
4.  **destinationContractAddress:** Address of the contract on the destination chain to which the payload should be sent. This address should be in bytes format. You can use the **`toBytes`** function in the library to convert the address to bytes format.
    ```javascript
    bytes memory destinationContractAddress = toBytes(contractAddress);
    ```
5.  **payload:** The payload that you want to send to the destination chain. This should be of type bytes.

In this way, we can create a cross-chain communication request without acknowledgement. This function will return the nonce of the transaction.

**Step 2) Handle the Cross-chain Request in your Destination Contract**

Once the cross-chain request is received on the destination chain, we need a mechanism to handle it. That's where **`handleRequestFromSource`** function comes into play. Router's Gateway contract on the destination chain will pass the payload along with the source chain details to the destination chain contract by calling this function.

```javascript
function handleRequestFromSource(
	  bytes memory srcContractAddress,
	  bytes memory payload,
	  string memory srcChainId,
	  uint64 srcChainType
) external returns (bytes memory)
```

You can handle the payload in any way you want to complete your cross-chain functionality.

**Step 3) Adding an Empty Acknowledgment Handler**

Even though we don't need an acknowledgment on the source chain, we need to implement an acknowledgment handler function. This will be empty since this function will never get called in this particular use case. The documentation for this function can be found [here](../understanding-crosstalk/handleCrossTalkAck).

```javascript
function handleCrossTalkAck(
  uint64, // eventIdentifier
  bool[] memory, // execFlags
  bytes[] memory // execData
) external {}
```

</details>

#### (b) Single Call with Acknowledgment
Consider an application that allows users to send a message (ping) from the source chain and receive a message in response (pong) from the destination chain. In this case, the requirements are as follows:

1. We need to send a single contract call for execution to the destination chain contract.
2. We need an acknowledgment back on the source chain after the contract call is executed on the destination chain.

```javascript
function singleRequestWithAcknowledgement(
    address gatewayContract,
    Utils.RequestArgs memory requestArgs, 
    Utils.AckType ackType,
    Utils.AckGasParams memory ackGasParams,
    Utils.DestinationChainParams memory destChainParams, 
    bytes memory destinationContractAddress, 
    bytes memory payload
) internal returns(uint64)
```

<details>
<summary><b>To implement such functionality using CrossTalkUtils library, follow these steps:</b></summary>

**Step 1) Call the `singleRequestWithAcknowledgement` Function on the CrossTalkUtils Library**

 To create a cross-chain request from the source chain, we will call the CrossTalkUtils library's **`singleRequestWithAcknowledgement`** function.
 ```javascript
uint64 nonce = CrossTalkUtils.singleRequestWithAcknowledgement(
	gatewayContract, // in address format
     requestArgs, // format given in point 2 below
	ackType, // format given in point 3 below
    ackGasParams, // format given in point 4 below
	destinationChainParams, // format given in point 5 below
	destinationContractAddress, // in bytes
	payload // in bytes
);
```
While calling the **`singleRequestWithAcknowledgement`** function on the CrossTalkUtils library, we need to pass the following parameters:

1.  **gatewayContractAddress:** The address of the Router's Gateway contract.
2. **requestArgs:** Relevant subparameters for the function call:
```javascript
    struct Utils.RequestArgs(
        uint64 expTimestamp,
        bool isAtomicCalls // optional, since it doesn't matter in a single request
)
```
3.  **ackType:**
    1. Set this to **ACK_ON_SUCCESS** if you only want to get acknowledgment when the execution on the destination chain is successful.
    2. Set this to **ACK_ON_ERROR** if you only want to get acknowledgment when the execution on the destination chain failed.
    3. Set this to **ACK_ON_BOTH** if you want to get acknowledgment in both the cases (success and failure).

    **Format:**
    ```javascript
    enum Utils.AckType(NO_ACK, ACK_ON_SUCCESS, ACK_ON_ERROR, ACK_ON_BOTH)
    ```
4.  **ackGasParams:**
    1. **ackGasLimit:** Gas limit for execution of the function **`handleCrossTalkAck`** on the source chain.
    2. **ackGasPrice:** Gas price with which you want to execute the aforementioned function on the source chain.

    **Format:**
    ```javascript
    struct Utils.AckGasParams(uint64 ackGasLimit, uint64 ackGasPrice)
    ```
5.  **destinationChainParams:** We need to pass the destination chain gas limit, gas price, chain type, the chain ID and the address of ASM here.
```javascript
    struct Utils.DestinationChainParams(
		uint64 gasLimit, 
		uint64 gasPrice, 
		uint64 destChainType, 
		string memory destChainId,
        bytes memory asmAddress
)
```
6.  **destinationContractAddress:** Address of the contract on the destination chain to which the payload should be sent. This address should be in bytes format. You can use the **`toBytes`** function in the library to convert the address to bytes format.
    ```javascript
    bytes memory destinationContractAddress = toBytes(contractAddress);
    ```
7.  **payload:** The payload that you want to send to the destination chain. This should be of type bytes.

In this way, we can create a cross-chain communication request with acknowledgement. This function will return the nonce of the transaction.

**Step 2) Handle the Cross-chain Request in your Destination Contract**

Once the cross-chain request is received on the destination chain, we need a mechanism to handle it. That's where **`handleRequestFromSource`** function comes into play. Router's Gateway contract on the destination chain will pass the payload along with the source chain details to the destination chain contract by calling this function.

```javascript
function handleRequestFromSource(
	  bytes memory srcContractAddress,
	  bytes memory payload,
	  string memory srcChainId,
	  uint64 srcChainType
) external returns (bytes memory)
```

You can handle the payload in any way you want to complete your cross-chain functionality.

**Step 3) Adding an Acknowledgment Handler**

Since we are anticipating an acknowledgment on the source chain, we need to implement an acknowledgment handler function.  This will be contain the logic to handle the acknowledgement, i.e., what you want to do on the source chain post the execution of the request on the destination chain. The documentation for this function can be found [here](../understanding-crosstalk/handleCrossTalkAck).

```javascript
function handleCrossTalkAck(
  uint64 eventIdentifier,
  bool[] memory execFlags,
  bytes[] memory execData
) external
```

</details>



#### (c) Multiple Calls without Acknowledgment
Consider an application that allows users to transfer multiple ERC20 tokens or messages from one chain to another in the same cross-chain request. In this case, the requirements are as follows:

1.  We need to send multiple contract calls for execution to the destination chain contract.
2.  We don't need the acknowledgment back on the source chain after the calls are executed on the destination chain.

```javascript
function multipleRequestsWithoutAcknowledgement(
    address gatewayContract,
    Utils.RequestArgs memory requestArgs, 
    Utils.DestinationChainParams memory destChainParams, 
    bytes[] memory destinationContractAddresses, 
    bytes[] memory payloads
) internal returns(uint64)
```

<details>
<summary><b>To implement such functionality using CrossTalkUtils library, follow these steps:</b></summary>

**Step 1) Call the `multipleRequestsWithoutAcknowledgement` Function on the CrossTalkUtils Library**

 To create a cross-chain request from the source chain, we will call the CrossTalkUtils library's **`multipleRequestsWithoutAcknowledgement`** function.
 ```javascript
    uint64 nonce = CrossTalkUtils.multipleRequestsWithoutAcknowledgement(
	gatewayContract, // in address format
     requestArgs, // format given in point 2 below
	destinationChainParams, // format given in point 3 below
	destinationContractAddresses, // in bytes array format
	payloads // in bytes array format
);
```
While calling the **`multipleRequestsWithoutAcknowledgement`** function on the CrossTalkUtils library, we need to pass the following parameters:

1.  **gatewayContractAddress:** The address of the Router's Gateway contract.
2. **requestArgs:** Relevant subparameters for the function call:
```javascript
    struct Utils.RequestArgs(
        uint64 expTimestamp,
        bool isAtomicCalls // set it to true if you want the calls to be atomic
)
```
3.  **destinationChainParams:** We need to pass the destination chain gas limit, gas price, chain type, the chain ID and address of ASM here.
```javascript
    struct Utils.DestinationChainParams(
		uint64 gasLimit, 
		uint64 gasPrice, 
		uint64 destChainType, 
		string memory destChainId,
        bytes memory asmAddress
)
```
4.  **destinationContractAddresses:** Addresses of the contracts on the destination chain to which the individual payloads should be sent. These addresses should be in bytes format. You can use the **`toBytes`** function in the library to convert the address to bytes format. The array of destination contract addresses can be created in the following way:
    ```javascript
    bytes memory destinationContractAddress1 = toBytes(contractAddress1);
    bytes memory destinationContractAddress2 = toBytes(contractAddress2);
    bytes[] memory destinationContractAddresses = new bytes[](2);
    destinationContractAddresses[0] = destinationContractAddress1;
    destinationContractAddresses[1] = destinationContractAddress2;
    ```
    For simplicity, we have only used two destination contract addresses in this example. You can send as many addresses as you want.
5.  **payload:** The payloads you want to send to the respective destination contract addresses. These should be of type bytes. The array of payloads can be created in the following way:
    ```javascript
    bytes[] memory payloads = new bytes[](2);
    payloads[0] = payload1;
    payload[1] = payload2;
    ```
    For simplicity, we have only used two payloads in this example. You can send as many payloads as you want as long as the number of payloads should is equal to the number of destination contract addresses.

In this way, we can create a cross-chain communication request without acknowledgement. This function will return the nonce of the transaction.

**Step 2) Handle the Cross-chain Request in your Destination Contract**

Once the cross-chain request is received on the destination chain, we need a mechanism to handle it. That's where **`handleRequestFromSource`** function comes into play. Router's Gateway contract on the destination chain will pass the payload along with the source chain details to the respective destination chain contract by calling this function.

```javascript
function handleRequestFromSource(
	  bytes memory srcContractAddress,
	  bytes memory payload,
	  string memory srcChainId,
	  uint64 srcChainType
) external returns (bytes memory)
```

You can handle the payload in any way you want to complete your cross-chain functionality.

**Step 3) Adding an Empty Acknowledgment Handler**

Even though we don't need an acknowledgment on the source chain, we need to implement an acknowledgment handler function. This will be empty since this function will never get called in this particular use case. The documentation for this function can be found [here](../understanding-crosstalk/handleCrossTalkAck).

```javascript
function handleCrossTalkAck(
  uint64, // eventIdentifier
  bool[] memory, // execFlags
  bytes[] memory // execData
) external {}
```

</details>


#### (d) Multiple Calls with Acknowledgment
Consider an application that allows users to send multiple messages (pings) from the source chain and receive a message in response (pong) to all those messages from the destination chain. In this case, the requirements are as follows:

1.  We need to send multiple contract calls for execution to the destination chain contract.
2.  We need an acknowledgment back on the source chain after the calls are executed on the destination chain.

```javascript
function multipleRequestsWithAcknowledgement(
    address gatewayContract,
    Utils.RequestArgs memory requestArgs, 
    Utils.AckType ackType,
    Utils.AckGasParams memory ackGasParams,
    Utils.DestinationChainParams memory destChainParams, 
    bytes[] memory destinationContractAddresses, 
    bytes[] memory payloads
) internal returns(uint64)
```

<details>
<summary><b>To implement such functionality using CrossTalkUtils library, follow these steps:</b></summary>

**Step 1) Call the `multipleRequestsWithAcknowledgement` Function on the CrossTalkUtils Library**

 To create a cross-chain request from the source chain, we will call the CrossTalkUtils library's **`multipleRequestsWithAcknowledgement`** function.
 ```javascript
    uint64 nonce = CrossTalkUtils.multipleRequestsWithoutAcknowledgement(
	gatewayContract, // in address format
     requestArgs, // format given in point 2 below
	destinationChainParams, // format given in point 3 below
	destinationContractAddresses, // in bytes array format
	payloads // in bytes array format
);
```
While calling the **`multipleRequestsWithAcknowledgement`** function on the CrossTalkUtils library, we need to pass the following parameters:

1. **gatewayContractAddress:** The address of the Router's Gateway contract.
2. **requestArgs:** Relevant subparameters for the function call:
```javascript
    struct Utils.RequestArgs(
        uint64 expTimestamp,
        bool isAtomicCalls // set it to true if you want the calls to be atomic
)
```
3.  **ackType:**
    1. Set this to **ACK_ON_SUCCESS** if you only want to get acknowledgment when the execution on the destination chain is successful.
    2. Set this to **ACK_ON_ERROR** if you only want to get acknowledgment when the execution on the destination chain failed.
    3. Set this to **ACK_ON_BOTH** if you want to get acknowledgment in both the cases (success and failure).

    **Format:**
    ```javascript
    enum Utils.AckType(NO_ACK, ACK_ON_SUCCESS, ACK_ON_ERROR, ACK_ON_BOTH)
    ```
4.  **ackGasParams:**
    1. **ackGasLimit:** Gas limit for execution of the function **`handleCrossTalkAck`** on the source chain.
    2. **ackGasPrice:** Gas price with which you want to execute the aforementioned function on the source chain.

    **Format:**
    ```javascript
    struct Utils.AckGasParams(uint64 ackGasLimit, uint64 ackGasPrice)
    ```
5.  **destinationChainParams:** We need to pass the destination chain gas limit, gas price, chain type, the chain ID and the address of ASM here.
```javascript
    struct Utils.DestinationChainParams(
		uint64 gasLimit, 
		uint64 gasPrice, 
		uint64 destChainType, 
		string memory destChainId,
        bytes memory asmAddress
)
```
6.  **destinationContractAddresses:** Addresses of the contracts on the destination chain to which the individual payloads should be sent. These addresses should be in bytes format. You can use the **`toBytes`** function in the library to convert the address to bytes format. The array of destination contract addresses can be created in the following way:
    ```javascript
    bytes memory destinationContractAddress1 = toBytes(contractAddress1);
    bytes memory destinationContractAddress2 = toBytes(contractAddress2);
    bytes[] memory destinationContractAddresses = new bytes[](2);
    destinationContractAddresses[0] = destinationContractAddress1;
    destinationContractAddresses[1] = destinationContractAddress2;
    ```
    For simplicity, we have only used two destination contract addresses in this example. You can send as many addresses as you want.
8.  **payload:** The payloads you want to send to the respective destination contract addresses. These should be of type bytes. The array of payloads can be created in the following way:
    ```javascript
    bytes[] memory payloads = new bytes[](2);
    payloads[0] = payload1;
    payload[1] = payload2;
    ```
    For simplicity, we have only used two payloads in this example. You can send as many payloads as you want as long as the number of payloads should is equal to the number of destination contract addresses.

In this way, we can create a cross-chain communication request with acknowledgement. This function will return the nonce of the transaction.

**Step 2) Handle the Cross-chain Request in your Destination Contract**

Once the cross-chain request is received on the destination chain, we need a mechanism to handle it. That's where **`handleRequestFromSource`** function comes into play. Router's Gateway contract on the destination chain will pass the payload along with the source chain details to the respective destination chain contract by calling this function.

```javascript
function handleRequestFromSource(
	  bytes memory srcContractAddress,
	  bytes memory payload,
	  string memory srcChainId,
	  uint64 srcChainType
) external returns (bytes memory)
```

You can handle the payload in any way you want to complete your cross-chain functionality.

**Step 3) Adding an Acknowledgment Handler**

Since we are anticipating an acknowledgment on the source chain, we need to implement an acknowledgment handler function.  This will be contain the logic to handle the acknowledgement, i.e., what you want to do on the source chain post the execution of the request on the destination chain. The documentation for this function can be found [here](../understanding-crosstalk/handleCrossTalkAck).

```javascript
function handleCrossTalkAck(
  uint64 eventIdentifier,
  bool[] memory execFlags,
  bytes[] memory execData
) external
```

</details>

### 3) Call the set Dapp Metadata function
For making cross-chain transactions, you need to pay the fees on the router chain. For this, we have a function `setDappMetadata` in our gateway contract that takes the address of the fee payer on router chain from which the cross-chain fee will be deducted. After the fee payer address is set, the fee payer has to provide approval on the router chain that this address is willing to pay fees for this Dapp thus enabling the Dapp to actually perform the cross-chain transaction. Note that all the fee refunds will be credited to this fee payer address.

```javascript
function setDappMetadata(
    string memory feePayerAddress
    ) external returns (uint64)
```

<summary><b>To implement this function, you can call it in the following manner:</b></summary>

```javascript
function setDappMetadata(
    string memory FeePayer
    ) public onlyOwner {
    gatewayContract.setDappMetadata(FeePayer);
  }
```