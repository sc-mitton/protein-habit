import {
  createContext,
  useContext,
  useState,
  useMemo,
  useRef,
  Fragment,
} from "react";
import {
  View,
  TouchableOpacity,
  Modal,
  FlatList,
  SectionList,
  StyleSheet,
} from "react-native";
import { Search } from "geist-native-icons";
import Animated, { SlideInDown, SlideOutDown } from "react-native-reanimated";
import { groupBy } from "lodash-es";

import styles from "./styles/modal";
import { charFromEmojiObject, emojis } from "../helpers";
import { Box, Text, TextInput } from "../../base";
import { Icon } from "../../Icon";
import type { NativeEmojiPickerProps, Context } from "./types";
import type { Emoji } from "../types";
import { categories } from "../constants";
import Header from "./Header";
import EmojiCell from "./EmojiCell";

const pickerModalContext = createContext<Context | undefined>(undefined);

const EmojiPicker = (props: NativeEmojiPickerProps) => {
  const [visible, setVisible] = useState(false);
  const { as = "modal" } = props;

  return (
    <pickerModalContext.Provider value={{ visible, setVisible }}>
      {as === "modal" ? (
        <EmojiPickerModal {...props}>{props.children}</EmojiPickerModal>
      ) : (
        <Fragment>
          {props.children}
          {visible && (
            <Animated.View
              entering={SlideInDown.withInitialValues({ opacity: 0 }).duration(
                500,
              )}
              exiting={SlideOutDown.duration(500).withInitialValues({
                opacity: 1,
              })}
              style={[StyleSheet.absoluteFill, styles.modal]}
            >
              <EmojiPickerContent {...props} />
            </Animated.View>
          )}
        </Fragment>
      )}
    </pickerModalContext.Provider>
  );
};

function Trigger({ children }: { children: React.ReactNode }) {
  const { setVisible } = useEmojiPickerContext();

  return (
    <TouchableOpacity onPress={() => setVisible(true)} activeOpacity={0.7}>
      {children}
    </TouchableOpacity>
  );
}

export function useEmojiPickerContext() {
  const context = useContext(pickerModalContext);
  if (!context) {
    throw new Error(
      "useEmojiPickerContext must be used within a PickerModalProvider",
    );
  }
  return context;
}

function EmojiPickerContent(props: NativeEmojiPickerProps) {
  const { numColumns = 8 } = props;

  const ref = useRef<SectionList>(null);
  const { setVisible } = useEmojiPickerContext();
  const [searchValue, setSearchValue] = useState("");

  const sections = useMemo(() => {
    const groupedEmojis = groupBy(emojis, "category");
    return categories
      .map((category) => ({
        category,
        data: groupedEmojis[category] || [],
      }))
      .map((section) => ({
        ...section,
        data: section.data.reduce(
          (acc, emoji) => {
            if (acc[acc.length - 1].length === numColumns) {
              acc.push([]);
            }
            acc[acc.length - 1].push(emoji);
            return acc;
          },
          [[]] as Emoji[][],
        ),
      }));
  }, [emojis]);

  return (
    <Box style={styles.main} backgroundColor="mainBackground" flex={1}>
      <Header
        onRemove={() => {
          props.onChange && props.onChange("");
          setVisible(false);
        }}
        onClose={() => {
          setVisible(false);
          props.onClose && props.onClose();
        }}
        title={props.title}
      />
      <Box width="100%" paddingHorizontal="m">
        <TextInput
          value={searchValue}
          onChangeText={setSearchValue}
          placeholder="Search..."
          style={styles.searchInput}
        >
          <View style={styles.searchIcon}>
            <Icon icon={Search} color="placeholderText" />
          </View>
        </TextInput>
      </Box>
      {searchValue ? (
        <FlatList
          data={emojis
            .filter((item) =>
              item.name
                .split(" ")
                .some((word) =>
                  word.toLowerCase().startsWith(searchValue.toLowerCase()),
                ),
            )
            .reduce(
              (acc, emoji) => {
                if (acc[acc.length - 1].length === numColumns) {
                  acc.push([]);
                }
                acc[acc.length - 1].push(emoji);
                return acc;
              },
              [[]] as Emoji[][],
            )}
          renderItem={({ item }) => (
            <View style={styles.row}>
              {item.map((emoji) => (
                <EmojiCell
                  key={charFromEmojiObject(emoji)}
                  emoji={emoji}
                  onPress={() => {
                    props.onChange &&
                      props.onChange(charFromEmojiObject(emoji));
                    setVisible(false);
                  }}
                />
              ))}
            </View>
          )}
          keyExtractor={(_, index) => index.toString()}
        />
      ) : (
        <Fragment>
          <SectionList
            ref={ref}
            contentContainerStyle={styles.sectionListContent}
            showsVerticalScrollIndicator={false}
            style={styles.sectionList}
            sections={sections}
            stickySectionHeadersEnabled={true}
            bounces={true}
            overScrollMode="always"
            renderSectionHeader={({ section: { category } }) => (
              <Box
                backgroundColor="mainBackground"
                style={styles.sectionHeader}
              ></Box>
            )}
            renderItem={({ item }) => (
              <View style={styles.row}>
                {item.map((emoji: any) => (
                  <EmojiCell
                    key={charFromEmojiObject(emoji)}
                    emoji={emoji}
                    onPress={() => {
                      props.onChange &&
                        props.onChange(charFromEmojiObject(emoji));
                      setVisible(false);
                    }}
                  />
                ))}
              </View>
            )}
            keyExtractor={(_, index) => index.toString()}
          />
        </Fragment>
      )}
    </Box>
  );
}

function EmojiPickerModal(props: NativeEmojiPickerProps) {
  const { visible } = useEmojiPickerContext();

  return (
    <Fragment>
      {props.children}
      {visible && (
        <Modal
          presentationStyle="fullScreen"
          animationType="slide"
          visible={visible}
          style={styles.modal}
        >
          <EmojiPickerContent {...props} />
        </Modal>
      )}
    </Fragment>
  );
}

EmojiPicker.Trigger = Trigger;
EmojiPicker.Content = EmojiPickerContent;

export default EmojiPicker;
