---
title: Step 1) Run a Sentry Node
sidebar_position: 1
---

To run a sentry node on the testnet, simply run [this python script](https://github.com/router-protocol/routerchain-devops/blob/update_for_orchestrator/deploy/setup/multinode/validator_onboard.py). Before running the script, ensure that you have a python version > `3.9.x`. If not, download python from their [official website](https://www.python.org/downloads/). Before running the script, you'll also have to ensure that you have installed all the required modules and libraries. 

Once all the required dependencies are installed, download the script and run it using the following command:

```bash
python3 validator_onboard.py
```

:::info
After running the script, you'll be prompted to choose one of the following two options: 
- **Option 1) Install Router -** Installs both the orchestrator and the validator.
- **Option 2) Install Orchestrator -** Installs just the orchestrator.

In case you are following this setup for the first time, select **option 1**.
:::


This script will automatically: 
1. Clone the routerd binary
2. Initialize the chain config
3. Update the default configuration using testnet's genesis file
4. Configure systemd service for routerd
5. Start syncing the chain

