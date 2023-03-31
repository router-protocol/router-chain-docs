---
title: Multiple Calls with Acknowledgment
sidebar_position: 4
---

Consider an application that allows users to send multiple messages (pings) from the source chain and receive a message in response (pong) to all those messages from the destination chain. In this case, the requirements are as follows:

1.  We need to send multiple contract calls for execution to the destination chain contract.
2.  We need an acknowledgment back on the source chain after the calls are executed on the destination chain.

To implement such functionality using Router CrossTalk, follow these steps:

<details>
<summary><b>Step 1) Call <code>requestToDest</code> on Router's Gateway Contract</b></summary>

We will initiate a cross-chain request from the source chain by calling the `requestToDest` function on Router's source chain Gateway contract.
```javascript
gatewayContract.requestToDest(
    Utils.RequestArgs(expiryTimstamp, isAtomicCalls),
	Utils.AckType.ACK_ON_BOTH,
	Utils.AckGasParams(ackGasLimit,ackGasPrice),
	Utils.DestinationChainParams(destGasLimit, destGasPrice, chainType, chainId, asmAddress),
	Utils.ContractCalls(payloads, addresses)
);
```

While calling the **`requestToDest`** function on the Gateway contract, we need to pass the following parameters:

1. **requestArgs:**
    1. **expiryTimestamp:** If you want to add a specific expiry timestamp, you can mention it against this parameter. Your request will get reverted if it is not executed before the expiryTimestamp. If you don't want any expiryTimestamp, you can use **`type(uint64).max`** as the expiryTimestamp.
    2. **isAtomicCalls:** Set it to true if you want to ensure that either all your contract calls are executed or none of them are executed. Set it to false if you do not require atomicity. 

2.  **ackType:**
    1. Set this to **ACK_ON_SUCCESS** if you only want to get acknowledgment when the execution on the destination chain is successful.
    2. Set this to **ACK_ON_ERROR** if you only want to get acknowledgment when the execution on the destination chain failed.
    3. Set this to **ACK_ON_BOTH** if you want to get acknowledgment in both the cases (success and failure).

3.  **ackGasParams:**
    1. **ackGasLimit:** Gas limit for execution of the function **`handleCrossTalkAck`** on the source chain.
    2. **ackGasPrice:** Gas price with which you want to execute the aforementioned function on the source chain.

4.  **destinationChainParams:** We need to pass the destination chain gas limit, gas price, chain type, the chain ID and the address of ASM here.

5.  **contractCalls:** Encode the payloads and the destination contract addresses in byte arrays and pass them in this function. The payload consist of the ABI-encoded data you want to send to the other chain. The destinationContractAddress is the address of the recipient contract on the destination chain that will handle the cross-chain request. In this case, we want to different payloads to different destination contracts.

    ```javascript
    bytes[] memory addresses = new bytes[](3);
    addresses[0] = toBytes(destinationContractAddress1);
    addresses[1] = toBytes(destinationContractAddress2);
    addresses[2] = toBytes(destinationContractAddress3);

    bytes[] memory payloads = new bytes[](3);
    payloads[0] = payload1;
    payloads[1] = payload2;
    payloads[2] = payload3;
    ```

    The **`toBytes`** function can be found [here](../understanding-crosstalk/requestToDest#6-contractcalls).

</details>

<details>
<summary><b>Step 2) Handle the Cross-chain Request in your Destination Contract</b></summary>

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

</details>

<details>
<summary><b>Step 3) Adding an Acknowledgment Handler</b></summary>

Since we are anticipating an acknowledgment on the source chain, we need to implement an acknowledgment handler function.  This will be contain the logic to handle the acknowledgement, i.e., what you want to do on the source chain post the execution of the request on the destination chain. The documentation for this function can be found [here](../understanding-crosstalk/handleCrossTalkAck).

```javascript
function handleCrossTalkAck(
  uint64 eventIdentifier,
  bool[] memory execFlags,
  bytes[] memory execData
) external
```

</details>