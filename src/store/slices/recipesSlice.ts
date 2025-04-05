import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Enum types for tags
export enum CuisineType {
  ITALIAN = "Italian",
  MEXICAN = "Mexican",
  INDIAN = "Indian",
  ASIAN = "Asian",
  MEDITERRANEAN_AND_MIDDLE_EASTERN = "Mediterranean and Middle Eastern",
}

export enum MealType {
  BREAKFAST = "Breakfast",
  LUNCH = "Lunch",
  DINNER = "Dinner",
  SNACK = "Snack",
  DESSERT = "Dessert",
  DRINK = "Drink",
  SHAKE_SMOOTHIE = "Shake/Smoothie",
}

export enum ProteinType {
  SHRIMP = "Shrimp",
  STEAK = "Steak",
  CHICKEN = "Chicken",
  PORK = "Pork",
  TOFU = "Tofu",
  FISH = "Fish",
}

export enum DietType {
  LOW_CARB = "Low Carb",
  LOW_FAT = "Low Fat",
  VEGETARIAN = "Vegetarian",
}

export enum DishType {
  SALAD = "Salad",
  SOUP = "Soup",
  SANDWICH = "Sandwich",
  BOWL = "Bowl",
}

// Types
export interface Recipe {
  id: number;
  description: string | null;
  ingredients: string | null;
  instructions: string | null;
  thumbnail: string | null;
  cuisines: CuisineType[];
  meal_types: MealType[];
  proteins: ProteinType[];
  diet_types: DietType[];
  dish_type?: DishType;
}

export interface RecipeFilters {
  cuisine?: CuisineType;
  meal_type?: MealType;
  protein?: ProteinType;
  diet_type?: DietType;
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
      if (filters.meal_type) params.append("meal_type", filters.meal_type);
      if (filters.protein) params.append("protein", filters.protein);
      if (filters.diet_type) params.append("diet_type", filters.diet_type);
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
