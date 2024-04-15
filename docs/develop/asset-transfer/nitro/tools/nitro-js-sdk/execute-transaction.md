---
title: Execute the Transaction
sidebar_position: 3
---

For executing the quote you need to have EvmSigner for evm chains, NearAccount for near and tronweb for Tron. You can create them using private keys rpc using the following functions or you can pass your own.

```jsx
  import { evmSignerFromPrivateKeyAndRpc } from '@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/EvmChainClient';
        import { getTronWeb } from '@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/TronChainClient';
        import { nearSignerFromPrivateKey } from '@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/NearChainClient';

        const evmSigner = evmSignerFromPrivateKeyAndRpc(evmPrivateKey, EVM_RPC);
        const tronSigner = getTronWeb(tronPrivateKey, TRON_RPC);
        const nearSigner = await nearSignerFromPrivateKey(nearAccountId, nearPrivateKey, nearAccount);
```
Below is how you can execute a transaction for various chain types.

### Standard EVM Chains
```jsx
import { PathFinder, Network } from "@routerprotocol/asset-transfer-sdk-ts";
import { evmSignerFromPrivateKeyAndRpc } from "@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/EvmChainClient";

// initialize a Pathfinder instance
const YOUR_WIDGET_ID = 0; // get your unique sdk id by contacting us on Telegram
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
    slippageTolerance: "1"
  });

  // execute quote handles approval as well
  const transaction = await pathfinder.executeQuote(
    {
      quote,
      senderAddress: evmSigner.address,
      receiverAddress: evmSigner.address,
      refundAddress: evmSigner.address // (optional) By default equal to `senderAddress` if not provided
    },
    {
      evmSigner,
    },
  );
};

main();
```


### TRON
```jsx
import { PathFinder, Network } from "@routerprotocol/asset-transfer-sdk-ts";
import { evmSignerFromPrivateKeyAndRpc } from "@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/EvmChainClient";
import { getTronWeb } from "@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/TronChainClient";

// initialize a Pathfinder instance
const YOUR_WIDGET_ID = 0; // get your unique sdk id by contacting us on Telegram
const pathfinder = new Pathfinder(Network.Testnet, YOUR_WIDGET_ID);
const TRON_RPC = "https://api.shasta.trongrid.io";
const main = async () => {
  // building evmsigner
  const evmSigner = evmSignerFromPrivateKeyAndRpc(evmPrivateKey, TRON_RPC);
  // building tron signer
  const tronSigner = getTronWeb(tronPrivateKey, TRON_RPC);

  // getting a quote for 10 USDT from Tron to Mumbai
  const quote = await pathfinder.getQuote({
    sourceChainId: "2494104990", // tron chainId
    sourceTokenAddress: "0xF2340B8D37A198B2D66795C8B5B7C467CF92C4EC", // tron token address
    destinationChainId: "80001",
    destinationTokenAddress: "0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054",
    expandedInputAmount: "1000000",
  });
  const transaction = await pathfinder.executeQuote(
    {
      quote,
      senderAddress: evmSigner.address, // tron address
      receiverAddress: evmSigner.address,
      refundAddress: evmSigner.address // (optional) By default equal to `senderAddress` if not provided
    },
    {
      evmSigner,
      tronweb: tronSigner,
    },
  );
};
main();

```

### NEAR
```jsx
import { PathFinder, Network } from "@routerprotocol/asset-transfer-sdk-ts";
import { nearSignerFromPrivateKey } from "@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/NearChainClient";

// initialize a Pathfinder instance
const YOUR_WIDGET_ID = 0; // get your unique sdk id by contacting us on Telegram
const pathfinder = new Pathfinder(Network.Testnet, YOUR_WIDGET_ID);

const main = async () => {
  // building near account
  const nearRpc = "https://rpc.testnet.near.org";
  const nearSigner = await nearSignerFromPrivateKey(
    nearAccountId,
    nearPrivateKey,
    "testnet",
    nearRpc,
  );

  // getting a quote for 10 USDT from Fuji to Mumbai
  const quote = await pathfinder.getQuote({
    sourceChainId: "near-testnet", 
    sourceTokenAddress: "usdt_router.router_protocol.testnet", // near usdt address
    destinationChainId: "80001",
    destinationTokenAddress: "0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054",
    expandedInputAmount: "1000000000000000000",
    slippageTolerance: "1",
  });
  const transaction = await pathfinder.executeQuote(
    {
      quote,
      senderAddress: "joydeeeep.testnet",
      receiverAddress: "0x40d5250D1ce81fdD1F0E0FB4F471E57AA0c1FaD3",
      refundAddress: "joydeeeep.testnet" // (optional) By default equal to `senderAddress` if not provided
    },
    {
      nearAccount: nearSigner,
    },
  );
};

main();
```