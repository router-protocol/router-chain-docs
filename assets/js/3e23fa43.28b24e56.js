"use strict";(self.webpackChunkosmosis_docs=self.webpackChunkosmosis_docs||[]).push([[7515],{3905:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>f});var o=n(67294);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function a(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,o)}return n}function s(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?a(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):a(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,o,r=function(e,t){if(null==e)return{};var n,o,r={},a=Object.keys(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(o=0;o<a.length;o++)n=a[o],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var c=o.createContext({}),l=function(e){var t=o.useContext(c),n=t;return e&&(n="function"==typeof e?e(t):s(s({},t),e)),n},u=function(e){var t=l(e.components);return o.createElement(c.Provider,{value:t},e.children)},d={inlineCode:"code",wrapper:function(e){var t=e.children;return o.createElement(o.Fragment,{},t)}},p=o.forwardRef((function(e,t){var n=e.components,r=e.mdxType,a=e.originalType,c=e.parentName,u=i(e,["components","mdxType","originalType","parentName"]),p=l(n),f=r,h=p["".concat(c,".").concat(f)]||p[f]||d[f]||a;return n?o.createElement(h,s(s({ref:t},u),{},{components:n})):o.createElement(h,s({ref:t},u))}));function f(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var a=n.length,s=new Array(a);s[0]=p;var i={};for(var c in t)hasOwnProperty.call(t,c)&&(i[c]=t[c]);i.originalType=e,i.mdxType="string"==typeof e?e:r,s[1]=i;for(var l=2;l<a;l++)s[l]=n[l];return o.createElement.apply(null,s)}return o.createElement.apply(null,n)}p.displayName="MDXCreateElement"},49268:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>c,contentTitle:()=>s,default:()=>d,frontMatter:()=>a,metadata:()=>i,toc:()=>l});var o=n(87462),r=(n(67294),n(3905));const a={title:"Token Transfer using Voyager Contracts",sidebar_position:1},s=void 0,i={unversionedId:"building-different-use-cases/token-transfers",id:"building-different-use-cases/token-transfers",title:"Token Transfer using Voyager Contracts",description:"As we discussed in the previous section, the Voyager allows us to transfer tokens as well as sequence token transfers and arbitrary instructions. In this section, we will explore how you can integrate the Voyager into your smart contracts for cross-chain token transfers.",source:"@site/docs/voyager/building-different-use-cases/token-transfers.md",sourceDirName:"building-different-use-cases",slug:"/building-different-use-cases/token-transfers",permalink:"/voyager/building-different-use-cases/token-transfers",draft:!1,editUrl:"https://github.com/router-protocol/docs/tree/main/docs/voyager/building-different-use-cases/token-transfers.md",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Token Transfer using Voyager Contracts",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Building different use-cases using Voyager",permalink:"/voyager/building-different-use-cases/"},next:{title:"Sequenced Transfers (tokens + instructions) using Voyager",permalink:"/voyager/building-different-use-cases/sequenced-transfers"}},c={},l=[{value:"Getting the data for the token transfer",id:"getting-the-data-for-the-token-transfer",level:3}],u={toc:l};function d(e){let{components:t,...n}=e;return(0,r.kt)("wrapper",(0,o.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,"As we discussed in the previous section, the Voyager allows us to transfer tokens as well as sequence token transfers and arbitrary instructions. In this section, we will explore how you can integrate the Voyager into your smart contracts for cross-chain token transfers."),(0,r.kt)("p",null,"The functions that can be called on the Voyager for cross-chain token transfers are:"),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},"depositReserveToken"),(0,r.kt)("li",{parentName:"ol"},"depositLPToken"),(0,r.kt)("li",{parentName:"ol"},"depositNonReserveToken")),(0,r.kt)("p",null,"While you can definitely integrate only one of these functionalities into your contracts according to your needs, we suggest you to use the call with selector method to be able to call any of these functions from your contracts."),(0,r.kt)("h3",{id:"getting-the-data-for-the-token-transfer"},"Getting the data for the token transfer"),(0,r.kt)("p",null,"We will provide an API for the developers which will provide you the calldata for the swap directly. You won\u2019t need to do anything, just call the API, get the data and call the Voyager using that data."),(0,r.kt)("p",null,"The params for the API call are: "),(0,r.kt)("ol",null,(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"fromTokenAddress:")," Address of the token to be transferred from the source chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"toTokenAddress:")," Address of the token to be received on the destination chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"fromChainId:")," Chain ID of the source chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"fromChainType:")," Chain type of the source chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"toChainId:")," Chain ID of the destination chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"toChainType:")," Chain type of the destination chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"isDestNative:")," Whether the required token on the destination chain is the native token for that chain."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"recipientAddress:")," Address of the recipient."),(0,r.kt)("li",{parentName:"ol"},(0,r.kt)("strong",{parentName:"li"},"isOnlyTokenTransfer:")," This is a boolean value indicating whether the goal is token transfer only or do we want to execute an instruction along with token transfer. In this case, since we just want to transfer tokens, we will send true in its place.")),(0,r.kt)("p",null,"The data received from the API response can directly be fed into the contract for execution."),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},'address public voyagerDepositHandler = "address of voyager deposit handler";\n// depositReserveToken(bool,bytes,bytes)\nbytes4 public constant DEPOSIT_RESERVE_SELECTOR = 0x3a139384;\n// depositNonReserveToken(bool,bytes,bytes)\nbytes4 public constant DEPOSIT_NON_RESERVE_SELECTOR = 0x0ae79779;\n// depositLPToken(bytes,bytes)\nbytes4 public constant DEPOSIT_LP_SELECTOR = 0xb78802d9;\n\nfunction callVoyager(bytes4 depositFunctionSelector, bytes calldata data) public {\n    bool success;\n    bytes memory data;\n    if(\n        depositFunctionSelector == DEPOSIT_RESERVE_SELECTOR ||\n        depositFunctionSelector == DEPOSIT_NON_RESERVE_SELECTOR\n    ) {\n        (bool isSourceNative, bytes memory swapData, bytes memory executeData) \n                = abi.decode(data, (bool, bytes, bytes));\n        (success, data) = voyagerDepositHandler.call(\n                abi.encodeWithSelector(\n                            depositFunctionSelector, \n                            isSourceNative, \n                            swapData, \n                            executeData\n                    )\n        );\n    } else if(depositFunctionSelector == DEPOSIT_LP_SELECTOR) {\n        (bytes memory swapData, bytes memory executeData) \n                = abi.decode(data, (bytes, bytes));\n        (success, data) = voyagerDepositHandler.call(\n                abi.encodeWithSelector(\n                            DEPOSIT_LP_SELECTOR, \n                            swapData, \n                            executeData\n                    )\n         );\n    \n    }\n\n    require(success == true, "Voyager deposit failed");\n} \n')),(0,r.kt)("admonition",{type:"info"},(0,r.kt)("p",{parentName:"admonition"},"\ud83d\udca1 In the case of Reserve Token deposit or Non-Reserve Token deposit, if the ",(0,r.kt)("code",null,"isSourceNative")," parameter is true, then you need to send native tokens also with the call using the value method of solidity.")),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-javascript"},"uint256 amountOfNativeTokens = abi.decode(swapData, (uint256));\n(success, data) = voyagerDepositHandler.call{value: amountOfNativeTokens}(\n                abi.encodeWithSelector(\n                            depositFunctionSelector, \n                            isSourceNative, \n                            swapData, \n                            executeData\n                    )\n        );\n")),(0,r.kt)("admonition",{type:"caution"},(0,r.kt)("p",{parentName:"admonition"},"The Voyager deducts tokens to be transferred from the contract or the user which called the Voyager\u2019s deposit function. Hence, in case your contract is the one calling the deposit function then before calling the deposit function on the Deposit Handler please make sure to -"),(0,r.kt)("ol",{parentName:"admonition"},(0,r.kt)("li",{parentName:"ol"},"Transfer the funds from user\u2019s wallet to your contract "),(0,r.kt)("li",{parentName:"ol"},"Approve the Voyager Deposit Handler contract from your contract to deduct those tokens from your contract"))))}d.isMDXComponent=!0}}]);