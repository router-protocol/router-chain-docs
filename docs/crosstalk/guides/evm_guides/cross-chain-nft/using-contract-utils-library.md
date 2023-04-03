---
title: Using Router CrossTalk Utils Library
sidebar_position: 2
description: A cross-chain NFT (ERC-1155) contract using Router CrossTalkUtils Library
---

In this section we will go through how a cross-chain ERC-1155 NFT can be created by integrating the Router GatewayUtils library.

### Installing the dependencies:

Install the evm-gateway contracts with the following command:

`yarn add @routerprotocol/evm-gateway-contracts` or `npm install @routerprotocol/evm-gateway-contracts`

- Make sure you're using version `1.0.5`.

Install the openzeppelin contracts library with the following command:

`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

Install the crosstalk-utils library using the following command:

`yarn add @routerprotocol/router-crosstalk-utils` or `npm install @routerprotocol/router-crosstalk-utils`

- Make sure you're using version `1.0.5`.

### Instantiating the contract:

```javascript
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts/contracts/ICrossTalkApplication.sol";
import "@routerprotocol/router-crosstalk-utils/contracts/CrossTalkUtils.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract XERC1155 is ERC1155, ICrossTalkApplication {
}
```

1. Import the ICrossTalkApplication.sol and Utils.sol from `evm-gateway-contract/contracts`.
2. Import the CrossTalkUtils.sol from `@routerprotocol/router-crosstalk-utils/contracts`
3. Inherit the ICrossTalkApplication contract into your main contract (XERC1155).

### Creating state variables and the constructor

```javascript
address public admin;
address public gatewayContract;
uint64 public destGasLimit;
// chain type + chain id => address of our contract in bytes
mapping(uint64 => mapping(string => bytes)) public ourContractOnChains;

struct TransferParams {
	uint256[] nftIds;
	uint256[] nftAmounts;
	bytes nftData;
	bytes recipient;
}

constructor(
    string memory uri,
	address payable gatewayAddress,
	uint64 _destGasLimit
) ERC1155(uri) {
    gatewayContract = gatewayAddress;
    destGasLimit = _destGasLimit;
    admin = msg.sender;
	uint256[] memory _ids = new uint256[](1);
	uint256[] memory _amounts = new uint256[](1);
	_ids[0] = 1;
	_amounts[0] = 10;
	_mintBatch(msg.sender, _ids, _amounts, "0x");
}
```

1. Create a variable **admin** of type address which stores the address of the admin. This address will be used for access control purposes.
2. Create an instance to the **gateway** contract of type address. This will be the contract which will route your message to the Router Chain.
3. Create a variable **destGasLimit** of type uint64 which indicates the amount of gas required to execute the function that will handle our cross-chain request on the destination chain. This can be easily calculated using any gas estimator. You can use the _[hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter)_ plugin to calculate this.
4. Create a mapping which will map a chain type + chain ID to the address of our NFT contracts deployed on different chains. We will fetch the address from this mapping when the request is received on the destination chain from the source chain.

   We will also need a setter function where you will be able to set this address using the chain type and chain ID. You also want to make sure that only admin is able to set this mapping. You can create it in the following way:

   ```javascript
   function setContractOnChain(
   	uint64 chainType,
   	string memory chainId,
   	address contractAddress
   ) external {
   	require(msg.sender == admin, "only admin");
   	ourContractOnChains[chainType][chainId] = toBytes(contractAddress);
   }
   ```

   For this to work, you will need to use the **toBytes** function to convert the address of your contract to bytes format. You can find the **toBytes** function [here](../../understanding-crosstalk/requestToDest#6-contractcalls).

5. Create a struct named **TransferParams** which will be used to transfer NFTs to the destination chain. This will contain:
   1. **nftIds:** An array of NFT Ids you want to transfer to the destination chain.
   2. **nftAmounts:** An array of amounts of the respective NFT Ids to be transferred to the recipient on the destination chain.
   3. **nftData:** Arbitrary data to be used while minting the NFT. You can send `0x00` if you don’t want to send any data while minting the NFT.
   4. **recipient:** Address (in bytes format) of the recipient of the NFTs on the destination chain.
6. Create the constructor with the URI of the NFT metadata, address of gateway contract and the destination gas limit and set these variables inside the constructor. Also initialise the ERC1155 contract by passing it the URI with the constructor as shown above. Also set the admin as msg sender inside the constructor so that the deployer is the admin. After that, mint some nfts to the deployer so that the cross-chain transfer functionality can be taken into action.

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

### Transferring an NFT from a source chain to a destination chain

```javascript
function transferCrossChain(
    uint64 chainType,
    string memory chainId,
    uint64 expiryDurationInSeconds,
    uint64 destGasPrice,
    TransferParams memory transferParams,
    bytes memory asmAddress
  ) public payable {
	// burning the NFTs from the address of the user calling this function
    _burnBatch(msg.sender, transferParams.nftIds, transferParams.nftAmounts);

    bytes memory payload = abi.encode(transferParams);
    uint64 expiryTimestamp = uint64(block.timestamp) + expiryDurationInSeconds;
    Utils.DestinationChainParams memory destChainParams =
                    Utils.DestinationChainParams(
                        destGasLimit,
                        destGasPrice,
                        chainType,
                        chainId,
                        asmAddress
                    );

    Utils.RequestArgs memory requestArgs = Utils.RequestArgs(
      expiryTimestamp,
      false
    );

    CrossTalkUtils.singleRequestWithoutAcknowledgement(
        address(gatewayContract),
        requestArgs,
        destChainParams,
        ourContractOnChains[chainType][chainId],  // destination contract address
        payload
    );
  }
