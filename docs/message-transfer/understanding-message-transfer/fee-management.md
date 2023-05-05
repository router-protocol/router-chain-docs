---
title: Fee Management
sidebar_position: 3
---

## Gas and Fee Payer Considerations for Crosstalk Flow

## Fee Payer
For cross-chain transactions, the fee is paid on the Router chain from the address of the fee payer, which is designated by the dApp for all integrated chains. This address is responsible for paying the fees associated with cross-chain requests initiated by the dApp, and any fee refunds will also be credited to this account.

* To designate the fee payer on the Gateway address, the application must invoke the `setDappMetadata` function, providing a valid address on the Router Chain.
* To prevent unauthorized usage of someone else's address as the fee payer, the designated fee payer address must perform a fee payer approval transaction on the Router Chain.
* The fee payer address on the Gateway contract can be modified by the application at any time using the `setDappMetadata` function.

### How to provide approval for fee payer
* The approval as a fee payer can be provided by accessing the explorer (More > Fee Payer).
* The user can search for the dApp address or the fee payer address in explorer to view all the pending approvals.
* After connecting the wallet, the user can approve all pending requests.

## Gas Considerations
* To ensure proper execution of the CrossTalk request on the destination chain, users must specify both the `gasPrice` and `gasLimit` in their request metadata. This information, along with the fee payer address, is used to calculate the fees required for the transaction. 
**Note -** If the `gasPrice` is not specified, the gas price oracle module on the Router chain will estimate it.
* If an application intends to run its own relayer, it can set the `gasLimit` parameter to 0 in the CrossTalk request. However, in such a scenario, the application's relayer must estimate the `gasLimit` required for executing the transaction on the destination chain.

## Deducting Fee

CrossTalk operates on a prepaid fee model where the Router chain calculates the estimated fee for executing a transaction on the destination chain in terms of ROUTE tokens upon receiving the CrossTalk Request. To cover relayer incentives and validation costs, the Router chain deducts the estimated fee and incentive amount upfront from the fee payer address.

**Important Notes**

1. The payment of fees and relayer incentives for any cross-chain request on the Router chain must be made exclusively in $ROUTE tokens.
2. To thwart Sybil attacks on the Router chain, a minimal fee is charged by the Router's Gateway contract on the source chain. This fee covers the cost of orchestrator validation and is paid in the native token of the source chain by the application contract.

## Handling Refunds

Upon receiving the CrossTalkAck from the Gateway contract on the destination chain, the Router chain performs two actions: (a) paying the relayer's address the incentive and fee that were used from the already deducted fee, and (b) refunding the extra fee deducted to the fee payer address. This mechanism ensures the following:
* The relayer receives its incentive without delay.
* Applications have the option to send extra gas limit as a buffer, as they will receive automatic refunds in case of a surplus fee.
