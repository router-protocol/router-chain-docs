---
title: Execute the Transaction
sidebar_position: 3
---

```javascript
const tx = await routerprotocol.swap("QUOTE","SOURCE_SIGNER")
```

### Example

```javascript
import { RouterProtocol } from "@routerprotocol/router-js-sdk"
import { ethers } from "ethers";

const main = async() => {

// initialize a RouterProtocol instance

// get a quote for USDC transfer from Polygon to Fantom
const quote = await routerprotocol.getQuote("AMOUNT", "DESTINATION_CHAIN_ID", "SOURCE_TOKEN_ADDRESS", "DESTINATION_TOKEN_ADDRESS", "USER_ADDRESS", "FEE_TOKEN_ADDRESS", "SLIPPAGE_TOLERANCE")
// amount has to be decimal adjusted (i.e. for 1 USDC, pass 1000000 since USDC has 6 decimal places)

// get allowance and give the relevant approvals

// execute the transaction
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider) // provider was set up while initializing an instance of RouterProtocol
// use provider.getSigner() method to get a signer if you're using this for a UI

let tx;
try{
    tx = await routerprotocol.swap(quote,wallet)
    console.log(`Transaction successfully completed. Tx hash: ${tx.hash}`)
}
catch(e){
    console.log(`Transaction failed with error ${e}`)
    return
}
}

main()
```