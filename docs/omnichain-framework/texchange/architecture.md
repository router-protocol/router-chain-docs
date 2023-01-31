---
title: Architecture
sidebar_position: 1
---

## Functionality
TExchange is built using the Router's Omnichain Framework. It provides 3 major functionality to it's users -
1. Buy a testnet token using USDC
2. Sell a testnet token for USDC
3. Swap any testnet native token to another

TExchange is connected to multiple chains -
1. Testnet chains such as Mumbai Polygon, Goerli Eth etc. - hold the logic for locking and unlocking the testnet tokens into user's wallets
2. Router Chain - holds the logic for all swaps take place and connects all the testnet chains with each other
3. Mainnet chain - the TExchange will be connected to a mainnet chain, this mainnet chain will be used for converting testnet tokens to USDC

## High Level Architecture
TEchange utilizes Router's Omnichain Framework to provide the token swap functionality to it's users. The heavy lifting of the swapping algorithm resides on the Router chain while the remaining chains are only used to lock and unlock funds. 
On Router chain TEchange has a DEX in the background which maintains the liquidity pairs for all the testnet tokens. Each testnet token has a pair with wrapped USDC. Whenever there is a request for a token swap on any chain, the request gets routed to Router chain where the DEX is utilized to convert the token into the required token and then a request is sent to the chain where the token is supposed to be unlocked.
This architecture makes things much more scalable for TExchange -
1. Liquidity pools need to be maintained only on a single chain which means there is no liquidity fragmentation
2. All the heavy logic of swaps via multiple paths is on Router chain which is a low cost chain, making TEchange cost-effective
3. Given the core logic sits on Router chain, other chains have simple functionality of locking and unlocking tokens. Hence, to extend this functionality across more chains such as non-EVM chains, the amount of effort will be considerably low. 

## User Flow
### Buy Testnet Tokens
Users can buy testnet tokens from the TExchange. Below is how the flow works -
1. User is on the Mainnet chain
2. User selects the testnet tokens which they want to buy (let's say Goerli Eth; GETH)
3. User is shown the amount of USDC required to buy these tokens
4. User signs the transaction
5. USDC is deducted from the user's account
6. USDC gets locked on Mainnet chain
7. A message is sent from the Mainnet chain via the Router's Omnichain Framework to Router chain with the amount of tokens which were locked
8. On Router chain the inbound messages from Mainnet chain is received. Same amount of wrapped USDC is minted and then the DEX is utilized to convert the wUSDC to wGETH
9. The middleware contract on Router chain then burns these wGETH and creates an outbound request to unlock these tokens on the destination (Goerli Ethereum) chain
10. The message is received by the contract on Goerli Ethereum chain and it unlocks the required amount of funds to the user's address

### Sell Testnet Tokens
Users can sell their testnet tokens on the TExchange to earn mainnet USDC. Below is how the flow works -
1. User is on the testnet chain whose tokens they want to sell (let's say Mumbai Matic; mMatic)
2. User selects the amount of tokens they want to sell
3. User is shown the amount of USDC they will recieve for selling these tokens
4. User signs the transaction
5. Testnet tokens (mMatic) are deducted from the user's account
6. mMatic gets locked on Mumbai Polygon chain
7. A message is sent from the Mumbai Polygon chain via the Router's Omnichain Framework to Router chain with the amount of tokens which were locked
8. On Router chain the inbound messages from Mumbai Polygon chain is received. Same amount of wrapped mMatic is minted and then the DEX is utilized to convert the wmMatic to wUSDC
9. The middleware contract on Router chain then burns these wUSDC and creates an outbound request to unlock these tokens on the destination (Mainnet) chain
10. The message is received by the contract on Mainnet chain and it unlocks the required amount of USDC to the user's address

### Swap Testnet Tokens
Users can swap one testnet token to another testnet token via the TExchange. The flow works as below -
1. User is on the testnet chain whose tokens they want to sell (let's say Mumbai Polygon; mMatic)
2. User selects the testnet tokens which they want to buy (let's say Goerli Eth; wGETH)
3. User is shown the amount of mMatic required to buy these tokens
4. User signs the transaction
5. mMatic is deducted from the user's account
6. mMatic gets locked on Mumbai Polygon chain
7. A message is sent from the Mumbai Polygon chain via the Router's Omnichain Framework to Router chain with the amount of tokens which were locked
8. On Router chain the inbound messages from Mainnet chain is received. Same amount of wrapped mMatic is minted and then the DEX is utilized to convert the wmMatic to wGETH
9. The middleware contract on Router chain then burns these wGETH and creates an outbound request to unlock these tokens on the destination (Goerli Ethereum) chain
10. The message is received by the contract on Goerli Ethereum chain and it unlocks the required amount of funds to the user's address