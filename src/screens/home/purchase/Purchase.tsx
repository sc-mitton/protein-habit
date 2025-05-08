import { useTheme } from "@shopify/restyle";
import { useState, useEffect } from "react";
import { StyleSheet, Alert } from "react-native";
import Purchases, {
  PurchasesOffering,
  PurchasesPackage,
} from "react-native-purchases";
import Animated, { FadeInDown, FadeOutDown } from "react-native-reanimated";
import * as WebBrowser from "expo-web-browser";
import { LinearGradient } from "expo-linear-gradient";
import { SymbolView } from "expo-symbols";
import { Check } from "geist-native-icons";
import Constants from "expo-constants";

import { RootScreenProps } from "@types";
import {
  Box,
  Text,
  SegmentedTabControl,
  BackDrop,
  Button,
  Icon,
} from "@components";
import logo from "@assets/icon-tinted.png";
import { Image } from "expo-image";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import BottomSheet from "@gorhom/bottom-sheet";
import { Theme } from "@theme";
import { useAppSelector, useAppDispatch } from "@store/hooks";
import { selectAccent } from "@store/slices/uiSlice";
import {
  setEntitlement,
  selectEntitlement,
} from "@store/slices/entitlementSlice";
import { baseEntitlement } from "@constants/iaps";
import LottieView from "lottie-react-native";
import { loadingV4 } from "@assets/lotties";

const AnimatedBox = Animated.createAnimatedComponent(Box);

function DiscountBadge({ discount }: { discount: number }) {
  return (
    <Box
      position="absolute"
      top={-12}
      right={-12}
      paddingHorizontal="s"
      borderRadius="full"
      zIndex={1}
      overflow="hidden"
    >
      <Box accent style={StyleSheet.absoluteFill} opacity={1} />
      <Text fontSize={11} variant="bold" color="white">
        Save {discount}%
      </Text>
    </Box>
  );
}

const LoadingIndicator = () => (
  <Box style={StyleSheet.absoluteFill} zIndex={12}>
    <Box
      position="absolute"
      top={"50%"}
      left={"50%"}
      justifyContent="center"
      alignItems="center"
      zIndex={12}
    >
      <Box position="absolute" justifyContent="center" alignItems="center">
        <LottieView
          source={loadingV4}
          autoPlay
          loop
          style={{ width: 28, height: 28 }}
          speed={2}
          colorFilters={[
            {
              keypath: "loader",
              color: "white",
            },
          ]}
        />
      </Box>
    </Box>
  </Box>
);

