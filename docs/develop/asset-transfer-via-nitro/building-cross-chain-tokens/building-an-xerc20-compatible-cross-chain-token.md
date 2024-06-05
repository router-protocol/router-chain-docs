---
title: 3) Building an xERC20 compatible Cross-chain token
sidebar_position: 3
---

xERC20 tokens are a variant of ERC20 tokens that come with modified minting capabilities. The xERC20 token contract is designed with a predefined minting power for each issuer. This minting power is set based on several factors, including the total volume of tokens intended to be issued and the level of trust associated with the token issuer. 


Deploy an xERC20 contract on one chain (any chain based on your preference) and then follow these steps:

1. Grant the Minter role to the Router AssetBridge contract on the chain where the original token in deployed. You can find the AssetBridge contract addresses [here](../supported-chains-tokens).
2. Mint the required supply of the deployed token.
3. For each chain on which you want to integrate the token, create wrapped tokens or mirror tokens.
4. Whitelist the token on the source chain AssetBridge contract.
5. Reach out to the Router team [here](https://t.me/Alpie01). The Router team will handle the AssetBridge contract configuration on the Router chain. Additionally, the Router team will set up the pathfinder Nitro API configurations and update the user interface (UI) as well as the Router Explorer to incorporate the new token.