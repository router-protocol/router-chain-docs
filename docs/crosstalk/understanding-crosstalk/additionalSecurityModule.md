---
title: Additional Security Module (ASM)
sidebar_position: 5
---

# Additional Security Module (ASM)

The Router chain uses a Proof-Of-Stake consensus mechanism, which ensures security through a 2/3 majority stake consensus. This approach allows for instant transaction finality and improved transaction throughout.

- In the case of users building cross-chain DApps on the Router chain, they may desire to incorporate an additional layer of security tailored to their specific business needs. To accommodate this, we have introduced the Additional Security Module (ASM), which acts as a plugin enabling users to seamlessly integrate their own security mechanism into their DApp without requiring significant modifications to their current implementation.
- By incorporating the Additional Security Module (ASM), the DApp will be better equipped to manage potential DApp-level security threats and uphold the system's integrity. The module offers a range of security measures, including a waiting period similar to optimistic roll-ups, rate-limiting, and other relevant considerations, to provide an additional layer of protection.

### How it works?

- For the ASM to get integrated seamlessly, we have added two functions `verifyRequestFromSource` and `verifyRequestFromRouter` which shall either return a boolean value or revert the transaction on the basis of which the further execution shall depend upon.
- If the function returns **true**, it would mean the transaction request is valid and can proceed with the execution whereas a **false** response indicates that the request has been tampered with or is invalid for some reason, and must be discarded. Any **reversion** from the module's implementation will result in the transaction being reverted without recording any state changes on the blockchain.
- In the event of a revert from the asm implementation, the gateway transaction call will be reverted, thus no state will be modified on the gateway contract. Since there is no state change on the gateway contract, the relayers can try to execute this request again. This request will not be executed by the gateway contract until the asm implementation returns either true or false. Once this request is executed, this information will be conveyed through an acknowledgment event.
- These functions can be called by the router gateway contract only. **Developer has to integrate these functions with the same selector in their ASM implementation.**
- Function selectors are provided in the code snippet below. Developers can add their business logic according to their use case in the DApp specific _Additional Security Module_.

```solidity
function verifyRequestFromSource(
    bytes memory srcContractAddress,
    string memory srcChainId,
    uint64 srcChainType,
    uint64 eventNonce,
    bool isAtomic,
    uint64 requestTimestamp,
    bytes[] memory payloads,
    bytes[] memory handlers
  ) external returns (bool) {}

function verifyRequestFromRouter(
    string memory routerBridgeAddress,
    uint64 outboundTxNonce,
    bool isAtomic,
    uint64 requestTimestamp,
    bytes[] memory payloads,
    bytes[] memory handlers
  ) external returns (bool) {}
```

As you can see, We have two different function signatures in the _IAdditionalSecurityModule_ ASM interface. Each function signature serves additional security to a specific flow.

### `verifyRequestFromSource` function to secure **Crosstalk Flow**

- This function signature (_verifyRequestFromSource_) provides additional security in CrossTalk flow (flow where we are sending a request from one source chain to one destination chain directly without using middleware contract on the router chain).
- While receiving a request on the destination chain before executing the user contract calls, we will call this function selector on the provided asm address.
- Now, The asm implementation can return true/false if the request is validated. But if they need more time for the request validation they can revert the request from the asm implementation.
- As explained earlier, If this function returns _true_ we will continue on the user contract calls execution. If the return value is _false_ then we will skip the user contract calls execution. But if it reverts from asm implementation then this transaction will be reverted and no state will be modified on the gateway also.
- The asm module can revert the request until it validates the request, this will make sure once the DApp level request validation is completed then only the request will be executed on the gateway contract and the user contract calls.
- Since this function will be called from the gateway contract only, it must have the following security check.

  ```
  require(msg.sender == <the gateway contract address>, "Caller is not gateway");
  ```

