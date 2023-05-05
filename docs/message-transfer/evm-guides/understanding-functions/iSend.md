---
title: iSend
sidebar_position: 1
---

# `iSend` Function

```javascript
function iSend(
    uint256 version,
    uint256 routeAmount,
    string calldata routeRecipient,
    string calldata destChainId,
    bytes calldata requestMetadata,
    bytes calldata requestPacket
 ) external payable returns (uint256);
```

This function allows users to configure various aspects of cross-chain message passing based on their specific needs. Some of the parameters that can be set using this function include:

### **1. version:**

The current version of the Gateway contract which can be obtained by calling a specific function within the contract.

```javascript
function currentVersion() external view returns (uint256)
```

This would change whenever the encoding of **requestMetadata** (parameter #5) changes. However the Router Chain will support earlier versions of encoding too for iDapps to always remain compatible.

### **2. routeAmount:**

To transfer Route tokens along with the call, one must specify the amount of tokens to be transferred in this field.

### **3. routeRecipient:**

To transfer Route tokens along with the call, users will need to provide the recipient's address on the destination chain to which the Route tokens will be minted.

### **4. destChainId:**

Chain ID of the destination chain in string format.

### **5. requestMetadata:**

To avoid encoding on-chain, the Router chain allows iDapps to send static information for a request as a parameter to their iDapp, depending on the destination chain ID provided by the user. This information is packaged into a byte-encoded string, known as the `request metadata` which includes the following parameters:

```javascript
uint64 destGasLimit;
uint64 destGasPrice;
uint64 ackGasLimit;
uint64 ackGasPrice;
uint128 relayerFees;
uint8 ackType;
bool isReadCall;
string asmAddress;
```

It can be achieved by adding following function in your contract:

```javascript
function getRequestMetadata(
    uint64 destGasLimit,
    uint64 destGasPrice,
    uint64 ackGasLimit,
    uint64 ackGasPrice,
    uint128 relayerFees,
    uint8 ackType,
    bool isReadCall,
    bytes memory asmAddress
    ) public pure returns (bytes memory) {
    bytes memory requestMetadata = abi.encodePacked(
        destGasLimit,
        destGasPrice,
        ackGasLimit,
        ackGasPrice,
        relayerFees,
        ackType,
        isReadCall,
        asmAddress
    );
    return requestMetadata;
    }
```

1. **destGasLimit:** Gas limit required for execution of the request on the destination chain. This can be calculated using tools like [hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter).
2. **destGasPrice:** Gas price of the destination chain. This can be calculated using the RPC of destination chain.

   ```jsx
   // using ethers.js
   const gasPrice = await provider.getGasPrice();

   // using web3.js
   const gasPrice = web3.eth.getGasPrice().then((result) => {
     console.log(web3.utils.fromWei(result, 'ether'));
   });
   ```

   If you don’t want to calculate it, just send `0` in its place and Router Chain will handle the real time gas price for you.

3. **ackGasLimit:** Gas limit required for execution of the acknowledgement coming from the destination chain back on the source chain. This can be calculated using tools like [hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter).
4. **ackGasPrice:** Gas price of the destination chain. This can be calculated using the RPC of source chain as shown in the above [snippet](https://www.notion.so/EVM-to-Other-Chain-Flow-de922b13e0fa4d7b8c3c24590ff8ef65).
5. **relayerFees:** This parameter functions similarly to priority fees on other blockchain networks. Since Router chain relayers handle the execution of cross-chain requests on the destination chain, setting a higher gas price will increase the likelihood of your request being prioritized by relayers. Conversely, if a very low gas price is specified, the Router chain will automatically adjust it to a minimum amount.
6. **ackType:** When the contract calls have been executed on the destination chain, the iDapp has the option to get an acknowledgement back to the source chain.

   We provide the option to the user to be able to get this acknowledgement from the router chain to the source chain and perform some operation based on it.

   1. **ackType = 0:** The user doesn't want the acknowledgement to be forwarded back to the source chain.
   2. **ackType = 1:** The acknowledgement is expected to be received only if the calls were successfully executed on the destination chain, and the user intends to perform some operation after receiving it on the source chain.
   3. **ackType = 2:** If an acknowledgment is only needed in case of an error occurring on the destination chain, enabling this functionality allows for performing certain operations afterward.
   4. **ackType = 3:** If an acknowledgment is needed from the destination chain regardless of whether the call succeeds or fails, and some operations need to be performed afterward, this can be specified.

7. **isReadCall:** An option is provided to query a contract from another chain and receive the data back on the source chain via acknowledgement. If the intention is only to query a contract on the destination chain, then set this option to `true`.
8. **asmAddress:** A modular security framework is available to add an extra layer of security on top of the security already provided by the Router Chain. These contracts will be in the form of smart contracts on the destination chain, and their addresses should be passed as bytes in this variable. Documentation for ASM can be found [here](../additionalSecurityModule.md)

### **6. requestPacket:**

This is bytes encoded string consisting of two parameters:

```javascript
string destContractAddress
bytes payload
```

1. **destContractAddress:** This is the address of the smart contract on the destination chain which will handle the payload that you send from the source chain to the destination chain.
2. **payload:** This is bytes containing the payload that you want to send to the destination chain. This can be anything depending on your utility. For example, in case of NFT transfers, it can contain the NFT ID, the recipient address etc.

   This is the data that you will receive on the destination chain as packet. So you can pass any data or message that you want to pass to the destination chain.

   For transferring an NFT with some NFT ID and some recipient address, the request packet can be created using the following code:

   ```javascript
   function getRequestPacket(
         string calldata destinationContractAddress
   ) external pure returns (bytes memory) {
         // Here we are passing NFT ID and the recipient address as packet.
         // However you can pass any other data as well.
         bytes memory packet = abi.encode(<NFT_ID>, "RECIPIENT_ADDRESS");

         return abi.encode(destinationContractAddress, packet);
   }
   ```
