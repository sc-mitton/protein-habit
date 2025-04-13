import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "@store";
import * as FileSystem from "expo-file-system";

export interface BookmarkCategory {
  id: string;
  name: string;
  recipeIds: string[];
  coverPhoto?: string | null;
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
      coverPhoto: null,
    },
  ],
};

// Helper function to delete a cover photo file if it exists
export const deleteCoverPhotoFile = async (
  coverPhotoUri: string | null | undefined,
) => {
  if (!coverPhotoUri) return;

  try {
    // Check if the file exists before trying to delete it
    const fileInfo = await FileSystem.getInfoAsync(coverPhotoUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(coverPhotoUri);
    }
  } catch (error) {
    console.error("Error deleting cover photo file:", error);
  }
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
        coverPhoto: null,
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
    reorderCategories: (
      state,
      action: PayloadAction<{ order: { [key: string]: number } }>,
    ) => {
      // Sort categories based on the order mapping
      state.categories.sort((a, b) => {
        const orderA = action.payload.order[a.id] ?? Number.MAX_SAFE_INTEGER;
        const orderB = action.payload.order[b.id] ?? Number.MAX_SAFE_INTEGER;
        return orderA - orderB;
      });
    },
    updateCategoryCoverPhoto: (
      state,
      action: PayloadAction<{
        categoryId: string;
        coverPhoto: string | null;
      }>,
    ) => {
      const category = state.categories.find(
        (cat) => cat.id === action.payload.categoryId,
      );
      if (category) {
        category.coverPhoto = action.payload.coverPhoto;
      }
    },
  },
});

export const {
  addCategory,
  removeCategory,
  addRecipeToCategory,
  removeRecipe,
  clearBookmarks,
  reorderCategories,
  updateCategoryCoverPhoto,
} = bookmarksSlice.actions;

// Selectors
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

// Since we're now using the categories array order directly, we can just export it
export const selectOrderedCategories = (state: RootState) =>
  state.bookmarks.categories;

export default bookmarksSlice.reducer;
