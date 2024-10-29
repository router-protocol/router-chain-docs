---
title: Sui chain support for sending transactions
sidebar_position: 6
---

For Sui, only the signing and sending trasaction will be different.


```jsx
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";
import { ethers } from "ethers";

const main = async () => {

    // configure your private_key
    const signer = Ed25519Keypair.fromSecretKey(
      Uint8Array.from(
        ethers.getBytes(
          private_key.startsWith("0x") ? private_key : `0x${private_key}`
        )
      )
    );

    // wallet address can be derived if required
    // const wallet = signer.getPublicKey().toSuiAddress();
    
    // get transaction data same as evm
    const txResponse = await getTransaction(quoteData); // quoteData has been fetched in step 1

    // create sui client
    const rpcUrl = getFullnodeUrl("mainnet");
    const client = new SuiClient({ url: rpcUrl });

    // sending the transaction using the data given by the pathfinder
    const byteArray = hexToUint8Array(txResponse.data); // convert api tnx hex data to tnx byte array
    const transactionBlock = TransactionBlock.from(byteArray);
    const result = await signAndSendTx(client, transactionBlock, signer)

    console.log(`txHash ${result.digest}`);
}

async function signAndSendTx(
  client,
  txb,
  signer
) {
  return await client.signAndExecuteTransaction({
    transaction: txb,
    signer,
    requestType: "WaitForLocalExecution",
    options: {
      showEffects: true,
      showEvents: true,
      showRawInput: true,
      showInput: true,
      showBalanceChanges: true,
      showObjectChanges: true,
    },
  });
}

main()
```
