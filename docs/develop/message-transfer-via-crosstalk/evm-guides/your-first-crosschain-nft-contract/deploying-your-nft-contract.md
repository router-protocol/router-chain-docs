---
title: Deploying a Sample Cross-Chain NFT Contract
sidebar_position: 1
---

To create cross-chain applications using the Router infrastructure, users will have to build and deploy application contracts on various third-party chains. This section describes how to create a cross-chain NFT smart contract and deploy it on EVM-chains.

## **STEP 1)** Create your Solidity smart contract

We simply inherit Openzeppelin's implementations of popular standard ERC1155, and extend the behavior to our needs. To make NFT cross-chain, we import Router Protocol's evm-gateway-contracts and utilise them as shown in the following code.

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

## **STEP 2)** Cross-Chain functions in brief

### **1)** transferCrossChain Function

This function is responsible for creating a cross-chain NFT-transfer request. It first burns the NFT from contract on source chain, utilises gateway contracts' `ISend` function to send request to mint the NFT to the user on the destination chain.

### **2)** IReceive Function

Once a cross-chain request is initiated from the source chain, the message will be delivered to the destination chain which is received by `IReceive` function that decodes the data and mints the NFT to the user.

## **STEP 3)** Deploy your NFT Contract

### 1) Compile your NFT contract

**Step 1)** Go to https://remix.ethereum.org/

**Step 2)** In the File Explorer pane, click on the plus icon under the **Workspaces** tab to create a new workspace.

<center><img src={require('./images/deploying-a-sample-application-contract/step-2.png').default} alt="Step 2" style={{width: 300, marginBottom: 12}} /></center>

**Step 3)** Under the template option, choose **Blank**, give your workspace an appropriate name and then click on **OK**.

<center><img src={require('./images/deploying-a-sample-application-contract/step-3.png').default} alt="Step 3" style={{width: 300, marginBottom: 12}} /></center>

**Step 4)** In your new workspace, create a new file by the name of **XERC1155.sol**.

<center><img src={require('./images/deploying-a-sample-application-contract/step-4.png').default} alt="Step 4" style={{width: 300, marginBottom: 12}} /></center>

**Step 5)** Copy the smart contract mentioned in STEP 1) and paste it into **XERC1155.sol**.

**Step 6)** Click on the **Solidity compiler** icon (the one shaped like an S), check that your compiler version is within the versions specified in the pragma solidity statement, and click on **Compile HelloRouter.sol**.

<center><img src={require('./images/deploying-a-sample-application-contract/step-6.png').default} alt="Step 6" style={{ marginBottom: 12 }} /></center>

Once compiled, you should see a green tick mark over the **Solidity compiler** icon.

### 2) Deploy the Compiled Contract

**Step 1)** Click on the **Deploy & run transactions** icon (the one with the Ethereum logo) and select **Injected Provider - Metamask** as the **Environment**.

<center><img src={require('./images/deploying-a-sample-application-contract/part-2-step-1.png').default} alt="Step 1" style={{ marginBottom: 12 }} /></center>

**Step 2)** A MetaMask window will pop up following the previous step. Connect with your wallet and confirm.

**Step 3)** Add the gateway address for respective chains from [here](https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/chain_config), your wallet address(it can be EVM wallet address or router wallet address) and URI for the NFT contract, click on **Deploy** and sign the transaction in your MetaMask.

<center><img src={require('./images/deploying-a-sample-application-contract/part-2-step-3.png').default} alt="Step 3" style={{ width: 300, marginBottom: 12 }} /></center>

Sometimes the contract deployment fails due to low gas fees, so make sure to edit the gas fees while signing the transaction in your wallet.

<center><img src={require('./images/deploying-a-sample-application-contract/success.png').default} alt="Success" style={{ marginBottom: 12 }} /></center>

## **STEP 4)** Fee-payer approval and contract configuration

### **1)** Get funds in your wallet from Router-faucet

Go to https://faucet.testnet.routerchain.dev, connect your metamask wallet, select network as `Testnet`, select token as `ROUTE`, paste your wallet address and get test tokens into your account.

<center><img src={require('./images/deploying-a-sample-application-contract/part-4-step-1.png').default} alt="Step 1" style={{  width: 400, marginBottom: 12 }} /></center>

### **2)** Approve your request on Router-explorer

Go to https://explorer.testnet.routerchain.dev/feePayer , connect your wallet and approve the pending request corresponding to your source dapp address.

### **3)** Set address for counterpart contract

Let's say you deployed your contract on Polygon Mumbai and Avalanche Fuji, you need to set the address of the contract deployed on Fuji onto the contract deployed on Mumbai and vice-versa using the `setContractOnChain` function.

<center><img src={require('./images/deploying-a-sample-application-contract/part-4-step-3.png').default} alt="Step 3" style={{  width: 400, marginBottom: 12 }} /></center>

## **STEP 5)** Test your Cross-chain NFT Contract

### **1)** Get request metadata

This function gets you the metadata to be used while initiating a cross-chain transfer request using `transferCrossChain` function. It includes gas limit for destination chain, gas price for destination chain, gas limit for source chain(ackGasLimit), gas price for source chain(ackGasPrice), relayer fees, acknowledgement type, bool if it is a read call and address for additional security module. To know more about request metadata parameters, kindly refer to this [page]().

Create the metadata like this:

<center><img src={require('./images/deploying-a-sample-application-contract/part-5-step-1.png').default} alt="Step 1" style={{  width: 400, marginBottom: 12 }} /></center>

### **2)** Transfer your NFTs crosschain

As explained earlier, `transferCrossChain` function is responsible for creating a cross-chain NFT-transfer request. It first burns the NFT from contract on source chain, utilises gateway contracts' `ISend` function to send request to mint the NFT to the user on the destination chain.

You need to call this function by putting the chain id for destination chain; tuple of transfer parameters that contain NFT ID to be transferred, amount of that NFT id, nft data and the address of the recipient of those NFTs on destination chain; and the request metadata that we created in previous step.

<center><img src={require('./images/deploying-a-sample-application-contract/part-5-step-2.png').default} alt="Step 2" style={{  width: 300, marginBottom: 12 }} /></center>

### **3)** Track your transaction on Router Explorer

You can track the status of your transaction on [Router Explorer](https://explorer.testnet.routerchain.dev/)

### **4)** Successfully receive your NFTs on destination chain

After the transaction is successfully executed, you should now be able to see your updated NFT balance on destination chain.
