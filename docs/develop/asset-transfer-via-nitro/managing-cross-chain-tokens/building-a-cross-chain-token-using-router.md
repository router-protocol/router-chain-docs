---
title: 1) Building a Cross-chain Token using Router
sidebar_position: 1
---

In this guide, we'll walk you through the process of building and deploying cross-chain tokens using Router Protocol. For this you have to first deploy a basic ERC20 token with access control roles, such as the minter role, enabled. You can take this contract as reference:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract ERC20Token is ERC20, ERC20Burnable, AccessControl, ERC20Permit {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    uint8 private decimal;

    constructor(
        string memory name,
        string memory symbol,
        uint8 _decimal,
        address minter
    ) ERC20(name, symbol) ERC20Permit(name) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, minter);
        decimal = _decimal;
    }

    function decimals() public view virtual override returns (uint8) {
        return decimal;
    }

    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }
}

```

Once you have deployed the token on Chain A and you want to integrate this token with other chains where you have liquidity, follow these steps:

1. Grant the Minter role to the Router AssetBridge contract on the chain where the original token in deployed. You can find the AssetBridge contract addresses [here](../assetbridge-contract-addresses).
2. Mint the required supply of the deployed token.
3. For each chain on which you want to integrate the token, create wrapped tokens or mirror tokens.
4. Whitelist the token on the source chain AssetBridge contract.
5. Reach out to the Router team [here](https://t.me/Alpie01). The Router team will handle the AssetBridge contract configuration on the Router chain. Additionally, the Router team will set up the pathfinder Nitro API configurations and update the user interface (UI) as well as the Router Explorer to incorporate the new token.