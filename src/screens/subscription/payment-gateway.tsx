import { savePaymentTransactionAPI } from "@/src/api/payment/payment-api-service";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { RootStackParamList } from "@/src/types/common";
import { PAYMENT_STATUS, PaymentModel } from "@/src/types/payment/payment-type";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState, useRef } from "react";
import { View, ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

type Props = NativeStackScreenProps<RootStackParamList, "PaymentGateway">;

const PaymentGateway = ({ navigation, route }: Props) => {
  const { paymentData, successCallBack } = route.params;
  const [loading, setLoading] = useState(true);
  const { getItem } = useDataStore();

  // ✅ Prevent multiple triggers
  const hasHandledPayment = useRef(false);

  const handleNavigationStateChange = async (navigationState: any) => {
    const currentUrl = navigationState.url;

    // check if already handled
    if (hasHandledPayment.current) return;

    // you can also replace "thankyou" with your real return_url
    if (currentUrl.includes("thankyou")) {
      hasHandledPayment.current = true; // stop duplicates

      const payload: PaymentModel = {
        userId: getItem("USERID"),
        amount: paymentData?.link_amount,
        currency: paymentData?.link_currency,
        linkId: paymentData?.link_id,
        linkUrl: paymentData?.link_url,
        cfPaymentId: paymentData?.cf_link_id,
        paymentStatus: PAYMENT_STATUS.SUCCESS,
        extraData: {
          customerName: paymentData?.customerDetails?.customer_name,
          customerEmail: paymentData?.customerDetails?.customer_email,
          customerPhone: paymentData?.customerDetails?.customer_phone,
        },
      };

      try {
        await savePaymentTransactionAPI(payload);
        successCallBack && successCallBack();
      } catch (err) {
        console.error("Payment save failed:", err);
      }
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      )}

      <WebView
        source={{ uri: paymentData?.link_url }}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
        startInLoadingState
        javaScriptEnabled
        domStorageEnabled
        style={styles.webview}
      />
    </SafeAreaView>
  );
};

export default PaymentGateway;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  webview: {
    flex: 1,
  },
  loaderContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.9)",
  },
});
