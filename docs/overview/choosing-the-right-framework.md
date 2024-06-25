---
title: Choosing the Right Cross-chain Framework
sidebar_position: 2
---

Router Protocol provides two ways using which developers can build cross-chain applications, namely -


1. CrossTalk framework (stateless and stateful communication)
2. Nitro (leveraging global liquidity with message transfers)

Let us now understand which framework best suits your requirements before using it in your dApp. 


### CrossTalk Framework
#### Stateless
For standard cross-chain instruction transfers, CrossTalk framework is the best option. It is an easy-to-implement cross-chain smart contract library that can convert your existing multi-chain applications to cross-chain applications. CrossTalk's ability to transfer multiple contract-level instructions in a single cross-chain call makes it a very powerful tool. Various dApps like cross-chain NFTs (burning an NFT on one chain and minting it on another) and cross-chain lending/borrowing applications (enabling a borrower to provide collateral on one chain and then transferring an instruction to mint/unlock the borrower's desired token on the destination chain) can be built using this framework.


#### Stateful
If an application does not require any logic in the middle or does not need any accounting layer, CrossTalk's generic workflow can be used. However, if you want to build an application that requires custom bridging logic or a decentralized accounting layer, you can use CrossTalk's stateful bridging. For example, you can use stateful bridging to create a multi-chain NFT collection with a single place to maintain the list of all the NFTs minted on different chains. If you wanted to use existing solutions, you'd have to maintain this list on all the chains where your dApp is deployed. In this case, by removing the redundancy involved in accounting, a CosmWasm contract on the Router Chain act as a data aggregation layer. Another potential dApp that can benefit from Router's middleware capabilities is a cross-chain DEX. You'll need to deploy the token-swapping logic only on the Router Chain, while smart contracts on other chains only need to include the locking/unlocking logic. 


### Nitro
Nitro (previously Voyager) is the native cross-chain asset-transfer bridge built on Router. It acts as the gateway to the liquidity managed by Router Protocol. Developers can use Nitro to access this liquidity and build either (a) other asset-transfer applications or (b) applications requiring both an asset transfer and an instruction transfer in a single sequenced cross-chain request. A very good example of the latter is a cross-chain staking application that needs to transfer users' funds and an instruction to stake them in a particular contract, both in a single cross-chain request. 
