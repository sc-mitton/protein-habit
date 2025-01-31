import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { StyleSheet, Dimensions, LayoutChangeEvent } from "react-native";
import { Box } from "@components";
import { useTheme } from "@shopify/restyle";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectFont } from "@store/slices/uiSlice";
import { selectDailyProteinTarget } from "@store/slices/proteinSlice";
import { RootScreenProps } from "@types";

const Appearance = (props: RootScreenProps<"EditDailyGoal">) => {
  const theme = useTheme();
  const dailyProteinTarget = useAppSelector(selectDailyProteinTarget);
  const selectedFont = useAppSelector(selectFont);
  const dispatch = useAppDispatch();

  return (
    <BottomSheet
      onClose={() => props.navigation.goBack()}
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.colors.mainBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.tertiaryText,
      }}
      backdropComponent={() => (
        <Animated.View
          exiting={FadeOut}
          entering={FadeIn}
          style={styles.overlay}
        >
          <Box
            style={StyleSheet.absoluteFillObject}
            opacity={0.5}
            backgroundColor="overlay"
            shadowOffset={{ width: 0, height: 4 }}
            shadowRadius={12}
            shadowOpacity={0.5}
          />
        </Animated.View>
      )}
    >
      <BottomSheetView>
        <Box></Box>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default Appearance;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: -Dimensions.get("window").width,
    left: 0,
    right: 0,
    bottom: -Dimensions.get("window").width,
  },
});
