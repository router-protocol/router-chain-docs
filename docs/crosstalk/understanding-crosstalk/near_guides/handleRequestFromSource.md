---
title: handle_request_from_source
sidebar_position: 2
---

# `handle_request_from_source` Function

The cross-chain request initiated from the source chain will deliver the payload to the destination contract address specified in the contract_calls parameter. On the destination contract, a function needs to be implemented to handle this payload:

```javascript
pub fn handle_request_from_source(
	&self,
	source_contract_address: String,
	payload: Vec<u8>,
	source_chain_id: String,
	source_chain_type: u64,
) -> String;
```

In this function, you will get the address of the contract that initiated this request from the source chain, the payload you created on the source chain, the source chain ID, and the source chain type. After receiving this information, you can process your payload and complete your cross-chain transaction.

> **Warning:** This function is necessary to implement on your contract on the destination chain; otherwise, the call will fail.
