import { useEffect, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { InteractionManager, Alert, useColorScheme, Image } from "react-native";
import { ChevronRight } from "geist-native-icons";
import { Invert } from "react-native-color-matrix-image-filters";
import { useTheme } from "@shopify/restyle";
import {
  endConnection,
  getProducts,
  initConnection,
  requestPurchase,
  getPurchaseHistory,
  isProductIos,
  isProductAndroid,
  purchaseUpdatedListener,
  purchaseErrorListener,
} from "expo-iap";

import { HomeScreenProps } from "@types";
import { useAppDispatch } from "@store/hooks";
import { setPurchaseStatus } from "@store/slices/userSlice";
import { Box, Text, Button, Icon } from "@components";
import { baseSku, premiumSku } from "@constants/iaps";
import logo from "@assets/icon-tinted.png";

export default function Purchase(props: HomeScreenProps<"Purchase">) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [purchasable, setPurchasables] = useState<any>();
  const scheme = useColorScheme();

  useEffect(() => {
    const startUp = async () => {
      await initConnection();

      const purchaseHistory = await getPurchaseHistory();

      // If for some reason redux lost track of the purchase status,
      // restore it
      if (purchaseHistory.length > 0) {
        if (purchaseHistory.some((p: any) => p.productID === baseSku)) {
          dispatch(setPurchaseStatus("base"));
          props.navigation.goBack();
        } else if (
          purchaseHistory.some((p: any) => p.productID === premiumSku)
        ) {
          dispatch(setPurchaseStatus("premium"));
          props.navigation.goBack();
        }
      }

      const purchases = await getProducts([props.route.params.sku]);
      setPurchasables(purchases[0]);
    };

    startUp();
  }, []);

  const handlePurchase = () => {
    if (isProductIos(purchasable)) {
      requestPurchase({
        skus: [purchasable.id],
      });
    } else if (isProductAndroid(purchasable)) {
      requestPurchase({
        skus: [purchasable.productId],
      });
    }
  };

  useEffect(() => {
    const purchaseUpdatedSubs = purchaseUpdatedListener((purchase) => {
      InteractionManager.runAfterInteractions(() => {
        Alert.alert("Purchase updated", JSON.stringify(purchase));
        dispatch(setPurchaseStatus("base"));
        props.navigation.goBack();
      });
    });

    const purchaseErrorSubs = purchaseErrorListener((error) => {
      InteractionManager.runAfterInteractions(() => {
        Alert.alert("Purchase error", JSON.stringify(error));
      });
    });

    return () => {
      purchaseUpdatedSubs.remove();
      purchaseErrorSubs.remove();
      endConnection();
    };
  }, []);

  return (
    <BottomSheet
      enablePanDownToClose={false}
      backgroundStyle={{
        backgroundColor: theme.colors.mainBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: "transparent",
      }}
    >
      <BottomSheetView>
        <Box flex={1} marginBottom="xxxl">
          <Box borderBottomWidth={1} borderBottomColor="seperator">
            {scheme === "dark" ? (
              <Invert>
                <Image
                  source={logo}
                  style={{ width: 64, height: 64 }}
                  resizeMode="contain"
                />
              </Invert>
            ) : (
              <Image
                source={logo}
                style={{ width: 64, height: 64 }}
                resizeMode="contain"
              />
            )}
            <Text variant="header">Protein Count</Text>
          </Box>
          <Text>Your have completed your free trial.</Text>
          <Button
            variant="primary"
            onPress={handlePurchase}
            marginTop="l"
            label="Continue to 1 Time Purchase"
            icon={<Icon icon={ChevronRight} strokeWidth={2} size={18} />}
          />
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
}
