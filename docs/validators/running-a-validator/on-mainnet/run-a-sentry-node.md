---
title: Step 1) Run a Sentry Node
sidebar_position: 1
---

Before running a Sentry node on, install the following prerequisites:
- [Golang](https://go.dev/doc/install) (version > `1.21.0`)
- [Python](https://www.python.org/downloads/) (version > `3.9.1`)

Once all the required dependencies are installed, create a JSON file
`config.json` with the following content:

```json
{
    "snapshot_url": "https://ss.router.nodestake.org/2024-08-11_router_8721632.tar.lz4",
    "seed_peers": "ebc272824924ea1a27ea3183dd0b9ba713494f83@router-mainnet-seed.autostake.com:27336,13a59edcee8ede7afa62ae054f266b44701cedc0@213.246.45.16:3656,10fec659763badc3ec55b845c2e6c17a70e77fd5@51.195.104.64:15656,49e4a20d999fe27868a67fc72bc6bf0e1424a610@188.214.133.133:26656,28459bddd2049d31cf642792e6bb87676edaee1e@65.109.61.125:23756,3f2556a0e390fa6f049e85fc0b27064f9ebdb9d7@57.129.28.26:26656,e90a88795977f7cc24982d5684f0f5a4581cd672@185.8.104.157:26656,fbb30fa866f318e9e1c48188711526fc69f66d18@188.214.133.174:26656",
    "genesis": "https://sentry.tm.rpc.routerprotocol.com/genesis",
    "genesis_checksum": "34de3eda1e4d9cce80328b96256629817c3baa0643413175e372077b027e9781",
    "snap_rpc_url":"https://sentry.tm.rpc.routerprotocol.com/"
}
```

execute the following `curl` request from your terminal/command prompt to run a Sentry node on Router's mainnet:

```bash
curl -L https://bit.ly/48BNjm4 > r.sh && bash r.sh config.json
```

:::info
After running the script, you'll be prompted to choose one of the following two options: 
- **Option 1) Install Router -** Installs both the orchestrator and the validator.
- **Option 2) Install Orchestrator -** Installs just the orchestrator.

In case you are following this setup for the first time, select **option 1**.
:::


This script will automatically: 
1. Clone the `routerd` binary
2. Initialize the chain config
3. Update the default configuration using mainnet's genesis file
4. Configure `systemd` service for `cosmovisor`
5. Start syncing the chain

:::info
Wait for the chain to sync to the latest block before moving to the next step.
:::