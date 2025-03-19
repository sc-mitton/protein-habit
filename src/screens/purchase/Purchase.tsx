import { useEffect, useState } from "react";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import {
  InteractionManager,
  Alert,
  useColorScheme,
  Image,
  TouchableOpacity,
} from "react-native";
import Animated, { LinearTransition } from "react-native-reanimated";
import { ChevronRight, ArrowLeft } from "geist-native-icons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
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
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setPurchaseStatus } from "@store/slices/userSlice";
import { Box, Text, Button, Icon, BackDrop, PulseText, Tip } from "@components";
import { baseIap, premiumIap } from "@constants/iaps";
import logo from "@assets/icon-tinted.png";
import { selectAccent } from "@store/slices/uiSlice";

const formatter = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

const Message = ({
  iap,
  purchaseable,
}: {
  iap: typeof baseIap | typeof premiumIap;
  purchaseable?: ProductIos | ProductAndroid;
}) => {
  return purchaseable === undefined ? (
    <Box gap="m">
      <PulseText numberOfLines={1.25} width={250} />
      <PulseText numberOfLines={1.25} width={150} />
    </Box>
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
  const accent = useAppSelector(selectAccent);
  const dispatch = useAppDispatch();
  const [purchasable, setPurchasable] = useState<ProductIos | ProductAndroid>();
  const scheme = useColorScheme();
  const [hasRestored, setHasRestored] = useState<boolean>();
  const [listenForPurchase, setListenForPurchase] = useState(false);
  const [restoreFailed, setRestoreFailed] = useState(false);

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
      if (purchaseHistory.length <= 0) {
        setListenForPurchase(true);
        setHasRestored(false);
      }

      const products = await getProducts([props.route.params.iap.sku]);
      setPurchasable(products[0]);
    };

    startUp();
  }, []);

  const handlePress = () => {
    if (!purchasable) return;
    if (hasRestored) {
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

  const handleRestore = async () => {
    const purchaseHistory = await getPurchaseHistory();
    if (purchaseHistory.length > 0) {
      const basePurchase = purchaseHistory.find(
        (p: any) => p.productID === baseIap.sku,
      );
      const premiumPurchase = purchaseHistory.find(
        (p: any) => p.productID === premiumIap.sku,
      );

      if (basePurchase) {
        dispatch(setPurchaseStatus(baseIap.unlocks));
        setHasRestored(true);
      }
      if (premiumPurchase) {
        dispatch(setPurchaseStatus(premiumIap.unlocks));
        setHasRestored(true);
      }

      if (!basePurchase && !premiumPurchase) {
        setRestoreFailed(true);
      }
    } else {
      setRestoreFailed(true);
    }
  };

  useEffect(() => {
    if (restoreFailed) {
      Alert.alert("Failed to restore purchase");
    }
  }, [restoreFailed]);

  useEffect(() => {
    if (hasRestored) {
      Alert.alert("Purchase restored", "Your purchase has been restored.", [
        { text: "OK", onPress: () => props.navigation.goBack() },
      ]);
    }
  }, [hasRestored]);

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
        backgroundColor: theme.colors.modalBackground,
      }}
      handleIndicatorStyle={{
        backgroundColor: "transparent",
      }}
    >
      <BottomSheetView>
        <Box paddingHorizontal="l" marginBottom="l">
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
          <Message iap={props.route.params.iap} purchaseable={purchasable} />
          <Animated.View layout={LinearTransition.duration(200)}>
            <Button
              variant="primary"
              onPress={handlePress}
              marginTop="xxl"
              labelPlacement={"left"}
              alignItems="center"
              lineHeight={18}
              label={"Purchase"}
              icon={
                hasRestored ? (
                  <Icon icon={ArrowLeft} strokeWidth={2.5} size={16} />
                ) : (
                  <Icon icon={ChevronRight} strokeWidth={2.5} size={16} />
                )
              }
            />
          </Animated.View>
          <Button
            marginTop="m"
            variant="primary"
            backgroundColor="transparent"
            onPress={() => {
              Alert.alert(
                "Restore purchase",
                "If you have already purchased the app, you can restore your purchase here.",
                [
                  { text: "Cancel", onPress: () => {}, style: "destructive" },
                  { text: "Restore", onPress: handleRestore },
                ],
              );
            }}
            label={
              restoreFailed ? "Failed to Restore Purchase" : "Restore Purchase"
            }
            disabled={hasRestored}
            textColor={restoreFailed ? "error" : "secondaryText"}
            icon={
              restoreFailed && (
                <Ionicons
                  name="alert-circle"
                  size={20}
                  color={theme.colors.error}
                />
              )
            }
            accent={!restoreFailed}
          />
        </Box>
      </BottomSheetView>
    </BottomSheet>
  );
}
