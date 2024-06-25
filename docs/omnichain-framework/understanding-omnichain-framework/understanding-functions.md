---
title: Understanding the Functions
sidebar_position: 2
---

As seen in the architecture, the omnichain framework flow is divided into 2 major parts -

1. Inbound Flow
2. Outbound Flow

For both the above flows, there are a certain set of functions which needs to be called/implemented for flow completion. The implementation can be broken into 2 parts -

1. **Functions on third-party chain's contract (i.e. source and destination contracts)** - the request gets initiated from the source contract and finally reaches the destination contract via Router's middleware contract. On third-party chain, contracts will need to -
   1. Call a function to create a cross-chain request on source chain ([iSend](../understanding-omnichain-framework/third-party-chain-contracts.md#isend-function))
   2. Implement a function to handle the cross-chain request on destination chain ([iReceive](../understanding-omnichain-framework/third-party-chain-contracts.md#ireceive-function))
2. **Functions on Router Chain's middleware contract** - the inbound request will invoke the Router Chain's middleware contract which will then create an outbound request for execution on the destination chain. Post the execution of the outbound request, the middleware contract also gets the acknowledgment back on the execution status from the destination chain. On Router Chain, middleware contracts will need to -
   1. Handle the inbound request from source chain ([HandleIReceive](../understanding-omnichain-framework/router-chain-middleware-contract/sudomsg))
   2. Create a outbound request for the destination chain ([CrosschainCall](../understanding-omnichain-framework/router-chain-middleware-contract/routermsg))
   3. Handle the outbound acknowledgment request from destination chain ([HandleIack](../understanding-omnichain-framework/router-chain-middleware-contract/sudomsg))
