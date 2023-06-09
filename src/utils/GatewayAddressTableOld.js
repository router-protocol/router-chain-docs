import React, { useEffect, useState } from 'react';
import axios from 'axios';

const APIData = ({ apiData }) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataPromises = apiData.map(({ apiUrl }) => axios.get(apiUrl));
      const responses = await Promise.all(dataPromises);
      console.log(responses)
      const combinedData = [];
      responses.forEach((response, index) => {
        const { networkType } = apiData[index];
        const dataWithAdditionalColumn = response.data.contractConfig.map((item) => ({
          ...item,
          networkType: networkType,
        }));
        combinedData.push(...dataWithAdditionalColumn);
      });

      setData(combinedData);
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
            <th style={{ fontWeight: 'bold' }}>Gateway Contract Address</th>
            {/* <th style={{ fontWeight: 'bold' }}>Fee Payer Address</th> */}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.chainId}>
              <td>{item.networkType}</td>
              <td>{item.chainId}</td>
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
