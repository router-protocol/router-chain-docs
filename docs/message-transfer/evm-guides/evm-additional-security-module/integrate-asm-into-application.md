---
title: How to integrate ASM into your application?
sidebar_position: 2
---

After implementing their ASM, the user should deploy it on the required chain. To send a request from the source chain to the destination chain, the user needs to call the following function signature.

```javascript
function iSend(
    uint256 version,
    uint256 routeAmount,
    string calldata routeRecipient,
    string calldata destChainId,
    bytes calldata requestMetadata,
    bytes calldata requestPacket
) external payable returns (uint256);
```

In the above-mentioned code snippet, a `requestMetadata` parameter needs to be constructed, which is an ABI-encoded parameter that can be generated on-chain or passed through arguments in a function call.

The last argument in the `requestMetadata` parameter is `asmAddress`, which should be the address of the ASM module in string format when calling the `iSend` function in the gateway contract.

The `requestMetadata` parameter can be created on-chain using the following function:


```javascript
function getRequestMetadata(
    uint64 destGasLimit,
    uint64 destGasPrice,
    uint64 ackGasLimit,
    uint64 ackGasPrice,
    uint128 relayerFees,
    uint8 ackType,
    bool isReadCall,
    string asmAddress
) external view returns (bytes memory) {
    return
        abi.encodePacked(
            destGasLimit,
            destGasPrice,
            ackGasLimit,
            ackGasPrice,
            relayerFees,
            ackType,
            isReadCall,
            asmAddress
        );
}
```

Alternatively, the `requestMetadata` parameter can be created in TypeScript or JavaScript using the following function:


```javascript
function getRequestMetadata(
  destGasLimit: number,
  destGasPrice: number,
  ackGasLimit: number,
  ackGasPrice: number,
  relayerFees: string,
  ackType: number,
  isReadCall: boolean,
  asmAddress: string
): string {
  return ethers.utils.solidityPack(
    [
      'uint64',
      'uint64',
      'uint64',
      'uint64',
      'uint128',
      'uint8',
      'bool',
      'string',
    ],
    [
      destGasLimit,
      destGasPrice,
      ackGasLimit,
      ackGasPrice,
      relayerFees,
      ackType,
      isReadCall,
      asmAddress,
    ]
  );
}
```
