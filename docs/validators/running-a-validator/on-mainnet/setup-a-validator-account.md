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
