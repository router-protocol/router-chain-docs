---
title: i_Ack
sidebar_position: 3
---

# `i_Ack` Function

Once the **`i_Receive`** function is executed, an acknowledgment is generated from Router's destination chain Gateway contract, which will specify whether the calls were successful. We need to implement a **`i_Ack`** function in our contract with the following schema.

```rust
fn i_ack(&self, request_identifier: U128, exec_flag: bool, exec_data: Vec<u8>);
```

You need to handle the acknowledgment inside this function. This function receives the following params:

### 1. request_Identifier

This is the same nonce you receive while calling the `i_Send()` function on the source chain Gateway contract. Using this nonce, you can verify whether a particular request was executed on the destination chain.

### 2. exec_Flag

`exec_Flag` is a boolean value that tells you the status of your call or request.

### 3. exec_Data

The `exec_Data` parameter is the data in bytes that provides the return value from the read call included in the read request. Based on the application's requirement, this data can be decoded and processed on the source chain.
