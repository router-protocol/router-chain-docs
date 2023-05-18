---
title: Sample Read Request Contract
sidebar_position: 3
---

This section explains how to create a simple cross-chain read request contract by integrating the Router Gateway contracts. The assumption made here is that a random contract already exists on the destination chain that retrieves a certain value from the source chain.

### Step 1) Installing the dependencies

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

-------

### Step 2) Instantiating the contract

Import `IGateway.sol` from `@routerprotocol/evm-gateway-contracts/contracts`:

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

contract ReadCall {
}
```

------
### Step 3) Defining the state variables and the constructor

```javascript
IGateway public gatewayContract;
address public owner;
uint256 public value;

event ReceivedData(uint256 value);

constructor(
    address payable gatewayAddress,
    string memory feePayerAddress
) {
    owner = msg.sender;
    gatewayContract = IGateway(gatewayAddress);

    gatewayContract.setDappMetadata(feePayerAddress);
}
```

1. Create an instance of the `gatewayContract` of type `IGateway`. This will be the contract that will route the request to the destination chain.
2. Create a variable `owner` of type `address` which will be used for access control.
3. Create a variable `value` of type `uint256` which will be used for storing the value that we read from the destination chain. Note that one can read any kind of data from the destination chain contract. 
4. Create an event `ReceivedData` with a parameter `value` of type `uint256`. It will be emitted when the data is received from the destination chain.
5. Create a constructor with the `gatewayAddress` and the `feePayer` address in string format and set these variables inside the constructor.

-----

### Step 4) Setting the fee payer address through the `setDappMetadata` function

```javascript
function setDappMetadata(
    string memory FeePayer
    ) public {
    require(msg.sender == owner, "Only owner can set the metadata");
    gatewayContract.setDappMetadata(FeePayer);
  }
```

To allow your dApp to send cross-chain transactions, you must specify the fee payer address on the Router chain. This can be done by calling the `setDappMetadata` function on the Gateway contract, and passing the fee payer address as a parameter. Once the fee payer address is set, the fee payer must provide approval on the Router chain to confirm their willingness to pay fees for your dApp.

It's important to note that any fee refunds will be credited to the fee payer address specified in the `setDappMetadata` function.

-----

### Step 5) Setting the Gateway address through the `setGateway` function

```javascript
function setGateway(address gateway) external {
    require(msg.sender == owner, "only owner");
    gatewayContract = IGateway(gateway);
  }
```

This is an administrative function which sets the address of the Gateway contract. This function should be invoked whenever the Router's Gateway contract gets updated.


---

### Step 6) Sending a read request to the destination chain

Lets say there is a `Multiplication` contract on the destination chain with a function `getResult()` that takes a `uint256` number as parameter and multiplies it with 2 and returns the result.

```javascript
contract Multiplication {
  function getResult(uint256 num) external view returns (uint256) {
    return num * 2;
  }
}
```

To send a read request to the destination chain to get the multiplication of any number, create a `getResult` function along with an interface.
Next, encode a function call using that interface in the following way:

```javascript
interface IMultiplication {
  function getResult(uint256 num) external view returns (uint256)
}
```

```javascript
function sendReadRequest(
  string calldata destChainId,
  string calldata destinationContractAddress,
  bytes calldata requestMetadata,
  uint256 _value
) public payable {
  bytes memory packet = abi.encodeCall(IMultiplication.getResult, (_value));
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

The parameters:

**1) `destChainId` -** Chain ID of the destination chain in string format.

**2) `destinationContractAddress` -** Address of the contract on the destination chain in string format.

**3) `requestMetadata` -** The detailed documentation for the `requestMetadata` function can be found [here](../iDapp-functions/iSend#5-requestmetadata).
  

To create a read request payload packet, one can encode the function call using the `abi.encodeCall` function in the way provided in the above snippet. Now, to create the final request packet, just `abi.encode` the destination contract address along with the payload packet. Once this is done, we can generate a cross-chain read request by calling the `iSend` function of the Gateway contract with the required parameters. 

-----

### Step 7) Handling the Acknowledgment

Once the read request is executed on the destination chain, the requested data is sent along with an acknowledgment to the source chain. To handle the acknowledgment, the applications need to include an `iAck()` function in the contract.

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

1. The function named `iAck` should be created with the same function signature as specified in the documentation. This function is called by the Gateway contract on the source chain and the function name and parameters should not be changed to avoid any failed requests. Further information about this function can be found [here](../iDapp-functions/iAck).
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

-----

In this way, one can create a simple cross-chain read request contract using Router CrossTalk.

<details>
<summary><b>Full read request contract example (to be deployed on the intended source chain)</b></summary>

```javascript
//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;

import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";

interface IMultiplication {
  function getResult(uint256 num) external view returns (uint256);
}

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
        bytes memory packet = abi.encodeCall(IMultiplication.getResult, (_value));
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
<summary><b>Multiplication contract example for reading contract state (to be deployed on the intended destination chain)</b></summary>

```javascript
//SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.10;
import "./IMultiplication.sol";

contract Multiplication {
    function getResult(uint256 num) external view returns (uint256) {
      return num * 2;
    }
}
```

</details>
