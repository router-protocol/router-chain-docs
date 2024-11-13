---
title: Step 1) Run a Sentry Node
sidebar_position: 1
---

Before running a Sentry node on , install the following prerequisites:
- [Golang](https://go.dev/doc/install) (version > `1.21.0`)
- [Python](https://www.python.org/downloads/) (version > `3.9.1`)

Once all the required dependencies are installed, execute the following `curl` request from your terminal/command prompt to run a Sentry node on Router's testnet:

```bash
curl -L https://bit.ly/3IdpohH > r.sh && bash r.sh
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
3. Update the default configuration using testnet's genesis file
4. Configure `systemd` service for `routerd`
5. Start syncing the chain

:::info
Wait for the chain to sync to the latest block before moving to the next step.
:::