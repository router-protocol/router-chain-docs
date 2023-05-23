---
title: Step 2) Setup a Validator Account
sidebar_position: 2
---

Before creating a validator account, make sure you are running a node with the chain synced to the latest block as specified in this [step](./run-a-node). 

<details>
<summary><b>Step 2.1) Create a validator account</b></summary>

To setup a validator account, run the following command with your desired validator key name.

```bash
routerd keys add my-validator-key --chain-id router_9601-1 --keyring-backend file
```

The aforementioned command will create a new wallet with name `my-validator-key` and will ask you to set a password. 

:::caution
Remember the password used or store it in a safe place. 
:::

```bash
# example output

- name: my-validator-key
  type: local
  address: router13cyxzsfvmfxsn23spl4nhu0xn307uvj2vju5q0
  pubkey: '{"@type":"/routerprotocol.routerchain.crypto.ethsecp256k1.PubKey",
  mnemonic: ""
  
**Important** write this mnemonic phrase in a safe place.
It is the only way to recover your account if you ever forget your password.

usual husband better echo deputy same depart river ritual detail reveal window moon few health remember fortune awful custom fossil tired lake jealous sign
```
:::tip
The mnemonic phrase is better backed up on a physical paper, storing it in cloud storage may compromise the validator later.
:::

:::tip
Remember the address starting from `router`, this is the address of your Router chain validator account.
:::

</details>

<details>
<summary><b>Step 2.2) Obtain ROUTE tokens</b></summary>

Obtain ROUTE tokens on the Router chain from the [testnet faucet](https://faucet.testnet.routerchain.dev/).

After a few minutes, you can verify the deposit on the [explorer UI](https://explorer.testnet.routerprotocol.com). Alternatively, account balance can be queried using the `routerd` CLI with the following command:

```bash
routerd query bank balances $(routerd keys show my-validator-key -a --keyring-backend file) --chain-id router_9601-1 --keyring-backend file
```

</details>

<details>
<summary><b>Step 2.3) Set the staking parameters and run your validator account</b></summary>

Now, initialize a new validator with a self-delegation of ROUTE tokens. Most critically, you will need to decide on the values of the validator's staking parameters.

```bash
routerd tx staking create-validator \
  --amount=100000000000000000000route \
  --pubkey=$(routerd tendermint show-validator) \
  --moniker=val-node1 \
  --chain-id=router_9601-1 \
  --commission-rate="0.10" \
  --commission-max-rate="0.20" \
  --commission-max-change-rate="0.01" \
  --min-self-delegation="1000000" \
  --gas="auto" \
  --fees="100000000000000route" \
  --from=my-validator-key \
  --gas-adjustment=1.5 \
  --keyring-backend=file
```

- `amount` flag is the initial amount of ROUTE you're willing to bond
- `pubkey` is the validator public key created earlier
- `moniker` is the human readable name you choose for your validator
- `chain-id` is the network id of the chain you are working with (in the case of Router testnet: `router_9601-1`)
- `commission-rate` is the initial commission rate you will charge your delegates 
- `commission-max-rate` is the highest rate you are allowed to charge your delegates
- `commission-max-change-rate` is how much you can increase your commission rate in a 24 hour period
- `min-self-delegation` is the lowest amount of personal funds the validator is required to have in their validator to stay bonded
- `from` flag is the KEY_NAME you created while initializing the key on your keyring

Verify that the validator was successfully setup by checking the [staking dashboard](https://hub.testnet.routerchain.dev/staking) or by entering the CLI command given below.

```bash
routerd query staking validator $(routerd keys show my-validator-key -a --keyring-backend file) --chain-id router_9601-1 --keyring-backend file
```

If you see your validator in the list of validators, then congratulations, you have officially joined the Router testnet as a staking validator! 🎉

</details>

After setting up the validator, immediately proceed to setup the orchestrator. This is a necessary step in order to prevent the validator from being slashed.