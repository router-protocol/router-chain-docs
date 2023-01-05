---
title: Transfer of Non-Reserve Tokens with Arbitrary Instruction
sidebar_position: 5
---

```javascript
function depositNonReserveTokenAndExecute(
    bool isSourceNative,
    bytes memory swapData,
    bytes memory executeData,
    bytes memory arbitraryData
) external payable
```

The flow is just the same as that of the Non-Reserve token transfer explained in previous section. The only difference here is the arbitrary data that you need to pass for which the details can be found [here](./transfer-reserve-token-arbitrary-instruction#arbitrary-data).