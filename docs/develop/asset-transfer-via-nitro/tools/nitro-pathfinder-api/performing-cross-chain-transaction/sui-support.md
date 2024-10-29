---
title: Sui chain support for sending transactions
sidebar_position: 6
---

For Sui, only the signing and sending trasaction will be different.


```jsx
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const main = async () => {
    
    // get transaction data same as evm
    const txResponse = await getTransaction(quoteData); // quoteData has been fetched in step 1

    // create sui client
    const rpcUrl = getFullnodeUrl("mainnet");
    const client = new SuiClient({ url: rpcUrl });

    // sending the transaction using the data given by the pathfinder
    const byteArray = hexToUint8Array(txResponse.data);
    const transactionBlock = TransactionBlock.from(byteArray);
    const result = await signAndSendTx(client, transactionBlock, walletAddress)

    console.log(`txHash ${result.digest}`);
}

main()
```