import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@store";
export interface BookmarkCategory {
  id: string;
  name: string;
  recipeIds: string[];
}

interface BookmarksState {
  categories: BookmarkCategory[];
}

const initialState: BookmarksState = {
  categories: [
    {
      id: "favorites",
      name: "Favorites",
      recipeIds: [],
    },
  ],
};

const bookmarksSlice = createSlice({
  name: "bookmarks",
  initialState,
  reducers: {
    addCategory: (
      state,
      action: PayloadAction<{ id: string; name: string }>,
    ) => {
      state.categories.push({
        id: action.payload.id,
        name: action.payload.name,
        recipeIds: [],
      });
    },
    removeCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter(
        (category) => category.id !== action.payload,
      );
    },
    addRecipeToCategory: (
      state,
      action: PayloadAction<{
        categoryId: string;
        recipeId: string;
      }>,
    ) => {
      const category = state.categories.find(
        (cat) => cat.id === action.payload.categoryId,
      );
      if (category) {
        // Check if recipe ID already exists in this category
        const recipeIdExists = category.recipeIds.includes(
          action.payload.recipeId,
        );
        if (!recipeIdExists) {
          category.recipeIds.push(action.payload.recipeId);
        }
      }
    },
    removeRecipe: (
      state,
      action: PayloadAction<{
        recipeId: string;
      }>,
    ) => {
      state.categories.forEach((category) => {
        category.recipeIds = category.recipeIds.filter(
          (recipeId) => recipeId !== action.payload.recipeId,
        );
      });
    },
    clearBookmarks: (state) => {
      state.categories = initialState.categories;
    },
  },
});

export const {
  addCategory,
  removeCategory,
  addRecipeToCategory,
  removeRecipe,
  clearBookmarks,
} = bookmarksSlice.actions;

export const selectIsBookmarked = createSelector(
  (state: RootState) => state.bookmarks.categories,
  (_: RootState, recipeId?: string) => recipeId,
  (categories, recipeId) => {
    // If recipe Id is in at least one of the categories
    return recipeId
      ? categories.some((category) => category.recipeIds.includes(recipeId))
      : false;
  },
);

export const selectCategory = createSelector(
  (state: RootState) => state.bookmarks.categories,
  (_: RootState, categoryId?: string) => categoryId,
  (categories, categoryId) => {
    return categories.find((category) => category.id === categoryId);
  },
);

export default bookmarksSlice.reducer;
