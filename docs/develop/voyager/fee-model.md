---
title: Fee Model
sidebar_position: 5
---

## For an Asset Transfer Request
For an asset transfer request, Voyager's bridge contract on the Router chain calculates the bps-based fee and subtracts it from the destination token amount. For example, if a user has deposited 10000 USDC on the source chain and the fee comes out to be 10 USDC, then the bridge contract will change the destination token amount to 9990. This means that even though a contract on the Router chain calculates the fee, it is maintained on Voyager's Reserve Handler contract on the source chain.

```javascript
Fee = Min((baseFee + bps * txVolumeInUSD), maxFee)
```

In this system, we need the price of the reserve tokens in USD as the fee has to be set in terms of USD. To get this price, we have two approaches:
1. **Using Band Protocol Oracles:** For most of the reserve tokens, we will get oracles from Band Protocol. 
2. **Using Centralized Services:** If we are not able to source a reliable oracle for any reserve token, we will fetch its price from CoinGecko/CoinMarketCap.


## For a Sequenced Request
There are two fees associated with a sequenced cross-chain request - one for the asset transfer call and one for the data transfer call. The fee associated with the asset transfer call is calculated in the same way as given above. The only change is that the fee is not actually subtracted from the destination chain amount, but it is deducted from Voyager's bridge contract address along with the fee for the data transfer call, which is calculated as per the token price and gas price oracle (as in the OmniChain flow). Voyager's bridge contract will, in turn, deduct this fee from the bridge contract address of the original application that made the sequenced request.  