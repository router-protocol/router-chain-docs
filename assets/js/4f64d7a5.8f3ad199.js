"use strict";(self.webpackChunkrouter_docs=self.webpackChunkrouter_docs||[]).push([[406],{3905:(e,t,n)=>{n.d(t,{Zo:()=>p,kt:()=>m});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},p=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},u={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},d=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,p=i(e,["components","mdxType","originalType","parentName"]),d=c(n),m=r,h=d["".concat(l,".").concat(m)]||d[m]||u[m]||o;return n?a.createElement(h,s(s({ref:t},p),{},{components:n})):a.createElement(h,s({ref:t},p))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,s=new Array(o);s[0]=d;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var c=2;c<o;c++)s[c]=n[c];return a.createElement.apply(null,s)}return a.createElement.apply(null,n)}d.displayName="MDXCreateElement"},30496:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>i,toc:()=>c});var a=n(87462),r=(n(67294),n(3905));const o={title:"Multiple Calls without Acknowledgment",sidebar_position:3},s=void 0,i={unversionedId:"different-types-of-requests/evm_guides/multiple-calls-without-ack",id:"different-types-of-requests/evm_guides/multiple-calls-without-ack",title:"Multiple Calls without Acknowledgment",description:"Consider an application that allows users to transfer multiple ERC20 tokens or messages from one chain to another in the same cross-chain request. In this case, the requirements are as follows:",source:"@site/docs/crosstalk/different-types-of-requests/evm_guides/multiple-calls-without-ack.md",sourceDirName:"different-types-of-requests/evm_guides",slug:"/different-types-of-requests/evm_guides/multiple-calls-without-ack",permalink:"/crosstalk/different-types-of-requests/evm_guides/multiple-calls-without-ack",draft:!1,editUrl:"https://github.com/router-protocol/docs/tree/main/docs/crosstalk/different-types-of-requests/evm_guides/multiple-calls-without-ack.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Multiple Calls without Acknowledgment",sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Single Call with Acknowledgment",permalink:"/crosstalk/different-types-of-requests/evm_guides/single-call-with-ack"},next:{title:"Multiple Calls with Acknowledgment",permalink:"/crosstalk/different-types-of-requests/evm_guides/multiple-calls-with-ack"}},l={},c=[],p={toc:c};function u(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},p,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"Consider an application that allows users to transfer multiple ERC20 tokens or messages from one chain to another in the same cross-chain request. In this case, the requirements are as follows:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"We need to send multiple contract calls for execution to the destination chain contract."),(0,r.kt)("li",{parentName:"ol"},"We don't need the acknowledgment back on the source chain after the calls are executed on the destination chain.")),(0,r.kt)("p",null,"To implement such functionality using Router CrossTalk, follow these steps:"),(0,r.kt)("details",null,(0,r.kt)("summary",null,(0,r.kt)("b",null,"Step 1) Call ",(0,r.kt)("code",null,"requestToDest")," on Router's Gateway Contract")),(0,r.kt)("p",null,"We will initiate a cross-chain request from the source chain by calling the ",(0,r.kt)("inlineCode",{parentName:"p"},"requestToDest")," function on Router's source chain Gateway contract."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"gatewayContract.requestToDest(\n    expiryTimestamp, \n    false,\n    Utils.AckType.NO_ACK,\n    Utils.AckGasParams(0,0),\n    Utils.DestinationChainParams(destGasLimit, destGasPrice, chainType, chainId),\n    Utils.ContractCalls(payloads, addresses)\n);\n")),(0,r.kt)("p",null,"While calling the ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"requestToDest"))," function on the Gateway contract, we need to pass the following parameters:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"expiryTimestamp:")," If you want to add a specific expiry timestamp, you can mention it against this parameter. Your request will get reverted if it is not executed before the expiryTimestamp. If you don't want any expiryTimestamp, you can use ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"type(uint64).max"))," as the expiryTimestamp.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"isAtomicCalls:")," Set it to true if you want to ensure that either all your contract calls are executed or none of them are executed. Set it to false if you do not require atomicity. ")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"ackType:")," Since we don't need an acknowledgment, set it to ",(0,r.kt)("strong",{parentName:"p"},"NO_ACK"),".")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"ackGasParams:")," Since we are not requesting an acknowledgment, send ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"(0,0)"))," as the gas limit and gas price for ackGasParams.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"destinationChainParams:")," We need to pass the destination chain gas limit, gas price, chain type, and the chain ID here.")),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("p",{parentName:"li"},(0,r.kt)("strong",{parentName:"p"},"contractCalls:")," Encode the payloads and the destination contract addresses in byte arrays and pass them in this function. The payload consist of the ABI-encoded data you want to send to the other chain. The destinationContractAddress is the address of the recipient contract on the destination chain that will handle the cross-chain request. In this case, we want to different payloads to different destination contracts."),(0,r.kt)("pre",{parentName:"li"},(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"bytes[] memory addresses = new bytes[](3);\naddresses[0] = toBytes(destinationContractAddress1);\naddresses[1] = toBytes(destinationContractAddress2);\naddresses[2] = toBytes(destinationContractAddress3);\n\nbytes[] memory payloads = new bytes[](3);\npayloads[0] = payload1;\npayloads[1] = payload2;\npayloads[2] = payload3;\n")),(0,r.kt)("p",{parentName:"li"},"The ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"toBytes"))," function can be found ",(0,r.kt)("a",{parentName:"p",href:"../understanding-crosstalk/requestToDest#6-contractcalls"},"here"),".")))),(0,r.kt)("details",null,(0,r.kt)("summary",null,(0,r.kt)("b",null,"Step 2) Handle the Cross-chain Request in your Destination Contract")),(0,r.kt)("p",null,"Once the cross-chain request is received on the destination chain, we need a mechanism to handle it. That's where ",(0,r.kt)("strong",{parentName:"p"},(0,r.kt)("inlineCode",{parentName:"strong"},"handleRequestFromSource"))," function comes into play. Router's Gateway contract on the destination chain will pass the payload along with the source chain details to the respective destination chain contract by calling this function."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function handleRequestFromSource(\n      bytes memory srcContractAddress,\n      bytes memory payload,\n      string memory srcChainId,\n      uint64 srcChainType\n) external returns (bytes memory)\n")),(0,r.kt)("p",null,"You can handle the payload in any way you want to complete your cross-chain functionality.")),(0,r.kt)("details",null,(0,r.kt)("summary",null,(0,r.kt)("b",null,"Step 3) Adding an Empty Acknowledgment Handler")),(0,r.kt)("p",null,"Even though we don't need an acknowledgment on the source chain, we need to implement an acknowledgment handler function. This will be empty since this function will never get called in this particular use case. The documentation for this function can be found ",(0,r.kt)("a",{parentName:"p",href:"../understanding-crosstalk/handleCrossTalkAck"},"here"),"."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function handleCrossTalkAck(\n  uint64, // eventIdentifier\n  bool[] memory, // execFlags\n  bytes[] memory // execData\n) external {}\n"))))}u.isMDXComponent=!0}}]);