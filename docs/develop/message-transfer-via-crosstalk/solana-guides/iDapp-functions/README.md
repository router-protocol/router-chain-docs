# Solana iDapp Functions

Cross-chain message transmission on the Solana chain is enabled through the `i_send` function in Router's Gateway contract. When initiating a cross-chain request, developers can invoke this function, passing the required parameters along with the payload that needs to be transferred from the source chain to the destination chain.

To ensure successful cross-chain communication, Solana iDapp developers must also implement the following essential functions within their contracts:
1. `i_receive`: This function must be included on the destination chain to handle incoming cross-chain requests.
2. `i_ack`: Implement this function to process acknowledgment of requests on the source chain, particularly when cross-chain acknowledgment is required.
3. `set_dapp_metadata`: This function is necessary to designate a fee_payer for executing cross-chain requests. Without setting this, requests will remain in a blocked state on the Router Chain.
