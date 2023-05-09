---
title: Glossary
sidebar_position: 4
---

Use this glossary to learn about terms used in Router and the Cosmos ecosystem. A sincere acknowledgment to the Osmosis team as many of these definitions have been directly sourced from their documentation.

## Acknowledgment

## Active set

A predefined number of top validators that participate in consensus and receive rewards. We'll start with 30 validators in the active set and scale up later. 

## Atomicity
If an operation is atomic, it will either be seen as yet to be started or as completed and not in any partially completed state. In other words, either all the sub-operations in that operation will be successful, or none of them will be successful.
<!-- ## Air drops

A transfer of free cryptocurrency from a crypto project into users’ wallets in order to increase interest and incentivize the use of a new token. -->

## Batching

## Blockchain

An unchangeable ledger of transactions copied among a network of independent computer systems.

## Blocks

Groups of information stored on a blockchain. Each block contains transactions that are grouped, verified, and signed by validators.

## Block headers
The part of the block which includes all the metadata, including block height, block hash, the Merkle root of all the transactions included in the block, and the timestamp at which the block was mined, amongst other things. They act as a summary of the block.

## Bonded validator

A validator in the [active set](../overview/glossary#active-set) participating in consensus. Bonded validators earn rewards.

## Bonding

When a user delegates ROUTE to a validator to receive staking rewards and in turn obtain voting power. Validators never have ownership of a delegator's ROUTE. Delegating, bonding, and staking generally refer to the same process.

## Burn

The permanent destruction of coins from the total supply.

## Byzantine Fault Tolerance

## Commission

The percentage of staking rewards a validator will keep before distributing the rest of the rewards to delegators. Commission is a validator’s income. Validators set their own commission rates.

## Composability
The ability to use existing components and resources as building blocks for new applications.

<!-- ## Community pool

A special fund designated for funding community projects. Any community member can create a governance proposal to spend the tokens in the community pool. If the proposal passes, the funds are spent as specified in the proposal. -->

## Consensus

A system used by validators or miners to agree that each block of transactions in a blockchain is correct. The Router blockchain uses Tendermint consensus engine. Validators earn rewards for participating in consensus. Visit the [Tendermint official documentation site](https://docs.tendermint.com/) for more information.

## Cosmos-SDK

The open-source framework on which the Router blockchain is built. For more information, check out the [Cosmos SDK Documentation](https://docs.cosmos.network/).

## CrossTalk

## dApp

An application built on a decentralized platform (short for decentralized application).

<!-- ## DDoS

Distributed Denial of Service attack. When an attacker floods a network with traffic or requests in order to disrupt service. -->

## DeFi

Decentralized finance. A movement away from traditional finance and toward systems that do not require financial intermediaries.

## Delegate

When a user bonds ROUTE to a validator to receive staking rewards and in turn obtain voting power. Validators never have ownership of the bonded ROUTE. Delegating, bonding, and staking generally refer to the same process.

## Delegator

A user who delegates, bonds, or stakes ROUTE to a validator to earn rewards.

## Ethermint
<!-- ## Fees

- **Gas**: Computed fees added on to all transactions to avoid spamming. Validators set minimum gas prices and reject transactions that have implied gas prices below this threshold. -->

## Fee payer

## Full node

A computer connected to the Router mainnet able to validate transactions and interact with the Router blockchain. All active validators run full nodes.

## Gateway contract

## Governance

Governance is the democratic process that allows users and validators to make changes to the Router chain. Community members submit, vote, and implement proposals.

## Governance proposal

A written submission for a change or addition to the Router chain. Topics of proposals can vary from community pool spending, software changes, parameter changes, or any idea pertaining to Router Protocol.

## IBC

IBC is a communication standard that allows applications built on any Cosmos-based chains to interact with each other. Since the Router chain is built using the Cosmos SDK, any application built on it can use IBC to interact directly with applications on other Cosmos blockchains like Injective, Osmosis, and others. This interaction can be a token transfer or an instruction transfer.

<!-- The inter-blockchain communication protocol (IBC) creates communication between independent Cosmos-based blockchains. IBC achieves this by specifying a set of structures that can be implemented by any distributed ledger that satisfies a small number of requirements. Router utilizes IBC for communication (message transfers and token transfers) between Cosmos-based chains.  -->

## iDapp

## Inactive set

Validators that are not in the [active set](../overview/glossary#active-set). These validators do not participate in consensus and do not earn rewards.

## Interoperability
The ability of a system to connect and work with other systems in a coordinated
fashion while imposing no limits on the end user. In the context of blockchain, interoperability refers to the ability of disparate blockchain systems to interact with each other.

## Jailed

Validators who misbehave are jailed or excluded from the validator set for a certain amount of time.

## Merkle Root
The hash of all the hashes of all the transactions included in a block. It is part of the block header.

<!-- ## Multisig
A special type of digital signature that requires two or more users to sign. -->

## Nonce
A pseudo-random number that can only be used once. It is used by blockchains primarily as a counter.

## Oracles
Data feeds that bring information from external sources and provide it to smart contracts on chain. Decentralized oracles play a significant role in any blockchain system since blockchains cannot access off-chain information on their own.

## Orchestrator

## Proof of Stake

Proof of Stake. A style of blockchain where validators are chosen to propose blocks according to the number of coins they hold.

## Relayer

## Rewards

Revenue generated from fees given to validators and delegators.

## Self-delegation

The amount of Route a validator bonds to themselves. Also referred to as self-bond.

## Slashing

Punishment for validators that misbehave. 

## Stake

The amount of Route bonded to a validator.

## Staking

When a user or delegator delegates and bonds Route to an active validator in order to receive rewards. Bonded Route adds to a validator's stake. Validators provide their stakes as collateral to participate in the consensus process. 

## Stateful
In the context of decentralized systems, a stateful entity is one that can maintain past data. Smart contracts are considered stateful because they can store data in the form of variables.

## Stateless
In the context of decentralized systems, a stateless entity is one that does not maintain past data.

## Tendermint consensus

The consensus procedure used by the Router chain. First, a validator proposes a new block. Other validators vote on the block in two rounds. If a block receives a two-thirds majority or greater of yes votes in both rounds, it gets added to the blockchain. Validators get rewarded with the block's transaction fees. Proposers get rewarded extra. Each validator is chosen to propose based on their weight. Checkout the [Tendermint official documentation](https://docs.tendermint.com/) for more information.

## routerd

A command line interface for connecting to a Router node.

## Router testnet

A version of the Router mainnet just for testing. The testnet does not use real coins. You can use the testnet to get familiar with the Router ecosystem.

## Total stake

The total amount of Route bonded to a delegator, including self-bonded Route.

## Unbonded validator

A validator that is not in the active set and does not participate in consensus or receive rewards. Some unbonded validators may be jailed.

## Unbonding validator

A validator transitioning from the active set to the inactive set. An unbonding validator does not participate in consensus or earn rewards. The unbonding process takes 14 days.

## Unbonding

When a delegator decides to undelegate their Route from a validator. This process takes 14 days. No rewards accrue during this period. This action cannot be stopped once executed.

## Undelegate

When a delegator no longer wishes to have their Osmo bonded to a validator. This process takes 14 days. No rewards accrue during this period. This action cannot be stopped once executed.

## Uptime

The amount of time a validator has been active in a given timeframe. Validators with low up time may be slashed.

## Validator

A Router blockchain miner responsible for verifying transactions on the blockchain. Validators run programs called full nodes that allow them to participate in consensus, verify blocks, participate in governance, and receive rewards. The top 50 validators with the highest total stake can participate in consensus.

## Voyager

## Weight

The measure of a validator's total stake. Validators with higher weights get selected more often to propose blocks. A validator's weight is also a measure of their voting power in governance.
