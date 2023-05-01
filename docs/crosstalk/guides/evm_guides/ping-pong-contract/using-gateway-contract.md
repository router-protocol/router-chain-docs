---
title: Using Gateway Contract Directly
sidebar_position: 1
description: A simple ping pong contract using Router Gatway contracts
---

In this section we will go through how a simple cross-chain ping-pong dApp can be created by integrating the Router Gateway contracts directly.

### Installing the dependencies

Install the evm-gateway contracts with the following command:
`yarn add @routerprotocol/evm-gateway-contracts` or `npm install @routerprotocol/evm-gateway-contracts`

- Make sure you're using latest version of the gateway contracts.

### Instantiating the contract

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/Utils.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

contract PingPong is IDapp {

}
```

1. Import the IGateway.sol, IDapp.sol and Utils.sol from `@routerprotocol/evm-gateway-contracts/contracts`.
2. Import the SafeERC20.sol from `@openzeppelin/contracts/token/ERC20/utils`.
3. Inherit the IDapp contract into your main contract (PingPong).

### Creating state variables and the constructor

```javascript
  using SafeERC20 for IERC20;

  IGateway public gatewayContract;
  address public owner;
  uint64 public currentRequestId;

  // source chain id + request ID -> ping from source
  mapping(string => mapping(uint64 => string)) public pingFromSource;

  // request Id -> ack from destination
  mapping(uint64 => string) public ackFromDestination;

error CustomError(string message);
event NewPing(uint64 indexed requestId);
event PingFromSource(
    string indexed srcChainId,
    uint64 indexed requestId,
    string message
  );
event ExecutionStatus(uint256 eventIdentifier, bool isSuccess);
event AckFromDestination(uint64 indexed requestId, string ackMessage);

constructor(address payable gatewayAddress, string memory feePayerAddress) {
    owner = msg.sender;

    gatewayContract = IGateway(gatewayAddress);

    gatewayContract.setDappMetadata(feePayerAddress);
  }
```

1. Create an instance to the **gateway** contract of type IGateway. This will be the contract which will route your message to the Router Chain.
2. Create a variable **owner** of type address which we will be using for putting admin controls over certain functions.
3. Create a variable **currentRequestId** of type uint64 which will be acting like a counter of requests we make from source chain and use it for fetching **ping from source chain** on the destination side and **ack from destination chain** on the source side.
4. Create a mapping **pingFromSource** with keys as source chain Id and request Id to fetch the string/greeting received from the source chain on the destination side.
5. Create a mapping **ackFromDestination** with key as the request Id to fetch the acknowledgement string received from destination chain on the source side.
6. Create a **custom error** variable which can be used to throw custom errors.
7. Create an event **NewPing** with parameter uint64 requestId. We will use it to emit event when we send a cross-chain request from the source chain.
8. Create an event **PingFromSource** with parameters string srcChainId, uint64 requestId and string message. We will use it to emit event when we receive the request on destination chain.
9. Create an event **ExecutionStatus** with parameters uint256 eventIdentifier and a bool isSuccess. We will use it to emit event when we handle the acknowledgement coming back to the source chain from the destination chain.
10. Create an event **AckFromDestination** with parameters uint64 requestId and string ackMessage. We will use it to emit event when we handle the acknowledgement coming back to the source chain from the destination chain.
11. Create the constructor with the address of gateway contract and the feepayer address in string format and set these variables inside the constructor.

### Setting the fee payer address through setDappMetadata function

```javascript
function setDappMetadata(
    string memory FeePayer
    ) public {
    require(msg.sender == owner, "Only owner can set the metadata");
    gatewayContract.setDappMetadata(FeePayer);
  }
```

We have a function `setDappMetadata` in our gateway contract that takes the address of the fee payer on router chain from which the cross-chain fee will be deducted. User has to call the function as shown in the code snippet above. After the fee payer address is set, the fee payer has to provide approval on the router chain that this address is willing to pay fees for this Dapp thus enabling the Dapp to actually perform the cross-chain transaction. Note that all the fee refunds will be credited to this fee payer address.

### Setting the gateway address through setGateway function

```javascript
function setGateway(address gateway) external {
    require(msg.sender == owner, "only owner");
    gatewayContract = IGateway(gateway);
  }
