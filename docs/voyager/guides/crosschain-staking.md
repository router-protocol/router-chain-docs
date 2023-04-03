---
title: Staking Contract using Voyager
sidebar_position: 1
---

# Cross-Chain Staking Dapp

In this section, we shall create a simple cross-chain staking dapp using the voyager sequencer. We shall follow the instructions provided in the previous section to create the same. It consists of two smart contracts: **Vault** and **Stake**.

**Vault** contract enables the user to first transfer his funds from chain A to chain B and then stake them on chain B.
**Stake** contract manages the staked tokens balance on the destination side. In other words, Stake contract is the fund and state manager of the Vault contract.

<details>
<summary><b>VAULT CONTRACT</b></summary>

#### Installing the dependencies

Install the openzeppelin contracts by running the following command:
`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

#### Instantiating the contract

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IStake.sol";

contract Vault is AccessControl {
}
```

Import the `SafeERC20.sol`and `AccessControl.sol` from `@openzeppelin/contracts`and `IStake.sol`.

Inherit the `AccessControl` contract into your `Vault contract`.

For your information:

1. `IStake.sol` is the interface of `Stake` contract which we need here for defining an instance of staking contract into our `Vault` contract.
2. `SafeERC20.sol` is the contract we shall use to access various functions of ERC20 tokens.
3. `AccessControl.sol` is the contract we shall use for putting admin controls over certain important functions.

#### Creating state variables and the constructor

```solidity
using SafeERC20 for IERC20;
IStake public stakingContract;

address public voyagerDepositHandler;
address public voyagerExecuteHandler;

mapping(bytes32 => address) public ourContractsOnChain;

// depositReserveTokenAndExecute(bool,bool,bytes,bytes,bytes)
bytes4 public constant DEPOSIT_RESERVE_AND_EXECUTE_SELECTOR = 0xf64d944a;
// depositNonReserveTokenAndExecute(bool,bool,bytes,bytes,bytes)
bytes4 public constant DEPOSIT_NON_RESERVE_AND_EXECUTE_SELECTOR = 0x79334b17;
// depositLPTokenAndExecute(bool,bytes,bytes,bytes)
bytes4 public constant DEPOSIT_LP_AND_EXECUTE_SELECTOR = 0xe18cfa35;

bytes4 public constant STAKE_FUNCTION_SELECTOR =
    bytes4(keccak256("receiveStakeCrossChain(address,address,uint256)"));

constructor(address _voyagerDepositHandler, address _voyagerExecuteHandler)
{
    voyagerDepositHandler = _voyagerDepositHandler;
    voyagerExecuteHandler = _voyagerExecuteHandler;
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
}
```

1. `stakingContract`: This is the instance of our `Stake` contract which will manage the state and balance of funds in both kind of transfers: same chain as well as cross-chain.
2. `voyagerDeposithandler` & `voyagerExecuteHandler` : These are the variables created for storing the addresses of Deposit and Execute handlers. We will be using Deposit Handler for calling the voyager that initiates the cross-chain sequenced transfer on the source side using function selectors of `voyagerDeposithandler` and Execute Handler for validating if the transaction is triggered on the destination side by Execute Handler only.
3. `ourContractsOnChain` : This is the mapping that stores the address of the vault contract corresponding to the destination chain Id identifiers which can be found [here](../tools/configurations/chain-id-identifiers.md).
4. `DEPOSIT_RESERVE_AND_EXECUTE_SELECTOR, DEPOSIT_NON_RESERVE_AND_EXECUTE_SELECTOR & DEPOSIT_LP_AND_EXECUTE_SELECTOR` : These are the selectors of various functions in `voyagerDeposithandler` which assist us to identify the type of token transfer(whether it is a reserve token, non-reserve token or a LP token).
5. `STAKE_FUNCTION_SELECTOR` : This is the selector of the function that is called whenever a cross-chain call is received on the destination chain. This is the function for your reference:

```solidity
function receiveStakeCrossChain(
        address _user,
        address _token,
        uint256 _amount
    ) internal {
        stakingContract.stake(_user, _token, _amount);
    }
```

6. `Constructor` : Create the constructor with address of voyagerDepositHandler and voyagerExecuteHandler and set them into our state variables along with giving the `DEFAULT_ADMIN_ROLE` to the deployer.

#### Function to set the Staking contract

```solidity
function setStakingContract(address _stakingContract)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stakingContract = IStake(_stakingContract);
    }
```

Our Vault contract on every chain must know the address of its corresponding Stake contract on same chain to interact with it whenever a cross-chain call is received by Vault. Hence we create a function `setStakingContract` to store the address of Stake Contract on the same chain.

#### Function to store the addresses of Vault contracts deployed on other chains

