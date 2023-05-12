---
title: Transfer of LP Tokens with Arbitrary Instruction
sidebar_position: 7
---

```javascript
function depositLPTokenAndExecute(
    bytes memory swapData,
    bytes memory executeData,
    bytes memory arbitraryData
) external
```

The flow is just the same as that of the LP token transfer explained above. The only difference here is the arbitrary data that you need to pass for which the details can be found [here](./transfer-reserve-token-arbitrary-instruction#arbitrary-data).