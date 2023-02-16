import React from 'react';

let check = false;

// Default implementation, that you can customize
export default function Root({children}) {
    if(check==false){
        return <h1>not</h1>
    }
    else{
  return <>{children}</>;
    }
}

