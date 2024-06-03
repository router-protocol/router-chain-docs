---
title: Check the Transaction Status 
sidebar_position: 4
---

To get transaction status you need to pass the source transaction hash to the following function.

```jsx
const status = await pathfinder.getTransactionStatus(SRC_TXN_HASH);
```

Example has been provided below.
```jsx
import { PathFinder, Network } from "@routerprotocol/asset-transfer-sdk-ts";
import { evmSignerFromPrivateKeyAndRpc } from "@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/EvmChainClient";

// initialize a Pathfinder instance
const YOUR_WIDGET_ID = 24; // get your unique sdk id - https://app.routernitro.com/partnerId
const pathfinder = new Pathfinder(Network.Testnet, YOUR_WIDGET_ID);

const main = async () => {
  // building evmsigner
  const evmSigner = evmSignerFromPrivateKeyAndRpc(
    evmPrivateKey,
    "https://rpc.ankr.com/avalanche_fuji",
  );

  // getting a quote for 10 USDT from Fuji to Mumbai
  const quote = await pathfinder.getQuote({
    sourceChainId: "43113",
    sourceTokenAddress: "0xb452b513552aa0B57c4b1C9372eFEa78024e5936",
    destinationChainId: "80001",
    destinationTokenAddress: "0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054",
    expandedInputAmount: "10000000",
  });

  // execute quote handles approval as well
  const transaction = await pathfinder.executeQuote(
    {
      quote,
      slippageTolerance: "1",
      senderAddress: evmSigner.address,
      receiverAddress: evmSigner.address,
    },
    {
      evmSigner,
    },
  );

  const status = await pathfinder.getTransactionStatus(transaction);
};

main();
```