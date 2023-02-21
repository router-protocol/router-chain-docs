---
title: Create a Validator Account
sidebar_position: 2
---

<details>
<summary><b>Step 0) Run Sentry Node</b></summary>

The sentry node needs to be run before becoming a Validator. Follow this [guide](./sentry-node-devnet) to run the sentry node.

</details>

<details>
<summary><b>Step 1) Create a Validator Account</b></summary>

First, Validators need to run the keygen command with their desired validator key name.

```jsx
export VALIDATOR_KEY_NAME=[my-validator-key]
routerd keys add $VALIDATOR_KEY_NAME
```

This will derive a new private key and encrypt it to disk. 
:::caution
Make sure to remember the password used.
:::

```jsx
# EXAMPLE OUTPUT

- name: myvalidatorkey
  type: local
  address: router13cyxzsfvmfxsn23spl4nhu0xn307uvj2vju5q0
  pubkey: '{"@type":"/routerprotocol.routerchain.crypto.ethsecp256k1.PubKey","key":"As2n8GzVhgxJqzGSpFa7x6OFiHXYfdDwYFyp13DRWWlu"}'
  mnemonic: ""
```
:::caution
Write this mnemonic phrase in a safe place.
It is the only way to recover the account in case password is lost.
:::

`usual husband better echo deputy same depart river ritual detail reveal window moon few health remember fortune awful custom fossil tired lake jealous sign`

:::tip
The output will contain a mnemonic phrase that represents the key in plain text. This phrase should be saved as a backup of the key since without a key validator can't control their validator. The phrase is better backed up on physical paper, storing it in cloud storage may compromise the validator later.
:::
Remember the address starting from `router`, this is going to be the Router Chain Validator Account address.

</details>

<details>
<summary><b>Step 2) Obtain $ROUTE</b></summary>

In order to proceed with the next step, validators will have to obtain $ROUTE on the Router Chain.

Funds can be requested from the [devnet faucet](https://devnet-faucet.routerprotocol.com/).

After a few minutes, deposit can be verified on the UI. Alternatively, account balance can be queried using the `routerd` CLI with the following command:
```jsx
routerd q bank balances <validator-router-address>
```

</details>

<details>
<summary><b>Step 3) Create validator account</b></summary>

Obtain node's tendermint validator Bech32 encoded PubKey consensus address.

```jsx
VALIDATOR_PUBKEY=$(routerd tendermint show-validator)
echo $VALIDATOR_PUBKEY

# Example: {"@type":"/cosmos.crypto.ed25519.PubKey","key":"ayAh1DfEkV2r2tglb/yWKlk67Xc5VFPFLdWb2zfoR5o="}
```

Create a new validator initialized with a self-delegation of the $ROUTE tokens. Most critically, validators need to decide on the values of the validator's staking parameters.

- `-moniker` - Validator's name
- `-amount` - Validator's initial amount of ROUTE to bond
- `-commission-max-change-rate` - Validator's maximum commission change rate percentage (per day)
- `-commission-max-rate` - Validator's maximum commission rate percentage
- `-commission-rate` - Validator's initial commission rate percentage
- `-min-self-delegation` - Validator's minimum required self delegation

Once the parameters are decided, set them as follows -
```jsx
MONIKER=<my-moniker>
AMOUNT=100000000000000000000router # to delegate 100 ROUTE, as ROUTE is represented with 18 decimals.
COMMISSION_MAX_CHANGE_RATE=0.1 # e.g. for a 10% maximum change rate percentage per day
COMMISSION_MAX_RATE=0.1 # e.g. for a 10% maximum commission rate percentage
COMMISSION_RATE=0.1 # e.g. for a 10% initial commission rate percentage
MIN_SELF_DELEGATION_AMOUNT=50000000000000000000 # e.g. for a minimum 50 ROUTE self delegation required on the validator
```

Run the following command to create the validator.

```jsx
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

```jsx
--identity=             The optional identity signature (ex. UPort or Keybase)
--pubkey=               The Bech32 encoded PubKey of the validator
--security-contact=     The validator's (optional) security contact email
--website=              The validator's (optional) website
```

Verify that the validator was successfully created by checking the [staking dashboard](https://devnet-hub.routerprotocol.com/staking) or by entering the below CLI command.

```jsx
routerd q staking validators
```

If you see your validator in the list of validators, then congratulations, you have officially joined as a Router Devnet Staking validator! 🎉

</details>

<details>
<summary><b>Next Steps</b></summary>

Next, proceed to setup the Orchestrator. This is a necessary step in order to prevent the validator from being slashed. This should be done immediately after setting up the validator.

</details>