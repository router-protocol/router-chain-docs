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
  Transaction,
  Contribute,
  Guide,
} from '../../src/icons';

# Introduction

The guides on this page will explain the process of developing using Voyager. If you're new here or you're not sure if Voyager is compatible with your requirements, check out [this guide](../overview/choosing-the-right-framework) to figure out the best cross-chain framework for your dApp.


 ## Get Started
   <Section title="Developers" id="web-sdks" hasSubSections >

   <Section>
  <Card
    title="Overview"
    description="What is Voyager and why is it required?"
    to="/voyager/overview"
    icon={<IDEIcon />}
  />
    <Card
    title="Understanding Voyager"
    description="Dissecting different functions and parameters associated with Voyager"
    to="/voyager/understanding-voyager"
    icon={<ChainIcon />}
  />
 <Card
    title="Different Types of use-cases"
    description="Learning how to build the different types of cross-chain token transfer use-cases using Voyager"
    to="/voyager/building-different-use-cases"
    icon={<ModulesIcon />}
  />
  </Section>

  </Section>


  <Section title="Tooling" id="tooling" hasSubSections >

  <Section>
  <Card
    title="Voyager Widget"
    description="Widget to integrate cross-chain swaps on your website"
    to="/voyager/tools/voyager-widget"
    icon={<Guide />}
  />
    <Card
    title="Voyager PathFinder API"
    description="An API to integrate Voyager's cross-chain swap functionality"
    to="/voyager/tools/voyager-pathfinder-api"
    icon={<Guide />}
  />
 <Card
    title="Voyager JS SDK"
    description="SDK to integrate Voyager's cross-chain swap functionality"
    to="/voyager/tools/voyager-js-sdk"
    icon={<Guide />}
  />
</Section>
  
  </Section>

   <Section title="Guides" id="guides" hasSubSections >

   <Section>
      <Card
    title="Deploying a Cross-chain Staking Contract"
    description="Learn how to deploy your first cross-chain staking dApp using Voyager"
  to="/voyager/guides/staking-contract"
    icon={<Guide />}
  />
  </Section>

  </Section>
