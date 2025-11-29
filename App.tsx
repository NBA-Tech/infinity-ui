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
import NotificationProvider from './src/providers/notification/notification-provider';
import { SubscriptionProvider } from './src/providers/subscription/subscription-context';
import SubscriptionLockOverlay from './src/components/subscription-overlay';
import { ConnectivityProvider } from './src/providers/internet-connection/connectivity-provider';
import NoInternetPopup from './src/components/nointernet-popup';
import { PortalProvider } from '@gorhom/portal';
import ToastManager from "toastify-react-native";


function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <>
      <ToastManager animationDuration={300} />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <PortalProvider>
          <ConnectivityProvider>
            <SafeAreaProvider>
              <DataStoreProvider>
                <ReloadProvider>
                  <AuthProvider>
                    <GlobalStyleProvider>
                      <ConfettiProvider>
                        <NotificationProvider>
                          <SubscriptionProvider>
                            <Navigation />
                            <NoInternetPopup />
                          </SubscriptionProvider>
                        </NotificationProvider>
                      </ConfettiProvider>
                    </GlobalStyleProvider>
                  </AuthProvider>
                </ReloadProvider>
              </DataStoreProvider>
            </SafeAreaProvider>
          </ConnectivityProvider>
        </PortalProvider>
      </GestureHandlerRootView>
    </>
  );
}


export default App;
