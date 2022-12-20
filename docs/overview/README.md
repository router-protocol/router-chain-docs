---
sidebar_position: 1
---
# Introduction

##  What is Router Chain?

The Router chain is a layer 1 blockchain that leverages tendermint’s Byzantine Fault Tolerant (BFT)
consensus engine. As a Proof of Stake (PoS) blockchain, the Router chain is primarily run by a network
of validators with economic incentives to act honestly. The Router chain is built using the Cosmos SDK
and encapsulates all the features of Cosmos, including fast block times, robust security mechanisms, and,
most importantly, CosmWasm - a security-first smart contract platform. By leveraging the CosmWasm
toolkit, developers can start building secure blockchain applications on the Router chain from scratch
or port their existing applications to the Router chain with minimal overhead.

## Router Chain as an Interoperability Layer
In addition to its functionalities as a blockchain network, the Router chain provides an innovative
solution to the problem of blockchain interoperability. Apart from validating state changes on the Router
chain, validators running on the Router chain also monitor state changes on other chains. Applications
on the Router chain can write custom logic to trigger events in response to these external state changes.
Additionally, applications on the Router chain can leverage a trustless network of relayers to update
states on external chains. Simply put, the Router architecture allows contracts on one chain to interact
with contracts on other chains in a secure and decentralized manner. More details regarding the Router
chain and how it enables cross-chain communication are given in the following sections.

