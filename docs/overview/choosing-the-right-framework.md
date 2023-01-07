---
title: Choosing the Right Cross-chain Framework
sidebar_position: 2
---

Router Protocol provides three ways using which developers can build cross-chain applications, namely -

1. OmniChain framework (middleware contracts on the Router chain)
2. CrossTalk framework
3. Voyager (leveraging global liquidity with message transfers)

Since all three offer different features, it is crucial to understand which framework best suits your requirements before using it in your dApp. 

### OmniChain Framework

This is the framework for you if you want to build an application that requires custom bridging logic or a decentralized accounting layer. For example, you can use this framework to create a multi-chain NFT collection with a single place to maintain the list of all the NFTs minted on different chains. If you wanted to use existing solutions, you'd have to maintain this list on all the chains where your dApp is deployed. In this case, by removing the redundancy involved in accounting, a CosmWasm contract on the Router chain act as a data aggregation layer. Another potential dApp that can benefit from Router's middleware capabilities is a cross-chain DEX. You'll need to deploy the token-swapping logic only on the Router chain, while smart contracts on other chains only need to include the locking/unlocking logic. 

### CrossTalk Framework
For cross-chain instruction transfers that do not require any logic in the middle or do not need any accounting layer, Router's CrossTalk framework is the best option. It is an easy-to-implement cross-chain smart contract library that does not require you to deploy any new contract - only a few lines of code need to be included, and your single-chain contract will become a cross-chain contract. CrossTalk's ability to transfer multiple contract-level instructions in a single cross-chain call makes it a very powerful tool. More about CrossTalk's capabilities has been included in the [**Understanding CrossTalk** section](../crosstalk/understanding-crosstalk/) of the developer documentation. Various dApps like cross-chain NFTs (burning an NFT on one chain and minting it on another) and cross-chain lending/borrowing applications (enabling a borrower to provide collateral on one chain and then transferring an instruction to mint/unlock the borrower's desired token on the destination chain) can be built using this framework.

### Voyager
Voyager is the native cross-chain asset-transfer bridge built using Router's OmniChain framework. It acts as the gateway to the liquidity managed by Router Protocol. Developers can use Voyager to access this liquidity and build either (a) other asset-transfer applications or (b) applications requiring both an asset transfer and an instruction transfer in a single sequenced cross-chain request. A very good example of the latter is a cross-chain yield aggregator that needs to transfer users' funds and an instruction to stake them in a particular contract, both in a single cross-chain request. 