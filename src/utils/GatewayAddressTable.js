import React, { useEffect, useState } from 'react';
import axios from 'axios';

const APIData = ({ apiData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const networkType = apiData[0].networkType;
      const contractType = apiData[0].contractType;
      const contractConfigPromise = axios.get(apiData[0].contractConfigUrl);
      const chainConfigPromise = axios.get(apiData[0].chainConfigUrl);
      
      const [contractConfigResponse, chainConfigResponse] = await Promise.all([contractConfigPromise, chainConfigPromise]);

      if (!contractConfigResponse || !contractConfigResponse.data || !chainConfigResponse || !chainConfigResponse.data) {
        console.log("API response is missing or in the incorrect format.");
        return;
      }

      // Extract the data from API responses
      const contractConfigData = contractConfigResponse.data.contractConfig;
      const chainConfigData = chainConfigResponse.data.chainConfig;
      

      const combinedData = contractConfigData.map((item1) => {
        const matchingItem2 = chainConfigData.find((item2) => item2.chainId === item1.chainId);
        if (matchingItem2) {
          return {
            ...item1,
            ...matchingItem2,
            networkType: networkType,
          };
        }
        return item1;
      });

      const filteredData = combinedData.filter(item => item.contractType === contractType && item.contract_enabled === true)
      setData(filteredData);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={{ fontWeight: 'bold' }}>Network Type</th>
            <th style={{ fontWeight: 'bold' }}>Chain ID</th>
            <th style={{ fontWeight: 'bold' }}>Chain Name</th>
            <th style={{ fontWeight: 'bold' }}>Gateway Contract Address</th>
            {/* <th style={{ fontWeight: 'bold' }}>Fee Payer Address</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.chainId + '-' + item.contractType}>
              <td>{item.networkType}</td>
              <td>{item.chainId}</td>
              <td>{item.chainName}</td>
              <td>{item.contractAddress}</td>
              {/* <td>Your Address</td> */}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default APIData;
