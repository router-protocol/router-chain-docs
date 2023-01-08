---
title: Sentry Node on Devnet
sidebar_position: 1
---

## Hardware Specification

Validators should expect to provision one or more data center locations with redundant power, networking, firewalls, HSMs and servers.

The initial miniumum recommended hardware specifications is provided below which might rise as network usage increases.

```jsx
4+ vCPU x64 2.0+ GHz
32+ GB RAM
1TB+ SSD
```

## Steps to run sentry node

<details>
<summary><b>Step 1) Clone routerd binary</b></summary>

```jsx
wget https://github.com/router-protocol/router-chain-releases
unzip linux-amd64.zip
sudo mv routerd /usr/bin
```

</details>

<details>
<summary><b>Step 2) Initialize the chain config</b></summary>

Before actually running the RouterChain node, chain needs to be initialized, and most importantly its genesis file.

```jsx
# The argument <moniker> is the custom username of your node, it should be human-readable.
export MONIKER=<moniker>
# the Router Chain has a chain-id of "router-1"
routerd init $MONIKER --chain-id router-1
```

Running this command will create `routerd` default configuration files at `~/.routerd`.

</details>

<details>
<summary><b>Step 3) Prepare configuration to join devnet</b></summary>

Validators need to update the default configuration with the Devnet's genesis file and application config file, as well as configure their persistent peers with a seed node.

```jsx
git clone https://github.com/router-protocol/network-config

# copy genesis file to config directory
cp network-config/devnet/10001/genesis.json ~/.routerd/config/

# copy config file to config directory
cp network-config/devnet/10001/app.toml  ~/.routerd/config/app.toml
cp network-config/devnet/10001/config.toml ~/.routerd/config/config.toml
```

Validators can also verify the checksum of the genesis checksum - `6df41f6f7ea0a3cfaee966b2e25b3a2585545cb676f633eda3b8ea1bedece902`

```jsx
sha256sum ~/.routerd/config/genesis.json
```

</details>

<details>
<summary><b>Step 4) Configure systemd service for routerd</b></summary>

Edit the config at `/etc/systemd/system/routerd.service`

```jsx
[Unit]
Description=routerd
After=network.target

[Service]
User=ubuntu
Group=ubuntu
Type=simple
ExecStart=/usr/bin/routerd --log-level=debug start

[Install]
```

Starting and restarting the systemd service

```jsx
Starting and restarting the systemd service

sudo systemctl daemon-reload
sudo systemctl restart routerd
sudo systemctl status routerd

# enable start on system boot
sudo systemctl enable routerd

# To check Logs
journalctl -u routerd -f
```

</details>

<details>
<summary><b>Step 5) Start the chain</b></summary>

The chain can now be started and syncing will begin.
```jsx
sudo systemctl stop routerd
sudo systemctl start routerd
```

</details>