function Purchase(props: RootScreenProps<"PurchaseModal">) {
  const dispatch = useAppDispatch();
  const [offering, setOffering] = useState<PurchasesOffering | null>(null);
  const [period, setPeriod] = useState<"P1M" | "P1Y">("P1Y");
  const [metaData, setMetaData] = useState<any>();
  const [selectedPackage, setSelectedPackage] =
    useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const accent = useAppSelector(selectAccent);
  const isProFeatureAccess = props.route.params?.proFeatureAccess;
  const entitlement = useAppSelector(selectEntitlement);
  const hasBaseAccess = entitlement === baseEntitlement;
  const theme = useTheme<Theme>();

  useEffect(() => {
    const fetchOffering = async () => {
      const offerings = await Purchases.getOfferings();
      setOffering(offerings.current);
      setMetaData(offerings.current?.metadata);

      // Set initial selected package
      if (offerings.current?.availablePackages) {
        const initialPackage = offerings.current.availablePackages.find(
          (p) => p.product.subscriptionPeriod === period,
        );
        setSelectedPackage(initialPackage || null);
      }
    };

    fetchOffering();
  }, []);

  // Update selected package when period changes
  useEffect(() => {
    if (offering?.availablePackages) {
      const newPackage = offering.availablePackages.find(
        (p) => p.product.subscriptionPeriod === period,
      );
      setSelectedPackage(newPackage || null);
    }
  }, [period, offering]);

  const calculateDiscount = (yearlyPrice: number, monthlyPrice: number) => {
    const yearlyTotal = yearlyPrice;
    const monthlyTotal = monthlyPrice * 12;
    const discount = Math.round(
      ((monthlyTotal - yearlyTotal) / monthlyTotal) * 100,
    );
    return discount;
  };

  const handlePurchase = async (p: PurchasesPackage | null) => {
    if (!p) return;
    setIsLoading(true);
    try {
      const { customerInfo } = await Purchases.purchasePackage(p);
      dispatch(
        setEntitlement(Object.keys(customerInfo.entitlements.active)[0]),
      );
      props.navigation.goBack();
    } catch (e) {
      console.error("here: ", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestorePurchases = async () => {
    try {
      const restore = await Purchases.restorePurchases();
      const restoreTo = Object.keys(restore.entitlements.active)[0];
      if (restoreTo) {
        dispatch(setEntitlement(restoreTo));
        Alert.alert("Restore successful", undefined, [
          {
            text: "OK",
            onPress: () => props.navigation.goBack(),
          },
        ]);
      } else {
        Alert.alert("Restore failed", "No purchases found");
      }
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <Box paddingHorizontal="l" marginBottom="l" gap="m">
      <Box
        borderBottomWidth={1}
        borderBottomColor="lightBorderColor"
        flexDirection="row"
        alignItems="center"
        gap="sm"
        marginBottom="m"
        paddingBottom="m"
      >
        <Box
          borderRadius="m"
          borderColor="lightBorderColor"
          borderWidth={1.5}
          overflow="hidden"
        >
          <Image source={logo} style={{ width: 36, height: 36 }} />
        </Box>
        <Text variant="bold" fontSize={18}>
          Protein Habit
        </Text>
      </Box>
      <Box marginBottom="m" gap="s">
        <Box
          alignItems="center"
          justifyContent="space-between"
          flexDirection="row"
        >
          <Text variant="bold">
            {isProFeatureAccess ? "Get Pro Access" : "Select a plan"}
          </Text>
          <Box>
            <SegmentedTabControl
              options={[
                { label: "Annual", value: "P1Y" },
                { label: "Monthly", value: "P1M" },
              ]}
              value={period}
              onChange={(value) => setPeriod(value)}
            />
          </Box>
        </Box>
      </Box>
      {offering?.availablePackages
        .filter((p) => {
          // Filter by period
          const matchesPeriod = p.product.subscriptionPeriod === period;
          // Filter out basic plan if user already has it
          const isBasicPlan = p.identifier.includes(baseEntitlement);

          return matchesPeriod && (!isBasicPlan || !hasBaseAccess);
        })
        .map((p) => {
          const monthlyPackage = offering.availablePackages.find(
            (pkg) => pkg.product.subscriptionPeriod === "P1M",
          );
          const yearlyPackage = offering.availablePackages.find(
            (pkg) => pkg.product.subscriptionPeriod === "P1Y",
          );

          const discount =
            period === "P1Y" && monthlyPackage && yearlyPackage
              ? calculateDiscount(
                  yearlyPackage.product.price,
                  monthlyPackage.product.price,
                )
              : 0;

          const isSelected = selectedPackage?.identifier === p.identifier;

          return (
            <AnimatedBox
              key={p.identifier}
              entering={FadeInDown}
              exiting={FadeOutDown}
              position="relative"
            >
              {discount > 0 &&
                metaData?.showDiscountBadge?.includes(p.identifier) && (
                  <DiscountBadge discount={discount} />
                )}
              <Button
                onPress={() => setSelectedPackage(p)}
                backgroundColor="foodItemBackground"
                borderColor={isSelected ? accent : "borderColor"}
                borderWidth={1.5}
                padding="ml"
                paddingHorizontal="m"
                alignItems="flex-start"
              >
                <Box flex={1}>
                  <Box
                    flexDirection="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box flexDirection="row" alignItems="center" gap="sm">
                      <Box
                        width={14}
                        height={14}
                        borderRadius="full"
                        backgroundColor={isSelected ? accent : "transparent"}
                        borderWidth={1.5}
                        borderColor={isSelected ? accent : "quaternaryText"}
                        alignItems="center"
                        justifyContent="center"
                      >
                        <Box
                          width={6}
                          height={6}
                          borderRadius="full"
                          backgroundColor={
                            isSelected ? "primaryButton" : "transparent"
                          }
                          zIndex={12}
                        />
                      </Box>
                      <Text fontSize={18}>
                        {metaData?.titleStrings?.[p.identifier]}
                      </Text>
                    </Box>
                    <Text fontSize={18}>
                      {period === "P1M"
                        ? p.product.pricePerMonthString
                        : p.product.pricePerYearString}{" "}
                      <Text variant="caption">
                        {period === "P1M" ? "/ mo" : "/ yr"}
                      </Text>
                    </Text>
                  </Box>
                  <Box paddingLeft="xxs">
                    {metaData?.featureList?.[
                      metaData?.productFeatureList?.[p.identifier]
                    ].map((feature: string, i: number) => (
                      <Box
                        key={`feature-${i}`}
                        flexDirection="row"
                        gap="sm"
                        alignItems="center"
                        marginTop={i === 0 ? "m" : "none"}
                      >
                        <SymbolView
                          name="checkmark"
                          tintColor={theme.colors.primaryText}
                          style={{ width: 14, height: 12 }}
                          fallback={<Icon icon={Check} size={14} />}
                        />
                        <Text fontSize={14}>{feature}</Text>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Button>
            </AnimatedBox>
          );
        })}
      <Box marginTop="s">
        {isLoading && <LoadingIndicator />}
        <Button
          onPress={() => handlePurchase(selectedPackage)}
          label={isLoading ? "Processing..." : "Continue"}
          textColor={isLoading ? "transparent" : "white"}
          variant="primary"
          paddingVertical="sm"
          backgroundColor={accent}
          style={{ marginTop: "auto" }}
          disabled={isLoading}
          overflow="hidden"
        >
          <Box style={StyleSheet.absoluteFill} opacity={0.15}>
            <LinearGradient
              colors={["white", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
              style={StyleSheet.absoluteFill}
            />
          </Box>
        </Button>
      </Box>
      <Box
        flexDirection="row"
        justifyContent="space-between"
        alignContent="center"
        marginBottom="m"
        marginTop="s"
      >
        <Button
          textColor="tertiaryText"
          fontSize={14}
          paddingHorizontal="s"
          paddingVertical="none"
          onPress={handleRestorePurchases}
          disabled={isLoading}
          borderBottomWidth={1}
          borderBottomColor="quaternaryText"
        >
          <Text
            color="tertiaryText"
            fontSize={14}
            style={{ textDecorationLine: "underline" }}
          >
            Restore Purchases
          </Text>
        </Button>
        <Box flexDirection="row" gap="s" alignItems="center">
          <Button
            textColor="tertiaryText"
            fontSize={12}
            label="Terms"
            padding="none"
            onPress={() => {
              WebBrowser.openBrowserAsync(
                "https://northof60labs.com/proteinhabit/terms",
              );
            }}
          />
          <Text color="tertiaryText" fontSize={10}>
            &bull;
          </Text>
          <Button
            textColor="tertiaryText"
            fontSize={12}
            padding="none"
            label="Privacy"
            onPress={() => {
              WebBrowser.openBrowserAsync(
                "https://northof60labs.com/proteinhabit/privacy",
              );
            }}
          />
        </Box>
      </Box>
    </Box>
  );
}

export default function (props: RootScreenProps<"PurchaseModal">) {
  const theme = useTheme<Theme>();
  return (
    <BottomSheet
      onClose={() =>
        props.navigation.navigate(
          "BottomTabs",
          {
            screen: "Home",
            params: {
              screen: "Main",
            },
          },
          {
            pop: true,
          },
        )
      }
      enablePanDownToClose
      backgroundStyle={{
        backgroundColor: theme.colors.modalBackground,
      }}
      containerStyle={{
        shadowColor: theme.colors.defaultShadow,
        shadowOffset: { width: 0, height: 12 },
        shadowOpacity: 1,
        shadowRadius: 24,
        elevation: 12,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.tertiaryText,
      }}
      backdropComponent={() => <BackDrop blurIntensity={30} />}
    >
      <BottomSheetView>
        <Purchase {...props} />
      </BottomSheetView>
    </BottomSheet>
  );
}
