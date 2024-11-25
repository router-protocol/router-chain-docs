---
title: Integrating Router Nitro with ISA capabilities
sidebar_position: 3
---

:::note
You can find the API swagger **[here](../../../api/?v=ROUTER-PAY)**
:::

A dApp looking to add Nitro for adding cross-chain capabilities to their system can also take advantage of Router Pay and provide a wallet-less journey to their end users.

Integration of Router Nitro which also has ISA capabilities is a 2 step process -
1. **Generation of deposit address:** API to generate a deposit address where user will send their funds to.  Relayer will use the funds sent to this address to execute the transaction on behalf of the user. The API will also return the calldata for Nitro contract and can be used for giving an optional flow via wallet connect to the users.
2. **Check status:** API to check the status of the transaction.

:::info
BASE URL = https://api.pay.routerprotocol.com
:::


## Generate Deposit Address
The below end point will generate the deposit address where the end user can send funds to. By default the expiry time for an address is 10 mins. Any amount sent to the address post 10 mins can be refunded back to the user in a trustless way. 
The below API returns both the transaction data as well as the deposit address for the user. In case just the quote is needed, [Quote API](../../../develop/asset-transfer-via-nitro/tools/nitro-pathfinder-api/performing-cross-chain-transaction/request-quote) can be integrated and called.

**Endpoint:** `GET /swap-on-nitro`

**Query Parameters**

| **Parameter** |	**Type** |	**Description** |
| --------------------- | -------------------------- | ------------------------ |
fromTokenAddress |	string |	Source token address
toTokenAddress |	string |	Destination token address
amount |	string |	Amount to swap (in smallest unit)
fromTokenChainId |	number |	Source chain id
toTokenChainId |	number |	Destination chain id
partnerId |	number |	Partner identification number
slippageTolerance |	number |	Maximum acceptable slippage (%)
destFuel |	number |	Destination fuel amount
refundAddress |	string |	Address for potential refunds

Example Request
```jsx
GET /swap-on-nitro?fromTokenAddress=0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d
    &toTokenAddress=0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
    &amount=1000000000000000000
    &fromTokenChainId=56
    &toTokenChainId=698
    &partnerId=1
    &slippageTolerance=2
    &destFuel=0
    &refundAddress=0x46c5a13490076cE77a285E9E38FA8818AC2915Aa
```

## Check Status
For checking the status of the transaction, there will be 2 steps required -
1. Check status of the source transaction via Router Pay - to check the status of Router Pay transaction, please refer [here](../dapp-integration/#check-status).
2. Check status of the destination transaction - once the status check of Router Pay is `SUCCESS`, the API for checking the destination status can be triggered using the same transaction hash returned as part of the Router Pay status check API. To know details on the destination transaction tracking, please refer [here](../../../develop/asset-transfer-via-nitro/tools/nitro-pathfinder-api/performing-cross-chain-transaction/check-status).