import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

const BUTTON_WIDTH = wp("90%");
const BUTTON_HEIGHT = hp("6%");

type ClickButtonProps = {
  onConfirm: () => void;
  text?: string;
  isDisabled?: boolean;
};

const ClickButton: React.FC<ClickButtonProps> = ({
  onConfirm,
  text = "Tap to Confirm",
  isDisabled = false,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!isDisabled) scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    if (!isDisabled) scale.value = withSpring(1);
  };

  const handlePress = () => {
    if (isDisabled) return;
    scale.value = withTiming(0.9, { duration: 100 }, () => {
      scale.value = withSpring(1);
    });
    onConfirm();
  };

  return (
    <View style={styles.fixedBottomContainer}>
      <Animated.View style={[styles.animatedContainer, animatedStyle]}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={handlePressIn}
          onPressOut={handlePressOut}
          onPress={handlePress}
          disabled={isDisabled}
          style={[
            styles.button,
            {
              backgroundColor: isDisabled ? "#E5E7EB" : "#22C55E",
              borderColor: isDisabled ? "#D1D5DB" : "#15803D",
            },
          ]}
        >
          <Text
            style={[
              styles.label,
              { color: isDisabled ? "#9CA3AF" : "#FFFFFF" },
            ]}
          >
            {text}
          </Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  fixedBottomContainer: {
    position: "absolute",
    bottom: hp("1%"),
    left: 0,
    right: 0,
    alignItems: "center",
    paddingHorizontal: wp("5%"),
  },
  animatedContainer: {
    borderRadius: BUTTON_HEIGHT / 2,
    overflow: "hidden",
    width: "100%",
  },
  button: {
    width: BUTTON_WIDTH,
    height: BUTTON_HEIGHT,
    borderRadius: BUTTON_HEIGHT / 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.2,
  },
  label: {
    fontSize: wp("4%"),
    fontWeight: "600",
  },
});

export default ClickButton;
