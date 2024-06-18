---
title: Transfer of USDC with Instructions via CCTP
sidebar_position: 1
---

Unlike the current crop of bridges, Nitro allows for the transfer of arbitrary instructions with the the transfer of USDC via Circle. In this approach, USDC is burnt on the source chain and minted on the destination chain, and an instruction is passed specifying what to do with the minted USDC.

# Transfer USDC with Message via CCTP

```javascript
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
) public view returns (
    uint256 totalFee,
    uint256 forwarderFee,
    uint256 iSendFee,
    uint256 iReceiveFee
);

/// @notice Function to deposit and burn USDC with message.
/// @param partnerId Partner ID received from Router for better tracking of transactions.
/// @param destChainId Chain ID for the destination chain.
/// @param recipient Address of the recipient application contract on the destination chain.
/// @param amount Amount of USDC being transferred.
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
```

## Process Flow

1. **User Interaction:**

   - Application smart contract initiates a USDC deposit with instruction by calling `depositUsdcMessage` on the `NitroCCTPMessage` contract specifying the amount of USDC and the instruction.

2. **USDC Burn:**

   - The USDC is burnt via CCTP, and a nonce is generated.

3. **Message Transmission:**

   - The message containing the nonce is sent to the destination chain through Router Crosstalk.

4. **Minting on Destination Chain:**

   - A forwarder mints USDC on the destination chain into the `NitroCCTPMessage` contract using `mintUsdc`.

5. **Message Execution:**
   - The Router Gateway contract calls `iReceive` to forward funds to the application contract and call the `handleMessage` function implemented in the application contract on destination chain.

## Important Notes

- **Nonce Generation:**
  - The nonce is crucial for tracking and ensuring the correct amount of USDC is minted on the destination chain.
- **Trustless Minting:**

  - The minting process on the destination chain is trustless, ensuring security and transparency.

- **Integration with Application Contract:**
  - The `handleMessage` function in the application contract is essential for the final execution of the process. If the function is not present in the application contract, the funds will be sent to this contract and the process will exit.

## Fee Structure

1. **iSend Fee**

   - **Description:** A very small fee to prevent sybil attack on Router chain via the source Gateway contract.
   - **Purpose:** To prevent sybil attack on Router chain.
   - **Calculation:** This is a very low amount just to deter fake request creators.
   - **Denomination:** It is paid in native token of the source chain.

2. **Forwarder Fee**

   - **Description:** A fee paid to the forwarder who mints USDC on the destination chain.
   - **Purpose:** Compensates the forwarder for the service of minting USDC, ensuring the transfer is completed on the destination chain.
   - **Calculation:** The amount of this fee depends on the gas used to execute `mintUsdc` function on the destination chain.
   - **Denomination:** It is paid in native token of the source chain.

3. **iReceive Fee**
   - **Description:** A fee for executing the `iReceive` function on the destination chain.
   - **Purpose:** Covers the cost of invoking the `iReceive` function, which is responsible for forwarding the funds to the application contract and executing the associated instructions.
   - **Calculation:** This fee is usually calculated based on the destination gas limit passed in the `depositUsdcMessage` execution on the source chain and the gas price on the destination chain.
   - **Denomination:** It is paid in native token of the source chain.

:::info
Check out this [guide](../guides/usdc-instruction.md) to learn how to create an end-to-end cross-chain app using Nitro CCTP Message.
:::
