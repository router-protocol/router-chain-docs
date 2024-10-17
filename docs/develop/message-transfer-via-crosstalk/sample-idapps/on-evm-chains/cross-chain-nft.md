---
title: Cross-chain NFT (ERC-1155)
sidebar_position: 2
description: A cross-chain ERC-1155 using Router CrossTalk
---

## Overview
In this section, we will create a cross-chain ping pong dApp using Router CrossTalk. Using this dApp, you can send any message (ping) from an EVM-based source chain to an EVM-based destination chain and receive an acknowledgment (pong) back to the source chain. 

In this section, we will create a cross-chain ERC-1155 NFT using Router CrossTalk. We will be using the burn-mint mechanism to transfer the NFTs across chains - NFTs will be burnt on the source chain from the user’s account and minted to the recipient's address on the destination chain.

For this guide, we will be using the standard ERC-1155 contract from Openzeppelin as the base and adding extra code to make it interoperable. Unlike the previous example, we will not be using the acknowledgment in this guide. This will give an idea on how the contract will look if we don’t want to handle the acknowledgment.

We will also create a mapping that will store the addresses of our contracts on different chains so that we can match whether the request on the destination originated from our contract on the source chain.

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
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract XERC1155 is ERC1155, IDapp {
}
```

1. Import the `IGateway.sol` and `IDapp.sol` from `@routerprotocol/evm-gateway-contracts/contracts`.
2. Import the `ERC1155.sol` from `@openzeppelin/contracts/token/ERC1155`.
3. Inherit the `ERC1155` and `IDapp` contracts into the main contract (XERC1155).

</details>



<details>
<summary><b>Step 3) Creating state variables and the constructor</b></summary>

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

1. Create a variable `owner` of type `address` which will be used for access control.
2. Create an instance to the `gatewayContract` of type `IGateway`. This will be the contract which will route your message to the Router Chain.
3. Create a mapping `ourContractOnChains` that takes network ID as the key and returns the corresponding NFT on that chain. 
   To allow the contract admin to map an address with a chain ID, create a setter function using the following steps:

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
   - **`nftIds` -** An array of NFT ids that a user wants to transfer to the destination chain.
   - **`nftAmounts` -** An array of amounts of the respective NFT ids to be transferred to the recipient on the destination chain.
   - **`nftData` -** Arbitrary data to be sent with the NFT. The user can send `0x` if they don’t want to send any data while transferring the NFT.
   - **`recipient` -** Address (in bytes format) of the recipient of the NFTs on the destination chain.
5. Create the constructor with `gatewayAddress` and the `feePayerAddress` in string format. Also initialize the ERC1155 contract by passing the URI with the constructor as shown above.
6. Set the owner as `msg.sender` inside the constructor so that the deployer is the admin, mint some NFTs to the deployer so that the cross-chain transfer functionality can be taken into action and set the dApp metadata( explained in the next section) with the `feePayerAddress` as shown in the code snippet.

</details>


<details>
<summary><b>Step 4) Setting the fee payer address</b></summary>

```javascript
function setDappMetadata(string memory FeePayer) public {
  require(msg.sender == owner, "Only owner can set the metadata");
  gatewayContract.setDappMetadata(FeePayer);
}

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
<summary><b>Step 6) Transferring an NFT to the destination chain</b></summary>

```javascript
function transferCrossChain(
    string calldata destChainId,
    TransferParams calldata transferParams,
    bytes calldata requestMetadata
  ) public payable {
    require(
      keccak256(bytes(ourContractOnChains[destChainId])) !=
        keccak256(bytes("")),
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

- **Create a function named `transferCrossChain`:** This will be used to send a ping (message) to the destination chain. The parameters for this function includes:

    **1) `destChainId` -** Network ID of the destination chain in string format.
    
    **2) `transferParams` -** The struct of type `TransferParams` which receives the NFT ids and the respective amounts that the user wants to transfer to the destination chain. It also receives the arbitrary data to be sent while minting the NFT on the destination chain as well as the address of the recipient in bytes.

    **2) `destinationContractAddress` -** Address of the destination contract in `bytes` format.

    **3) `requestMetadata` -** Abi-encoded metadata based on the source and destination chains. To get the request metadata, the following function can be used:

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
       ```

    More details on `requestMetadata` can be found [here](../../evm-guides/idapp-functions/iSend#5-requestmetadata).


- **Check the mapping:** Check to see whether the mapping of NFTs contract addresses on the respective destination chains is set using the `setContractOnChain` function.
- **Burn the NFTs from user’s account:** The user must own the NFTs to be able to transfer them to the destination chain. Burn those NFTs from the user’s account before creating a cross-chain communication request to the destination chain using the `burnBatch` method defined in `ERC-1155` contract of the Openzeppelin library.
- **Create the payload packet:** The payload for the cross-chain communication request will contain transfer parameters that need to be delivered to the destination chain. To achieve this, ABI-encode the `transferParams` and set the resulting encoded data as the payload for the request.
- **Create the request packet:** To create a request packet, simply ABI-encode the destination contract address along with the payload packet created in the previous step. Set this encoded data as the request packet to be sent to the destination chain.
- **Call the Gateway contract to generate a cross-chain request:** Call the `iSend` function of the Gateway contract with the required parameters. The documentation for this function can be found [here](../../evm-guides/idapp-functions/iSend).

</details>


<details>
<summary><b>Step 7) Handling a cross-chain request</b></summary>


