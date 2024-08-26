import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssetBridgeLiquidityData = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const result = await axios.get("https://api.poap-nft.routerprotocol.com/liquidity/asset-bridge");   
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
                        <th style={{ fontWeight: 'bold' }}>Chain Name</th>
                        <th style={{ fontWeight: 'bold' }}>Token</th>
                        <th style={{ fontWeight: 'bold' }}>Token Balance</th>
                    </tr>
                </thead>
                <tbody>
                    {data.filter((item) => parseFloat(item.balance) > 0)
                        .map((item) => (
                            <tr key={item.chainId}>
                                <td>{item.chainId}</td>
                                <td>{item.chain}</td>
                                <td>{item.tokenSymbol}</td>
                                <td>{parseFloat(item.balance) / Math.pow(10, item.tokenDecimal)}</td>
                            </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AssetBridgeLiquidityData;
