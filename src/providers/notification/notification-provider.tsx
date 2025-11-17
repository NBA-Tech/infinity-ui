import React, { createContext, useEffect, useState, ReactNode } from 'react';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { PermissionsAndroid, Platform } from 'react-native';
import { Notifications } from 'react-native-notifications';
import { useDataStore } from '../data-store/data-store-provider';
import { updateNotificationStatusAPI, updateUserFcmTokenAPI } from '@/src/services/user/user-service';
import { useUserStore } from '@/src/store/user/user-store';

type NotificationContextType = {
  fcmToken: string | null;
  hasPermission: boolean;
  setReqPermission: React.Dispatch<React.SetStateAction<boolean>>;
  requestNotificationPermission: (status?: boolean) => Promise<void>;
};

export const NotificationContext = createContext<NotificationContextType>({
  fcmToken: null,
  hasPermission: false,
  setReqPermission: () => { },
  requestNotificationPermission: async () => { },
});

type Props = {
  children: ReactNode;
};

const NotificationProvider: React.FC<Props> = ({ children }) => {
  const { getItem, setItem } = useDataStore();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState<boolean>(false);
  const [reqPermission, setReqPermission] = useState<boolean>(false);
  const { userDetails, setUserDetails } = useUserStore()



  const saveFcmTokenApi = async (fcmToken: string) => {
    const userId = getItem('USERID');
    if (!userId) return
    const saveResponse = await updateUserFcmTokenAPI({ userId: userId, fcmToken: fcmToken })
  };

  const updateNotificationStatus = async (status: boolean) => {
    const userID = getItem('USERID');
    if (!userID) return
    const updated = {
      ...userDetails,
      userAuthInfo: {
        ...userDetails?.userAuthInfo,
        notificationStatus: status,
      },
    };
    console.log(updated)
    setUserDetails(updated);
    const saveResponse = await updateNotificationStatusAPI(userID, status)

  }

  const requestNotificationPermission = async (status?: boolean): Promise<void> => {
    try {
      // -------------------------------------------------------
      // CASE A: If status === false → Only update the status
      // -------------------------------------------------------
      if (status != userDetails?.userAuthInfo?.notificationStatus) {
        console.log("Status is false → Only updating notification status");
        await updateNotificationStatus(status);
        return;
      }

      // -------------------------------------------------------
      // CASE B: Normal flow → Ask permission + Save token
      // -------------------------------------------------------

      // Android permission
      if (Platform.OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.log("Notification permission denied");
          return;
        }
      }

      // FCM permission
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      const storedToken = getItem('FCM_TOKEN');

      if (enabled) {
        // First time permission granted → No token in storage
        if (!storedToken) {
          const token = await messaging().getToken();

          setFcmToken(token);
          setHasPermission(true);

          await updateNotificationStatus(status);
          await saveFcmTokenApi(token);

          await setItem('FCM_TOKEN', token);

          console.log("New FCM token saved:", token);
        }
        else {
          // Token already stored
          setFcmToken(storedToken);
          setHasPermission(true);

          console.log("Loaded stored FCM token:", storedToken);
        }
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