```

This is an administrative function which sets the address of the gateway contract. This can be used in case when the gateway address with which you deployed your contract initially has now been changed.

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

1.  Create a function with whatever name you want to call it. Here, we will call it the iPing function which accepts six parameters:

    1. **destChainId:** Chain ID of the destination chain in string format.
    2. **destinationContractAddress:** Address of the corresponding contract on destination chain in bytes format which will handle the payload.
    3. **str:** This is just the string that we want to send as payload to the destination contract. You can send any kind of data as per your requirements.
    4. **requestMetadata:** Abi-encoded metadata according to source and destination chains. To get the request Metadata, you can add and use the following function in your contract:

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

       Request metadata includes eight parameters which are to be Abi-encoded and sent along with the iPing function to generate a cross-chain communication request.

       1. **destGasLimit:** The amount of gas required to execute the function that will handle our cross-chain request on the destination chain. This can be easily calculated using any gas estimator. You can use [_hardhat-gas-reporter_](https://www.npmjs.com/package/hardhat-gas-reporter) plugin to calculate this.
       2. **destGasPrice:** The amount of gas price required to execute the function that will handle our cross-chain request on the destination chain. To get the gas price for a chain, you can use the following function:

       ```jsx
       // using ethers.js
       const gasPrice = await provider.getGasPrice();

       // using web3.js
       const gasPrice = web3.eth.getGasPrice().then((result) => {
         console.log(web3.utils.fromWei(result, 'ether'));
       });
       ```

       3. **ackGasLimit:** The amount of gas required to execute the function that will handle our acknowledgement on the source chain. This can be easily calculated using any gas estimator. You can use [_hardhat-gas-reporter_](https://www.npmjs.com/package/hardhat-gas-reporter) plugin to calculate this.
       4. **ackGasPrice:** The amount of gas price required to execute the function that will handle our acknowledgement on the source chain. To get the gas price for a chain, you can use the following function:

       ```jsx
       // using ethers.js
       const gasPrice = await provider.getGasPrice();

       // using web3.js
       const gasPrice = web3.eth.getGasPrice().then((result) => {
         console.log(web3.utils.fromWei(result, 'ether'));
       });
       ```

       5. **relayerFees:** This is similar to priority fees that one pays on other chains. Router chain relayers execute your requests on the destination chain. So if you want your request to be picked up by relayer faster, this should be set to a higher number. If you pass really low amount, the Router chain will adjust it to some minimum amount.
       6. **ackType:** When the contract calls have been executed on the destination chain, the iDapp has the option to get an acknowledgement back to the source chain. We provide the option to the user to be able to get this acknowledgement from the router chain to the source chain and perform some operation based on it.

          1. **ackType = 0:** You don’t want the acknowledgement to be forwarded back to the source chain.
          2. **ackType = 1:** You only want to receive the acknowledgement back to the source chain in case the calls executed successfully on the destination chain and perform some operation after that.
          3. **ackType = 2:** You only want to receive the acknowledgement back to the source chain in case the calls errored on the destination chain and perform some operation after that.
          4. **ackType = 3:** You only want to receive the acknowledgement back to the source chain in both the cases (success and error) and perform some operation after that.

    5. **isReadCall:** We provide you the option to query a contract from another chain and get the data back on the source chain through acknowledgement. If you just want to query a contract on destination chain, set this to true.
    6. **asmAddress:** The address (in bytes format) of Additional Security Module (ASM) contract that acts as a plugin which enables users to seamlessly integrate their own security mechanism into their DApp. If user has not integrated ASM into his DApp , this field can be passed with empty bytes string like this ("0x"). Read more about ASM [here](../../../understanding-crosstalk/additionalSecurityModule.md)

2.  **Upating current request Id:** As we call the `iPing` function, we update the current request Id.
3.  **Create the payload packet:** Here, we want to send a ping with our current request Id and a message. That is why we will just abi encode them and set it as the payload packet. However, you are not limited to just sending a request id or string, you can send any kind of data you want. Just abi encode those data and set it as payload.
4.  **Create the request packet:** We will just abi-encode the destination contract address that we got in our parameters and the payload packet we created in the previous step and set it as the request packet.
5.  **Calling the gateway Contract to generate a cross-chain communication request:** Now the time has come for us to generate a cross-chain communication request to the destination chain. Now we will call the <code>iSend</code> function of thr gateway contract with the required parameters. The documentation for this function can be found [here](../../../understanding-crosstalk/evm_guides/iSend.md).

### Handling a cross-chain request

Now since we know how we can create a cross-chain communication request from the source chain, we will now receive and handle that request on the destination chain. We will be deploying the same contract on both the source and the destination chains, so we need to create the functionality to handle the cross-chain communication request here.

```javascript
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

    if (
      keccak256(abi.encodePacked(sampleStr)) == keccak256(abi.encodePacked(""))
    ) {
      revert CustomError("String should not be empty");
    }

    pingFromSource[srcChainId][requestId] = sampleStr;

    emit PingFromSource(srcChainId, requestId, sampleStr);

    return abi.encode(requestId, sampleStr);
  }
