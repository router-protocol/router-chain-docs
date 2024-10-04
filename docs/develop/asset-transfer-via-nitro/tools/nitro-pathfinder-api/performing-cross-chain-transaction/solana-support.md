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
            refundAddress: "<refundAddress>" // (optional) By default equal to `senderAddress` if not provided,
            metaData: {
                    ataAddress:
                        await getAtaAddress( new PublicKey(senderAddress), fromTokenAddress)
                }
        })
        return res.data;
    } catch (e) {
        console.error(`Fetching tx data from pathfinder: ${e}`)
    }    
}

async function getAtaAddress(wallet: string | PublicKey, asset: string) {
  const ownerAddress = new PublicKey(wallet);
  const tokenMintAddressPubKey = new PublicKey(asset)
  console.log('asset - ', asset)

  const tokenProgram = asset === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v' ? TOKEN_PROGRAM_ID : TOKEN_2022_PROGRAM_ID

  const ataAddress = await getAssociatedTokenAddress(
    tokenMintAddressPubKey,
    ownerAddress,
    true,
    tokenProgram
  );

  const account = await solanaConnection.getAccountInfo(ataAddress);

  console.log('ata address from fn - ', ataAddress, ataAddress.toBase58(), account)
  return ataAddress;
}

```

Examples on testnet -

1. Get quote
```
curl 'https://k8-testnet-pf.routerchain.dev/api/v2/quote?fromTokenAddress=CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2&toTokenAddress=0x69dc97bb33e9030533ca2006ab4cef67f4db4125&amount=400000000&fromTokenChainId=solana-devnet&toTokenChainId=43113&partnerId=1&slippageTolerance=1&destFuel=0' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'origin: https://testnet.routernitro.com' \
  -H 'priority: u=1, i' \
  -H 'referer: https://testnet.routernitro.com/' \
  -H 'sec-ch-ua: "Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36'
```

2. Build transaction
```
curl 'https://k8-testnet-pf.routerchain.dev/api/v2/transaction' \
  -H 'accept: application/json, text/plain, */*' \
  -H 'accept-language: en-GB,en-US;q=0.9,en;q=0.8' \
  -H 'content-type: application/json' \
  -H 'origin: https://testnet.routernitro.com' \
  -H 'priority: u=1, i' \
  -H 'referer: https://testnet.routernitro.com/' \
  -H 'sec-ch-ua: "Not)A;Brand";v="99", "Google Chrome";v="127", "Chromium";v="127"' \
  -H 'sec-ch-ua-mobile: ?0' \
  -H 'sec-ch-ua-platform: "macOS"' \
  -H 'sec-fetch-dest: empty' \
  -H 'sec-fetch-mode: cors' \
  -H 'sec-fetch-site: cross-site' \
  -H 'user-agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36' \
  --data-raw '{"flowType":"trustless","isTransfer":true,"isWrappedToken":false,"allowanceTo":"3rexFGP7LYszqCRZR78Bo6XNGZNLZekA2Lpgh9fAdaeY","bridgeFee":{"amount":"800000","decimals":18,"symbol":"AFTT","address":"CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2"},"fromTokenAddress":"CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2","toTokenAddress":"0x69dc97bb33e9030533ca2006ab4cef67f4db4125","source":{"chainId":"solana-devnet","chainType":"solana","asset":{"decimals":9,"symbol":"AFTT","name":"AFTT","chainId":"solana-devnet","address":"CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2","resourceID":"aftt","isMintable":false,"isWrappedAsset":false},"stableReserveAsset":{"decimals":9,"symbol":"AFTT","name":"AFTT","chainId":"solana-devnet","address":"CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2","resourceID":"aftt","isMintable":false,"isWrappedAsset":false},"tokenAmount":"400000000","stableReserveAmount":"400000000","path":[],"flags":[],"priceImpact":"0","tokenPath":"","dataTx":[]},"destination":{"chainId":"43113","chainType":"evm","asset":{"decimals":18,"symbol":"AFTT","name":"AFTT","chainId":"43113","address":"0x69DC97Bb33E9030533Ca2006aB4Cef67f4DB4125","resourceID":"aftt","isMintable":false,"isWrappedAsset":false},"stableReserveAsset":{"decimals":18,"symbol":"AFTT","name":"AFTT","chainId":"43113","address":"0x69DC97Bb33E9030533Ca2006aB4Cef67f4DB4125","resourceID":"aftt","isMintable":false,"isWrappedAsset":false},"tokenAmount":"399999999999200000","stableReserveAmount":"399999999999200000","path":[],"flags":[],"priceImpact":"0","tokenPath":"","dataTx":[]},"partnerId":1,"fuelTransfer":null,"slippageTolerance":"1","estimatedTime":40,"senderAddress":"GHELhmF2K3B9FthTq5FQAgN1ntJw6N4EmNqQYEjJdwPz","receiverAddress":"0x2B351b7bbC86ab5DF433539fE907f8EE4DE1B964","metaData":{"ataAddress":"6vyNyzxsD391XTK6q9j85Ns62nDGPZwHiJVB5eR1yC6E"}}'
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


