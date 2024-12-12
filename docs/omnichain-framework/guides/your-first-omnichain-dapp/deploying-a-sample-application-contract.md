---
title: 2) Deploying a Sample Application Contract
sidebar_position: 2
---

## Part 1: Compiling our Application Contract

**Step 1)** Go to https://remix.ethereum.org/

**Step 2)** In the File Explorer pane, click on the plus icon under the **Workspaces** tab to create a new workspace.

<center><img src={require('./images/deploying-a-sample-application-contract/step-2.png').default} alt="Step 2" style={{width: 300, marginBottom: 12}} /></center>

**Step 3)** Under the template option, choose **Blank**, give your workspace an appropriate name and then click on **OK**.

<center><img src={require('./images/deploying-a-sample-application-contract/step-3.png').default} alt="Step 3" style={{width: 300, marginBottom: 12}} /></center>

**Step 4)** In your new workspace, create a new file by the name of **HelloRouter.sol**.

<center><img src={require('./images/deploying-a-sample-application-contract/step-4.png').default} alt="Step 4" style={{width: 300, marginBottom: 12}} /></center>

**Step 5)** Copy the following code and paste it into **HelloRouter.sol**.

```javascript
// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@routerprotocol/evm-gateway-contracts@1.1.11/contracts/IGateway.sol";
import "hardhat/console.sol";

contract HelloRouter {
    address public owner;
    IGateway public gatewayContract;
    string public greeting;

    error CustomError(string message);

    constructor(address payable gatewayAddress, string memory _feePayer) {
        owner = msg.sender;
        gatewayContract = IGateway(gatewayAddress);
        setDappMetadata(_feePayer);
    }

    function setDappMetadata(string memory FeePayer) public {
        require(msg.sender == owner, "Only Owner can set fee payer");
        gatewayContract.setDappMetadata(FeePayer);
    }

    function iSend(
    string calldata destChainId,
    string calldata destinationContractAddress,
    string calldata str,
    bytes calldata requestMetadata
    ) public payable {
    bytes memory packet = abi.encode(str);
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

    function iReceive(
    string memory ,//requestSender,
    bytes memory packet,
    string memory //srcChainId
  ) external returns (string memory) {
    require(msg.sender == address(gatewayContract), "only gateway");
    greeting = abi.decode(
      packet,
      (string)
    );
    if (
      keccak256(abi.encodePacked(greeting)) == keccak256(abi.encodePacked(""))
    ) {
      revert CustomError("String should not be empty");
    }
    return greeting;
  }

    receive() external payable {}
}
```

**Step 6)** Click on the **Solidity compiler** icon (the one shaped like an S), check that your compiler version is within the versions specified in the pragma solidity statement, and click on **Compile HelloRouter.sol**.

<center><img src={require('./images/deploying-a-sample-application-contract/step-6.png').default} alt="Step 6" style={{ marginBottom: 12 }} /></center>

Once compiled, you should see a green tick mark over the **Solidity compiler** icon.

---

## Part 2: Deploying a Compiled Contract

**Step 1)** Click on the **Deploy & run transactions** icon (the one with the Ethereum logo) and select **Injected Provider - Metamask** as the **Environment**.

<center><img src={require('./images/deploying-a-sample-application-contract/part-2-step-1.png').default} alt="Step 1" style={{ marginBottom: 12 }} /></center>

**Step 2)** A MetaMask window will pop up following the previous step. Connect the account that we set up in the guide given [here](./setting-up-routers-evm-devnet#part-2-importing-a-wallet-to-interact-with-the-devnet).

> **Warning:** Make sure you're connected to Router's EVM Testnet.

**Step 3)** Add the gateway address for respective chain from (mentioned in below table), click on **Deploy** and sign the transaction in your MetaMask.

<APIData
  apiData={[
    { contractConfigUrl: 'https://lcd.sentry.routerchain.dev/router-protocol/router-chain/multichain/contract_config?pagination.limit=10000', 
    chainConfigUrl: 'https://lcd.sentry.routerchain.dev/router-protocol/router-chain/multichain/chain_config', 
    networkType: 'Testnet' }
  ]}
/>

:::info
You can pass your own address (either your `0x` address or the corresponding Router Chain address) as the `feePayerAddress`. Just make sure you have funds on the Router Chain testnet. If not, you can get funds from our [faucet](https://faucet.routerprotocol.com/).
:::
<p style={{ marginBottom: '50px' }}></p>

<center><img src={require('./images/deploying-a-sample-application-contract/part-2-step-3.png').default} alt="Step 3" style={{ width: 300, marginBottom: 12 }} /></center>

Sometimes the contract deployment fails due to low gas fees, so make sure to edit the gas fees while signing the transaction in your wallet.

<center><img src={require('./images/deploying-a-sample-application-contract/success.png').default} alt="Success" style={{ marginBottom: 12 }} /></center>
