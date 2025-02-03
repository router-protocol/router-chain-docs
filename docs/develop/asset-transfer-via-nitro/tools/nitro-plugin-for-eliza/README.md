---
title: Nitro Plug-in for Eliza
sidebar_position: 1
description: Nitro plug-in to enable cross-chain transactions within AI agents
---

We have developed a plug-in for the Eliza framework that can be used by developers to perform cross-chain transactions using their AI agents. 

## Usage/Example
**Step 1)** Clone the Eliza starter repo: 
```bash
git clone https://github.com/elizaOS/eliza-starter
```

**Step 2)** Open the Eliza starter repo and do the following:
- Install dependencies using `pnpm i`
- Copy the .env.example file using `cp .env.example .env`

**Step 3)** Get your API key and replace its value in .env file.

**Step 4)** Get your EVM wallet address and private key and fill in the following values in .env:

```jsx
ROUTER_NITRO_EVM_ADDRESS=0x…
ROUTER_NITRO_EVM_PRIVATE_KEY=...
```

**Step 5)** Install router nitro plugin in the same directory using:
```bash
pnpm install @elizaos/plugin-router-nitro
```

**Step 6)** Open the `character.ts` file inside `src/` directory, import the `nitroPlugin` from the `@elizaos/plugin-router-nitro` and add the `nitroPlugin` in the plugins field of this character file.

Start the agent using `pnpm i`:

<center><figure><img src={require('../../img/nitroPlugin.png').default} alt="nitroPlugin" style={{width: "75%", marginBottom: 12}} /><figcaption>Nitro Plugin for Eliza</figcaption></figure></center>




**Step 7)** To run the client, setup the main Eliza repo:
- Clone using 
```bash 
git clone git@github.com:elizaOS/eliza.git
```
- Install dependencies by doing `pnpm i`
- Start the eliza client by `pnpm start:client`
- Open the `localhost:5173` in your browser and you should see this UI

<center><figure><img src={require('../../img/elizaAgent.png').default} alt="elizaAgent" style={{width: "75%", marginBottom: 12}} /><figcaption>Eliza Agent</figcaption></figure></center> 
