import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ContractData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await axios.get("https://api-beta.pathfinder.routerprotocol.com/api/contracts");   
            console.log(result)      
            const resultArray = Object.keys(result.data).map(chainId => {
                return { chainId, ...result.data[chainId] };
            });
            console.log()
            setData(resultArray);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <table>
                <thead>
                    <tr>
                        <th style={{ fontWeight: 'bold' }}>Chain ID</th>
                        {/* <th style={{ fontWeight: 'bold' }}>Chain Name</th> */}
                        <th style={{ fontWeight: 'bold' }}>Gateway Contract Address</th>
                        <th style={{ fontWeight: 'bold' }}>AssetBridge Contract Address</th>
                        <th style={{ fontWeight: 'bold' }}>DexSpan Contract Address</th>
                        {/* <th style={{ fontWeight: 'bold' }}>Fee Payer Address</th> */}
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item.chainId}>
                            <td>{item.chainId}</td>
                            {/* <td>{item.chainName}</td> */}
                            <td>{item.forwarderBridge ? item.forwarderBridge : "Not present"}</td>
                            <td>{item.mintBurnBridge  ? item.mintBurnBridge : "Not present"}</td>
                            <td>{item.dexSpan ? item.dexSpan : "Not present" }</td>
                            {/* <td>Your Address</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ContractData;
