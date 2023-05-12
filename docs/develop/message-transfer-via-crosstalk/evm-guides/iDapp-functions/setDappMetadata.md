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

- For executing cross-chain transactions, you need to pay the fees on the Router chain. For this, we have a function `setDappMetadata` in our Gateway contracts that takes a `feePayerAddress` as its parameter. This fee payer account will be responsible for paying the transaction fee of any cross-chain requests originating from your dApp. 
- After the `feePayerAddress` is set, the fee payer has accept the request to act as the fee payer on the Router chain. If the approval for this is not given by the fee payer account, dApps won't be able to execute any cross-chain transaction.
- Note that all the fee refunds will be credited to the dApp's `feePayerAddress` on the Router chain.
