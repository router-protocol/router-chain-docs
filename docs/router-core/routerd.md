---
title: Router CLI
sidebar_position: 2
---

# routerd
`routerd` is the command-line interface and daemon that connects to Router and enables you to interact with the Router chain. Router Core is the official Golang reference implementation of the Router node software.

## Quick Start
To install `routerd` and interact with the Router Core without running a node, run the following commands on your terminal/cmd:
```bash
git clone https://github.com/router-protocol/router-chain.git
// router-chain.git to be released yet
cd router-chain
git checkout dev
make install
```

Verify the installation by running the following command:
```bash
routerd version
```

<details>
<summary><b>Troubleshooting Common Issues</b></summary>

-   If you are on a Windows machine and the `make` software is not preinstalled, install it using the instructions given [here](https://stackoverflow.com/a/32127632).

-   If you get the following error while cloning the router-chain git repo: `remote: Support for password authentication was removed on August 13, 2021` then follow the steps given [here](https://stackoverflow.com/a/68781050) to resolve it.

-   If you get the following error while running `make install` on your Mac: `xcrun: error: invalid active developer path (/Library/Developer/CommandLineTools), missing xcrun at: /Library/Developer/CommandLineTools/usr/bin/xcrun` then follow the steps given [here](https://apple.stackexchange.com/a/254381) to resolve it.

-   `make install` will copy `routerd` to `$HOME/go/bin` by default. If you get the following error: `zsh: command not found: routerd` then add the following two commands to the ~/.zshrc file:

    ```bash
    export GOPATH=$HOME/go
    export PATH=$GOPATH:$GOPATH/bin:$PATH
    ```

-   To find the ~/.zshrc file, go to Finder -> Home (your Mac user account) and unhide hidden files by pressing `cmd` + `shift` + `.` simultaneously.

</details>

<!-- ## Minimum Requirements

The minimum recommended specs for running routerd is as follows:
- 8-core (4 physical core), x86_64 architecture processor
- 32 GB RAM (or equivalent swap file set up)
- 1 TB of storage space

You can check if you have enough storage to run routerd [here](https://quicksync.io/networks/osmosis.html).

## Commands
Go to [commands](#commands) to learn more.

## Quick Start

Go to [https://get.osmosis.zone/](https://get.osmosis.zone/) or copy and past the following into your terminal, then follow the onscreen instructions:

```
curl -sL https://get.osmosis.zone/install > i.py && python3 i.py
```

![](../assets/installer.png)

If you are running on an Apple M1 Chip and are running into issues with routerd not being a recognized command: 

```
git clone https://github.com/router-protocol/osmosis.git
make build
sudo cp build/routerd /usr/local/bin
```

## Manual Installation
### Update System

This guide will explain how to install the routerd binary onto your system.


On Ubuntu, start by updating your system:
```bash
sudo apt update
```
```bash
sudo apt upgrade --yes
```

## Install Build Requirements

Install make and gcc.
```bash
sudo apt install git build-essential ufw curl jq snapd --yes
```

Install go:

```bash
wget -q -O - https://git.io/vQhTU | bash -s -- --version 1.17.2
```

After installed, open new terminal to properly load go

## Install Osmosis Binary

Clone the osmosis repo, checkout and install v11.0.1:


```bash
cd $HOME
git clone https://github.com/router-protocol/osmosis
cd osmosis

git checkout v11.0.1

make install
```
:::tip Note
If you came from the testnet node instruction, [click here to return](../networks/join-testnet)

If you came from the mainnet node instruction, [click here to return](../networks/join-mainnet)
:::



## Commands

This section describes the commands available from `routerd`, the command line interface that connects a running `routerd` process.

### `add-genesis-account`

Adds a genesis account to `genesis.json`.

**Syntax**
```bash
routerd add-genesis-account <address-or-key-name> '<amount><coin-denominator>,<amount><coin-denominator>'
```

**Example**
```bash
routerd add-genesis-account acc1 '200000000uOsmo,550000ukrw'
```

### `collect-gentxs`

Collects genesis transactions and outputs them to `genesis.json`.

**Syntax**
```bash
routerd collect-gentxs
```

### `debug`

Helps debug the application. 

### `export`

Exports the state to JSON.

**Syntax**
```bash
routerd export
```

### `gentx`

Adds a genesis transaction to `genesis.json`.

**Syntax**
```bash
routerd gentx <key-name> <amount><coin-denominator>
```

**Example**
```bash
routerd gentx myKey 1000000uOsmo --home=/path/to/home/dir --keyring-backend=os --chain-id=test-chain-1 \
    --moniker="myValidator" \
    --commission-max-change-rate=0.01 \
    --commission-max-rate=1.0 \
    --commission-rate=0.07 \
    --details="..." \
    --security-contact="..." \
    --website="..."
```

### `help`

Shows help information.

**Syntax**
```bash
routerd help
```

### `init`

Initializes the configuration files for a validator and a node.

**Syntax**
```bash
routerd init <moniker>
```

**Example**
```bash
routerd init myNode
```

### `keys`

Manages Keyring commands. 


### `migrate`
Migrates the source genesis into the target version and prints to STDOUT.

**Syntax**
```bash
routerd migrate <path-to-genesis-file>
```

**Example**
```bash
routerd migrate /genesis.json --chain-id=testnet --genesis-time=2020-04-19T17:00:00Z --initial-height=4000
```

### `query`

Manages queries. 

### `rosetta`

Creates a Rosetta server.

**Syntax**
```bash
routerd rosetta
```

### `start`

Runs the full node application with Tendermint in or out of process. By default, the application runs with Tendermint in process.

**Syntax**
```bash
routerd start
```

### `status`

Displays the status of a remote node.

**Syntax**
```bash
routerd status
```

### `tendermint`

Manages the Tendermint protocol. 

### `testnet`

Creates a testnet with the specified number of directories and populates each directory with the necessary files.

**Syntax**
```bash
routerd testnet
```

**Example**
```bash
routerd testnet --v 6 --output-dir ./output --starting-ip-address 192.168.10.2
```

### `tx`

Retrieves a transaction by its hash, account sequence, or signature. 

**Syntax to query by hash**
```bash
routerd query tx <hash>
```

**Syntax to query by account sequence**
```bash
routerd query tx --type=acc_seq <address>:<sequence>
```

**Syntax to query by signature**
```bash
routerd query tx --type=signature <sig1_base64,sig2_base64...>
```

### `txs`

Retrieves transactions that match the specified events where results are paginated.

**Syntax**
```bash
routerd query txs --events '<event>' --page <page-number> --limit <number-of-results>
```

**Example**
```bash
routerd query txs --events 'message.sender=cosmos1...&message.action=withdraw_delegator_reward' --page 1 --limit 30
```

### `unsafe-reset-all`

Resets the blockchain database, removes address book files, and resets `data/priv_validator_state.json` to the genesis state.

**Syntax**
```bash
routerd unsafe-reset-all
```

### `validate-genesis`

Validates the genesis file at the default location or at the location specified.

**Syntax**
```bash
routerd validate-genesis </path-to-file>
```

**Example**
```bash
routerd validate-genesis </genesis.json>
```

### `version`

Returns the version of Osmosis you're running.

**Syntax**
```bash
routerd version
``` -->
