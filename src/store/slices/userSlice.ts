import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface UserState {
    name: string
    bodyWeight: number
}

const initialState: UserState = {
    name: '',
    bodyWeight: 0,
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setName: (state, action: PayloadAction<string>) => {
            state.name = action.payload
        },
        setBodyWeight: (state, action: PayloadAction<number>) => {
            state.bodyWeight = action.payload
        },
    },
})

export const { setName, setBodyWeight } = userSlice.actions
export default userSlice.reducer
