import React, { useEffect, useState } from 'react';
import axios from 'axios';

const APIData = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('https://lcd.testnet.routerchain.dev/router-protocol/router-chain/multichain/chain_config');
      setData(response.data.chainConfig);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Chain ID</th>
            <th>Chain Name</th>
            <th>Gateway Contract Address</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.chainId}>
              <td>{item.chainId}</td>
              <td>{item.chainName}</td>
              <td>{item.gatewayContractAddress}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default APIData;
