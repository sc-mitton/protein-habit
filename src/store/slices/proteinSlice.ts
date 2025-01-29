import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface ProteinEntry {
    id: string
    grams: number
    date: string // ISO string
}

interface ProteinState {
    entries: ProteinEntry[]
    dailyTarget: number
}

const initialState: ProteinState = {
    entries: [],
    dailyTarget: 0,
}

const proteinSlice = createSlice({
    name: 'protein',
    initialState,
    reducers: {
        addProteinEntry: (state, action: PayloadAction<Omit<ProteinEntry, 'id'>>) => {
            state.entries.push({
                ...action.payload,
                id: Date.now().toString(),
            })
        },
        removeProteinEntry: (state, action: PayloadAction<string>) => {
            state.entries = state.entries.filter(entry => entry.id !== action.payload)
        },
        setDailyTarget: (state, action: PayloadAction<number>) => {
            state.dailyTarget = action.payload
        },
    },
})

export const { addProteinEntry, removeProteinEntry, setDailyTarget } = proteinSlice.actions
export default proteinSlice.reducer
