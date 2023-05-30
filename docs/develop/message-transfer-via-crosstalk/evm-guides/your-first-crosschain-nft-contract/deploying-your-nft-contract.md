---
title: Deploying a Sample Cross-Chain NFT Contract
sidebar_position: 2
---

import APIData from '../../../../../src/utils/GatewayAddressTable';

This section describes how to deploy your NFT smart contract on different EVM-chains and test it by actually transferring your NFTs cross-chain.

## **STEP 3)** Deploy your NFT Contract

### 1) Add networks to metamask

**Step 1)** Visit [chainlist](https://chainlist.org/) for adding networks to your metamask.
**Step 2)** Connect your metamask wallet.
**Step 3)** Click on `include testnets`.
**Step 4)** Search for `mumbai` and `Avalanche Fuji Testnet` and add them to your metamask.
**Step 5)** Visit [Polygon faucet](https://faucet.polygon.technology/) to request for some test MATIC into your account under Polygon Mumbai testnet.
**Step 6)** You can also visit [Avalanche faucet](https://faucet.avax.network/) to request for some test AVAX into your account under Avalanche Fuji testnet.

### 2) Compile your NFT contract

**Step 1)** Go to https://remix.ethereum.org/

**Step 2)** In the File Explorer pane, click on the plus icon under the **Workspaces** tab to create a new workspace.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/step-2.png')
        .default
    }
    alt="Step 2"
    style={{ width: 300, marginBottom: 12 }}
  />
</center>

**Step 3)** Under the template option, choose **Blank**, give your workspace an appropriate name and then click on **OK**.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/step-3.png')
        .default
    }
    alt="Step 3"
    style={{ width: 300, marginBottom: 12 }}
  />
</center>

**Step 4)** In your new workspace, create a new file by the name of **XERC1155.sol**.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/step-4.png')
        .default
    }
    alt="Step 4"
    style={{ width: 300, marginBottom: 12 }}
  />
</center>

**Step 5)** Copy the smart contract mentioned in STEP 1) and paste it into **XERC1155.sol**.

**Step 6)** Click on the **Solidity compiler** icon (the one shaped like an S), check that your compiler version is within the versions specified in the pragma solidity statement, and click on **Compile HelloRouter.sol**.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/step-6.png')
        .default
    }
    alt="Step 6"
    style={{ marginBottom: 12 }}
  />
</center>

Once compiled, you should see a green tick mark over the **Solidity compiler** icon.

### 3) Deploy the Compiled Contract

Lets say if you want to deploy your contract on Polygon Mumbai and Avalanche Fuji, you need to switch your network to Polygon Mumbai and deploy it using respective gateway address for Mumbai and repeat the process for Avalanche Fuji using the gateway address for Fuji.

**Step 1)** Click on the **Deploy & run transactions** icon (the one with the Ethereum logo) and select **Injected Provider - Metamask** as the **Environment**.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-2-step-1.png')
        .default
    }
    alt="Step 1"
    style={{ marginBottom: 12 }}
  />
</center>

**Step 2)** A MetaMask window will pop up following the previous step. Connect with your wallet and confirm.

**Step 3)** Add the gateway address for respective chains (mentioned in the below table), your wallet address(it can be EVM wallet address or router wallet address) and URI for the NFT contract, click on **Deploy** and sign the transaction in your MetaMask.

<APIData
  apiData={[
    { apiUrl: 'https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/chain_config', networkType: 'Testnet' }
  ]}
/>

<p style={{ marginBottom: '50px' }}></p>

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-2-step-3.png')
        .default
    }
    alt="Step 3"
    style={{ width: 300, marginBottom: 12 }}
  />
</center>

Sometimes the contract deployment fails due to low gas fees, so make sure to edit the gas fees while signing the transaction in your wallet.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/success.png')
        .default
    }
    alt="Success"
    style={{ marginBottom: 12 }}
  />
</center>

## **STEP 4)** Fee-payer approval and contract configuration

### **1)** Get funds in your wallet from Router-faucet

Go to https://faucet.testnet.routerchain.dev, connect your metamask wallet, select network as `Testnet`, select token as `ROUTE`, paste your wallet address and get test tokens into your account.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-4-step-1.png')
        .default
    }
    alt="Step 1"
    style={{ width: 400, marginBottom: 12 }}
  />
</center>

### **2)** Approve your request on Router-explorer

Go to https://explorer.testnet.routerchain.dev/feePayer , connect your wallet and approve the pending request corresponding to your source dapp address.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-4-step-2.png')
        .default
    }
    alt="Step 1"
    style={{ marginBottom: 12 }}
  />
</center>

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-4-step-2-a.png')
        .default
    }
    alt="Step 1"
    style={{ marginBottom: 12 }}
  />
</center>

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-4-step-2-b.png')
        .default
    }
    alt="Step 1"
    style={{ marginBottom: 12 }}
  />
</center>

### **3)** Set address for counterpart contract

Let's say you deployed your contract on Polygon Mumbai and Avalanche Fuji, you need to set the address of the contract deployed on Fuji onto the contract deployed on Mumbai and vice-versa using the `setContractOnChain` function.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-4-step-3.png')
        .default
    }
    alt="Step 3"
    style={{ width: 400, marginBottom: 12 }}
  />
</center>

## **STEP 5)** Test your Cross-chain NFT Contract

### **1)** Get request metadata

This function gets you the metadata to be used while initiating a cross-chain transfer requestfrom source chain using `transferCrossChain` function. It includes gas limit for destination chain, gas price for destination chain, gas limit for source chain(ackGasLimit), gas price for source chain(ackGasPrice), relayer fees, acknowledgement type, bool if it is a read call and address for additional security module. To know more about request metadata parameters, kindly refer to this [page](../iDapp-functions/iSend.md#5-requestmetadata).

Create the metadata like this:

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-5-step-1.png')
        .default
    }
    alt="Step 1"
    style={{ width: 400, marginBottom: 12 }}
  />
</center>

### **2)** Transfer your NFTs crosschain

As explained earlier, `transferCrossChain` function is responsible for creating a cross-chain NFT-transfer request. It first burns the NFT from contract on source chain, utilises Gateway contracts' `ISend` function to send request to mint the NFT to the user on the destination chain. To know more about this function, kindly refer to Step-6 on this [page](../../sample-idapps/on-evm-chains/cross-chain-nft.md#step-by-step-guide)

You need to call this function by putting the chain id for destination chain; tuple of transfer parameters that contain NFT ID to be transferred, amount of that NFT id, nft data and the address of the recipient of those NFTs on destination chain; and the request metadata that we created in previous step.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-5-step-2.png')
        .default
    }
    alt="Step 2"
    style={{ width: 300, marginBottom: 12 }}
  />
</center>

### **3)** Track your transaction on Router Explorer

You can track the status of your transaction on [Router Explorer](https://explorer.testnet.routerchain.dev/)

### **4)** Successfully receive your NFTs on destination chain

After the transaction is successfully executed, you should now be able to see your updated NFT balance on destination chain.

<center>
  <img
    src={
      require('./images/deploying-a-sample-application-contract/part-5-step-4.png')
        .default
    }
    alt="Step 4"
    style={{ width: 300, marginBottom: 12 }}
  />
</center>

To know more about message transfer via Router's Crosstalk , kindly refer to EVM-guides [here](../../evm-guides/iDapp-functions/).
