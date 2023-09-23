---
title: Overview
sidebar_position: 2
description: Intro to Voyager
---


## Motivation
Without a robust mechanism that promotes dynamic liquidity migration across various blockchains, there will be a cap on current as well as upcoming L1s/L2s achieving their full potential. Even with the progression of cross-chain bridges from just “asset transfer” tools to cross-chain communication frameworks, one of their most essential use-cases remains asset transfers across various chains. Cross-chain bridges can enable liquidity to flow seamlessly between blockchains and increase capital efficiency in the system. Such bridges can operate between two blockchains, between a blockchain and a side chain, or even between two side chains. With Voyager, we want to give users an efficient and secure way to not just transfer, but swap assets across chains.

## About Voyager
Voyager is a cross-chain swapping engine that facilitates cross-chain asset transfers as well as sequenced cross-chain asset and instruction transfers. 

### Voyager v1.0
Voyager v1.0 uses lock/unlock and burn/mint mechanism to transfer funds from one chain to another. Before funds are unlocked/minted to a user's wallet on the destination chain, a set of nodes attest the validity of the user's source chain deposit. For example, if a user wants to transfer ROUTE from Avalanche to Arbitrum, Voyager would burn user's ROUTE on Arbitrum and mint an equivalent amount of ROUTE on Arbitrum.

### Voyager v2.0
Voyager uses a trustless approach to handle cross-chain asset transfers. In this approach, an entity called the forwarder provides the user with the desired asset on the destination chain. Once the forwarder's settlement on the destination chain is verified, it can claim the funds deposited by the user on the source chain. This approach is highly optimized in terms of latency and cost involved (for smart contract operations).
 
As mentioned above, in addition to asset transfers, Voyager (both v1.0 and v2.0) also allows users to perform operations after the transfer of tokens is executed on the destination chain without any external triggers. This opens up a multitude of possibilities for the emerging chain-agnostic future.

## About Voyager v2.0


## Differences between Voyager v1.0 and v2.0
| Version               | v1.0                                        | v2.0                                         |
| --------------------- | ---------------------------------------------- | ---------------------------------------------- |
| **Trust Assumptions**      | Trust Minimized          | Trustless        |
| **Asset Transfers**          | Yes               | Yes      |
| **Asset Swaps**               | Yes        | No      |
| **Assets Supported**          | All arbitrary assets  | Limited |
| **Time Taken for Asset Transfers**      | 2-5 minutes          | Under 2 minutes       |
| **Sequenced Requests**      | Yes          | Yes        |


