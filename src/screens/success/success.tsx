import React, { useRef, useEffect } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import ConfettiCannon from "react-native-confetti-cannon";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "@/src/types/common";


type Props = NativeStackScreenProps<RootStackParamList, "Success">;

export default function Success({ route, navigation }: Props) {
    const { text } = route.params || {};
    const confettiRef = useRef<any>(null);

    // 🎉 Automatically trigger confetti on mount
    useEffect(() => {
        if (confettiRef.current) {
            confettiRef.current.start();
        }
    }, []);

    return (
        <View style={styles.container}>
            {/* ✅ Green Tick Animation */}
            <LottieView
                source={require("../../assets/animations/success.json")}
                autoPlay
                loop={false}
                style={{ width: 200, height: 200 }}
            />

            {/* 🎉 Success Text */}
            <Text style={styles.text}>{text}</Text>

            {/* 🔙 Go Back Button */}
            <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.buttonText}>Go Back</Text>
            </TouchableOpacity>

            {/* 🎊 Confetti Blast */}
            <ConfettiCannon
                count={450}
                origin={{ x: -10, y: 0 }}
                fadeOut={true}
                autoStart={false} // manually triggered via useEffect
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
        fontWeight: "600",
    },
});
