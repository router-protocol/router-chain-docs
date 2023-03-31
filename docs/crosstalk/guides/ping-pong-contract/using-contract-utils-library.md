---
title: Using Router CrossTalk Utils Library
sidebar_position: 2
description: A simple ping pong contract using Router CrossTalkUtils Library
---

In this section we will go through how a simple cross-chain ping-pong dApp can be created by integrating the Router GatewayUtils library.

### Installing the dependencies:

Install the evm-gateway contracts with the following command:

`yarn add @routerprotocol/evm-gateway-contracts`  or  `npm install @routerprotocol/evm-gateway-contracts`
- Make sure you're using version `1.0.5`.

and 

`yarn add @routerprotocol/router-crosstalk-utils`  or  `npm install @routerprotocol/router-crosstalk-utils`
- Make sure you're using version `1.0.5`.

### Instantiating the contract:

```javascript
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/ICrossTalkApplication.sol";
import "@routerprotocol/router-crosstalk-utils/contracts/CrossTalkUtils.sol";

contract PingPong is ICrossTalkApplication, IAdditionalSecurityModule {
}
```

1. Import the ICrossTalkApplication.sol from `@routerprotocol/evm-gateway-contracts/contracts`.
2. Import CrossTalkUtils.sol from `@routerprotocol/router-crosstalk-utils/contracts`
3. Inherit the ICrossTalkApplication contract into your main contract <code>PingPong</code>.

### Creating state variables and the constructor

```javascript
IGateway public gatewayContract;
uint64 public destGasLimit;
uint64 public ackGasLimit;
uint64 public currentRequestId;
// srcChainType + srcChainId + requestId => pingFromSource
mapping(uint64 => mapping(string => mapping(uint64 => string)))
  public pingFromSource;
// requestId => ackMessage
mapping(uint64 => string) public ackFromDestination;

error CustomError(string message);
event PingFromSource(
  uint64 indexed srcChainType,
  string indexed srcChainId,
  uint64 indexed requestId,
  string message
);
event NewPing(uint64 indexed requestId);
event ExecutionStatus(uint64 eventIdentifier, bool isSuccess);
event ReceivedSrcChainIdAndType(uint64 chainType, string chainID);

constructor(
	address payable gatewayAddress, 
	uint64 _destGasLimit, 
	uint64 _ackGasLimit
) {
  gatewayContract = IGateway(gatewayAddress);
	destGasLimit = _destGasLimit;
	ackGasLimit = _ackGasLimit;
}
```

