---
title: Fetch data using JS
sidebar_position: 2
---

For all the mentioned query examples in the previous section, you can also fetch the data using JS. Below is a code snippet on how data can be fetched using JS.

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

Let’s assume you want to get the data for latest blocks. Here’s how you can define the variables.

```jsx
var API_URL = 'https://devnet-explorer-api.routerprotocol.com/gql/query';

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

The queryTag parameter is nothing but the query which was shared in the examples for querying data on GQL UI. So you can reuse the same queries to create your JS code.

To read the response you can use the below code snippet.

```jsx
console.log(response.data.data.paginatedBlock.totalRecords);
console.log(response.data.data.paginatedBlock.blocks[0].hash);
```

In this way, you can read the data from our explorer using JS as well.