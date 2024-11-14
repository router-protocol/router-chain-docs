---
title: Integrating Router Pay into your dApp
sidebar_position: 2
---

Any dApp can integrate Router Pay to provide it's users a no sign-up UX. This can be easily done by integrating Router Pay APIs. 
Integration of Router Pay is a 2 step process -
1. **Generation of deposit address:** API to generate a deposit address where user will send their funds to. Relayer will use the funds sent to this address to execute the transaction on behalf of the user.
2. **Check status:** API to check the status of the transaction.

## Generate Deposit Address
The below end point will generate the deposit address where the end user can send funds to. By default the expiry time for an address is 10 mins. Any amount sent to the address post 10 mins can be refunded back to the user in a trustless way. 

**Endpoint:** `POST /generate-deposit-address`   **Content-Type:** `application/json`

**Request Body**

| **Parameter** |	**Type** |	**Description** |
| --------------------- | -------------------------- | ------------------------ |
| contractAddressOnSrcChain |	string	| Contract address on selected chain which needs to be called for execution |
| calldata	| string |	Calldata for contract execution (hex) |
| fromTokenAddress |	string |	The token which user will be sending funds in |
| refundAddress |	string |	Address for potential refunds |
| chainId |	string |	Chain Id on which the user will be sending funds (should be the same where the contract has to be called) |
| amount |	string |	Amount to be used for executing the calldata |
| partnerId |	number |	OPTIONAL: Partner identification number |


**Sample Request**
```jsx
{
    "contractAddressOnSrcChain": "0x1396f41d89b96eaf29a7ef9ee01ad36e452235ae",
    "calldata": "0xddddd",
    "fromTokenAddress": "0xAF82969ECF299c1f1Bb5e1D12dDAcc9027431160",
    "refundAddress": "0xf79D7E74304AF49748A4d77d4B64eeEE84d131cf",
    "chainId": "43113",
    "amount": "100000000000000023001",
    "partnerId": 12
}
```

## Check Status
The API will provide the status of the transaction for a particular deposit address.

**Endpoint:** ``GET /get-status-by-deposit-address``

**Query Parameters**

| **Parameter** |	**Type** |	**Description** |
| --------------------- | -------------------------- | ------------------------ |
| depositAddress |	string	| The deposit address to check the status for |
| chainId	| number |	Chain Id where deposit was made |
| limit |	number |	Number of transactions per page |
| page |	number |	Page number for pagination |

**Sample Request**
```jsx
GET /get-status-by-deposit-address?depositAddress=0x55E0213D2C0dFf7A42b6F2Bf05B636e2605eD990&chainId=56&limit=20&page=1
```

### Transaction Statuses
| **Status** |	**Description** |
| --------------------- | -------------------------- | ------------------------ |
| PENDING |	Waiting for funds to be deposited |
| SUCCESS |	Funds deposited, relaying in progress |
| FAILED |	Simulation failed or transaction receipt failed |
| NOT_FOUND |	No funds sent before address expiration |
| REVERTED |	Transaction reverted |