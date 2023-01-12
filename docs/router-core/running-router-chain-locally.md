---
title: Running Router Chain on any Local System
sidebar_position: 3
---
<!-- In this section we will dilineate the steps involved in running the Router blockchain on any local machine. -->

## Part 1: Config File Setup

### Step 1) Clone the Router Chain Repository
Clone [this repo](https://github.com/router-protocol/routerchain-devops) to begin deploying the Router chain in your local system.

### Step 1) Create a Config File
Run the command given below to create a config file from the existing template.

```bash
cp config.example.json config.json
```

### Step 2) Add Meta Configuration
In the **`config.json`** file, you have a key named `meta`:
1. Set up the paths for the public key `rsaPublic` and the private key `rsaPrivate`.
2. Config files are picked based on environment. To run locally, env needs to be set to `local`.

### Step 3) Set the Configurations
In the `config.json` file, there is a list of services supported by the deployment script. Each service has the following fields with default values. You can update the fields as per the requirement.
1. `name` - Name of the service
2. `fn` - Corresponding handler function (you can see this function in `deploy/start.sh`)
3. `containerName` - Container name of the service, change it unless you want to use different container name
4. `srcPath` - Local path where to clone the service
5. `enable` - Set it to true to start the respective service
6. `repo` - SSH URL of the repository
7. `branch` - Branch of the repo to checkout
8. `clearCache` - Set to true to remove already cloned repository. It will clone the repo again and build it from scratch. Set to false if the repo is already cloned and the docker image is already built. If you are not sure, then set it to true.

Example service config for router-chain:
```jsx
{
    "name": "router-chain",
    "fn": "RunChain",
    "repo": "git@github.com:router-protocol/router-chain.git",
    "branch": "featchain-automation",
    "containerName": "router-chain-image",
    "srcPath":"repos/router-chain",
    "enable": false,
    "clearCache": true
}
```

---------------------

## Part 2: Deployment
### Step 1) Installing Prerequisites
1. `jq` - to read the JSON config
2. `docker` - to start containers

You can install the aforementioned pre-requisites following the official documentation. For example:
```jsx
$ apt-get install jq
$ apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Step 2) Start Deployment
Run the following commands to start the Router chain deployment on your local machine:
``` jsx
$ cd routerchain-devops
$ bash deploy/start.sh
```

Once these commands are successfully executed, the Router chain should be running in your local system!
