import { useEffect, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { InteractionManager, Alert, useColorScheme, Image } from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ChevronRight, ArrowLeft } from "geist-native-icons";
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
import type { ProductAndroid } from "expo-iap/build/types/ExpoIapAndroid.types";
import type { ProductIos } from "expo-iap/build/types/ExpoIapIos.types";

import { HomeScreenProps } from "@types";
import { useAppDispatch } from "@store/hooks";
import { setPurchaseStatus } from "@store/slices/userSlice";
import { Box, Text, Button, Icon, BackDrop, PulseText } from "@components";
import { baseIap, premiumIap } from "@constants/iaps";
import logo from "@assets/icon-tinted.png";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const Message = ({
  iap,
  hasPurchased,
  purchaseable,
}: {
  iap: typeof baseIap | typeof premiumIap;
  hasPurchased?: boolean;
  purchaseable?: ProductIos | ProductAndroid;
}) => {
  return hasPurchased === undefined || purchaseable === undefined ? (
    <Box gap="m">
      <PulseText numberOfLines={1.25} width={250} />
      <PulseText numberOfLines={1.25} width={150} />
    </Box>
  ) : hasPurchased === true ? (
    <Text>
      You have already purchased{" "}
      {isProductIos(purchaseable)
        ? purchaseable.displayName.toLowerCase()
        : purchaseable?.productId}
    </Text>
  ) : iap === baseIap ? (
    <Text color="secondaryText" fontSize={15}>
      Your have completed your free trial. You can purchase a &nbsp;
      <Text color="primaryText">
        life time subscription for{" "}
        {formatter.format(parseInt(baseIap.sku.match(/[0-9]+$/g)![0]) / 100)}
        &nbsp;
      </Text>
      to continue using the app.
    </Text>
  ) : (
    <Text>Subscribe to the premium plan to unlock all features.</Text>
  );
};

export default function Purchase(props: HomeScreenProps<"Purchase">) {
  const theme = useTheme();
  const dispatch = useAppDispatch();
  const [purchasable, setPurchasable] = useState<ProductIos | ProductAndroid>();
  const scheme = useColorScheme();
  const [hasPurchased, setHasPurchased] = useState<boolean>();
  const [listenForPurchase, setListenForPurchase] = useState(false);

  useEffect(() => {
    const iap = props.route.params.iap;
    if (![baseIap, premiumIap].includes(iap)) {
      console.error("Invalid SKU", iap);
      props.navigation.goBack();
    }
  }, [props.route.params.iap]);

  useEffect(() => {
    const startUp = async () => {
      await initConnection();

      const purchaseHistory = await getPurchaseHistory();
      // If for some reason redux lost track of the purchase status,
      // restore it
      if (purchaseHistory.length > 0) {
        if (purchaseHistory.some((p: any) => p.productID === baseIap.sku)) {
          dispatch(setPurchaseStatus(baseIap.unlocks));
          setHasPurchased(true);
        } else if (
          purchaseHistory.some((p: any) => p.productID === premiumIap.sku)
        ) {
          dispatch(setPurchaseStatus(premiumIap.unlocks));
          setHasPurchased(true);
        } else {
          setListenForPurchase(true);
        }
      } else {
        setListenForPurchase(true);
        setHasPurchased(false);
      }

      const products = await getProducts([props.route.params.iap.sku]);
      setPurchasable(products[0]);
    };

    startUp();
  }, []);

  const handlePress = () => {
    if (!purchasable) return;
    if (hasPurchased) {
      if (props.navigation.canGoBack()) {
        props.navigation.goBack();
      } else {
        props.navigation.navigate("Home", {
          screen: "Main",
        } as any);
      }
    } else if (isProductIos(purchasable)) {
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
    if (!listenForPurchase) return;
    const purchaseUpdatedSubs = purchaseUpdatedListener((purchase) => {
      InteractionManager.runAfterInteractions(() => {
        dispatch(setPurchaseStatus(props.route.params.iap.unlocks));
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
  }, [listenForPurchase]);

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
          <Message
            iap={props.route.params.iap}
            hasPurchased={hasPurchased}
            purchaseable={purchasable}
          />
          <Animated.View layout={LinearTransition.duration(200)}>
            <Button
              variant="primary"
              onPress={handlePress}
              marginTop="xxl"
              labelPlacement={hasPurchased ? "right" : "left"}
              alignItems="center"
              lineHeight={18}
              label={hasPurchased ? "Back" : "Purchase"}
              icon={
                hasPurchased ? (
                  <Icon icon={ArrowLeft} strokeWidth={2} size={16} />
                ) : (
                  <Icon icon={ChevronRight} strokeWidth={2} size={16} />
                )
              }
            />
          </Animated.View>
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
}
