---
title: Cross-chain Asset Transfer
sidebar_position: 1
---

When a user calls a function to transfer funds to another chain, the Voyager Deposit Handler contract will process the transaction, deduct the funds from user’s wallet and create a cross-chain communication request to the Router Chain endpoint. After receiving data from the source chain, our bridge contract on the Router Chain will process the request, make some necessary checks and deduct the fees required for the transaction to be processed. Once this is complete, it will fire a transaction to the destination chain to complete the cross-chain transfer request.

### Edge Cases

#### 1. What if liquidity is not available for a token on the destination chain?
The user will get the Wrapped tokens for those tokens on the destination chain which can be redeemed as soon as the liquidity is available on the chain.
    
#### 2. What if I end up getting lesser amount of tokens on the destination chain than the minimum amount promised to me?
This would never happen. The amount of destination tokens received depends on the DEX output while swapping the tokens. Maybe the output changed between the time that elapsed between when the amount was shown to you and the actual execution. In this case, the swap may result in lesser output for the user, but at Voyager, we have a policy of no loss to the user. So we provide you stable tokens equivalent to the minimum amount displayed to you instead of the token which was the output of the DEX so that you do not suffer any loss.