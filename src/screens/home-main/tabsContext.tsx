import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useRef,
  MutableRefObject,
} from "react";
import { SharedValue, useSharedValue } from "react-native-reanimated";
import PagerView from "react-native-pager-view";

interface TabsContextType {
  selectedTab: number;
  setSelectedTab: (index: number) => void;
  pagerRef: React.RefObject<PagerView>;
  indicatorX: SharedValue<number>;
  indicatorWidth: SharedValue<number>;
  tabHeaderWidths: MutableRefObject<number[]>;
  delta: SharedValue<number>;
}

const TabsContext = createContext<TabsContextType | undefined>(undefined);

export function HomeMainProvider({ children }: { children: ReactNode }) {
  const [selectedTab, setSelectedTab] = useState(0);
  const pagerRef = useRef<PagerView>(null);
  const indicatorX = useSharedValue(0);
  const indicatorWidth = useSharedValue(0);
  const tabHeaderWidths = useRef(new Array(2).fill(0));
  const delta = useSharedValue(0);
  return (
    <TabsContext.Provider
      value={{
        selectedTab,
        setSelectedTab,
        pagerRef,
        indicatorX,
        indicatorWidth,
        tabHeaderWidths,
        delta,
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
