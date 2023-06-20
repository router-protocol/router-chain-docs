---
title: Step 3) Configure and Run an Orchestrator Instance
sidebar_position: 3
---

Before proceeding with this step, make sure that you are running a validator. If note, follow [this guide](./setup-a-validator-account) to become a validator.

<details>
<summary><b>Step 3.1) Configure the orchestrator</b></summary>

```bash
mkdir .router-orchestrator
cp network-config/devnet/10001/orchestrator-config.json ~/.router-orchestrator/config.json
cd ~/.router-orchestrator
```

Here is how the `config.json` file will look like:
```json
{
    "chains": [
        {
            "chainId": "80001",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "Mumbai",
            "chainRpc": "",
            "blocksToSearch": 1000,
            "blockTime": "10s"
        },
        {
            "chainId": "43113",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "Fuji",
            "chainRpc": "",
            "blocksToSearch": 1000,
            "blockTime": "10s"
        },
                {
            "chainId": "534353",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "scrollTestnet",
            "chainRpc": "",
            "blocksToSearch": 1000,
            "blockTime": "5s"
        },
        {
            "chainId": "5001",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "mantleTestnet",
            "chainRpc": "",
            "blocksToSearch": 1000,
            "blockTime": "5s"
        },
        {
            "chainId": "421613",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "ArbitrumGoerli",
            "chainRpc": "",
            "blocksToSearch": 1000,
            "blockTime": "10s"
        }
    ],
    "globalConfig": {
        "mQEndpoint": "amqp://guest:guest@localhost",
        "networkType": "testnet",
        "dbPath": "processedblock.db",
        "evmAddress": "",
        "cosmosAddress": "",
        "ethPrivateKey": "",
        "cosmosPrivateKey": "",
        "batchSize": 100,
        "batchWaitTime": 15
    }
}
```

Update the `chainRpc` in the `config.json` file with valid EVM RPC endpoints for all the chains.

Orchestrator also requires access to the validator's Cosmos and Ethereum credentials to sign transactions for the corresponding networks.

### Cosmos Keys

There are two ways to provide the credential access - a keyring with encrypted keys, or just a private key in plaintext.

**1. Cosmos Keyring**

Update the `cosmosPrivateKey` to the validator key name (or account address). Please note that the default keyring backend is a password-encrypted `file` on the disk.

The keyring path must be pointing to `homedir` of the `routerd` node, in case keys needs to be reused from there.

**2. Cosmos Private Key (Unsafe)**

Simply update the `cosmosPrivateKey` with the private key of the validator account.

To obtain the validator's Cosmos private key, run `routerd keys unsafe-export-eth-key $VALIDATOR_KEY_NAME`.

### Ethereum Keys

To provide the credential access, a private key in plaintext needs to be provided.

**Ethereum Private Key (Unsafe)**

Simply update the `ethPrivateKey` with an Ethereum private key from a new account.

</details>

<details>
<summary><b>Step 3.2) Register the Ethereum address</b></summary>

Submit `set-orchestrator-address` tx to Routerchain with **orchestrator-router-address** and **orchestrator-eth-address.** 

This tx will register the orchestrator addresses on Routerchain

```bash
routerd tx attestation set-orchestrator-address [orchestrator-router-address] [orchestrator-eth-address]

Example: routerd tx attestation set-orchestrator-address router1emlu0gy7hju5pywvmkhy529f7s24ydtm49pwcl 0x1E5B81378a1D484169aB9b133FFD97003316e840 --from my-node --home ~/.routerd --keyring-backend file --chain-id router-1  --fees 100000000000000route
```

Successful registration can be verified by checking for Validator's mapped Ethereum address on [list of orchestrators](https://devnet.lcd.routerprotocol.com/router-protocol/router-chain/attestation/list_orchestrators).

</details>

<details>
<summary><b>Step 3.3) Start the Orchestrator</b></summary>

```bash
cd ~/.router-orchestrator
router-orchestrator start --reset --config ~/.router-orchestrator/config.json
```

After executing the aforementioned commands, your orchestrator instance will start running. 

</details>