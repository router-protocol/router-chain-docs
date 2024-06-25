---
title: Functions on third-party chain's contract
sidebar_position: 3
---

Router’s Gateway contracts have a function named `iSend` that facilitates the transmission of a cross-chain request to the middleware contract on the Router Chain. Whenever users want to execute a cross-chain request, they can call this function by passing the payload to be transferred from the source to the Router Chain.

In addition to calling the aforementioned function, the recipient contract on the destination chain will also have to implement the function `iReceive` to handle the requests received from the middleware contract.

### iSend Function:

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

This is a function on the Router’s Gateway contracts. This function creates a request to send a payload to the middleware contract on the Router Chain. By setting the parameters as per their requirements, users can use this function to exercise a wide range of functionalities when it comes to cross-chain message passing. These parameters include:

#### **1. version:**

Current version of Gateway contract which can be queried from the Gateway contract using the following function.

```javascript
function currentVersion() external view returns (uint256)
```

This would change whenever the signature of iSend function or event ISendEvent will change. However the Router Chain will support earlier versions of encoding too for iDapps to always remain compatible.

#### **2. routeAmount:**

If one wants to transfer Route tokens along with the call, they will have to pass the amount of tokens to be transferred here.

#### **3. routeRecipient:**

If one wants to transfer Route tokens along with the call, they will have to pass the address of recipient on the destination chain to which Route tokens will be minted on destination chain.

#### **4. destChainId:**

Chain ID of the destination chain in string format.

#### **5. requestMetadata:**

Some static information for the request. This is created so that iDapps don’t have to encode it on-chain, they can just send it as a parameter to their iDapp depending on the destination chain Id passed by the user. The request metadata is a bytes encoded string consisting of the following parameters:

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

It can be acheived by adding following function in your contract:

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

3. **ackGasLimit:** Gas limit required for execution of the acknowledgment coming from the destination chain back on the source chain. This can be calculated using tools like [hardhat-gas-reporter](https://www.npmjs.com/package/hardhat-gas-reporter).
4. **ackGasPrice:** Gas price of the destination chain. This can be calculated using the RPC of source chain as shown in the above [snippet](https://www.notion.so/EVM-to-Other-Chain-Flow-de922b13e0fa4d7b8c3c24590ff8ef65).
5. **relayerFees:** This is similar to priority fees that one pays on other chains. Router Chain relayers execute your requests on the destination chain. So if you want your request to be picked up by relayer faster, this should be set to a higher number. If you pass really low amount, the Router Chain will adjust it to some minimum amount.
6. **ackType:** When the contract calls have been executed on the destination chain, the iDapp has the option to get an acknowledgment back to the source chain.

   We provide the option to the user to be able to get this acknowledgment from the router chain to the source chain and perform some operation based on it.

   1. **ackType = 0:** You don’t want the acknowledgment to be forwarded back to the source chain.
   2. **ackType = 1:** You only want to receive the acknowledgment back to the source chain in case the calls executed successfully on the destination chain and perform some operation after that.
   3. **ackType = 2:** You only want to receive the acknowledgment back to the source chain in case the calls errored on the destination chain and perform some operation after that.
   4. **ackType = 3:** You only want to receive the acknowledgment back to the source chain in both the cases (success and error) and perform some operation after that.

7. **isReadCall:** We provide you the option to query a contract from another chain and get the data back on the source chain through acknowledgment. If you just want to query a contract on destination chain, set this to `true`.
8. **asmAddress:** We also provide modular security framework for creating an additional layer of security on top of the security provided by Router Chain. These will be in the form of smart contracts on destination chain. The address of this contract needs to be passed in the form of bytes in this variable. Documentation for ASM can be found [here](../../crosstalk/understanding-crosstalk/additionalSecurityModule.md)

#### **6. requestPacket:**

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

This function returns a nonce that serves as an identifier to your call to the Gateway contract. In this way, one can create a request to interact with the middleware contract on the Router Chain.

### iReceive Function:

```jsx
function iReceive(
    string memory requestSender,
    bytes memory packet,
    string memory srcChainId
  ) external returns (bytes memory)
```

This function needs to be implemented into the recipient smart contract on the destination chain. This function is responsible for handling the requests received from the middleware contract on the Router Chain.

This function should only be called by the Router’s Gateway contract. Make sure to check that the msg sender is the Gateway contract address. Also, make sure that only your middleware contract can send the request by checking it with the address of the sender received in the parameters of the function

In this function, you will get the address of the contract that initiated this request from the source chain, the payload you created on the source chain and the source chain ID. After receiving this information, you can process your payload and complete your cross-chain transaction.
