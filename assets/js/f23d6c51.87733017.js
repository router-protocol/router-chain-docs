"use strict";(self.webpackChunkosmosis_docs=self.webpackChunkosmosis_docs||[]).push([[7528],{3905:(e,t,r)=>{r.d(t,{Zo:()=>u,kt:()=>f});var n=r(67294);function o(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){o(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},a=Object.keys(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);for(n=0;n<a.length;n++)r=a[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var s=n.createContext({}),c=function(e){var t=n.useContext(s),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},u=function(e){var t=c(e.components);return n.createElement(s.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},m=n.forwardRef((function(e,t){var r=e.components,o=e.mdxType,a=e.originalType,s=e.parentName,u=l(e,["components","mdxType","originalType","parentName"]),m=c(r),f=o,d=m["".concat(s,".").concat(f)]||m[f]||p[f]||a;return r?n.createElement(d,i(i({ref:t},u),{},{components:r})):n.createElement(d,i({ref:t},u))}));function f(e,t){var r=arguments,o=t&&t.mdxType;if("string"==typeof e||o){var a=r.length,i=new Array(a);i[0]=m;var l={};for(var s in t)hasOwnProperty.call(t,s)&&(l[s]=t[s]);l.originalType=e,l.mdxType="string"==typeof e?e:o,i[1]=l;for(var c=2;c<a;c++)i[c]=r[c];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}m.displayName="MDXCreateElement"},28359:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>s,contentTitle:()=>i,default:()=>p,frontMatter:()=>a,metadata:()=>l,toc:()=>c});var n=r(87462),o=(r(67294),r(3905));const a={title:"Run LocalRouter with Mainnet State",sidebar_position:3},i=void 0,l={unversionedId:"local-router-mainstate",id:"local-router-mainstate",title:"Run LocalRouter with Mainnet State",description:"LocalRouter with Mainnet State",source:"@site/docs/localrouter/local-router-mainstate.md",sourceDirName:".",slug:"/local-router-mainstate",permalink:"/localrouter/local-router-mainstate",draft:!1,editUrl:"https://github.com/router-protocol/docs/tree/main/docs/localrouter/local-router-mainstate.md",tags:[],version:"current",sidebarPosition:3,frontMatter:{title:"Run LocalRouter with Mainnet State",sidebar_position:3},sidebar:"tutorialSidebar",previous:{title:"Testing Local Changes",permalink:"/localrouter/test-local-changes"}},s={},c=[{value:"LocalRouter with Mainnet State",id:"localrouter-with-mainnet-state",level:2}],u={toc:c};function p(e){let{components:t,...r}=e;return(0,o.kt)("wrapper",(0,n.Z)({},u,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("h2",{id:"localrouter-with-mainnet-state"},"LocalRouter with Mainnet State"),(0,o.kt)("p",null,"Running LocalRouter with mainnet state is resource intensive and can take a bit of time. It is recommended to only use this method if you are testing a new feature that must be thoroughly tested before pushing to production."),(0,o.kt)("p",null,"A few things to note before getting started. The below method will only work if you are using the same version as mainnet. In other words, if mainnet is on v8.0.0 and you try to do this on a v9.0.0 tag or on main, you will run into an error when initializing the genesis. (yes, it is possible to create a state exported testnet on a upcoming release, but that is out of the scope of this tutorial)"))}p.isMDXComponent=!0}}]);