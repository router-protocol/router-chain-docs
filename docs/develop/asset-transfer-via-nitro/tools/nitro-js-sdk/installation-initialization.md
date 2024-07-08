---
title: Installation and Initialization
sidebar_position: 1
---

## Installation
Install Nitro's Asset Transfer SDK into your JavaScript development environment by running the following command in your terminal:

```jsx
npm install @routerprotocol/asset-transfer-sdk-ts
```

## Initialization

After installing the module, import and initialize it into your code:

```jsx
import { PathFinder, Network } from "@routerprotocol/asset-transfer-sdk-ts";
import { evmSignerFromPrivateKeyAndRpc } from '@routerprotocol/asset-transfer-sdk-ts';
const YOUR_WIDGET_ID = 24 // get your unique sdk id by contacting us on Telegram
const pathfinder = new PathFinder(Network.Testnet, YOUR_WIDGET_ID);

```

You can use Network.Testnet for mandara and Network.Mainnet for mainnet.

Example:

```jsx
import { PathFinder, Network } from "@routerprotocol/asset-transfer-sdk-ts";
import { evmSignerFromPrivateKeyAndRpc } from '@routerprotocol/asset-transfer-sdk-ts';
const YOUR_WIDGET_ID = 24 // get your unique sdk id by contacting us on Telegram
const pathfinder = new PathFinder(Network.Mainnet, YOUR_WIDGET_ID);
```