---
title: Transfer of LP Tokens with Arbitrary Instruction
sidebar_position: 7
---

```javascript
function depositLPTokenAndExecute(
        bool isAppTokenPayer,
        bytes calldata swapData,
        bytes calldata executeData,
        bytes calldata arbitraryData,
        bytes calldata requestMetadata
    ) external payable;
```

The flow is just the same as that of the LP token transfer explained above. The only difference here is the arbitrary data that you need to pass and state whether the tokens that need to be swapped are to be deducted from the user or the application for which the details can be found [here](./transfer-reserve-token-arbitrary-instruction#arbitrary-data).