- In this function selector, we have 8 arguments. Within this function, we can have any possible business logic or validation on the provided arguments. Each argument has its own purpose and meaning in the `verifyRequestFromSource` request.

  1. `srcContractAddress`: This is the address of the application's smart contract on the source chain in bytes format.
  2. `srcChainId`: This is the chain id of the chain from which the request to the Router chain was initiated.
  3. `srcChainType`: The chain type of the chain from which the request to the Router chain was initiated.

     | Chain Type Name | Chain Type |
     | --------------- | ---------- |
     | EVM             | 0          |
     | COSMOS          | 1          |
     | POLKADOT        | 2          |
     | SOLANA          | 3          |
     | NEAR            | 4          |

  4. `eventNonce`: The event nonce is a unique identifier of the request. It is added by the source chain's gateway contract.
  5. `isAtomic`: A boolean value that helps the destination chain gateway contact to understand the contract calls atomicity.
  6. `requestTimestamp`: This is the request timestamp when this request was added/verified on the Router chain.
  7. `payloads`: This is the array of payloads. Payload is the data to be transferred to the destination chain that comes from the source chain contract.
  8. `handlers`: This is the array of addresses of the application's contract on the destination chain in bytes format.

### `verifyRequestFromRouter` function to secure **Omnichain Outbound Flow**

- This function signature (_verifyRequestFromRouter_) provides additional security in Outbound flow (flow where we are sending a request from the router chain to one destination chain).
- While receiving a request on the destination chain before executing the user contract calls, we will call this function selector on the provided asm address.
- Now, The asm implementation can return true/false if the request is validated. But if they need more time for the request validation they can revert the request from the asm implementation.
- As explained earlier, If this function will return _true_ we will continue on the user contract calls execution. If the return value is _false_ then we will skip the user contract calls execution. But If it will revert from asm implementation then this transaction will be reverted and no state will be modified on the gateway also.
- The asm module can revert the request until it validates the request, this will make sure once the DApp level request validation is completed then only the request will be executed on the gateway contract and the user contract calls.
- Since this function will be called from the gateway contract only, it must have the following security check.

  ```
  require(msg.sender == <the gateway contract address>, "Caller is not gateway");
  ```

- In this function selector, we have 8 arguments. Within this function, we can have any possible business logic or validation on the provided arguments. Each argument has its own purpose and meaning in the `verifyRequestFromRouter` request.

  1. `routerBridgeAddress`: This is the address of your middleware contract on the Router Chain.
  2. `outboundTxNonce`: The unique and incremented integer value for the outbound request.
  3. `isAtomic`: A boolean value that helps the destination chain gateway contact to understand the contract calls atomicity.
  4. `requestTimestamp`: This is the request timestamp when this request was added/verified on the Router chain.
  5. `payloads`: Payload is the data to be transferred to the destination chain that comes from the source chain contract.
  6. `handlers`: This is the array of addresses of the application's contract on the the destination chain in bytes format.

### Sample ASM Contract (Delayed Execution/Waiting Period)

This is a sample Delayed Execution ASM that delays a request by a certain time period if `verifyRequestFromRouter` or `verifyRequestFromSource` returns false. After the request is delayed, in the mean time owner has the flexibility to reject the transaction if there is something malicious or invalid with the transaction.

- For this ASM to work, you need to import `IAdditionalSecurityModule.sol` file from evm-gateway-contracts.
  You can use the following commands for the same:  
  `yarn add @routerprotocol/evm-gateway-contracts@1.0.5`  
  or  
  `npm install @routerprotocol/evm-gateway-contracts@1.0.5`
- Inherit `IAdditionalSecurityModule` into your ASM. `IAdditionalSecurityModule` is the interface that contains selectors for `verifyRequestFromRouter` and `verifyRequestFromSource` functions.
- Note that these functions can only be called by the gateway contract on the destination chain.
- Add your business logic into these functions and you're done.
- You just need to provide the address for this ASM contract deployed on the destination chain while initiating the cross-chain request on the source chain.

