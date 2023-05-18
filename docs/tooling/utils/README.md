---
title: Utilities
sidebar_position: 1
---

# Introduction

The guides on this page will provide the list of utilities available when building with Router.

| **Utility** | **Purpose** |	**Users** |
| -------- | -------- |  -------- |
| **sdk-go** | It’s a Golang library which provides various api’s to query state from Routerchain and also to submit tx to Routerchain. <br /> These api’s are for various modules like Crosstalk, Inbound, Outbound, Multichain, Valset etc. | 1. **dApps** built over Router chain.<br />2. Routerchain components like **Orchestrator, Relayer** will use this utility to interact with Router chain. <br />3. **Developers** to create tools for Router chain which need Golang support. |
| **sdk-ts** | To interact with Router chain from UI or node.js environment. Query data from chain, create, sign and broadcast transactions to the Router Chain. | 1. **dApps** built over Router chain.<br />2. Routerchain components like **Orchestrator, Relayer** will use this utility to interact with Router chain. <br />3. **Developers** to create tools for Router chain which need JS/TS support. |
| **Router wasm bindings** | A rust crate which needs to be added as a dependency in router chain dApp to have cross-chain support. | 1. **dApps** built on Router chain. <br /> 2. **dApps** building cross-chain using middleware capabilities. |
