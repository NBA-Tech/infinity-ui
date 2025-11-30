import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/common";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

type Props = NativeStackScreenProps<RootStackParamList, "Success">;

export default function Success({ route, navigation }: Props) {
  const { text } = route.params || {};
  const confettiRef = useRef<any>(null);

  useEffect(() => {
    if (confettiRef.current) {
      confettiRef.current.start();
    }
  }, []);

  const handleGoBack = () => navigation.pop(2);

  return (
    <View style={styles.container}>

      {/* 🎉 Success Animation */}
      <LottieView
        source={require("../../assets/animations/success.json")}
        autoPlay
        loop={false}
        style={styles.lottie}
      />

      {/* ✔ Success Text */}
      <Text style={styles.text}>{text}</Text>

      {/* 🔙 Go Back Button */}
      <TouchableOpacity style={styles.button} onPress={handleGoBack}>
        <Text style={styles.buttonText}>Go Back</Text>
      </TouchableOpacity>

      {/* 🎊 Confetti */}
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
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: wp("6%"),
  },
  lottie: {
    width: wp("45%"),
    height: wp("45%"),
    marginBottom: hp("3%"),
  },
  text: {
    fontSize: wp("6%"),
    color: "#FFFFFF",
    fontFamily: "OpenSans-Bold",
    textAlign: "center",
    marginVertical: hp("2%"),
    paddingHorizontal: wp("5%"),
  },
  button: {
    marginTop: hp("3%"),
    backgroundColor: "#2E7D32",
    paddingVertical: hp("1.8%"),
    paddingHorizontal: wp("10%"),
    borderRadius: wp("3%"),
    alignSelf: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: wp("4%"),
    fontFamily: "OpenSans-SemiBold",
  },
});
