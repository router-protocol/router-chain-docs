---
title: Sequenced Transfers (tokens + instructions) using Voyager
sidebar_position: 2
---

As we discussed in the previous section, the Voyager allows us to transfer tokens as well as sequence token transfers and arbitrary instructions. In this section, we will explore how you can integrate the Voyager into your smart contracts for sequencing cross-chain token transfers and arbitrary instructions.

The functions that can be called on the Voyager for cross-chain sequencing are:

1. depositReseveTokenAndExecute
2. depositLPTokenAndExecute
3. depositNonReserveTokenAndExecute

While you can definitely integrate only one of these functionalities into your contracts according to your needs, we suggest you to use the call with selector method to be able to call any of these functions from your contracts.

### Getting the data for the token transfer

We will provide an API for the developers which will provide you the calldata for the swap directly. You won’t need to do anything, just call the API, get the data and call the Voyager using that data for token transfers. For the arbitrary instructions, we will demonstrate how you can create the arbitrary data too in this section.

The params for the API call to get data for the swap are:

1. **fromTokenAddress:** Address of the token to be transferred from the source chain.
2. **toTokenAddress:** Address of the token to be received on the destination chain.
3. **fromChainId:** Chain ID of the source chain.
4. **fromChainType:** Chain type of source chain.
5. **toTokenChainId:** Chain ID of the destination chain.
6. **toChainType:** Chain type of destination chain.
7. **isDestNative:** Whether the required token on the destination chain is the native token for that chain.
8. **recipientAddress:** Address of the recipient.
9. **isOnlyTokenTransfer:** This is a boolean value indicating whether the goal is token transfer only. In this case, since we don’t just want token transfers but the sequencing also, we will send false in its place.

The data received from the API response will give you the function selector for deposit function that needs to be called on the Voyager Deposit Handler and the data pertaining to the swap.

### Creating the data for the arbitrary instruction

Arbitrary instructions are custom pieces of code which are executed on the destination chain after the token transfer is complete. The arbitrary data needs to be sent along with the token transfers on the source chain. This data is sent as it is to the destination chain without tampering with it. You can handle the execution of this data on your contract on the destination chain.

Let’s start with a simple token transfer and stake functionality where user will call a function which will transfer the tokens to another chain and then call the stake function to stake the tokens received into the contract.

Let’s say you want to create a function to transfer your funds and then stake it on another chain, then you will need to create a function to create that request on the source chain and a function to handle that request on the destination chain.

