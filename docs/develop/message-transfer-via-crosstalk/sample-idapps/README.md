---
title: Sample IDapps
sidebar_position: 1
---

import {
HomepageCard as Card,
HomepageSection as Section,
} from '../../../../src/components/HomepageComponents';

import {
NearIcon,
EthereumIcon
} from '../../../../src/icons';

<Section title="A Guide on Building IDapps" id="web-sdks" hasSubSections >

This section will showcase the process of building cross-chain Dapps across multiple chains. It will provide a step-by-step guide to creating contracts that can communicate with each other on different chains.

It will cover the implementation of various functionalities such as transferring NFTs and sending messages across different chains. The demonstration will make use of the cross-chain communication framework described earlier and will include code snippets and explanations for each step involved in the process.

<Section>
<Card
title="EVM Guides"
description="Understanding the crosstalk functions for EVM contracts"
to="/message-transfer/sample-idapps/evm_guides"
icon={<EthereumIcon />}
/>
<Card
title="Near Guides"
description="Understanding the crosstalk functions for Near chain"
to="/message-transfer/sample-idapps/near_guides"
icon={<NearIcon />}
/>
</Section>
</Section>
