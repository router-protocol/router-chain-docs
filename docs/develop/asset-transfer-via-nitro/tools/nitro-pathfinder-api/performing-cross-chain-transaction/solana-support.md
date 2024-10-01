---
title: Solana chain support for sending transactions
sidebar_position: 5
---

For Solana, fetching the Nitro pathfinder quote will be same as before; however, executing transaction will be different.

1. When the source chain is Solana

```jsx
import {
    createApproveInstruction,
    getAssociatedTokenAddress,
    TOKEN_2022_PROGRAM_ID,
    TOKEN_PROGRAM_ID,
  } from "@solana/spl-token";
  import {
    Keypair,
    MessageV0,
    PublicKey,
    Transaction,
    VersionedTransaction,
  } from "@solana/web3.js";

const main = async () => {

    // 0. after getting txResponse from "v2/transaction" api
    const txResponse = await getTransaction(quoteData);

    // 1. transform required instructions
    const secretKeyBytes = txResponse.data?.keypair
        ? Object.values(txResponse.data.keypair.secretKey)
        : undefined;

    const keypairX = secretKeyBytes
        ? // @ts-ignore
        Keypair.fromSecretKey(Uint8Array.from(secretKeyBytes))
        : undefined;
    const keypair = keypairX
        ? {
            publicKey: keypairX.publicKey,
            secretKey: keypairX.secretKey,
        }
        : undefined;
    
    let transactionInstructions = [];

    // only for flowType 'circle', approval instruction
    const txnFlowType = txResponse.flowType;
    if (txnFlowType === "circle") {
        transactionInstructions = getApproveInstruction("<senderAddress>", "<srctoken>", "<amount>");
    }

    let allTxnHash = [];

    for (
        let index = 0;
        index < txResponse?.data?.instructions.length;
        index++
    ) {
        const convertedKeys = txResponse?.data?.instructions[
            index
        ].keys.map((key: { pubkey: anchor.web3.PublicKeyInitData }) => ({
            ...key,
            pubkey: new PublicKey(key.pubkey),
        }));

        // Solana instruction object
        const instruction = {
            keys: convertedKeys,
            programId: new PublicKey(
                txResponse?.data?.instructions[index].programId
            ),
            data: Buffer.from(
                txResponse?.data?.instructions[index].data
            ),
        };

        transactionInstructions.push(instruction);
    }

    // 2. batch instructions upto 800 bytes
    function batchInstructions(instructions: any, maxSize = 800) {
        const batches = [];
        let currentBatch = [];
        let currentSize = 0;

        for (let instruction of instructions) {
            const instructionSize = instruction.data.byteLength;

            // Check if adding this instruction would exceed the size limit
            if (currentSize + instructionSize > maxSize) {
                // Push current batch to batches and start a new batch
                if (currentBatch.length == 0) {
                    batches.push([instruction]);
                } else {
                    batches.push(currentBatch);
                    currentBatch = [instruction];
                    currentSize = instructionSize;
                }
            } else {
                // Add instruction to current batch
                currentBatch.push(instruction);
                currentSize += instructionSize;
            }
        }

        // Add any remaining instructions as a batch
        if (currentBatch.length > 0) {
            batches.push(currentBatch);
        }

        return batches;
    }

    const batchedInstrcutions = batchInstructions(transactionInstructions);

    for (let batchs of batchedInstrcutions) {
        allTxnHash.push(await senBatchTxn(batchs));
    }

    // 3. send batch transactions
    async function senBatchTxn(batchInstruction: any) {
        const transaction = new Transaction();

        for (let instruction of batchInstruction) {
            transaction.add(instruction);
        }

        let blockhashData = await solanaConnection.getLatestBlockhash({
            commitment: "confirmed",
        });

        transaction.recentBlockhash = blockhashData.blockhash;
        transaction.feePayer = wallet.publicKey;

        if (keypair !== undefined) {
            transaction.sign(keypair);
        }
        // console.log(" the keypair - ", keypair)

        const messageV0 = new MessageV0(transaction.compileMessage());

        // Create VersionedTransaction from MessageV0
        const versionedTransaction = new VersionedTransaction(messageV0);
        if (keypair !== undefined) {
            versionedTransaction.sign([keypair]);
        }

        const simulationResult = await solanaConnection.simulateTransaction(
            versionedTransaction,
            { commitment: "confirmed" }
        );

        console.log("simulationResult ", simulationResult);

        if (simulationResult.value.err) {
            console.log(
                `Transaction simulation failed with error ${JSON.stringify(
                    simulationResult.value.err
                )}`
            );
            throw new Error(
                `Transaction simulation failed with error ${JSON.stringify(
                    simulationResult.value.err
                )}`
            );
        }

        let confirmedTx = await wallet.signAndSendTransaction(versionedTransaction);

        await solanaConnection.confirmTransaction(
            confirmedTx.signature,
            "confirmed"
        );
        return confirmedTx;
    }
}


async function getApproveInstruction(sender, sourceToken, amount) {
    const payerPublicKey = sender;
    const mintPublicKey = new PublicKey(sourceToken);
    const spenderPublicKey = new PublicKey( // constant for circle cctp flow
        "DwudccJz2JtJBsK1ZiAZkHkS2o3rffKwTyffzTHpfG3f"
    );

    const TokenProgram = TOKEN_PROGRAM_ID;


    // Get the associated token account for the payer
    const payerTokenAccount = await getAssociatedTokenAddress(
        mintPublicKey,
        payerPublicKey,
        true,
        TokenProgram
    );

    const approvalInstruction = createApproveInstruction(
        payerTokenAccount,
        spenderPublicKey,
        payerPublicKey,
        amount,
        [],
        TokenProgram
    );

    return approvalInstruction;
}


const getTransaction = async (params, quoteData) => {
    const endpoint = "v2/transaction"
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`

    console.log(txDataUrl)

    try {
        const res = await axios.post(txDataUrl, {
            ...quoteData,
            senderAddress: "<sender-address>",
            receiverAddress: "<receiver-address>",
            refundAddress: "<refundAddress>" // (optional) By default equal to `senderAddress` if not provided
        })
        return res.data;
    } catch (e) {
        console.error(`Fetching tx data from pathfinder: ${e}`)
    }    
}

```


2. When the destination chain is Solana.
When Solana is the destination chain, passing `receiverAddress` to the pathfinder API can be different.

```jsx
import { ethers } from 'ethers'

const PATH_FINDER_API_URL = "https://k8-testnet-pf.routerchain.dev/api"

const getTransaction = async (params, quoteData) => {
    const endpoint = "v2/transaction"
    const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`

    console.log(txDataUrl);

    // circle flow doesn't support ata creation during transaction. So, need to pass user's ata address.
    const receiverAddress = quoteData.flowType == "circle" ? "<receiver-ata-address>" : "<receiver-address>";

    try {
        const res = await axios.post(txDataUrl, {
            ...quoteData,
            senderAddress: "<sender-address>",
            receiverAddress: "<receiver-address>",
            refundAddress: "<refundAddress>" // (optional) By default equal to `senderAddress` if not provided
        })
        return res.data;
    } catch (e) {
        console.error(`Fetching tx data from pathfinder: ${e}`)
    }    
}


```
