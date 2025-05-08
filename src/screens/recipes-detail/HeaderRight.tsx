import { useEffect, useRef, useState } from "react";

import { RootScreenProps } from "@types";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { selectIsBookmarked } from "@store/slices/bookmarksSlice";
import { BookmarkButton, BookmarkButtonRef, Box } from "@components";
import { removeRecipe } from "@store/slices/bookmarksSlice";

const HeaderRight = (props: RootScreenProps<"RecipeDetail">) => {
  const dispatch = useAppDispatch();
  const isBookmarked = useAppSelector((state) =>
    selectIsBookmarked(state, props.route.params.recipe),
  );
  const bookmarkRef = useRef<BookmarkButtonRef>(null);
  const [hasPressedBookmark, setHasPressedBookmark] = useState(false);
  const [screenIsFocused, setScreenIsFocused] = useState(false);

  const handleBookmark = () => {
    setHasPressedBookmark(true);
    if (isBookmarked) {
      dispatch(
        removeRecipe({
          recipeId: props.route.params.recipe,
        }),
      );
    } else {
      bookmarkRef.current?.playForward();
      props.navigation.navigate("BookmarkModal", {
        recipe: props.route.params.recipe,
      });
    }
  };

  useEffect(() => {
    props.navigation.addListener("state", (state) => {
      if (
        state.data.state.routes[state.data.state.routes.length - 1].name ==
        props.route.name
      ) {
        setScreenIsFocused(true);
      } else {
        setScreenIsFocused(false);
      }
    });
  }, [isBookmarked]);

  useEffect(() => {
    if (screenIsFocused && hasPressedBookmark && !isBookmarked) {
      bookmarkRef.current?.playBackward();
    }
  }, [screenIsFocused, hasPressedBookmark, isBookmarked]);

  return (
    <Box marginRight="ns">
      <BookmarkButton
        ref={bookmarkRef}
        useAccent={true}
        bookmarked={isBookmarked}
        onPress={handleBookmark}
        size={30}
      />
    </Box>
  );
};

export default HeaderRight;
