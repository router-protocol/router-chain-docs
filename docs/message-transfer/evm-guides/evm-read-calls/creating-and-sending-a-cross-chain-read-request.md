---
title: Creating and Sending a Cross-chain Read Request
sidebar_position: 1
---

To create a cross-chain read request, one needs to call the `iSend()` function on Router's Gateway contract with the following parameters:

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

wherein, the parameter `requestMetadata` is the metadata that includes `abi.encodePacked` value of destination gas limit, destination gas price, ackknowledgement gas limit, acknoeledgement gas price, relayer fees, acknowledgement type, bool if its a read call and address of Additional Security Module.

```javascript
function getRequestMetadata(
    uint64 destGasLimit,
    uint64 destGasPrice,
    uint64 ackGasLimit,
    uint64 ackGasPrice,
    uint128 relayerFees,
    uint8 ackType,
    bool isReadCall,
    bytes memory asmAddress
    ) public pure returns (bytes memory) {
    bytes memory requestMetadata = abi.encodePacked(
        destGasLimit,
        destGasPrice,
        ackGasLimit,
        ackGasPrice,
        relayerFees,
        ackType,
        isReadCall,
        asmAddress
    );
    return requestMetadata;
    }
```

The detailed documentation for this function can be found [here](../understanding-functions/iSend).

When creating a read request, the `isReadCall` parameter must be set to `true` in the `requestMetadata` parameter. In addition, the payload encoding must be of a specific type.

For example, if a user wants to send a read call to Contract A on the destination chain from the Application Contract on the source chain and wants to query the getA() function, the payload should be encoded as follows:

```javascript
interface A {
   function getA(uint256 a) external returns (uint256);
}

contract Application {
   function createReadQueryPayload(uint256 a) external returns (bytes memory) {
      bytes memory payload = abi.encodeCall(A.getA, (a));
      return payload;
   }
}
```

An example for sending a cross-chain read query can be found [here](./sample-read-call-contract).
