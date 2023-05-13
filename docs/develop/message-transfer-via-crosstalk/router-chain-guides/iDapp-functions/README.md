---
title: Router Chain iDapp Functions
sidebar_position: 4
---

import {
HomepageCard as Card,
HomepageSection as Section,
} from '../../../../../src/components/HomepageComponents';

import {
IDEIcon,
Tscodegen,
} from '../../../../../src/icons';

To support Router's cross-chain functionality on the Router chain, CosmWasm contracts need to have `router-wasm-bindings`.

### Adding `router-wasm-bindings` as a dependency

You can add the `router-wasm-bindings` crate to your project as shown in the following code snippet:

```bash
[dependencies]
# add the following line in the cargo.toml [dependencies] section
router-wasm-bindings = "0.2.4"
```

### Functions
Once you have added `router-wasm-bindings` to your project, you can start building your cross-chain contract by implementing the following functions:

- **`RouterMsg` -** A function to send requests to other chains. This function is akin to the `iSend` function for EVM chains.
- **`SudoMsg` -** A function to handle incoming requests from the other chains, be it a generic cross-chain request or an acknowledgment. This function encapsulates the functionality of both `iReceive` and `iAck` as present on EVM contracts. 

Contracts on the Router chain can also be used to enable stateful bridging between any two chains. Developers can write custom bridging logic on these contracts such that a request originating from any chain A gets processed on the Router chain contract before it is sent to the designated destination chain. More details about stateful bridging using Router have been provided [here](../../message-transfer-via-crosstalk/stateful-bridging/). 

<!-- While writing the custom bridging logic, the developer can convert single or multiple incoming requests into single or multiple outbound requests.
Also, while creating requests to other chains, the contract can be developed in such a way that multiple requests can be generated for different chains.
You can find examples of different scenarios in the [_cw-bridge-contracts_](https://github.com/router-protocol/cw-bridge-contracts.git) repository. -->

<!-- <Section>
  <Card
    title="SudoMsg"
    description="Enum type for handling the incoming requests on Router chain's contracts"
    to="/message-transfer/router-chain-guides/understanding-functions/sudomsg"
    icon={<IDEIcon />}
  />
    <Card
    title="RouterMsg"
    description="Enum type for creating outbound requests for destination chain contracts"
    to="/message-transfer/router-chain-guides/understanding-functions/routermsg"
    icon={<Tscodegen />}
  /> 
</Section> -->
