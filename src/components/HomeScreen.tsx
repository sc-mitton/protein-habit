import { Box, Text } from '@components/base'
import { useAppSelector } from '../store/hooks'

export const HomeScreen = () => {
    const { name } = useAppSelector(state => state.user)

    return (
        <Box flex={1} backgroundColor="mainBackground">
            <Box
                padding="m"
                backgroundColor="cardBackground"
                shadowColor="primaryText"
                shadowOffset={{ width: 0, height: 2 }}
                shadowOpacity={0.1}
                shadowRadius={4}
            >
                <Text variant="header">
                    Welcome, {name}
                </Text>
            </Box>
            {/* Add your protein tracking UI here */}
        </Box>
    )
}
