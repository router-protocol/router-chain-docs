---
title: Transfer of USDC via Circle's Burn and Mint Flow
sidebar_position: 1
---
import RelayerAPIData from '../../../../../src/utils/RelayerFees'


```javascript
function iDepositUSDC(
    uint256 partnerId,
    bytes32 destChainIdBytes,
    bytes memory recipient,
    uint256 amount
) external payable {}

```
Voyager v2.0 enables cross-chain transfer of USDC on Arbitrum, Avalanche, Ethereum and Optimism via Circle. In this approach, USDC can be burnt on the source chain and minted on the destination chain. 

When a user wants to transfer USDC between the aforementioned chains, the `iDepositUSDC` function has to be called. Once this function is called, Voyager will handle the interaction with Circle and ensure the end-to-end transfer of USDC to the user on the destination chain.

### Parameters

| partnerId  | Unique ID for each partner who integrates this functionality and has a fee sharing model with Router. This helps them to track and analyze their cross-chain transactions easily.           |
| --------------- | -------------------------------------------------------------------------------------- |
| destChainIdBytes        | Network IDs of the chains in bytes32 format. These can be found [here](https://github.com/router-protocol/router-chain-docs/blob/main/docs/develop/voyager/tools/configurations/chain-id-identifiers.md).                       |
| recipient     | Wallet address that will receive the tokens on the destination chain. |
| amount | Decimal-adjusted amount of the USDC tokens that have to be transferred.                                                                    |