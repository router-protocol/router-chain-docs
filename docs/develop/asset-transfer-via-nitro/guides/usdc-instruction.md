---
title: USDC CCTP with Instructions Example
sidebar_position: 1
---

## Guides

Lets build a sample application smart contract to implement this. Let's say a user wants to build an investment application on chains A and B which can accept cross-chain deposits of USDC. A user holding USDC on chain A should be able to burn USDC and get it minted and invested on the plaform on chain B.

To build the Investment application smart contract, two functions are needed:

- A deposit and send message function.
- A function for handling message from the destination chain. This function has to be of the type defined below:
  - ```javascript
      function handleMessage(address tokenSent, uint amount, bytes memory message) external;
    ```
  - This function is called by `NitroCCTPMessage` contract when funds are received into the application contract on the destination chain and only the message execution is pending.

**Implementation**

<details>
<summary><b>Initializing the contract</b></summary>

#### Installing the dependencies

Install the openzeppelin contracts by running the following command:

`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

#### Initializing the contract

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Handles ERC20 deposits and deposit executions.
/// @author Router Protocol.
interface IMessageHandler {
    function handleMessage(address tokenSent, uint amount, bytes memory message) external;
}

/// @title Handles deposit of USDC with instructions.
/// @author Router Protocol.
interface INitroCCTPMessage {
    /// @notice Function to deposit and burn USDC with message.
    /// @param partnerId Partner ID for the partner integrating this contract.
    /// @param destChainId Chain ID for the destination chain.
    /// @param recipient Address of the recipient on destination chain.
    /// @param amount Amount being transferred.
    /// @param destGasLimit Gas limit for message execution on destination chain.
    /// @param message Message being transferred to the destination chain.
    function depositUsdcMessage(
        uint partnerId,
        string memory destChainId,
        bytes memory recipient,
        uint amount,
        uint64 destGasLimit,
        bytes memory message
    ) external payable;

    /// @notice Function to calculate fee for a destination chain in terms of source native tokens.
    /// @param destChainId Chain ID of the destination chain.
    /// @param destGasLimit Gas limit for execution on the destination chain.
    /// @return totalFee Total fee in native tokens.
    /// @return forwarderFee Fee for mintUsdc on destination chain.
    /// @return iSendFee Fee for iSend on Router Gateway.
    /// @return iReceiveFee Fee for iReceive on destination chain.
    function getFee(
        string memory destChainId,
        uint64 destGasLimit
    ) external view returns (
        uint256 totalFee,
        uint256 forwarderFee,
        uint256 iSendFee,
        uint256 iReceiveFee
    );
}

/// @title Investment application contract.
/// @author Router Protocol.
contract Investment is IMessageHandler {
    using SafeERC20 for IERC20;

    // address of the usdc token
    IERC20 public usdc;
    // address of the nitro cctp message smart contract
    INitroCCTPMessage public nitroCctpMessage;
    // Partner ID which application can get from Router Protocol to track its transactions better
    uint256 partnerId = 1;
    // mapping of investments for a particular user
    mapping(address user => uint256 invested) public investments;
    // gas limit for execution of message on destination chain
    // this is dependent on logic inside the handleMessage function and will change
    // according to the complexity of logic in the handleMessage function
    uint256 destGasLimit = 250000;

    constructor(address _usdc, address _nitroCctpMessage) {
        usdc = IERC20(_usdc);
        nitroCctpMessage = INitroCCTPMessage(_nitroCctpMessage);
    }
}
```

</details>

<details>
<summary><b>Implementing the deposit and send message function</b></summary>

Add this function in the Investment contract. Details of the parameters are mentioned in the comments.

```javascript
/// @notice Function to burn USDC and send a message along with it.
/// @param refundAddress Address of the refund recipient on destination chain if the transaction fails on destination chain.
/// @param destChainId Chain ID of the destination chain.
/// @param recipient Address of the recipient application contract on the destination chain.
/// @param amount Amount of USDC tokens to burn.
function depositWithMessage(
    address refundAddress,
    string memory destChainId,
    bytes memory recipient,
    uint amount
) external payable {
    usdc.safeTransferFrom(msg.sender, address(this), amount);
    usdc.safeIncreaseAllowance(address(nitroCctpMessage), amount);

    bytes memory message = abi.encode(refundAddress, msg.sender);
    (uint256 fee,,, ) = nitroCctpMessage.getFee(destChainId, destGasLimit);
    if (fee != msg.value) revert ("Insufficient fee passed");

    nitroCctpMessage.depositUsdcMessage{value: fee}(
        partnerId,
        destChainId,
        recipient,
        amount,
        destGasLimit,
        message
    );
}
```

User should call this function when they want to invest cross-chain. They must pass the necessary fees in native tokens along this call.

In this function, the message is generated by encoding the refund address and the address of the user. This is done because the application needs to know the refund address and the user address to allot investment on the destination chain. However, anything can be passed on as message based on requirements of the application.

This function transfers the USDC from the user to itself and then call the `depositUsdcMessage` function on the `NitroCCTPMessage` contract.

</details>

<details>
<summary><b>Implementing the handleMessage function</b></summary>
Add this function to the Investment contract. Details of the parameters are mentioned in the comments.