```

1. Create a function with whatever name you want to call it. Here, we will call it the transferCrossChain function which accepts five parameters:

   1. **chainType:** Type of the destination chain. The values for chain types can be found [here](../../understanding-crosstalk/chainTypes).
   2. **chainId:** Chain ID of the destination chain in string format.
   3. **expiryDurationInSeconds:** The duration in seconds for which the cross-chain request created after calling this function remains valid. If the expiry duration elapses before the request is executed on the destination chain contract, the request will fail. If you don’t want to keep any expiry timestamp, just send a very large number (a trillion will do) and your request will never expire.
   4. **destGasPrice:** Gas price of the destination chain.
      To get the gas price for a chain, you can use the following function:

   ```jsx
   // using ethers.js
   const gasPrice = await provider.getGasPrice();

   // using web3.js
   const gasPrice = web3.eth.getGasPrice().then((result) => {
     console.log(web3.utils.fromWei(result, 'ether'));
   });
   ```

   5. **transferParams:** The struct of type TransferParams which receives the NFT Ids and the respective amounts the user wants to transfer to the destination chain. It also receives the arbitrary data to be used while minting the NFT on the destination chain and the address of recipient in bytes.
   6. **asmAddress:** The address (in bytes format) of Additional Security Module (ASM) contract that acts as a plugin which enables users to seamlessly integrate their own security mechanism into their DApp. If user has not integrated ASM into his DApp , this field can be passed with empty bytes string like this ("0x"). Read more about ASM [here](../../../understanding-crosstalk/additionalSecurityModule.md)

2. **Burning the NFTs from user’s account:** The user must own the NFTs to be able to transfer them to the destination chain. We will burn those NFTs from user’s account before creating a cross-chain communication request to the destination chain using the **\_burnBatch** method defined in ERC-1155 contract of the Openzeppelin library.
3. **Create the payload:** Here, we only want to send the transfer params to the destination chain. That is why we will just abi encode the transferParams and set it as the payload.
4. **Calculating the expiry timestamp:** As you must have already guessed, the expiry timestamp will be the **block.timestamp + expiryDurationInSeconds**.
5. **Creating the destChainParams struct:** Create the Destination Chain Params struct with the required parameters: destination gas limit, destination gas price, destination chain type and the destination chain ID.
6. **Creating the request args struct:** Create the Request Arguments struct with the required parameters: expiry timestamp and atomicity.
7. Calling the CrossTalkUtils library’s function to generate a cross-chain communication request: Now the time has come for us to generate a cross-chain communication request to the destination chain. We will now call the CrossTalkUtils library’s function singleRequestWithoutAcknowledgement with the parameters shown in the code above which in turn will call the requestToDest function of the Gateway contract. The documentation for this function can be found [here](../../crosstalkutils-library/how-to-use-the-crosstalkutils-library#a-single-call-without-acknowledgment).

   This function returns the nonce of the cross-chain requests generated by the Gateway contract. We will be ignoring this nonce as we don’t need it in this case. Now, we have successfully generated a cross-chain request to ping the destination chain contract.

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
	require(
	keccak256(srcContractAddress) ==
		keccak256(ourContractOnChains[srcChainType][srcChainId])
	);

  TransferParams memory transferParams = abi.decode(payload, (TransferParams));
	_mintBatch(
		CrossTalkUtils.toAddress(transferParams.recipient),
		transferParams.nftIds,
		transferParams.nftAmounts,
		transferParams.nftData
	);

  return abi.encode(srcChainId, srcChainType);
}
```

