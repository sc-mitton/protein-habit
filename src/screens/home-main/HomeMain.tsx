import { useEffect } from "react";
import { Platform, ScrollView, StyleSheet, Dimensions } from "react-native";
import dayjs from "dayjs";

import { Box } from "@components";
import { useAppSelector } from "@store/hooks";
import { HomeScreenProps } from "@types";
import {
  selectUserPurchaseStatus,
  selectUserInception,
} from "@store/slices/userSlice";
import { baseIap } from "@constants/iaps";
import { HomeMainProvider } from "./tabsContext";
import Tabs from "./Tabs";
import DailyTotal from "./DailyTotal";
import WelcomeMessage from "./WelcomeMessage";
import TabButtons from "./TabButtons";

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
  },
});

const HomeMain = (props: HomeScreenProps<"Main">) => {
  const purchaseStatus = useAppSelector(selectUserPurchaseStatus);
  const inceptionDate = useAppSelector(selectUserInception);

  useEffect(() => {
    if (
      purchaseStatus === null &&
      dayjs().diff(dayjs(inceptionDate), "day") > 0
    ) {
      props.navigation.navigate("PurchaseModal", { iap: baseIap });
    }
  }, [purchaseStatus]);

  return (
    <HomeMainProvider>
      <Box
        flex={1}
        backgroundColor="mainBackground"
        paddingTop={Platform.OS === "ios" ? "statusBar" : "l"}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          <WelcomeMessage />
          <DailyTotal {...props} />
          <TabButtons />
          <Tabs />
        </ScrollView>
      </Box>
    </HomeMainProvider>
  );
};

export default HomeMain;
