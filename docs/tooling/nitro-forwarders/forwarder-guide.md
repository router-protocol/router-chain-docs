---
title: Forwarder Guide
sidebar_position: 2
---
# Relayer Guide
Steps involved in running a forwarder

## Minimum Requirements

- 4-core, x86_64 architecture processor
- 8GB RAM
- 64GB storage



## Setup Forwarder

### Step 1) Setup a forwarder service

Create the following file under `vim/lib/systemd/system/forwarder.service`

```shell
Description=forwarder
After=network.target

[Service]
User={USER}
Type=simple
WorkingDirectory=/root/.forwarder
ExecStart=/usr/bin/voyager-forwarder start --reset --config /root/.forwarder/config.json
Restart=on-failure
RestartSec=10s
StartLimitInterval=90s
StartLimitBurst=3
StartLimitAction=none

[Install]
WantedBy=multi-user.target
```

### Step 2) Create a config.json

Get private keys for the supported chains along with their respective gas tokens. Create a directory for the forwarder and add a `config.json`. This file includes RPCs, private keys, and other configurations required to run forwarder. In this case, we are adding the `config.json` to the `$HOME` directory. Run the following commands:

```shell
mkdir $HOME/.forwarder
vim config.json
```

```javascript
{
  "chains": [
    {
      "chainId": "80001",
      "chainType": " CHAIN_TYPE_EVM",
      "chainName": "Mumbai",
      "chainRpc": "",
      "blocksToSearch": 1000,
      "startBlock":41679450,
      "blockTime": "3s",
      "confirmationsRequired": 0
"wnativeAddress":"0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
    },
       {
      "chainId": "5",
      "chainType": "CHAIN_TYPE_EVM",
      "chainName": "Goerli",
      "chainRpc": "",
      "blocksToSearch": 1000,
      "startBlock":9939132,
      "blockTime": "10s",
"confirmationsRequired": 0
       "wnativeAddress":"0xb4fbf271143f4fbf7b91a5ded31805e42b2208d6"
    },
{
      "chainId": "near-testnet",
      "chainType": "CHAIN_TYPE_NEAR",
      "chainName": "near-testnet",
      "chainRpc": "https://rpc.testnet.near.org",
      "blocksToSearch": 500,
      "startBlock":  143344038,
      "blockTime": "30s",
      "numOfThreads": 20,
      "keyPath": "",
      "from": ""
    }
  ],
  "globalConfig": {
    "networkType": "testnet",
    "dbPath": "forwarder.db",
    "forwarderRouterAddress":"router1d95k9q8hnugcg50sf075x2l6tz8uy4rzlsekk8",
    "middlewareAddress": "router17hlelrccxutnpe6u0gw2tk52f6ekrwenmz9amyhhfsq2v24mhkzquuwu99",
    "ethPrivateKey": "",
    "watcherTimer": 1000
  }
}
```
<details>
<summary><b>For listening to NEAR transactions</b></summary>

To access the data provided by [NEAR Lake](https://docs.routerprotocol.com/tools/realtime#near-lake-indexer), you need to provide valid AWS credentials in order to be charged by the AWS for the S3 usage.

We will require the AWS CLI to access to S3 instance. If you don't have the AWS CLI, please follow the steps given [here](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html).

### AWS S3 Credentials

To be able to get objects from the AWS S3 bucket you need to provide the AWS credentials. AWS default profile configuration looks similar to the following:
```javascript
[default]
aws_access_key_id=AKIAIOSFODNN7EXAMPLE
aws_secret_access_key=bPxRfiCYEXAMPLEKEY
```

### NEAR Streamer Setup

Ensure that you have Docker, Node.js, and Yarn installed on your machine. If not, follow the installation guides below:
- [Docker Installation Guide](https://docs.docker.com/get-docker/)
- [Node.js Installation Guide](https://nodejs.org/en/download/)
- [Yarn Installation Guide](https://classic.yarnpkg.com/en/docs/install)

Once these are installed, follow these steps:

#### Step 1) Git Clone
```bash
git clone <https://github.com/router-protocol/near-streamer.git>
``` 

#### Step 2) Setup AWS Credentials
```
aws_access_key_id = AKIAIOSFODNN7EXAMPLE
aws_secret_access_key = wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```
Save this file as `./.aws/credentials`

#### Step 3) Install Dependencies
```bash
yarn install
```

#### Step 4) Modify docker-compose.yml
Update the following environment variables in the `docker-compose.yml` file:
```plaintext
MONGO_DB_URI=mongodb://mongodb:27018/
NETWORK=testnet
START_BLOCK=146791266
PORT=6901
ALERTER_ACTIVE=true
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/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
```
- `MONGO_DB_URI` is the URI of the MongoDB instance. Since we are running MongoDB locally, you'll have to define the port in the URI.
- `NETWORK` will either be testnet or alpha-devnet. 
- `START_BLOCK` is the block from which the forwarder will start monitoring events.
- `PORT` is the port on your machine to be exposed.
- `ALERTER_ACTIVE` and `SLACK_WEBHOOK_URL` is for slack health alert service.

#### Step 5) Run Docker Compose
```bash
docker-compose up -d
```

</details>

## Run Forwarder

```bash
# start service
sudo systemctl start forwarder.service

# check status
sudo systemctl status forwarder.service

# check logs
sudo journalctl -u forwarder.service -f
```