```solidity
function setContractsOnChain(bytes32 chainIdBytes, address contractAddr) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ourContractsOnChain[chainIdBytes] = contractAddr;
    }
```

Our Vault contract on every chain must know the addresses of its counterparts on every other chain to enable cross-chain transfers or cross-chain sequenced transfers. Hence we create a function `setContractsOnChain` that updates the mapping `ourContractsOnChain` about which we talked about earlier.

#### Function to approve Stake contract to safely transfer funds from Vault

```solidity
function approve(address token, address spender, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(token).approve(spender, amount);
    }
```

Whenever a cross-chain transfer happens and funds are received by Vault contract on the destination chain, they are directed to Stake contract after which the staked balance in the name of the user is updated. Vault contract on every chain must approve Stake contract on the same chain to be able to transfer a certain amount of tokens to itself from Vault. Thus we create a function `approve` to facilitate this.

#### \*Function to convert a variable of type `address` to type `bytes`

```solidity
function toBytes(address addr) internal pure returns (bytes memory b) {
        assembly {
            let m := mload(0x40)
            addr := and(addr, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
            mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, addr))
            mstore(0x40, add(m, 52))
            b := m
        }
    }
```

\*this is just a supporting function. We shall use it as a converter whenever an address has to be passed as a parameter in the form of bytes.

#### Function that enables cross-chain sequenced transfers

```solidity
function stakeCrossChain(
        bytes4 selector,
        bool isSourceNative,
        bool isAppTokenPayer,
        address recipient,
        address refundAddress,
        uint256 gasLimit,
        uint256 gasPrice,
        bytes memory swapData,
        bytes memory executeData
    ) public payable {
        bytes32 destChainIdBytes = abi.decode(swapData, (bytes32));
        bytes memory data = abi.encode(recipient);

        bytes memory arbitraryData = abi.encode(
            toBytes(ourContractsOnChain[destChainIdBytes]),
            STAKE_FUNCTION_SELECTOR,
            data,
            toBytes(refundAddress),
            gasLimit,
            gasPrice
        );

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

        require(success, "unsuccessful");
    }
```

It is the `stakeCrossChain` function that:

1. Encodes the data that we need on the destination chain whenever a cross-chain call is received. Here we need the recipient or user address to update the staked balance in user's name on destination chain.
2. Creates arbitrary instructions by encoding destination chain id identifier, selector of the function that needs to be called on destination chain, data that we encoded in previous step, address to be considered for refund in bytes format, gas limit and gas price.
3. Checks the selector for functions contained in Voyager deposit handler and calls it according to the data passed in the parameters.

Let us understand the parameters of `stakeCrossChain` function one by one:

1. `selector` : This is one of the selectors of various functions in `voyagerDeposithandler` which assist us to identify the type of token transfer (whether it is a reserve token, non-reserve token or a LP token) This shall be provided to you with the help of an API.
2. `isSourceNative` : This is a boolean that should be set true if the source token is native to source chain and false in other case.
3. `isAppTokenPayer` : This is a boolean that should be set true if the source contract is going to pay the tokens to the Voyager for transferring it to the destination chain. If you want the signer of the transaction to pay these tokens, set this to false.
4. `recipient` : This is the address of the user in whose name the staked balance would be updated on the destination chain.
5. `refundAddress` : This is the address to be considered for refund.
6. `gasLimit` : This is the gas limit for destination chain
7. `gasPrice` : This is the gas price for destination chain
8. `swapData` : This is the data required for token transfer on source chain. This shall be provided to you with the help of an API.
9. `executeData` : This is the data required for token transfer on destination chain. This shall be provided to you with the help of an API.

#### Function that receives the cross-chain call and executes the Stake function on destination chain

```solidity
function voyagerReceive(
        address sourceSenderAddress,
        bytes32 srcChainIdBytes,
        bytes4 selector,
        bytes memory data,
        address settlementToken,
        uint256 settlementAmount
    ) external {
        // Checking if the sender is the voyager execute handler contract
        require(
            msg.sender == voyagerExecuteHandler,
            "only voyager execute handler"
        );
        // Checking if the request initiated by our contract only from the source chain
        require(sourceSenderAddress == ourContractsOnChain[srcChainIdBytes], "not our contract");

        // Checking the selector that was passed from the source chain
        if (selector == STAKE_FUNCTION_SELECTOR) {
            // decoding the data we sent from the source chain
            address user = abi.decode(data, (address));
            // calling the stake function
            receiveStakeCrossChain(user, settlementToken, settlementAmount);
        }
    }
```

It is the `voyagerReceive` function that:

1. Requires that the caller of the function is Voyager Execute Handler only.
2. Checks if the cross-chain request was initiated from our counterpart on the source chain or not.
3. Checks if the selector is of the same function that we need to call on destination chain. Here it is the selector of `receiveStakeCrossChain` function.
4. Decodes the data that we encoded (recipient address )at the time of initiating the cross-chain transfer.
5. Calls the `receiveStakeCrossChain` function with its parameters.

