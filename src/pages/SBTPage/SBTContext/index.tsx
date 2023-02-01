import {
  createContext,
  ReactElement,
  useContext,
  useMemo,
  useState,
  useCallback
} from 'react';
// @ts-ignore:next-line
import { MantaUtilities } from 'manta.js-kg-dev';
import BN from 'bn.js';

import Balance from 'types/Balance';
import { useSubstrate } from 'contexts/substrateContext';
import AssetType from 'types/AssetType';

export enum Step {
  Home,
  Upload,
  Theme,
  Mint,
  Generating,
  Generated
}

export type ThemeItem = {
  name: string;
  img: string;
};

export type UploadFile = {
  file: File;
  metadata: string;
  proofId?: string;
};

type SBTContextValue = {
  currentStep: Step;
  setCurrentStep: (nextStep: Step) => void;
  imgList: Array<UploadFile>;
  setImgList: (imgList: Array<UploadFile>) => void;
  checkedThemeItems: Map<string, ThemeItem>;
  toggleCheckedThemeItem: (map: Map<string, ThemeItem>) => void;
  getPublicBalance: (
    address: string,
    assetType: AssetType
  ) => Promise<Balance | string>;
};

const SBTContext = createContext<SBTContextValue | null>(null);

export const SBTContextProvider = (props: { children: ReactElement }) => {
  const [currentStep, setCurrentStep] = useState(Step.Home);
  const [imgList, setImgList] = useState([] as Array<UploadFile>);
  const [checkedThemeItems, toggleCheckedThemeItem] = useState<
    Map<string, ThemeItem>
  >(new Map<string, ThemeItem>());

  const { api } = useSubstrate();

  const getPublicBalance = useCallback(
    async (address: string, assetType: AssetType) => {
      if (!api?.isConnected || !address) {
        return '-' as string;
      }

      const balanceRaw = await MantaUtilities.getPublicBalance(
        api,
        new BN(assetType.assetId),
        address
      );

      const balance = balanceRaw ? new Balance(assetType, balanceRaw) : '-';
      return balance;
    },
    [api]
  );

  const value: SBTContextValue = useMemo(() => {
    return {
      currentStep,
      setCurrentStep,
      imgList,
      setImgList,
      checkedThemeItems,
      toggleCheckedThemeItem,
      getPublicBalance
    };
  }, [checkedThemeItems, currentStep, getPublicBalance, imgList]);

  return (
    <SBTContext.Provider value={value}>{props.children}</SBTContext.Provider>
  );
};

export const useSBT = () => {
  const data = useContext(SBTContext);
  if (!data || !Object.keys(data)?.length) {
    throw new Error(
      'useSBT() can only be used inside of <SBTContext />, please declare it at a higher level.'
    );
  }
  return data;
};
