---
title: Architecture
sidebar_position: 1
---

Voyager consists of smart contracts that are deployed on all the blockchains that it supports and a middleware contract sitting on the Router Chain which forms the abstraction layer for many complexities of the cross-chain communication.

The smart contracts include the Voyager Deposit Handler, the Voyager Execute Handler, the Voyager Utils contract etc. The Voyager Deposit Handler is responsible for handling the deposits from users on the source chain while the Voyager Execute Handler is responsible for execution of the transaction on the destination chain.