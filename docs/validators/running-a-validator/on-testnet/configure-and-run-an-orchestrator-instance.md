---
title: Step 3) Configure and Run an Orchestrator Instance
sidebar_position: 3
---
If you have followed the preceeding steps properly, you should already see an orchestrator config created at `~/.router-orchestrator/config.json`. Here is how the `config.json` file will look like:
```json
{
    "chains": [
	            {
      "chainId": "2494104990",
      "chainType": " CHAIN_TYPE_EVM",
      "chainName": "shasta-testnet",
      "chainRpc": "grpc.shasta.trongrid.io:50051",
      "chainApi": "https://api.shasta.trongrid.io",
      "blocksToSearch": 1000,
      "blockTime": "3s"
    },
             {
            "chainId": "5",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "Goerli",
            "chainRpc": "https://rpc.ankr.com/eth_goerli",
            "blocksToSearch": 1000,
	    "confirmationsRequired": 5,
            "blockTime": "60s"
        },
        {
            "chainId": "80001",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "Mumbai",
            "chainRpc": "https://rpc.ankr.com/polygon_mumbai",
            "blocksToSearch": 1000,
            "blockTime": "10s"
        },
        {
            "chainId": "43113",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "Fuji",
            "chainRpc": "https://rpc.ankr.com/avalanche_fuji",
            "blocksToSearch": 1000,
            "blockTime": "10s"
        },
                {
            "chainId": "534353",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "scrollTestnet",
            "chainRpc": "https://rpc.ankr.com/scroll_testnet",
            "blocksToSearch": 1000,
	    "confirmationsRequired": 5,
            "blockTime": "5s"
        },
        {
            "chainId": "5001",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "mantleTestnet",
            "chainRpc": "https://rpc.ankr.com/mantle_testnet",
            "blocksToSearch": 500,
	    "confirmationsRequired": 5,
            "blockTime": "5s"
        },
        {
            "chainId": "421613",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "ArbitrumGoerli",
            "chainRpc": "https://goerli-rollup.arbitrum.io/rpc",
            "blocksToSearch": 1000,
	    "confirmationsRequired": 10,
            "blockTime": "5s"
	    },
	    {
            "chainId": "59140",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "lineaTestnet",
            "chainRpc": "https://rpc.goerli.linea.build",
            "blocksToSearch": 500,
             "confirmationsRequired": 5,
            "blockTime": "5s"
            },
	   {
            "chainId": "near-testnet",
           "chainType": "CHAIN_TYPE_NEAR",
            "chainName": "near-testnet",
            "chainRpc": "https://rpc.testnet.near.org",
            "blocksToSearch": 1,
            "blockTime": "2s"
        }
    ],
    "globalConfig": {
        "networkType": "local",
        "dbPath": "orchestrator.db",
        "routerChainTmRpc": "", //optional
        "routerChainGRpc":"", //optional
        "evmAddress": "",
        "cosmosAddress": "",
        "ethPrivateKey": "",
        "cosmosPrivateKey": "",
        "batchSize": 20,
        "batchWaitTime": 3
    }
}
```
:::note
We have added all the supported chain. In above example we have added public RPCs, feel free to update it.
:::
<details>

### Connection with Router-chain

To connect with router chain you can keep `networkType` as testnet, or if you are running your own node you can keep it as `local`. 
If you need to customize the tmRpc or gRpc settings, you can specify the `routerChainTmRpc` and `routerChainGRpc` options. In this scenario, you should also specify the `networkType` as either "local" or "testnet" so that it can determine the chain ID from there.

</details>
Now, let's configure and run an orchestrator instance.
<!-- Before proceeding with this step, make sure that you are running a validator. If note, follow [this guide](./setup-a-validator-account) to become a validator. -->

<details>
<summary><b>Step 3.1) Create a new wallet for the orchestrator</b></summary>

```bash
routerd keys add my-orchestrator-key --chain-id router_9601-1 --keyring-backend file
```

The aforementioned command will create a new wallet with name `my-orchestrator-key` and will ask you to set a password. 

:::caution
Remember the password used or store it in a safe place. 
:::

```bash
# example output

- name: my-orchestrator-key
  type: local
  address: router13cffzsfgjklfq17poq2ifm0xn426ing3bqk5q1
  pubkey: '{"@type":"/routerprotocol.routerchain.crypto.ethsecp256k1.PubKey",
  mnemonic: ""
  
**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

chocolate wife later depart same window health ocean happy dog formula pen sun retail tank ship board awesome couch laptop city bottle curtain bowl
```
:::tip
The mnemonic phrase is better backed up on a physical paper, storing it in cloud storage may compromise the validator later.
:::

:::tip
Remember the address starting from `router`, this is the address of your Router chain orchestrator account.
:::


</details>

<details>
<summary><b>Step 3.2) Obtain ROUTE token</b></summary>

Now, add funds to your orchestrator wallet as it will be used to pay for the gas fees:

```bash
routerd tx bank send <validator-node-key-name> $(routerd keys show my-orchestrator-key -a --keyring-backend file) 1000000000000000000route --from my-validator-key --chain-id router_9601-1 --fees 1000000000000000route --keyring-backend  file
```

After a few minutes, you can verify the deposit by querying the account balance using the following command:
```bash
routerd query bank balances $(routerd keys show my-orchestrator-key -a --keyring-backend file) --chain-id router_9601-1 --keyring-backend file
```

</details>

<details>
<summary><b>Step 3.3) Configure the orchestrator keys</b></summary>

