"use strict";(self.webpackChunkrouter_docs=self.webpackChunkrouter_docs||[]).push([[4353],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var a=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function s(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?s(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):s(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},s=Object.keys(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var s=Object.getOwnPropertySymbols(e);for(a=0;a<s.length;a++)n=s[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=a.createContext({}),l=function(e){var t=a.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):o(o({},t),e)),n},u=function(e){var t=l(e.components);return a.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,s=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=l(n),m=r,h=p["".concat(c,".").concat(m)]||p[m]||d[m]||s;return n?a.createElement(h,o(o({ref:t},u),{},{components:n})):a.createElement(h,o({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var s=n.length,o=new Array(s);o[0]=p;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,o[1]=i;for(var l=2;l<s;l++)o[l]=n[l];return a.createElement.apply(null,o)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},43448:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>o,default:()=>d,frontMatter:()=>s,metadata:()=>i,toc:()=>l});var a=n(87462),r=(n(67294),n(3905));const s={title:"requestToDest",sidebar_position:1},o="requestToDest Function",i={unversionedId:"understanding-crosstalk/requestToDest",id:"understanding-crosstalk/requestToDest",title:"requestToDest",description:"By setting the parameters per their requirements, users can use this function to exercise a wide range of functionalities when it comes to cross-chain message passing. These parameters include:",source:"@site/docs/crosstalk/understanding-crosstalk/requestToDest.md",sourceDirName:"understanding-crosstalk",slug:"/understanding-crosstalk/requestToDest",permalink:"/crosstalk/understanding-crosstalk/requestToDest",draft:!1,editUrl:"https://github.com/router-protocol/docs/tree/main/docs/crosstalk/understanding-crosstalk/requestToDest.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"requestToDest",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Understanding CrossTalk",permalink:"/crosstalk/understanding-crosstalk/"},next:{title:"handleRequestFromSource",permalink:"/crosstalk/understanding-crosstalk/handleRequestFromSource"}},c={},l=[{value:"1. requestArgs",id:"1-requestargs",level:3},{value:"2. ackType",id:"2-acktype",level:3},{value:"3. ackGasParams",id:"3-ackgasparams",level:3},{value:"4. destinationChainParams",id:"4-destinationchainparams",level:3},{value:"5. contractCalls",id:"5-contractcalls",level:3}],u={toc:l};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("h1",{id:"requesttodest-function"},(0,r.kt)("inlineCode",{parentName:"h1"},"requestToDest")," Function"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"function requestToDest(\n    Utils.RequestArgs memory requestArgs,\n    Utils.AckType,\n    Utils.AckGasParams memory ackGasParams,\n    Utils.DestinationChainParams memory destChainParams,\n    Utils.ContractCalls memory contractCalls\n  ) external returns (uint64);\n")),(0,r.kt)("p",null,"By setting the parameters per their requirements, users can use this function to exercise a wide range of functionalities when it comes to cross-chain message passing. These parameters include:"),(0,r.kt)("h3",{id:"1-requestargs"},"1. requestArgs"),(0,r.kt)("p",null,"A struct comprising of the following subparameters:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"expiryTimestamp:")," The timestamp by which your cross-chain call will expire. If your call is not executed on the destination chain by this time, it will be reverted. If you don't want any expiry timestamp, pass ",(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"type(uint64).max"))," as the expiryTimestamp."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"isAtomicCalls:")," Since users can use ",(0,r.kt)("strong",{parentName:"li"},(0,r.kt)("inlineCode",{parentName:"strong"},"requestToDest"))," to send multiple cross-chain calls in one go, isAtomicCalls boolean value ensures whether the calls are atomic.")),(0,r.kt)("ul",null,(0,r.kt)("li",{parentName:"ul"},"If this variable is set to ",(0,r.kt)("strong",{parentName:"li"},"true"),", either all the contract calls will be executed on the destination chain or none of them will be executed."),(0,r.kt)("li",{parentName:"ul"},"If this variable is set to ",(0,r.kt)("strong",{parentName:"li"},"false"),", even if some of the contracts calls fail on the destination chain, other calls won't be affected.")),(0,r.kt)("ol",{start:3},(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"feePayer:")," This specifies the address on the Router chain from which the cross-chain fee will be deducted. ")),(0,r.kt)("h3",{id:"2-acktype"},"2. ackType"),(0,r.kt)("p",null,"When the contract calls are executed on the destination chain, the Router chain receives an acknowledgment from the destination chain, which specifies whether the execution was successful or did it result in some error. We provide users the option to get this acknowledgment from the Router chain to the source chain and perform some operations based on that acknowledgment."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"enum AckType {\n    NO_ACK,\n    ACK_ON_SUCCESS,\n    ACK_ON_ERROR,\n    ACK_ON_BOTH\n}\n")),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"ackType = NO_ACK:")," You don't want to receive the acknowledgment on the source chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"ackType = ACK_ON_SUCCESS:")," You only want to receive the acknowledgment on the source chain if the calls are executed successfully on the destination chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"ackType = ACK_ON_ERROR:")," You only want to receive the acknowledgment on the source chain in case the calls failed on the destination chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"ackType = ACK_ON_BOTH:")," You want to receive the acknowledgment on the source chain in both cases (success and error).")),(0,r.kt)("h3",{id:"3-ackgasparams"},"3. ackGasParams"),(0,r.kt)("p",null,"If you opted to receive the acknowledgment on the source chain, you would need to write a callback function (discussed ",(0,r.kt)("a",{parentName:"p",href:"./handleCrossTalkAck"},"here"),") to handle the acknowledgment. The ackGasParams parameter includes the gas limit and gas price required to execute the callback function on the source chain when the acknowledgment is received. The gas limit depends on the complexity of the callback function, and the gas price depends on the source chain congestion."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"struct AckGasParams {\n    uint64 gasLimit;\n    uint64 gasPrice;\n}\n")),(0,r.kt)("p",null,"If the user does not want to handle the acknowledgment, i.e., the ackType is ",(0,r.kt)("strong",{parentName:"p"},"NO_ACK"),", then the gas limit and gas price for ackGasParams should be zero."),(0,r.kt)("h3",{id:"4-destinationchainparams"},"4. destinationChainParams"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"struct DestinationChainParams {\n    uint64 gasLimit;\n    uint64 gasPrice;\n    uint64 destChainType;\n    string destChainId;\n}\n")),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"gasLimit:")," Gas limit required to execute the cross-chain request on the destination chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"gasPrice:")," Gas price to be passed on the destination chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"destChainType:")," This represents the type of chain. The values for chain types can be found ",(0,r.kt)("a",{parentName:"li",href:"./chainTypes"},"here"),"."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"destChainId:")," Chain ID of the destination chain in string format.")),(0,r.kt)("h3",{id:"5-contractcalls"},"5. contractCalls"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre"},"struct ContractCalls {\n    bytes[] payloads;\n    bytes[] destContractAddresses;\n}\n")),(0,r.kt)("p",null,"The contractCalls parameter includes an array of payloads and contract addresses to be sent to the destination chain. All the payloads will be sent to the respective contract addresses as specified in the arrays.  The payload can include anything, i.e., you can pass whatever you want in this payload from the source chain and handle that payload on the destination chain."),(0,r.kt)("p",null,"To convert contract addresses to bytes and bytes to addresses, you can use the following functions:"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"// Function to convert address to bytes\nfunction toBytes(address a) public pure returns (bytes memory b){\n    assembly {\n        let m := mload(0x40)\n        a := and(a, 0xFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF)\n        mstore(add(m, 20), xor(0x140000000000000000000000000000000000000000, a))\n        mstore(0x40, add(m, 52))\n        b := m\n    }\n}\n\n// Function to convert bytes to address\nfunction toAddress(\n  bytes memory _bytes\n) public pure returns (address contractAddress) {\n  bytes20 srcTokenAddress;\n  assembly {\n    srcTokenAddress := mload(add(_bytes, 0x20))\n  }\n  contractAddress = address(srcTokenAddress);\n}\n")))}d.isMDXComponent=!0}}]);