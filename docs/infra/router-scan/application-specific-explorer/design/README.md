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
	
	public async getLatestTransactions(limit:number, offset:number){
	// Fetch latest txn related to the contract related to the application contract
	}

	public async getTransactionByHash(transactionHash:string){
	//Fetch a particular txn with txn hash
	}

	public async getLatestInbounds(limit:number, offset:number){
	//Fetch latest inbound txns related to application contract 
	}
	
	public async getFilteredInbounds(searchTerm: String, limit: Number = 10, offset: Number = 1){
	// Fetch list of inbound transactions filtered based on sourceTxHash and sourceSender
	}
	
	public async getLatestOutbounds(limit:number, offset:number){
	//Fetch latest outbound txns related to application contract 
	}
	
	public async getFilteredOutbounds(destinationChainType: String,destinationChainId: String, chainId:ChainIdType, chainType:ChainTypeType){
	// Fetch list of outbound transactions filtered based on destinationChainType and destinationChainId
	}
}
```
