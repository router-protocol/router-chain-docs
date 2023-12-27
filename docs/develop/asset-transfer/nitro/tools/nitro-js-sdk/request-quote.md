---
title: Request a Quote
sidebar_position: 2
---

To initiate a cross-chain transaction, you first need to obtain a quote from the Pathfinder API. The quote requires the following information:

* **sourceChainId**: The ID of the source blockchain.
* **sourceTokenAddress**: The address of the token on the source blockchain.
* **destinationChainId**: The ID of the destination blockchain.
* **destinationTokenAddress**: The address of the token on the destination blockchain.
* **expandedInputAmount**: The amount of the token you want to transfer, in its smallest unit (like wei for ETH).

Use the getQuote method of the Pathfinder instance to request a quote:
```jsx
const quote = await pathfinder.getQuote({
  sourceChainId,
  sourceTokenAddress,
  destinationChainId,
  destinationTokenAddress,
  expandedInputAmount,
});
```

The `getQuote` method returns an object containing:
* Fee details
* Estimated amount to be received
* Estimated time of completion
and more fields. 

Here's an example:
Getting a quote for transferring 10 USDT from Fuji to Mumbai:
```jsx
import { Pathfinder, Network } from "@nitro/asset-transfer-js-sdk";

// initialize a Pathfinder instance
const YOUR_WIDGET_ID = 0; // get your unique sdk id by contacting us on Telegram
const pathfinder = new Pathfinder(Network.Testnet, YOUR_WIDGET_ID);

const main = async () => {
  // getting a quote for 10 USDT from Fuji to Mumbai
  const quote = await pathfinder.getQuote({
    sourceChainId: "43113",
    sourceTokenAddress: "0xb452b513552aa0B57c4b1C9372eFEa78024e5936",
    destinationChainId: "80001",
    destinationTokenAddress: "0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054",
    expandedInputAmount: "10000000",
  });

  console.log(quote);
};

main();
```

:::info
Important Note: 
To play around with the API, you can use the Partner ID given in the example above. But for use in any product/protocol, you will be assigned a unique Partner ID. To get your Partner ID, please contact us on [Telegram](https://t.me/Add_ith).
:::