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
3. Inherit the ERC1155 and IDapp contracts into the main contract (XERC1155).

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
3. Create a mapping named **ourContractOnChains** that takes key as Chain Id and fetches the address of the corresponding NFT contract on that chain Id.

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
   1. **nftIds:** An array of NFT Ids a user wants to transfer to the destination chain.
   2. **nftAmounts:** An array of amounts of the respective NFT Ids to be transferred to the recipient on the destination chain.
   3. **nftData:** Arbitrary data to be sent with the NFT. The user can send `0x` if they don’t want to send any data while transferring the NFT.
   4. **recipient:** Address (in bytes format) of the recipient of the NFTs on the destination chain.
5. Create the constructor with the URI of the NFT metadata, address of gateway contract and address of the fee payer and set these variables inside the constructor. Also initialize the ERC1155 contract by passing it the URI with the constructor as shown above.
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

1. Create a function with whatever name you want to call it. Here, we will call it the **transferCrossChain** function which accepts five parameters:

   1. **destChainID:** Chain ID of the destination chain in string format.
   2. **transferParams:** The struct of type TransferParams which receives the NFT Ids and the respective amounts the user wants to transfer to the destination chain. It also receives the arbitrary data to be used while minting the NFT on the destination chain and the address of recipient in bytes.
   3. **requestMetadata:** Abi-encoded metadata based on the source and destination chains. To get the request metadata, the following function can be added to the contract:

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

      More details on Request Metadata can be found [here](../../evm-guides/understanding-functions/iSend#5-requestmetadata).

2. Check if the mapping of NFTs contract addresses on the respective destination chains is set using the `setContractOnChain` function.
3. **Burning the NFTs from user’s account:** The user must own the NFTs to be able to transfer them to the destination chain. Burn those NFTs from user’s account before creating a cross-chain communication request to the destination chain using the `burnBatch` method defined in ERC-1155 contract of the Openzeppelin library.
4. **Create the payload packet:** The payload for the cross-chain communication request will contain transfer parameters that need to be delivered to the destination chain. To achieve this, ABI encode the transferParams and set the resulting encoded data as the payload for the request.
5. **Create the request packet:** To create a request packet, simply ABI-encode the destination contract address along with the payload packet created in the previous step. Set this encoded data as the request packet to be sent to the destination chain.
6. **Calling the gateway contract to generate a cross-chain communication request:** Call the <code>iSend</code> function of the gateway contract with the required parameters. The documentation for this function can be found [here](../../evm-guides/understanding-functions/iSend).

### Handling a cross-chain request

Now that a cross-chain communication request has been created a from the source chain, the application needs to handle the request on the destination chain. To achieve this, create an `iReceive` function with the following signature:

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

1. It is important to name the function "iReceive" and ensure that its signature, including the name and parameters, remains the same. This is because the Gateway contract on the destination chain will call this function, and any changes to the name or parameters will result in a failed call. Further details on the parameters required for this function can be found [here](../../evm-guides/understanding-functions/iReceive).
2. The first step is to ensure that only the Gateway contract can call the function, as no other contract or wallet should have access to it. Once this is confirmed, the payload can be decoded to obtain the transfer parameters, which are stored in a variable called transferParams.

   The burnt NFTs from the source chain can then be minted to the recipient on the destination chain using the ERC-1155 contract's mintBatch function from the Openzeppelin library. It is necessary to convert the recipient's address from bytes back to address format for this process, which can be done using the toAddress function.

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

After handling the request on the destination chain, the contract inherited from the IDapp must implement the iAck function, as it is required. However, if the acknowledgement on the source chain is not to be handled, an empty function can be implemented to satisfy the requirement. Further information about the function can be found in the documentation provided [here](../../evm-guides/understanding-functions/iAck)

```jsx
function iAck(
    uint256 requestIdentifier,
    bool execFlag,
    bytes memory execData
) external {}
```

In this way, a contract for cross-chain ERC-1155 NFTs can be created using the Router CrossTalk.

<details>
<summary><b>Full Contract Example</b></summary>

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

  // address of the gateway contract
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