1. Create a function named **handleRequestFromSource** and here, the name matters. The function signature, i.e. the name and the parameters it receive has to be the same since this function is called by the Gateway contract on the destination chain and if the name or the parameters to this function changes, the call will fail. The details about the parameters to this function is explained [here](../../understanding-crosstalk/handleRequestFromSource) in detail.
2. First, we will check that the request can only be sent by the Gateway contract. No other contract or wallet should be able to call this function. We also check that the request is received from our contract only from the source chain.
3. Since the request was generated by us, we know exactly what is received inside the payload. Since we sent the transfer params, we will decode it and store it in a transferParams variable.
4. We will now mint the NFTs that we burnt on the source chain to the recipient on the destination chain using the **\_mintBatch** function of the ERC-1155 contract of the Openzeppelin library. We will have to convert the address of the recipient from bytes back to address format here. The function **toAddress** to convert bytes to address type can be found [here](../../understanding-crosstalk/requestToDest#6-contractcalls). This function is included in the library and can be used directly as shown in the code snippet above.

After the execution of this function is complete, a success acknowledgement will be triggered to the Router Chain.

Now we have handled the request on the destination chain. Since we have inherited from the **ICrossTalkApplication**, we have to implement the **handleCrossTalkAck** function otherwise we will get an error. Since we would not like to handle the acknowledgement on the source chain, we will just implement an empty function for handling acknowledgement. The documentation for this function can be found [here](../../understanding-crosstalk/handleCrossTalkAck).

```javascript
function handleCrossTalkAck(
  uint64, //eventIdentifier,
  bool[] memory, //execFlags,
  bytes[] memory //execData
) external view override {}
```

In this way, we can create a contract for cross-chain ERC-1155 NFTs using the Router CrossTalk.

<details>
<summary><b>Full Contract Example</b></summary>

```javascript
//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts@1.0.4/contracts/ICrossTalkApplication.sol";
import "@routerprotocol/router-crosstalk-utils@1.0.4/contracts/CrossTalkUtils.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";


contract XERC1155 is ERC1155, ICrossTalkApplication {
    address public admin;
    IGateway public gatewayContract;
    uint64 public destGasLimit;
    // chain type + chain id => address of our contract in bytes
    mapping(uint64 => mapping(string => bytes)) public ourContractOnChains;

    struct TransferParams {
	uint256[] nftIds;
	uint256[] nftAmounts;
	bytes nftData;
	bytes recipient;
    }

    constructor(
        string memory uri,
        address payable gatewayAddress,
        uint64 _destGasLimit
    ) ERC1155(uri) {
        gatewayContract = IGateway(gatewayAddress);
        destGasLimit = _destGasLimit;
        admin = msg.sender;
        uint256[] memory _ids = new uint256[](1);
        uint256[] memory _amounts = new uint256[](1);
        _ids[0] = 1;
        _amounts[0] = 10;
        _mintBatch(msg.sender, _ids, _amounts, "0x");
    }

    function setContractOnChain(
    	uint64 chainType,
    	string memory chainId,
    	address contractAddress
    ) external {
    	require(msg.sender == admin, "only admin");
    	ourContractOnChains[chainType][chainId] = CrossTalkUtils.toBytes(contractAddress);
    }

    function setDappMetadata(
    string memory FeePayer
    ) public {
    require(msg.sender == admin, "Only owner can set the metadata");
    gatewayContract.setDappMetadata(FeePayer);
  }

    function transferCrossChain(
    uint64 chainType,
    string memory chainId,
    uint64 expiryDurationInSeconds,
    uint64 destGasPrice,
    TransferParams memory transferParams,
    bytes memory asmAddress
  ) public payable {
		// burning the NFTs from the address of the user calling this function
    _burnBatch(msg.sender, transferParams.nftIds, transferParams.nftAmounts);

    bytes memory payload = abi.encode(transferParams);
    uint64 expiryTimestamp = uint64(block.timestamp) + expiryDurationInSeconds;
    Utils.DestinationChainParams memory destChainParams =
                    Utils.DestinationChainParams(
                        destGasLimit,
                        destGasPrice,
                        chainType,
                        chainId,
                        asmAddress
                    );

    Utils.RequestArgs memory requestArgs = Utils.RequestArgs(
      expiryTimestamp,
      false
    );

    CrossTalkUtils.singleRequestWithoutAcknowledgement(
        address(gatewayContract),
        requestArgs,
        destChainParams,
        ourContractOnChains[chainType][chainId],  // destination contract address
        payload
    );
  }

  function handleRequestFromSource(
  bytes memory srcContractAddress,
  bytes memory payload,
  string memory srcChainId,
  uint64 srcChainType
) external override returns (bytes memory) {
  require(msg.sender == address(gatewayContract));
	require(
	keccak256(srcContractAddress) ==
		keccak256(ourContractOnChains[srcChainType][srcChainId])
	);

  TransferParams memory transferParams = abi.decode(payload, (TransferParams));
	_mintBatch(
		CrossTalkUtils.toAddress(transferParams.recipient),
		transferParams.nftIds,
		transferParams.nftAmounts,
		transferParams.nftData
	);

  return abi.encode(srcChainId, srcChainType);
}

function handleCrossTalkAck(
  uint64, //eventIdentifier,
  bool[] memory, //execFlags,
  bytes[] memory //execData
) external view override {}
}
```

</details>
