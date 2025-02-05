---
title: Use Case for Developers
sidebar_position: 4
description: Use Case for Developers in Router Pay.
---

## CrossChain Settlements

### 1. CrossChain Token Bridging

- **Problem Solved:** Users want to transfer tokens or assets from one blockchain to another without relying on centralized exchanges.
- **How It Works:**
    - The system creates a `depositAddress` on the source chain.
    - When funds are deposited, the relayer ensures they are sent to the destination chain via the `RouterRelay` contract and `DepositReceiver` contract.
    - The dApp ensures tokens are received seamlessly on the destination chain.
- **Example:** Bridging stablecoins like USDC or ETH between Ethereum and Polygon.

### 2. Decentralized Crowdfunding

- **Problem Solved:** Projects on different chains need a secure and transparent way to collect funds.
- **How It Works:**
    - The system generates a unique `depositAddress` for each contributor.
    - Once the funds are transferred, the project can confirm receipt via the `processNewTransaction` mechanism.
- **Example:** A multi-chain fundraising campaign for a new DeFi project.

### 3. Cross-Chain Staking and Liquidity Provision

- **Problem Solved:** Users want to stake assets or provide liquidity in protocols that operate on different chains.
- **How It Works:**
    - Users send staking or liquidity tokens to the `depositAddress`.
    - The funds are routed to the target protocol on the destination chain via the `DepositReceiver`.
- **Example:** A staking pool on a Layer 2 network receiving tokens from Ethereum.

### 4. Seamless Multi-Chain dApp Transactions

- **Problem Solved:** dApps need to abstract the complexity of multi-chain transactions for end users.
- **How It Works:**
    - The `depositAddress` acts as a simple entry point for users to interact with the dApp, while backend and relayer mechanisms handle cross-chain operations.
- **Example:** A multi-chain wallet app enabling asset swaps across chains.

<!-- ## Intent Adapters -->


## AI Agents

### 1. Intelligent Portfolio Rebalancing Agent

AI agents can monitor market conditions and automatically rebalance portfolios across different chains. Using ISAs, the agent can generate single-use addresses for each rebalancing transaction.

Example flow:

- Agent detects market conditions meeting rebalancing criteria
- Generates ISA for specific swap instructions
- Executes cross-chain swaps without requiring user wallet interaction
- Provides transaction confirmation and portfolio updates to user

### 2. Smart Bill Payment Systems 

Create AI agents that manage recurring payments across different chains. The agent can:

- Track due dates and payment amounts
- Generate ISAs for each payment
- Select optimal token paths based on gas fees and exchange rates
- Execute payments automatically when conditions are met

Users only need to maintain sufficient balance in their source wallet.

### 3. AI-Powered Yield Farming Automation 

Create agents that optimize yield farming strategies:

- Monitor APY across protocols and chains
- Generate ISAs for entering/exiting positions
- Automatically compound rewards
- Move funds to highest yielding opportunities

Implement risk management parameters and gas cost optimization.

## DeFi Automation

### 1. POS Machines for Merchant Payments

Merchants want a simple and decentralized way to accept cryptocurrency payments at the point of sale. The system should ensure seamless transactions, settlement, and multi-chain compatibility without relying on centralized payment processors.

### 2. Multi-Chain Asset Escrow Service

- **Problem Solved:** Parties involved in multi-chain transactions require trustless escrow solutions to ensure funds are only released after specific conditions are met.
- **How It Works:**
    - A `depositAddress` is generated as an escrow.
    - The `DepositReceiver` contract ensures funds are handled securely and only released to the designated recipient upon meeting the criteria.
- **Example:** Cross-chain NFT marketplace using escrow to hold payment until NFTs are delivered.