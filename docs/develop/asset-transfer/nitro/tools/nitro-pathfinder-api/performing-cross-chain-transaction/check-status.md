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

// calling the status api using axios
const fetchStatus = async (srcTxHash) => {

  const STATS_API_URL = "https://api.pf.testnet.routerprotocol.com/api"

  const config = {
    method: 'get',
    url:  STATS_API_URL +'/v2/status?srcTxHash=' + srcTxHash,
    headers: {}
  };

  axios(config)
    .then(function (response) {
      console.log(JSON.stringify(response.data?.transaction));
    })
    .catch(function (error) {
      console.log(error);
    });
}

const main = async () => {

  await fetchStatus();
}

main()
```