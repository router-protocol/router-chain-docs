# Usage 
How to use an application-specific explorer?

---
**Step 1)** Install the Router Chain SDK TS module into your JavaScript development environment by running the following command in your terminal:
```bash
npm install @routerprotocol/router-chain-sdk-ts
```
or if you prefer yarn, use:
```bash
yarn add @routerprotocol/router-chain-sdk-ts
```
**Step 2)** Once installed, you can import the module into your code and use it in the following way:
```javascript
import { RouterExplorer } from '@routerprotocol/router-chain-sdk-ts';

// initialize explorer with your contract address
const explorer = new RouterExplorer("devnet","router1r22k3my03clkws8phjhfcc3ny45p939hwkh0f05wjyl27a3y8cwsv3h372")

//To get the latest transaction related to the application contract
const latestTransactions = await explorer.getLatestTransactions([startEpochTimestamp, endEpochTimstamp],10,1)
// limit and ofset mandatory....timstamps not necessary - can pass an empty array


// to get transaction by its hash
const transaction = await explorer.getTransactionByHash("4716AB828DBE03896D52AE3B85941FC59237B24AFB02C3925771EC811346E54B")

// to get the latest cross-chain transactions events related to the application contract
const latestTransactions = await explorer.getLatestCrosschains([startEpochTimestamp, endEpochTimstamp], limit,offset)
// limit and offset mandatory....timestamps not necessary - can pass an empty array

// to get filtered cross-chain transactions events based on the search term, which can be either sender's address or source transaction hash related to the application contract
const filteredInbounds = await explorer.getCrosschainBySearch('0xde23c5ffc7b045b48f0b85ada2c518d213d9e24f',10,1)

// only search term is mandatory
// optional: source chain Id, destination chain Id, and timeRange
// by default 10 and 1 in limit and offset (they are actually not mandatory)
```
// optional 