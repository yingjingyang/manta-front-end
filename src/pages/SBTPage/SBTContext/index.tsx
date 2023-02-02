import { Gender } from 'face-api.js';
import {
  createContext,
  ReactElement,
  useContext,
  useMemo,
  useState
} from 'react';

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
  themeGender: Gender;
  setThemeGender: (themeGerder: Gender) => void;
};

const SBTContext = createContext<SBTContextValue | null>(null);

export const SBTContextProvider = (props: { children: ReactElement }) => {
  const [currentStep, setCurrentStep] = useState(Step.Home);
  const [imgList, setImgList] = useState([] as Array<UploadFile>);
  const [checkedThemeItems, toggleCheckedThemeItem] = useState<
    Map<string, ThemeItem>
  >(new Map<string, ThemeItem>());
  const [themeGender, setThemeGender] = useState<Gender>(Gender.MALE);

  const value: SBTContextValue = useMemo(() => {
    return {
      currentStep,
      setCurrentStep,
      imgList,
      setImgList,
      checkedThemeItems,
      toggleCheckedThemeItem,
      themeGender,
      setThemeGender
    };
  }, [checkedThemeItems, currentStep, imgList, themeGender]);

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
