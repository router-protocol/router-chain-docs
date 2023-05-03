---
title: How to make a Cross-Chain Read Call Sample Contract
sidebar_position: 3
---

In this section we will go through how a simple cross-chain read request contract can be created by integrating the Router Gateway contracts. Here we are assuming that we have a random contract on destination chain already deployed that gets you a certain value on the source chain.

### Installing the dependencies

Install the evm-gateway contracts with the following command:
`yarn add @routerprotocol/evm-gateway-contracts` or `npm install @routerprotocol/evm-gateway-contracts`

- Make sure you're using latest version of the gateway contracts.

### Instantiating the contract

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

contract ReadCall {
}
```

Import the IGateway.sol from `@routerprotocol/evm-gateway-contracts/contracts`.

### Creating state variables and the constructor

```javascript
IGateway public gatewayContract;
address public owner;
uint256 public value;

event ReceivedData( uint256 value);

constructor(
    address payable gatewayAddress,
    string memory feePayerAddress
) {
    owner = msg.sender;
    gatewayContract = IGateway(gatewayAddress);

    gatewayContract.setDappMetadata(feePayerAddress);
}
```

1. Create an instance to the **gateway** contract of type IGateway. This will be the contract which will route your message to the Router Chain.
2. Create a variable **owner** of type address which we will be using for putting admin controls over certain functions.
3. Create a variable **value** of type uint256 which we will be using for storing the value that we read from destination chain. Note that you can read any kind of data here, according to your requirement. We are just taking a sample where you get a certain uint256 value from a contract on destination.
4. Create an event **ReceivedData** with parameter uint256 value. We will use it to emit event when we receive the data from destination chain.
5. Create the constructor with the address of gateway contract and the feepayer address in string format and set these variables inside the constructor.

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

### Sending a Read request to destination chain

```javascript
function sendReadRequest(
        string calldata destChainId,
        string calldata destinationContractAddress,
        bytes calldata requestMetadata,
        uint256 _value
    ) public payable {
    bytes memory packet = abi.encodeCall(IMultiplication.getMultiplication, (_value));
    bytes memory requestPacket = abi.encode(destinationContractAddress, packet);

    gatewayContract.iSend{ value: msg.value }(
      1,
      0,
      string(""),
      destChainId,
      requestMetadata,
      requestPacket
    );
    }
```

1. Create a function with whatever name you want to call it. Here, we will call it the sendReadRequest function which accepts four parameters:

   1. **destChainId:** Chain ID of the destination chain in string format.
   2. **destinationContractAddress:** Address of the contract on destination chain in string format from which you want to read data.
   3. **requestMetadata:** Abi-encoded metadata according to source and destination chains. To get the request Metadata, you can add and use the following function in your contract:

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

   4. **\_value:** Value that we want to pass as an argument to the function `getMultiplication()` on contract on the destination chain which is also attached at the end of this section for your reference.

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

   7. **isReadCall:** We provide you the option to query a contract from another chain and get the data back on the source chain through acknowledgement. If you just want to query a contract on destination chain, set this to true.
   8. **asmAddress:** We also provide modular security framework for creating an additional layer of security on top of the security provided by Router Chain. These will be in the form of smart contracts on destination chain. The address of this contract needs to be passed in the form of bytes in this variable.

2. **Creating read-request payload packet:** Here we abi-encodeCall the function selector of the function that we want to call on the contract on destination chain along with its argument `_value`.
   You can use this interface into your contract(Note that the contract that we are tring to read here on the destination chain has been given at the end of this section for your reference):

   ```javascript
   //SPDX-License-Identifier: Unlicense
   pragma solidity ^0.8.0;

   interface IMultiplication {
   function setA(uint256 \_a) external;

   function getMultiplication(uint256 b) external view returns(uint256);
   }

   ```

3. **Creating request-packet:** We will just abi-encode the destination contract address that we got in our parameters and the payload packet we created in the previous step and set it as the request packet.
4. **Calling the gateway Contract to generate a cross-chain read request:** Now the time has come for us to generate a cross-chain read request to the destination chain. Now we will call the <code>sendReadRequest</code> function of the gateway contract with the required parameters. The documentation for this function can be found [here](./creating-and-sending-a-cross-chain-read-request.md).

### Handling the Acknowledgement

Once the read request is executed on the destination chain, the requested data is sent along with an acknowledgment to the source chain. To handle the acknowledgment, you need to include a `iAck()` function in their contract.

```javascript
function iAck(
    uint256 ,//requestIdentifier,
    bool ,//execFlag,
    bytes memory execData
  ) external {
    value = abi.decode(execData, (uint256));

    emit ReceivedData( value);
  }
```

1. Create a function named **iAck** and here, the name matters. The function signature, i.e. the name and the parameters it receive has to be the same since this function is called by the Gateway contract on the destination chain and if the name or the parameters to this function changes, the call will fail. The details about the parameters to this function is explained [here](./creating-and-sending-a-cross-chain-read-request.md) in detail.
2. In the **requestIdentifier** we receive the nonce which was returned from the Gateway contract when the request originated from source chain.
3. If the execution was successful on the destination chain, we will get <code>[true]</code> in execFlag and <code>(abi.encode(uint256))</code> in execData as the function that we read from on the contract on destination chain returned uint256 value to us in IAck function.

Since, we already knew that encoded uint256 value is going to come up as our return value from the destination chain, we can decode it here in **iAck** function.

In this way, we can create a simple cross-chain read request contract using the Router CrossTalk.

<details>
<summary><b>Full Read-request Contract Example(to be deployed on source chain)</b></summary>

```javascript
//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/IGateway.sol";
import "./IMultiplication.sol";

contract ReadCall {
    IGateway public gatewayContract;
    address public owner;
    uint256 public value;

    event ReceivedData( uint256 value);

    constructor(
        address payable gatewayAddress,
        string memory feePayerAddress
    ) {
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

    function sendReadRequest(
        string calldata destChainId,
        string calldata destinationContractAddress,
        bytes calldata requestMetadata,
        uint256 _value
    ) public payable {
        bytes memory packet = abi.encodeCall(IMultiplication.getMultiplication, (_value));
        bytes memory requestPacket = abi.encode(destinationContractAddress, packet);

    gatewayContract.iSend{ value: msg.value }(
      1,
      0,
      string(""),
      destChainId,
      requestMetadata,
      requestPacket
    );
    }

    function iAck(
    uint256 ,//requestIdentifier,
    bool ,//execFlag,
    bytes memory execData
  ) external {
    value = abi.decode(execData, (uint256));

    emit ReceivedData( value);
  }
}

```

</details>

<details>
<summary><b>Multiplication Contract Example that we used for reading(to be deployed on destination chain)</b></summary>

```javascript
//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;
import "./IMultiplication.sol";

contract Multiplication {
    uint256 public a;
    address public owner;

    constructor(uint256 _a) {
        owner = msg.sender;
        a = _a;
    }

    function setA(uint256 _a) public {
        require(msg.sender == owner, "only owner can call this");
        a = _a;
    }

    function getMultiplication(uint256 b) public view returns(uint256){
        return a*b;
    }
}
```

</details>
