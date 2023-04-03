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

- For making cross-chain transactions, you need to pay the fees on the router chain. For this, we have a function `setDappMetadata` in our gateway contract that takes the address of the fee payer on router chain from which the cross-chain fee will be deducted.
- After the fee payer address is set, the fee payer has to provide approval on the router chain that this address is willing to pay fees for this Dapp thus enabling the Dapp to actually perform the cross-chain transaction.
- Note that all the fee refunds will be credited to this fee payer address.

> **Note:** This function is named `set_dapp_metadata` in NEAR ecosystem.
