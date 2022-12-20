# Usage 
How to use Router Robot?

---
To leverage the capabilities of the Router Robot framework, you can use the `router-robot` CLI.

### Installing the Latest Release
```bash
go install github.com/router-protocol/router-robot@alpha15.0
```

### Generating a Template

**Step 1)** Create a config. json file with your application name.
```json
{
"appName": "testapp"
}
```

**Step 2)** Pass this config.json to the router-robot cli command to generate a template codebase wherein you can write your own test cases.
```bash
router-robot config --file=config.json
```
We are using a dedicated config for initialization since more parameters might be required while initializing a template in the future.
 
---

## Sample Test App

Enable the sample flag to generate a sample test application:
```bash
router-robot config --sample=true
```


### Process Flow for the Sample Test App



#### All test cases related to app are available in the following files:

-   `testapp_suite_test.go` - This file contains `BeforeSuite` where network configuration related to the test suite is bootstrapped. After the network config is created `InitializeHelloWorldApp` (available in `helloworld.go`) is called.

-   `helloworld_test.go` - Using this file, you can create `describe` test suites depending upon your test strategy. In this example, we created an inbound request and then call `TrackInboundRequest` function which is available in the router-robot library. Example usage:
```bash
testApp.TrackInboundRequest(testApp.HelloWorldApp.HelloWorldAppConfig.SourceChainType, testApp.HelloWorldApp.HelloWorldAppConfig.SourceChainID, txHash)
```
In the future, we will add integrate the tracking feature directly into the CLI which will allow users to track transaction status through different states on the Router chain using the following parameters:

-   `chainType` - Source chain type (EVM, Polkadot, etc.)

-   `chainID` - Source chain ID

-   `txHash` - Inbound txn hash on the Router chain

#### All the business logic is available in the following files:

-   `testapp.go` - This file has a function `NewTestApp(networkConfigPath string),` which takes a path to the network configuration file as input and then initializes context JSON values.

-   `helloworld.go` - This file contains all the necessary business logic to run the following functions:

    -   `DeployHelloWorldContract` - Deploys a contract on a given source chain (other than the Router chain)

    -   `DeployHelloWorldMiddlewareContract` - Deploys a middleware contract on the Router chain, which acts as an application-specific bridge contract between two third-party chains

    -   `SubmitHelloWorldInboundRequest`