---
title: Understanding Message Transfer
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

## High-Level Architecture

Below is a high-level architecture diagram for Router CrossTalk.

<center><img src={require('../../../src/images/RouterCrossTalk.png').default} alt="Router CrossTalk Architecture" style={{width: "100%", marginBottom: 12}}/></center>

**STEP 1)** A user initiates a cross-chain action on an application’s smart contract on the source chain.

**STEP 2)** The application contract calls the specific function on the Router Gateway contract. (Functions are mentioned in specific guides for EVM and Near)

**STEP 3)** The Gateway contract on the source chain emits an event that is listened to by the orchestrators
on the Router chain.

**STEP 4)** After validating the event with the help of the attestation module, the incoming request is marked as validated.

**STEP 5)** Once the incoming request is marked as validated, the Router chain will deduct
the fee from the designated `feePayer` address for that dApp on the Router chain.
The fee payer address is set by the dApp and is responsible for paying the fees for all the cross-chain requests for that dApp.

**STEP 6)** Relayers pick up the transaction signed by the orchestrator and forward the event to the Router
Gateway contract on the destination chain.

**STEP 7)** The Gateway contract on the destination chain calls a specific function on the application contract on the destination chain. (Functions are mentioned in specific guides for EVM and Near)

**STEP 8)** The application contract on the destination chain will take appropriate actions based on
the data transferred.

**STEP 9)** After the function execution is complete on the destination chain, the destination chain’s Gateway contract emits an acknowledgment event that is listened to by the orchestrators on the Router chain.

**STEP 10)** Upon receiving the intimation of majority confirmations from the attestation module, our module marks the ack request as VALIDATED.

**STEP 11)** Once validated, the acknowledgment request is processed on the Router chain

**STEP 12)** Once the acknowledgment is processed on the Router chain, it is sent to the application’s
bridge contract.

## Understanding Functions

  <Section title="Understanding Functions" id="web-sdks" hasSubSections >

  <Section>
  <Card
  title="EVM Guide"
  description="Understanding the crosstalk functions for EVM contracts"
  to="/message-transfer/evm-guides/understanding-functions"
  icon={<EthereumIcon />}
  />
  <Card
  title="Near Guide"
  description="Understanding the crosstalk functions for Near chain"
  to="/message-transfer/near-guides/understanding-functions"
  icon={<NearIcon />}
  />
  </Section>
  </Section>
