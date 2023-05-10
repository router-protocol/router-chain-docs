---
title: Step 1) Run a Sentry Node
sidebar_position: 1
---

<details>
<summary><b>Step 1.1) Clone routerd binary</b></summary>

```bash
wget https://github.com/router-protocol/router-chain-releases
unzip linux-amd64.zip
sudo mv routerd /usr/bin
```

</details>

<details>
<summary><b>Step 1.2) Initialize the chain config</b></summary>

Before running the RouterChain node, it is very important to initialize the chain.

```bash
# the argument <moniker> is the custom username of your node, it should be human-readable.
export MONIKER=<moniker>
# the Router devnet has a chain-id of "router_9000-1"
routerd init $MONIKER --chain-id router_9000-1
```

Running the aforementioned commands will create `routerd` default configuration files at `~/.routerd`.

</details>

<details>
<summary><b>Step 1.3) Prepare configuration to join the devnet</b></summary>

Validators need to update the default configuration using devnet's genesis file and application config file, as well as configure their persistent peers with a seed node.

```bash
git clone https://github.com/router-protocol/network-config

# copy genesis file to config directory
cp network-config/devnet/10001/genesis.json ~/.routerd/config/

# copy config file to config directory
cp network-config/devnet/10001/app.toml  ~/.routerd/config/app.toml
cp network-config/devnet/10001/config.toml ~/.routerd/config/config.toml
```

Validators can also verify the checksum of the genesis file - `6df41f6f7ea0a3cfaee966b2e25b3a2585545cb676f633eda3b8ea1bedece902`

```bash
sha256sum ~/.routerd/config/genesis.json
```

</details>

<details>
<summary><b>Step 1.4) Configure systemd service for routerd</b></summary>

Edit the config at `/etc/systemd/system/routerd.service`

```bash
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

After making these edits, restart the systemd service:

```bash
# restarting the systemd service
sudo systemctl daemon-reload
sudo systemctl restart routerd
sudo systemctl status routerd

# enable start on system boot
sudo systemctl enable routerd

# to check Logs
journalctl -u routerd -f
```

</details>

<details>
<summary><b>Step 1.5) Start the chain</b></summary>

```bash
sudo systemctl stop routerd
sudo systemctl start routerd
```
After executing these commands, syncing will begin.
</details>
