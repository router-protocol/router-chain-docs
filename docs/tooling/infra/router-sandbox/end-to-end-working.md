---
title: End-to-end Working
sidebar_position: 2
description: How Router Sandbox Works?
---



Before understanding the end-to-end working of Router Sandbox, let us first understand the steps involved in deploying any testnet iDapp using Router:

**Step 1)**  Setting up a wallet on multiple chains and sourcing respective testnet funds to interact with the testnets.

**Step 2)**  Writing and compiling smart contracts with all the relevant functions, including iSend (to send a request to the destination chain), iReceive (to handle a request received from the source chain) and iAck (to handle an acknowledgement received from the destination chain).

**Step 3)**  Deploying the compiled smart contracts on all the required chains. For example, if you want your application to be live on Fuji, Mumbai and Arbitrum Goerli, you’ll have to deploy your contracts on all these three chains. 

**Step 4) [Optional]** Verifying your contracts to allow for interaction with the contract directly from the relevant block explorer. 

**Step 5)** Setting the fee payer address for each contract. The fee associated with any cross-chain request initiated by a dApp is paid by the dApp's corresponding fee payer account on the Router Chain. This fee payer account need to be set by the dApp deployers for all the integrated chains and can be changed anytime. The fee payer account on the Router Chain also has to approve the dApp’s request to be its fee payer (to prevent dApp deployers from unilaterally setting any random account as their fee payer account). 

**Step 6)**  Performing a test transaction from one chain to another as a sanity check.

With Router Sandbox, we have abstracted all the steps mentioned above into a one-click platform wherein the user can deploy their iDapps by merely choosing the type of iDapp they want to deploy and configuring the chains where they want their iDapp. Behind the scenes, Router Sandbox:
- generates a random wallet using ```ethers.wallet.createRandom()``` and sends some native testnet tokens to that wallet (on the chains selected by the user);
- depending on the user selection, deploys one of our preprogrammed and compiled contracts with the required constructor parameters (including the fee payer address) - `PingPong.sol`, `XERC20.sol` (cross-chain ERC20), `XERC1155.sol` or `XERC721.sol` (cross-chain NFTs); 
- verifies the contract on the respective chain’s block explorer;
- approves the fee payer request on behalf of the fee payer account on the Router Chain;
- executes a test transaction on behalf of the user on the newly deployed iDapp;

:::info
To prevent sybil attacks on Router Sandbox, we have limited the number of requests from any IP address to 5 per day. 
:::
