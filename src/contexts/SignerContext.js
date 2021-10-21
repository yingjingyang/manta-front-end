import React, { createContext, useState, useEffect, useContext } from 'react';
import SignerClient from 'api/SignerClient';
import { useSubstrate } from 'contexts/SubstrateContext';
import SignerParamGen from 'api/SignerParamGen';

const SignerContext = createContext();

export const SignerContextProvider = (props) => {
  const { api } = useSubstrate();

  const [signerClient, setSignerClient] = useState(null);
  const [signerParamGen, setSignerParamGen] = useState(null);
  const [signerIsConnected, setSignerIsConnected] = useState(false);

  useEffect(() => {
    const initSignerClient = async () => {
      if (!api || !api.isConnected) {
        return;
      }
      await api.isReady;
      setSignerClient(new SignerClient(api));
      setSignerParamGen(new SignerParamGen(api));
    };
    initSignerClient();
  }, [api]);

  useEffect(() => {
    if (!signerClient) {
      return;
    }
    const checkSignerIsConnected = async () => {
      const signerIsConnected = await signerClient.checkSignerIsConnected();
      setSignerIsConnected(signerIsConnected);
    };
    const t = setInterval(checkSignerIsConnected, 30000);
    return () => clearInterval(t);
  }, []);

  return (
    <SignerContext.Provider
      value={{
        signerClient: signerClient,
        signerParamGen: signerParamGen,
        signerIsConnected: signerIsConnected,
      }}
    >
      {' '}
      {props.children}{' '}
    </SignerContext.Provider>
  );
};

export const useSigner = () => {
  return useContext(SignerContext);
};
