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

import "evm-gateway-contract/contracts/IGateway.sol";
import "evm-gateway-contract/contracts/IApplication.sol";

contract HelloRouter is IApplication {
    IGateway public gatewayContract;
    string public greeting;

    event RequestFromRouterEvent(string indexed bridgeContract, bytes data);

    constructor(address payable gatewayAddress) {
        gatewayContract = IGateway(gatewayAddress);
    }

    function sendStringPayloadToRouter(
        string memory sampleString,
        string memory routerBridgeContract
    ) external payable {
        bytes memory stringPaylaod = abi.encode(sampleString);
        bytes memory payload = abi.encode(1, stringPaylaod);
        gatewayContract.requestToRouter(payload, routerBridgeContract);
    }
    
    function sendRequestToRouter(
        uint64 chainType,
        string memory chainId,
        address destinationContractAddress,
        string memory str,
        string memory routerBridgeContract
    ) public payable {
        bytes memory innerPayload = abi.encode(chainType, chainId, str, destinationContractAddress);
        bytes memory payload = abi.encode(2, innerPayload);
        gatewayContract.requestToRouter(payload, routerBridgeContract);
    }

    function handleRequestFromRouter(string memory sender, bytes memory payload) override external {
        // This check is to ensure that the contract is called from the Gateway only.
        require(msg.sender == address(gatewayContract));
        (string memory sampleStr) = abi.decode(payload, (string));

        require(keccak256(abi.encodePacked(sampleStr)) != keccak256(abi.encodePacked("")));
        greeting = sampleStr;
        emit RequestFromRouterEvent(sender, payload);
    }

    receive() external payable {}
}
```

**Step 6)** Click on the **Solidity compiler** icon (the one shaped like an S), check that your compiler version is within the versions specified in the pragma solidity statement, and click on **Compile HelloRouter.sol**.

<center><img src={require('./images/deploying-a-sample-application-contract/step-6.png').default} alt="Step 6" style={{ marginBottom: 12 }} /></center>

Once compiled, you should see a green tick mark over the **Solidity compiler** icon.

---------------------------------

## Part 2: Deploying a Compiled Contract

**Step 1)** Click on the **Deploy & run transactions** icon (the one with the Ethereum logo) and select **Injected Provider - Metamask** as the **Environment**.

<center><img src={require('./images/deploying-a-sample-application-contract/part-2-step-1.png').default} alt="Step 1" style={{ marginBottom: 12 }} /></center>

**Step 2)** A MetaMask window will pop up following the previous step. Connect the account that we set up in the guide given [here](./setting-up-routers-evm-devnet#part-2-importing-a-wallet-to-interact-with-the-devnet).

> **Warning:** Make sure you're connected to Router's EVM Devnet.

**Step 3)** Add the following gatewayAddress (a required constructor parameter): **`0xF744a7483cc04F2a224126ebCCf0c87214bD66D2`**, click on **Deploy** and sign the transaction in your MetaMask.

<center><img src={require('./images/deploying-a-sample-application-contract/part-2-step-3.png').default} alt="Step 3" style={{ width: 300, marginBottom: 12 }} /></center>

Sometimes the contract deployment fails due to low gas fees, so make sure to edit the gas fees while signing the transaction in your wallet.

<center><img src={require('./images/deploying-a-sample-application-contract/success.png').default} alt="Success" style={{ marginBottom: 12 }} /></center>