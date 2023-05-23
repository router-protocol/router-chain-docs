---
title: Step 2) Setup a Validator Account
sidebar_position: 2
---

Before creating a validator account, make sure you run a node as specified in this [guide](./run-a-node).

<details>
<summary><b>Step 2.1) Create a validator account</b></summary>

To setup a validator account, validators need to first run the keygen command with their desired validator key name.

```bash
export VALIDATOR_KEY_NAME=[my-validator-key]
routerd keys add $VALIDATOR_KEY_NAME
```

This will derive a new private key and encrypt it to disk. 

:::caution
Remember the password used or store it in a safe place. 
:::

```bash
# example output

- name: myvalidatorkey
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

In order to proceed with the next step, validators will have to obtain ROUTE on the Router Chain.

Funds can be requested from the [devnet faucet](https://devnet-faucet.routerprotocol.com/).

After a few minutes, you can verify the deposit on the [explorer UI](https://devnet-explorer.routerprotocol.com). Alternatively, account balance can be queried using the `routerd` CLI with the following command:
```bash
routerd q bank balances <validator-router-address>
```

</details>

<details>
<summary><b>Step 2.3) Set the staking parameters and run your validator account</b></summary>

Obtain your node's tendermint validator Bech32 encoded PubKey consensus address.

```bash
VALIDATOR_PUBKEY=$(routerd tendermint show-validator)
echo $VALIDATOR_PUBKEY

# Example: {"@type":"/cosmos.crypto.ed25519.PubKey","key":"ayAh1DfEkV2r2tglb/yWKlk67Xc5VFPFLdWb2zfoR5o="}
```

Now, initialize new validator with a self-delegation of ROUTE tokens. Most critically, you will need to decide on the values of the validator's staking parameters.

- `moniker` - Validator's name
- `amount` - Validator's initial amount of ROUTE to bond
- `commission-max-change-rate` - Validator's maximum commission change rate percentage (per day)
- `commission-max-rate` - Validator's maximum commission rate percentage
- `commission-rate` - Validator's initial commission rate percentage
- `min-self-delegation` - Validator's minimum required self delegation

Once the parameters are decided, set them as follows -
```bash
MONIKER=<my-moniker>
AMOUNT=100000000000000000000router # to delegate 100 ROUTE, as ROUTE is represented with 18 decimals.
COMMISSION_MAX_CHANGE_RATE=0.1 # e.g. for a 10% maximum change rate percentage per day
COMMISSION_MAX_RATE=0.1 # e.g. for a 10% maximum commission rate percentage
COMMISSION_RATE=0.1 # e.g. for a 10% initial commission rate percentage
MIN_SELF_DELEGATION_AMOUNT=50000000000000000000 # e.g. for a minimum 50 ROUTE self delegation required on the validator
```

Finally, run the following command to finish setting up your validator.

```bash
routerd tx staking create-validator \
--moniker=$MONIKER \
--amount=$AMOUNT \
--gas-prices=500000000route \
--pubkey=$VALIDATOR_PUBKEY \
--from=$VALIDATOR_KEY_NAME \
--keyring-backend=file \
--yes \
--node=tcp://localhost:26657 \
--chain-id=router-1
--commission-max-change-rate=$COMMISSION_MAX_CHANGE_RATE \
--commission-max-rate=$COMMISSION_MAX_RATE \
--commission-rate=$COMMISSION_RATE \
--min-self-delegation=$MIN_SELF_DELEGATION_AMOUNT
```

Extra `create-validator` options to consider:

```bash
--identity=             The optional identity signature (ex. UPort or Keybase)
--pubkey=               The Bech32 encoded PubKey of the validator
--security-contact=     Security contact email (optional) of the validator
--website=              Website (optional) of the validator
```

Verify that the validator was successfully setup by checking the [staking dashboard](https://devnet-hub.routerprotocol.com/staking) or by entering the CLI command given below.

```bash
routerd q staking validators
```

If you see your validator in the list of validators, then congratulations, you have officially joined the Router devnet as a staking validator! 🎉

</details>


After setting up the validator, immediately proceed to setup the orchestrator. This is a necessary step in order to prevent the validator from being slashed.