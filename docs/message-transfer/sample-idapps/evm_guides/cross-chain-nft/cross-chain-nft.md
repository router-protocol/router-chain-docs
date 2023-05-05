---
title: Cross-Chain NFT
sidebar_position: 1
description: A cross-chain NFT (ERC-1155) contract using Router Gateway contracts
---

Creating a cross-chain ERC-1155 NFT using the Router's CrossTalk.

### Installing the dependencies:

Install the evm-gateway contracts with the following command:

`yarn add @routerprotocol/evm-gateway-contracts` or `npm install @routerprotocol/evm-gateway-contracts`

- Make sure to use the latest version of the gateway contracts.

Install the openzeppelin contracts library with the following command:

`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

### Instantiating the contract:

```javascript
// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract XERC1155 is ERC1155, IDapp {
}
```

1. Import the IGateway.sol and IDapp.sol from `@routerprotocol/evm-gateway-contracts/contracts`.
2. Import the ERC1155.sol from `@openzeppelin/contracts/token/ERC1155`.
3. Inherit the ERC1155 and IDapp contracts into your main contract (XERC1155).

### Creating state variables and the constructor

```javascript
  address public owner;
  IGateway public gatewayContract;

  mapping(string => string) public ourContractOnChains;

  struct TransferParams {
    uint256[] nftIds;
    uint256[] nftAmounts;
    bytes nftData;
    bytes recipient;
  }

  constructor(
    string memory _uri,
    address payable gatewayAddress,
	  string memory feePayerAddress
  ) ERC1155(_uri) {
    gatewayContract = IGateway(gatewayAddress);
    owner = msg.sender;

    // minting ourselves some NFTs so that we can test out the contracts
    _mint(msg.sender, 1, 10, "");

    gatewayContract.setDappMetadata(feePayerAddress);
  }
