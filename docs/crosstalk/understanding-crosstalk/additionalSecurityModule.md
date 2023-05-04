---
title: Additional Security Module (ASM)
sidebar_position: 5
---

# Additional Security Module (ASM)

The Router chain uses a Proof-Of-Stake consensus mechanism, which ensures security through a 2/3 majority stake consensus. This approach allows for instant transaction finality and improved transaction throughout.

- In the case of users building cross-chain DApps on the Router chain, they may desire to incorporate an additional layer of security tailored to their specific business needs. To accommodate this, we have introduced the Additional Security Module (ASM), which acts as a plugin enabling users to seamlessly integrate their own security mechanism into their DApp without requiring significant modifications to their current implementation.
- By incorporating the Additional Security Module (ASM), the DApp will be better equipped to manage potential DApp-level security threats and uphold the system's integrity. The module offers a range of security measures, including a waiting period similar to optimistic roll-ups, rate-limiting, and other relevant considerations, to provide an additional layer of protection.

### How it works?

- To seamlessly integrate the ASM, we have a function called `verifyCrossChainRequest`. This function returns a boolean value or reverts the transaction, depending on which the further execution is determined.
- If the function returns **true**, it means the transaction request is valid and can proceed with the execution. On the other hand, if the function returns **false**, it indicates that the request is invalid or has been tampered with, and must be discarded. Any **reversion** from the module's implementation will result in the transaction being reverted without recording any state changes on the blockchain.
- If the asm implementation reverts, the gateway transaction call will be reverted, and no state will be modified on the gateway contract. Since there is no state change on the gateway contract, the relayers can try to execute this request again. This request will not be executed by the gateway contract until the asm implementation returns either true or false. Once the request is executed, this information will be conveyed through an acknowledgment event.
- These functions can be called by the router gateway contract only. **Developer has to integrate these functions with the same selector in their ASM implementation.**
- Function selectors are provided in the code snippet below. Developers can add their business logic according to their use case in the DApp specific **_Additional Security Module_**.

```javascript
function verifyCrossChainRequest(
      uint256 eventNonce,
      uint256 requestTimestamp,
      string calldata srcContractAddress,
      string calldata srcChainId,
      bytes calldata packet,
      address handler
) external returns (bool);
```

As you can see, We havet this function signature in the *IAdditionalSecurityModule* ASM interface. This function signature serves additional security to a specific flow.

### `verifyCrossChainRequest` function to secure CrossChain Flow

- This function signature (_verifyCrossChainRequest_) provides additional security in CrossChain flow.
- While receiving a request on the destination chain before executing the user contract calls, we will call this function selector on the provided asm address.
- Now, The asm implementation can return true/false if the request is validated. But if they need more time for the request validation they can revert the request from the asm implementation.
- As explained earlier, If this function returns *true* we will continue on the user contract calls execution. If the return value is *false* then we will skip the user contract calls execution. But if it reverts from asm implementation then this transaction will be reverted and no state will be modified on the gateway also.
- The asm module can revert the request until it validates the request, this will make sure once the DApp level request validation is completed then only the request will be executed on the gateway contract and the user contract calls.
- Since this function will be called from the gateway contract only, it must have the following security check.

  ```
  require(msg.sender == <the gateway contract address>, "Caller is not gateway");
  ```

- In this function selector, we have 6 arguments. Within this function, we can have any possible business logic or validation on the provided arguments. Each argument has its own purpose and meaning in the `verifyCrossChainRequest` request.
  1. `eventNonce`: The event nonce is a unique identifier of the request. It is added by the source chain's gateway contract.
  2. `requestTimestamp`: This is the request timestamp when this request was added/verified on the Router chain.
  3. `srcContractAddress`: This is the address of the application's smart contract on the source chain in string format.
  4. `srcChainId`: This is the chain id of the chain from which the request to the Router chain was initiated.
  5. `packet`: This is the payload. Payload is the data to be transferred to the destination chain that comes from the source chain contract.
  6. `handler`: This is the address of the application's contract on the destination chain in address format.

### How to do installation?

- For this ASM to work, you need to import `IAdditionalSecurityModule.sol` file from **`@routerprotocol/evm-gateway-contracts`**. You can use the following commands for the same:
  `yarn add @routerprotocol/evm-gateway-contracts@1.1.11`
  or
  `npm install @routerprotocol/evm-gateway-contracts@1.1.11`
- Inherit `IAdditionalSecurityModule` into your ASM. `IAdditionalSecurityModule` is the interface that contains selectors for `verifyCrossChainRequest` functions.
- Note that these functions can only be called by the gateway contract on the destination chain.
- Add your business logic into these functions and you're done.
- You just need to provide the address for this ASM contract deployed on the destination chain while initiating the cross-chain request on the source chain.

### How to integrate ASM into your application?

After implementing your ASM, deploy it on the required chain. To send request from the source chain to the destination chain, we have to call the following function signature.

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

Here in the above mentioned code snippet, you need to construct a `requestMetadata` parameter, which is an ABI-encoded parameter that can be generated on-chain or passed through arguments in a function call.

The last argument in the `requestMetadata` parameter is `asmAddress`, which should be the address of the ASM module in string format when calling the iSend function in the gateway contract.

You can create the `requestMetadata` parameter on-chain using the following function:

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

Alternatively, you can create the requestMetadata parameter in TypeScript or JavaScript using the following function:

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

Find how you can integrate a sample delayed execution Addition Security Module into your application contract [here](../guides/evm_guides/ASM/asm.md)
