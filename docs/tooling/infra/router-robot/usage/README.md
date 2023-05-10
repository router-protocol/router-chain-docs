# Usage 
How to use Router Robot?

---
To leverage the capabilities of the Router Robot framework, you can use the `router-robot` CLI.

### Installing the Latest Release
```bash
go install github.com/router-protocol/router-robot@latest
```

## Generate Code
Generate a [GoLang](https://go.dev/) boilerplate code for cross-chain testing through Router Chain.

`router-robot codegen --project-name <project name>`

- **Directory structure**
    
    ![Here, `helloworld` is your project-name.](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/1fbc3473-afde-4c8a-ace3-7247cbfc4449/Screenshot_2023-02-17_at_1.05.01_AM.png)
    
    Here, `helloworld` is your project-name.
    

Starting point of the project is `robot_suite_test.go`

## Testing

You can write test cases with the help of [Ginkgo framework](https://github.com/onsi/ginkgo).

Ginkgo is a popular BDD-style testing framework for the Go programming language. Here are some common CLI commands that you can use to run tests with Ginkgo:

1. `ginkgo`: This command runs all the tests in the current directory and its subdirectories. By default, Ginkgo looks for test files with the suffix `_test.go` and executes all the tests in those files.
2. `ginkgo -r`: This command recursively runs all the tests in the current directory and its subdirectories.
    
    Please refer to Ginkgo [docs](https://pkg.go.dev/github.com/onsi/ginkgo/ginkgo) for more commands.
    
### Steps to setup cross-chain testing:

1. Generate boilerplate code
```bash
go install github.com/router-protocol/router-robot@latest
``` 
2. Add private keys in `networkconfig.json` (This file is added in .gitignore)
3. Add artifacts for Router chain and other third party chains.
    1. For Router chain: Get the artifacts (.wasm files) generated during contract deployment on Router chain.
    2. For EVM chain: Generate artifacts.
    Copy these artifacts into `contract-wrapper` folder
        
4. Write your test cases with Ginkgo testing framework and test. 
Add test cases in `robot_test.go` or create new files suffixed with `_test.go`.
5. Run `go build` command to build the project. Then use Ginkgo commands to run test cases.
6. To track any inbound or outbound request you can use:
`TrackInboundRequest()`, `TrackOutboundRequest()` methods provided via Robot instance.

<aside>
⭐ Make sure you have deployed your contracts on required chains.
You can use these deployed contracts’ addresses during testing.

</aside>
    

## Track a Transaction

Provide a transaction hash to track its status from source chain.

`router-robot track --chainId <source chain id> --chainType <source chain type> --txhash <source transaction hash>`

Here, 

`chainId`: source chain ID

`chainType`: source chain type

`txHash`: source tx hash

## Logging and debugging

For adding logs [logrus](https://pkg.go.dev/github.com/sirupsen/logrus#section-readme) library is configured inside router-robot itself.

You can use `Logger` via Robot instance, initialized in `robot_suite_test.go`

```go
Logger.Info(”This is an information”)

Logger.Warn(”This is a warning”)

Logger.Fatal(”Fatal error occured”)
```

## Example

Sample repository created with router-robot tool can be found here.

[https://github.com/router-protocol/Sample-cross-chain-tests](https://github.com/router-protocol/Sample-cross-chain-tests)