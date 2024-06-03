---
title: 2) Extending an Existing Token to Multiple Chains
sidebar_position: 2
---


To integrate a new token that is already present on some blockchains, the following steps have to be followed: 

### 1. Granting Minter Role

On the original token contract, grant Minter Role to the AssetBridge contract on the chains where the original token is present. You can find the AssetBridge contract addresses [here](../assetbridge-contract-addresses).

### 2. Creating Wrapped Token Versions

Wrapped tokens are versions of the original token that exist on different blockchains. These tokens maintain a 1:1 value ratio with the original token.

- **Identify the Target Chains:** Determine which blockchains you want to extend the token to.
- **Develop Wrapped Token Contracts:** For each target chain, create a smart contract for the wrapped token. This contract should include functionality for minting and burning tokens, which will be tied to the locking and unlocking of the original tokens.

### 3. Deploying rAsset Tokens [Only if the token existed on more than one chain]

In cases where the token exists on more than one chain, the token will follow the "lock-and-mint" flow from multiple chains. In this scenario, there's a possibility that the user is trying to unlock X amount of tokens from one chain, but that chain doesn't have that amount of tokens. To handle this case, the developers need to deploy rAsset contract on each blockchain where the original token is present. rAsset tokens are a proof of liquidity that maintain a 1:1 mapping with their underlying assets. Each rAsset token can only be minted if an equivalent amount of the original asset is locked.

For example, consider that ROUTE token is natively present on Ethereum and Polygon. A user locks 1000 ROUTE on Ethereum and 800 ROUTE on Polygon and mints 1800 ROUTE on Arbitrum. Now, let's say the user burns 1200 ROUTE tokens on Arbitrum and requests them on Polygon. Since only 800 ROUTE is locked on Polygon, only 800 ROUTE can be unlocked there. To make sure user doesn't face any losses, the user will be given 400 rROUTE which will serve as proof of liquidity. The user can redeem this rROUTE 1:1 for ROUTE whenever more ROUTE gets deposited on Polygon. 

### 4. Whitelisting the Token on Asset Bridge Contracts

To facilitate the cross-chain transfer of the token, it must be whitelisted on the AssetBridge contracts. This will allow the bridge to recognize and handle the token transfer.

### 5. Further Configurations
Reach out to the Router team [here](https://t.me/Alpie01). The Router team will handle the AssetBridge contract configuration on the Router chain. Additionally, the Router team will set up the pathfinder Nitro API configurations and update the user interface (UI) as well as the Router Explorer to incorporate the new token.