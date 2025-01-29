import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';
import { ThemeProvider } from '@shopify/restyle';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import lightTheme, { darkTheme } from '@theme/index';
import { Box, Text } from '@components/base';
import { store, persistor } from './src/store';

export default function App() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? darkTheme : lightTheme;

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <Box flex={1} backgroundColor="mainBackground" alignItems="center" justifyContent="center">
            <Text variant="header">Welcome</Text>
            <Box marginTop="m">
              <Text variant="body">A minimalist design system</Text>
            </Box>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </Box>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
