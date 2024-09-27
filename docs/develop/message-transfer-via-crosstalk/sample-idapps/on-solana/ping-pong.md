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

* [Rust](https://doc.rust-lang.org/book/ch01-01-installation.html)
* [Solana CLI](https://solana.com/docs/intro/installation)
* [Anchor](https://www.anchor-lang.com/docs/installation)
* [Node.js](https://nodejs.org/en/download/package-manager)

</details>

<details>
<summary><b>Step 2) Cloning the Ping Pong Contract Locally Written In Anchor</b></summary>

```bash
git clone https://github.com/router-protocol/new-crosstalk-sample.git
```
After cloning the this repo, change your directory:

```bash
cd ./solana
```
</details>

<details>
<summary><b>Step 3) Program Structure </b></summary>

### Events

* [`AckFromDestination`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L14): Acknowledgment event emitted after receiving a message from a destination chain.
* [`PingFromSource`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L22): Event emitted when a ping is received from a source chain.
* [`NewPing`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L29): Event emitted when a new ping is sent.

### Main Functions

* 💡[`initialize`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L127): Initializes the `PingPongAccount` with details like chain-id , gateway-authority, owner, and fee settings.
* [`set_dapp_metadata`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L292): Sets the fee payer on the router chain. This enables the chain to deduct the fee from the designated fee payer for any cross-chain request (fees are deducted in ROUTE tokens).
:::note
`set_dapp_metadata` must be called before invoking the `i_ping` request.
:::
* [`i_ping`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L178): Sends a ping to another blockchain, specifying the destination chain, contract, and metadata. Internally, it initializes a `request_packet` account and sets the destination contract and packet.
:::note
Please note, before making a ping call, approve the fee payer request on explorer.
:::
* [`i_receive`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L323): Receives a ping from another chain and processes it.
* [`i_ack`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L346): Acknowledges a message and emits relevant events.

### Helper Functions (internal module)

* [`_when_not_pause`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L41) / [`_when_pause`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L47): Check if the contract is paused/unpaused.
* [`abi_encode_u128_string`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L75): Encodes a u128 and string into a format suitable for cross-chain communication.
* [`abi_decode_u128_string`](https://github.com/router-protocol/new-crosstalk-sample/blob/master/solana/programs/ping_pong/src/lib.rs#L98): Decodes the ABI-encoded u128 and string from received cross-chain messages.

:::note
ABI encoding/decoding is not ideal on Solana due to larger packet sizes. It's recommended to use custom packet structures instead.
:::

Implementing the default trait is necessary on Solana to acheive cross-chain functionality.
</details>


<details>
<summary><b>Step 4) Build Ping Pong Program And Deploy It On Devnet </b></summary>

Build program before deploying

```bash
anchor build
```

Deploy it now on devnet

```bash
anchor deploy --provider.cluster devnet --program-name ping_pong
```

:::note
- Before deploying, ensure that the program address is updated in both `lib.rs` and `Anchor.toml`. After that, rebuild the program and proceed with the deployment.
:::

</details>

<details>
<summary><b>Step 5) Using the Ping Pong Program </b></summary>

You can interact with the deployed program with written scripts, to interact add `PRIVATE_KEY` in .env or else script will try to interact with your locally stored wallet `~/.config/solana/id.json`

#### to initialize 

```bash
npx ts-node ./scripts/ping-pong.ts --type "initialize" --net solana-devnet --program_id [PROGRAM_ID] --args "[CHAIN_ID],[GATEWAY_PROGRAM]"
```
* For an example of a initialization, refer to this [transaction](https://explorer.solana.com/tx/4qJRWAoQFNGmXjouPgfYUahAUaEHftqRyqoWEdQUqsuMwvXkg1B4jqvnUnas2ypPHvowcXiNxfRVmBuA6ujiWmcC?cluster=devnet).

#### to set dapp metadata

```bash
npx ts-node ./scripts/ping-pong.ts --type "set_dapp_metadata" --net solana-devnet --program_id [PROGRAM_ID]  --args "[GATEWAY_PROGRAM],[FEE_PAYER]"
```

* For an example of a set dapp metadata, refer to this [transaction](https://explorer.solana.com/tx/36Hk4FyhmxSUCeiaNu2zcLoAMECemz5RwLtQaCB3QWFpVRojYs7LMBXrUuKASdzHBBy5KYPnPDw19zFBiXMKqpwF?cluster=devnet).

#### to approve fee payer on router chain

```bash
npx ts-node ./scripts/ping-pong.ts --type "approve_fee_payer" --net solana-devnet --program_id [PROGRAM_ID] --args "[PRIVATE_KEY],[RouterEnv]"
```
* For an example of a fee payer approval, refer to this [transaction](https://testnet.routerscan.io/tx/27AC238B7EAD82AA01B794E4DD3ED9AD22D8EB33784CAFC8DE98069C3FC84031).

#### to ping

```bash
npx ts-node ./scripts/ping-pong.ts --type "ping" --net solana-devnet --program_id [PROGRAM_ID] --args "[GATEWAY_PROGRAM],[DST_CHAIN_ID],[DST_PING_PONG_CONTRACT]"
```

* For an example of a ping to avalanche fuji, refer to this [transaction](https://explorer.solana.com/tx/3bnJwLeMZR5YJtEjdX6nownETRnmNUmKvyU4hfYS9pHBZG9v8PcqQymtLGhGUjfbMh9h6ciPmwVBigdYaYqaqbsc?cluster=devnet).


#### to get the destination contract address for Solana when calling from another chain

```bash
npx ts-node ./scripts/ping-pong.ts --type "get_dst_contract" --net solana-devnet --program_id [PROGRAM_ID]
```

* For an example, dst contract can be as `0x6279fbdaeec3e50d239ed3ddae459e183d4fe773bc33a9076beda840c2f8b62696802f96e43fa2dc6433c4cc504eb5de43836e0ef686493ca3a0eba2958b554dc9288c5f70612bc1f283dfa410a96af07f9201d2a8b1551abe175279d7b7cc986279fbdaeec3e50d239ed3ddae459e183d4fe773bc33a9076beda840c2f8b626`

:::note
- When pinging from another chain to Solana, the destination contract address must include the `ping_pong_program_id`, `ping_pong_account_id`, `event_authority`, and `program_id`. Otherwise, the transaction will not be processed.
:::
</details>
