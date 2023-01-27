---
title: Check and Set Allowances
sidebar_position: 2
---
## Getting Allowance

### Source Token Allowance

```javascript
const src_token_allowance = await routerprotocol.getSourceTokenAllowance("TOKEN_ADDRESS", "DESTINATION_CHAIN_ID", "USER_ADDRESS")
```

### Fee Token Allowance

```javascript
const fee_token_allowancea = const fee_token_allowance = await routerprotocol.getFeeTokenAllowance("TOKEN_ADDRESS", "DESTINATION_CHAIN_ID", "USER_ADDRESS")
```

## Setting Approval

### Approving Source Token

```javascript
await routerprotocol.approveSourceToken("TOKEN_ADDRESS","USER_ADDRESS", "AMOUNT_TO_BE_APPROVED", "DESTINATION_CHAIN_ID", "SOURCE_SIGNER")
```

### Approving Fee Token

```javascript
await routerprotocol.approveFeeToken("TOKEN_ADDRESS", "USER_ADDRESS", "AMOUNT_TO_BE_APPROVED", "SOURCE_SIGNER")
```

## Example

```javascript
import { RouterProtocol } from "@routerprotocol/router-js-sdk"
import { ethers } from "ethers";

const main = async() => {

// initialize a RouterProtocol instance

// setting the arguments for the cross-chain swap
let args = {
    amount: (ethers.utils.parseUnits("10.0", 6)).toString(), // 10 USDC
    dest_chain_id: 250, // Fantom
    src_token_address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", // USDC on Polygon
    dest_token_address: "0x04068DA6C83AFCFA0e13ba15A6696662335D5B75", // USDC on Fantom
    user_address: "YOUR_WALLET_ADDRESS",
    fee_token_address: "0x16ECCfDbb4eE1A85A33f3A9B21175Cd7Ae753dB4", // ROUTE on Polygon
    slippage_tolerance: 1.0
}

// getting allowance
const wallet = new ethers.Wallet("YOUR_PRIVATE_KEY", provider) // provider was set up while initializing an instance of RouterProtocol
// use provider.getSigner() method to get a signer if you're using this for a UI

let src_token_allowance = await routerprotocol.getSourceTokenAllowance(args.src_token_address, args.dest_chain_id, args.user_address)
if(src_token_allowance.lt(ethers.constants.MaxUint256)){
        await routerprotocol.approveSourceToken(args.src_token_address, args.user_address, ethers.constants.MaxUint256, args.dest_chain_id, wallet)
}

if(ethers.utils.getAddress(args.src_token_address) !== ether.utils.getAddress(args.fee_token_address)){
    let fee_token_allowance = await routerprotocol.getFeeTokenAllowance(args.fee_token_address, args.dest_chain_id, args.user_address)
    if(fee_token_allowance.lt(ethers.constants.MaxUint256)){
        await routerprotocol.approveFeeToken(args.fee_token_address, args.user_address, ethers.constants.MaxUint256, wallet)
    }
}

}

main()
```