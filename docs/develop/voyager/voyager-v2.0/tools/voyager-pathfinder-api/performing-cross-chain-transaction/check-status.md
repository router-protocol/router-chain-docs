---
title: Check the Status
sidebar_position: 4
---

After executing a cross-chain transaction, you can also check its status by querying the following API:

:::info
You can find the API information [**here**](../../../../../../api/?v=PATHFINDER).
:::


```jsx
import axios from "axios"

const STATS_API_URL = "https://api.voyager-explorer.routerprotocol.com/graphql"

// calling the status api using axios
const fetchStatus = async () => {
    const pathUrl = `${STATS_API_URL}`

    const statusResponse = await axios.post('https://api.voyager-explorer.routerprotocol.com/graphql', {
    query: `query($filter: TransactionFilterInput, $where_or: TransactionWhereInput, $isCrossChain: Boolean,$limit: Int, $offset: Int, $sortBy: TransactionSortInput) {
        transactions(filter: $filter, where_or: $where_or, isCrossChain: $isCrossChain, limit: $limit, offset: $offset, sortBy: $sortBy) {
        limit
        page
        total
        data {
            src_tx_hash
            dest_tx_hash
            status
            sender_address
            recipient_address
        }
        }
    }`,
    variables: {
        where_or: {
        src_tx_hash: '<source-tx-hash>'
        }
    }
    })
    .then(function (response) {
        console.log(response.data);
    })
    .catch(function (error) {
        console.error(error);
    });

}

const main = async () => {

    await fetchStatus();
}

main()
```