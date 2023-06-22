---
sidebar_position: 1
---
# Introduction

##  What is Router Chain?

The Router chain is a layer 1 blockchain that leverages tendermint’s Byzantine Fault Tolerant (BFT) consensus engine. As a Proof of Stake (PoS) blockchain, the Router chain is primarily run by a network of validators with economic incentives to act honestly. The Router chain is built using the Cosmos SDK and encapsulates all the features of Cosmos, including fast block times, robust security mechanisms, and, most importantly, CosmWasm - a security-first smart contract platform. By leveraging the CosmWasm toolkit, developers can start building secure blockchain applications on the Router chain from scratch or port their existing applications to the Router chain with minimal overhead.

## Router Chain as an Interoperability Layer
In addition to its functionalities as a blockchain network, the Router chain provides an innovative
solution to the problem of blockchain interoperability. Apart from validating state changes on the Router
chain, validators running on the Router chain can also monitor state changes on other chains. Applications
on the Router chain can write custom logic to trigger events in response to these external state changes.
Additionally, applications on the Router chain can leverage a trustless network of relayers to update
states on external chains. The Router architecture allows contracts on one chain to interact
with contracts on other chains in a secure and decentralized manner. 
<!-- More details regarding the Router
chain and how it enables cross-chain communication are given in the following sections. -->

## Communication via Router CrossTalk
Router's CrossTalk library is an extensible cross-chain framework that enables seamless state transitions across multiple chains. In simple terms, this library abstracts Router's functionalities to allow contracts on one chain to pass instructions to contracts deployed on some other chain. The library is structured in a way that it can be integrated seamlessly into your development environment to allow for cross-chain message passing without disturbing other parts of your product. 

CrossTalk supports both stateful and stateless bridging:
- For cross-chain dApps that require custom bridging logic between any two chains, developers can build and deploy middleware contracts on the Router chain. All cross-chain requests originating from the dApp's source chain contract will come to this middleware contract where some actions can be performed before they are forwarded to the intended destination chain.
- For dApps that do not require any custom bridging logic or any data aggregation layer in the middle, no middleware contract is required. 


## Global Liquidity via Voyager
Voyager is a cross-chain swapping engine that allows for cross-chain asset transfers as well as cross-chain sequencing of asset transfers and arbitrary instruction transfers. Voyager has a whole development suite around it, which includes:
1. a widget that can be used by other projects to give their users an option to perform cross-chain transactions directly from their UI;
2. an API and a SDK that abstracts Voyager's backend capabilities for projects that want to use their own UI/platform for offering the cross-chain asset swap functionality;
3. most importantly, the sequencer library, which allows developers to build cross-chain applications that require both asset transfer and instruction transfer in a single cross-chain request. 
