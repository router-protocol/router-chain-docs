---
title: Step 3) Configure and Run an Orchestrator Instance
sidebar_position: 2
---

After setting up the validator, immediately proceed to setup the orchestrator. This is a necessary step in order to prevent the validator from being slashed.


### Setup Orchestrator

1. Create orchestrator account

   ```bash
   export ORCHESTRATOR_KEY_NAME="my-orchestrator-name"
   routerd keys add $ORCHESTRATOR_KEY_NAME --chain-id router_9600-1 --keyring-backend file
   ```

   get Orchestrator address

   ```bash
   routerd keys show $ORCHESTRATOR_KEY_NAME -a --keyring-backend file
   export ORCHESTRATOR_ADDRESS=<routerd-address>
   ```

2. Get funds to orchestrator account, check balance after getting funds

   ```bash
   routerd q bank balances $ORCHESTRATOR_ADDRESS --chain-id router_9600-1 --keyring-backend file
   ```

3. Map orchestrator address to validator address.

   `EVM-KEY-FOR-SIGNING-TXNS` is the public ethereum address. You can create one in Metamask, it doesnt need to have funds. We use it to sign transactions on EVM chains. Make sure to save the private key of this address somewhere safe.

   ```bash
   export EVM_ADDRESS_FOR_SIGNING_TXNS=<EVM-ADDRESS-FOR-SIGNING-TXNS>
   routerd tx attestation set-orchestrator-address $ORCHESTRATOR_ADDRESS $EVM_ADDRESS_FOR_SIGNING_TXNS --from my-validator-key \
   --chain-id router_9600-1 \
   --fees 1000000000000000route \
   --keyring-backend file
   ```

### Add config.json for Orchestrator

   ```json
      {
         "chains": [
            {
               "chainId": "137",
               "chainType": "CHAIN_TYPE_EVM",
               "chainName": "Polygon",
               "chainRpc": "www.polygon-rpc.com",
               "blocksToSearch": 1000,
               "blockTime": "5s"
            }
         ],
         "globalConfig": {
            "logLevel": "debug",
            "networkType": "mainnet",
            "dbPath": "orchestrator.db",
            "batchSize": 25,
            "batchWaitTime": 4,
            "routerChainTmRpc": "http://0.0.0.0:26657",
            "routerChainGRpc": "tcp://0.0.0.0:9090",
            "evmAddress": "",
            "cosmosAddress": "",
            "ethPrivateKey": "",
            "cosmosPrivateKey": ""
         }
      }
   ```

- `routerChainTmRpc` and `routerChainGRpc`, point it to your validator IP
- `cosmosAddress` is Router address of orchestrator // router5678abcd
- `cosmosPrivateKey` is private key for your orchestrator cosmos address (private key of above `cosmosAddress`)
- `evmAddress` is EVM address of orchestrator which created in above step in Metamask //0x1234abcd
- `ethPrivateKey` is private key for the the above `evmAddress` wallet you created
- `loglevel` currently kept it as "debug" can be set as "info" evmAddress is EVM address of orchestrator //0x1234abcd

### Start Validator and Orchestrator

1. Start validator

   ```bash
   sudo systemctl start cosmovisor.service
   sudo systemctl status cosmovisor.service

   # check logs
   journalctl -u cosmovisor -f
   ```

2. Start orchestrator

   ```bash
   sudo systemctl start orchestrator.service
   sudo systemctl status orchestrator.service

   # check logs
   journalctl -u orchestrator -f
   ```

### Check validator and orchestrator status

1. Check if node is syncing, make sure it is not stuck at some block height

   ```bash
   routerd status | jq .SyncInfo.latest_block_height
   ```

2. Check if orchestrator health is ok

   ```bash
   curl localhost:8001/health
   ```