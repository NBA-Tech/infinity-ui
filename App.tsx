/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import './global.css';
import { GluestackUIProvider } from './components/ui/gluestack-ui-provider';
import { StatusBar, StyleSheet, useColorScheme, View, Text } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Navigation from './src/navigation/navigation';
import GlobalStyleProvider from './src/providers/theme/global-style-provider';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DataStoreProvider } from './src/providers/data-store/data-store-provider';
import { AuthProvider } from './src/context/auth-context/auth-context';
import { ConfettiProvider } from './src/providers/confetti/confetti-provider';
import ReloadProvider from './src/providers/reload/reload-context';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GluestackUIProvider mode="light">
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <DataStoreProvider>
            <ReloadProvider>
              <AuthProvider>
                <GlobalStyleProvider>
                  <ConfettiProvider>
                    <Navigation />
                  </ConfettiProvider>
                </GlobalStyleProvider>
              </AuthProvider>
            </ReloadProvider>
          </DataStoreProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </GluestackUIProvider>
  );
}


export default App;
