import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";

import { BackDrop } from "@components";
import { HomeScreenProps } from "@types";
import Calendar from "./Calendar";

const Appearance = (props: HomeScreenProps<"Calendar">) => {
  const theme = useTheme();

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
      backdropComponent={() => <BackDrop blurIntensity={0} />}
    >
      <BottomSheetView>
        <Calendar />
      </BottomSheetView>
    </BottomSheet>
  );
};

export default Appearance;
