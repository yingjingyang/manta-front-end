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
  Generating,
  Generated,
  Mint
}
export type ThemeItem = {
  name: string;
  img: string;
};

type SBTContextValue = {
  currentStep: Step;
  setCurrentStep: (nextStep: Step) => void;
  imgList: Array<File>;
  setImgList: (imgList: Array<File>) => void;
  checkedThemeItems: Map<string, ThemeItem>;
  toggleCheckedThemeItem: (map: Map<string, ThemeItem>) => void;
  mintSet: Set<File>;
  setMintSet: (set: Set<File>) => void;
};

const SBTContext = createContext<SBTContextValue | null>(null);

export const SBTContextProvider = (props: { children: ReactElement }) => {
  const [currentStep, setCurrentStep] = useState(Step.Home);
  const [imgList, setImgList] = useState([] as Array<File>);
  const [checkedThemeItems, toggleCheckedThemeItem] = useState<
    Map<string, ThemeItem>
  >(new Map<string, ThemeItem>());
  const [mintSet, setMintSet] = useState<Set<File>>(new Set());

  const value: SBTContextValue = useMemo(() => {
    return {
      currentStep,
      setCurrentStep,
      imgList,
      setImgList,
      checkedThemeItems,
      toggleCheckedThemeItem,
      mintSet,
      setMintSet
    };
  }, [currentStep, imgList, checkedThemeItems, mintSet]);

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
