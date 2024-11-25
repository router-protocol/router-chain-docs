---
title: Refund for failures
sidebar_position: 4
---

There can be certain scenarios in which even though user has transferred funds but the transaction might not be completed by the solver.
- The funds were received in the deposit address almost near to / post expiry and hence the solver didn't pick it up.
- The fees wasn't enough for the solver to do this transaction.
- The transaction was reverting on source cause of an issue in the calldata.

In such cases the user has send funds to the address and the transaction is not completed from the solver the user can initiate refund for their funds. Below are 2 ways to achieve the same

## Using Router Pay Explorer 

Coming Soon..

## Using Contract Call

:::note
You can find the API swagger **[here](../../../api/?v=ROUTER-PAY)**
:::

### API to generate calldata
Generate the calldata for the transaction for which a refund has to be initiated.
:::info
BASE URL = https://api.pay.routerprotocol.com
:::

**Endpoint:** ``GET /prepare-calldata``

**Query Parameters**

| **Parameter** |	**Type** |	**Description** |
| --------------------- | -------------------------- | ------------------------ |
| uid |	string	| The UID for which the refund has to be processed. The UID is given as the response in generate deposit address API. |

**Sample Request**
```jsx
GET /prepare-calldata?uid=6e6363f6-d221-47b5-bf7f-06fd2a6ad53a
```

### Contract call
Post the calldata is generated, contract can be invoked with the calldata for initiating the refunds. Below is the sample code on how this can be achieved.
```jsx
const provider = new ethers.JsonRpcProvider(RPC_URL);
if (!PRIVATE_KEY) {
    throw new Error("PRIVATE_KEY is not set");
}
// Create wallet instance
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Prepare transaction
const tx = {
    to: rawCalldata.address,
    data: rawCalldata.calldata,
    value: ethers.parseEther("0"),
    gasLimit: rawCalldata.gasLimit || 100000,
};

// Send transaction
console.log('Sending transaction...');
const txResponse = await wallet.sendTransaction(tx);
```