```javascript
/// @notice Function to handle message sent from nitroCctpMessage contract.
/// @dev If this function is called, that means funds have already arrived into the smart contract.
/// @param tokenSent Address of the token received from nitroCctpMessage contract. In this case, it will always be USDC token.
/// @param amount Amount of USDC received.
/// @param message The message passed by the application contract from the source chain. In this case, this is just an encoded address. However application has full freedom to pass whatever they want.
function handleMessage(
    address tokenSent,
    uint amount,
    bytes memory message
) external {
    address refundAddress = abi.decode(message, (address));
    if (msg.sender != address(nitroCctpMessage)) revert ("Unauthorized sender");

    // If token sent by the NitroCCTPMessage contract is not usdc, then refund whatever token was sent
    // to the refund recipient
    if (tokenSent != address(usdc)) IERC20(tokenSent).safeTransfer(refundAddress, amount);

    (, address recipient) = abi.decode(message, (address, address));
    investments[recipient] += amount;
}
```

This function can only be called by the `NitroCCTPMessage` contract. If this function is being called, it means funds have already arrived and it just needs to be allocated to the user.

Since the application sent the refundAddress and user address in the message from the source chain (in the `depositWithMessage` function), it can be decoded similarly. Since this is a USDC investment contract, if token received is not USDC, the contract refunds it to the refund address, otherwise funds are alloted to the recipient address received in the message.

:::info
If the application doesn't implement the `handleMessage` function, the funds will be sent to the application on the destination chain and the process will exit.
:::

</details>

<details>
<summary><b>Full Application Contract</b></summary>

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";

/// @title Handles ERC20 deposits and deposit executions.
/// @author Router Protocol.
interface IMessageHandler {
    function handleMessage(address tokenSent, uint amount, bytes memory message) external;
}

/// @title Handles deposit of USDC with instructions.
/// @author Router Protocol.
interface INitroCCTPMessage {
    /// @notice Function to deposit and burn USDC with message.
    /// @param partnerId Partner ID for the partner integrating this contract.
    /// @param destChainId Chain ID for the destination chain.
    /// @param recipient Address of the recipient on destination chain.
    /// @param amount Amount being transferred.
    /// @param destGasLimit Gas limit for message execution on destination chain.
    /// @param message Message being transferred.
    function depositUsdcMessage(
        uint partnerId,
        string memory destChainId,
        bytes memory recipient,
        uint amount,
        uint64 destGasLimit,
        bytes memory message
    ) external payable;

    /// @notice Function to calculate fee for a destination chain in terms of source native tokens.
    /// @param destChainId Chain ID of the destination chain.
    /// @param destGasLimit Gas limit for execution on the destination chain.
    /// @return totalFee Total fee in native tokens.
    /// @return forwarderFee Fee for mintUsdc on destination chain.
    /// @return iSendFee Fee for iSend on Router Gateway.
    /// @return iReceiveFee Fee for iReceive on destination chain.
    function getFee(
        string memory destChainId,
        uint64 destGasLimit
    ) external view returns (
        uint256 totalFee,
        uint256 forwarderFee,
        uint256 iSendFee,
        uint256 iReceiveFee
    );
}

/// @title Investment application contract.
/// @author Router Protocol.
contract Investment is IMessageHandler {
    using SafeERC20 for IERC20;

    // address of the usdc token
    IERC20 public usdc;
    // address of the nitro cctp message smart contract
    INitroCCTPMessage public nitroCctpMessage;
    // Partner ID for Nitro which application can get from Router Protocol to track its transactions better
    uint256 partnerId;
    // mapping of investments for a particular user
    mapping(address user => uint256 invested) public investments;
    // gas limit for execution of message on destination chain
    // this is dependent on logic inside the handleMessage function and will change
    // according to the complexity of logic in the handleMessage function
    uint256 destGasLimit = 250000;


    constructor(address _usdc, address _nitroCctpMessage) {
        usdc = IERC20(_usdc);
        nitroCctpMessage = INitroCCTPMessage(_nitroCctpMessage);
    }

    /// @notice Function to burn USDC and send a message along with it.
    /// @param refundAddress Address of the refund recipient on destination chain if the transaction fails on destination chain.
    /// @param destChainId Chain ID of the destination chain.
    /// @param recipient Address of the recipient application contract on the destination chain.
    /// @param amount Amount of USDC tokens to burn.
    function depositWithMessage(
        address refundAddress,
        string memory destChainId,
        bytes memory recipient,
        uint amount
    ) external payable {
        usdc.safeTransferFrom(msg.sender, address(this), amount);
        usdc.safeIncreaseAllowance(address(nitroCctpMessage), amount);

        bytes memory message = abi.encode(refundAddress, msg.sender);
        (uint256 fee,,, ) = nitroCctpMessage.getFee(destChainId, destGasLimit);
        if (fee != msg.value) revert ("Insufficient fee passed");

        nitroCctpMessage.depositUsdcMessage{value: fee}(
            partnerId,
            destChainId,
            recipient,
            amount,
            destGasLimit,
            message
        );
    }

    /// @notice Function to handle message sent from nitroCctpMessage contract.
    /// @dev If this function is called, that means funds have already arrived into the smart contract.
    /// @param tokenSent Address of the token received from nitroCctpMessage contract. In this case, it will always be USDC token.
    /// @param amount Amount of USDC received.
    /// @param message The message passed by the application contract from the source chain. In this case, this is just an encoded address. However application has full freedom to pass whatever they want.
    function handleMessage(
        address tokenSent,
        uint amount,
        bytes memory message
    ) external {
        address refundAddress = abi.decode(message, (address));
        if (msg.sender != address(nitroCctpMessage)) revert ("Unauthorized sender");

        // If token sent by the NitroCCTPMessage contract is not usdc, then refund whatever token was sent
        // to the refund recipient
        if (tokenSent != address(usdc)) IERC20(tokenSent).safeTransfer(refundAddress, amount);

        (, address recipient) = abi.decode(message, (address, address));
        investments[recipient] += amount;
    }
}
```

</details>
