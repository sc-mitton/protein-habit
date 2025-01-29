import { useState } from 'react'
import { Box, Text } from '@components/base'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { setName, setBodyWeight } from '../store/slices/userSlice'
import { setDailyTarget } from '../store/slices/proteinSlice'

export const UserSetup = () => {
    const dispatch = useAppDispatch()
    const { name, bodyWeight } = useAppSelector(state => state.user)

    const handleUpdateName = (newName: string) => {
        dispatch(setName(newName))
    }

    const handleUpdateWeight = (weight: number) => {
        dispatch(setBodyWeight(weight))
        // Set protein target to 1g per pound of body weight
        dispatch(setDailyTarget(weight))
    }

    return (
        <Box padding="m">
            {/* Add your input components here */}
        </Box>
    )
}