</details>

<details>
<summary><b>ISTAKE</b></summary>

It is the interface for our Stake contract. Find the code snippet below:

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IStake {
    function stake(
        address user,
        address token,
        uint256 amount
    ) external;

    function unstake(
        address user,
        address token,
        uint256 amount
    ) external;
}
```

</details>

<details>
<summary><b>STAKE CONTRACT</b></summary>

#### Installing the dependencies

Install the openzeppelin contracts by running the following command:
`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

#### Instantiating the contract

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IStake.sol";

contract Stake is IStake {}
```

Import the `SafeERC20.sol`and `SafeMath.sol` from `@openzeppelin/contracts`and `IStake.sol`.

Inherit the `IStake` contract into your `Stake contract`.

For your information:

1. `IStake.sol` is the interface of `Stake` contract which we need here for defining an instance of staking contract into our `Vault` contract.
2. `SafeERC20.sol` is the contract we shall use to access various functions of ERC20 tokens.
3. `SafeMath.sol` is the wrapper contract over Solidity’s arithmetic operations with added overflow checks.

#### Creating State variables and the constructor

```solidity
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    address public immutable vault;

    // user address => token address => staked amount
    mapping(address => mapping(address => uint256)) public stakedBalance;

    constructor(address _vault) {
        vault = _vault;
    }
```

1. `vault`: This is the address of our Vault contract on the same chain.
2. `stakedBalance` : This is the mapping that stores the amount staked corresponding to the user and token address
3. `constructor` : Create the constructor with the address of the Vault contract and store it in the state variable `vault`.

#### Modifier onlyVault()

```solidity
modifier onlyVault() {
        require(msg.sender == vault, "Only Vault");
        _;
    }
```

We shall add this modifier to our main functions `stake` and `unstake` because we want only the Vault contract and no other account or contract to interact with Stake.

#### Function to Stake

```solidity
function stake(
        address user,
        address token,
        uint256 amount
    ) external override onlyVault {
        uint256 balanceBefore = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        uint256 balanceAfter = IERC20(token).balanceOf(address(this));
        uint256 _amount = balanceAfter.sub(balanceBefore, "No amount received");
        stakedBalance[user][token] += _amount;
    }
```

This function:

1. Checks the balance of token before transferring tokens to itself from Vault.
2. Transfers the tokens to itself.
3. Checks the balance of token after transferring them.
4. Calculates the amount actually staked
5. Updates the staked balance for the user.

#### Function to Unstake

```solidity
function unstake(
        address user,
        address token,
        uint256 amount
    ) external override onlyVault {
        stakedBalance[user][token] = stakedBalance[user][token].sub(
            amount,
            "User balance too low"
        );
        IERC20(token).safeTransfer(user, amount);
    }
