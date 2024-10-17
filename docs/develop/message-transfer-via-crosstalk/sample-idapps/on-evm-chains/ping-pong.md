---
title: Cross-chain Ping Pong
sidebar_position: 1
description: A simple ping pong dApp using Router CrossTalk
---

## Overview

In this section, we will create a cross-chain ping pong dApp using Router CrossTalk. Using this dApp, you can send any message (ping) from an EVM-based source chain to an EVM-based destination chain and receive an acknowledgment (pong) back to the source chain. 

----

## Step-by-Step Guide
<details>
<summary><b>Step 1) Installing the dependencies</b></summary>

Install the `evm-gateway` contracts with either of the following commands:
```bash
yarn add @routerprotocol/evm-gateway-contracts
```

```bash
npm install @routerprotocol/evm-gateway-contracts
```

:::tip
Make sure you're using the latest version of the Gateway contracts.
:::

</details>

<details>
<summary><b>Step 2) Instantiating the contract</b></summary>

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/Utils.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol"

contract PingPong {
}
```

1. Import the `IGateway.sol`, `IDapp.sol` and `Utils.sol` from `@routerprotocol/evm-gateway-contracts/contracts`.
2. Import the `SafeERC20.sol` from `@openzeppelin/contracts/token/ERC20/utils`.
3. Inherit the `IDapp` contract into your main contract (PingPong).

</details>

<details>
<summary><b>Step 3) Creating state variables and the constructor</b></summary>

```javascript
  address public owner;
  uint64 public currentRequestId;

  // srcChainId + requestId => pingFromSource
  mapping(string => mapping(uint64 => string)) public pingFromSource;
  // requestId => ackMessage
  mapping(uint64 => string) public ackFromDestination;

  // instance of the Router's Gateway contract
  IGateway public gatewayContract;

  // custom error so that we can emit a custom error message
  error CustomError(string message);

  // event we will emit while sending a ping to destination chain
  event PingFromSource(
    string indexed srcChainId,
    uint64 indexed requestId,
    string message
  );
  event NewPing(uint64 indexed requestId);

  constructor(address payable gatewayAddress, string memory feePayerAddress) {
    owner = msg.sender;

    gatewayContract = IGateway(gatewayAddress);

    gatewayContract.setDappMetadata(feePayerAddress);
  }
```

1. Create a variable `owner` of type `address` which will be used for access control.
2. Create a variable `currentRequestId` of type `uint64` which will act as a counter for requests routed from source chain. We'll use this variable for fetching **ping from the source chain** on the destination side and **ack from the destination chain** on the source side.
3. Create a mapping `pingFromSource` with keys `srcChainId` and `requestId` to fetch the string received from the source chain on the destination side.
4. Create a mapping `ackFromDestination` with `requestId` as a key to the acknowledgment string received from destination chain on the source side.
5. Create an instance to the `gatewayContract` of type `IGateway`. This will be the contract that will route the message to the destination chain.
6. Create a `CustomError` variable which can be used to throw custom errors.
7. Create an event `NewPing` with parameter `requestId` that will be emitted whenever a new request is created.
8. Create an event `PingFromSource` with parameters - `srcChainId`, `requestId` and `message`. It will be emitted when a cross-chain request is received on the destination chain.
9. Create the constructor with `gatewayAddress` and the `feePayerAddress` in string format.

</details>

<details>
<summary><b>Step 4) Setting the fee payer address</b></summary>

```javascript
function setDappMetadata(
    string memory FeePayer
    ) public {
    require(msg.sender == owner, "Only owner can set the metadata");
    gatewayContract.setDappMetadata(FeePayer);
  }
```

- To facilitate cross-chain transactions, it is necessary to pay the fees on the Router Chain. This can be achieved using the `setDappMetadata` function available in the Gateway contracts. The function takes a `feePayerAddress` parameter, which represents the account responsible for covering the transaction fees for any cross-chain requests originating from the dApp.
- Once the `feePayerAddress` is set, the designated fee payer must approve the request to act as the fee payer on the Router Chain. Without this approval, dApps will not be able to execute any cross-chain transactions.
- It's important to note that any fee refunds resulting from these transactions will be credited back to the dApp's `feePayerAddress` on the Router Chain.

</details>

<details>
<summary><b>Step 5) Setting the Gateway address</b></summary>

```javascript
function setGateway(address gateway) external {
    require(msg.sender == owner, "only owner");
    gatewayContract = IGateway(gateway);
  }
