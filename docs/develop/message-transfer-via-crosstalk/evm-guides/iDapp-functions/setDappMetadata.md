---
title: setDappMetadata
sidebar_position: 4
---

# `setDappMetadata` Function

```javascript
function setDappMetadata(
    string memory feePayerAddress
    ) external returns (uint64)
```

- To facilitate cross-chain transactions, it is necessary to pay the fees on the Router chain. This can be achieved using the `setDappMetadata` function available in the Gateway contracts. The function takes a `feePayerAddress` parameter, which represents the account responsible for covering the transaction fees for any cross-chain requests originating from the dApp.

- Once the `feePayerAddress` is set, the designated fee payer must approve the request to act as the fee payer on the Router chain. Without this approval, dApps will not be able to execute any cross-chain transactions.

- It's important to note that any fee refunds resulting from these transactions will be credited back to the dApp's `feePayerAddress` on the Router chain.
