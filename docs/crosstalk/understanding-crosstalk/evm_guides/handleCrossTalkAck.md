---
title: handleCrossTalkAck
sidebar_position: 3
---

# `handleCrossTalkAck` Function

Once the **`handleRequestFromSource`** function is executed, an acknowledgment is generated from Router's destination chain Gateway contract, which will specify whether the calls were successful. Since we inherited the ICrossTalkApplication contract, we need to implement a **`handleCrossTalkAck`** function in our contract with the following schema.

```javascript
function handleCrossTalkAck(
  uint64 eventIdentifier,
  bool[] memory execFlags,
  bytes[] memory execData
) external
```

If you have opted not to receive the acknowledgement, you can implement an empty function in its place in the following way:

```javascript
function handleCrossTalkAck(
  uint64, // eventIdentifier
  bool[] memory, // execFlags
  bytes[] memory // execData
) external {}
```

If you've opted to receive the acknowledgment, you need to handle the acknowledgment inside this function. This function receives the following params:

### 1. eventIdentifier

This is the nonce you received when while calling the **`requestToDest`** function on the source chain Gateway contract. Using this nonce, you can verify whether a particular request was executed on the destination chain.

### 2. execFlags

Since you can send multiple payloads to multiple contract addresses on the destination chain, the execFlags is an array of boolean values that tells you the status of the individual requests.

<details>
<summary><b>a) If the calls were atomic:</b></summary>

If you sent 3 payloads while initiating the request on the source chain and let’s say the second one failed, you will receive: [true, false, false].

Since the calls were atomic, none of the calls will actually get executed. However, we send you true in the array for the first request so that you know exactly which call failed and help you debug the issue. In the array you received, the place where you received the first false is the index of the call that failed.

#### How to check the final execution status on the destination chain?

```javascript
// function to get if the calls were executed on destination chain
function getTxStatusForAtomicCall(
	  bool[] memory execFlags
	) internal returns (bool)
{
	return execFlags[execFlags.length - 1] == true;
}
```

</details>

<details>
<summary><b>b) If the calls were non-atomic:</b></summary>
If you sent 3 payloads while initiating the request on the source chain and let’s say the second one failed, you will receive: [true, false, true]. This means that the first and the third call executed successfully while the second one failed.
</details>

### 3. execData

Since you can send multiple payloads to multiple contract addresses on the destination chain, the execData is an array of bytes that provides you the return values of the **`handleRequestFromSource`** (on the destination chain) from each of these calls. You can decode this data and process it on the source chain. The decoding for this data is shown with example in the [Ping-Pong contract](../guides/ping-pong-contract/using-gateway-contract#handling-the-acknowledgement-received-from-destination-chain).

<details>
<summary><b>a) If the calls were atomic:</b></summary>
If you sent 3 payloads while initiating the request on the source chain and let’s say the second one failed, you will receive: [returnData, errorData, emptyData].
</details>

<details>
<summary><b>b) If the calls were non-atomic:</b></summary>
If you sent 3 payloads while initiating the request on the source chain and let’s say the second one failed, you will receive: [returnData, errorData, returnData].
</details>
