---
title: Request a Quote
sidebar_position: 1
---

If all the required parameters are valid, the Pathfinder API will always return a path.
For transferring native assets, just use the native token addresses given [here](../../configurations/native-assets). However, you need to provide allowance for the wrapped version of the native asset to perform their transfers/swaps.

:::info
You can find the API information [**here**](../../../../api/?v=PATHFINDER).
:::

```jsx
import axios from "axios"

const PATH_FINDER_API_URL = "https://api.pathfinder.routerprotocol.com/api"

// calling the pathfinder api using axios
const fetchPathfinderData = async (params) => {
    const endpoint = "quote"
    const pathUrl = `${PATH_FINDER_API_URL}/${endpoint}`
    console.log(pathUrl)
    try {
        const res = await axios.get(pathUrl, { params })
        return res.data
    } catch (e) {
        console.error(`Fetching data from pathfinder: ${e}`)
    }
}

const main = async () => {
    const args = {
        'fromTokenAddress': '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', // USDC on Polygon
        'toTokenAddress': '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', // USDC on Fantom
        'amount': '10000000', // 10 USDC (USDC token contract on Polygon has 6 decimal places)
        'fromTokenChainId': 137, // Polygon
        'toTokenChainId': 250, // Fantom
        'userAddress': 'YOUR_WALLET_ADDRESS',
        'slippageTolerance': 2, // slippage tolerance percentage
        'widgetId': 24, // get your unique wdiget id by contacting us on Telegram
    }
    
    const pathfinder_response = await fetchPathfinderData(args)
    console.log(pathfinder_response)
}


main()
```

:::info
Important Note: 
To play around with the API, you can use the Widget ID given in the example above. But for use in any product/protocol, you will be assigned a unique Widget ID. To get your Widget ID, please contact us on [Telegram](https://t.me/Add_ith).
:::