import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "..";

interface UserState {
  name: string;
  bodyWeight: number;
  inceptionDate: string;
}

export const initialState: UserState = {
  name: "",
  bodyWeight: 0,
  inceptionDate: new Date().toISOString(),
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setName: (state, action: PayloadAction<string>) => {
      state.name = action.payload;
    },
    setBodyWeight: (state, action: PayloadAction<number>) => {
      state.bodyWeight = action.payload;
    },
  },
});

export const { setName, setBodyWeight } = userSlice.actions;
export default userSlice.reducer;

export const selectUserInception = (state: RootState) => {
  console.log("state.user.inceptionDate: ", state.user.inceptionDate);
  return state.user.inceptionDate;
};
