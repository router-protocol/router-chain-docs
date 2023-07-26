---
title: Cross-chain Sequenced Transfer
sidebar_position: 2
---

The flow is very similar to that of cross-chain asset transfers. The main difference here is that the user also passes an arbitrary instructions from the source chain which is executed just after the token transfer is executed on the destination chain. The Voyager Execute Handler is responsible for calling the target contract on the destination chain. The target contract on the destination chain must implement the <code>voyagerReceive</code>  function which is the entry point for the execution of the arbitrary instruction. An example to create send arbitrary instruction from a source chain and handling it on the destination chain is mentioned [here](../different-use-cases/sequenced-transfers).

### Edge Cases

#### 1. What if the token transfer is successful but the arbitrary instruction execution fails?
This would never happen as the transaction, by design, is atomic which means that either both will execute or none will execute. 

#### 2. What if my transaction fails on the destination chain due to some issues? What happens to my funds?
No need to worry. We provide a replay function on our bridge contract on the Router Chain which can be called by any user to replay a failed request. You can fix the issues and call this replay function to replay your transaction on the destination chain. Your funds are safe!
    
