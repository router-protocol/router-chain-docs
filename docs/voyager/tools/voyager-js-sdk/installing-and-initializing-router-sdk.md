---
title: Installing and Initializing Router SDK
sidebar_position: 2
---

Install Router SDK into your JavaScript development environment by running the following command in your terminal:

`npm install @routerprotocol/router-js-sdk`

or if you prefer yarn, use:

`yarn add @routerprotocol/router-js-sdk`

After installing the module, import and initialize it into your code:
```jsx
import { RouterProtocol } from "@routerprotocol/router-js-sdk"

const routerprotocol = new RouterProtocol("SDK_ID_HERE", "SOURCE_CHAIN_ID", "PROVIDER_HERE")
await routerprotocol.initialize()
```

**Example**
```jsx
import { RouterProtocol } from "@routerprotocol/router-js-sdk"
import { ethers } from "ethers";

let SDK_ID = 24 // get your unique sdk id by contacting us on Telegram
let chainId = 137
const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com", chainId)
const routerprotocol = new RouterProtocol(SDK_ID, chainId, provider)
await routerprotocol.initialize()
```

:::note
To play around with the SDK, you can use the SDK ID given in the example above. But for use in any product/protocol, you will be assigned a unique SDK ID. To get your SDK ID, please contact us on [Telegram](https://t.me/Add_ith).
:::