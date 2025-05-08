import { Dimensions } from "react-native";

export const { width } = Dimensions.get("window");
export const COLUMN_COUNT = 2;
export const ITEM_PADDING = 8;
export const ITEM_WIDTH = (width - 54) / COLUMN_COUNT - ITEM_PADDING * 2;
