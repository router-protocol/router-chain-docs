---
title: Overview
sidebar_position: 1
description: Intro to Router's Asset Transfer Bridges
---


## Motivation
Without a robust mechanism that promotes dynamic liquidity migration across various blockchains, there will be a cap on current as well as upcoming L1s/L2s achieving their full potential. Even with the progression of cross-chain bridges from just “asset transfer” tools to cross-chain communication frameworks, one of their most essential use-cases remains asset transfers across various chains. Cross-chain bridges can enable liquidity to flow seamlessly between blockchains and increase capital efficiency in the system. Such bridges can operate between two blockchains, between a blockchain and a side chain, or even between two side chains. With Voyager/Nitro, we want to give users an efficient and secure way to not just transfer, but swap assets across chains.

## About Router's Asset Transfer Bridges
Both generation of Router's cross-chain swapping engines facilitate cross-chain asset transfers as well as sequenced cross-chain asset and instruction transfers. 

### Voyager (1st Generation Bridge)
Voyager (now decommissioned) used lock/unlock and burn/mint mechanism to transfer funds from one chain to another. Before funds are unlocked/minted to a user's wallet on the destination chain, a set of nodes attested the validity of the user's source chain deposit. For example, if a user wanted to transfer ROUTE from Avalanche to Arbitrum, Voyager would burn user's ROUTE on Arbitrum and mint an equivalent amount of ROUTE on Arbitrum.

### Nitro (2nd Generation Bridge)
Nitro uses a trustless approach to handle cross-chain asset transfers. In this approach, an entity called the forwarder provides the user with the desired asset on the destination chain. Once the forwarder's settlement on the destination chain is verified, it can claim the funds deposited by the user on the source chain. This approach is highly optimized in terms of latency and cost involved (for smart contract operations).
 
As mentioned above, in addition to asset transfers, both these bridges also allow users to perform operations after the transfer of tokens is executed on the destination chain without any external triggers. This opens up a multitude of possibilities for the emerging chain-agnostic future.


## Differences between Voyager Nitro
| Bridge               | Voyager (1st Gen)                                        | Nitro (2nd Gen)                                        |
| --------------------- | ---------------------------------------------- | ---------------------------------------------- |
| **Trust Assumptions**      | Trust Minimized          | Trustless        |
| **Asset Transfers**          | Yes               | Yes      |
| **Asset Swaps**               | Yes        | Yes      |
| **Assets Supported**          | All arbitrary assets  | Limited |
| **Time Taken for Asset Transfers**      | 2-5 minutes          | Under 2 minutes       |
| **Sequenced Requests**      | Yes          | Yes        |


