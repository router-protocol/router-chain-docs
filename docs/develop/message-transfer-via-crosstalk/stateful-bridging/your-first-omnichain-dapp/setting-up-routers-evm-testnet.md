---
title: 1) Setting up Router's EVM Tesnet
sidebar_position: 1
---

```
import { MetaMaskNetwork } from '../../../src/components/MetaMaskNetwork';
```

To create cross-chain applications using the Router infrastructure, users will have to build and deploy application contracts on various third-party chains. To simulate an EVM environment for smart contract deployment and interaction, we have created Router's own EVM-compatible Testnet.

## Part 1: Adding Router's EVM Testnet

To set up Router's EVM Testnet on your MetaMask wallet, you can use two approaches:

<details>
<summary><b>Option 1) Add the Network Manually</b></summary>

**Step 1)** Log in to your MetaMask wallet and go to **Settings**.

<center><img src={require('./images/setting-up-routers-evm-devnet/step-1.png').default} alt="Step 1" style={{width: 300, marginBottom: 12}} /></center>

**Step 2)** Go to **Networks > Add Network**.

<center><img src={require('./images/setting-up-routers-evm-devnet/step-2.png').default} alt="Step 2" style={{width: 300, marginBottom: 12}} /></center>

**Step 3)** Click on **Add a network manually**.

<center><img src={require('./images/setting-up-routers-evm-devnet/step-3.png').default} alt="Step 3" style={{ width: 750, marginBottom: 12}} /></center>

**Step 4)** Add the following details and click on **Save**:

| **Field**           | **Entry**                               |
| ------------------- | --------------------------------------- |
| **Network name**    | Router EVM Testnet                      |
| **New RPC URL**     | https://evm.rpc.testnet.routerchain.dev |
| **Chain ID**        | 9601                                    |
| **Currency Symbol** | ROUTE                                   |

> **Warning:** Leave the **Block explorer URL** blank.

<center><img src={require('./images/setting-up-routers-evm-devnet/step-4.png').default} alt="Step 4" style={{width: 300, marginBottom: 12}} /></center>

Following the previous step, you should be able to see Router EVM Testnet as one of your networks.

<center><img src={require('./images/setting-up-routers-evm-devnet/check.png').default} alt="Check" style={{width: 300, marginBottom: 12}} /></center>

</details>

<details>
<summary><b>Option 2) Add the Network with a Single Click</b></summary>

<MetaMaskNetwork />

</details>

---

## Part 2: Creating a Wallet to Interact with the Testnet

Now that we have added our network, it's time to import a wallet to interact with it. To do so, follow the guide given <a href="/router-core/guides/your-first-contract#step-2-setting-up-an-account" target="_blank">here</a>.