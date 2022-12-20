"use strict";(self.webpackChunkosmosis_docs=self.webpackChunkosmosis_docs||[]).push([[4220],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>y});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=n.createContext({}),c=function(e){var t=n.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(l.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},d=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(r),y=o,h=d["".concat(l,".").concat(y)]||d[y]||p[y]||a;return r?n.createElement(h,i(i({ref:t},u),{},{components:r})):n.createElement(h,i({ref:t},u))}));function y(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=d;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s.mdxType="string"==typeof e?e:o,i[1]=s;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}d.displayName="MDXCreateElement"},29113:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>s,toc:()=>c});var n=r(87462),o=(r(67294),r(3905));const a={title:"Introduction",sidebar_position:1},i="Relayers",s={unversionedId:"relaying/README",id:"relaying/README",title:"Introduction",description:"Basics about relayers on the Router chain",source:"@site/docs/router-core/relaying/README.mdx",sourceDirName:"relaying",slug:"/relaying/",permalink:"/router-core/relaying/",draft:!1,editUrl:"https://github.com/router-protocol/docs/tree/main/docs/router-core/relaying/README.mdx",tags:[],version:"current",sidebarPosition:1,frontMatter:{title:"Introduction",sidebar_position:1},sidebar:"tutorialSidebar",previous:{title:"Relayer",permalink:"/router-core/category/relayer"},next:{title:"Relayer Guide",permalink:"/router-core/relaying/relayer-guide"}},l={},c=[{value:"Functionalities",id:"functionalities",level:2}],u={toc:c};function p(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h1",{id:"relayers"},"Relayers"),(0,o.kt)("p",null,"Basics about relayers on the Router chain"),(0,o.kt)("p",null,"In the Router system, relayers are permissionless entities that relay executable proposals from the Router chain to a specific\ndestination chain. The Router chain has a set of relayers operated by various third parties, which distributes the\nresponsibility. In the set, each relayer listens to the Router chain and relays data to the\ndestination chains as and when required. These relayers also carry out subsequent actions based on the\nevents that have been transmitted."),(0,o.kt)("h2",{id:"functionalities"},"Functionalities"),(0,o.kt)("ol",null,(0,o.kt)("li",{parentName:"ol"},"The relayer will be able to submit outbound requests to the destination chain."),(0,o.kt)("li",{parentName:"ol"},"The relayer will be able to whitelist application bridge contract addresses and process only outbound requests originating from the whitelisted application bridge contract addresses."),(0,o.kt)("li",{parentName:"ol"},"The relayer will be able to submit a ValsetUpdate request to all the destination chains configured\non the multichain module."),(0,o.kt)("li",{parentName:"ol"},"The relayer will be able to secure the keys of various chain types - EVM, Cosmos, and Substrate,\namong others.")))}p.isMDXComponent=!0}}]);