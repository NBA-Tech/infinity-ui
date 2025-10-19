import React, { createContext, useEffect, useState, ReactNode } from 'react';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { useDataStore } from '../data-store/data-store-provider';
import { updateUserFcmTokenAPI } from '@/src/services/user/user-service';

type NotificationContextType = {
  fcmToken: string | null;
  hasPermission: boolean;
  setReqPermission: React.Dispatch<React.SetStateAction<boolean>>;
  requestNotificationPermission: () => Promise<void>;
};

export const NotificationContext = createContext<NotificationContextType>({
  fcmToken: null,
  hasPermission: false,
  setReqPermission: () => {},
  requestNotificationPermission: async () => {},
});

type Props = {
  children: ReactNode;
};

const NotificationProvider: React.FC<Props> = ({ children }) => {
  const { getItem, setItem } = useDataStore();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [reqPermission, setReqPermission] = useState<boolean>(false);



  const saveFcmTokenApi = async (fcmToken: string) => {
    const userId=getItem('USERID');
    if(!userId) return
    const saveResponse=await updateUserFcmTokenAPI({userId:userId,fcmToken:fcmToken})
  };

  const requestNotificationPermission = async (): Promise<void> => {
    try {
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) return;
      }

      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      const storedToken = getItem('FCM_TOKEN');

      if (enabled && !storedToken) {
        const token = await messaging().getToken();
        setFcmToken(token);
        setHasPermission(true);
        await saveFcmTokenApi(token);
        await setItem('FCM_TOKEN', token);
      } else if (storedToken) {
        setFcmToken(storedToken);
        setHasPermission(true);
      }
    } catch (error) {
      console.error('Notification permission error:', error);
    }
  };

  const handleForegroundNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ) => {
    const { title, body } = remoteMessage.notification ?? {};
    if (title && body) {
      Notifications.postLocalNotification({
        title,
        body,
        priority: 'high',
      });
    }
  };

  const handleBackgroundNotification = async (
    remoteMessage: FirebaseMessagingTypes.RemoteMessage
  ) => {
    const { title, body } = remoteMessage.notification ?? {};
    if (title && body) {
      Notifications.postLocalNotification({
        title,
        body,
        priority: 'high',
      });
    }
  };

  useEffect(() => {
    if (reqPermission) requestNotificationPermission();

    Notifications.registerRemoteNotifications();
    messaging().setBackgroundMessageHandler(handleBackgroundNotification);

    const unsubscribe = messaging().onMessage(handleForegroundNotification);
    return () => unsubscribe();
  }, [reqPermission]);

  return (
    <NotificationContext.Provider
      value={{
        fcmToken,
        hasPermission,
        setReqPermission,
        requestNotificationPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
