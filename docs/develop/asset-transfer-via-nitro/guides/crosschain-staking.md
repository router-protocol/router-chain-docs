---
title: Cross-chain Staking dApp
sidebar_position: 1
---

In this section, we shall create a simple cross-chain staking dapp using the Nitro sequencer. We shall follow the instructions provided in the previous section to create the same. It consists of two smart contracts: **Vault** and **Stake**. The github repository for the same can be found [here](https://github.com/router-protocol/sequencer-staking/tree/master).

**Vault** contract enables the user to first transfer his funds (say USDT) from chain A to chain B and then stake them on chain B.
**Stake** contract manages the balance of the staked tokens on the destination side. In other words, Stake contract is the state manager of the Vault contract.

<details>
<summary><b>Vault Contract</b></summary>

#### Installing the dependencies

Install the openzeppelin contracts by running the following command:

`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

#### Defining the IStake interface

Create an `IStake.sol` file with the following code:

```javascript
pragma solidity ^0.8.18;

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

#### Defining the IAssetForwarder interface

Create an `IAssetForwarder.sol` file with the following code:

```javascript
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

interface IAssetForwarder {
    struct DepositData {
        uint256 partnerId;
        uint256 amount;
        uint256 destAmount;
        address srcToken;
        address refundRecipient;
        bytes32 destChainIdBytes;
    }

    function iDepositMessage(
        DepositData memory depositData,
        bytes memory destToken,
        bytes memory recipient,
        bytes memory message
    ) external payable;
}

interface IMessageHandler {
    function handleMessage(
        address tokenSent,
        uint256 amount,
        bytes memory message
    ) external;
}
```

This is the standard interface for Router Nitro's asset transfer contract.

#### Instantiating the contract

```javascript
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IAssetForwarder, IMessageHandler} from "./IAssetForwarder.sol";
import {IStake} from "./IStake.sol";

contract Vault is AccessControl, IMessageHandler {
}
```

Importing the necessary interfaces and libraries in the contract.

For your information:

1. `SafeERC20.sol` is the contract we shall use to access various functions of ERC20 tokens.
2. `AccessControl.sol` is the contract we shall use for putting admin controls over certain functions.
3. `IAssetForwarder.sol` is the interface of the Nitro's AssetForwarder contract which will be used to call the bridge to transfer funds with message across chains.
4. `IMessageHandler.sol` is the interface which defines a function to receive funds with message from the Nitro's AssetForwarder on the destination chain.
5. `IStake.sol` is the interface of Stake contract which we need here for defining an instance of staking contract into our Vault contract.

#### Creating state variables and the constructor

```javascript
    using SafeERC20 for IERC20;

    struct ChainData {
        bytes vault;
        bytes usdt;
    }

    IStake public stakingContract;
    address public nitroAssetForwarder;
    address public immutable usdt;

    mapping(string => ChainData) public chainData;

    constructor(address _nitroAssetForwarder, address _usdt) {
        nitroAssetForwarder = _nitroAssetForwarder;
        usdt = _usdt;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

```

1. `stakingContract`: This is the instance of our Stake contract.
2. `nitroAssetForwarder`: This is the address of the Nitro's Asset Forwarder contract.
3. `usdt` : This is the address of asset that will be used for staking. For simplicity we have used USDT but any other token can also be used.
4. `chainData` : A mapping of chain IDs with the respective Vault contract and USDT addresses. This will be used to fetch Vault contract and the USDT address for the destination chain when one calls the cross-chain staking function.
5. `constructor`: Create the constructor with the addresses of the Nitro's Asset Forwarder contract and USDT token and set that into our state variable. Also assign the `DEFAULT_ADMIN_ROLE` to the deployer.

#### Function to set the Staking contract

```javascript
    function setStakingContract(address _stakingContract) external onlyRole(DEFAULT_ADMIN_ROLE) {
        stakingContract = IStake(_stakingContract);
    }
```

The Vault contract on every chain must know the address of its corresponding Stake contract on that chain to interact with it. To store the address of the Stake contract, the vault contract's `setStakingContract` function.

#### Function to set the Chain Data

```javascript
    function setChainData(
        string memory _chainId,
        bytes memory _vaultContract,
        bytes memory _usdt
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        chainData[_chainId] = ChainData(_vaultContract, _usdt);
    }
```

To stake funds cross-chain, the Vault contract have knowledge of the recipient Vault contract address on the destination chain. Also the destination token address should be known to it. These parameters can be stored in the chainData mapping.
This mapping can be set by the admin using the `setChainData` function.

#### Function that enables cross-chain sequenced transfers

```javascript
    function iStake(
        uint256 amount,
        uint256 destAmount,
        string memory destChainId
    ) public payable {
        IERC20(usdt).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(usdt).safeIncreaseAllowance(nitroAssetForwarder, amount);

        ChainData memory destChainData = chainData[destChainId];

        IAssetForwarder.DepositData memory depositData = IAssetForwarder
            .DepositData({
                partnerId: 1,
                amount: amount,
                destAmount: destAmount,
                srcToken: usdt,
                refundRecipient: msg.sender,
                destChainIdBytes: getChainIdBytes(destChainId)
            });

        IAssetForwarder(nitroAssetForwarder).iDepositMessage(
            depositData,
            destChainData.usdt,
            destChainData.vault,
            abi.encode(msg.sender)
        );
    }
```

It is the `iStake` function that:

1. Encodes the data that needs to be sent to the destination chain whenever a cross-chain request is received. Here only the recipient or user address is needed to update the staked balance against the user's address on the destination chain.
2. Calls the selector for the `iDepositMessage` function in Nitro's Asset Forwarder as per the data passed in the parameters along with other parameters.

Let us understand the parameters of `iStake` function one by one:

| destChainIdBytes | Network IDs of the chains in bytes32 format. These can be found [here](../supported-chains-tokens).                                                                                                                                                                                                                                                                                                                                                |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| amount           | Decimal-adjusted amount of the token that has to be transferred from the source chain.                                                                                                                                                                                                                                                                                                                                                                |
| destAmount       | Amount of tokens (in source chain decimals) expected to be received by the recipient on the destination chain. This can be calculated using the Nitro's PathFinder API. A small script has been added in the scripts folder of the [github repository](https://github.com/router-protocol/sequencer-staking/tree/main/scripts) to calculate the destination amount. Refer to the [**Fee Management**](../fee-management.md) section for more details. |
| destChainId      | ChainId of the destination chain.                                                                                                                                                                                                                                                                                                                                                                                                                     |

#### Function that receives the cross-chain call and executes the Stake function on the destination chain

```javascript
    function handleMessage(
        address tokenSent,
        uint256 amount,
        bytes memory message
    ) external {
        // Checking if the sender is the voyager execute handler contract
        require(
            msg.sender == nitroAssetForwarder,
            "only nitro asset forwarder"
        );

        IERC20(tokenSent).safeIncreaseAllowance(
            address(stakingContract),
            amount
        );

        // decoding the data we sent from the source chain
        address user = abi.decode(message, (address));

        // calling the stake function
        stakingContract.stake(user, tokenSent, amount);
    }
```

It is the `handleMessage` function that:

1. Checks that the caller of the function is Nitro's Asset Forwarder contract only.
2. Increases the allowance for the Stake contract so that the Vault can transfer funds to the Stake contract.
3. Decodes the data that was encoded on the source chain (recipient address) at the time of initiating the cross-chain transfer.
4. Calls the Stake contract and updates the user’s staked balance.

</details>

<details>
<summary><b>Stake Contract</b></summary>

#### Installing the dependencies

Install the openzeppelin contracts by running the following command:

`yarn add @openzeppelin/contracts` or `npm install @openzeppelin/contracts`

#### Instantiating the contract

```javascript
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "./IStake.sol";

contract Stake is IStake {

}
```

Importing the necessary interfaces and libraries in the contract.

#### Creating state variables and the constructor

```javascript
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    address public immutable vault;

    // user address => token address => staked amount
    mapping(address => mapping(address => uint256)) public stakedBalance;

    constructor(address _vault) {
        vault = _vault;
    }
```

1. `vault`: Address of your Vault contract.
2. `stakedBalance` : Mapping that stores the amount of tokens staked by a particular user.
3. `constructor` : Create the constructor with the address of the Vault contract and store it in the variable `vault`.

#### Adding modifier onlyVault()

```javascript
    modifier onlyVault() {
        require(msg.sender == vault, "Only Vault");
        _;
    }
```

This modifier will ensure that the `stake` and `unstake` functions can only be called by the Vault contract.

#### Adding functions to Stake and Unstake

```javascript
    function stake(
        address user,
        address token,
        uint256 amount
    ) external override onlyVault {
        require(amount != 0, "amount cannot be 0");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        stakedBalance[user][token] += amount;
    }
```

This function:

1. Checks that amount cannot be 0.
2. Transfers the tokens to itself.
3. Updates the staked balance for the user.

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

This function checks the staked balance of the user, subtracts the amount that the user wants to unstake and transfers that amount back to the user.

</details>

<details>
<summary><b> End-to-end Vault Contract</b></summary>

```javascript
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

import {SafeERC20, IERC20} from "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";
import {IAssetForwarder, IMessageHandler} from "./IAssetForwarder.sol";
import {IStake} from "./IStake.sol";

contract Vault is AccessControl, IMessageHandler {
    using SafeERC20 for IERC20;

    struct ChainData {
        bytes vault;
        bytes usdt;
    }

    IStake public stakingContract;
    address public nitroAssetForwarder;
    address public immutable usdt;

    mapping(string => ChainData) public chainData;

    constructor(address _nitroAssetForwarder, address _usdt) {
        nitroAssetForwarder = _nitroAssetForwarder;
        usdt = _usdt;
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function setStakingContract(
        address _stakingContract
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        stakingContract = IStake(_stakingContract);
    }

    function setChainData(
        string memory _chainId,
        bytes memory _vaultContract,
        bytes memory _usdt
    ) external onlyRole(DEFAULT_ADMIN_ROLE) {
        chainData[_chainId] = ChainData(_vaultContract, _usdt);
    }

    function stake(uint256 _amount) external {
        IERC20(usdt).safeTransferFrom(msg.sender, address(this), _amount);
        stakingContract.stake(msg.sender, usdt, _amount);
    }

    function unstake(uint256 _amount) external {
        stakingContract.unstake(msg.sender, usdt, _amount);
    }

    function iStake(
        uint256 amount,
        uint256 destAmount,
        string memory destChainId
    ) public payable {
        IERC20(usdt).safeTransferFrom(msg.sender, address(this), amount);
        IERC20(usdt).safeIncreaseAllowance(nitroAssetForwarder, amount);

        ChainData memory destChainData = chainData[destChainId];

        IAssetForwarder.DepositData memory depositData = IAssetForwarder
            .DepositData({
                partnerId: 1,
                amount: amount,
                destAmount: destAmount,
                srcToken: usdt,
                refundRecipient: msg.sender,
                destChainIdBytes: getChainIdBytes(destChainId)
            });

        IAssetForwarder(nitroAssetForwarder).iDepositMessage(
            depositData,
            destChainData.usdt,
            destChainData.vault,
            abi.encode(msg.sender)
        );
    }

    function handleMessage(
        address tokenSent,
        uint256 amount,
        bytes memory message
    ) external {
        // Checking if the sender is the voyager execute handler contract
        require(
            msg.sender == nitroAssetForwarder,
            "only nitro asset forwarder"
        );

        IERC20(tokenSent).safeIncreaseAllowance(
            address(stakingContract),
            amount
        );

        // decoding the data we sent from the source chain
        address user = abi.decode(message, (address));

        // calling the stake function
        stakingContract.stake(user, tokenSent, amount);
    }

    function getChainIdBytes(
        string memory _chainId
    ) public pure returns (bytes32) {
        bytes32 chainIdBytes32;

        // solhint-disable-next-line no-inline-assembly
        assembly {
            chainIdBytes32 := mload(add(_chainId, 32))
        }

        return chainIdBytes32;
    }
}
```

</details>

<details>
<summary><b>End-to-end Stake Contract</b></summary>

```javascript
//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.18;

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
        require(amount != 0, "amount cannot be 0");
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        stakedBalance[user][token] += amount;
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

[0x068b55dfA3BCe91F7f0e06141f45004162ff022E](https://mumbai.polygonscan.com/address/0x068b55dfA3BCe91F7f0e06141f45004162ff022E)

<u>Stake</u>

[0x8df3B21428A22062a71fC89aDA42462088dDFa4E](https://mumbai.polygonscan.com/address/0x8df3B21428A22062a71fC89aDA42462088dDFa4E)

**Avalanche Fuji Testnet**

<u>Vault</u>

[0x43595baC35AC74fdc65Ef8225e7DE08Fe6883979](https://testnet.snowtrace.io/address/0x43595baC35AC74fdc65Ef8225e7DE08Fe6883979)

<u>Stake</u>

[0x37dab2d677ba8B67408CD020D696BD5b16dB6ad4](https://testnet.snowtrace.io/address/0x37dab2d677ba8B67408CD020D696BD5b16dB6ad4)

**Sample Cross Chain Transaction**

[Transaction](https://nitro-explorer.routerprotocol.com/tx/0x89b76319de7a4d77428f93f7f96e08a1f5a2bf03ab5fc1cb8f039ccd4ff4fb6a)

</details>

<details>
<summary><b>Fee Calculation</b></summary>

The fee for using Nitro sequencer has two components:

- **Transfer/Forwarder Fee**: The fee for transferring tokens from one chain to another. Users can use this [API](https://api.trustless-voyager.alpha.routerprotocol.com/api#/Fees/FeeController_getFeesForChainInTokenTerms) to estimate the fee by putting in the destination chain ID, address of the token on the destination chain, token amount, and token decimals. There is another boolean value `checkLiquidity`:

  - If marked as TRUE, the API gives the list of all the forwarders which have enough liquidity (along with the fee they would charge in terms of the token desired) against the amount requested by the user for the token.
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

The fees could also be calculated directly using the Nitro's PathFinder API the script to which can be found in the [Github repository](https://github.com/router-protocol/sequencer-staking/tree/main/scripts) in the scripts folder.

<!-- Let's suppose the user is transferring 100 USDC from the source chain to the destination chain, the user should put the `destAmount` as the following:

```math
destAmount = 100 - forwarder fee - total_gas_fee
``` -->

</details>

<details>
<summary><b>Sequencer Apis</b></summary>

You can use sequencer api to trigger a cross-chain transaction with some custom instruction.

Sample code is provided here -

```ts
import { ethers } from 'ethers';

const PATH_FINDER_API_URL = 'https://api.pf.testnet.routerprotocol.com/api';

const getQuote = async () => {
  const params = {
    fromTokenAddress: '0x22bAA8b6cdd31a0C5D1035d6e72043f4Ce6aF054', // USDT on src chain
    toTokenAddress: '0xb452b513552aa0B57c4b1C9372eFEa78024e5936', // USDT on dest chain
    amount: '10000000000000', // source amount
    fromTokenChainId: '80001', // Mumbai
    toTokenChainId: '43113', // Fuji
    slippageTolerance: 1, // optional
    additionalGasLimit: '100000', // Additional gas limit to execute instruction on dest chain
    partnerId: 0, // (Optional) - For any partnership, get your unique partner id - https://app.routernitro.com/partnerId
  };

  const endpoint = 'v2/sequencer-quote';
  const quoteUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

  try {
    const { data } = await axios.get(quoteUrl, { params });
    return data;
  } catch (e) {
    console.error(`Fetching quote data from pathfinder: ${e}`);
  }
};

/**
 * senderAddress: The address of the sender of the transaction.
 * receiverAddress: The receiver here should be the contract address that should receive the funds 
   along with the instructions.
 * contractMessage: Message to be passed to the destination chain contract.
 * refundAddress: The address which will receive funds in case no forwarder picks up the transaction
   and the user needs to withdraw the funds after some interval of time. Do fill this address very
   carefully otherwise you may lose your funds.
 */
const getTransaction = async (quoteData) => {
  const endpoint = 'v2/sequencer-transaction';
  const txDataUrl = `${PATH_FINDER_API_URL}/${endpoint}`;

  try {
    const res = await axios.post(txDataUrl, {
      ...quoteData,
      senderAddress: '<sender-address>',
      receiverAddress: '<receiver-address>',
      contractMessage: '<contract-message or instruction>',
      refundAddress: '<refund-address>',
    });
    return res.data;
  } catch (e) {
    console.error(`Fetching tx data from pathfinder: ${e}`);
  }
};

const main = async () => {
  // setting up a signer
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ankr.com/polygon_mumbai',
    80001
  );
  // use provider.getSigner() method to get a signer if you're using this for a UI
  const wallet = new ethers.Wallet('YOUR_PRIVATE_KEY', provider);

  // 1. get quote
  const quoteData = getQuote();

  // 2. give allowance if required
  const allowanceTo = quoteData.allowanceTo;

  // 3. get transaction data
  const txResponse = await getTransaction(quoteData);

  // sending the transaction using the data given by the pathfinder
  const tx = await wallet.sendTransaction(txResponse.txn);
  try {
    await tx.wait();
    console.log(`Transaction mined successfully: ${tx.hash}`);
  } catch (error) {
    console.log(`Transaction failed with error: ${error}`);
  }
};

main();
```

</details>
