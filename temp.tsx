import React, { useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";

export default function PaymentSuccess() {
  const confettiRef = useRef<any>(null);

  const handleSuccess = () => {
    confettiRef.current.start();
  };

  return (
    <View style={styles.container}>
      {/* ✅ Green Tick Animation */}
      <LottieView
        source={require("./Success.json")} // Download a green check animation from LottieFiles
        autoPlay
        loop={false}
        style={{ width: 200, height: 200 }}
      />

      {/* 🎉 Success Text */}
      <Text style={styles.text}>Payment Successful!</Text>

      {/* 🔘 Simulate Button */}
      <TouchableOpacity style={styles.button} onPress={handleSuccess}>
        <Text style={styles.buttonText}>Celebrate 🎉</Text>
      </TouchableOpacity>

      {/* 🎊 Confetti Blast */}
      <ConfettiCannon
        count={350}
        origin={{ x: -10, y: 0 }}
        fadeOut={true}
        autoStart={false}
        ref={confettiRef}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4CAF50", // Green background
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 20,
  },
  button: {
    marginTop: 30,
    backgroundColor: "#2E7D32",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
  },
});