Now that we have setup the contract to send a ping from the source chain, we need to implement an `iReceive` function handle the request on the destination chain. The `iReceive` function will include the following signature:

```javascript
function iReceive(
  string memory requestSender,
  bytes memory packet,
  string memory srcChainId
) external override returns (bytes memory) {
  require(msg.sender == address(gatewayContract), "only gateway");

  require(
    keccak256(bytes(ourContractOnChains[srcChainId])) ==
      keccak256(bytes(requestSender))
  );

  // decoding our payload
  TransferParams memory transferParams = abi.decode(packet, (TransferParams));
  _mintBatch(
    toAddress(transferParams.recipient),
    transferParams.nftIds,
    transferParams.nftAmounts,
    transferParams.nftData
  );

  return "";
}
```

- It is important to name the function `iReceive` and ensure that its signature, including the name and parameters, remains the same. This is because the Gateway contract on the destination chain will call this function, and any changes to the name or parameters will result in a failed call. Further details on the parameters required for this function can be found [here](../../evm-guides/idapp-functions/iReceive).
- To ensure that the request is received only from the application contract on the source chain, the application can create a mapping of allowed contract addresses for each chain ID. Then, in the `iReceive` function, the application can check that the `requestSender` is the same as the address stored in the mapping for the specific chain ID. To keep this contract as simple as possible, this condition has not been implemented here.
- Ensure that only the Gateway contract can call the function, as no other contract or wallet should have access to it. Once this is confirmed, the payload can be decoded to obtain the transfer parameters, which are stored in a variable called `transferParams`.
- The burnt NFTs from the source chain can then be minted to the recipient on the destination chain using the `ERC-1155` contract's `mintBatch` function from the Openzeppelin library. It is necessary to convert the recipient's address from bytes back to address format for this process, which can be done using the `toAddress` function.

```javascript
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

- After the execution of the `iReceive` function is complete, a success acknowledgment will be triggered to the Router Chain.


3. Decode the packet using abi decoding and store it in `requestId` and `sampleStr` variables.
4. Check if the string received in non-empty. If it is empty, throw a custom error which will trigger a failure acknowledgment to the Router Chain.
5. Set the string message in `pingFromSource` mapping and emit the `PingFromSource` event with `srcChainId`, `requestId` and the string message. Finally, return the `requestId` and string message received with the function. This will trigger a success acknowledgment to the Router Chain.


</details>

<details>
<summary><b>Step 8) Handling the acknowledgment</b></summary>


After handling the request on the destination chain, the contract inherited from the `IDapp` must implement the `iAck` function. However, if the acknowledgment on the source chain is not to be handled, an empty function can be implemented to satisfy the requirement. Further information about the function can be found in the documentation provided [here](../../evm-guides/idapp-functions/iAck)

```javascript
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
) external {}
```

</details>

----

## Full Contract Example

```javascript
// SPDX-License-Identifier: Unlicensed
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/IDapp.sol";
import "@routerprotocol/evm-gateway-contracts/contracts/IGateway.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

/// @title XERC1155
/// @author Yashika Goyal
/// @notice A cross-chain ERC-1155 smart contract to demonstrate how one can create
/// cross-chain NFT contracts using Router CrossTalk.
contract XERC1155 is ERC1155, IDapp {
  // address of the owner
  address public owner;

  // address of the Gateway contract
  IGateway public gatewayContract;

  // chain type + chain id => address of our contract in bytes
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
  /// @param gateway address of the Gateway contract.
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
    string memory destChainId,
    TransferParams memory transferParams,
    bytes memory requestMetadata
  ) public payable {
    require(
      keccak256(bytes(ourContractOnChains[destChainId])) !=
        keccak256(bytes("")),
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
  /// @param requestSender address of the contract on source chain that initiated the request.
  /// @param packet the payload sent by the source chain contract when the request was created.
  /// @param srcChainId chain ID of the source chain in string.
  function iReceive(
    string calldata requestSender,
    bytes calldata packet,
    string calldata srcChainId
  ) external override returns (bytes memory) {
    require(msg.sender == address(gatewayContract), "only gateway");
    require(
      keccak256(bytes(ourContractOnChains[srcChainId])) ==
        keccak256(bytes(requestSender))
    );

    // decoding our payload
    TransferParams memory transferParams = abi.decode(packet, (TransferParams));
    _mintBatch(
      toAddress(transferParams.recipient),
      transferParams.nftIds,
      transferParams.nftAmounts,
      transferParams.nftData
    );

    return "";
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
