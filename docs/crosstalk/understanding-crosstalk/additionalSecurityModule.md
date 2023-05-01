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

### Sample Delayed Execution ASM Contract

A Delayed Execution ASM delays a request by a certain time period if verifyCrossChainRequest returns false. After the request is delayed, in the mean time owner has the flexibility to reject the transaction if there is something malicious or invalid with the transaction.

```javascript
// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0 <0.9.0;
import "@routerprotocol/evm-gateway-contracts/contracts/IAdditionalSecurityModule.sol";

/// @title Delayed Execution
/// @notice This contract enables user to delay a request by a certain time period
/// and in the mean time owner has the flexibility to reject the transaction if
/// there is something mallicious or invalid with it
contract DelayASM is IAdditionalSecurityModule {
    mapping(bytes32 => bool) public delayedTransfers; // request id => bool(if it is delayed or not)
    address public gatewayContract; // address of the gateway contract
    uint256 public delayPeriod; // time period by which the transaction shall be delayed
    address public owner; // address of the owner of the contract

    constructor(address gatewayAddress, uint256 _delayPeriod) {
        gatewayContract = gatewayAddress;
        owner = msg.sender;
        delayPeriod = _delayPeriod;
    }

    ///@notice This is a function that sets the time period by which the tx shall be delayed
    ///@notice This can only be set by the owner of the contract
    ///@param _delayPeriod time period in seconds
    function setDelayPeriod(uint256 _delayPeriod) external {
        require(msg.sender == owner, "Caller is not owner");
        delayPeriod = _delayPeriod;
    }

    ///@notice This is a function that allows the owner to reject a tx when it has been delayed
    ///@notice This can only be called by the owner of the contract
    ///@param id This is the request id
    function rejectRequest(bytes32 id) external {
        require(msg.sender == owner);
        delayedTransfers[id] = true;
    }

    ///@notice This is an internal function that checks if a request has been delayed
    ///@param id This is the request id
    ///@return Returns true if the request is rejected and false if not rejected
    function isRequestRejected(bytes32 id) internal view returns (bool) {
        return delayedTransfers[id];
    }

    ///@notice This is an internal function that validates if a tx needs to be delayed
    ///@notice or if a tx has already passed its delay period
    ///@param requestTimestamp This is the request timestamp when this request was added/verified on the Router chain.
    ///@return Returns true if the request has surpassed its delay period
    function _validateDelay(
        uint256 requestTimestamp
    ) internal view returns (bool) {
        if (block.timestamp > requestTimestamp + delayPeriod) {
            return true;
        } else {
            revert("Transaction needs to be delayed");
        }
    }

    ///@notice This is a function triggered by Router's gateway contract to execute waiting period.
    ///@notice This function can only be called by the gateway contract
    ///@return Returns true if tx does not need to be delayed or if a tx has already surpassed its delay period
    /// and false if it is rejected by the owner.
    function verifyCrossChainRequest(
        uint256 eventNonce,
        uint256 requestTimestamp,
        string memory srcContractAddress,
        string memory srcChainId,
        bytes memory payload,
        address handler
    ) external view returns (bool) {
        require(msg.sender == gatewayContract, "Caller is not gateway");
        bytes32 id = keccak256(
            abi.encode(
                eventNonce,
                requestTimestamp,
                srcContractAddress,
                srcChainId,
                payload,
                handler
            )
        );
        // TODO: add your business logic here
        bool isRejected = isRequestRejected(id);
        if (isRejected) {
            return !isRejected;
        }
        _validateDelay(requestTimestamp);
        return !isRejected;
    }
}
```

- The owner of the ASM contract can set the `delayPeriod`, which is the time period that must pass before transactions can be executed on the destination contract after they have been validated on the router chain.
  ```jsx
  function setDelayPeriod(uint256 _delayPeriod) external {
      require(msg.sender == owner, "Caller is not owner");
      delayPeriod = _delayPeriod;
  }
  ```
- The verifyCrossChainRequest function is called from the gateway before calling the destination contract. It checks whether the transaction has been rejected by the owner of the ASM contract and whether the transaction is delayed or has reached the delay period, by calling the _validateDelay function.
  ```jsx
  function verifyCrossChainRequest(
  uint256 eventNonce,
  uint256 requestTimestamp,
  string memory srcContractAddress,
  string memory srcChainId,
  bytes memory payload,
  address handler
  ) external view returns (bool) {
  require(msg.sender == gatewayContract, "Caller is not gateway");
  bytes32 id = keccak256(
      abi.encode(
          eventNonce,
          requestTimestamp,
          srcContractAddress,
          srcChainId,
          payload,
          handler
      )
  );
  // TODO: add your business logic here
  bool isRejected = isRequestRejected(id);
  if (isRejected) {
      return !isRejected;
  }
  _validateDelay(requestTimestamp);
  return !isRejected;
  }
  ```
- The owner of the contract can reject a transaction by its ID, which is the ABI-encoded function arguments in order.
  ```jsx
  function rejectRequest(bytes32 id) external {
        require(msg.sender == owner);
        delayedTransfers[id] = true;
    }
  ```
- The `isRequestRejected`function checks whether a transaction has been rejected by the owner or not.
  ```jsx
  function isRequestRejected(bytes32 id) internal view returns (bool) {
      return delayedTransfers[id];
  }
  ```
