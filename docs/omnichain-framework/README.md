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

The guides on this page will explain the process of developing cross-chain applications by leveraging Router's middleware capabilities. If you're new here or you're not sure if Router's OmniChain framework is compatible with your requirements, check out <a href="../overview/choosing-the-right-framework" target="_blank">this guide</a> to figure out the best cross-chain framework for your dApp.



 ## Get Started
   <Section title="Developers" id="web-sdks" hasSubSections >

   <Section>
  {/* <Card
    title="Build and Test Osmosis Source Code"
    description="Getting started with building and testing Osmosis codebase"
    to="/router-core/build"
    icon={<OsmosisCore />}
  /> */}
  <Card
    title="Overview"
    description="What is Router's OmniChain framework?"
    to="/omnichain-framework/overview"
    icon={<IDEIcon />}
  />
  {/* <Card
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
    title="Your First Omnichain dApp"
    description="Learn how to deploy your first omnichain dApp leveraging the Router chain middleware"
  to="guides/your-first-omnichain-dapp"
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
