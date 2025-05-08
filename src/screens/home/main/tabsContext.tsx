import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  MutableRefObject,
} from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";

interface TabsContextType {
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  indicatorX: SharedValue<number>;
  indicatorWidth: SharedValue<number>;
  tabHeaderWidths: MutableRefObject<number[]>;
  lockPagerScroll: MutableRefObject<boolean>;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function HomeMainProvider({ children }: { children: ReactNode }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const tabHeaderWidths = useRef(new Array(2).fill(0));
  const lockPagerScroll = useRef(false);
  return (
    <TabsContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        indicatorX,
        indicatorWidth,
        tabHeaderWidths,
        lockPagerScroll,
      }}
    >
      {children}
    </TabsContext.Provider>
  );
}

export function useTabs() {
  const context = useContext(TabsContext);
  if (context === undefined) {
    throw new Error("useTabs must be used within a TabsProvider");
  }
  return context;
}