Add the relevant keys in `.router-orchestrator/config.json`:

```json
{
    "chains": [
        {
            "chainId": "<CHAIN_ID>",
            "chainType": "<CHAIN_TYPE>",
            "chainName": "<CHAIN_NAME>",
            "chainRpc": "<CHAIN_RPC>",
            "blocksToSearch": 1000,
            "blockTime": "10s"
        }
    ],
    "globalConfig": {
        "networkType": "<NETWORK_TYPE>",
        "dbPath": "processedblock.db",
        "ethPrivateKey": "<ETH_PRIVATE_KEY>",
        "cosmosPrivateKey": "<COSMOS_PRIVATE_KEY>",
        "batchSize": 100,
        "batchWaitTime": 20
    }
}
```

- `chains` is an array of objects including info about all the chains you want to listen to as an orchestrator. This needs to be done only for external chains i.e. Router chain will not be part of the orchestrator chains config. For each chain, you need to provide:
    - `chainId` - the chain id of the network
    - `chainType` - the type of chain, possible values are:
        `CHAIN_TYPE_EVM`,
        `CHAIN_TYPE_COSMOS`,
        `CHAIN_TYPE_POLKADOT`,
        `CHAIN_TYPE_SOLANA`,
        `CHAIN_TYPE_NEAR`
    - `chainName` - the name of the chain
    - `chainRpc` - the RPC endpoint of the chain


- `globalConfig` includes global configuration details like:
    - `NETWORK_TYPE` - `testnet`
    - `ETH_PRIVATE_KEY` - create a new account on metamask, you can use the private key of this wallet (not necessary to have have funds in this wallet, it will be used just for signing messages)
    - `COSMOS_PRIVATE_KEY` - the private key of the wallet you created for the orchestrator


To obtain the orchestrator's `COSMOS_PRIVATE_KEY`, run 
```bash
routerd keys unsafe-export-eth-key my-orchestrator-key --keyring-backend file
```

### For Listening to NEAR Transactions

To access the data provided by [NEAR Lake](/tools/realtime#near-lake-indexer) you need to provide valid AWS credentials in order to be charged by the AWS for the S3 usage.

:::info AWS-cli
We will require AWS CLI to access to query S3. If you don't have AWS CLI, please follow these steps. [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
:::

### AWS S3 Credentials
To be able to get objects from the AWS S3 bucket you need to provide the AWS credentials.
AWS default profile configuration with aws configure looks similar to the following:
```
~/.aws/credentials
```
```
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
[AWS docs: Configuration and credential file settings](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-files.html)

#### Environment variables
Alternatively, you can provide your AWS credentials via environment variables with constant names:
```
$ export AWS_ACCESS_KEY_ID=AKIAIOSFODNN7EXAMPLE
$ AWS_SECRET_ACCESS_KEY=wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
$ AWS_DEFAULT_REGION=eu-central-1
```


Sample `.router-orchestrator/config.json`:
```json
{
    "chains": [
        {
            "chainId": "80001",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "Mumbai",
            "chainRpc": "<RPC_URL>",
            "blocksToSearch": 1000,
            "blockTime": "10s"
        },
        {
            "chainId": "43113",
            "chainType": " CHAIN_TYPE_EVM",
            "chainName": "Fuji",
            "chainRpc": "<RPC_URL>",
            "blocksToSearch": 1000,
            "blockTime": "10s"
        },
        {
            "chainId": "nearTestnet",
            "chainType": " CHAIN_TYPE_NEAR",
            "chainName": "nearTestnet",
            "chainRpc": "<RPC_URL>",
            "blocksToSearch": 1000,
            "blockTime": "2s"
        }
    ],
    "globalConfig": {
        "mQEndpoint": "amqp://guest:guest@localhost",
        "networkType": "testnet",
        "dbPath": "processedblock.db",
        "ethPrivateKey": "<PRIVATE_KEY>",
        "cosmosPrivateKey": "<PRIVATE_KEY>",
        "batchSize": 100,
        "batchWaitTime": 20
    }
}
```

</details>


<details>
<summary><b>Step 3.4) Map the orchestrator with your validator</b></summary>

Every orchestrator needs to be mapped with a validator. This is done by sending a transaction on the chain to map an orchestrator with a validator.

```bash
routerd tx attestation set-orchestrator-address $(routerd keys show my-orchestrator-key -a --keyring-backend file) <EVM-ADDRESS-FOR-SIGNING-TXNS> --from my-validator-key --chain-id router_9601-1 --fees 1000000000000000route --keyring-backend file
```

`EVM-KEY-FOR-SIGNING-TXNS` is the public address corresponding to the `ETH_PRIVATE_KEY` used in the orchestrator config in the previous step.

</details>

<details>
<summary><b>Step 3.5) Start the orchestrator and validator</b></summary>

```bash
sudo systemctl daemon-reload
sudo systemctl restart cosmovisor.service
sudo systemctl restart orchestrator.service
```

After executing the aforementioned commands, your orchestrator instance will start running. You can query the orchestrator's health checkpoint using the command given below to see if everything is working fine:

```bash
curl localhost:8001/health
```

In case your health check is not working or you face any issue, you can check the orchestrator and validator logs using the following commands:

```bash
sudo journalctl -u orchestrator.service -f
sudo journalctl -u cosmovisor.service -f
```

</details>

<details>
<summary><b>Step 3.6) Check the health of orchestrator and validator</b></summary>

```bash
validator_health.sh $(routerd keys show <validator-node-key-name> -a --keyring-backend file --bech=val)
```

</details>
