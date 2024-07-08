---
title: Check and Set Allowances
sidebar_position: 2
---

Prior to initiating a transaction using any web3 library (ethers.js or web3.js), users must make sure that Router's transfer or swap contract has the appropriate permissions to use the requested asset in their wallet. You can achieve this via the following piece of code:

:::note
Router Protocol enables native asset transfers/swaps via their wrapped versions. Therefore, users need to provide an allowance to the wrapped version of the native asset being transferred/swapped.
Native asset and its wrapped asset info is given [here](../../../supported-chains-tokens).
:::

```ts
import { ethers, Contract } from 'ethers'

// ERC20 Contract ABI for "Approve" and "Allowance" functions
// ERC20 Contract ABI for "Approve" and "Allowance" functions
const erc20_abi = [
    {
        "name": "approve",
        "inputs": [
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "name": "allowance",
        "inputs": [
            {
                "internalType": "address",
                "name": "owner",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "spender",
                "type": "address"
            }
        ],
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];


    const erc20 = new Contract(tokenAddress, erc20_abi, wallet);
    const allowance = await erc20.allowance(await wallet.getAddress(), approvalAddress);
    if (allowance.lt(amount)) {
        const approveTx = await erc20.approve(approvalAddress, amount, {gasPrice: await wallet.provider.getGasPrice()});
        try {
            await approveTx.wait();
            console.log(`Transaction mined succesfully: ${approveTx.hash}`)
        }
        catch (error) {
            console.log(`Transaction failed with error: ${error}`)
        }
    }


const main = async () => {

    // setting up a signer
    const provider = new ethers.providers.JsonRpcProvider("hhttps://endpoints.omniatech.io/v1/eth/holesky/public", 17000);
    // use provider.getSigner() method to get a signer if you're using this for a UI
    const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider)
    
    await checkAndSetAllowance(
        wallet,
        "0x5c2c6ab36a6e4e160fb9c529e164b7781f7d255f", // fromTokenAddress (AFTT on Hoelsky)
        "<address-to-approve>", // quote.allowanceTo in getQuote(params) response from step 1
        ethers.constants.MaxUint256 // amount to approve (infinite approval)
    );
}

main()
```