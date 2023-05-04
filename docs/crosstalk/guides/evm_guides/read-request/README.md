---
title: Cross-chain Read Request Sample Contract
sidebar_position: 3
description: A Cross-chain read request sample contract
---

# Overview

One of the most underrated, albeit important, aspects of blockchain interoperability is being able to read the state of contracts present on one chain (say chain A) from a different chain (say chain B). A good example of this could be a Soul-bound Token (SBT). Let us assume that every user gets a SBT on chain A, which contains the user's Date of Birth (DoB) information. This information can come in handy for multiple dApps that want to restrict users below a particular age. Creating this SBT on multiple chains will not make sense, but having the information of the SBT across multiple chains is essential for dApps to be able to access this information and use it. To achieve this, applications can use Router to generate a decentralized read request between two chains. This request will include (a) the contract state to read on the destination chain (in this case, the user's age) and (b) the operation to be performed when the data is received back on the source chain (in this case, it could be to accept/deny user's request to access a gambling application).

### EVM Guides

- [Sample Read Call Contract](./sample-read-call-contract.md)