---
title: set_dapp_metadata
sidebar_position: 5
---

# `set_dapp_metadata` Function

```javascript
fn set_dapp_metadata(&self, fee_payer_address: String);
```

- To facilitate cross-chain transactions, it is necessary to cover the fees on the Router Chain. This is achieved via the `set_dapp_metadata` function available in the Gateway contracts. The function takes a `fee_payer_address` parameter, which represents the account responsible for covering the transaction fees for any cross-chain requests originating from the dApp.

- Once the `fee_payer_address` is set, the designated fee payer must approve the request to act as the fee payer on the Router Chain. Without this approval, dApps will not be able to execute any cross-chain transactions.

- It's important to note that any fee refunds resulting from these transactions will be credited back to the dApp's `fee_payer_address` on the Router Chain. 