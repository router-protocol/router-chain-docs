---
title: Using Gateway Contract Directly
sidebar_position: 1
description: A simple ping pong contract using Router Gatway contracts
---

In this section we will go through how a simple cross-chain ping-pong dApp can be created by integrating the Router Gateway contracts directly.

### Installing the dependencies

Install the evm-gateway contracts with the following command:
`yarn add @routerprotocol/evm-gateway-contracts` or `npm install @routerprotocol/evm-gateway-contracts`

- Make sure you're using version `1.0.5`.

### Instantiating the contract

```javascript
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/ICrossTalkApplication.sol";
import "@routerprotocol/router-crosstalk-utils/contracts/CrossTalkUtils.sol";

contract PingPong is ICrossTalkApplication {
}
```

1. Import the IGateway.sol, ICrossTalkApplication.sol and Utils.sol from `@routerprotocol/evm-gateway-contracts/contracts`.
2. Inherit the ICrossTalkApplication contract into your main contract (PingPong).

### Creating state variables and the constructor

```javascript
address public owner;
uint64 public currentRequestId;

// srcChainType + srcChainId + requestId => pingFromSource
mapping(uint64 => mapping(string => mapping(uint64 => string)))
    public pingFromSource;
// requestId => ackMessage
mapping(uint64 => string) public ackFromDestination;

// instance of the Router's gateway contract
IGateway public gatewayContract;

// gas limit required to handle the cross-chain request on the destination chain.
uint64 public destGasLimit;

// gas limit required to handle the acknowledgement received on the source
// chain back from the destination chain.
uint64 public ackGasLimit;


// custom error so that we can emit a custom error message
error CustomError(string message);

// event we will emit while sending a ping to destination chain
event PingFromSource(
    uint64 indexed srcChainType,
    string indexed srcChainId,
    uint64 indexed requestId,
    string message
);
event NewPing(uint64 indexed requestId);

// events we will emit while handling acknowledgement
event ExecutionStatus(uint64 indexed eventIdentifier, bool isSuccess);
event AckFromDestination(uint64 indexed requestId, string ackMessage);

constructor(
    address payable gatewayAddress,
    uint64 _destGasLimit,
    uint64 _ackGasLimit,
    string memory feePayerAddress
) {
    owner = msg.sender;

    gatewayContract = IGateway(gatewayAddress);
    destGasLimit = _destGasLimit;
    ackGasLimit = _ackGasLimit;

    gatewayContract.setDappMetadata(feePayerAddress);
}
```

1. Create an **owner** variable of type `address`. This will be used for access control.
2. Create a **currentRequestId** variable of type `uint64`. This is the counter for request IDs.
3. Create a mapping named **pingFromSource** which takes source chain type, source chain ID and request ID and gives the ping message as the output.
4. Create a mapping **ackFromDestination** which takes a request ID and gives acknowledgement message as output.
5. Create an instance of the gateway contract named **gatewayContract** of type IGateway. This will be the contract which will route your message to the Router Chain.
6. Create a variable **destGasLimit** of type uint256 which indicates the amount of gas required to execute the function that will handle our cross-chain request on the destination chain. This can be easily calculated using any gas estimator. You can use [_hardhat-gas-reporter_](https://www.npmjs.com/package/hardhat-gas-reporter) plugin to calculate this.
7. Create a variable **ackGasLimit** of type uint256 which indicates the amount of gas required to execute the callback function that will handle the acknowledgement coming back from to the source chain. This can be easily calculated using any gas estimator.
8. Create a custom error variable which can be used to throw custom errors.
9. Create an event **PingFromSource** with parameters uint64 srcChainType, string srcChainId, uint64 requestId and string message. This will be emitted when a message is received from another chain.
10. Create an event **NewPing** with parameter uint64 requestId. This will be emitted when we send a ping from the source chain to another chain.
11. Create an event **ExecutionStatus** with parameters uint64 eventIdentifier and a bool isSuccess. We will use it to emit event when we handle the acknowledgement coming back to the source chain from the destination chain.
12. Create an event **AckFromDestination** with parameters uint64 requestId and string ackMessage. We will use it to emit event when we handle the acknowledgement coming back to the source chain from the destination chain.
13. Create the constructor with the address of gateway contract, the destination gas limit, the ack gas limit and the fee payer address and set these variables inside the constructor. Also send a `setDappMetadata` request to the gateway contract for setting the fee payer address.

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
    uint64 expiryDurationInSeconds
) public payable {
    currentRequestId++;
    // creating the payload to be sent to the destination chain
    bytes memory payload = abi.encode(currentRequestId, str);
    // creating the expiry timestamp
    uint64 expiryTimestamp = uint64(block.timestamp) +
        expiryDurationInSeconds;

    // creating an array of destination contract addresses in bytes
    bytes[] memory addresses = new bytes[](1);
    addresses[0] = toBytes(destinationContractAddress);

    // creating an array of payloads to be sent to respective destination contracts
    bytes[] memory payloads = new bytes[](1);
    payloads[0] = payload;

    // sending a cross-chain request
    _pingDestination(
        expiryTimestamp,
        destGasPrice,
        ackGasPrice,
        chainType,
        chainId,
        payloads,
        addresses
    );

    emit NewPing(currentRequestId);
}

