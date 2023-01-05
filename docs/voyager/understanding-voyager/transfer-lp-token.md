---
title: Transfer of LP Tokens
sidebar_position: 6
---

```javascript
function depositLPToken(bytes memory swapData, bytes memory executeData) external
```

LP tokens are the tokens for which wrapped versions were created by the Voyager. These tokens are received when a user provides liquidity to the Voyager. These are pegged one-to-one to the underlying asset and can be redeemed on the Voyager.

When a user wants to transfer any of the LP tokens from the source chain to get any other token on the destination chain, this function is to be called. After this function is called, the Voyager’s infrastructure will handle the transfer of tokens to the other chain.

The parameters <code>swapData</code> and <code>executeData</code> and the functionality of this function are similar to those in the reserve token transfer which can be found [here](./transfer-reserve-token#swap-data).