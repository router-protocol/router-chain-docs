---
title: Cross-chain Staking dApp
sidebar_position: 1
---

In this section, we shall create a simple cross-chain staking dapp using the Voyager sequencer. We shall follow the instructions provided in the previous section to create the same. It consists of two smart contracts: **Vault** and **Stake**.

**Vault** contract enables the user to first transfer his funds from chain A to chain B and then stake them on chain B.
**Stake** contract manages the balance of the staked tokens on the destination side. In other words, Stake contract is the state manager of the Vault contract.


<details>
<summary><b>Vault Contract</b></summary>

#### Installing the dependencies

Install the openzeppelin contracts by running the following command:

`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

#### Defining the IStake interface
In a separate folder titled `interfaces`, create an `IStake.sol` file with the following code:
```javascript
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

#### Instantiating the contract

```javascript
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./interfaces/IStake.sol";

contract Vault is AccessControl {
}
```

Import the `SafeERC20.sol`and `AccessControl.sol` from `@openzeppelin/contracts`and `IStake.sol` into your Vault contract.

For your information:

1. `IStake.sol` is the interface of Stake contract which we need here for defining an instance of staking contract into our Vault contract.
2. `SafeERC20.sol` is the contract we shall use to access various functions of ERC20 tokens.
3. `AccessControl.sol` is the contract we shall use for putting admin controls over certain functions.

#### Creating state variables and the constructor

```javascript
using SafeERC20 for IERC20;
IStake public stakingContract;

address public routerAssetBridgeContract;

mapping(bytes32 => bytes) public ourContractsOnChain;

// iDepositMessage(uint256,bytes32,bytes,address,uint256,uint256,bytes)
bytes4 public constant I_DEPOSIT_MESSAGE_SELECTOR = bytes4(keccak256("iDepositMessage(uint256,bytes32,bytes,address,uint256,uint256,bytes)"));


constructor(address _routerAssetBridgeContract)
{
routerAssetBridgeContract =_routerAssetBridgeContract;
_setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
}

```

