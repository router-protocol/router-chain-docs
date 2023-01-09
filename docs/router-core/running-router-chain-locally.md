---
title: Running Router blockchain on local system
sidebar_position: 3
---

## Overview
In this section we will talk about how you can run Router blockchain on your local system.

## Setup config file
Clone [this repo](https://github.com/router-protocol/routerchain-devops) to begin deploying Router chain in your local system.

### Step 1) Create config file
Run the below command to create config file from existing template.

`cp config.example.json config.json`

### Step 2) Setup meta configuration
In the `config.json` file, you have a key named <code>meta</code>.
1. Setup public key `rsaPublic` & private key `rsaPrivate` paths
2. Config files are picked based on environment. To run locally, env needs to be set to `local`

### Step 3) Set the configs
In `config.json` file, there is a list of services supported by the deployment script. Each service has below mentioned fields with default values. You can update the fields as per the requirement.
1. `name` - name of the service
2. `fn` - corresponding handler function (you can see function in deploy/start.sh)
3. `containerName` - container name of the service, change it unless you want to use different container name
4. `srcPath` - local path where to clone the service
5. `enable` - Set it to true to start respective service
6. `repo` - ssh url of the repository
7. `branch` - branch of the repo to checkout
8. `clearCache` - set to true to remove already cloned repository. Setting this to true will clone repo again and build it from scratch. Set to false, if repo is already cloned and docker image is built and you don't want to rebuild again. PS: If you are not sure, then set it to true.

Example service config for router-chain.
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

## Deployment
### Prerequisites
1. `jq` - to read json config
2. `docker` - to start containers

You can install above pre-requisites following the official documentation. Example is shown below.
```jsx
$ apt-get install jq
$ apt-get install docker-ce docker-ce-cli containerd.io docker-compose-plugin
```

### Start deployment
``` jsx
$ cd routerchain-devops
$ bash deploy/start.sh
```

The deployment setup is completed. Router chain should not be running in your local system!
