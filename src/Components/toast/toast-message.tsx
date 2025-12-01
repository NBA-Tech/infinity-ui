import { useToast, Toast, ToastTitle, ToastDescription } from "@/components/ui/toast";
import { View, StyleSheet } from "react-native";
import { useRef } from "react";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export const useToastMessage = () => {
  const toast = useToast();
  const currentToastIdRef = useRef<any>(null);

  const icons = {
    success: "check-circle-outline",
    info: "info-outline",
    warning: "warning-amber",
    error: "error-outline"
  };

  const toastStylesByType:Record<string, any> = {
    success: {
      borderColor: '#4CAF50',
      backgroundColor: '#f1fdf3',
      iconColor: '#2E7D32',
      titleColor: '#1B5E20',
    },
    info: {
      borderColor: '#2196F3',
      backgroundColor: '#eef7fd',
      iconColor: '#1565C0',
      titleColor: '#0D47A1',
    },
    warning: {
      borderColor: '#FF9800',
      backgroundColor: '#fff7e6',
      iconColor: '#EF6C00',
      titleColor: '#E65100',
    },
    error: {
      borderColor: '#E53935',
      backgroundColor: '#fef6f6',
      iconColor: '#D32F2F',
      titleColor: '#B71C1C',
    }
  };

  const showToast = ({
    type = "error",
    title = "Error",
    message = "Something went wrong.",
  }) => {
    if (currentToastIdRef.current) {
      toast?.close(currentToastIdRef.current);
      currentToastIdRef.current = null;
    }

    const toastId = Math.random().toString();
    currentToastIdRef.current = toastId;

    const theme = toastStylesByType[type] || toastStylesByType.error;

    toast.show({
      id: toastId,
      placement: "top",
      duration: 3000,
      render: ({ id }:{ id: string }) => (
        <Toast
          action={type}
          variant="outline"
          nativeID={`toast-${id}`}
          style={[
            styles.toastContainer,
            { backgroundColor: theme.backgroundColor, borderColor: theme.borderColor },
          ]}
        >
          <View style={styles.toastContent}>
            {/* <Icon as={HelpCircleIcon} style={[styles.icon, { color: theme.iconColor }]} /> */}
            <MaterialIcons name={icons?.[type] || icons?.success} size={24} style={[styles.icon, { color: theme.iconColor }]} />
            <View style={styles.textContainer}>
              <ToastTitle style={[styles.title, { color: theme.titleColor }]}>{title}</ToastTitle>
              <ToastDescription style={styles.message}>{message}</ToastDescription>
            </View>
          </View>
        </Toast>
      ),
      onCloseComplete: () => {
        if (currentToastIdRef.current === toastId) {
          currentToastIdRef.current = null;
        }
      }
    });
  };

  return showToast;
};
const styles = StyleSheet.create({
  toastContainer: {
    paddingVertical: 20,      // ⬆️ more height
    paddingHorizontal: 20,    // wider padding
    borderWidth: 1,
    borderRadius: 14,         // slightly more rounded
    maxWidth: 480,            // wider container
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 8,
    elevation: 8,
  },

  toastContent: {
    flexDirection: 'row',
    alignItems: 'center',       // center vertically now
    gap: 14,                    // spacing between icon + text
    flex: 1,
  },

  icon: {
    marginTop: 2,
  },

  title: {
    fontSize: 18,               // ⬆️ bigger title
    fontFamily: 'OpenSans-Bold',
    marginBottom: 6,
  },

  message: {
    fontSize: 15,               // ⬆️ slightly bigger message
    fontFamily: 'OpenSans-Regular',
    color: '#333',
    lineHeight: 22,             // ⬆️ nice readability
  },
});
