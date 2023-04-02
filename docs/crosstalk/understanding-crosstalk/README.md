---
title: Understanding CrossTalk
sidebar_position: 1
---

import {
HomepageCard as Card,
HomepageSection as Section,
} from '../../../src/components/HomepageComponents';

import {
NearIcon,
EthereumIcon
} from '../../../src/icons';

## High Level Architecture

Below is a high level architecture diagram for Router CrossTalk.

<center><img src={require('../../../src/images/RouterCrossTalk.png').default} alt="Router CrossTalk Architecture" style={{width: "100%", marginBottom: 12}}/></center>

## Crosstalk Functions

  <Section title="Understanding Crosstalk Functions" id="web-sdks" hasSubSections >

  <Section>
  <Card
  title="EVM Guide"
  description="Undestanding the crosstalk functions for EVM contracts"
  to="/crosstalk/understanding-crosstalk/evm_guides"
  icon={<EthereumIcon />}
  />
  <Card
  title="Near Guide"
  description="Undestanding the crosstalk functions for Near chain"
  to="/crosstalk/understanding-crosstalk/near_guides"
  icon={<NearIcon />}
  />
  </Section>
  </Section>
