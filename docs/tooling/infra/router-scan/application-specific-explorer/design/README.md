# Design
Structure of an application-specific explorer

---
The following code defines the main class that has a set of functions that will allow applications to get data related to their queries directly.

```javascript
const gqlApis = {
	"testnet":"https://www.routerexplorer.com/gql/testnet",
	"devnet":"https://www.routerexplorer.com/gql/devnet",
}

class RouterExplorer{
  public readonly chainEnvironment: string
  public readonly applicationAddress: string

  constructor (chainEnvironment:string,applicationAddress:string) {
      this.chainEnvironment = chainEnvironment;
      this.applicationAddress = applicationAddress;
  }
	
	public async getLatestTransactions(timeRange: number[], limit:number, offset:number){
	// Fetch latest txns
	}

	public async getTransactionByHash(transactionHash:string){
	//Fetch a particular txn with txn hash
	}
	
	public async getLatestCrosschains(timeRange: number[], limit:number, offset:number){
	//Fetch latest cross-chain txns
	}
	
	public async getCrosschainBySearch(searchTerm: String, srcChainIds: string[], dstChainIds: string[], timeRange: number[], limit: Number, offset: Number){
	// Fetch list of cross-chain txns filtered based on multiple params, only searchTerm is mandatory
	}

	public async getOutboundsForInbound(inboundId: String) {
	//Fetch outbound transactions related to an inbound
	}
}
```
