---
title: Additional Security Module (ASM)
sidebar_position: 4
---

# Additional Security Module (ASM)

The Router chain uses a Proof-Of-Stake consensus mechanism, which ensures security through a 2/3 majority stake consensus. This approach allows for instant transaction finality and improved transaction throughout.

In situations where users are developing cross-chain dApps on the Router chain, they might want to add an extra layer of security that caters to their particular business requirements. To cater to this need, we have introduced the Additional Security Module (ASM), which serves as a plugin that enables users to easily incorporate their own security mechanism into their dApp without the need for significant changes to their existing implementation.

The integration of the Additional Security Module (ASM) provides the dApp with enhanced capabilities to mitigate any potential security threats at the dApp level and maintain the overall system's security. This module offers various security measures, such as a waiting period similar to optimistic roll-ups, rate-limiting, and other relevant features, that can be seamlessly integrated into the dApp to provide an additional layer of protection.

### How it works?

- The Additional Security Module (ASM) can be easily integrated using the verifyCrossChainRequest function. This function returns a boolean value, based on which the Router chain decides whether to proceed with the transaction request or not.
- When the function returns true, the request is deemed valid, and its execution proceeds. Conversely, if the function returns false, the request is rejected due to tampering or other issues. Any reversion from the module will lead to the transaction being reverted without any changes recorded on the blockchain.
- In case the ASM implementation reverts, the transaction call to the gateway will also be reverted, and no state changes will be recorded on the gateway contract. As a result, relayers can try to execute the request again since there are no changes in the gateway contract's state. However, the gateway contract will not execute the request until the ASM implementation returns either true or false. Once the request is executed, an acknowledgment event will be generated to convey this information.
- These functions can be called by the router gateway contract only. **Developers have to integrate these functions with the same selector in their ASM implementation.**