function _pingDestination(
    uint64 expiryTimestamp,
    uint64 destGasPrice,
    uint64 ackGasPrice,
    uint64 chainType,
    string memory chainId,
    bytes[] memory payloads,
    bytes[] memory addresses
) internal {
    Utils.RequestArgs memory requestArgs = Utils.RequestArgs(
        expiryTimestamp,
        false
    );

    // Calling the requestToDest function on the Router's Gateway contract to generate a
    // cross-chain request and storing the nonce returned into the lastEventIdentifier.
    gatewayContract.requestToDest(
        requestArgs,
        Utils.AckType.ACK_ON_SUCCESS,
        Utils.AckGasParams(ackGasLimit, ackGasPrice),
        Utils.DestinationChainParams(
            destGasLimit,
            destGasPrice,
            chainType,
            chainId,
            "0x" // asmAddress
        ),
        Utils.ContractCalls(payloads, addresses)
    );
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
        console.log(web3.utils.fromWei(result, 'ether'));
      });
      ```

   5. **destinationContractAddress:** Address of the contract that will handle the payload on the destination chain. Basically the address on the destination chain which we are going to ping.
   6. **str:** This is just the string that we want to send as payload to the destination contract. You can send any kind of data as per your requirements.
   7. **expiryDurationInSeconds:** The duration in seconds for which the cross-chain request created after calling this function remains valid. If the expiry duration elapses before the request is executed on the destination chain contract, the request will fail. If you don’t want to keep any expiry timestamp, just send a very large number (a trillion will do) and your request will never expire.

2. **Create the payload:** Here, we only want to send a ping with a message. That is why we will just abi encode the string we want to send and set it as the payload. However, you are not limited to just sending a string, you can send any kind of data you want. Just abi encode those data and set it as payload.
3. **Calculating the expiry timestamp:** As you must have already guessed, the expiry timestamp will be the <code>block.timestamp + expiryDurationInSeconds</code>.
4. **Creating the array of destination contract addresses:** With each cross-chain request, you can send multiple payloads to multiple destination chain contracts. The addresses to the recipient contracts on the destination chains need to be encoded into bytes format and sent as an array. To encode the address into bytes, you can use the function specified [here](../../understanding-crosstalk/requestToDest#6-contractcalls).

   Since here we are only sending one payload and to just one contract on the destination chain, we will create a bytes array named **addresses** of just one element and add the bytes encoded destination contract address to the array.

5. **Creating the array of payload:** As in case with the array of destination contract addresses, since we only have one payload, we will create a bytes array named **payloads** of just one element and add the payload we created to this array.
6. **Calling the gateway contract to generate a cross-chain communication request:** Now the time has come for us to generate a cross-chain communication request to the destination chain. Now we will call the <code>\_pingDestination</code> function with the required parameters which in turn will call the <code>requestToDest</code> function of the Gateway contract. The documentation for this function can be found [here](../../understanding-crosstalk/requestToDest).

   This function returns the nonce of the cross-chain requests generated by the Gateway contract. We will store this nonce into the lastEventIdentifier variable. Now, we have successfully generated a cross-chain request to ping the destination chain contract.

### Handling a cross-chain request

Now since we know how we can create a cross-chain communication request from the source chain, we will now handle that request on the destination chain. We will be deploying the same contract on both the source and the destination chains, so we need to create the functionality to handle the cross-chain communication request here.

```javascript
function handleRequestFromSource(
    bytes memory srcContractAddress,
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
        keccak256(abi.encodePacked(sampleStr)) ==
        keccak256(abi.encodePacked(""))
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
3. Since the request was generated by us, we know exactly what is received inside the payload. Since we sent just the request ID and the message string, we will decode it and store it in a <code>requestId</code> uint64 variable & <code>sampleStr</code> string variable.
4. If the string sent from the source chain is empty, we throw a custom error and this will trigger an error acknowledgement to the Router Chain.
5. We will now set the pingFromSource for the source chain type, source chain ID and the request ID as <code>sampleStr</code> if the sampleStr string is non-empty and return the abi encoded request Id and the sampleStr received with the function. This will trigger a success acknowledgement to the Router Chain.

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

      We will get <code>[true]</code> in execFlags and <code>[abi.encode(abi.encode(requestId, ackMessage))]</code> in execData as we sent this as return value in handleRequestFromSource function.

   2. **If the execution failed on the destination chain:**

      We will get <code>[false]</code> in execFlags and <code>[abi.encode(errorBytes)]</code> in execData where error bytes correspond to the error that was thrown on the destination chain contract.

   Since we sent <code>abi.encode(srcChainId, srcChainType)</code> as return values from the destination chain’s **handleRequestFromSource** function, we can decode it here in the **handleCrossTalkAck** function. First we decode the execData[0] where the return value has come in. We decode it as bytes first. And then decode it into the requestId and the sampleStr of the respective types. In this way, you can get the data back from the source chain.

   Now we set the ackFromDestination mapping for that requestId to the sampleStr received in the acknowledgement.

In this way, we can create a simple ping pong smart contract using the Router CrossTalk.

<details>
<summary><b>Full Contract Example</b></summary>

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/ICrossTalkApplication.sol";

/// @title PingPong
/// @author Yashika Goyal
/// @notice This is a cross-chain ping pong smart contract to demonstrate how one can
/// utilise Router CrossTalk for cross-chain transactions.
contract PingPong is ICrossTalkApplication {
    address public owner;
    uint64 public currentRequestId;

    // srcChainType + srcChainId + requestId => pingFromSource
    mapping(uint64 => mapping(string => mapping(uint64 => string)))
        public pingFromSource;
    // requestId => ackMessage
    mapping(uint64 => string) public ackFromDestination;

    // instance of the Router's gateway contract
    IGateway public gatewayContract;

    // gas limit required to handle the cross-chain request on the destination chain.
    uint64 public destGasLimit;

    // gas limit required to handle the acknowledgement received on the source
    // chain back from the destination chain.
    uint64 public ackGasLimit;

    // custom error so that we can emit a custom error message
    error CustomError(string message);

    // event we will emit while sending a ping to destination chain
    event PingFromSource(
        uint64 indexed srcChainType,
        string indexed srcChainId,
        uint64 indexed requestId,
        string message
    );
    event NewPing(uint64 indexed requestId);

    // events we will emit while handling acknowledgement
    event ExecutionStatus(uint64 indexed eventIdentifier, bool isSuccess);
    event AckFromDestination(uint64 indexed requestId, string ackMessage);

    constructor(
        address payable gatewayAddress,
        uint64 _destGasLimit,
        uint64 _ackGasLimit,
        string memory feePayerAddress
    ) {
        owner = msg.sender;
        gatewayContract = IGateway(gatewayAddress);
        destGasLimit = _destGasLimit;
        ackGasLimit = _ackGasLimit;

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
    /// @param chainType chain type of the destination chain.
    /// @param chainId chain ID of the destination chain in string.
    /// @param destGasPrice gas price of the destination chain.
    /// @param ackGasPrice gas price of the source chain.
    /// @param destinationContractAddress contract address of the contract that will handle this
    /// request on the destination chain(in bytes format).
    /// @param str string we will be sending as greeting to the destination chain.
    /// @param expiryDurationInSeconds expiry duration of the request in seconds. After this time,
    /// if the request has not already been executed, it will fail on the destination chain.
    /// If you don't want to provide any expiry duration, send type(uint64).max in its place.
    function pingDestination(
        uint64 chainType,
        string memory chainId,
        uint64 destGasPrice,
        uint64 ackGasPrice,
        address destinationContractAddress,
        string memory str,
        uint64 expiryDurationInSeconds
    ) public payable {
        currentRequestId++;
        // creating the payload to be sent to the destination chain
        bytes memory payload = abi.encode(currentRequestId, str);
        // creating the expiry timestamp
        uint64 expiryTimestamp = uint64(block.timestamp) +
            expiryDurationInSeconds;

        // creating an array of destination contract addresses in bytes
        bytes[] memory addresses = new bytes[](1);
        addresses[0] = toBytes(destinationContractAddress);

        // creating an array of payloads to be sent to respective destination contracts
        bytes[] memory payloads = new bytes[](1);
        payloads[0] = payload;

        // sending a cross-chain request
        _pingDestination(
            expiryTimestamp,
            destGasPrice,
            ackGasPrice,
            chainType,
            chainId,
            payloads,
            addresses
        );

        emit NewPing(currentRequestId);
    }

    function _pingDestination(
        uint64 expiryTimestamp,
        uint64 destGasPrice,
        uint64 ackGasPrice,
        uint64 chainType,
        string memory chainId,
        bytes[] memory payloads,
        bytes[] memory addresses
    ) internal {
        Utils.RequestArgs memory requestArgs = Utils.RequestArgs(
            expiryTimestamp,
            false
        );

        // Calling the requestToDest function on the Router's Gateway contract to generate a
        // cross-chain request and storing the nonce returned into the lastEventIdentifier.
        gatewayContract.requestToDest(
            requestArgs,
            Utils.AckType.ACK_ON_SUCCESS,
            Utils.AckGasParams(ackGasLimit, ackGasPrice),
            Utils.DestinationChainParams(
                destGasLimit,
                destGasPrice,
                chainType,
                chainId,
                "0x" // asmAddress
            ),
            Utils.ContractCalls(payloads, addresses)
        );
    }

    /// @notice function to handle the cross-chain request received from some other chain.
    /// @param srcContractAddress address of the contract on source chain that initiated the request.
    /// @param payload the payload sent by the source chain contract when the request was created.
    /// @param srcChainId chain ID of the source chain in string.
    /// @param srcChainType chain type of the source chain.
    function handleRequestFromSource(
        bytes memory srcContractAddress,
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
            keccak256(abi.encodePacked(sampleStr)) ==
            keccak256(abi.encodePacked(""))
        ) {
            revert CustomError("String should not be empty");
        }

        pingFromSource[srcChainType][srcChainId][requestId] = sampleStr;

        emit PingFromSource(srcChainType, srcChainId, requestId, sampleStr);

        return abi.encode(requestId, sampleStr);
    }

    /// @notice function to handle the acknowledgement received from the destination chain
    /// back on the source chain.
    /// @param eventIdentifier event nonce which is received when we create a cross-chain request
    /// We can use it to keep a mapping of which nonces have been executed and which did not.
    /// @param execFlags an array of boolean values suggesting whether the calls were successfully
    /// executed on the destination chain.
    /// @param execData an array of bytes returning the data returned from the handleRequestFromSource
    /// function of the destination chain.
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

    /// @notice function to convert address to bytes
    function toBytes(address a) public pure returns (bytes memory b) {
        assembly {
            let m := mload(0x40)
            a := and(a, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
            mstore(
                add(m, 20),
                xor(0x140000000000000000000000000000000000000000, a)
            )
            mstore(0x40, add(m, 52))
            b := m
        }
    }
}
```

</details>
