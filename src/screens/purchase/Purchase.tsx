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
import { Box, Text, Button, Icon, BackDrop } from "@components";
import { baseSku, premiumSku } from "@constants/iaps";
import logo from "@assets/icon-tinted.png";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function Purchase(props: HomeScreenProps<"Purchase">) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [purchasable, setPurchasable] = useState<any>();
  const scheme = useColorScheme();
  const price = formatter.format(
    parseInt(props.route.params.sku.match(/[0-9]+$/g)![0]) / 100,
  );

  useEffect(() => {
    const sku = props.route.params.sku;
    if (![baseSku, premiumSku].includes(sku)) {
      console.error("Invalid SKU", sku);
      props.navigation.goBack();
    }
  }, [props.route.params.sku]);

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

      const products = await getProducts([props.route.params.sku]);
      setPurchasable(products[0]);
    };

    startUp();
  }, []);

  const handlePurchase = () => {
    if (isProductIos(purchasable)) {
      requestPurchase({
        sku: purchasable.id,
      });
    } else if (isProductAndroid(purchasable)) {
      requestPurchase({
        skus: ["fullAccess1199"],
      });
    }
  };

  useEffect(() => {
    const purchaseUpdatedSubs = purchaseUpdatedListener((purchase) => {
      InteractionManager.runAfterInteractions(() => {
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
      backdropComponent={() => <BackDrop blurIntensity={30} />}
      backgroundStyle={{
        backgroundColor: theme.colors.mainBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: "transparent",
      }}
    >
      <BottomSheetView>
        <Box marginBottom="l" padding="l" paddingTop="none">
          <Box
            borderBottomWidth={1}
            borderBottomColor="seperator"
            flexDirection="row"
            marginLeft="ns"
            gap="xs"
            alignItems="center"
            marginBottom="m"
            paddingBottom="s"
          >
            {scheme === "dark" ? (
              <Invert>
                <Image
                  source={logo}
                  style={{ width: 48, height: 48 }}
                  resizeMode="contain"
                />
              </Invert>
            ) : (
              <Image
                source={logo}
                style={{ width: 48, height: 48 }}
                resizeMode="contain"
              />
            )}
            <Text variant="header">Protein Count</Text>
          </Box>
          <Text color="secondaryText" fontSize={15}>
            Your have completed your free trial. You can purchase a &nbsp;
            <Text color="primaryText">
              life time subscription for {price}&nbsp;
            </Text>
            to continue using the app.
          </Text>
          <Button
            variant="primary"
            onPress={handlePurchase}
            marginTop="xxl"
            labelPlacement="left"
            alignItems="center"
            lineHeight={18}
            label="Purchase"
            icon={<Icon icon={ChevronRight} strokeWidth={2} size={16} />}
          />
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
}
