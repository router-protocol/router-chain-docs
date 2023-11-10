---
title: Fee Model
sidebar_position: 6
---

## For an Asset Transfer Request

For an asset transfer request, Voyager's bridge contract on the Router chain calculates the bps-based fee and subtracts it from the destination token amount. For example, if a user has deposited 10000 USDC on the source chain and the fee comes out to be 10 USDC, then the bridge contract will change the destination token amount to 9990. This means that even though a contract on the Router chain calculates the fee, it is maintained on Voyager's Reserve Handler contract on the source chain.

```javascript
Fee = Min((baseFee + bps * txVolumeInUSD), maxFee)
```

:::info
If the fee required for transaction is greater than the amount being transferred and the cost of reverting it is lesser than the amount transferred, the transaction will be reverted back on the source chain by a request from the bridge contract on the Router Chain.
:::

In this system, we need the price of the reserve tokens in USD as the fee has to be set in terms of USD. To get this price, we have two approaches:
1. **Using Band Protocol Oracles:** For most of the reserve tokens, we will get oracles from Band Protocol. 
2. **Using Centralized Services:** If we are not able to source a reliable oracle for any reserve token, we will fetch its price from CoinGecko/CoinMarketCap.


## For a Sequenced Request

<!-- The fee mechanism for arbitrary instructions transfer along with the funds differs from that of normal fund transfers across chains because with arbitrary instructions, the user wants the same amount of tokens to be credited on the destination chain as were deducted on the source chain. 

The fees here entails the fees for token transfer plus the amount of gas limit passed for arbitrary instruction transfer to the destination chain. The fees will be deducted in the form of Route tokens on the Voyager middleware contract on the Router Chain from an account which will be known as fee payer. 

For this, the application has to register with Voyager by contacting the Voyager team to set an account as a fee payer admin for the application. This fee payer admin can then set any account on Router chain as the fee payer for requests originating from that application. Also the fee payer has to confirm on the Voyager middleware that it indeed wants to pay the fees for this application. This is a one time process and once done, fees for every request that originates from that application will be paid by the fee payer account. The fee payer admin can also change the fee payer address in the future by following the similar process. -->

There are two fees associated with a sequenced cross-chain request - one for the asset transfer call and one for the data transfer call. The fee associated with the asset transfer call is calculated in the same way as given above. The only change is that the fee is not actually subtracted from the destination chain amount, but it is deducted from Voyager's bridge contract address along with the fee for the data transfer call, which is calculated as per the token price and gas price oracle. Voyager's bridge contract will, in turn, deduct this fee from the bridge contract address of the original application that made the sequenced request.  