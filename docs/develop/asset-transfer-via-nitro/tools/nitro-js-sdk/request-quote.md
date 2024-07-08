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


```jsx
const quote = await pathfinder.getQuote({
            sourceChainId: "43113",
            sourceTokenAddress: "0xce811501ae59c3E3e539D5B4234dD606E71A312e",
            destinationChainId: "2494104990",
            destinationTokenAddress: "0x24DC420462992C12C3E010DD86C56740E9D2D493",
            expandedInputAmount: "4000000000000000",
        });


     
        console.log(quote)
```



:::note
In case you want source / destination token to be native token, then the following value should be used for token address - 0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE
:::

:::info
Important Note: 
To play around with the API, you can use the Partner ID given in the example above. But for use in any product/protocol, you will be assigned a unique Partner ID. To get your Partner ID, please use the link provided [here](https://app.routernitro.com/partnerId).
:::