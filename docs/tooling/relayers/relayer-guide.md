---
title: Relayer Guide
sidebar_position: 2
---
# Relayer Guide
Steps involved in running a relayer

## Minimum Requirements

- 2-core, x86_64 architecture processor
- 4GB RAM
- 64GB storage

If running many nodes on a single VM, [ensure your open files limit is increased](https://tecadmin.net/increase-open-files-limit-ubuntu/)

## Prerequisites

* Latest go-version https://golang.org/doc/install
* Ensure you have a Router Chain instance running instance running for the environment you want to setup the relayer for. In case you want to run the relayer for your local, follow [this guide](../../router-core/running-router-chain-locally) to setup Router Chain locally.
* Reliable RPCs for supporting networks

## Setup Relayer

### Step 1) Setup configuration for the relayer

In the `root` folder, a sample config file `config.example.json` has been provided.

<details>
<summary><b>Full Config File</b></summary>

```jsx
{
  "global": {  //Global relayer config
    "dbPath": "txq.db",  //Transaction queue database path; default:txq.db
    "environment": "development", //Relayer running environment; default:development
    "watcherTimer": 80, //Watcher service polling time in secs; default:60
    "pollingTimer": 60, //Listener service polling time in secs; default:60
    "reset": "false", //Database reset on start of relayer service; default:false
    "routerRelayerAddress": "RELAYER_ADDRESS", //Relayer router chain address; default:""
    "routerchainEnv": "devnet" //Router Chain connection environment; default:local
  },
  "chains": { //Chain related config 
    "7545": {
      "name": "ganache1", //Chain Name
      "rpc": "RPC_1", // RPC
      "gasLimit": 9000000, 
      "maxGasPrice": 10000000000,
      "key": "PRIVATE_KEY"
    },
    "8545": {
      "name": "ganache2",
      "rpc": "RPC_2",
      "gasLimit": 9000000,
      "maxGasPrice": 10000000000,
      "key": "PRIVATE_KEY"
    },
    "43113":{
      "name": "Fuji",
      "rpc": "RPC_3",
      "gasLimit": 9000000,
      "maxGasPrice": 10000000000,
      "key": "PRIVATE_KEY"
    },
    "80001":{
      "name": "Mumbai",
      "rpc": "RPC_4",
      "gasLimit": 9000000,
      "maxGasPrice": 10000000000,
      "key": "PRIVATE_KEY"
    }
  }
}
```
</details>

#### Understanding global config
```jsx
"global": {  //Global relayer config
  "dbPath": "txq.db",  //Transaction queue database path; default:txq.db
  "environment": "development", //Relayer running environment; default:development
  "watcherTimer": 80, //Watcher service polling time in secs; default:60
  "pollingTimer": 60, //Listener service polling time in secs; default:60
  "reset": "false", //Database reset on start of relayer service; default:false
  "routerRelayerAddress": "RELAYER_ADDRESS", //Relayer router chain address; default:""
  "routerchainEnv": "devnet" //Router Chain connection environment; default:local
}
```
* environment: This is the relayer running environment; specifies the verbosity for the relayer; accepted values - `development` or `production`.
* watcherTimer: Watcher is a service for monitoring Transaction Queue DB. watcherTimer determines the polling interval for service in seconds.
* pollingTimer: Polling Timer is for listening interval for transaction from Router Chain
* reset: Reset is for resetting Transaction Queue DB, if `true` it will reset, if `false` in will not reset.
* routerchainEnv:  routerchainEnv is router chain instance to connect with, it connects with network's gRPC and chainID; accepted values - `testnet` or `devnet` or `local-docker`

#### Understanding chain config
```jsx
chains:[{
  "chainId": {
  "name": "ganache1", //Chain Name
  "rpc": "RPC_1", // RPC
  "gasLimit": 9000000, 
  "maxGasPrice": 10000000000,
  "key": "PRIVATE_KEY"
}]
```
Chains config section defines parameters for each supported chain by the relayer. You can follow the same structure as given in the example and provide name, rpc, gasLimit, maxGasPrice and private key for chains you want to support.
:::tip
1. Make sure that the chains mentioned in the config are supported by Router Chain. Chains not supported will be ignored.
2. Ensure the wallet has funds in the respective native tokens of all the supported chains in order to pay the fees required to relay.
:::

### Step 2) Run the relayer

<details>
<summary><b>Run Directly</b></summary>

1. Clone the [following repo](https://github.com/router-protocol/router-relayer.git)
  ```jsx
  git clone https://github.com/router-protocol/router-relayer.git
  ```
2. Use the above mentioned details and create your config file and paste it to `example/cfg/config.json`
3. Run the relayer
  ```jsx
  cd router-relayer
  cd example
  go run main.go
  ```

</details>

<details>
<summary><b>Run by building binary</b></summary>

1. Clone the [following repo](https://github.com/router-protocol/router-relayer.git)
  ```jsx
  git clone https://github.com/router-protocol/router-relayer.git
  ```
2. Build the binary
  ```jsx
  cd router-relayer
  make build
  ```
  This will create a binary named router-relayer in GOPATH.
3. Use the above mentioned details and create your config file
3. Run the relayer
  ```jsx
  router-relayer $PATH/to/config.json
  ```

</details>

:::caution
Do not use your relaying-addresses for anything else because it will lead to account nonce sequence errors.
:::
