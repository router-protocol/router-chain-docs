---
title: Application Specific Explorer
sidebar_position: 3
---

## Overview

The router chain provides a generic explorer using which anyone can track the Blocks, Transactions, Inbound Requests, Outbound Requests etc independently.

However there could be scenarios where an application might want to create their custom explorer for custom requirements. Examples include custom logic to correlate inbound and outbound requests and show end to end status of the transaction from source chain to destination chain or an application might want to just show their transactions to their users rather than asking them to go to router chain explorer (RouterScan).

To support such use cases we have created a simple javascript SDK which the applications can easily embed in their UI, make queries to our explorer backend and create their custom explorer as required.

## SDK Details

The SDK exposes the APIs to query the explorer backend to fetch different types of requests such as the inbound requests, outbound requests etc. based on various filters such as source address, chainId, eventNonce etc.
You can look at the functions available in the SDK [here](https://router-protocol.github.io/router-chain-ts-sdk/classes/RouterExplorer.html).