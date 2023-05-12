---
title: i_ack
sidebar_position: 4
---

# `i_ack` Function

Once the **`i_receive`** function is executed, an acknowledgment is generated from Router's destination chain Gateway contract, which will specify whether the calls were successful. We need to implement an **`i_ack`** function in our contract with the following schema:

```javascript
fn i_ack(&self, request_identifier: U128, exec_flag: bool, exec_data: Vec<u8>);
```

You need to handle the acknowledgment inside this function. This function receives the following params:

### 1. request_identifier

This is the same nonce you receive while calling the `i_send()` function on the source chain Gateway contract. Using this nonce, you can verify whether a particular request was executed on the destination chain.

### 2. exec_flag

`exec_flag` is a boolean value that tells you the execution status of your request on destination chain.

### 3. exec_data

The `exec_data` parameter is the data in bytes that provides the abi-encoded return value from the `i_receive` call on the destination chain. Based on the application's requirement, this data can be decoded and processed on the source chain.
