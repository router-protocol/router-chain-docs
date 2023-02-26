---
title: Cross-chain Meta Transactions
sidebar_position: 5
---

With Router V2, we are coming up with a first-of-its-kind cross-chain meta-transaction capability. While sending an Inbound Request (or a CrossTalk Request), users/applications can configure a `feePayer` parameter, which specifies the address from which the fee is to be deducted on the Router chain. This parameter can be set to either one of the following: (a) the user address, (b) the application contract address, or (c) `NONE`. After a request is marked as validated by the Router chain, if the `feePayer` address is set to `NONE`, then any entity on the Router chain can function as the `feePayer` by sending a `PayFee` tx. By delegating the execution of a request to a third-party service, applications can enable feeless cross-chain transactions for their end users.