1. `stakingContract`: This is the instance of our Stake contract which will manage the state and balance of funds in both kinds of staking: same chain staking as well as cross-chain staking.
2. `routerAssetBridgeContract`: This is the variable created for storing the address of the Voyager contract. We will be calling the Voyager contract to initiate the cross-chain sequenced transfer on the source side. We will also validate if the transaction triggered on the destination side has been made by the Voyager contract only.
3. `ourContractsOnChain` : This is the mapping that stores the address of the Vault contract corresponding to the destination chain ID which can be found [here](https://github.com/router-protocol/router-chain-docs/blob/main/docs/develop/voyager/tools/configurations/chain-id-identifiers.md). It makes sure that while calling the `iStake` function (explained later), we are putting the correct recipient vault address as per our desired destination chain.
4. `I_DEPOSIT_MESSAGE_SELECTOR` : This is the selector of `iDepositMessage` in Voyager.
5. `constructor`: Create the constructor with the address of the Voyager contract and set that into our state variable. Also give the `DEFAULT_ADMIN_ROLE` to the deployer.


#### Function to set the Staking contract
```javascript
function setStakingContract(address _stakingContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
stakingContract = IStake(_stakingContract);
}
```

Our Vault contract on every chain must know the address of its corresponding Stake contract on the same chain to interact with it whenever a cross-chain request is received by the Vault. To store the address of the Stake contract, we can use the vault contract's `setStakingContract` function.

#### Function to set the Staking contract

```javascript
function setStakingContract(address _stakingContract) external onlyRole(DEFAULT_ADMIN_ROLE)
{
    stakingContract = IStake(_stakingContract);
}
```


Our Vault contract on every chain must know the address of its corresponding Stake contract on same chain to interact with it whenever a cross-chain call is received by Vault. Hence we create a function `setStakingContract` to store the address of Stake Contract on the same chain.

#### Function to store the addresses of Vault contracts deployed on other chains

```javascript
function setContractsOnChain(bytes32 chainIdBytes, address contractAddr) external onlyRole(DEFAULT_ADMIN_ROLE) {
    ourContractsOnChain[chainIdBytes] = toBytes(contractAddr);
}
```

Our Vault contract on every chain must know the addresses of its counterparts on every other chain to enable cross-chain transfers or cross-chain sequenced transfers. Hence we create a function `setContractsOnChain` that updates the mapping `ourContractsOnChain` about which we talked about earlier.

#### Function to approve Stake contract to safely transfer funds from Vault

```javascript
function approve(address token, address spender, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
        IERC20(token).approve(spender, amount);
    }
```

Our Vault contract on every chain must know the addresses of its counterparts on other chain sto enable cross-chain transfers or cross-chain sequenced transfers. Therefore, we create a function `setContractsOnChain` that updates the mapping `ourContractsOnChain`.

Below is the helper function to convert the `address` into `bytes`:

```javascript
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

This is just a supporting function. We shall use it as a converter whenever an address has to be passed as a parameter in the form of bytes.

#### Function to approve Stake contract and Voyager contract to safely transfer funds from Vault
```javascript
function approve(address token, address spender, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
IERC20(token).approve(spender, amount);
}
```

- Vault contract on every chain must approve the Voyager Contract on same chain so that Voyager is able to transfer funds from the Vault to itself, in order to start the cross-chain transfer process.
- On the destination side, funds are received by the Vault contract whenever a cross-chain transfer is executed and they are directed to Stake contract after which the staked balance against the user is updated. The Vault contract on every chain must approve the Stake contract on the same chain so that the Stake Contract is able to transfer a certain amount of tokens to itself from the Vault.


#### Function that enables cross-chain sequenced transfers

```javascript
function iStake(
bytes32 destChainIdBytes,
address srcToken,
uint256 amount,
uint256 destAmount,
address userAddress
) public payable {
    bytes memory recipientVaultContract = ourContractsOnChain[destChainIdBytes];
    bytes memory message = abi.encode(userAddress);
    bool success;


    (success, ) = routerAssetBridgeContract.call{ value: msg.value }(
    abi.encodeWithSelector(I_DEPOSIT_MESSAGE_SELECTOR,0, destChainIdBytes,recipientVaultContract, srcToken, amount, destAmount, message)
    );


    require(success, "unsuccessful");
}
```
It is the `iStake` function that:
1. Encodes the data that we need on the destination chain whenever a cross-chain request is received. Here we need the recipient or user address to update the staked balance against the user's address on the destination chain.
2. Calls the selector for the `iDepositMessage` function in Voyager as per the data passed in the parameters.



Let us understand the parameters of `iStake` function one by one:

| destChainIdBytes      | Network IDs of the chains in bytes32 format. These can be found [here](https://github.com/router-protocol/router-chain-docs/blob/main/docs/develop/voyager/tools/configurations/chain-id-identifiers.md).                   |
| --------------- | -------------------------------------------------------------------------------------- |  
| srcToken | Address of the token that has to be transferred from the source chain.                                                                   |
| amount | Decimal-adjusted amount of the token that has to be transferred from the source chain.                                                                   |
| destAmount | Minimum amount of tokens expected to be received by the recipient on the destination chain. This can be achieved by subtracting the forwarder fee from the source chain amount. Refer to the **Fee Calculation** section given at the end of this guide for more details on how to calculate forwarder fee. |
| userAddress    | Recipient or user address to update the staked balance on the destination chain. |

#### Function that receives the cross-chain call and executes the Stake function on the destination chain

```javascript
function handleVoyagerMessage(
address tokenSent,
uint256 amount,
bytes memory message
) external {
    // Checking if the sender is the router asset bridge contract
    require(
    msg.sender == routerAssetBridgeContract,
    "only voyager"
    );
    IERC20(tokenSent).safeIncreaseAllowance(address(stakingContract), amount );
    // decoding the data we sent from the source chain
    address user = abi.decode(message, (address));
    // calling the stake function
    stakingContract.stake(user, tokenSent, amount);
}
```

It is the `hanldeVoyagerMessage` function that:

1. Checks that the caller of the function is Voyager only.
2. Increases the allowance for the Stake contract so that the Vault can transfer funds to the Stake contract.
3. Decodes the data that we encoded (recipient address) at the time of initiating the cross-chain transfer.
4. Calls the Stake contract and updates the user’s staked balance.

</details>


<details>
<summary><b>Stake Contract</b></summary>

#### Installing the dependencies

Install the openzeppelin contracts by running the following command:

`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

#### Defining the IStake interface
In a separate folder titled `interfaces`, create an `IStake.sol` file with the following code:
```javascript
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

#### Instantiating the contract

```javascript
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./interfaces/IStake.sol";

contract Stake is IStake {

}
```

Import the `SafeERC20.sol` and `SafeMath.sol` from `@openzeppelin/contracts` and inherit the `IStake.sol` contract into your contract.

For your information:

1. `IStake.sol` is the interface of `Stake` contract which we need here for defining an instance of staking contract.
2. `SafeERC20.sol` is the contract we shall use to access various functions of ERC20 tokens.
3. `SafeMath.sol` is the wrapper contract over Solidity’s arithmetic operations with added overflow checks.

#### Creating state variables and the constructor

```javascript
using SafeERC20 for IERC20;
using SafeMath for uint256;
address public immutable vault;
// user address => token address => staked amount
mapping(address => mapping(address => uint256)) public stakedBalance;
constructor(address _vault) {
vault 
```

1. `vault`: This is the address of your Vault contract on the same chain.
2. `stakedBalance` : This is the mapping that stores the amount staked corresponding to the user and token address.
3. `constructor` : Create the constructor with the address of the Vault contract and store it in the state variable `vault`.

#### Adding modifier onlyVault()
```javascript
modifier onlyVault() {
require(msg.sender == vault, "Only Vault");
_;
}

```

We will add this modifier to our main functions `stake` and `unstake` to ensure that only the Vault contract can interact with the Stake contract. 

#### Adding functions to Stake and Unstake

```javascript
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
1. Checks the balance of tokens before transferring them to itself from the Vault.
2. Transfers the tokens to itself.
3. Checks the balance of the token after transferring them.
4. Calculates the amount actually staked.
5. Updates the staked balance for the user.


```javascript
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
This function checks the staked balance of the user, subtracts the amount that the user wants to unstake from it and transfers that amount of tokens back to the user.


</details>


<details>
<summary><b> End-to-end Vault Contract</b></summary>

```javascript
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "./IStake.sol";
contract Vault is AccessControl {
using SafeERC20 for IERC20;
IStake public stakingContract;
address public routerAssetBridgeContract;
mapping(bytes32 => bytes) public ourContractsOnChain;
// iDepositMessage(uint256,bytes32,bytes,address,uint256,uint256,bytes)

bytes4 public constant I_DEPOSIT_MESSAGE_SELECTOR = bytes4(keccak256("iDepositMessage(uint256,bytes32,bytes,address,uint256,uint256,bytes)"));

constructor(address _routerAssetBridgeContract) {
    routerAssetBridgeContract = _routerAssetBridgeContract;
    _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
}

function setStakingContract(address _stakingContract)
external
onlyRole(DEFAULT_ADMIN_ROLE) {
    stakingContract = IStake(_stakingContract);
}

function setContractsOnChain(
bytes32 chainIdBytes, 
address contractAddr
) external onlyRole(DEFAULT_ADMIN_ROLE) {
    ourContractsOnChain[chainIdBytes] = toBytes(contractAddr);
}

function stake(uint256 _amount, address _token) external {
    IERC20(_token).safeTransferFrom(msg.sender, address(this), _amount);
    stakingContract.stake(msg.sender, _token, _amount);
}

function unstake(uint256 _amount, address _token) external {
    stakingContract.unstake(msg.sender, _token, _amount);
}

function iStake(
bytes32 destChainIdBytes,
address srcToken,
uint256 amount,
uint256 destAmount,
address userAddress
) public payable {
    bytes memory recipientVaultContract = ourContractsOnChain[destChainIdBytes];
    bytes memory message = abi.encode(userAddress);
    bool success;
    (success, ) = routerAssetBridgeContract.call{ value: msg.value }(
    abi.encodeWithSelector(I_DEPOSIT_MESSAGE_SELECTOR,0, destChainIdBytes,recipientVaultContract, srcToken, amount, destAmount, message)
    );
    require(success, "unsuccessful");
}


function handleVoyagerMessage(
address tokenSent,
uint256 amount,
bytes memory message
) external {
    // Checking if the sender is the routerAssetBridgeContract contract
    require(
    msg.sender == routerAssetBridgeContract,
    "only routerAssetBridgeContract"
    );

    IERC20(tokenSent).safeIncreaseAllowance(address(stakingContract), amount );
    // decoding the data we sent from the source chain
    address user = abi.decode(message, (address));
    // calling the stake function
    stakingContract.stake(user, tokenSent, amount);
}

function approve(address token, address spender, uint256 amount) external onlyRole(DEFAULT_ADMIN_ROLE) {
    IERC20(token).approve(spender, amount);
}

function toBytes(address addr) public pure returns (bytes memory b) {
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
<summary><b>End-to-end Stake Contract</b></summary>

```javascript
// SPDX-License-Identifier: UNLICENSED
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
<summary><b>Deployed Contracts for Reference</b></summary>

**Polygon Mumbai Testnet**

<u>Vault</u>

[0x8301831f9dA121A83E2f1b61f23bD4C36EBA2298](https://mumbai.polygonscan.com/address/0x8301831f9dA121A83E2f1b61f23bD4C36EBA2298)

<u>Stake</u>

[0xd1De48fbe9b0248535c7D69b0c3209E48B5378F5](https://mumbai.polygonscan.com/address/0xd1De48fbe9b0248535c7D69b0c3209E48B5378F5)

**Avalanche Fuji Testnet**

<u>Vault</u>

[0xc3b7B28e1b9B43ebe130E3748e8843525C1c8315](https://testnet.snowtrace.io/address/0xc3b7B28e1b9B43ebe130E3748e8843525C1c8315)

<u>Stake</u>

[0x5060eF48Ad8d135fbb37966f5F77C6b5Dca2e62f](https://testnet.snowtrace.io/address/0x5060eF48Ad8d135fbb37966f5F77C6b5Dca2e62f)

</details>

<details>
<summary><b>Fee Calculation</b></summary>

The fee for using Voyager sequencer has two components: 
- **Transfer/Forwarder Fee**: The fee for transferring tokens from one chain to another. Users can use this [API](https://api.trustless-voyager.alpha.routerprotocol.com/api#/Fees/FeeController_getFeesForChainInTokenTerms) to estimate the fee by putting in the destination chain ID, address of the token on the destination chain, token amount, and token decimals. There is another boolean value `checkLiquidity`:
    -  If marked as TRUE, the API gives the list of all the forwarders which have enough liquidity (along with the fee they would charge in terms of the token desired) against the amount requested by the user for the token.
    - If marked as FALSE, the API gives the list of all the forwarders whether or not they have enough liquidity to take up the transaction.

- **Additional Fee**: This is the gas fee for executing the message upon receiving the tokens on the destination chain. For this, two things are needed:
    1. Gas limit required for execution of the request on the destination chain. This can be calculated using tools like hardhat-gas-reporter.
    2. Gas price with which to execute the request on the destination chain. This can be calculated using the RPC of the destination chain.
    ```javascript
    // using ethers.js
    const gasPrice = await provider.getGasPrice();

    // using web3.js
    const gasPrice = web3.eth.getGasPrice().then((result) => {
    console.log(web3.utils.fromWei(result, 'ether'));
    });
    ```

Let’s say the gas limit required to execute the message on Mumbai (destination chain) is 200000 units, the gas price is 26 GWEI, then:

```math
total_gas_fee = {(200000 * 26 * (10^9)) / (10^18)} wMATIC = 0.0052 wMATIC
```

<!-- Let's suppose the user is transferring 100 USDC from the source chain to the destination chain, the user should put the `destAmount` as the following:

```math
destAmount = 100 - forwarder fee - total_gas_fee
``` -->


</details>