Let’s create a function to create that request on the source chain. For the details regarding the Arbitrary Data that needs to be generated, please check [this](../understanding-voyager/transfer-reserve-token-arbitrary-instruction#arbitrary-data).

The arbitrary data consists of six fields:

1. Destination contract address which will handle the request.
2. The selector to the function which has the logic for handling the request.
3. The data which contains the parameters for the function for which selector was passed. Note that this data won’t contain information regarding the token that will be received or the amount of tokens that will be received on the destination chain since this can vary in some cases depending on the fee and liquidity conditions.
4. The address which will get the gas refund if there is some gas left after the execution.
5. The gas limit that needs to be used while executing the call on the destination chain..
6. The gas price that needs to be used while executing the call on the destination chain.

Let’s consider that the handler function for the call on the destination chain is a stake function which looks like:

```javascript
function stake(address user, address token, uint256 amount) internal
```

Then the selector that needs to be passed can be generated easily. So we generate the selector to the function and store it in the **STAKE_FUNCTION_SELECTOR** variable. We take the address of the recipient in whose address the stake will be registered, the refund address, the gas limit and the gas price for the destination chain in the parameters and return the arbitrary data.

```javascript
address public destContractAddress;
// function stake(address user, address token, uint256 amount);
bytes4 public constant STAKE_FUNCTION_SELECTOR = bytes4(keccak256("stake(address,address,uint256)"));

function createDataForStaking(
    address recipient,
    address refundAddress,
    uint256 gasLimit,
    uint256 gasPrice
) public returns (bytes memory) {
    bytes memory data = abi.encode(recipient);

    return abi.encode(
        destContractAddress,
        STAKE_FUNCTION_SELECTOR,
        data,
        refundAddress,
        gasLimit,
        gasPrice
    );
}
```

This gives us the arbitrary data which can be used to call the functions of the Deposit Handler.

### Calling the Voyager Deposit function

```javascript
address public voyagerDepositHandler = "address of voyager deposit handler";
// depositReserveTokenAndExecute(bool,bool,bytes,bytes,bytes)
bytes4 public constant DEPOSIT_RESERVE_AND_EXECUTE_SELECTOR = 0xf64d944a;
// depositNonReserveTokenAndExecute(bool,bool,bytes,bytes,bytes)
bytes4 public constant DEPOSIT_NON_RESERVE_AND_EXECUTE_SELECTOR = 0x79334b17;
// depositLPTokenAndExecute(bool,bytes,bytes,bytes)
bytes4 public constant DEPOSIT_LP_AND_EXECUTE_SELECTOR = 0xe18cfa35;

function callVoyager(
    bytes4 selector,
    bool isSourceNative,
    bool isAppTokenPayer,
    bytes memory swapData,
    bytes memory executeData,
    bytes memory arbitraryData
) public
{
	bool success;

    if (selector == DEPOSIT_RESERVE_AND_EXECUTE_SELECTOR || selector == DEPOSIT_NON_RESERVE_AND_EXECUTE_SELECTOR) {
        (success, ) = voyagerDepositHandler.call{ value: msg.value }(
            abi.encodeWithSelector(selector, isSourceNative, isAppTokenPayer, swapData, executeData, arbitraryData)
        );
    } else {
        (success, ) = voyagerDepositHandler.call{ value: msg.value }(
            abi.encodeWithSelector(selector, isAppTokenPayer, swapData, executeData, arbitraryData)
        );
    }

	require(success == true, "Voyager deposit failed");
}
```

### Handling the request on the destination chain contract

The entry point of the cross-chain request for arbitrary instructions is the **voyagerReceive** function which needs to be implemented on each contract that wants to handle an arbitrary instruction from the Voyager. The detailed explanation for this function can be found [here](../understanding-voyager/transfer-reserve-token-arbitrary-instruction#voyagerreceive).

```javascript
function voyagerReceive(
	address sourceSenderAddress,
	bytes32 srcChainIdBytes,
	bytes4 selector,
	bytes memory data,
	address settlementToken,
	uint256 settlementAmount
) external;
```

This function is called by the Voyager Execute Handler, so make sure that only the Execute Handler can call this contract by using access control or a modifier otherwise the contract can be potentially exploited. Similarly also put a check on the source sender addresses so that only your contracts on different chains can call this function.

The function receives the following parameters:

1. The address of the contract which initiated the request on the source chain.
2. The identifier for the source chain.
3. The selector to the function passed to the contract from the source chain.
4. The data variable sent from the source chain.
5. The address of the token received by the recipient on the destination chain.
6. The amount of tokens received by the recipient on destination chain.

Let’s implement a function on the destination chain to handle the request coming from another chain.

```javascript
address sourceContractAddress;
address voyagerExecuteHandler;
// user address + token address => amount staked
mapping(address => mapping(address => uint256)) stakedBalance;

function voyagerReceive(
    address sourceSenderAddress,
    bytes32 srcChainIdBytes,
    bytes4 selector,
    bytes memory data,
    address settlementToken,
    uint256 settlementAmount
) external {
		// Checking if the sender is the voyager execute handler contract
    require(msg.sender == voyagerExecuteHandler, "only voyager execute handler");
		// Checking if the request initiated by our contract only from the source chain
    require(
            sourceContractAddress == sourceSenderAddress,
            "source sender does not match"
		);

    // Checking the selector that was passed from the source chain
    if (selector == stake.selector) {
        // decoding the data we sent from the source chain
        address user = abi.decode(data, (address));
        // calling the stake function
        stake(user, settlementToken, settlementAmount);
    }
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

In this way, you can handle cross-chain requests from the Voyager on the destination chain.

- [Cross-chain Staking Dapp](../guides/crosschain-staking.md)
