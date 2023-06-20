---
title: Fee Management
sidebar_position: 2
description: Gas and fee payer considerations for CrossTalk
---

## 1. Fee Payer
The fee associated with any cross-chain request initiated by a dApp is paid by the dApp's corresponding fee payer account on the Router chain. This fee payer account is set by the dApp for all the integrated chains and can be changed anytime. Any fee refunds are also credited to this account.

* To designate the fee payer for any chain, the application must invoke the `setDappMetadata` function on that chain's Gateway contract and provide a valid address on the Router chain.
* To prevent unauthorized usage of someone else's address as the fee payer, the designated fee payer address must perform a fee payer approval transaction on the Router chain.
* The fee payer address on the Gateway contract can be modified by the application at any time using the `setDappMetadata` function.

#### How to provide approval for the fee payer on the Router chain?
* The approval as a fee payer can be provided by accessing the [explorer](https://routerscan.io/feePayer).
* The user can search for the dApp address or the fee payer address on the explorer to view all the pending approvals.
* After connecting the fee payer wallet, you can approve all the pending fee payer requests.

## 2. Gas Considerations
* To ensure the proper execution of CrossTalk requests on the destination chain, users must specify both the `gasPrice` and `gasLimit` in their request metadata. This information is used to calculate the fees required for the transaction. **If the `gasPrice` is not specified, the gas price oracle on the Router chain will estimate it.**
* If an application intends to run its own relayer, it can set the `gasLimit` parameter to **0** in their CrossTalk request. However, in such a scenario, the application's relayer must estimate the `gasLimit` required for executing the transaction on the destination chain.

## 3. Deducting Fee

CrossTalk operates on a prepaid fee model where the Router chain calculates the estimated fee for executing a transaction on the destination chain in terms of ROUTE tokens upon receiving the CrossTalk request. To cover the relayer incentives and validation costs, the Router chain deducts the estimated fee and incentive amount upfront from the fee payer address.

#### Important Notes

1. The payment of fees and relayer incentives for any cross-chain request on the Router chain must be made exclusively in ROUTE tokens.
2. To thwart Sybil attacks on the Router chain, a minimal fee is charged by the Router's Gateway contract on the source chain. This fee covers the cost of orchestrator validation and is paid in the native token of the source chain by the application contract.

## 4. Handling Refunds

Upon receiving the ack from the Gateway contract on the destination chain, the Router chain performs two actions: (a) it pays the fee used along with the relayer incentive to the relayer from the already deducted fee, and (b) refunds the surplus fee back to the fee payer address. This mechanism ensures the following:
* The relayer receives its incentive without any delay.
* Applications can send extra gas limit for buffer, as they will receive automatic refunds in case of a surplus fee.
