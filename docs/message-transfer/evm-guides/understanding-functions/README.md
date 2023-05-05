# EVM Chain CrossTalk Functions

The transmission of a cross-chain message is facilitated through the `iSend` function in Router's Gateway contracts. When initiating a cross-chain request, users can call this function and pass the required parameters along with the payload that needs to be transferred from the source to the destination chain.

However, to complete the cross-chain communication process, CrossTalk users must also implement two functions on their contracts:
1. An `iReceive` function must be included in the destination chain contracts to handle cross-chain requests.
2. To process the acknowledgment of their requests on the source chain, users must implement an `iAck` function in their source chain contracts.
3. The `setDappMetadata` function facilitates the assignment of the fee payer for a DApp.
