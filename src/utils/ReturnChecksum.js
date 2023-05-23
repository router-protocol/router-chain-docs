import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';


  

const APIData = () => {
    const [checksum, setChecksum] = useState([]);

    useEffect(() => {
        calculateSHA256();
    }, []);


    async function calculateSHA256() {
        let rawUrl = 'https://raw.githubusercontent.com/router-protocol/validator-onboard/feat/add_validator_health_checks/validator_onboard.py'
        const response = await fetch(rawUrl);
        const buffer = await response.arrayBuffer();
        const data = new Uint8Array(buffer);
        const wordArray = CryptoJS.lib.WordArray.create(data);
        const sha256sum = CryptoJS.SHA256(wordArray).toString();
        setChecksum(sha256sum)
      }

    return (
        <div>
            <b>SHA256 Checksum:</b> <code>{checksum}</code>
        </div>
    );
};

export default APIData;
