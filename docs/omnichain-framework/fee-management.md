---
title: Fee Management
sidebar_position: 4
---

## Gas and Fee Payer Considerations

- The gas price for the execution of inbound transactions on the Router Chain is decided via governance and included directly in the chain configuration.
- In the case of OmniChain framework, the `gasLimit`, `gasPrice` and `feePayer` addresses specified by the user on the source chain in the `requestMetadata` are used for executing the inbound request on Router's bridge contract.
- Since we are using the ECDSA, an EVM-based address can easily be converted to a Router Chain address and vice versa, which means that the sender address will have a corresponding address on the Router Chain. Therefore, the `senderAddress` can also be set as the `feePayer` address.
- While exercising the option to run their own relayer, applications might want to leave the task of gas limit estimation to the relayers. In such a scenario, they can pass the `gasLimit` as $0$ in `requestMetadata`.
- For an outbound request coming via the OmniChain framework, relayers are required to estimate the gas price for executing the transaction on the destination chain.

## OmniChain Framework Fee Model

As discussed in the previous sections, the OmniChain flow on the Router Chain is divided into two parts - inbound and outbound, each of which has a fee associated with it.

### Inbound Request Fee Structure

To execute an inbound request on the Router Chain, users are required to configure a `gasLimit` and `gasPrice` parameter in their cross-chain request. This `gasLimit` is multiplied by the `gasPrice` present to calculate the amount of ROUTE tokens to be deducted from the user-specified `feePayer` address. This fee is used to cover the cost of transaction execution (bridge contract call) on the Router Chain. Note that if your `feePayer` does not have sufficient ROUTE balance, the transaction will not be executed. You will have to top up the `feePayer` address to ensure the execution of your request. Note that, we have a function named `setDappMetadata` that can be used to change the `feePayer` address from the source chain.

### Outbound Request Fee Structure

The bridge contract must pass reasonable `gasPrice` and `gasLimit` parameters to cover the cost of executing the outbound leg of the cross-chain request on the destination chain. Once the outbound module receives the outbound request, it queries the oracle module for the latest price of the ROUTE token and the native gas token of the specified destination chain. It uses the gas price fetched using the gas price oracle, and the token prices fetched using the token price oracle to convert the gas cost involved in the execution of the outbound request from the destination chain native token to the ROUTE token.
