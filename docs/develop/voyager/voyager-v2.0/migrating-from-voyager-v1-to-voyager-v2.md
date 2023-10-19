---
title: Migrating from Voyager v1.0 to Voyager v2.0
sidebar_position: 5
---

Migrating from Voyager v1.0 to Voyager v2.0 is a straightforward task and won't require more than 10 minutes of effort. Follow the steps given below to migrate your existing codebase from Voyager v1.0 to Voyager v2.0:

**Step 1)** To fetch the quote from the pathfinder API, change the `PATH_FINDER_API_URL` from "https://api.pathfinder.routerprotocol.com/api" to "https://api.pf.testnet.routerprotocol.com/api". Also, change the `endpoint` from "quote" to "v2/quote" and remove `slippageTolerance`, `userAddress`, and `feeTokenAddres` from the params.

```javascript
// v1.0
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
        'widgetId': 24, // get your unique wdiget id by contacting us on Telegram
    }


// v2.0 
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
        'widgetId': 24, // get your unique wdiget id by contacting us on Telegram
    }
```

**Step 2)** Add another function `getTransaction()` to fetch the transaction data using the quote returned by the pathfinder quote endpoint. Here, you need to add the `senderAddress` and the `receiverAddress` as well.

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
            fromTokenAddress: params.fromTokenAddress,
            toTokenAddress: params.toTokenAddress,
            slippageTolerance: 0.5,
            senderAddress: "<sender-address>",
            receiverAddress: "<receiver-address>",
            widgetId: params.widgetId
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
        'widgetId': 24, // get your unique wdiget id by contacting us on Telegram
    }

    const quoteData = await getQuote(params);

    // get transaction data via the Transaction endpoint
    const txResponse = await getTransaction(params, quoteData); 

    // sending the transaction using the data given by the pathfinder
    const tx = await wallet.sendTransaction(txResponse.txn.execution)
}

main()
```

:::info
In Voyager v1.0, the pathfinder API used to return the transaction data along with the quote. However, in Voyager v2.0, the data is prepared via a separate endpoint. 
:::