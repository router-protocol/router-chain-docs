---
title: Transfer of Tokens with an Arbitrary Instruction
sidebar_position: 3
---

```javascript
function iDepositMessage(
    uint256 partnerId,
    bytes32 destChainIdBytes,
    bytes calldata recipient,
    address srcToken,
    uint256 amount,
    uint256 destAmount,
    bytes memory message
) external payable {}
```


The flow is just the same as that of the token transfer explained before. The only difference here is the addition of the message that you need to pass.

### Parameters

| partnerId  | Unique ID for each partner who integrates this functionality and has a fee sharing model with Router. This helps them to track and analyze their cross-chain transactions easily.           |
| --------------- | -------------------------------------------------------------------------------------- |
| destChainIdBytes        | Network IDs of the chains in bytes32 format. These can be found [here](https://github.com/router-protocol/router-chain-docs/blob/main/docs/develop/voyager/tools/configurations/chain-id-identifiers.md).                       |
| recipient     | Wallet address that will receive the tokens on the destination chain. |
| srcToken | Address of the token that has to be transferred from the source chain.                                                                   |
| amount | Decimal-adjusted amount of the token that has to be transferred from the source chain.                                                                   |
| destAmount | Minimum amount of tokens expected to be received by the recipient on the destination chain. This can be achieved by subtracting the forwarder fee from the source chain amount.     |
| message | ABI-encoded data that we need on the destination chain to execute an instruction whenever a cross-chain request is received.   |


The arbitrary instruction or message that you provide here will be executed on the destination chain on the recipient contract address that you specify. That contract must implement `handleMessage` function given below:

```javascript
    function handleMessage(
    address tokenSent,
    uint256 amount,
    bytes memory message
) external;
```

With this function, the following information will be received on the destination chain:

- **tokenSent**: Address of the token that has been received by the recipient contract.
- **amount**: The amount of the aforementioned tokens received by the recipient.
- **message**: The data that was sent from the source chain to be used for execution of the instruction on the destination chain.

Inside the `handleMessage` function on the destination chain, you will decode the data according to the requirements of the function which will complete the instruction execution.


## Examples

#### Example of a function on the source chain to generate a cross-chain sequenced request
```javascript
address public voyager = “address of voyager contract”;

bytes4 public constant I_DEPOSIT_MESSAGE_SELECTOR = bytes4(keccak256("iDepositMessage(uint256,bytes32,bytes,address,uint256,uint256,bytes)"));


function callVoyager(
uint256 partnerId,
bytes32 destChainIdBytes,
bytes calldata recipient,
address srcToken,
uint256 amount,
uint256 destAmount,
bytes memory message
) public payable {
bool success;


(success, ) = voyager.call{ value: msg.value }(
abi.encodeWithSelector(I_DEPOSIT_MESSAGE_SELECTOR, partnerId, destChainIdBytes,recipient, srcToken, amount, destAmount, message)
);


require(success, "Voyager deposit unsuccessful");
}
```

#### Example of a function on the destinaton chain to handle the incoming cross-chain request

In this example, we are demonstrating how to handle a cross-chain staking request (transfer funds and stake them on a contract).

```javascript
address public voyager = “address of the voyager”;


function handleVoyagerMessage(
address tokenSent,
uint256 amount,
bytes memory message
) external {
// Checking if the sender is the voyager contract
require(msg.sender == voyager,"only voyager");
// decoding the data we sent from the source chain
address user = abi.decode(message, (address));
// calling the stake function
stake(user, tokenSent, amount);
}
// The handler function for the stake request
function stake(
address user,
address token,
address amount
) internal {
// Updating the staked balances mapping
stakedBalance[user][token] += amount;
}

```

:::info
Check out this [guide](../guides/crosschain-staking) to learn how to create an end-to-end cross-chain staking dApp using Voyager sequencer.
:::