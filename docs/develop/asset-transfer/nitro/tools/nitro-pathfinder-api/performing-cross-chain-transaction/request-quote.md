---
title: Request a Quote
sidebar_position: 1
---

If all the required parameters are valid, the Pathfinder API will always return a path.
For transferring native assets, just use the native token addresses given [here](../../../supported-chains-tokens). However, you need to provide allowance for the wrapped version of the native asset to perform their transfers/swaps.

:::info
You can find the API information [**here**](../../../../../../api/?v=PATHFINDER).
:::

```jsx
import axios from "axios"

const PATH_FINDER_API_URL = "https://api.pf.testnet.routerprotocol.com/api"

// calling the pathfinder api using axios
const getQuote = async (params) => {
    const endpoint = "v2/quote"
    const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`

    console.log(quoteUrl)

    try {
        const res = await axios.get(quoteUrl, { params })
        return res.data;
    } catch (e) {
        console.error(`Fetching quote data from pathfinder: ${e}`)
    }    
}

const main = async () => {
    const params = {
        'fromTokenAddress': '0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054',
        'toTokenAddress': '0xb452b513552aa0B57c4b1C9372eFEa78024e5936',
        'amount': '10000000000000000000', // source amount
        'fromTokenChainId': "80001", // Mumbai
        'toTokenChainId': "43113", // Fuji
        'partnerId': 0, // (Optional) - For any partnership, get your unique partner id by contacting us on Telegram or emailing us at contact@routerprotocol.com
    }
    
    const quoteData = await getQuote(params);

    console.log(quoteData)
}


main()
```

:::note
In case you want source / destination token to be native token, then the following value should be used for token address - 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
:::

:::info
Important Note: 
To play around with the API, you can use the Partner ID given in the example above. But for use in any product/protocol, you will be assigned a unique Partner ID. To get your Partner ID, please contact us on [Telegram](https://t.me/Add_ith).
:::