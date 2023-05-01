---
title: Creating and Sending a Cross-chain Read Request
sidebar_position: 1
---

To create a cross-chain read request, one needs to call the `iSend()` function on Router's Gateway contract with the following parameters:

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

wherein, the parameter `requestMetadata` is the metadata that includes `abi.encodePacked` value of destination gas limit, destination gas price, ackknowledgement gas limit, acknoeledgement gas price, relayer fees, acknowledgement type, bool if its a read call and address of Additional Security Module. It can be acheived by adding following function in your contract:

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

## iSend() Function

1. **version:** Current version of Gateway contract which can be queried from the Gateway contract using the following function.

   ```javascript
   function currentVersion() external view returns (uint256)
   ```

   This would change whenever the encoding of **requestMetadata** (parameter #5) changes. However the Router Chain will support earlier versions of encoding too for iDapps to always remain compatible.

2. **routeAmount:** If one wants to transfer Route tokens along with the call, they will have to pass the amount of tokens to be transferred here.
3. **routeRecipient:** If one wants to transfer Route tokens along with the call, they will have to pass the address of recipient on the destination chain to which Route tokens will be minted on destination chain.
4. **destChainId:** Chain ID of the destination chain in string format.
5. **requestMetadata:** Some static information for the request. This is created so that iDapps don’t have to encode it on-chain, they can just send it as a parameter to their iDapp depending on the destination chain Id passed by the user. The request metadata is a bytes encoded string consisting of the following parameters:
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
6. **requestPacket:** This is bytes encoded string consisting of two parameters:

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

## getRequestMetadata() Function

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
5. **relayerFees:** This is similar to priority fees that one pays on other chains. Router chain relayers execute your requests on the destination chain. So if you want your request to be picked up by relayer faster, this should be set to a higher number. If you pass really low amount, the Router chain will adjust it to some minimum amount.
6. **ackType:** When the contract calls have been executed on the destination chain, the iDapp has the option to get an acknowledgement back to the source chain.

   We provide the option to the user to be able to get this acknowledgement from the router chain to the source chain and perform some operation based on it.

   1. **ackType = 0:** You don’t want the acknowledgement to be forwarded back to the source chain.
   2. **ackType = 1:** You only want to receive the acknowledgement back to the source chain in case the calls executed successfully on the destination chain and perform some operation after that.
   3. **ackType = 2:** You only want to receive the acknowledgement back to the source chain in case the calls errored on the destination chain and perform some operation after that.
   4. **ackType = 3:** You only want to receive the acknowledgement back to the source chain in both the cases (success and error) and perform some operation after that.

7. **isReadCall:** We provide you the option to query a contract from another chain and get the data back on the source chain through acknowledgement. If you just want to query a contract on destination chain, set this to `true`.
8. **asmAddress:** We also provide modular security framework for creating an additional layer of security on top of the security provided by Router Chain. These will be in the form of smart contracts on destination chain. The address of this contract needs to be passed in the form of bytes in this variable. Documenation for ASM can be found [here](../../understanding-crosstalk/additionalSecurityModule.md)
