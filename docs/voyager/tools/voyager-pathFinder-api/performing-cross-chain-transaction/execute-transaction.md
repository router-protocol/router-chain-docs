---
title: Execute the Transaction
sidebar_position: 3
---

Now that we have received the quote and given allowance to Router's Reserve Token Handler, it's time to execute the transaction.

```jsx
import { ethers } from 'ethers'
    
const main = async () => {
    // getting pathfinder response using the code given in Step 1
    const pathfinder_response = await fetchPathfinderData(args)
    
    // setting up a signer
    const provider = new ethers.providers.JsonRpcProvider("https://polygon-rpc.com", 137);
    // use provider.getSigner() method to get a signer if you're using this for a UI
    const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider)
    
    // setting the gas price and limit
    if(!pathfinder_response.txn.execution.gasPrice){
        pathfinder_response.txn.execution.gasPrice = await wallet.provider.getGasPrice()
    }

    if(pathfinder_response.txn.execution.value){
        pathfinder_response.txn.execution.value = ethers.utils.hexlify(ethers.BigNumber.from(pathfinder_response.txn.execution.value))
    }
    
    if(!pathfinder_response.txn.execution.gasLimit){
        pathfinder_response.txn.execution.gasLimit = ethers.utils.hexlify(ethers.BigNumber.from(1000000))
    }
    
    // sending the transaction using the data given by the pathfinder
    const tx = await wallet.sendTransaction(pathfinder_response.txn.execution)
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