```

This function checks the staked balance of the user, subtracts the amount he wants to unstake from it and transfers the amount of tokens back to user.

This is how we created a simple Cross-chain Staking Dapp using Router's Voyager.

</details>

<details>
<summary><b> END-TO-END VAULT CONTRACT</b></summary>

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IStake.sol";

contract Vault is AccessControl {
    using SafeERC20 for IERC20;
    IStake public stakingContract;

    address public voyagerDepositHandler;
    address public voyagerExecuteHandler;

    mapping(bytes32 => address) public ourContractsOnChain;

    // depositReserveTokenAndExecute(bool,bool,bytes,bytes,bytes)
    bytes4 public constant DEPOSIT_RESERVE_AND_EXECUTE_SELECTOR = 0xf64d944a;
    // depositNonReserveTokenAndExecute(bool,bool,bytes,bytes,bytes)
    bytes4 public constant DEPOSIT_NON_RESERVE_AND_EXECUTE_SELECTOR = 0x79334b17;
    // depositLPTokenAndExecute(bool,bytes,bytes,bytes)
    bytes4 public constant DEPOSIT_LP_AND_EXECUTE_SELECTOR = 0xe18cfa35;

    bytes4 public constant STAKE_FUNCTION_SELECTOR =
        bytes4(keccak256("receiveStakeCrossChain(address,address,uint256)"));

    constructor(address _voyagerDepositHandler, address _voyagerExecuteHandler)
    {
        voyagerDepositHandler = _voyagerDepositHandler;
        voyagerExecuteHandler = _voyagerExecuteHandler;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setStakingContract(address _stakingContract)
        external
        onlyRole(DEFAULT_ADMIN_ROLE)
    {
        stakingContract = IStake(_stakingContract);
    }

    function setContractsOnChain(bytes32 chainIdBytes, address contractAddr) external onlyRole(DEFAULT_ADMIN_ROLE) {
        ourContractsOnChain[chainIdBytes] = contractAddr;
    }

    function stake(uint256 _amount, address _token) external {
        IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
        stakingContract.stake(msg.sender, _token, _amount);
    }

    function unstake(uint256 _amount, address _token) external {
        stakingContract.unstake(msg.sender, _token, _amount);
    }

    function stakeCrossChain(
        bytes4 selector,
        bool isSourceNative,
        bool isAppTokenPayer,
        address recipient,
        address refundAddress,
        uint256 gasLimit,
        uint256 gasPrice,
        bytes memory swapData,
        bytes memory executeData
    ) public payable {
        bytes32 destChainIdBytes = abi.decode(swapData, (bytes32));
        bytes memory data = abi.encode(recipient);

        bytes memory arbitraryData = abi.encode(
            toBytes(ourContractsOnChain[destChainIdBytes]),
            STAKE_FUNCTION_SELECTOR,
            data,
            toBytes(refundAddress),
            gasLimit,
            gasPrice
        );

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

        require(success, "unsuccessful");
    }

    function voyagerReceive(
        address sourceSenderAddress,
        bytes32 srcChainIdBytes,
        bytes4 selector,
        bytes memory data,
        address settlementToken,
        uint256 settlementAmount
    ) external {
        // Checking if the sender is the voyager execute handler contract
        require(
            msg.sender == voyagerExecuteHandler,
            "only voyager execute handler"
        );
        // Checking if the request initiated by our contract only from the source chain
        require(sourceSenderAddress == ourContractsOnChain[srcChainIdBytes], "not our contract");

        // Checking the selector that was passed from the source chain
        if (selector == STAKE_FUNCTION_SELECTOR) {
            // decoding the data we sent from the source chain
            address user = abi.decode(data, (address));
            // calling the stake function
            receiveStakeCrossChain(user, settlementToken, settlementAmount);
        }
    }

    function receiveStakeCrossChain(
        address _user,
        address _token,
        uint256 _amount
    ) internal {
        stakingContract.stake(_user, _token, _amount);
    }

    function approve(address token, address spender, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(token).approve(spender, amount);
    }

    function toBytes(address addr) internal pure returns (bytes memory b) {
        assembly {
            let m := mload(0x40)
            addr := and(addr, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)
            mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, addr))
            mstore(0x40, add(m, 52))
            b := m
        }
    }
}

```

</details>

<details>
<summary><b>END-TO-END STAKE CONTRACT</b></summary>

```solidity
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IStake.sol";

contract Stake is IStake {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;
    address public immutable vault;

    // user address => token address => staked amount
    mapping(address => mapping(address => uint256)) public stakedBalance;

    constructor(address _vault) {
        vault = _vault;
    }

    modifier onlyVault() {
        require(msg.sender == vault, "Only Vault");
        _;
    }

    function stake(
        address user,
        address token,
        uint256 amount
    ) external override onlyVault {
        uint256 balanceBefore = IERC20(token).balanceOf(address(this));
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        uint256 balanceAfter = IERC20(token).balanceOf(address(this));
        uint256 _amount = balanceAfter.sub(balanceBefore, "No amount received");
        stakedBalance[user][token] += _amount;
    }

    function unstake(
        address user,
        address token,
        uint256 amount
    ) external override onlyVault {
        stakedBalance[user][token] = stakedBalance[user][token].sub(
            amount,
            "User balance too low"
        );
        IERC20(token).safeTransfer(user, amount);
    }
}
```

</details>

<details>
<summary><b>DEPLOYED CONTRACTS FOR REFERENCE</b></summary>

**Polygon Mumbai Testnet:**
**Vault**: [https://mumbai.polygonscan.com/address/0x92c618b8e726d4645e2614959acd15eec3363076](https://mumbai.polygonscan.com/address/0x92c618b8e726d4645e2614959acd15eec3363076)

**Stake**: [https://mumbai.polygonscan.com/address/0xd5b007b13ed9ad0dc6cd41714ea71408c66ed28d](https://mumbai.polygonscan.com/address/0xd5b007b13ed9ad0dc6cd41714ea71408c66ed28d)

**Avalanche Fuji Testnet:**
**Vault**: [https://testnet.snowtrace.io/address/0xB3793af97Ef6BDF7b794F1Ed22B7A8bd056706C7](https://testnet.snowtrace.io/address/0xB3793af97Ef6BDF7b794F1Ed22B7A8bd056706C7)

**Stake**: [https://testnet.snowtrace.io/address/0x1c13a59ddaDb2deaBAf488e0bBFc9254DCe59F9b](https://testnet.snowtrace.io/address/0x1c13a59ddaDb2deaBAf488e0bBFc9254DCe59F9b)

</details>
