import { createTheme } from '@shopify/restyle'

const palette = {
    gray50: '#fafafa',
    gray100: '#f4f4f5',
    gray200: '#e4e4e7',
    gray300: '#d4d4d8',
    gray400: '#a1a1aa',
    gray500: '#71717a',
    gray600: '#52525b',
    gray700: '#3f3f46',
    gray800: '#27272a',
    gray900: '#18181b',
}

// Light theme
const lightTheme = createTheme({
    colors: {
        mainBackground: palette.gray50,
        cardBackground: palette.gray100,
        secondaryCardBackground: palette.gray200,
        primaryText: palette.gray900,
        secondaryText: palette.gray600,
        borderColor: palette.gray200,
    },
    spacing: {
        xs: 4,
        s: 8,
        m: 16,
        l: 24,
        xl: 32,
    },
    textVariants: {
        header: {
            fontWeight: 'bold',
            fontSize: 28,
            lineHeight: 34,
            color: 'primaryText',
        },
        subheader: {
            fontWeight: '600',
            fontSize: 20,
            lineHeight: 28,
            color: 'primaryText',
        },
        body: {
            fontSize: 16,
            lineHeight: 24,
            color: 'primaryText',
        },
        label: {
            fontSize: 14,
            lineHeight: 20,
            color: 'secondaryText',
        },
    },
})

// Dark theme
export const darkTheme: Theme = {
    ...lightTheme,
    colors: {
        mainBackground: palette.gray900,
        cardBackground: palette.gray800,
        secondaryCardBackground: palette.gray700,
        primaryText: palette.gray50,
        secondaryText: palette.gray400,
        borderColor: palette.gray700,
    },
}

export type Theme = typeof lightTheme
export default lightTheme

// ReStyle type augmentation
declare module '@shopify/restyle' {
    type ThemeType = Theme
}
