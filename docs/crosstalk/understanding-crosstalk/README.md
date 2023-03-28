# Understanding CrossTalk

## High Level Architecture
Below is a high level architecture diagram for Router CrossTalk.

<center><img src={require('../../../src/images/RouterCrossTalk.png').default} alt="Router CrossTalk Architecture" style={{width: "100%", marginBottom: 12}}/></center>


## Understanding CrossTalk Functions
Router’s Gateway contracts have a function named **`requestToDest`** that facilitates the transmission of a cross-chain message. Whenever users want to execute a cross-chain request, they can call this function by passing the payload to be transferred from the source to the destination chain along with the required parameters.

In addition to calling the aforementioned function, CrossTalk users will also have to implement three functions on their contracts:
1. To handle a cross-chain request on the destination chain, users are required to include a **`handleRequestFromSource`** function on their destination chain contracts.
2. To process the acknowledgment of their requests on the source chain, user will have to implement a **`handleCrossTalkAck`** function on their source chain contracts.
3. To set the address of the fee payer on the router chain from which the cross-chain fee will be deducted, user will have to implement **`setDappMetadata`** function on their source chain contracts.
