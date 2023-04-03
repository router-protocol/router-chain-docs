---
title: handle_crosstalk_ack
sidebar_position: 3
---

# `handle_crosstalk_ack` Function

Once the **`handle_request_from_source`** function is executed, an acknowledgment is generated from Router's destination chain Gateway contract, which will specify whether the calls were successful. We need to implement a **`handle_crosstalk_ack`** function in our contract with the following schema.

```javascript
pub fn handle_crosstalk_ack(
    &self,
    event_identifier: u64,
    exec_flags: Vec<bool>,
    exec_data: Vec<Vec<u8>>,
)
```

If you have opted not to receive the acknowledgement, you can implement an empty function in its place in the following way:

```javascript
pub fn handle_crosstalk_ack(
    &self,
    event_identifier: u64,
    exec_flags: Vec<bool>,
    exec_data: Vec<Vec<u8>>,
) {}
```

If you've opted to receive the acknowledgment, you need to handle the acknowledgment inside this function. This function receives the following params:

### 1. event_identifier

This is the nonce you received when while calling the **`request_to_dest`** function on the source chain Gateway contract. Using this nonce, you can verify whether a particular request was executed on the destination chain.

### 2. exec_flags

Since you can send multiple payloads to multiple contract addresses on the destination chain, the exec_flags is an array of boolean values that tells you the status of the individual requests.

<details>
<summary><b>a) If the calls were atomic:</b></summary>

If you sent 3 payloads while initiating the request on the source chain and let’s say the second one failed, you will receive: [true, false, false].

Since the calls were atomic, none of the calls will actually get executed. However, we send you true in the array for the first request so that you know exactly which call failed and help you debug the issue. In the array you received, the place where you received the first false is the index of the call that failed.

#### How to check the final execution status on the destination chain?

```javascript
// function to get if the calls were executed on destination chain
pub fn get_tx_status_for_atomic_call(
  exec_flags: Vec<bool>
) -> bool {
  if exec_flags.len() > 0 {
    return exec_flags[exec_flags.len() - 1] == true;
  } else {
    return false;
  }
}
```

</details>

<details>
<summary><b>b) If the calls were non-atomic:</b></summary>
If you sent 3 payloads while initiating the request on the source chain and let’s say the second one failed, you will receive: [true, false, true]. This means that the first and the third call executed successfully while the second one failed.
</details>

### 3. exec_data

Since you can send multiple payloads to multiple contract addresses on the destination chain, the exec_data is an array of bytes that provides you the return values of the **`handle_request_from_source`** (on the destination chain) from each of these calls. You can decode this data and process it on the source chain. The decoding for this data is shown with example in the [Ping-Pong contract](../guides/ping-pong-contract/using-gateway-contract#handling-the-acknowledgement-received-from-destination-chain).

<details>
<summary><b>a) If the calls were atomic:</b></summary>
If you sent 3 payloads while initiating the request on the source chain and let’s say the second one failed, you will receive: [return_data, error_data, empty_data].
</details>

<details>
<summary><b>b) If the calls were non-atomic:</b></summary>
If you sent 3 payloads while initiating the request on the source chain and let’s say the second one failed, you will receive: [return_data, error_data, return_data].
</details>
