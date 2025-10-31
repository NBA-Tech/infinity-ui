import { RootStackParamList } from "@/src/types/common";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import React, { useState } from "react";
import { View, ActivityIndicator, SafeAreaView, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

type Props = NativeStackScreenProps<RootStackParamList, "PaymentGateway">;
const PaymentGateway = ({ navigation, route }: Props) => {
  const { paymentData } = route.params;
  console.log(paymentData);
  const [loading, setLoading] = useState(true);

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