- - The `_validateDelay` function determines whether a transaction is delayed or not. If it is delayed, the function reverts to notify the gateway to wait for some time before trying again.

    ```jsx
    function _validateDelay(
        uint256 requestTimestamp
    ) internal view returns (bool) {
        if (block.timestamp > requestTimestamp + delayPeriod) {
            return true;
        } else {
            revert("Transaction needs to be delayed");
        }
    }
    ```

### How to integrate ASM into your application?

- Let us understand how you can integrate custom ASM into your application through a simple cross-chain Ping-Pong Dapp.
- For your information, ping-pong is an app where we can send a message from the source chain to a destination chain and receive back the acknowledgment from the destination chain. So basically, we will send a ping to the destination chain and receive a pong back to the source chain.
- After you have deployed your application contract (Ping-pong) and your ASM contract(sample provided in the previous section) on respective chains, you just need to provide the address for the ASM contract deployed on the destination chain in the bytes format while initiating a cross-chain request from the source chain in the request metadata. In the example below, we are doing the same in `iPing` function.
- Code snippet for the Ping-pong is given below:

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/IGateway.sol";
import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/Utils.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title PingPong
/// @notice This is a cross-chain ping pong smart contract to demonstrate how one can
/// utilise Router CrossTalk for cross-chain transactions.
contract PingPong is IDapp {
  using SafeERC20 for IERC20;
  address public owner;
  uint64 public currentRequestId;

  // srcChainId + requestId => pingFromSource
  mapping(string => mapping(uint64 => string)) public pingFromSource;
  // requestId => ackMessage
  mapping(uint64 => string) public ackFromDestination;

  // instance of the Router's gateway contract
  IGateway public gatewayContract;

  // gas limit required to handle the cross-chain request on the destination chain.
  uint64 public _destGasLimit;

  // gas limit required to handle the acknowledgement received on the source
  // chain back from the destination chain.
  uint64 public _ackGasLimit;

  // custom error so that we can emit a custom error message
  error CustomError(string message);

  // event we will emit while sending a ping to destination chain
  event PingFromSource(
    string indexed srcChainId,
    uint64 indexed requestId,
    string message
  );
  event NewPing(uint64 indexed requestId);

  // events we will emit while handling acknowledgement
  event ExecutionStatus(uint256 indexed eventIdentifier, bool isSuccess);
  event AckFromDestination(uint64 indexed requestId, string ackMessage);

  constructor(address payable gatewayAddress, string memory feePayerAddress) {
    owner = msg.sender;

    gatewayContract = IGateway(gatewayAddress);

    gatewayContract.setDappMetadata(feePayerAddress);
  }

  /// @notice function to set the fee payer address on Router Chain.
  /// @param feePayerAddress address of the fee payer on Router Chain.
  function setDappMetadata(string memory feePayerAddress) external {
    require(msg.sender == owner, "only owner");
    gatewayContract.setDappMetadata(feePayerAddress);
  }

  /// @notice function to set the Router Gateway Contract.
  /// @param gateway address of the gateway contract.
  function setGateway(address gateway) external {
    require(msg.sender == owner, "only owner");
    gatewayContract = IGateway(gateway);
  }

  /// @notice function to generate a cross-chain request to ping a destination chain contract.
  /// @param destChainId chain ID of the destination chain in string.
  /// @param destinationContractAddress contract address of the contract that will handle this
  /// @param str string to be pinged to destination
  /// @param requestMetadata abi-encoded metadata according to source and destination chains
  function iPing(
    string calldata destChainId,
    string calldata destinationContractAddress,
    string calldata str,
    bytes calldata requestMetadata
  ) public payable {
    currentRequestId++;

    bytes memory packet = abi.encode(currentRequestId, str);
    bytes memory requestPacket = abi.encode(destinationContractAddress, packet);
    gatewayContract.iSend{ value: msg.value }(
      1,
      0,
      string(""),
      destChainId,
      requestMetadata,
      requestPacket
    );
    emit NewPing(currentRequestId);
  }

  /// @notice function to get the request metadata to be used while initiating cross-chain request
  /// @return requestMetadata abi-encoded metadata according to source and destination chains
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

  /// @notice function to handle the cross-chain request received from some other chain.
  /// @param packet the payload sent by the source chain contract when the request was created.
  /// @param srcChainId chain ID of the source chain in string.
  function iReceive(
    string memory ,//requestSender,
    bytes memory packet,
    string memory srcChainId
  ) external override returns (bytes memory) {
    require(msg.sender == address(gatewayContract), "only gateway");
    (uint64 requestId, string memory sampleStr) = abi.decode(
      packet,
      (uint64, string)
    );
    pingFromSource[srcChainId][requestId] = sampleStr;

    emit PingFromSource(srcChainId, requestId, sampleStr);

    return abi.encode(requestId, sampleStr);
  }

  /// @notice function to handle the acknowledgement received from the destination chain
  /// back on the source chain.
  /// @param requestIdentifier event nonce which is received when we create a cross-chain request
  /// We can use it to keep a mapping of which nonces have been executed and which did not.
  /// @param execFlag a boolean value suggesting whether the call was successfully
  /// executed on the destination chain.
  /// @param execData returning the data returned from the handleRequestFromSource
  /// function of the destination chain.
  function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) external override {
    (uint64 requestId, string memory ackMessage) = abi.decode(
      execData,
      (uint64, string)
    );

    ackFromDestination[requestId] = ackMessage;

    emit ExecutionStatus(requestIdentifier, execFlag);
    emit AckFromDestination(requestId, ackMessage);
  }
}

```