1. Create an instance to the **gateway** contract of type address. This will be the contract which will route your message to the Router Chain. 
2. Create a variable **destGasLimit** of type uint64 which indicates the amount of gas required to execute the function that will handle our cross-chain request on the destination chain. This can be easily calculated using any gas estimator. You can use [*hardhat-gas-reporter*](https://www.npmjs.com/package/hardhat-gas-reporter) plugin to calculate this. 
3. Create a variable **ackGasLimit** of type uint64 which indicates the amount of gas required to execute the callback function that will handle the acknowledgement coming back from to the source chain. This can be easily calculated using any gas estimator. You can use *[hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter)* plugin to calculate this.
4. Create a variable **currentRequestId** of type uint64 which indicates the number of last request that has been made from source chain.
5. Create a mapping **pingFromSource** to fetch the ping that we received on destination chain corresponding to source chain type, source chain id and request id.
6. Create a mapping **ackFromDestination** to fetch the acknowledgement that is received by source chain from destination chain after the cross-chain request has been successfully executed on the destination chain.
7. Create a custom error variable which can be used to throw custom errors.
8. Create an event **PingFromSource** with parameters source chain type, source chain id, request id and the string. We will use it to emit event while handling the request from source chain on the destination chain.
9. Create an event **NewPing** with request id as a parameter. This will be emitted after initiating the cross-chain request from source chain.
10. Create an event **ExecutionStatus** with parameters uint64 eventIdentifier and a bool isSuccess. We will use it to emit event when we handle the acknowledgement coming back to the source chain from the destination chain.
11. Create an event **ReceivedSrcChainIdAndType** with parameters uint64 chainType and string chainID. We will use it to emit event when we handle the acknowledgement coming back to the source chain from the destination chain.
12. Create the constructor with the address of gateway contract, the destination gas limit and the ack gas limit and set these variables inside the constructor.

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

### Sending a ping to the destination chain

```javascript
function pingDestination(
    uint64 chainType,
    string memory chainId,
    uint64 destGasPrice,
    uint64 ackGasPrice,
    address destinationContractAddress,
    string memory str,
    uint64 expiryDurationInSeconds,
    bytes memory asmAddress
  ) public payable {
    currentRequestId++;
    // creating the payload to be sent to the destination chain
    bytes memory payload = abi.encode(currentRequestId, str);

    Utils.DestinationChainParams memory destChainParams = Utils
      .DestinationChainParams(
        destGasLimit,
        destGasPrice,
        chainType,
        chainId,
        asmAddress
      );

    Utils.AckGasParams memory ackGasParams = Utils.AckGasParams(
      ackGasLimit,
      ackGasPrice
    );

    Utils.RequestArgs memory requestArgs = Utils.RequestArgs(
      uint64(block.timestamp) + expiryDurationInSeconds,
      false
    );

    CrossTalkUtils.singleRequestWithAcknowledgement(
      address(gatewayContract),
      requestArgs,
      Utils.AckType.ACK_ON_SUCCESS,
      ackGasParams,
      destChainParams,
      CrossTalkUtils.toBytes(destinationContractAddress),
      payload
    );

    emit NewPing(currentRequestId);
  }
```

1. Create a function with whatever name you want to call it. Here, we will call it the pingDestination function which accepts seven parameters: 
    1. **chainType:** Type of the destination chain. The values for chain types can be found [here](../../understanding-crosstalk/chainTypes).
    2. **chainId:** Chain ID of the destination chain in string format.
    3. **destGasPrice:** Gas price of the destination chain.
    4. **ackGasPrice:** Gas price of the source chain. 
    
    To get the gas price for a chain, you can use the following function:
    
    ```jsx
    // using ethers.js
    const gasPrice = await provider.getGasPrice();
    
    // using web3.js
    const gasPrice = web3.eth.getGasPrice().then((result) => {
    	console.log(web3.utils.fromWei(result, 'ether'))
    })
    ```
    
    5. **destinationContractAddress:** Address of the contract that will handle the payload on the destination chain. Basically the address on the destination chain which we are going to ping. This should be in bytes format. To convert contract address to bytes in solidity, check this [function](../../understanding-crosstalk/requestToDest#6-contractcalls).
    6. **str:** This is just the string that we want to send as payload to the destination contract. You can send any kind of data as per your requirements.
    7. **expiryDurationInSeconds:** The duration in seconds for which the cross-chain request created after calling this function remains valid. If the expiry duration elapses before the request is executed on the destination chain contract, the request will fail. If you don’t want to keep any expiry timestamp, just send a very large number (a trillion will do) and your request will never expire.
    8. **asmAddress:** The address (in bytes format) of Additional Security Module (ASM) contract that acts as a plugin which enables users to seamlessly integrate their own security mechanism into their DApp. If user has not integrated ASM into his DApp , this field can be passed with empty bytes string like this ("0x")
2. **Create the payload:** Here, we only want to send a ping with a message. That is why we will just abi encode the string we want to send and set it as the payload. However, you are not limited to just sending a string, you can send any kind of data you want. Just abi encode those data and set it as payload.
3. **Calling the CrossTalk Utils library’s function to generate a cross-chain communication request:** Now the time has come for us to generate a cross-chain communication request to the destination chain. Since we want to create only a single request to the destination chain, we will call the **singleRequestWithAcknowledgement** function of the CrossTalk Utils library with the required parameters which in turn will call the **requestToDest** function of the Gateway contract. The documentation for this function can be found [here](../../understanding-crosstalk/requestToDest).
    
    This function returns the nonce of the cross-chain requests generated by the Gateway contract. We will store this nonce into the lastEventIdentifier variable. Now, we have successfully generated a cross-chain request to ping the destination chain contract.

### Handling a cross-chain request

Now since we know how we can create a cross-chain communication request from the source chain, we will now handle that request on the destination chain. We will be deploying the same contract on both the source and the destination chains, so we need to create the functionality to handle the cross-chain communication request here. 

```javascript
function handleRequestFromSource(
    bytes memory, //srcContractAddress,
    bytes memory payload,
    string memory srcChainId,
    uint64 srcChainType
  ) external override returns (bytes memory) {
    require(msg.sender == address(gatewayContract));

    (uint64 requestId, string memory sampleStr) = abi.decode(
      payload,
      (uint64, string)
    );

    if (
      keccak256(abi.encodePacked(sampleStr)) == keccak256(abi.encodePacked(""))
    ) {
      revert CustomError("String should not be empty");
    }

    pingFromSource[srcChainType][srcChainId][requestId] = sampleStr;

    emit PingFromSource(srcChainType, srcChainId, requestId, sampleStr);

    return abi.encode(requestId, sampleStr);
  }
```

1. Create a function named **handleRequestFromSource** and here, the name matters. The function signature, i.e. the name and the parameters it receive has to be the same since this function is called by the Gateway contract on the destination chain and if the name or the parameters to this function changes, the call will fail. The details about the parameters to this function is explained [here](../../understanding-crosstalk/handleRequestFromSource) in detail.
2. First, we will check that the request can only be sent by the Gateway contract. No other contract or wallet should be able to call this function. We should also check that the request is received from our contract only from the source chain but for simplicity I have not added that condition. You can add it simply by mapping the contract addresses by their chain type and chain ID and checking that the <code>srcContractAddress</code> is equal to the address stored in the map for source chain type and chain ID. We are leaving this as an exercise for you.
3. Since the request was generated by us, we know exactly what is received inside the payload. Since we sent a uint64 and a string, we will decode it and store it in a <code>pingFromSource</code> mapping.
4. If the string sent from the source chain is empty, we throw a custom error and this will trigger an error acknowledgement to the Router Chain. 
5. We will now set the greeting if the sampleStr string is non-empty and return the abi encoded request id and string received with the function. This will trigger a success acknowledgement to the Router Chain.

We can return any  data from this function which we might use while handling acknowledgement on the source chain.

Now we have handled the request on the destination chain. Now we would like to handle the acknowledgement too on the source chain so that we are able to do some operations based on the acknowledgement we receive.

### Handling the acknowledgement received from destination chain

When the cross-chain request is executed on the destination chain, the destination chain contract triggers an acknowledgement to the source chain. Since we opted to handle the acknowledgement on success when we triggered a cross-chain request, we will have to create a function to handle the acknowledgement.

```javascript
function handleCrossTalkAck(
    uint64 eventIdentifier,
    bool[] memory execFlags,
    bytes[] memory execData
  ) external override {
    bytes memory _execData = abi.decode(execData[0], (bytes));

    (uint64 requestId, string memory ackMessage) = abi.decode(
      _execData,
      (uint64, string)
    );

    ackFromDestination[requestId] = ackMessage;

    emit ExecutionStatus(eventIdentifier, execFlags[0]);
    emit AckFromDestination(requestId, ackMessage);
  }
```

1. Create a function named **handleCrossTalkAck** and here, the name matters. The function signature, i.e. the name and the parameters it receive has to be the same since this function is called by the Gateway contract on the destination chain and if the name or the parameters to this function changes, the call will fail. The details about the parameters to this function is explained [here](../../understanding-crosstalk/handleCrossTalkAck) in detail.
2. In the **eventIdentifier,** we receive the nonce which was returned from the **requestToDest** function of the Gateway contract when the request originated from source chain.
3. Since we sent only one call, 
    1. **if the execution was successful on the destination chain:**
        
        We will get <code>[true]</code> in execFlags and <code>[abi.encode(abi.encode(sourceChainType, sourceChainId))]</code> in execData as we sent this as return value in handleRequestFromSource function.
        
    2. **If the execution failed on the destination chain:**
        
        We will get <code>[false]</code> in execFlags and <code>[abi.encode(errorBytes)]</code> in execData where error bytes correspond to the error that was thrown on the destination chain contract.
        
    Since we sent abi.encode(srcChainId, srcChainType) as return values from the destination chain’s **handleRequestFromSource** function, we can decode it here in the **handleCrossTalkAck** function. First we decode the execData[0] where the return value has come in. We decode it as bytes first. And then decode it into the chainID and chainType of the respective types. In this way, you can get the data back from the source chain.
    

In this way, we can create a simple ping pong smart contract using the Router CrossTalk Utils library.

<details>
<summary><b>Full Contract Example</b></summary>

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/ICrossTalkApplication.sol";
import "@routerprotocol/router-crosstalk-utils/contracts/CrossTalkUtils.sol";

contract PingPong is ICrossTalkApplication {
  address public owner;
  uint64 public currentRequestId;
  IGateway public gatewayContract;
  uint64 public destGasLimit;
  uint64 public ackGasLimit;
  mapping(uint64 => mapping(string => mapping(uint64 => string)))
    public pingFromSource;
  mapping(uint64 => string) public ackFromDestination;

  error CustomError(string message);

  event PingFromSource(
    uint64 indexed srcChainType,
    string indexed srcChainId,
    uint64 indexed requestId,
    string message
  );
  event NewPing(uint64 indexed requestId);
  event ExecutionStatus(uint64 indexed eventIdentifier, bool isSuccess);
  event AckFromDestination(uint64 indexed requestId, string ackMessage);

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

  function pingDestination(
    uint64 chainType,
    string memory chainId,
    uint64 destGasPrice,
    uint64 ackGasPrice,
    address destinationContractAddress,
    string memory str,
    uint64 expiryDurationInSeconds,
    bytes memory asmAddress
  ) public payable {
    currentRequestId++;
    // creating the payload to be sent to the destination chain
    bytes memory payload = abi.encode(currentRequestId, str);

    Utils.DestinationChainParams memory destChainParams = Utils
      .DestinationChainParams(
        destGasLimit,
        destGasPrice,
        chainType,
        chainId,
        asmAddress
      );

    Utils.AckGasParams memory ackGasParams = Utils.AckGasParams(
      ackGasLimit,
      ackGasPrice
    );

    Utils.RequestArgs memory requestArgs = Utils.RequestArgs(
      uint64(block.timestamp) + expiryDurationInSeconds,
      false
    );

    CrossTalkUtils.singleRequestWithAcknowledgement(
      address(gatewayContract),
      requestArgs,
      Utils.AckType.ACK_ON_SUCCESS,
      ackGasParams,
      destChainParams,
      CrossTalkUtils.toBytes(destinationContractAddress),
      payload
    );

    emit NewPing(currentRequestId);
  }

  function setDappMetadata(string memory FeePayer) public {
    require(msg.sender == owner, "Only owner can set dapp metadata");
    gatewayContract.setDappMetadata(FeePayer);
  }

  function handleRequestFromSource(
    bytes memory, //srcContractAddress,
    bytes memory payload,
    string memory srcChainId,
    uint64 srcChainType
  ) external override returns (bytes memory) {
    require(msg.sender == address(gatewayContract));

    (uint64 requestId, string memory sampleStr) = abi.decode(
      payload,
      (uint64, string)
    );

    if (
      keccak256(abi.encodePacked(sampleStr)) == keccak256(abi.encodePacked(""))
    ) {
      revert CustomError("String should not be empty");
    }

    pingFromSource[srcChainType][srcChainId][requestId] = sampleStr;

    emit PingFromSource(srcChainType, srcChainId, requestId, sampleStr);

    return abi.encode(requestId, sampleStr);
  }

  function handleCrossTalkAck(
    uint64 eventIdentifier,
    bool[] memory execFlags,
    bytes[] memory execData
  ) external override {
    bytes memory _execData = abi.decode(execData[0], (bytes));

    (uint64 requestId, string memory ackMessage) = abi.decode(
      _execData,
      (uint64, string)
    );

    ackFromDestination[requestId] = ackMessage;

    emit ExecutionStatus(eventIdentifier, execFlags[0]);
    emit AckFromDestination(requestId, ackMessage);
  }
}

```

</details>
