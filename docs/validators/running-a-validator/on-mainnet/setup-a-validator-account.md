---
title: Step 2) Setup a Validator Account
sidebar_position: 2
---

Before creating a validator account, make sure you are running a Sentry node with the chain synced to the latest block as specified in this [step](./run-a-sentry-node). 


### Setup validator

1. Create validator account

   ```bash
   export VALIDATOR_KEY_NAME="my-validator-name"
   routerd keys add $VALIDATOR_KEY_NAME --chain-id router_9600-1 --keyring-backend file
   ```

2. Copy routerd address

   ```bash
   routerd keys show $VALIDATOR_KEY_NAME -a --keyring-backend file
   export VALIDATOR_ADDRESS=<routerd-address>
   ```

3. Fund routerd address with some $ROUTE tokens and check balance

   ```bash
   routerd q bank balances $VALIDATOR_ADDRESS --chain-id router_9600-1 --keyring-backend file
   ```

4. Create validator: Initialize new validator with self delegation of $ROUTE tokens.

   ```bash
      export VALIDATOR_MONIKER="my-validator-moniker"

      routerd tx staking create-validator \
      --amount=1000000000000000000route \
      --pubkey=$(routerd tendermint show-validator) \
      --moniker=$VALIDATOR_MONIKER \
      --chain-id=router_9600-1 \
      --commission-rate="0.10" \
      --commission-max-rate="0.20" \
      --commission-max-change-rate="0.01" \
      --min-self-delegation="1000000" \
      --gas="auto" \
      --fees="100000000000000route" \
      --from=$VALIDATOR_KEY_NAME \
      --gas-adjustment=1.5 \
      --keyring-backend=file
   ```

- `amount` flag is the initial amount of ROUTE you're willing to bond
- `pubkey` is the validator public key created earlier
- `moniker` is the human readable name you choose for your validator
- `chain-id` is the network id of the chain you are working with (in the case of Router mainnet: `router_9600-1`)
- `commission-rate` is the initial commission rate you will charge your delegates 
- `commission-max-rate` is the highest rate you are allowed to charge your delegates
- `commission-max-change-rate` is how much you can increase your commission rate in a 24 hour period
- `min-self-delegation` is the lowest amount of personal funds the validator is required to have in their validator to stay bonded
- `from` flag is the KEY_NAME you created while initializing the key on your keyring

5. Verify validator status

   ```bash
   routerd q staking validator $VALIDATOR_ADDRESS --chain-id router_9600-1 --keyring-backend file
   ```

If you see your validator in the list of validators, then congratulations, you have officially joined the Router mainnet as a staking validator! 🎉


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