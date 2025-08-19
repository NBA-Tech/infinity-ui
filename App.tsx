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
import GlobalStyleProvider from './src/providers/theme/GlobalStyleProvider';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <GluestackUIProvider mode="light">
      <SafeAreaProvider>
        <GlobalStyleProvider>
          <Navigation />
        </GlobalStyleProvider>

      </SafeAreaProvider>
    </GluestackUIProvider>
  );
}


export default App;
