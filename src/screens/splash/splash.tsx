import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import GradientCard from "@/src/utils/gradient-card"; // <-- your gradient wrapper
import LottieView from "lottie-react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const scale = useSharedValue(0.8);
  const rotate = useSharedValue(0);

  useEffect(() => {
    // Pulse + rotate animation
    scale.value = withRepeat(
      withSequence(
        withTiming(1.2, { duration: 800 }),
        withTiming(0.9, { duration: 800 })
      ),
      -1,
      true
    );
    rotate.value = withRepeat(withTiming(360, { duration: 4000 }), -1, false);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <GradientCard style={styles.container} className="">
      {/* Infinity Logo with Animation */}
        <LottieView
        source={require("../../assets/animations/infinity.json")}
        autoPlay
        loop
        style={styles.logo}
      />

      {/* App Title */}
      <Text style={styles.title}>The Infinity</Text>

      {/* Slogan */}
      <Text style={styles.slogan}>Beyond Limits, Into Possibilities</Text>
    </GradientCard>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: width,
    paddingHorizontal: 20,
    borderRadius: 0,
  },
  logo: {
    width: wp("100%"),
    height: hp("30%"),
  },
  title: {
    marginTop: 30,
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
    textAlign: "center",
  },
  slogan: {
    marginTop: 10,
    fontSize: 16,
    color: "#f0f0f0",
    fontStyle: "italic",
    textAlign: "center",
  },
});
