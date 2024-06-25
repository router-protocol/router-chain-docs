---
title: 4) Testing the End-to-End Workflow
---

Now that we have deployed all the relevant contracts, it's time to test them out.

## Testing the Inbound Flow

**Step 1)** Send a message string from the **HelloRouter.sol** contract to the Gateway contract on the Router EVM Devnet. To do this, follow the guide given [here](./sending-an-inbound-request).

**Step 2)** Follow the guide given [here](./verifying-the-inbound-request) to verify the state change of the bridge contract following the delivery of the inbound request to the Router Chain.


## Testing the Outbound and Outbound Ack Flow

**Step 1)** Verify the state change of the application contract following the delivery of the outbound request to the destination chain. To do this, follow the guide given [here](./verifying-the-outbound-request).

**Step 2)** Follow the guide given [here](./verifying-the-outbound-ack) to verify the state change of the bridge contract following the delivery of the outbound acknowledgment to the Router Chain.