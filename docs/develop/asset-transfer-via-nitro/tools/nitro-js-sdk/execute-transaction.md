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
import { evmSignerFromPrivateKeyAndRpc } from '@routerprotocol/asset-transfer-sdk-ts';
const YOUR_WIDGET_ID = 24 // get your unique sdk id by contacting us on Telegram
const pathfinder = new PathFinder(Network.Testnet, '0');



const main = async() => {

    
const evmSigner = evmSignerFromPrivateKeyAndRpc(YOUR_PRIVATE_KEY, "https://rpc.ankr.com/avalanche_fuji");





const quote = await pathfinder.getQuote({
            sourceChainId: "43113",
            sourceTokenAddress: "0x69dc97bb33e9030533ca2006ab4cef67f4db4125",
            destinationChainId: "17000",
            destinationTokenAddress: "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f",
            expandedInputAmount: "4000000000000000",
        });


     
        console.log(quote)

      
         const transaction = await pathfinder.executeQuote({
            quote,
            slippageTolerance: "1",
            senderAddress: evmSigner.address,
            receiverAddress: "0x8CB29084A720E6D421812A259431042F03524FED",
        },
            {
                evmSigner
            }
        );

}

main()
```


### TRON
```jsx
import { PathFinder, Network } from "@routerprotocol/asset-transfer-sdk-ts";
import { evmSignerFromPrivateKeyAndRpc } from "@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/EvmChainClient";
import { getTronWeb } from "@routerprotocol/asset-transfer-sdk-ts/pathfinder/ChainClient/TronChainClient";

// initialize a Pathfinder instance
const YOUR_WIDGET_ID = 0; // get your unique sdk id - https://app.routernitro.com/partnerId
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
    destinationChainId: "43113",
    destinationTokenAddress: "0x69dc97bb33e9030533ca2006ab4cef67f4db4125",
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
const YOUR_WIDGET_ID = 0; // get your unique sdk id - https://app.routernitro.com/partnerId
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
    destinationChainId: "43113",
    destinationTokenAddress: "0x69dc97bb33e9030533ca2006ab4cef67f4db4125",
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