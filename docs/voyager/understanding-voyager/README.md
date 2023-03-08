# Understanding Voyager

## Architecture
The Voyager consists of smart contracts which are deployed on all the blockchains that it supports and a middleware contract sitting on the Router Chain which forms the abstraction layer for many complexities of the cross-chain communication.

The smart contracts include the Voyager Deposit Handler, the Voyager Execute Handler, the Voyager Utils contract etc. The Voyager Deposit Handler is responsible for handling the deposits from users on the source chain while the Voyager Execute Handler is responsible for execution of the transaction on the destination chain.

### Flow of cross-chain token transfers:

When a user calls a function to transfer funds to another chain, the Voyager Deposit Handler contract will process the transaction, deduct the funds from user’s wallet and create a cross-chain communication request to the Router Chain endpoint. After receiving data from the source chain, our bridge contract on the Router Chain will process the request, make some necessary checks and deduct the fees required for the transaction to be processed. Once this is complete, it will fire a transaction to the destination chain to complete the cross-chain transfer request.

#### Edge Cases

1. **What if liquidity is not available for a token on the destination chain?**
    
    The user will get the Wrapped tokens for those tokens on the destination chain which can be redeemed as soon as the liquidity is available on the chain.
    
2. **What if I end up getting lesser amount of tokens on the destination chain than the minimum amount promised to me?**
    
    This would never happen. The amount of destination tokens received depends on the DEX output while swapping the tokens. Maybe the output changed between the time that elapsed between when the amount was shown to you and the actual execution. In this case, the swap may result in lesser output for the user, but at Voyager, we have a policy of no loss to the user. So we provide you stable tokens equivalent to the minimum amount displayed to you instead of the token which was the output of the DEX so that you do not suffer any loss.
    

### Flow of cross-chain token transfers along with arbitrary instructions:

The flow is almost the same as that of token transfers. The main difference here is that the user also passes an arbitrary instructions from the source chain which is executed just after the token transfer is executed on the destination chain. The Voyager Execute Handler is responsible for calling the target contract on the destination chain. The target contract on the destination chain must implement the <code>voyagerReceive</code>  function which is the entry point for the execution of the arbitrary instruction. An example to create send arbitrary instruction from a source chain and handling it on the destination chain is mentioned [here](../building-different-use-cases/sequenced-transfers).

#### Edge Cases

1. **What if the token transfer is successful but the arbitrary instruction execution fails?**
    
    This would never happen as the transaction, by design, is atomic which means that either both will execute or none will execute. 
    
2. **What if my transaction fails on the destination chain due to some issues? What happens to my funds?**
    
    No need to worry. We provide a replay function on our bridge contract on the Router Chain which can be called by any user to replay a failed request. You can fix the issues and call this replay function to replay your transaction on the destination chain. Your funds are safe!
    

### Fee Mechanism

The fee is calculated on the bridge contract on the Router Chain based on the source chain, destination chain, the transaction volume and some other parameters. The fee consists of a flat fee and an additional bips based fee based on the transaction volume. 

The fee is deducted directly from the tokens transferred to the Voyager Deposit Handler on the source chain and the remaining amount of tokens are transferred to the recipient on the destination chain.

If the fee required for transaction is greater than the amount being transferred and the cost of reverting it is lesser than the amount transferred, the transaction will be reverted back on the source chain by a request from the bridge contract on the Router Chain.
