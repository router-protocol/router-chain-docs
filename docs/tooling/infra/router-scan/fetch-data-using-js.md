---
title: Fetch data using JS
sidebar_position: 2
---

To fetch the data using JavaScript for all the query examples mentioned in the previous section, the following code snippet demonstrates how it can be achieved.

```jsx
const response = await axios.post(
      API_URL,
      {
        query: queryTag,
        variables: options,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
```

Suppose there is a need to obtain data for the latest blocks. Here is how one can define the variables.

```jsx
var API_URL = 'https://explorer-api.testnet.routerchain.dev/gql/query';

var queryTag = `query getLatestBlocks($limit: Int!, $offset: Int!) {
    paginatedBlock(sortBy:{_id:desc},limit:$limit,offset:$offset){
        totalRecords
        blocks{
        _id
        hash
        proposer
        txn_count
        timestamp
        transactions{
            _id
            height
            sender
            status
            receiver
            timeStamp
            gasWanted
            gasUsed
            fee
            event_logs
            success
        }
        }
    }
    }`

var options = {
    limit: 10,
    offset: 10
}
```

The queryTag parameter corresponds to the query shared in the examples for querying data on the GQL UI. Therefore, the same queries can be reused to create JavaScript code.

To read the response, one can utilize the below code snippet.

```jsx
console.log(response.data.data.paginatedBlock.totalRecords);
console.log(response.data.data.paginatedBlock.blocks[0].hash);
```

This approach allows for data retrieval from our explorer using JavaScript as well.