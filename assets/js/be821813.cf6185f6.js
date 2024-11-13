"use strict";(self.webpackChunkrouter_docs=self.webpackChunkrouter_docs||[]).push([[3986],{3905:(e,n,t)=>{t.d(n,{Zo:()=>s,kt:()=>m});var r=t(67294);function a(e,n,t){return n in e?Object.defineProperty(e,n,{value:t,enumerable:!0,configurable:!0,writable:!0}):e[n]=t,e}function o(e,n){var t=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);n&&(r=r.filter((function(n){return Object.getOwnPropertyDescriptor(e,n).enumerable}))),t.push.apply(t,r)}return t}function i(e){for(var n=1;n<arguments.length;n++){var t=null!=arguments[n]?arguments[n]:{};n%2?o(Object(t),!0).forEach((function(n){a(e,n,t[n])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(t)):o(Object(t)).forEach((function(n){Object.defineProperty(e,n,Object.getOwnPropertyDescriptor(t,n))}))}return e}function l(e,n){if(null==e)return{};var t,r,a=function(e,n){if(null==e)return{};var t,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||(a[t]=e[t]);return a}(e,n);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)t=o[r],n.indexOf(t)>=0||Object.prototype.propertyIsEnumerable.call(e,t)&&(a[t]=e[t])}return a}var u=r.createContext({}),c=function(e){var n=r.useContext(u),t=n;return e&&(t="function"==typeof e?e(n):i(i({},n),e)),t},s=function(e){var n=c(e.components);return r.createElement(u.Provider,{value:n},e.children)},d={inlineCode:"code",wrapper:function(e){var n=e.children;return r.createElement(r.Fragment,{},n)}},p=r.forwardRef((function(e,n){var t=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),p=c(t),m=a,f=p["".concat(u,".").concat(m)]||p[m]||d[m]||o;return t?r.createElement(f,i(i({ref:n},s),{},{components:t})):r.createElement(f,i({ref:n},s))}));function m(e,n){var t=arguments,a=n&&n.mdxType;if("string"==typeof e||a){var o=t.length,i=new Array(o);i[0]=p;var l={};for(var u in n)hasOwnProperty.call(n,u)&&(l[u]=n[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var c=2;c<o;c++)i[c]=t[c];return r.createElement.apply(null,i)}return r.createElement.apply(null,t)}p.displayName="MDXCreateElement"},40371:(e,n,t)=>{t.r(n),t.d(n,{assets:()=>u,contentTitle:()=>i,default:()=>d,frontMatter:()=>o,metadata:()=>l,toc:()=>c});var r=t(87462),a=(t(67294),t(3905));const o={},i="On Mainnet",l={unversionedId:"running-a-validator/on-mainnet/README",id:"running-a-validator/on-mainnet/README",title:"On Mainnet",description:"Hardware Requirements",source:"@site/docs/validators/running-a-validator/on-mainnet/README.md",sourceDirName:"running-a-validator/on-mainnet",slug:"/running-a-validator/on-mainnet/",permalink:"/validators/running-a-validator/on-mainnet/",draft:!1,editUrl:"https://github.com/router-protocol/docs/tree/main/docs/validators/running-a-validator/on-mainnet/README.md",tags:[],version:"current",frontMatter:{},sidebar:"tutorialSidebar",previous:{title:"Step 3) Configure and Run an Orchestrator Instance",permalink:"/validators/running-a-validator/on-devnet/configure-and-run-an-orchestrator-instance"},next:{title:"Step 1) Run a Sentry Node",permalink:"/validators/running-a-validator/on-mainnet/run-a-sentry-node"}},u={},c=[{value:"Hardware Requirements",id:"hardware-requirements",level:2},{value:"Running a Validator on Router Mainnet",id:"running-a-validator-on-router-mainnet",level:2}],s={toc:c};function d(e){let{components:n,...t}=e;return(0,a.kt)("wrapper",(0,r.Z)({},s,t,{components:n,mdxType:"MDXLayout"}),(0,a.kt)("h1",{id:"on-mainnet"},"On Mainnet"),(0,a.kt)("h2",{id:"hardware-requirements"},"Hardware Requirements"),(0,a.kt)("p",null,"Validators should be able to host one or more data center locations with redundant power, networking, firewalls, HSMs, and servers. The initial minimum recommended hardware specifications are specified below. These may change as network usage increases."),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-jsx"},"-> 6+ vCPU x64 2.0+ GHz\n-> 16 to 32+ GB RAM\n-> 1TB+ SSD\n")),(0,a.kt)("admonition",{type:"tip"},(0,a.kt)("p",{parentName:"admonition"},"To check you system configuration, run the following command on your terminal/command prompt:"),(0,a.kt)("ul",{parentName:"admonition"},(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("strong",{parentName:"li"},"On Linux:")," ",(0,a.kt)("inlineCode",{parentName:"li"},"lshw")," or ",(0,a.kt)("inlineCode",{parentName:"li"},"cat /proc/cpuinfo")))),(0,a.kt)("h2",{id:"running-a-validator-on-router-mainnet"},"Running a Validator on Router Mainnet"),(0,a.kt)("p",null,"To run a validator on Router chain's mainnet, follow these 3 steps:"),(0,a.kt)("ul",null,(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"./on-mainnet/run-a-sentry-node"},"Run a Sentry Node on Mainnet")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"./on-mainnet/setup-a-validator-account"},"Setup a Validator Account")),(0,a.kt)("li",{parentName:"ul"},(0,a.kt)("a",{parentName:"li",href:"./on-mainnet/configure-and-run-an-orchestrator-instance"},"Configure and Run an Orchestrator Instance"))))}d.isMDXComponent=!0}}]);