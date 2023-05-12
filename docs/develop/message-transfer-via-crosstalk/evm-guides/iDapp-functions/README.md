# EVM iDapp Functions

The transmission of a cross-chain message is facilitated via the `iSend` function in Router's Gateway contracts. When initiating a cross-chain request, developers can call this function and pass the required parameters along with the payload that needs to be transferred from the source to the destination chain.

However, to complete the cross-chain communication process, CrossTalk users must include three more functions in their contracts:
1. An `iReceive` function must be included in the destination chain contracts to handle incoming cross-chain requests.
2. To process the acknowledgment of their requests on the source chain, developers must implement an `iAck` function in their source chain contracts.
3. The `setDappMetadata` function must be included in both the source and the destination contract to set the dApp's fee payer.