Examples on testnet -

1. Get quote
```
curl --location 'https://k8-testnet-pf.routerchain.dev/api/v2/quote?fromTokenAddress=0x69dc97bb33e9030533ca2006ab4cef67f4db4125&toTokenAddress=CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2&amount=1000000000000000000&fromTokenChainId=43113&toTokenChainId=solana-devnet&partnerId=1&slippageTolerance=1&destFuel=0' 
```

2. Build transaction
```
curl --location 'https://k8-testnet-pf.routerchain.dev/api/v2/transaction' \
--header 'Content-Type: application/json' \
--data '{
    "flowType": "trustless",
    "isTransfer": true,
    "isWrappedToken": false,
    "allowanceTo": "0x8db3ac65e18c87d960efd56e8fd3548acba51d8f",
    "bridgeFee": {
        "amount": "25000000",
        "decimals": 9,
        "symbol": "AFTT",
        "address": "0x69DC97Bb33E9030533Ca2006aB4Cef67f4DB4125"
    },
    "fromTokenAddress": "0x69dc97bb33e9030533ca2006ab4cef67f4db4125",
    "toTokenAddress": "CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2",
    "source": {
        "chainId": "43113",
        "chainType": "evm",
        "asset": {
            "decimals": 18,
            "symbol": "AFTT",
            "name": "AFTT",
            "chainId": "43113",
            "address": "0x69DC97Bb33E9030533Ca2006aB4Cef67f4DB4125",
            "resourceID": "aftt",
            "isMintable": false,
            "isWrappedAsset": false
        },
        "stableReserveAsset": {
            "decimals": 18,
            "symbol": "AFTT",
            "name": "AFTT",
            "chainId": "43113",
            "address": "0x69DC97Bb33E9030533Ca2006aB4Cef67f4DB4125",
            "resourceID": "aftt",
            "isMintable": false,
            "isWrappedAsset": false
        },
        "tokenAmount": "1000000000000000000",
        "stableReserveAmount": "1000000000000000000",
        "path": [],
        "flags": [],
        "priceImpact": "0",
        "tokenPath": "",
        "dataTx": []
    },
    "destination": {
        "chainId": "solana-devnet",
        "chainType": "solana",
        "asset": {
            "decimals": 9,
            "symbol": "AFTT",
            "name": "AFTT",
            "chainId": "solana-devnet",
            "address": "CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2",
            "resourceID": "aftt",
            "isMintable": false,
            "isWrappedAsset": false
        },
        "stableReserveAsset": {
            "decimals": 9,
            "symbol": "AFTT",
            "name": "AFTT",
            "chainId": "solana-devnet",
            "address": "CuDPEYd8tFRBvUs97mUQzQcECwgXGj5ZmFM4qNnjkfq2",
            "resourceID": "aftt",
            "isMintable": false,
            "isWrappedAsset": false
        },
        "tokenAmount": "975000000",
        "stableReserveAmount": "975000000",
        "path": [],
        "flags": [],
        "priceImpact": "0",
        "tokenPath": "",
        "dataTx": []
    },
    "partnerId": 1,
    "fuelTransfer": null,
    "slippageTolerance": "1",
    "estimatedTime": 40,
    "senderAddress": "0x2B351b7bbC86ab5DF433539fE907f8EE4DE1B964",
    "receiverAddress": "GHELhmF2K3B9FthTq5FQAgN1ntJw6N4EmNqQYEjJdwPz"
}'
```
