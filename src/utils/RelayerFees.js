import React, { useState, useEffect } from 'react';
import axios from 'axios';

const RelayerApiData = ({ relayerApiData }) => {
  const [responseData, setResponseData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const dataPromises = relayerApiData.map(({ apiUrl }) => axios.get(apiUrl));
      const responses = await Promise.all(dataPromises);

      const parsedData = [];
      responses.forEach((response, index) => {
        const { networkType } = relayerApiData[index];
        const parsedResponse = parseResponseData(response.data.params, networkType);
        parsedData.push(...parsedResponse);
      });

      setResponseData(parsedData);
    } catch (error) {
      console.log(error);
    }
  };

  const parseResponseData = (data, networkType) => {
    let parsedData = [];
    parsedData = [
      {
        inboundGasPrice: data.inboundGasPrice,
        minimumRelayerFees: data.minimumRelayerFees/10**18,
        networkType: networkType,
      },
    ];

    return parsedData;
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th style={{ fontWeight: 'bold' }}>Network Type</th>
            <th style={{ fontWeight: 'bold' }}>Min. Relayer Fees</th>
          </tr>
        </thead>
        <tbody>
          {responseData.map((item, index) => (
            <tr key={index}>
              <td>{item.networkType}</td>
              <td>{item.minimumRelayerFees} Route</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RelayerApiData;