```

1. Create a variable named **owner** of type address which stores the address of the admin. This address will be used for access control purposes.
2. Create an instance to the **gateway** contract of type IGateway. This will be the contract which will route your message to the Router Chain.
3. Create a mapping named **ourContractOnChains** that takes key as Chain Id and fetches the address of our corresponding NFT contract on that chain Id.

   We will also need a setter function where you will be able to set this address using the chain ID. You also want to make sure that only admin is able to set this mapping. You can create it in the following way:

   ```jsx
   function setContractOnChain(
   	string calldata chainId,
   	string calldata contractAddress
   ) external {
   	require(msg.sender == owner, "only admin");
   	ourContractOnChains[chainId] = contractAddress;
   }
   ```

4. Create a struct named **TransferParams** which will be used to transfer NFTs to the destination chain. This will contain:
   1. **nftIds:** An array of NFT Ids you want to transfer to the destination chain.
   2. **nftAmounts:** An array of amounts of the respective NFT Ids to be transferred to the recipient on the destination chain.
   3. **nftData:** Arbitrary data to be used while minting the NFT. You can send `0x00` if you don’t want to send any data while minting the NFT.
   4. **recipient:** Address (in bytes format) of the recipient of the NFTs on the destination chain.
5. Create the constructor with the URI of the NFT metadata, address of gateway contract and address of the fee payer and set these variables inside the constructor. Also initialise the ERC1155 contract by passing it the URI with the constructor as shown above.
6. Set the owner as msg sender inside the constructor so that the deployer is the admin, mint some nfts to the deployer so that the cross-chain transfer functionality can be taken into action and set the Dapp metadata(explained in the next section) with the fee payer address as shown in the code snippet.

### Setting the fee payer address through setDappMetadata function

```javascript
function setDappMetadata(string memory FeePayer) public {
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

This is an administrative function which sets the address of the gateway contract. This can be used in case when the gateway address with which you deployed your contract initially has now been changed.

### Transferring an NFT from a source chain to a destination chain

```javascript
function transferCrossChain(
    string calldata destChainId,
    TransferParams calldata transferParams,
    bytes calldata requestMetadata
  ) public payable {
    require(
      keccak256(abi.encodePacked(ourContractOnChains[destChainId])) !=
        keccak256(abi.encodePacked("")),
      "contract on dest not set"
    );

    // burning the NFTs from the address of the user calling _burnBatch function
    _burnBatch(msg.sender, transferParams.nftIds, transferParams.nftAmounts);

    // sending the transfer params struct to the destination chain as payload.
    bytes memory packet = abi.encode(transferParams);
    bytes memory requestPacket = abi.encode(
      ourContractOnChains[destChainId],
      packet
    );

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

1. Create a function with whatever name you want to call it. Here, we will call it the **transferCrossChain** function which accepts five parameters:

   1. **destChainID:** Chain ID of the destination chain in string format.
   2. **transferParams:** The struct of type TransferParams which receives the NFT Ids and the respective amounts the user wants to transfer to the destination chain. It also receives the arbitrary data to be used while minting the NFT on the destination chain and the address of recipient in bytes.
   3. **requestMetadata:** Abi-encoded metadata according to source and destination chains. To get the request Metadata, you can add and use the following function in your contract:

      ```jsx
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

      Request metadata includes eight parameters which are to be Abi-encoded and sent along with the transferCrossChain function to generate a cross-chain communication request.

      1. **destGasLimit:** The amount of gas required to execute the function that will handle our cross-chain request on the destination chain. This can be easily calculated using any gas estimator. You can use [_*hardhat-gas-reporter*_](https://www.npmjs.com/package/hardhat-gas-reporter) plugin to calculate this.
      2. **destGasPrice:** The amount of gas price required to execute the function that will handle our cross-chain request on the destination chain. To get the gas price for a chain, you can use the following function:

         ```jsx
         // using ethers.js
         const gasPrice = await provider.getGasPrice();

         // using web3.js
         const gasPrice = web3.eth.getGasPrice().then((result) => {
           console.log(web3.utils.fromWei(result, 'ether'));
         });
         ```

      3. **ackGasLimit:** The amount of gas required to execute the function that will handle our acknowledgement on the source chain. This can be easily calculated using any gas estimator. You can use [_*hardhat-gas-reporter*_](https://www.npmjs.com/package/hardhat-gas-reporter) plugin to calculate this.
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
      8. **asmAddress:** The address (in bytes format) of Additional Security Module (ASM) contract that acts as a plugin which enables users to seamlessly integrate their own security mechanism into their DApp. If user has not integrated ASM into his DApp , this field can be passed with empty bytes string like this ("0x"). Read more about ASM [here](../../../understanding-crosstalk/additionalSecurityModule.md)

2. Check if we have set our NFTs contract address on the respective destination chain in the mapping ourContractOnChains.
3. **Burning the NFTs from user’s account:** The user must own the NFTs to be able to transfer them to the destination chain. We will burn those NFTs from user’s account before creating a cross-chain communication request to the destination chain using the \_burnBatch method defined in ERC-1155 contract of the Openzeppelin library.
4. **Create the payload packet:** Here, we only want to send the transfer params to the destination chain. That is why we will just abi encode the transferParams and set it as the payload.
5. **Create the request packet:** We will just abi-encode the destination contract address and the payload packet that we created in the previous step and set it as request packet.
6. **Calling the gateway Contract to generate a cross-chain communication request:** Now the time has come for us to generate a cross-chain communication request to the destination chain. Now we will call the <code>iSend</code> function of thr gateway contract with the required parameters. The documentation for this function can be found [here](../../../understanding-crosstalk/evm_guides/iSend.md)

### Handling a cross-chain request

Now since we know how we can create a cross-chain communication request from the source chain, we will now handle that request on the destination chain. We will be deploying the same contract on both the source and the destination chains, so we need to create the functionality to receive and handle the cross-chain communication request here.

```javascript
function iReceive(
    string memory,// requestSender,
    bytes memory packet,
    string memory srcChainId
  ) external override returns (bytes memory) {
    require(msg.sender == address(gatewayContract), "only gateway");
    // decoding our payload
    TransferParams memory transferParams = abi.decode(packet, (TransferParams));
    _mintBatch(
      toAddress(transferParams.recipient),
      transferParams.nftIds,
      transferParams.nftAmounts,
      transferParams.nftData
    );

    return abi.encode(srcChainId);
  }
```

1. Create a function named **iReceive** and here, the name matters. The function signature, i.e. the name and the parameters it receive has to be the same since this function is called by the Gateway contract on the destination chain and if the name or the parameters to this function changes, the call will fail. The details about the parameters to this function is explained [here](../../../understanding-crosstalk/evm_guides/iReceive.md) in detail.
2. First, we will check that the request can only be sent by the Gateway contract. No other contract or wallet should be able to call this function.
3. Since the request was generated by us, we know exactly what is received inside the payload. Since we sent the transfer params, we will decode it and store it in a transferParams variable.
4. We will now mint the NFTs that we burnt on the source chain to the recipient on the destination chain using the **\_mintBatch** function of the ERC-1155 contract of the Openzeppelin library. We will have to convert the address of the recipient from bytes back to address format here. The function \***\*toAddress\*\*** to convert bytes to address type can be found here:

   ```jsx
   /// @notice Function to convert bytes to address
   /// @param _bytes bytes to be converted
   /// @return addr address pertaining to the bytes
   function toAddress(bytes memory _bytes) internal pure returns (address addr) {
   bytes20 srcTokenAddress;
   assembly {
   	srcTokenAddress := mload(add(_bytes, 0x20))
   }
   addr = address(srcTokenAddress);
   }
   ```

After the execution of this function is complete, a success acknowledgement will be triggered to the Router Chain.

Now we have handled the request on the destination chain. Since we have inherited from the **IDapp**, we have to implement the **iAck** function otherwise we will get an error. Since we would not like to handle the acknowledgement on the source chain, we will just implement an empty function for handling acknowledgement. The documentation for this function can be found [here](../../../understanding-crosstalk/evm_guides/iAck.md).

```jsx
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
  ) external {}
```

In this way, we can create a contract for cross-chain ERC-1155 NFTs using the Router CrossTalk.

<details>
<summary><b>Full Contract Example</b></summary>

```javascript
// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/IGateway.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// @title XERC1155
/// @notice A cross-chain ERC-1155 smart contract to demonstrate how one can create
/// cross-chain NFT contracts using Router CrossTalk.
contract XERC1155 is ERC1155, IDapp {
  // address of the owner
  address public owner;

  // address of the gateway contract
  IGateway public gatewayContract;

  // chain type + chain id => address of our contract in string format
  mapping(string => string) public ourContractOnChains;

  // transfer params struct where we specify which NFTs should be transferred to
  // the destination chain and to which address
  struct TransferParams {
    uint256[] nftIds;
    uint256[] nftAmounts;
    bytes nftData;
    bytes recipient;
  }

  constructor(
    string memory _uri,
    address payable gatewayAddress,
    string memory feePayerAddress
  ) ERC1155(_uri) {
    gatewayContract = IGateway(gatewayAddress);
    owner = msg.sender;

    // minting ourselves some NFTs so that we can test out the contracts
    _mint(msg.sender, 1, 10, "");

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

  function mint(
    address account,
    uint256[] memory nftIds,
    uint256[] memory amounts,
    bytes memory nftData
  ) external {
    require(msg.sender == owner, "only owner");
    _mintBatch(account, nftIds, amounts, nftData);
  }

  /// @notice function to set the address of our NFT contracts on different chains.
  /// This will help in access control when a cross-chain request is received.
  /// @param chainId chain Id of the destination chain in string.
  /// @param contractAddress address of the NFT contract on the destination chain.
  function setContractOnChain(
    string calldata chainId,
    string calldata contractAddress
  ) external {
    require(msg.sender == owner, "only owner");
    ourContractOnChains[chainId] = contractAddress;
  }

  /// @notice function to generate a cross-chain NFT transfer request.
  /// @param destChainId chain ID of the destination chain in string.
  /// @param transferParams transfer params struct.
  /// @param requestMetadata abi-encoded metadata according to source and destination chains
  function transferCrossChain(
    string calldata destChainId,
    TransferParams calldata transferParams,
    bytes calldata requestMetadata
  ) public payable {
    require(
      keccak256(abi.encodePacked(ourContractOnChains[destChainId])) !=
        keccak256(abi.encodePacked("")),
      "contract on dest not set"
    );

    // burning the NFTs from the address of the user calling _burnBatch function
    _burnBatch(msg.sender, transferParams.nftIds, transferParams.nftAmounts);

    // sending the transfer params struct to the destination chain as payload.
    bytes memory packet = abi.encode(transferParams);
    bytes memory requestPacket = abi.encode(
      ourContractOnChains[destChainId],
      packet
    );

    gatewayContract.iSend{ value: msg.value }(
      1,
      0,
      string(""),
      destChainId,
      requestMetadata,
      requestPacket
    );
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
    string memory,// requestSender,
    bytes memory packet,
    string memory srcChainId
  ) external override returns (bytes memory) {
    require(msg.sender == address(gatewayContract), "only gateway");
    // decoding our payload
    TransferParams memory transferParams = abi.decode(packet, (TransferParams));
    _mintBatch(
      toAddress(transferParams.recipient),
      transferParams.nftIds,
      transferParams.nftAmounts,
      transferParams.nftData
    );

    return abi.encode(srcChainId);
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
  ) external override {}

  /// @notice Function to convert bytes to address
  /// @param _bytes bytes to be converted
  /// @return addr address pertaining to the bytes
  function toAddress(bytes memory _bytes) internal pure returns (address addr) {
    bytes20 srcTokenAddress;
    assembly {
      srcTokenAddress := mload(add(_bytes, 0x20))
    }
    addr = address(srcTokenAddress);
  }
}

```

</details>
