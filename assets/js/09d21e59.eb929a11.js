"use strict";(self.webpackChunkrouter_docs=self.webpackChunkrouter_docs||[]).push([[5645],{3905:(e,t,n)=>{n.d(t,{Zo:()=>d,kt:()=>u});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function o(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),l=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},d=function(e){var t=l(e.components);return a.createElement(c.Provider,{value:t},e.children)},h={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},m=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,c=e.parentName,d=o(e,["components","mdxType","originalType","parentName"]),m=l(n),u=r,p=m["".concat(c,".").concat(u)]||m[u]||h[u]||s;return n?a.createElement(p,i(i({ref:t},d),{},{components:n})):a.createElement(p,i({ref:t},d))}));function u(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,i=new Array(s);i[0]=m;var o={};for(var c in t)hasOwnProperty.call(t,c)&&(o[c]=t[c]);o.originalType=e,o.mdxType="string"==typeof e?e:r,i[1]=o;for(var l=2;l<s;l++)i[l]=n[l];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}m.displayName="MDXCreateElement"},87721:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>i,default:()=>h,frontMatter:()=>s,metadata:()=>o,toc:()=>l});var a=n(87462),r=(n(67294),n(3905));const s={title:"Using Router CrossTalk Utils Library",sidebar_position:2,description:"A cross-chain NFT (ERC-1155) contract using Router CrossTalkUtils Library"},i=void 0,o={unversionedId:"guides/evm_guides/cross-chain-nft/using-contract-utils-library",id:"guides/evm_guides/cross-chain-nft/using-contract-utils-library",title:"Using Router CrossTalk Utils Library",description:"A cross-chain NFT (ERC-1155) contract using Router CrossTalkUtils Library",source:"@site/docs/crosstalk/guides/evm_guides/cross-chain-nft/using-contract-utils-library.md",sourceDirName:"guides/evm_guides/cross-chain-nft",slug:"/guides/evm_guides/cross-chain-nft/using-contract-utils-library",permalink:"/crosstalk/guides/evm_guides/cross-chain-nft/using-contract-utils-library",draft:!1,editUrl:"https://github.com/router-protocol/docs/tree/main/docs/crosstalk/guides/evm_guides/cross-chain-nft/using-contract-utils-library.md",tags:[],version:"current",sidebarPosition:2,frontMatter:{title:"Using Router CrossTalk Utils Library",sidebar_position:2,description:"A cross-chain NFT (ERC-1155) contract using Router CrossTalkUtils Library"},sidebar:"tutorialSidebar",previous:{title:"Using Gateway Contract Directly",permalink:"/crosstalk/guides/evm_guides/cross-chain-nft/using-gateway-contract"}},c={},l=[{value:"Installing the dependencies:",id:"installing-the-dependencies",level:3},{value:"Instantiating the contract:",id:"instantiating-the-contract",level:3},{value:"Creating state variables and the constructor",id:"creating-state-variables-and-the-constructor",level:3},{value:"Transferring an NFT from a source chain to a destination chain",id:"transferring-an-nft-from-a-source-chain-to-a-destination-chain",level:3},{value:"Handling a cross-chain request",id:"handling-a-cross-chain-request",level:3}],d={toc:l};function h(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},d,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"In this section we will go through how a cross-chain ERC-1155 NFT can be created by integrating the Router GatewayUtils library."),(0,r.kt)("h3",{id:"installing-the-dependencies"},"Installing the dependencies:"),(0,r.kt)("p",null,"Install the evm-gateway contracts with the following command:"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"yarn add evm-gateway-contract"),"  or  ",(0,r.kt)("inlineCode",{parentName:"p"},"npm install evm-gateway-contract")),(0,r.kt)("p",null,"Install the openzeppelin contracts library with the following command:"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"yarn add @openzeppelin/contracts"),"   or  ",(0,r.kt)("inlineCode",{parentName:"p"},"npm install @openzeppelin/contracts")," "),(0,r.kt)("p",null,"Install the crosstalk-utils library using the following command:"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"yarn add @routerprotocol/router-crosstalk-utils"),"  or  ",(0,r.kt)("inlineCode",{parentName:"p"},"npm install @routerprotocol/router-crosstalk-utils")),(0,r.kt)("h3",{id:"instantiating-the-contract"},"Instantiating the contract:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'pragma solidity >=0.8.0 <0.9.0;\n\nimport "evm-gateway-contract/contracts/ICrossTalkApplication.sol";\nimport "evm-gateway-contract/contracts/Utils.sol";\nimport "@routerprotocol/router-crosstalk-utils/contracts/CrossTalkUtils.sol";\nimport "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";\n\ncontract XERC1155 is ERC1155, ICrossTalkApplication {\n}\n')),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Import the ICrossTalkApplication.sol and Utils.sol from ",(0,r.kt)("inlineCode",{parentName:"li"},"evm-gateway-contract/contracts"),"."),(0,r.kt)("li",{parentName:"ol"},"Import the CrossTalkUtils.sol from ",(0,r.kt)("inlineCode",{parentName:"li"},"@routerprotocol/router-crosstalk-utils/contracts")),(0,r.kt)("li",{parentName:"ol"},"Inherit the ICrossTalkApplication contract into your main contract (XERC1155).")),(0,r.kt)("h3",{id:"creating-state-variables-and-the-constructor"},"Creating state variables and the constructor"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"address public admin;\naddress public gatewayContract;\nuint64 public destGasLimit;\n// chain type + chain id => address of our contract in bytes\nmapping(uint64 => mapping(string => bytes)) public ourContractOnChains;\n\nstruct TransferParams {\n    uint256[] nftIds;\n    uint256[] nftAmounts;\n    bytes nftData;\n    bytes recipient;\n}\n\nconstructor(\n    string memory uri,\n    address payable gatewayAddress, \n    uint64 _destGasLimit\n) ERC1155(uri) {\n    gatewayContract = gatewayAddress;\n    destGasLimit = _destGasLimit;\n    admin = msg.sender;\n}\n")),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create a variable ",(0,r.kt)("strong",{parentName:"p"},"admin")," of type address which stores the address of the admin. This address will be used for access control purposes.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create an instance to the ",(0,r.kt)("strong",{parentName:"p"},"gateway")," contract of type address. This will be the contract which will route your message to the Router Chain.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create a variable ",(0,r.kt)("strong",{parentName:"p"},"destGasLimit")," of type uint64 which indicates the amount of gas required to execute the function that will handle our cross-chain request on the destination chain. This can be easily calculated using any gas estimator. You can use the ",(0,r.kt)("em",{parentName:"p"},(0,r.kt)("a",{parentName:"em",href:"https://www.npmjs.com/package/hardhat-gas-reporter"},"hardhat-gas-reporter"))," plugin to calculate this.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create a mapping which will map a chain type + chain ID to the address of our NFT contracts deployed on different chains. We will fetch the address from this mapping when the request is received on the destination chain from the source chain."),(0,r.kt)("p",{parentName:"li"},"We will also need a setter function where you will be able to set this address using the chain type and chain ID. You also want to make sure that only admin is able to set this mapping. You can create it in the following way:"),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'function setContractOnChain(\n    uint64 chainType, \n    string memory chainId, \n    address contractAddress\n) external {\n    require(msg.sender == admin, "only admin");\n    ourContractOnChains[chainType][chainId] = toBytes(contractAddress);\n}\n')),(0,r.kt)("p",{parentName:"li"},"For this to work, you will need to use the ",(0,r.kt)("strong",{parentName:"p"},"toBytes")," function to convert the address of your contract to bytes format. You can find the ",(0,r.kt)("strong",{parentName:"p"},"toBytes")," function ",(0,r.kt)("a",{parentName:"p",href:"../../understanding-crosstalk/requestToDest#6-contractcalls"},"here"),". ")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create a struct named ",(0,r.kt)("strong",{parentName:"p"},"TransferParams")," which will be used to transfer NFTs to the destination chain. This will contain:"),(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"nftIds:")," An array of NFT Ids you want to transfer to the destination chain. "),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"nftAmounts:")," An array of amounts of the respective NFT Ids to be transferred to the recipient on the destination chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"nftData:")," Arbitrary data to be used while minting the NFT. You can send ",(0,r.kt)("inlineCode",{parentName:"li"},"0x00")," if you don\u2019t want to send any data while minting the NFT."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"recipient:")," Address (in bytes format) of the recipient of the NFTs on the destination chain."))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create the constructor with the URI of the NFT metadata, address of gateway contract and the destination gas limit and set these variables inside the constructor. Also initialise the ERC1155 contract by passing it the URI with the constructor as shown above. Also set the admin as msg sender inside the constructor so that the deployer is the admin."))),(0,r.kt)("h3",{id:"transferring-an-nft-from-a-source-chain-to-a-destination-chain"},"Transferring an NFT from a source chain to a destination chain"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function transferCrossChain(\n    uint64 chainType,\n    string memory chainId,\n    uint64 expiryDurationInSeconds,\n    uint64 destGasPrice,\n    TransferParams memory transferParams\n  ) public payable {\n        // burning the NFTs from the address of the user calling this function\n    _burnBatch(msg.sender, transferParams.nftIds, transferParams.nftAmounts);\n\n    bytes memory payload = abi.encode(transferParams);\n    uint64 expiryTimestamp = uint64(block.timestamp) + expiryDurationInSeconds;\n    Utils.DestinationChainParams memory destChainParams = \n                    Utils.DestinationChainParams(\n                        destGasLimit,\n                        destGasPrice,\n                        chainType,\n                        chainId\n                    );      \n\n    CrossTalkUtils.singleRequestWithoutAcknowledgement(\n        gatewayContract,\n        expiryTimestamp,\n        destChainParams,\n        ourContractOnChains[chainType][chainId],  // destination contract address\n        payload\n    );\n  }\n")),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Create a function with whatever name you want to call it. Here, we will call it the transferCrossChain function which accepts five parameters: "),(0,r.kt)("ol",{parentName:"li"},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"chainType:")," Type of the destination chain. The values for chain types can be found ",(0,r.kt)("a",{parentName:"li",href:"../../understanding-crosstalk/chainTypes"},"here"),"."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"chainId:")," Chain ID of the destination chain in string format."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"expiryDurationInSeconds:")," The duration in seconds for which the cross-chain request created after calling this function remains valid. If the expiry duration elapses before the request is executed on the destination chain contract, the request will fail. If you don\u2019t want to keep any expiry timestamp, just send a very large number (a trillion will do) and your request will never expire."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"destGasPrice:")," Gas price of the destination chain.\nTo get the gas price for a chain, you can use the following function:")),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"// using ethers.js\nconst gasPrice = await provider.getGasPrice();\n\n// using web3.js\nconst gasPrice = web3.eth.getGasPrice().then((result) => {\n    console.log(web3.utils.fromWei(result, 'ether'))\n})\n")),(0,r.kt)("ol",{parentName:"li",start:5},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"transferParams:")," The struct of type TransferParams which receives the NFT Ids and the respective amounts the user wants to transfer to the destination chain. It also receives the arbitrary data to be used while minting the NFT on the destination chain and the address of recipient in bytes."))),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Burning the NFTs from user\u2019s account:")," The user must own the NFTs to be able to transfer them to the destination chain. We will burn those NFTs from user\u2019s account before creating a cross-chain communication request to the destination chain using the ",(0,r.kt)("strong",{parentName:"p"},"_burnBatch")," method defined in ERC-1155 contract of the Openzeppelin library.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Create the payload:")," Here, we only want to send the transfer params to the destination chain. That is why we will just abi encode the transferParams and set it as the payload. ")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Calculating the expiry timestamp:")," As you must have already guessed, the expiry timestamp will be the ",(0,r.kt)("strong",{parentName:"p"},"block.timestamp + expiryDurationInSeconds"),".")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"Creating the destChainParams struct:")," Create the Destination Chain Params struct with the required parameters: destination gas limit, destination gas price, destination chain type and the destination chain ID.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},"Calling the CrossTalkUtils library\u2019s function to generate a cross-chain communication request: Now the time has come for us to generate a cross-chain communication request to the destination chain. We will now call the CrossTalkUtils library\u2019s function singleRequestWithoutAcknowledgement with the parameters shown in the code above which in turn will call the requestToDest function of the Gateway contract. The documentation for this function can be found ",(0,r.kt)("a",{parentName:"p",href:"../../crosstalkutils-library/how-to-use-the-crosstalkutils-library#a-single-call-without-acknowledgment"},"here"),"."),(0,r.kt)("p",{parentName:"li"},"This function returns the nonce of the cross-chain requests generated by the Gateway contract. We will be ignoring this nonce as we don\u2019t need it in this case. Now, we have successfully generated a cross-chain request to ping the destination chain contract."))),(0,r.kt)("h3",{id:"handling-a-cross-chain-request"},"Handling a cross-chain request"),(0,r.kt)("p",null,"Now since we know how we can create a cross-chain communication request from the source chain, we will now handle that request on the destination chain. We will be deploying the same contract on both the source and the destination chains, so we need to create the functionality to handle the cross-chain communication request here. "),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function handleRequestFromSource(\n  bytes memory srcContractAddress,\n  bytes memory payload,\n  string memory srcChainId,\n  uint64 srcChainType\n) external override returns (bytes memory) {\n  require(msg.sender == address(gatewayContract));\n    require(\n    keccak256(srcContractAddress) == \n        keccak256(ourContractOnChains[srcChainType][srcChainId])\n    );\n\n  TransferParams memory transferParams = abi.decode(payload, (TransferParams));\n    _mintBatch(\n        CrossTalkUtils.toAddress(transferParams.recipient), \n        transferParams.nftIds, \n        transferParams.nftAmounts, \n        transferParams.nftData\n    );\n\n  return abi.encode(srcChainId, srcChainType);\n}\n")),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"Create a function named ",(0,r.kt)("strong",{parentName:"li"},"handleRequestFromSource")," and here, the name matters. The function signature, i.e. the name and the parameters it receive has to be the same since this function is called by the Gateway contract on the destination chain and if the name or the parameters to this function changes, the call will fail. The details about the parameters to this function is explained ",(0,r.kt)("a",{parentName:"li",href:"../../understanding-crosstalk/handleRequestFromSource"},"here")," in detail."),(0,r.kt)("li",{parentName:"ol"},"First, we will check that the request can only be sent by the Gateway contract. No other contract or wallet should be able to call this function. We also check that the request is received from our contract only from the source chain."),(0,r.kt)("li",{parentName:"ol"},"Since the request was generated by us, we know exactly what is received inside the payload. Since we sent the transfer params, we will decode it and store it in a transferParams variable."),(0,r.kt)("li",{parentName:"ol"},"We will now mint the NFTs that we burnt on the source chain to the recipient on the destination chain using the ",(0,r.kt)("strong",{parentName:"li"},"_mintBatch")," function of the ERC-1155 contract of the Openzeppelin library. We will have to convert the address of the recipient from bytes back to address format here. The function ",(0,r.kt)("strong",{parentName:"li"},"toAddress")," to convert bytes to address type can be found ",(0,r.kt)("a",{parentName:"li",href:"../../understanding-crosstalk/requestToDest#6-contractcalls"},"here"),". This function is included in the library and can be used directly as shown in the code snippet above.")),(0,r.kt)("p",null,"After the execution of this function is complete, a success acknowledgement will be triggered to the Router Chain."),(0,r.kt)("p",null,"Now we have handled the request on the destination chain. Since we have inherited from the ",(0,r.kt)("strong",{parentName:"p"},"ICrossTalkApplication"),", we have to implement the ",(0,r.kt)("strong",{parentName:"p"},"handleCrossTalkAck")," function otherwise we will get an error. Since we would not like to handle the acknowledgement on the source chain, we will just implement an empty function for handling acknowledgement. The documentation for this function can be found ",(0,r.kt)("a",{parentName:"p",href:"../../understanding-crosstalk/handleCrossTalkAck"},"here"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function handleCrossTalkAck(\n  uint64, //eventIdentifier,\n  bool[] memory, //execFlags,\n  bytes[] memory //execData\n) external view override {}\n")),(0,r.kt)("p",null,"In this way, we can create a contract for cross-chain ERC-1155 NFTs using the Router CrossTalk."),(0,r.kt)("details",null,(0,r.kt)("summary",null,(0,r.kt)("b",null,"Full Contract Example")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'pragma solidity >=0.8.0 <0.9.0;\n\nimport "evm-gateway-contract/contracts/ICrossTalkApplication.sol";\nimport "evm-gateway-contract/contracts/Utils.sol";\nimport "@routerprotocol/router-crosstalk-utils/contracts/CrossTalkUtils.sol";\nimport "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";\n\ncontract XERC1155 is ERC1155, ICrossTalkApplication {\n    address public admin;\n    address public gatewayContract;\n    uint64 public destGasLimit;\n    // chain type + chain id => address of our contract in bytes\n    mapping(uint64 => mapping(string => bytes)) public ourContractOnChains;\n    \n    struct TransferParams {\n        uint256[] nftIds;\n        uint256[] nftAmounts;\n        bytes nftData;\n        bytes recipient;\n    }\n\n    constructor(\n      string memory uri,\n        address payable gatewayAddress, \n        uint64 _destGasLimit\n    ) ERC1155(uri) {\n      gatewayContract = gatewayAddress;\n        destGasLimit = _destGasLimit;\n        admin = msg.sender;\n    }\n\n    function setContractOnChain(\n        uint64 chainType, \n        string memory chainId, \n        address contractAddress\n    ) external {\n        require(msg.sender == admin, "only admin");\n        ourContractOnChains[chainType][chainId] = toBytes(contractAddress);\n    }\n\n    function transferCrossChain(\n    uint64 chainType,\n    string memory chainId,\n        uint64 expiryDurationInSeconds,\n    uint64 destGasPrice,\n    TransferParams memory transferParams\n  ) public payable {\n        // burning the NFTs from the address of the user calling this function\n    _burnBatch(msg.sender, transferParams.nftIds, transferParams.nftAmounts);\n\n      bytes memory payload = abi.encode(transferParams);\n        uint64 expiryTimestamp = \n                    uint64(block.timestamp) + expiryDurationInSeconds;\n        Utils.DestinationChainParams memory destChainParams = \n                        Utils.DestinationChainParams(\n                            destGasLimit,\n                            destGasPrice,\n                            chainType,\n                            chainId\n                        );      \n\n        CrossTalkUtils.singleRequestWithoutAcknowledgement(\n            gatewayContract,\n            expiryTimestamp,\n            destChainParams,\n            ourContractOnChains[chainType][chainId], // destination contract address\n            payload\n        );\n  }\n\n    function handleRequestFromSource(\n      bytes memory srcContractAddress,\n      bytes memory payload,\n      string memory srcChainId,\n      uint64 srcChainType\n    ) external override returns (bytes memory) {\n      require(msg.sender == gatewayContract);\n        require(\n            keccak256(srcContractAddress) == \n                    keccak256(ourContractOnChains[srcChainType][srcChainId])\n        );\n    \n      TransferParams memory transferParams = \n                    abi.decode(payload, (TransferParams));\n        _mintBatch(\n            // converting the address of recipient from bytes to address\n            CrossTalkUtils.toAddress(transferParams.recipient), \n            transferParams.nftIds, \n            transferParams.nftAmounts, \n            transferParams.nftData\n        );\n    \n      return abi.encode(srcChainId, srcChainType);\n    }\n    \n    function handleCrossTalkAck(\n      uint64, //eventIdentifier,\n      bool[] memory, //execFlags,\n      bytes[] memory //execData\n    ) external view override {} \n\n    function toBytes(address a) public pure returns (bytes memory b){\n    assembly {\n        let m := mload(0x40)\n        a := and(a, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)\n        mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))\n        mstore(0x40, add(m, 52))\n        b := m\n    }\n    \n}\n'))),(0,r.kt)("details",null,(0,r.kt)("summary",null,(0,r.kt)("b",null,"Deployed Contracts for Reference")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Polygon Mumbai Testnet:")," ",(0,r.kt)("a",{parentName:"p",href:"https://mumbai.polygonscan.com/address/0x78A3B23DeF518f1489837b88743e557Be3EB560C"},"https://mumbai.polygonscan.com/address/0x78A3B23DeF518f1489837b88743e557Be3EB560C")),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Avalanche Fuji Testnet:")," ",(0,r.kt)("a",{parentName:"p",href:"https://testnet.snowtrace.io/address/0xA154De789a2c3a9b1308c4CF25bc1d882Ff09E1e"},"https://testnet.snowtrace.io/address/0xA154De789a2c3a9b1308c4CF25bc1d882Ff09E1e"))))}h.isMDXComponent=!0}}]);