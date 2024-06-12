import React, { createContext, useContext, useEffect, useState } from 'react';
import { publicRequest } from '../requestMethods';
import LoadingPage from '../components/LoadingPage';

const BackendContext = createContext();

export const useBackend = () => {
  return useContext(BackendContext);
};

export const BackendProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      try {
        await publicRequest.get('/users/ping');
        setIsConnected(true);
      } catch (error) {
        console.error("Backend connection failed:", error);
        setIsConnected(false);
      }
    };

    checkConnection();
  }, []);

  return (
    <BackendContext.Provider value={{ isConnected }}>
      {isConnected ? children : <LoadingPage />}
    </BackendContext.Provider>
  );
};
