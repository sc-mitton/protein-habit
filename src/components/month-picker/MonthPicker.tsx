import { useEffect, useState, useRef } from "react";
import { View } from "react-native";
import dayjs from "dayjs";
import { ChevronsRight } from "geist-native-icons";
import { useAppSelector } from "@store/hooks";
import PagerView from "react-native-pager-view";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useTheme } from "@shopify/restyle";
import { Portal } from "@gorhom/portal";

import { selectUserInception } from "@store/slices/userSlice";
import { selectAccent } from "@store/slices/uiSlice";
import styles from "./styles";
import { Text } from "../base";
import { Button } from "../base/Button";
import { Icon } from "../Icon";
import { BackDrop } from "@components";
import { Theme } from "@theme";

interface Props {
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export function MonthPicker({ value, onChange, visible, setVisible }: Props) {
  const inception = useAppSelector(selectUserInception);
  const accentColor = useAppSelector(selectAccent);
  const theme = useTheme<Theme>();

  const pagerRef = useRef<PagerView>(null);
  const [pagerIndex, setPagerIndex] = useState(0);
  const [options, setOptions] = useState<Record<string, number[][]>[]>();
  const [month, setMonth] = useState(dayjs(value).month());
  const [year, setYear] = useState(dayjs(value).year());

  useEffect(() => {
    if (!inception) return;

    // Set the months available
    const startYear = dayjs(inception).year();
    let newOptions: Record<string, number[][]>[] = Array.from(
      { length: dayjs().year() - startYear + 1 },
      () => ({}),
    );
    for (let y = startYear, i = 0; y <= dayjs().year(); y++, i++) {
      const startMonth =
        y === dayjs(inception).year() ? dayjs(inception).month() + 1 : 1;
      const endMonth = y === dayjs().year() ? dayjs().month() + 1 : 12;
      newOptions[i][y] = Array.from({ length: 4 }, () =>
        Array.from({ length: 3 }, () => -1),
      );

      for (let m = startMonth; m <= endMonth; m++) {
        newOptions[i][y][(m % 4) - 1 < 0 ? 3 : (m % 4) - 1][
          Math.ceil(m / 4) - 1
        ] = m;
      }
    }
    setOptions(newOptions);
  }, [inception]);

  if (!visible) return null;

  return (
    <Portal>
      <BottomSheet
        onClose={() => setVisible(false)}
        enablePanDownToClose
        backgroundStyle={{
          backgroundColor: theme.colors.modalBackground,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.tertiaryText,
        }}
        backdropComponent={() => <BackDrop blurIntensity={30} />}
      >
        <BottomSheetView>
          <View style={styles.pagerContainer}>
            {options && (
              <PagerView
                ref={pagerRef}
                initialPage={dayjs(value).year() - dayjs(inception).year()}
                onPageSelected={(n) => setPagerIndex(n.nativeEvent.position)}
                style={styles.pagerView}
              >
                {options.map((yearKey, i) => (
                  <View key={`year-${yearKey}`} style={styles.gridContainer}>
                    <Text variant="bold">
                      {dayjs(`${year}-${month}-01`).format("YYYY")}
                    </Text>
                    <View style={styles.grid}>
                      {Object.entries(yearKey).map(([y, group]) =>
                        group.map((months, c) => (
                          <View style={styles.column} key={`month-${y}-${c}`}>
                            {months.map((m, r) => {
                              return (
                                <Button
                                  key={`month-${y}-${r * 4 + c + 2}`}
                                  backgroundColor={
                                    m === month + 1 && parseInt(y) === year
                                      ? accentColor || "blue"
                                      : "transparent"
                                  }
                                  paddingHorizontal="l"
                                  disabled={m === -1}
                                  onPress={() => {
                                    setMonth(m);
                                    setYear(parseInt(y));
                                    setVisible(false);
                                  }}
                                  borderRadius="m"
                                  variant="rectangle"
                                >
                                  <Text
                                    color={
                                      m === month + 1 && parseInt(y) === year
                                        ? "white"
                                        : m === -1
                                          ? "tertiaryText"
                                          : "primaryText"
                                    }
                                  >
                                    {m === -1
                                      ? dayjs(`${y}-${r * 4 + c + 2}-0`).format(
                                          "MMM",
                                        )
                                      : dayjs(`${y}-${m}-01`).format("MMM")}
                                  </Text>
                                </Button>
                              );
                            })}
                          </View>
                        )),
                      )}
                    </View>
                  </View>
                ))}
              </PagerView>
            )}
            <Button
              style={styles.arrowButton}
              padding="none"
              onPress={() => {
                pagerRef.current?.setPage(
                  Math.min((options?.length || 1) - 1, pagerIndex + 1),
                );
              }}
            >
              <View style={styles.calendarIcon}>
                <Icon
                  icon={ChevronsRight}
                  strokeWidth={1.75}
                  color={"transparent"}
                />
              </View>
            </Button>
          </View>
        </BottomSheetView>
      </BottomSheet>
    </Portal>
  );
}
