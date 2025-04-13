import { Box } from "@components";
import { RootScreenProps } from "@types";

type Props = RootScreenProps<"BookmarkCategory">;

const BookmarkCategory = (props: Props) => {
  return <Box flex={1} backgroundColor="matchBlurBackground" padding="m"></Box>;
};

export default BookmarkCategory;