```

1. Create a function named **iReceive** and here, the name matters. The function signature, i.e. the name and the parameters it receive has to be the same since this function is called by the Gateway contract on the destination chain and if the name or the parameters to this function changes, the call will fail. The details about the parameters to this function is explained [here](../../../understanding-crosstalk/evm_guides/iReceive.md) in detail.
2. First, we will check that the request can only be sent by the Gateway contract. No other contract or wallet should be able to call this function. We should also check that the request is received from our contract only from the source chain but for simplicity I have not added that condition. You can add it simply by mapping the contract addresses by chain ID and checking that the <code>srcContractAddress</code> is equal to the address stored in the map for source chain type and chain ID. We are leaving this as an exercise for you.
3. Since the request was generated by us, we know exactly what is received inside the payload. Since we sent just a string, we will decode it and store it in a <code>requestId</code> uint64 variable and a <code>sampleStr</code> string variable.
4. We will first check if the string that we received in not empty. If it is empty, it will throw a custom error and this will trigger a failure acknowledgement to the Router Chain.
5. We will now set the string message in `pingFromSource` mapping, emit the `PingFromSource` event with srcChainId, requestId and the string message and return the abi encoded request ID and string message received with the function. This will trigger a success acknowledgement to the Router Chain.

Now we have handled the request on the destination chain. Now we would like to handle the acknowledgement too on the source chain so that we are able to do some operations based on the acknowledgement we receive.

### Handling the acknowledgement received from destination chain

When the cross-chain request is executed on the destination chain, the destination chain contract triggers an acknowledgement to the source chain. Since we opted to handle the acknowledgement on success when we triggered a cross-chain request, we will have to create a function to handle the acknowledgement.

```javascript
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
```

1. Create a function named **iAck** and here, the name matters. The function signature, i.e. the name and the parameters it receive has to be the same since this function is called by the Gateway contract on the destination chain and if the name or the parameters to this function changes, the call will fail. The details about the parameters to this function is explained [here](../../../understanding-crosstalk/evm_guides/iAck.md) in detail.
2. In the **requestIdentifier** we receive the nonce which was returned from the Gateway contract when the request originated from source chain.
3. Since we sent only one call,

   1. **if the execution was successful on the destination chain:**

      We will get <code>[true]</code> in execFlag and <code>(abi.encode(requestId, sampleString))</code> in execData as we sent this as return value in iReceive function.

   2. **If the execution failed on the destination chain:**

      We will get <code>[false]</code> in execFlag and <code>[abi.encode(errorBytes)]</code> in execData where error bytes correspond to the error that was thrown on the destination chain contract.

   Since we sent <code>abi.encode(requestId, sampleStr)</code> as return values from the destination chain’s **iReceive** function, we can decode it here in the **iAck** function. We decode the execData where the return value has come in. In this way, you can get the data back from the source chain.

In this way, we can create a simple ping pong smart contract using the Router CrossTalk.

<details>
<summary><b>Full Contract Example</b></summary>

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

    if (
      keccak256(abi.encodePacked(sampleStr)) == keccak256(abi.encodePacked(""))
    ) {
      revert CustomError("String should not be empty");
    }

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

</details>
