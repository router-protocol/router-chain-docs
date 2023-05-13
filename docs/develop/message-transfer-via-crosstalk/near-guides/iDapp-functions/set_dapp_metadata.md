---
title: set_dapp_metadata
sidebar_position: 5
---

# `set_dapp_metadata` Function

```javascript
fn set_dapp_metadata(&self, fee_payer_address: String);
```

- To facilitate cross-chain transactions, it is necessary to cover the fees on the Router chain. This is achieved through the `set_dapp_metadata` function available in the Gateway contracts, which requires specifying a `fee_payer_address` as a parameter. The designated fee payer account assumes responsibility for paying the transaction fees for any cross-chain requests originating from the dApp.

- Once the `fee_payer_address` is set, it is essential for the fee payer to provide approval to act as the fee payer on the Router chain. Without this approval, dApps will be unable to execute any cross-chain transactions.

- It's important to note that any fee refunds will be credited to the dApp's designated `fee_payer_address` on the Router chain.