```

This is an administrative function which sets the address of the Gateway contract. This function should be invoked whenever Router's Gateway contract gets updated.

</details>

<details>
<summary><b>Step 6) Sending a ping to the destination chain</b></summary>

```javascript
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
```

- **Create a function named `iPing`:** This will be used to send a ping (message) to the destination chain. The parameters for this function includes:

    **1) `destChainId` -** Network ID of the destination chain in string format.
    
    **2) `destinationContractAddress` -** Address of the destination contract in `bytes` format.
    
    **3) `str` -** This is the message that we want to send to the destination chain contract.

    **4) `requestMetadata` -** Abi-encoded metadata based on the source and destination chains. To get the request metadata, the following function can be used:

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

    More details on `requestMetadata` can be found [here](../../evm-guides/idapp-functions/iSend#5-requestmetadata).

- **Update `currentRequestId`:** When a user calls the `iPing` function, the `currentRequestId` should be incremented.
- **Create the payload packet:** For our ping pong dApp, the payload should contain the ping message and the `requestId`. We'll need to abi-encode these two parameters and set it as the payload packet.
- **Create the request packet:** Abi-encode the `destinationContractAddress` and the payload packet we created in the previous step and set it as the request packet.
-  **Calling the Gateway Contract to generate a cross-chain request:** Call the `iSend` function of the Gateway contract with the required parameters. The documentation for this function can be found [here](../../evm-guides/idapp-functions/iSend).

</details>

<details>
<summary><b>Step 7) Handling a cross-chain request</b></summary>


Now that we have setup the contract to send a ping from the source chain, we need to implement an `iReceive` function handle the request on the destination chain. The `iReceive` function will include the following signature:

```javascript
function iReceive(
  string memory requestSender,
  bytes memory packet,
  string memory srcChainId
) external returns (uint64, string memory) {
  require(msg.sender == address(gatewayContract), "only gateway");
  (uint64 requestId, string memory sampleStr) = abi.decode(
    packet,
    (uint64, string)
  );
  pingFromSource[srcChainId][requestId] = sampleStr;

  emit PingFromSource(srcChainId, requestId, sampleStr);

  return (requestId, sampleStr);
}
```

- It is important to name the function `iReceive` and ensure that its signature, including the name and parameters, remains the same. This is because the Gateway contract on the destination chain will call this function, and any changes to the name or parameters will result in a failed call. Further details on the parameters required for this function can be found [here](../../evm-guides/idapp-functions/iReceive) .
- Ensure that only the Gateway contract can call the function, as no other contract or wallet should have access to it.
- To ensure that the request is received only from the application contract on the source chain, the application can create a mapping of allowed contract addresses for each chain ID. Then, in the `iReceive` function, the application can check that the `requestSender` is the same as the address stored in the mapping for the specific chain ID. To keep this contract as simple as possible, this condition has not been implemented here.
- Decode the packet using abi decoding and store it in `requestId` and `sampleStr` variables.
- Check if the string received in non-empty. If it is empty, throw a custom error which will trigger a failure acknowledgment to the Router Chain.
- Set the string message in `pingFromSource` mapping and emit the `PingFromSource` event with `srcChainId`, `requestId` and the string message. Finally, return the `requestId` and the received message from the function. This will trigger a success acknowledgment to the Router Chain.

Now that we have handled the request on the destination chain, we need to handle the acknowledgment on the source chain.

</details>

<details>
<summary><b>Step 8) Handling the acknowledgment received from destination chain</b></summary>

When the cross-chain request is executed on the destination chain, the destination contract triggers an acknowledgment to the source chain. This acknowledgment can be handled using the following function:

```javascript
function iAck(
  uint256 requestIdentifier,
  bool execFlag,
  bytes memory execData
) external {
  (uint64 requestId, string memory ackMessage) = abi.decode(
    execData,
    (uint64, string)
  );

  ackFromDestination[requestId] = ackMessage;
}
```

- The function named `iAck` should be created with the same function signature as specified in the documentation. This function is called by the Gateway contract on the source chain and the function name and parameters should not be changed as it would result in a failed call. Further information about this function can be found [here](../../evm-guides/idapp-functions/iAck).

2. The `requestIdentifier` parameter received in the `iAck` function contains the nonce that was generated by the Gateway contract when the request was initiated on the source chain.

3. The `execFlag` tells the execution status of the cross-chain request on the destination chain and `execData` consists of the abi-encoded value returned from the `iReceive` function.

   - **If the execution is successful on the destination chain:**  
      - `execFlag` - `[true]`
      - `execData` - `(abi.encode(<return_value>))`

    Since the return value is `uint256`, this `execData` can be decoded using abi decoding in the following way:

      ```javascript
      uint256 val = abi.decode(execData, (uint256));
      ```

   - **If the execution fails on the destination chain:**
      - `execFlag` - `[false]`
      - `execData` - `[abi.encode(<error>)]`


</details>

----

## Full Contract Example

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

/// @title PingPong
/// @author Yashika Goyal
/// @notice This is a cross-chain ping pong smart contract to demonstrate how one can
/// utilise Router CrossTalk for cross-chain transactions.
contract PingPong {
  address public owner;
  uint64 public currentRequestId;

  // srcChainId + requestId => pingFromSource
  mapping(string => mapping(uint64 => string)) public pingFromSource;
  // requestId => ackMessage
  mapping(uint64 => string) public ackFromDestination;

  // instance of the Router's Gateway contract
  IGateway public gatewayContract;

  // custom error so that we can emit a custom error message
  error CustomError(string message);

  // event we will emit while sending a ping to destination chain
  event PingFromSource(
    string indexed srcChainId,
    uint64 indexed requestId,
    string message
  );
  event NewPing(uint64 indexed requestId);

  // events we will emit while handling acknowledgment
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
  /// @param gateway address of the Gateway contract.
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
  /// @param requestSender address of the contract on source chain that initiated the request.
  /// @param packet the payload sent by the source chain contract when the request was created.
  /// @param srcChainId chain ID of the source chain in string.
  function iReceive(
    string memory requestSender,
    bytes memory packet,
    string memory srcChainId
  ) external returns (uint64, string memory) {
    require(msg.sender == address(gatewayContract), "only gateway");
    (uint64 requestId, string memory sampleStr) = abi.decode(
      packet,
      (uint64, string)
    );
    pingFromSource[srcChainId][requestId] = sampleStr;

    emit PingFromSource(srcChainId, requestId, sampleStr);

    return (requestId, sampleStr);
  }

  /// @notice function to handle the acknowledgment received from the destination chain
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
  ) external {
    (uint64 requestId, string memory ackMessage) = abi.decode(
      execData,
      (uint64, string)
    );

    ackFromDestination[requestId] = ackMessage;
  }
}
```

