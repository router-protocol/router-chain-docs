---
title: Additional Security Modules (ASM)
sidebar_position: 3
description: With ASMs, Router provides developers an option to include additional security safeguards in their cross-chain applications
---


The Router Chain uses a Proof-Of-Stake consensus mechanism, which ensures security via a 2/3 majority stake consensus. This approach allows for instant transaction finality and, consequently, an improved transaction throughout.

When developers are building cross-chain dApps on the Router Chain, they might want to add an extra layer of security that caters to their business requirements. To solve this, we have introduced the concept of an Additional Security Module (ASM), which serves as a plugin enabling developers to easily incorporate their custom security mechanism into their dApp without the need for significant changes to their existing code.

Integrating an Additional Security Module (ASM) can enhance a dApp's ability to mitigate potential security threats at an application level and maintain the overall system's security. We support a few modules out of the box, but developers are free to add their own implementations. This can include security measures such as a waiting period similar to optimistic roll-ups, rate-limiting, or other relevant features that can be seamlessly integrated into the dApp to provide an additional layer of protection.

### How does an ASM work?

- Any Additional Security Module (ASM) can be easily integrated into any chain's Gateway contract using the `verifyCrossChainRequest` function. This function returns a boolean value, based on which the Gateway contract decides whether to proceed with the transaction request or not.
- When the function returns `true`, the request is deemed valid, and the Gateway contract proceeds with its execution. Conversely, if the function returns `false` due to transaction tampering or any other issue, the request is rejected and an acknowledgment is sent back to the Router Chain for the same. 
- In case the request to the ASM module reverts, the transaction call to the Gateway contract will also be reverted, and no state changes will be recorded on the Gateway contract. As a result, relayers can try to execute the request again since there will be no changes in the Gateway contract's state. However, the Gateway contract will not execute the request until the ASM implementation returns either `true` or `false`. Once the request is executed, an acknowledgment event will be generated to convey this information.
- These functions can be called by the Router Gateway contract only. **Developers have to integrate these functions with the same selector in their ASM module implementation.**