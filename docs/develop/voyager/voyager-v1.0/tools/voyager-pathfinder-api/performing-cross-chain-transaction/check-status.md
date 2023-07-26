---
title: Check the Status
sidebar_position: 4
---

After executing a cross-chain transaction, you can also check its status by querying the following API:

:::info
You can find the API information [**here**](../../../../../api/?v=PATHFINDER).
:::


```jsx
import axios from "axios"

const STATS_API_URL = "https://api.stats.routerprotocol.com/api"

// calling the status api using axios
const fetchStatus = async (params) => {
    const endpoint = "status"
    const pathUrl = `${STATS_API_URL}/${endpoint}`
    console.log(pathUrl)
    try {
        const res = await axios.get(pathUrl, { params })
        return res.data
    } catch (e) {
        console.error(`Fetching data from API: ${e}`)
    }
}

const main = async () => {
    // sending the transaction using the data prepared by us in step 3
    const tx = await wallet.sendTransaction(pathfinder_response.txn.execution)
    try {
        await tx.wait();
        console.log(`Transaction mined successfully: ${tx.hash}`)
    }
    catch (error) {
        console.log(`Transaction failed with error: ${error}`)
        return
    }
    
    let params = {
        txHash: tx.hash,
        networkId: args.fromTokenChainId // args were defined in step 1 to fetch data from the pathfinder
    }
    
   setTimeout(async function() {
        let status = await fetchStatus(params) 
        console.log(status)
        if (status.tx_status_code === 1) {
            console.log("Transaction completed")
          // handle the case where the transaction is complete 
        }
        else if (status.tx_status_code === 0) {
            console.log("Transaction still pending")
        // handle the case where the transaction is still pending
        }
      }, 180000); // waiting for sometime before fetching the status of the transaction
}

main()
```