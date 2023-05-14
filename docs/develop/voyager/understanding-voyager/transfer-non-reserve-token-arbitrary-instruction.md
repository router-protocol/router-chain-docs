---
title: Transfer of Non-Reserve Tokens with Arbitrary Instruction
sidebar_position: 5
---

```javascript
function depositNonReserveTokenAndExecute(
        bool isSourceNative,
        bool isAppTokenPayer,
        bytes calldata swapData,
        bytes calldata executeData,
        bytes calldata arbitraryData,
        bytes calldata requestMetadata
    ) external payable;
```

The flow is just the same as that of the Non-Reserve token transfer explained in previous section. The only difference here is the arbitrary data that you need to pass and state whether the tokens that need to be swapped are to be deducted from the user or the application for which the details can be found [here](./transfer-reserve-token-arbitrary-instruction#arbitrary-data).
