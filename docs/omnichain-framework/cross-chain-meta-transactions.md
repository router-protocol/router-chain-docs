---
title: Cross-chain Meta Transactions
sidebar_position: 5
---

With Router V2, we are coming up with a first-of-its-kind cross-chain meta-transaction capability. While sending an Inbound Request (or a CrossTalk Request), applications can configure a `feePayer` parameter using a function named `setDappMetadata`, which specifies the address from which the fee is to be deducted on the Router chain. This parameter can be set to either one of the following: (a) the user's own address where the fee would be deducted from user's wallet on router chain, or (b) other address where the fee would be deducted from other user's wallet on his approval.
