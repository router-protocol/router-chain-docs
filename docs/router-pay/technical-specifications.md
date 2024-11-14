---
title: Technical Specifications
sidebar_position: 2
description: Technical Specifications for Router Pay
---

## Dynamic Address Generation

* **Contract**: RouterRelay
    * `addressForTokenDeposit`: Generates a dynamic, single-use deposit address for token deposits based on user-supplied data, which can also be displayed as a QR code for easy scanning.
    * `sendTokenDeposit`: Deploys a DepositReceiver contract to handle the asset forwarding and initiate cross-chain transfers.

## Asset Transfer and Forwarding

* **Contract**: ReceiverImplementation
* **Purpose**: Receives assets and forwards them as per user-specified data. Handles transaction failures with a refund mechanism.
* **Core Components**:
    * Data Structure: `GenericData`
        * callTo: Target address for forward operation (e.g., another contract).
        * approvalTo: Address for granting token approval if required.
        * data: Encoded transaction data for interaction.
        * srcToken: Address of the asset being transferred.
        * refundAddress: Address for refunds in case of transaction failure.
        * Native Asset Identifier: NATIVE_ASSETID to detect and handle native tokens (e.g., ETH).
    * Key Function: `receiveAndSendToken`
        * Verifies callTo and refundAddress are non-zero.
        * Identifies asset type (native/ERC20) and retrieves the balance.
        * Grants approval for ERC20 transfers if necessary and initiates a call to callTo with data.
        * If the transaction fails, refunds the balance to refundAddress.
        * Uses safeTransfer for ERC20 tokens, ensuring a secure refund process.

## Temporary Deposit Receiver Contract

* **Contract**: DepositReceiver
* **Purpose**: Acts as a transient address to hold the user’s tokens and call ReceiverImplementation using delegatecall.
* **Core Components**:
    * Constructor:
        * Executes delegatecall to ReceiverImplementation for asset handling.
        * If delegatecall fails, reverts with the original error and refunds assets to refundAddress.
        * Self-destructs after transaction completion to clear storage and prevent reuse.
        * Fallback Function: Receives native tokens (e.g., ETH), allowing flexibility for handling WETH and similar assets.

## Deterministic Address Calculation

* `_depositAddress` Function in RouterRelay.
* Uses CREATE2 for predictable address generation based on salt and genericData.
* Allows the creation of identical addresses across chains, simplifying cross-chain deposits.

