---
title: Cross-chain Ping Pong
sidebar_position: 1
description: A simple ping pong dApp using Router CrossTalk
---

## Overview

In this section, we will create a cross-chain ping pong dApp using Router CrossTalk. Using this dApp, you can send any message (ping) from a source chain to a destination chain and receive an acknowledgment (pong) back to the source chain. 

## Step-by-Step Guide

<details>
<summary><b>Step 1) Prerequisites </b></summary>
Before you begin, ensure you have met the following requirements:

* [Sui](https://docs.sui.io/guides/developer/getting-started/sui-install)
* [Node.js](https://nodejs.org/en/download/package-manager)

</details>

<details>
<summary><b>Step 2) Cloning the Ping Pong Contract Locally Written In Sui Move</b></summary>

```bash
git clone https://github.com/router-protocol/new-crosstalk-sample.git
```
After cloning the this repo, change your directory:

```bash
cd ./sui
```
</details>

<details>
<summary><b>Step 3) Program Structure </b></summary>

### Events

* [`AckFromDestination`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/sui/contracts/ping_pong/sources/ping_pong.move#L23): Acknowledgment event emitted after receiving a message from a destination chain.
* [`PingFromSource`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/sui/contracts/ping_pong/sources/ping_pong.move#L30): Event emitted when a ping is received from a source chain.
* [`NewPing`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/sui/contracts/ping_pong/sources/ping_pong.move#L19): Event emitted when a new ping is sent.

### Main Functions

* 💡[`initialize`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/sui/contracts/ping_pong/sources/ping_pong.move#L73): Set's metadata object in state and chain id.
* [`set_dapp_metadata`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/sui/contracts/ping_pong/sources/ping_pong.move#L131): Sets the fee payer on the router chain. This enables the chain to deduct the fee from the designated fee payer for any cross-chain request (fees are deducted in ROUTE tokens).
:::note
`set_dapp_metadata` must be called before invoking the `i_ping` request.
:::
* [`i_ping`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/sui/contracts/ping_pong/sources/ping_pong.move#L84): Sends a ping to another blockchain, specifying the destination chain, contract, and metadata. Internally, it initializes a `request_packet` account and sets the destination contract and packet.
:::note
Please note, before making a ping call, approve the fee payer request on explorer.
:::
* [`i_receive`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/sui/contracts/ping_pong/sources/ping_pong.move#L150): Receives a ping from another chain and processes it.
* [`i_ack`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/sui/contracts/ping_pong/sources/ping_pong.move#L182): Acknowledges a message and emits relevant events.

Implementing the default trait is necessary on Sui to acheive cross-chain functionality.
</details>


<details>
<summary><b>Step 4) Build Ping Pong Program And Publish It On Testnet </b></summary>

Build program before deploying

```bash
sui move build
```

Publish it now on testnet

```bash
sui client switch --env testnet                                                                                                      
```

```bash
sui client publish --gas-budget 8000000000 .
```
</details>

