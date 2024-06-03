---
title: Transfer of Tokens via the Reverse Verification Mechanism
sidebar_position: 2
---

```javascript
function iDeposit(
    uint256 partnerId,
    bytes32 destChainIdBytes,
    bytes calldata recipient,
    address srcToken,
    uint256 amount,
    uint256 destAmount
) external payable {}
```

Voyager enables cross-chain transfers of multiple tokens via this function. Whenever a user wants to transfer tokens from a source chain to a destination chain, this function has to be called. After this function is invoked on the source chain, Voyager will handle the transfer of tokens to the user on the destination chain.


### Parameters

| partnerId  | Unique ID for each partner who integrates this functionality and has a fee sharing model with Router. This helps them to track and analyze their cross-chain transactions easily.           |
| --------------- | -------------------------------------------------------------------------------------- |
| destChainIdBytes        | Network IDs of the chains in bytes32 format. These can be found [here](../supported-chains-tokens).                       |
| recipient     | Wallet address that will receive the tokens on the destination chain. |
| srcToken | Address of the token that has to be transferred from the source chain.                                                                   |
| amount | Decimal-adjusted amount of the token that has to be transferred from the source chain.                                                                   |
| destAmount | Minimum amount of tokens expected to be received by the recipient on the destination chain. This can be achieved by subtracting the forwarder fee from the source chain amount.                                                              |


:::info
You can estimate the forwarder fee using this [API](https://api.trustless-voyager.alpha.routerprotocol.com/api#/Fees/FeeController_getFeesForChainInTokenTerms). Mark the `checkLiquidity` boolean value as true.
:::

