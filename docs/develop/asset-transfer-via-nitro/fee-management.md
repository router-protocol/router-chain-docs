---
title: Fee Management
sidebar_position: 8
---

The total Nitro fee is composed of three parts:
1. Nitro Protocol Fee
2. Partner Fee
3. Forwarder Fee

Let us understand all three components of Nitro's overall fee in depth:

## Nitro Protocol Fee
This is the fee that is charged by Nitro to support the infra that facilitates the transfer of funds. This fee is used to cover the orchestrator and validator costs involved during the lifecycle of a transaction and shouldn't be more than $0.5. 

## Partner Fee
Any project that has integrated Nitro's API or Widget can impose an additional fee on top of the Nitro protocol fee. The entirety of this fee goes to the partner project. To set this fee, a partner has to set three variables:
1. `min_flat_fee`: Minimum fee that is to be charged from the end user, i.e. user will be required to pay this much amount even if the BPS-based fee is lower than this amount.
2. `bps_fee`: Basis Point fee against each transaction that is to be charged from the user. For example, if a project sets this as 10 BPS, then for each transaction that a user performs via the project's platform, 0.10% of the funds being transferred will be deducted from the destination amount as fee. 
3. `max_flat_fee`: Maximum fee that is to be charged from the end user, i.e. user will not be required to pay a fee above this amount even if the BPS-based fee is higher than this amount.

## Forwarder Fee
This is the fee that is to be paid as an incentive to the forwarder to settle a transaction on the destination chain. The higher the forwarder fee for a transaction, the more likely it is to be executed first. 

:::info
1. No definite fee will be imposed on the users, instead they will decide themselves how much they are willing to pay for a transaction. If the fee is too low, the transaction would not get picked up by any forwarder. 
2. First the Nitro protocol fee is deducted from the overall fee, then the partner fee (if any) is deducted, and the remaining fee goes to the forwarder. For example, if a user passes $1 as a fee for a $100 transfer where the Nitro protocol fee is $0.2 and the partner fee is 30 bps, then the fee calculation is as follows:
- $0.2 goes to the protocol
- 0.30% of $100 = $0.3 goes to the partner
- $1 - ($0.2 + $0.3) = $0.5 is earmarked for the forwarder
:::
