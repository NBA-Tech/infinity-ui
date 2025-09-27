import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import Logo from '../../assets/images/logo.png'
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
    <View style={styles.container}>
      {/* Infinity Logo with Animation */}
      <Animated.View style={[animatedStyle]}>
        <Image
          source={Logo} // place your uploaded logo as logo.png in assets
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>

      {/* App Title */}
      <Text style={styles.title}>The Infinity</Text>

      {/* Slogan */}
      <Text style={styles.slogan}>Beyond Limits, Into Possibilities</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // sleek black background
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: width * 0.5,
    height: width * 0.5,
  },
  title: {
    marginTop: 30,
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
    letterSpacing: 2,
  },
  slogan: {
    marginTop: 10,
    fontSize: 16,
    color: "#aaa",
    fontStyle: "italic",
  },
});
