---
title: Using Router CrossTalk Utils Library
sidebar_position: 2
description: A cross-chain NFT (ERC-1155) contract using Router CrossTalkUtils Library
---

In this section we will go through how a cross-chain ERC-1155 NFT can be created by integrating the Router GatewayUtils library.

### Installing the dependencies:

Install the evm-gateway contracts with the following command:

`yarn add evm-gateway-contract`  or  `npm install evm-gateway-contract`

Install the openzeppelin contracts library with the following command:

`yarn add @openzeppelin/contracts`   or  `npm install @openzeppelin/contracts` 

Install the crosstalk-utils library using the following command:

`yarn add @routerprotocol/crosstalk-utils`  or  `npm install @routerprotocol/crosstalk-utils`

### Instantiating the contract:

```javascript
pragma solidity >=0.8.0 <0.9.0;

import "evm-gateway-contract/contracts/ICrossTalkApplication.sol";
import "evm-gateway-contract/contracts/Utils.sol";
import "@routerprotocol/crosstalk-utils/contracts/CrossTalkUtils.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract XERC1155 is ERC1155, ICrossTalkApplication {
}
```

1. Import the ICrossTalkApplication.sol and Utils.sol from `evm-gateway-contract/contracts`.
2. Import the CrossTalkUtils.sol from `@routerprotocol/crosstalk-utils/contracts`
3. Inherit the ICrossTalkApplication contract into your main contract (PingPong).

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
}
```

1. Create a variable **admin** of type address which stores the address of the admin. This address will be used for access control purposes.
2. Create an instance to the **gateway** contract of type address. This will be the contract which will route your message to the Router Chain.
3. Create a variable **destGasLimit** of type uint64 which indicates the amount of gas required to execute the function that will handle our cross-chain request on the destination chain. This can be easily calculated using any gas estimator. You can use the *[hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter)* plugin to calculate this.
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
6. Create the constructor with the URI of the NFT metadata, address of gateway contract and the destination gas limit and set these variables inside the constructor. Also initialise the ERC1155 contract by passing it the URI with the constructor as shown above. Also set the admin as msg sender inside the constructor so that the deployer is the admin.

### Transferring an NFT from a source chain to a destination chain

```javascript
function transferCrossChain(
    uint64 chainType,
    string memory chainId,
    uint64 expiryDurationInSeconds,
    uint64 destGasPrice,
    TransferParams memory transferParams
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
                        chainId
                    );		

    CrossTalkUtils.singleRequestWithoutAcknowledgement(
        gatewayContract,
        expiryTimestamp,
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
    	console.log(web3.utils.fromWei(result, 'ether'))
    })
    ```
    5. **transferParams:** The struct of type TransferParams which receives the NFT Ids and the respective amounts the user wants to transfer to the destination chain. It also receives the arbitrary data to be used while minting the NFT on the destination chain and the address of recipient in bytes.
    
2. **Burning the NFTs from user’s account:** The user must own the NFTs to be able to transfer them to the destination chain. We will burn those NFTs from user’s account before creating a cross-chain communication request to the destination chain using the **_burnBatch** method defined in ERC-1155 contract of the Openzeppelin library.
3. **Create the payload:** Here, we only want to send the transfer params to the destination chain. That is why we will just abi encode the transferParams and set it as the payload. 
4. **Calculating the expiry timestamp:** As you must have already guessed, the expiry timestamp will be the **block.timestamp + expiryDurationInSeconds**.
5. **Creating the destChainParams struct:** Create the Destination Chain Params struct with the required parameters: destination gas limit, destination gas price, destination chain type and the destination chain ID.
6. Calling the CrossTalkUtils library’s function to generate a cross-chain communication request: Now the time has come for us to generate a cross-chain communication request to the destination chain. We will now call the CrossTalkUtils library’s function singleRequestWithoutAcknowledgement with the parameters shown in the code above which in turn will call the requestToDest function of the Gateway contract. The documentation for this function can be found [here](../../crosstalkutils-library/how-to-use-the-crosstalkutils-library#a-single-call-without-acknowledgment).
    
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
4. We will now mint the NFTs that we burnt on the source chain to the recipient on the destination chain using the **_mintBatch** function of the ERC-1155 contract of the Openzeppelin library. We will have to convert the address of the recipient from bytes back to address format here. The function **toAddress** to convert bytes to address type can be found [here](../../understanding-crosstalk/requestToDest#6-contractcalls). This function is included in the library and can be used directly as shown in the code snippet above.

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
pragma solidity >=0.8.0 <0.9.0;

import "evm-gateway-contract/contracts/ICrossTalkApplication.sol";
import "evm-gateway-contract/contracts/Utils.sol";
import "@routerprotocol/crosstalk-utils/contracts/CrossTalkUtils.sol";
import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract XERC1155 is ERC1155, ICrossTalkApplication {
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
	}

	function setContractOnChain(
		uint64 chainType, 
		string memory chainId, 
		address contractAddress
	) external {
		require(msg.sender == admin, "only admin");
		ourContractOnChains[chainType][chainId] = toBytes(contractAddress);
	}

	function transferCrossChain(
    uint64 chainType,
    string memory chainId,
		uint64 expiryDurationInSeconds,
    uint64 destGasPrice,
    TransferParams memory transferParams
  ) public payable {
		// burning the NFTs from the address of the user calling this function
    _burnBatch(msg.sender, transferParams.nftIds, transferParams.nftAmounts);

	  bytes memory payload = abi.encode(transferParams);
		uint64 expiryTimestamp = 
					uint64(block.timestamp) + expiryDurationInSeconds;
		Utils.DestinationChainParams memory destChainParams = 
						Utils.DestinationChainParams(
							destGasLimit,
							destGasPrice,
							chainType,
							chainId
						);		

		CrossTalkUtils.singleRequestWithoutAcknowledgement(
			gatewayContract,
			expiryTimestamp,
			destChainParams,
			ourContractOnChains[chainType][chainId], // destination contract address
			payload
		);
  }

	function handleRequestFromSource(
	  bytes memory srcContractAddress,
	  bytes memory payload,
	  string memory srcChainId,
	  uint64 srcChainType
	) external override returns (bytes memory) {
	  require(msg.sender == gatewayContract);
		require(
			keccak256(srcContractAddress) == 
					keccak256(ourContractOnChains[srcChainType][srcChainId])
		);
	
	  TransferParams memory transferParams = 
					abi.decode(payload, (TransferParams));
		_mintBatch(
			// converting the address of recipient from bytes to address
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

	function toBytes(address a) public pure returns (bytes memory b){
    assembly {
        let m := mload(0x40)
        a := and(a, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
        mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))
        mstore(0x40, add(m, 52))
        b := m
    }
	
}
```

</details>

<details>
<summary><b>Deployed Contracts for Reference</b></summary>

**Polygon Mumbai Testnet:** 

**Avalanche Fuji Testnet:** 

</details>
