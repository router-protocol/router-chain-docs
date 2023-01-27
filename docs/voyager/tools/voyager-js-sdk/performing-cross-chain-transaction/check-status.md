---
title: Check the Status
sidebar_position: 4
---

```javascript
const txStatus = await routerprotocol.getTransactionStatus("TXN_HASH")
```

:::note
Unlike the Asset Swap API, there is no need to provide chainId while querying the status using the SDK as the chainId is included while initializing the RouterProtocol instance.
:::

<details>

<summary>Response Type</summary>

```javascript
interface TransactionStatus{
"tx_status":string,
"tx_status_code":number,
"src_chain_id":string,
"dest_chain_id":string,
"src_tx_hash":string,
"dest_tx_hash":string
}
```

</details>

## Sample Request and Response

Checking the status of a cross-chain transaction from Polygon to Fantom:

### Request

```javascript
import { RouterProtocol } from "@routerprotocol/router-js-sdk"
import { ethers } from "ethers";

const main = async() => {

// initialize a RouterProtocol instance

// get a quote for USDC transfer from Polygon to Fantom

// get allowance and give the relevant approvals

// execute the transaction

// fetching the status of the transaction
setTimeout(async function() {
    let status = await routerprotocol.getTransactionStatus(tx.hash) 
    console.log(status)
    if (status.tx_status_code === 1) {
        console.log("Transaction completed")
      // handle the case where the transaction is complete 
    }
    else if (status.tx_status_code === 0) {
        console.log("Transaction still pending")
    // handle the case where the transaction is still pending
    }
  }, 180000); // waiting for sometime before fetching the status of the transaction because it may take some time for the transaction to get indexed

}

main()
```

### Response

```javascript
{
  tx_status: 'Completed',
  tx_status_code: 1,
  src_chain_id: '137',
  dest_chain_id: '250',
  src_tx_hash: '0x4f2814d3a5f7f5b5ace3688d901fa0cd1bd65a0d04be4d81eaefcf5afcd4b2ff',
  dest_tx_hash: '0xc78cf044c0de46bdaedf661d740bbf09e39ad57074eee89f6856812fda06428f'
}
```