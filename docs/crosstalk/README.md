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

The guides on this page will explain the process of developing on Router's CrossTalk framework.


 ## Get Started
   <Section title="Developers" id="web-sdks" hasSubSections >

   <Section>
  <Card
    title="Overview"
    description="What is CrossTalk and why is it required?"
    to="/crosstalk/overview"
    icon={<IDEIcon />}
  />
 {/* <Card
    title="Router CLI"
    description="Install routerd to join the network or simple query it."
    to="/router-core/routerd"
    icon={<TerminalIcon />}
  />
  <Card
    title="Application-specific Explorer"
    description="Custom explorer for projects to monitor their transactions"
    to="/router-core/category/application-specific-explorer"
    icon={<ModulesIcon />}
  />
    <Card
    title="Router Robot"
    description="A cross-chain integration testing framework"
    to="/router-core/category/router-robot"
    icon={<Osmojs />}
  />
  <Card
    title="Modules"
    description="Osmosis modules and their respective CLI commands"
    to="/router-core/modules"
    icon={<ModulesIcon />}
  />
  <Card
    title="Relaying"
    description=" Relay IBC packets between Osmosis and other chains"
    to="/router-core/relaying"
    icon={<RelayerIcon />}
  />
  <Card
    title="Assets"
    description="     Currently supported assets on Osmosis with their corresponding channels and IBC denoms."
    to="/router-core/asset-info"
    icon={<AssetIcon />}
  />
  <Card
    title="Key Management"
    description="Managing keys via CLI and advanced operations such as multisig wallets"
    to="/router-core/category/keys-management"
    icon={<KeysIcon />}
  />
  <Card
    title="Contributing"
    description=" Guidelines to contributing to Osmosis core development."
    to="/router-core/contributing"
    icon={<Contribute />}
  /> */}
  </Section>

  </Section>

   <Section title="Guides" id="web-sdks" hasSubSections >

   <Section>
      <Card
    title="Your First Cross-chain dApp"
    description="Learn how to deploy your first cross-chain dApp using Router's CrossTalk framework"
  to="/router-core/guides/your-first-cross-chain-dapp"
    icon={<Guide />}
  />
     <Card
    title="Deploying Solidity Contracts"
    description="Learn how to compile and deploy solidity contracts using the Remix IDE"
  to="/router-core/guides/deploying-solidity-contracts"
    icon={<Guide />}
  />
    {/* <Card
    title="Transaction Structure"
    description=" Understanding the structure of a transaction on the Osmosis blockchain"
    to="/router-core/guides/structure"
    icon={<Guide />}
  />
   <Card
    title="Performance & Profiling"
    description="Learn how to measure performance and profile your node"
  to="/router-core/guides/performance"
    icon={<Guide />}
  />
  <Card
    title="Creating IBC Pools"
    description="This document lays out the prerequisites and the  process that's needed to ensure that your token meets the interchain UX standards set by Osmosis."
  to="/router-core/guides/create-ibc-pool"
    icon={<Guide />}
  /> */}
  </Section>

  </Section>
