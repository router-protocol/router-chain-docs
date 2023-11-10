---
title: Asset Transfers
sidebar_position: 1
---

As we discussed in the previous section, Voyager allows us to transfer/swap assets between chains. In this section, we will explore how you can integrate Voyager into your smart contracts for cross-chain token transfers.

The functions that can be called on the Voyager for cross-chain token transfers are:

1. depositReserveToken
2. depositLPToken
3. depositNonReserveToken

While you can definitely integrate only one of these functionalities into your contracts according to your needs, we suggest you to use the call with the selector method to be able to call any of these functions from your contracts.

### Getting the data for the token transfer

We will provide an API for the developers which will provide the calldata for the swap directly. You can call the API, get the data, and call Voyager using that data.

The params for the API call are: 

1. **fromTokenAddress:** Address of the token to be transferred from the source chain.
2. **toTokenAddress:** Address of the token to be received on the destination chain.
3. **fromChainId:** Chain ID of the source chain.
4. **fromChainType:** Chain type of the source chain.
5. **toChainId:** Chain ID of the destination chain.
6. **toChainType:** Chain type of the destination chain.
7. **isDestNative:** Whether the required token on the destination chain is the native token for that chain.
8. **recipientAddress:** Address of the recipient.
9. **isOnlyTokenTransfer:** This is a boolean value indicating whether the goal is token transfer only or do we want to execute an instruction along with token transfer. In this case, since we just want to transfer tokens, we will send true in its place.

The data received from the API response can directly be fed into the contract for execution.

```javascript
address public voyagerDepositHandler = "address of voyager deposit handler";
// depositReserveToken(bool,bytes,bytes)
bytes4 public constant DEPOSIT_RESERVE_SELECTOR = 0x3a139384;
// depositNonReserveToken(bool,bytes,bytes)
bytes4 public constant DEPOSIT_NON_RESERVE_SELECTOR = 0x0ae79779;
// depositLPToken(bytes,bytes)
bytes4 public constant DEPOSIT_LP_SELECTOR = 0xb78802d9;

function callVoyager(bytes4 depositFunctionSelector, bytes calldata data) public {
	bool success;
	bytes memory data;
	if(
		depositFunctionSelector == DEPOSIT_RESERVE_SELECTOR ||
		depositFunctionSelector == DEPOSIT_NON_RESERVE_SELECTOR
	) {
		(bool isSourceNative, bytes memory swapData, bytes memory executeData) 
				= abi.decode(data, (bool, bytes, bytes));
		(success, data) = voyagerDepositHandler.call(
				abi.encodeWithSelector(
							depositFunctionSelector, 
							isSourceNative, 
							swapData, 
							executeData
					)
		);
	} else if(depositFunctionSelector == DEPOSIT_LP_SELECTOR) {
		(bytes memory swapData, bytes memory executeData) 
				= abi.decode(data, (bytes, bytes));
		(success, data) = voyagerDepositHandler.call(
				abi.encodeWithSelector(
							DEPOSIT_LP_SELECTOR, 
							swapData, 
							executeData
					)
		 );
	
	}

	require(success == true, "Voyager deposit failed");
} 
```

:::info
💡 In the case of Reserve Token deposit or Non-Reserve Token deposit, if the <code>isSourceNative</code> parameter is true, then you need to send native tokens also with the call using the value method of solidity.
:::
```javascript
uint256 amountOfNativeTokens = abi.decode(swapData, (uint256));
(success, data) = voyagerDepositHandler.call{value: amountOfNativeTokens}(
                abi.encodeWithSelector(
                            depositFunctionSelector, 
                            isSourceNative, 
                            swapData, 
                            executeData
                    )
        );
```

:::caution
The Voyager deducts tokens to be transferred from the contract or the user which called the Voyager’s deposit function. Hence, in case your contract is the one calling the deposit function then before calling the deposit function on the Deposit Handler please make sure to -
1. Transfer the funds from user’s wallet to your contract 
2. Approve the Voyager Deposit Handler contract from your contract to deduct those tokens from your contract
:::