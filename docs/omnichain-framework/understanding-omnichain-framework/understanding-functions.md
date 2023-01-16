---
title: Understanding the Functions
sidebar_position: 2
---

As seen in the architecture, the omnichain framework flow is divided into 2 major parts -
1. Inbound Flow
2. Outbound Flow

For both the above flows, there are a certain set of functions which needs to be called/implemented for flow completion. The implementation can be broken into 2 parts -
1. **Functions on third-party chain's contract (i.e. source and destination contracts)** - the request gets initiated from the source contract and finally reaches the destination contract via Router's middleware contract. On third-party chain, contracts will need to -
    1. Call a function to create a cross-chain request on source chain ([requestToRouter](../understanding-omnichain-framework/third-party-chain-contracts#requesttorouter-function))
    2. Implement a function to handle the cross-chain request on destination chain ([handleRequestFromRouter](../understanding-omnichain-framework/third-party-chain-contracts#handlerequestfromrouter-function))
2. **Functions on Router chain's middleware contract** - the inbound request will invoke the Router chain's middleware contract which will then create an outbound request for execution on the destination chain. Post the execution of the outbound request, the middleware contract also gets the acknowledgement back on the execution status from the destination chain. On Router chain, middleware contracts will need to -
    1. Handle the inbound request from source chain ([HandleInboundReq](../understanding-omnichain-framework/router-chain-middleware-contract/sudomsg))
    2. Create a outbound request for the destination chain ([OutboundBatchRequest](../understanding-omnichain-framework/router-chain-middleware-contract/routermsg))
    3. Handle the outbound acknowledgement request from destination chain ([HandleOutboundAck](../understanding-omnichain-framework/router-chain-middleware-contract/sudomsg))
