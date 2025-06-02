import { useState } from "react";
import { Dayjs } from "dayjs";
import { StyleSheet, Platform } from "react-native";
import { Check, X } from "geist-native-icons";
import dayjs from "dayjs";

import { Box, Text, Tip, Icon } from "@components";
import { dayFormat } from "@constants/formats";

interface Props {
  dayInJS: Dayjs;
  columnIndex: number;
  rowIndex: number;
  isBookend: boolean;
  targetMet: boolean | null;
  tipLabel?: string;
}

const styles = StyleSheet.create({
  cell: {
    width: `${100 / 7}%`,
    alignItems: "center",
    justifyContent: "flex-start",
    paddingHorizontal: Platform.OS === "ios" ? 3 : 4,
    paddingBottom: Platform.OS === "ios" ? 5 : 6,
  },
});

const CalendarCell = ({
  dayInJS,
  columnIndex,
  rowIndex,
  isBookend,
  targetMet,
  tipLabel,
}: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Box
      key={`cell-${dayInJS.format(dayFormat)}-${columnIndex}-${rowIndex}`}
      style={[styles.cell, { zIndex: isOpen ? 100 : 0 }]}
    >
      <Box
        style={[StyleSheet.absoluteFill]}
        opacity={0.3}
        borderTopLeftRadius={columnIndex === 0 ? "sm" : "none"}
        borderTopRightRadius={columnIndex === 6 ? "sm" : "none"}
        borderBottomRightRadius={columnIndex === 6 ? "sm" : "none"}
        borderBottomLeftRadius={columnIndex === 0 ? "sm" : "none"}
        backgroundColor={rowIndex % 2 == 0 ? "primaryButton" : "transparent"}
      />
      <Tip
        offset={3}
        label={tipLabel}
        onShow={() => setIsOpen(true)}
        onHide={() => setIsOpen(false)}
        hitSlop={{ left: 16, right: 16 }}
      >
        <Box alignItems="center" gap="xxs">
          <Text
            marginBottom="nxs"
            color={isBookend ? "secondaryText" : "primaryText"}
            lineHeight={24}
            fontSize={12}
          >
            {dayInJS.format("D")}
          </Text>
          <Icon
            icon={targetMet && !isBookend ? Check : X}
            size={10}
            strokeWidth={3.5}
            color={
              targetMet && !isBookend
                ? "primaryText"
                : targetMet === false &&
                    !isBookend &&
                    dayInJS.isBefore(dayjs(), "day")
                  ? "primaryText"
                  : "transparent"
            }
          />
        </Box>
      </Tip>
    </Box>
  );
};

export default CalendarCell;
