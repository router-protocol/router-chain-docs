---
title: iSend
sidebar_position: 1
---
import RelayerAPIData from '../../../../../src/utils/RelayerFees'


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

This function allows users to configure various aspects of cross-chain message passing based on their requirements. Some of the parameters that can be configured while calling this function include:

### 1) `version`

The current version of the Gateway contract which can be obtained by calling a specific function within the Gateway contract.

```javascript
function currentVersion() external view returns (uint256)
```

This would change whenever the encoding of `requestMetadata` (parameter #5) changes. However, to remain compatible with iDapps configured to work with previous versions, Router will also support earlier versions of encoding.

### 2) `routeAmount`

To transfer ROUTE tokens along with the message, one must specify the amount of tokens to be transferred in this field. This value can be set as **0** in case ROUTE token transfer is not required. 

### 3) `routeRecipient`

To transfer ROUTE tokens along with the call, users will need to provide the recipient's address on the destination chain. This value can be set as ***"" (Empty String)*** in case ROUTE token transfer is not required.

### 4) `destChainId`

Chain ID of the destination chain in string format.

### 5) `requestMetadata`

To avoid encoding on-chain, Router allows iDapps to send static information for a request as a parameter to their iDapp, which depends upon the destination chain ID provided by the user. This information is packaged into a byte-encoded string, known as the `requestMetadata` which includes the following parameters:

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

It can be achieved by adding the following function in your contract:

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

Alternatively, the `requestMetadata` parameter can be created in TypeScript or JavaScript using the following function:


```javascript
function getRequestMetadata(
  destGasLimit: number,
  destGasPrice: number,
  ackGasLimit: number,
  ackGasPrice: number,
  relayerFees: string,
  ackType: number,
  isReadCall: boolean,
  asmAddress: string
): string {
  return ethers.utils.solidityPack(
    [
      'uint64',
      'uint64',
      'uint64',
      'uint64',
      'uint128',
      'uint8',
      'bool',
      'string',
    ],
    [
      destGasLimit,
      destGasPrice,
      ackGasLimit,
      ackGasPrice,
      relayerFees,
      ackType,
      isReadCall,
      asmAddress,
    ]
  );
}
```

**5.1) `destGasLimit` -** Gas limit required for execution of the request on the destination chain. This can be calculated using tools like [hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter).

**5.2) `destGasPrice` -** Gas price of the destination chain. This can be calculated using the RPC of destination chain.

   ```jsx
   // using ethers.js
   const gasPrice = await provider.getGasPrice();

   // using web3.js
   const gasPrice = web3.eth.getGasPrice().then((result) => {
     console.log(web3.utils.fromWei(result, 'ether'));
   });
   ```

   To avoid the need for calculation, it can be passed as 0. The Router chain will then estimate the real-time gas price for them.

**5.3) `ackGasLimit` -** Gas limit required for the execution of the acknowledgment on the source chain. This can be calculated using tools like [hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter).

**5.4) `ackGasPrice` -** Gas price of the source chain. This can be calculated using the RPC of source chain as shown in the above [snippet](#5-requestmetadata). To avoid the need for calculation, it can be passed as 0. The Router chain will then estimate the real-time gas price for them.

**5.5) `relayerFees` -** This parameter functions similarly to the priority fees on other blockchain networks. Since the Router chain relayers handle the execution of cross-chain requests on the destination chain, setting a higher `relayerFees` will increase the likelihood of your request being prioritized by relayers. If a very low `relayerFees` is provided, the Router chain will automatically adjust it to the minimum required amount to ensure that it is executed. If it is passed as 0, the Router chain will default it to the minimum set Relayer fee value. 

Minimum relayer fees based on network is given below -
<RelayerAPIData
  relayerApiData={[
    { apiUrl: 'https://lcd.testnet.routerchain.dev/router-protocol/router-chain/crosschain/params', networkType: 'Testnet' }
  ]}
/>
<p style={{ marginBottom: '30px' }}></p>


**5.6) `ackType` -** When the contract calls have been executed on the destination chain, the destination chain Gateway contract sends an acknowledgent back to the Router chain. iDapps have the option to get this acknowledgment from the Router chain to the source chain and execute some operations based on the ack.
   - If `ackType` = 0, the user doesn't want the acknowledgment to be forwarded back to the source chain.
   - If `ackType` = 1, the acknowledgment is expected to be received only if the calls were successfully executed on the destination chain, and the user intends to perform some operation on the source chain after receiving the ack.
   - If `ackType` = 2, an acknowledgment is needed only in case of an error occurring on the destination chain. This options also allows for execution of certain operations after receiving the ack.
   - If `ackType` = 3, an acknowledgment is needed from the destination chain regardless of whether the call succeeds or fails, and some operations need to be performed based on the ack. 

**5.7) `isReadCall` -** Router provides dApps an option to query a contract on another chain and receive the data back on the source chain as an acknowledgment. If the intention is only to query a contract on the destination chain and not perform any write operation there, then set this option to `true`.

**5.8) `asmAddress` -** As part of Router's modular security framework, developers can integrate an ASM module to add an extra layer of security on top of the infra-level security provided by the Router Chain. These modules will be in the form of smart contracts on the destination chain, and their addresses should be passed as bytes in this variable. Documentation for ASM can be found [here](../../key-concepts/additional-security-modules).

### 6) `requestPacket`

This is bytes encoded string consisting of two parameters:

```javascript
string destContractAddress
bytes payload
```

**6.1) `destContractAddress` -** This is the address of the destination chain's smart contract that will handle the payload sent from the source chain to the destination chain.

**6.2) `payload` -** Bytes containing the payload that you want to send to the destination chain. This can be anything depending on your utility. For example, in the case of NFT transfers, it can contain the NFT ID, the recipient address etc. 


In other words, payload is the data that you will receive on the destination chain as packet. For transferring an NFT with a specific NFT ID and recipient address, the request packet can be created using the following code:

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
