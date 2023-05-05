---
title: Introduction
sidebar_position: 1
---

import {
HomepageCard as Card,
HomepageSection as Section,
} from '../../src/components/HomepageComponents';

import {
ChainIcon,
IDEIcon,
TerminalIcon,
APIReferenceIcon,
Telescope,
ModulesIcon,
RelayerIcon,
AssetIcon,
KeysIcon,
Osmojs,
Transaction,
OsmosisCore,
Contribute,
Guide,
} from '../../src/icons';

# Introduction

Router Protocol's Message Transfer aka Crosstalk feature enables seamless interaction between contracts deployed on different chains, allowing them to exchange messages and execute cross-chain transactions. This feature can be integrated into a development environment without any additional overhead, providing a smooth experience for developers.

Moreover, Crosstalk allows for contracts on third-party chains to interact with contracts on the Router chain, making it possible to build applications with stateful bridging logic using the Router chain contract as the bridge contract. This stateful bridging functionality is what Router Protocol refers to as its Omnichain framework.


## Get Started

   <Section title="Developers" id="web-sdks" hasSubSections >

   <Section>
  <Card
    title="Overview"
    description="What is CrossTalk and Omnichain framework"
    to="/message-transfer/overview"
    icon={<IDEIcon />}
  />
    <Card
    title="Understanding Message transfer"
    description="Dissecting different functions and parameters associated with CrossTalk"
    to="/message-transfer/understanding-message-transfer"
    icon={<ChainIcon />}
  />
 <Card
    title="EVM-Guides"
    description="Learning how to execute different types of cross-chain requests in EVM Chains"
    to="/message-transfer/evm-guides"
    icon={<ModulesIcon />}
  />
 <Card
    title="Near-Guides"
    description="Learning how to execute different types of cross-chain requests in Near"
    to="/message-transfer/near-guides"
    icon={<ModulesIcon />}
  />
 <Card
    title="Router-chain-Guides"
    description="Learning how to execute different types of cross-chain requests from or to Router chain"
    to="/message-transfer/near-guides"
    icon={<ModulesIcon />}
  />
  <Card
    title="Fee Management"
    description="Gaining a deeper understanding of how the CrossTalk and Omnichain Fee is computed"
    to="/message-transfer/fee-management"
    icon={<AssetIcon />}
  />
    <Card
    title="Cross-chain Read Requests"
    description="Learning how to query data from different chains in a decentralized manner"
    to="/message-transfer/evm-guides/evm-read-calls"
    icon={<Telescope />}
  />
  </Section>

  </Section>

  <Section title="Tooling" id="tooling" hasSubSections >
  
  </Section>

   <Section title="Sample IdApps" id="sample-idapps" hasSubSections >

   <Section>
      <Card
    title="Deploying a Cross-chain Ping Pong Contract"
    description="Learn how to deploy your first cross-chain dApp using Router's CrossTalk framework"
  to="/message-transfer/sample-idapps/evm_guides/ping-pong-contract"
    icon={<Guide />}
  />
     <Card
    title="Deploying a Cross-chain NFT (ERC-1155)"
    description="Learn how to deploy a cross-chain NFT using Router's CrossTalk framework"
  to="/message-transfer/sample-idapps/evm_guides/cross-chain-nft"
    icon={<Guide />}
  />
  </Section>

  </Section>
