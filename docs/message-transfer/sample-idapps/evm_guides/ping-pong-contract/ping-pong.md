---
title: Ping-Pong
sidebar_position: 1
description: A simple ping pong contract using Router's Gateway contracts
---

Creating a cross-chain Ping Pong smart contract using the Router's CrossTalk.

### Installing the dependencies

Install the evm-gateway contracts with the following command:
`yarn add @routerprotocol/evm-gateway-contracts` or `npm install @routerprotocol/evm-gateway-contracts`

- Make sure to use the latest version of the gateway contracts.

### Instantiating the contract

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

contract PingPong {

}
```

1. Import the IGateway.sol, IDapp.sol and Utils.sol from `@routerprotocol/evm-gateway-contracts/contracts`.
2. Import the SafeERC20.sol from `@openzeppelin/contracts/token/ERC20/utils`.
3. Inherit the IDapp contract into your main contract (PingPong).

### Creating state variables and the constructor

```javascript
  address public owner;
  uint64 public currentRequestId;

  // srcChainId + requestId => pingFromSource
  mapping(string => mapping(uint64 => string)) public pingFromSource;
  // requestId => ackMessage
  mapping(uint64 => string) public ackFromDestination;

  // instance of the Router's gateway contract
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

1. Create a variable **owner** of type address which will be used for access control.
2. Create a variable **currentRequestId** of type uint64 which will act like a counter for requests routed from source chain and use it for fetching **ping from source chain** on the destination side and **ack from destination chain** on the source side.
3. Create a mapping **pingFromSource** with keys as source chain Id and request Id to fetch the string/greeting received from the source chain on the destination side.
4. Create a mapping **ackFromDestination** with key as the request Id to fetch the acknowledgement string received from destination chain on the source side.
5. Create an instance to the **gateway** contract of type IGateway. This will be the contract which will route the message to the destination chain through the Router chain.
6. Create a **custom error** variable which can be used to throw custom errors.
7. Create an event **NewPing** with parameter uint64 requestId. This will emit the request id whenever a new request is created.
8. Create an event **PingFromSource** with parameters string srcChainId, uint64 requestId and string message. It will be emitted when a cross-chain request is received on destination chain.
9. Create the constructor with the address of gateway contract and the feepayer address in string format and set these variables inside the constructor.

### Setting the fee payer address through setDappMetadata function

```javascript
function setDappMetadata(
    string memory FeePayer
    ) public {
    require(msg.sender == owner, "Only owner can set the metadata");
    gatewayContract.setDappMetadata(FeePayer);
  }
```

To enable the Dapp to perform cross-chain transactions, the application must specify the fee payer address on the Router chain from which the fee for such transactions will be deducted.

This can be done by calling the setDappMetadata function in the gateway contract, and passing the fee payer address as a parameter. Once the fee payer address is set, the fee payer must provide approval on the Router chain to confirm their willingness to pay fees for the Dapp.

It's important to note that any fee refunds will be credited to the fee payer address specified in the setDappMetadata function.

### Setting the gateway address through setGateway function

```javascript
function setGateway(address gateway) external {
    require(msg.sender == owner, "only owner");
    gatewayContract = IGateway(gateway);
  }
```

This is an administrative function which sets the address of the gateway contract. This function will be invoked whenever the Router's Gateway contract gets updated.

### Sending a ping to the destination chain

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

1.  Create a function named `iPing`. This will be used to send a ping (message) to the destination chain. The parameters for this function includes:

    1. **destChainId:** Chain ID of the destination chain in string format.
    2. **destinationContractAddress:** Address of the corresponding contract on destination chain in bytes format which will receive the ping.
    3. **str:** This is just the message that we want to send to the destination chain contract.
    4. **requestMetadata:** Abi-encoded metadata according to source and destination chains. To get the request metadata, the following function can be used:

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

    More details on Request Metadata can be found [here](../../../evm-guides/understanding-functions/iSend#5-requestmetadata).

2.  **Upating current request Id:** As the user calls the `iPing` function, the current request Id should be incremented.
3.  **Create the payload packet:** For the particular use case, the payload should contain the ping message and the request Id. Just abi encode these two parameters and set it as the payload packet.
4.  **Create the request packet:** Abi encode the destination contract address and the payload packet we created in the previous step and set it as the request packet.
5.  **Calling the gateway Contract to generate a cross-chain communication request:** Call the <code>iSend</code> function of the gateway contract with the required parameters. The documentation for this function can be found [here](../../evm-guides/understanding-functions/iSend).

### Handling a cross-chain request

Now that a cross-chain communication request has been created a from the source chain, the application needs to handle the request on the destination chain. To achieve this, create an `iReceive` function with the following signature:

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

1. It is important to name the function "iReceive" and ensure that its signature, including the name and parameters, remains the same. This is because the Gateway contract on the destination chain will call this function, and any changes to the name or parameters will result in a failed call. Further details on the parameters required for this function can be found [here](../../evm-guides/understanding-functions/iReceive) .
2. The first step is to ensure that only the Gateway contract can call the function, as no other contract or wallet should have access to it.
   To ensure that the request is received only from the application contract on the source chain, the application can create a mapping of allowed contract addresses for each chain ID. Then, in the iReceive function, the application can check that the requestSender is equal to the address stored in the mapping for the specific chain ID. For simplicity, this has not been implemented here.
3. Decode the packet using abi decoding and store it in a <code>requestId</code> uint64 variable and a <code>sampleStr</code> string variable.
4. Check if the received string in non-empty. If it is empty, it will throw a custom error and this will trigger a failure acknowledgement to the Router Chain.
5. Set the string message in `pingFromSource` mapping, emit the `PingFromSource` event with srcChainId, requestId and the string message and return the request ID and string message received with the function. This will trigger a success acknowledgement to the Router Chain.

Now the the request is handled on the destination chain, the acknowledgement needs to be handled on the source chain which is received from the destination chain.

### Handling the acknowledgement received from destination chain

When the cross-chain request is executed on the destination chain, the destination chain contract triggers an acknowledgement to the source chain. This acknowledgement can be handled using the following function:

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

1. The function named iAck should be created with the same function signature as specified in the documentation. This function is called by the Gateway contract on the source chain and the function name and parameters should not be changed as it would result in a failed call. Further information about this function can be found [here](../../../evm-guides/understanding-functions/iAck).

2. The **requestIdentifier** parameter received in the iAck function contains the nonce that was generated by the Gateway contract when the request was initiated on the source chain.

3. The exec flag tells the status of execution of cross-chain request on destination chain and exec data consists of the abi-encoded value returned from the `iReceive` function.

   1. **If the execution was successful on the destination chain:**

      execFlag: `[true]`
      execData: `(abi.encode(requestId, sampleString))`

   2. **If the execution failed on the destination chain:**

      execFlag: `[false]`
      execData: `[abi.encode(<error>)]`

In this way, A simple cross-chain ping pong smart contract can be created using the Router CrossTalk.

<details>
<summary><b>Full Contract Example</b></summary>

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

  // instance of the Router's gateway contract
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
  ) external {
    (uint64 requestId, string memory ackMessage) = abi.decode(
      execData,
      (uint64, string)
    );

    ackFromDestination[requestId] = ackMessage;
  }
}
```

</details>
