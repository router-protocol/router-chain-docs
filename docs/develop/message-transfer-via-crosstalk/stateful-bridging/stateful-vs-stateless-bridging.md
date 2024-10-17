---
title: Stateful vs Stateless Bridging
sidebar_position: 2
description: Difference between stateful and stateless bridging
---

Till now, we have majorly focused on Router's stateless bridging capabilities (bridging without custom bridging logic). However, we did touch upon our capability to support stateful bridging [here](../router-chain-guides/idapp-functions). In this section, we'll expand upon this feature. 

## Stateful vs Stateless Bridging
Before diving deep into Router's stateful bridging capabilities, it is important to understand what is actually means. In the context of decentralized systems, a stateful entity is one that has a “brain” to persist past data in its memory and perform computation on the fly. For example, smart contracts are considered stateful because they allow users to perform computations on the blockchain and store data in the form of variables. Extending this concept to blockchain interoperability, a stateful bridging infrastructure allows applications built on it to implement custom bridging logic. In other words, a stateful bridge can perform case-based routing. 

A stateless bridge, on the other hand, does not support storage or computation. It simply routes a cross-chain transaction from the source chain to the destination chain as it is. To have case-based routing with a stateless bridge, applications must lay out all the scenarios in contracts deployed across all the chains, which adds too much overhead. On chains like Ethereum, performing computation might even be costly, so it would make much more sense to delegate the computation to a cheaper stateful middleware.

:::tip
Stateful bridging only makes sense for a cross-chain dApp if it wants to incorporate a custom bridging logic or wants to use a middleware contract on the Router Chain as an accounting module.
:::

