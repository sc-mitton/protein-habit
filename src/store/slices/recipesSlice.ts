import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

export const cuisines = [
  "italian",
  "mexican",
  "indian",
  "asian",
  "mediterranean",
] as const;

export const meals = [
  "breakfast",
  "lunch",
  "dinner",
  "snack",
  "dessert",
] as const;

export const proteins = [
  "chicken",
  "steak",
  "ground_beef",
  "shrimp",
  "tofu",
  "fish",
  "lamb",
] as const;

export const dishes = [
  "salad",
  "soup",
  "sandwich",
  "bowl",
  "smoothie",
] as const;

export const allFilters = {
  protein: proteins,
  dish: dishes,
  meal: meals,
  cuisine: cuisines,
};

// Types
export interface Recipe {
  id: number;
  description: string | null;
  ingredients: string | null;
  instructions: string | null;
  thumbnail: string | null;
  cuisine: (typeof cuisines)[number];
  meal: (typeof meals)[number];
  protein: (typeof proteins)[number];
  dish?: (typeof dishes)[number];
}

export interface RecipeFilters {
  cuisine?: (typeof cuisines)[number];
  meal?: (typeof meals)[number];
  protein?: (typeof proteins)[number];
  dish?: (typeof dishes)[number];
  search?: string;
}

export interface PaginationParams {
  page: number;
  size: number;
}

// FastAPI Pagination response format
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

interface RecipesState {
  recipes: Recipe[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
  filters: RecipeFilters;
  loading: boolean;
  error: string | null;
}

const initialState: RecipesState = {
  recipes: [],
  total: 0,
  page: 1,
  page_size: 10,
  total_pages: 0,
  filters: {},
  loading: false,
  error: null,
};

// Async thunk for fetching recipes
export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (
    {
      filters,
      pagination,
    }: { filters: RecipeFilters; pagination: PaginationParams },
    { rejectWithValue },
  ) => {
    try {
      const params = new URLSearchParams();

      // Add pagination params
      params.append("page", pagination.page.toString());
      params.append("size", pagination.size.toString());

      // Add filter params if they exist
      if (filters.cuisine) params.append("cuisine", filters.cuisine);
      if (filters.meal) params.append("meal", filters.meal);
      if (filters.protein) params.append("protein", filters.protein);
      if (filters.search) params.append("search", filters.search);

      const response = await axios.get<PaginatedResponse<Recipe>>(
        `/api/v1/recipes?${params.toString()}`,
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return rejectWithValue(
          error.response?.data?.detail || "Failed to fetch recipes",
        );
      }
      return rejectWithValue("An unexpected error occurred");
    }
  },
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<RecipeFilters>) => {
      state.filters = action.payload;
      state.page = 1; // Reset to first page when filters change
    },
    setPage: (state, action: PayloadAction<number>) => {
      state.page = action.payload;
    },
    setPageSize: (state, action: PayloadAction<number>) => {
      state.page_size = action.payload;
      state.page = 1; // Reset to first page when page size changes
    },
    clearFilters: (state) => {
      state.filters = {};
      state.page = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchRecipes.fulfilled,
        (state, action: PayloadAction<PaginatedResponse<Recipe>>) => {
          state.loading = false;
          state.recipes = action.payload.items;
          state.total = action.payload.total;
          state.page = action.payload.page;
          state.page_size = action.payload.size;
          state.total_pages = action.payload.pages;
        },
      )
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, setPage, setPageSize, clearFilters } =
  recipesSlice.actions;

export default recipesSlice.reducer;
