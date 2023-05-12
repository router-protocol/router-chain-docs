# Near iDapp Functions

The transmission of a cross-chain message is facilitated via the `i_send` function in Router's Gateway contract on the NEAR chain. When initiating a cross-chain request on NEAR, developers can call this function and pass the required parameters along with the payload that needs to be transferred from the source to the destination chain.

If a user wants to transfer ROUTE tokens with or without some message to another chain, there is a function named `burn_and_call_gateway` in the ROUTE token contract on the NEAR chain. This function internally calls the Gateway contract after deducting the ROUTE tokens to be transferred to the destination chain.

However, to complete the cross-chain communication process, CrossTalk users on the NEAR chain must include two more functions in their contracts:
1. An `i_receive` function must be included in the destination chain contracts to handle incoming cross-chain requests.
2. To process the acknowledgment of their requests on the source chain, developers must implement an `i_ack` function in their source chain contracts.
