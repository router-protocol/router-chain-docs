---
title: Execute the Transaction
sidebar_position: 3
---

Now that we have received the quote and given allowance to Router's Reserve Token Handler, it's time to execute the transaction.

```jsx
import { ethers } from 'ethers'

const PATH_FINDER_API_URL = "https://app.staging2.thevoyager.io"

const getTransaction = async (params) => {
    const endpoint = "v2/transaction"
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`

    console.log(txDataUrl)

    try {
        const res = await axios.get(txDataUrl, {
            ...params,
            slippageTolerance: 1,
            senderAddress: "sender-address",
            receiverAddress: "receiver-address"
        })
        return res.data;
    } catch (e) {
        console.error(`Fetching tx data from pathfinder: ${e}`)
    }    
}
    
const main = async () => {
    
    // setting up a signer
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com", 137);
    // use provider.getSigner() method to get a signer if you're using this for a UI
    const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider)
    
    // create transaction data from api
    const txResponse = await getTransaction(quoteResponse); // quoteResponse is fetched in step 1.

    
    // sending the transaction using the data given by the pathfinder
    const tx = await wallet.sendTransaction(txResponse.txn.execution)
    try {
        await tx.wait();
        console.log(`Transaction mined successfully: ${tx.hash}`)
    }
    catch (error) {
        console.log(`Transaction failed with error: ${error}`)
    }
}

main()
```