```solidity
// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IAdditionalSecurityModule.sol";

// Delay Tx
contract DelayASM is IAdditionalSecurityModule {
    mapping(bytes32 => bool) public delayedTransfers;
    address public gatewayContract;
    uint256 public delayPeriod;
    address public owner;
    string public appRouterBridgeAddress;

    constructor(address gatewayAddress, uint256 _delayPeriod, string memory _routerBridgeAddress) {
        gatewayContract = gatewayAddress;
        owner = msg.sender;
        delayPeriod = _delayPeriod;
        appRouterBridgeAddress = _routerBridgeAddress;
    }

    function setDelayPeriod(uint256 _delayPeriod) external {
        require(msg.sender == owner, "Caller is not owner");
        delayPeriod = _delayPeriod;
    }

    function rejectRequest(bytes32 id) external {
        require(msg.sender == owner);
        delayedTransfers[id] = true;
    }

    function isRequestRejected(bytes32 id) internal view returns (bool) {
        return delayedTransfers[id];
    }

    function _validateDelay(uint64 requestTimestamp) internal view returns (bool) {
        if (block.timestamp > requestTimestamp + delayPeriod) {
            return true;
        } else {
            revert("Transaction needs to be delayed");
        }
    }

    function verifyRequestFromSource(
        bytes memory srcContractAddress,
        string memory srcChainId,
        uint64 srcChainType,
        uint64 eventNonce,
        bool isAtomic,
        uint64 requestTimestamp,
        bytes[] memory payloads,
        bytes[] memory handlers
    ) external view returns (bool) {
        require(msg.sender == gatewayContract, "Caller is not gateway");
        bytes32 id = keccak256(
            abi.encode(
                srcContractAddress,
                srcChainId,
                srcChainType,
                eventNonce,
                isAtomic,
                requestTimestamp,
                payloads,
                handlers
            )
        );
        bool isRejected = isRequestRejected(id);
        if (isRejected) {
            return !isRejected;
        }
        _validateDelay(requestTimestamp);
        return !isRejected;
    }

    function verifyRequestFromRouter(
        string memory routerBridgeAddress,
        uint64 outboundTxNonce,
        bool isAtomic,
        uint64 requestTimestamp,
        bytes[] memory payloads,
        bytes[] memory handlers
    ) external view returns (bool) {
        require(msg.sender == gatewayContract, "Caller is not gateway");
        require(
            keccak256(abi.encodePacked(routerBridgeAddress)) == keccak256(abi.encodePacked(appRouterBridgeAddress)),
            "Invalid routerBridgeAddress"
        );
        // TODO: add your business logic here
        bytes32 id = keccak256(
            abi.encode(routerBridgeAddress, outboundTxNonce, isAtomic, requestTimestamp, payloads, handlers)
        );
        bool isRejected = isRequestRejected(id);
        if (isRejected) {
            return !isRejected;
        }
        _validateDelay(requestTimestamp);
        return !isRejected;
    }
}
```

### How to integrate ASM into your application?

- Let us understand how you can integrate custom ASM into your application through a simple cross-chain Ping-Pong Dapp.
- For your information, ping-pong is an app where we can send a message from the source chain to a destination chain and receive back the acknowledgment from the destination chain. So basically, we will send a ping to the destination chain and receive a pong back to the source chain.
- After you have deployed your application contract (Ping-pong) and your ASM contract(sample provided in the previous section) on respective chains, you just need to provide the address for the ASM contract deployed on the destination chain in the bytes format while initiating a cross-chain request from the source chain. In the example below, we are doing the same in `pingDestination` function.
- Code snippet for the Ping-pong is given below:

```solidity
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts@1.0.5/contracts/IGateway.sol";
import "@routerprotocol/evm-gateway-contracts@1.0.5/contracts/ICrossTalkApplication.sol";
import "@routerprotocol/evm-gateway-contracts@1.0.5/contracts/Utils.sol";

contract PingPong is ICrossTalkApplication {
address public owner;
IGateway public gatewayContract;
string public greeting;
uint64 public lastEventIdentifier;
uint64 public destGasLimit;
uint64 public ackGasLimit;

error CustomError(string message);
event ExecutionStatus(uint64 eventIdentifier, bool isSuccess);
event ReceivedSrcChainIdAndType(uint64 chainType, string chainID);

constructor(
  address payable gatewayAddress,
  uint64 _destGasLimit,
  uint64 _ackGasLimit
) {
  owner = msg.sender;
  gatewayContract = IGateway(gatewayAddress);
  destGasLimit = _destGasLimit;
  ackGasLimit = _ackGasLimit;
}

function setDappMetadata(
  string memory FeePayer
  ) public {
  require(msg.sender == owner, "Only owner can set the metadata");
  gatewayContract.setDappMetadata(FeePayer);
}

function pingDestination(
uint64 chainType,
string memory chainId,
uint64 destGasPrice,
uint64 ackGasPrice,
address destinationContractAddress,
string memory str,
uint64 expiryDurationInSeconds,
bytes memory asmModuleAddress
  ) public payable returns (uint64) {
  bytes memory payload = abi.encode(str);
  bytes[] memory addresses = new bytes[](1);
  addresses[0] = toBytes(destinationContractAddress);
  bytes[] memory payloads = new bytes[](1);
  payloads[0] = payload;
  return _pingDestination(
    uint64(block.timestamp) + expiryDurationInSeconds,
    destGasPrice,
    ackGasPrice,
    chainType,
    chainId,
    payloads,
    addresses,
    asmModuleAddress
  );
}

function _pingDestination(
uint64 expiryTimestamp,
uint64 destGasPrice,
uint64 ackGasPrice,
uint64 chainType,
string memory chainId,
bytes[] memory payloads,
bytes[] memory addresses,
bytes memory asmModuleAddress
  ) internal returns(uint64){
  Utils.RequestArgs memory requestArgs = Utils.RequestArgs(
    expiryTimestamp,
    false
  );
  Utils.DestinationChainParams memory destChainParams = Utils
    .DestinationChainParams(
      destGasLimit,
      destGasPrice,
      chainType,
      chainId,
      asmModuleAddress
    );
  lastEventIdentifier = gatewayContract.requestToDest(
    requestArgs,
    Utils.AckType.ACK_ON_SUCCESS,
    Utils.AckGasParams(ackGasLimit, ackGasPrice),
    destChainParams,
    Utils.ContractCalls(payloads, addresses)
  );

  return lastEventIdentifier;
}

function handleRequestFromSource(
  bytes memory, //srcContractAddress,
  bytes memory payload,
  string memory srcChainId,
  uint64 srcChainType
  ) external override returns (bytes memory) {
  require(msg.sender == address(gatewayContract));

  string memory sampleStr = abi.decode(payload, (string));

  if (
    keccak256(abi.encodePacked(sampleStr)) == keccak256(abi.encodePacked(""))
  ) {
    revert CustomError("String should not be empty");
  }
  greeting = sampleStr;
  return abi.encode(srcChainId, srcChainType);
}

function handleCrossTalkAck(
  uint64 eventIdentifier,
  bool[] memory execFlags,
  bytes[] memory execData
  ) external override {
  require(lastEventIdentifier == eventIdentifier);
  bytes memory _execData = abi.decode(execData[0], (bytes));

  (string memory chainID, uint64 chainType) = abi.decode(
    _execData,
    (string, uint64)
  );

  emit ExecutionStatus(eventIdentifier, execFlags[0]);
  emit ReceivedSrcChainIdAndType(chainType, chainID);
}

function toBytes(address a) public pure returns (bytes memory b){
  assembly {
      let m := mload(0x40)
      a := and(a, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
      mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
      mstore(0x40, add(m, 52))
      b := m
    }
}
}

```
