"use client";
import React, { ReactElement, createContext, useContext, useState } from 'react';


type GlobalPropContextType = {
    jwt: string,
    setJwt: React.Dispatch<React.SetStateAction<string>>
};

const GlobalPropContext = createContext(null as unknown as GlobalPropContextType);

export const GlobalPropProvider = ({ children }: {children: ReactElement}) => {
  const [jwt, setJwt] = useState('');

  return (
    <GlobalPropContext.Provider value={{ jwt, setJwt }}>
      {children}
    </GlobalPropContext.Provider>
  );
};

export const useGlobalProp = () => useContext(GlobalPropContext);
