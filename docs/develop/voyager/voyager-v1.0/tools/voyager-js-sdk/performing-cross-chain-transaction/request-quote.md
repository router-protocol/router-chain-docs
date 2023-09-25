---
title: Request a Quote
sidebar_position: 1
---

:::note
For transferring native assets, use the native token addresses given [here](../../configurations/native-assets).
:::

## Sample Request and Response
Getting a quote for transferring 10 USDC from Polygon to Fantom:

### Request

```jsx
import { RouterProtocol } from "@routerprotocol/router-js-sdk"
import { ethers } from "ethers";

const main = async() => {

// initialize a RouterProtocol instance

// getting a quote for USDC transfer from Polygon to Fantom
let args = {
    amount: (ethers.utils.parseUnits("10.0", 6)).toString(), // 10 USDC
    dest_chain_id: 250, // Fantom
    src_token_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC on Polygon
    dest_token_address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", // USDC on Fantom

    fee_token_address: "0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4", // ROUTE on Polygon
    slippage_tolerance: 1.0
}

const quote = await routerprotocol.getQuote(args.amount, args.dest_chain_id, args.src_token_address, args.dest_token_address, args.user_address, args.fee_token_address, args.slippage_tolerance)
console.log(quote)
}

main()
```

### Response
```jsx
{
  source: {
    asset: {
      decimals: 6,
      symbol: 'USDC',
      name: 'USDC',
      chainId: 137,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      resourceID: '0x00000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400',
      isMintable: false,
      isWrappedAsset: false,
      tokenInstance: [Object]
    },
    stableReserveAsset: {
      decimals: 6,
      symbol: 'USDC',
      name: 'USDC',
      chainId: 137,
      address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
      resourceID: '0x00000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400',
      isMintable: false,
      isWrappedAsset: false
    },
    tokenAmount: '10000000',
    stableReserveAmount: '10000000',
    path: [],
    flags: [],
    priceImpact: '0',
    bridgeFeeAmount: '2300',
    tokenPath: '',
    dataTx: [ '0x00' ]
  },
  destination: {
    asset: {
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
      chainId: 250,
      address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      resourceID: '0x00000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400',
      isMintable: false,
      isWrappedAsset: false,
      tokenInstance: [Object]
    },
    stableReserveAsset: {
      decimals: 6,
      symbol: 'USDC',
      name: 'USD Coin',
      chainId: 250,
      address: '0x04068DA6C83AFCFA0e13ba15A6696662335D5B75',
      resourceID: '0x00000000000000000000002791bca1f2de4661ed88a30c99a7a9449aa8417400',
      isMintable: false,
      isWrappedAsset: false
    },
    tokenAmount: '10000000',
    stableReserveAmount: '10000000',
    path: [],
    flags: [],
    priceImpact: '0.00',
    tokenPath: 'USDC',
    dataTx: [ '0x00' ]
  }
}
```