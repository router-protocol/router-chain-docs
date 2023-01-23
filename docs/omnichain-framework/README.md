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
  <Card
    title="Overview"
    description="What is Router's OmniChain framework?"
    to="/omnichain-framework/overview"
    icon={<IDEIcon />}
  />
    <Card
    title="Understanding Omnichain Framework"
    description="Understanding the flow involved in a cross-chain request executed via Router's OmniChain framework"
    to="/omnichain-framework/understanding-omnichain-framework"
    icon={<OsmosisCore />}
  /> 
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
