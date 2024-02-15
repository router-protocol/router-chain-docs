---
title: Migrating from Voyager to Nitro
sidebar_position: 5
---

Migrating from Voyager to Nitro is a straightforward task and won't require more than 10 minutes of effort. Follow the steps given below to migrate your existing codebase from Voyager to Nitro:

## API Migration

**Step 1)** To fetch the quote from the pathfinder API, change the `PATH_FINDER_API_URL` from "https://api.pathfinder.routerprotocol.com/api" to "https://api.pf.testnet.routerprotocol.com/api". Also, change the `endpoint` from "quote" to "v2/quote" and remove `userAddress` and `feeTokenAddres` from the params.

```javascript
// Voyager
const PATH_FINDER_API_URL = "https://api.pathfinder.routerprotocol.com/api"

const fetchPathfinderData = async (params) => {
    const endpoint = "quote"
    const pathUrl = `${PATH_FINDER_API_URL}/${endpoint}`
}

const params = {
        'fromTokenAddress': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
        'toTokenAddress': '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC on Fantom
        'amount': '10000000', // 10 USDC (USDC token contract on Polygon has 6 decimal places)
        'fromTokenChainId': 137, // Polygon
        'toTokenChainId': 250, // Fantom
        'userAddress': 'YOUR_WALLET_ADDRESS',
        'feeTokenAddress': '0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4', // ROUTE on Polygon
        'slippageTolerance': 2,
        'partnerId': 0, // get your unique partner id by contacting us on Telegram
    }


// Nitro 
const PATH_FINDER_API_URL = "https://api.pf.testnet.routerprotocol.com/api"
const getQuote = async (params) => {
    const endpoint = "v2/quote"
    const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`
}

const params = {
        'fromTokenAddress': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
        'toTokenAddress': '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC on Fantom
        'amount': '10000000', // 10 USDC (USDC token contract on Polygon has 6 decimal places)
        'fromTokenChainId': 137, // Polygon
        'toTokenChainId': 250, // Fantom
        'slippageTolerance': 2, // optional
        'partnerId': 0, // get your unique partner id by contacting us on Telegram
    }
```

**Step 2)** Add another function `getTransaction()` to fetch the transaction data using the quote returned by the pathfinder quote endpoint. Here, you need to add the `senderAddress`, `receiverAddress`, and the `refundAddress`.

```javascript
import { ethers } from 'ethers'

const PATH_FINDER_API_URL = "https://api.pf.testnet.routerprotocol.com/api"

const getTransaction = async (params, quoteData) => {
    const endpoint = "v2/transaction"
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`

    console.log(txDataUrl)

    try {
        const res = await axios.post(txDataUrl, {
            ...quoteData,
            senderAddress: "<sender-address>",
            receiverAddress: "<receiver-address>",
            refundAddress: "<refund-address>" // optional, by default senderAddress will be treated as the refundAddress
        })
        return res.data;
    } catch (e) {
        console.error(`Fetching tx data from pathfinder: ${e}`)
    }    
}
    
const main = async () => {
    
    const params = {
        'fromTokenAddress': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
        'toTokenAddress': '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC on Fantom
        'amount': '10000000', // 10 USDC (USDC token contract on Polygon has 6 decimal places)
        'fromTokenChainId': 137, // Polygon
        'toTokenChainId': 250, // Fantom
        'partnerId': 24, // get your unique partner id by contacting us on Telegram
    }

    const quoteData = await getQuote(params);

    // get transaction data via the Transaction endpoint
    const txResponse = await getTransaction(quoteData); 

    // sending the transaction using the data given by the pathfinder
    const tx = await wallet.sendTransaction(txResponse.txn)
}

main()
```

:::info
In Voyager, the pathfinder API used to return the transaction data along with the quote. However, in Nitro, the data is prepared via a separate endpoint. 
:::

## Widget Migration

Just change the `baseURL` from "https://app.thevoyager.io/swap" to "https://nitro.routerprotocol.com/swap" and you're good to go.


## SDK Migration

1. Initialization

Earlier -
```
import { RouterProtocol } from "@routerprotocol/router-js-sdk"

const routerprotocol = new RouterProtocol("YOUR_WIDGET_ID", "SOURCE_CHAIN_ID", "PROVIDER_HERE")
await routerprotocol.initialize()
```

Change to -
```
import { Pathfinder, Env } from "@nitro/asset-transfer-js-sdk";
const pathfinder = new Pathfinder(Env.Testnet, YOUR_WIDGET_ID);
```

Install new sdk with npm or yarn 
`npm install @nitro/asset-transfer-js-sdk`


2. Quote & Transaction

Earlier -
```
const quote = await routerprotocol.getQuote(...params)
```

Change to -
```
const quote = await pathfinder.getQuote({
            sourceChainId,
            sourceTokenAddress,
            destinationChainId,
            destinationTokenAddress,
            expandedInputAmount,
        });

// execute quote handles approval as well
const transaction = await pathfinder.executeQuote({
    quote,
    slippageTolerance: "1",
    senderAddress: evmSigner.address,
    receiverAddress: evmSigner.address,
},
    {
        evmSigner
    }
);
```


3. Status

Earlier -
```
const status = await routerprotocol.getTransactionStatus(SRC_TXN_HASH)
```

Change to -
```
const status = await pathfinder.getTransactionStatus(SRC_TXN_HASH);
```