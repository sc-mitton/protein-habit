import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface UserState {
    name: string
    bodyWeight: number
    setName: (name: string) => void
    setBodyWeight: (weight: number) => void
}

export const useUserStore = create<UserState>()(
    persist(
        (set) => ({
            name: '',
            bodyWeight: 0,
            setName: (name) => set({ name }),
            setBodyWeight: (weight) => set({ bodyWeight: weight }),
        }),
        {
            name: 'user-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
)
