import LottieView from "lottie-react-native";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { PanGestureHandler } from "react-native-gesture-handler";
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    useAnimatedGestureHandler,
    withSpring,
    runOnJS,
} from "react-native-reanimated";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

const SWIPE_WIDTH = wp("90%");
const SWIPE_HEIGHT = hp("7%");
const KNOB_SIZE = SWIPE_HEIGHT - 8;

type SwipeButtonProps = {
    onConfirm: () => void;
    text?: string;
};

const SwipeButton: React.FC<SwipeButtonProps> = ({ onConfirm, text = "Swipe to Confirm" }) => {
    const translateX = useSharedValue(0);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
            ctx.startX = translateX.value;
        },
        onActive: (event, ctx: any) => {
            translateX.value = Math.min(Math.max(ctx.startX + event.translationX, 0), SWIPE_WIDTH - KNOB_SIZE - 8);
        },
        onEnd: () => {
            if (translateX.value > SWIPE_WIDTH * 0.6) {
                translateX.value = withSpring(SWIPE_WIDTH - KNOB_SIZE - 8, {}, () => {
                    runOnJS(onConfirm)();
                });
            } else {
                translateX.value = withSpring(0);
            }
        },
    });

    // Knob style
    const knobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
    }));

    // Dragged background style
    const draggedStyle = useAnimatedStyle(() => ({
        width: translateX.value + KNOB_SIZE / 2 + 4,
    }));

    return (
        <View style={styles.container}>
            <View style={styles.swipeContainer}>
                {/* Dragged portion */}
                <Animated.View style={[styles.dragged, draggedStyle]} />

                {/* Lottie Animation Center */}
                <View style={styles.lottieContainer}>

                </View>

                {/* Swipe text */}
                <Text style={styles.label}>{text}</Text>

                {/* Knob */}
                <PanGestureHandler onGestureEvent={gestureHandler}>
                    <Animated.View style={[styles.knob, knobStyle]}>
                        <LottieView
                            source={require("../assets/animations/swipe_right.json")}
                            autoPlay
                            loop
                            style={{ width: wp("15%"), height: hp("7%") }}
                        />
                    </Animated.View>
                </PanGestureHandler>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: "center",
        marginVertical: hp("2%"),
    },
    swipeContainer: {
        width: SWIPE_WIDTH,
        height: SWIPE_HEIGHT,
        backgroundColor: "#fff",
        borderRadius: SWIPE_HEIGHT / 2,
        justifyContent: "center",
        overflow: "hidden",
    },
    dragged: {
        position: "absolute",
        left: 0,
        height: SWIPE_HEIGHT,
        backgroundColor: "#22C55E", // green
        borderRadius: SWIPE_HEIGHT / 2,
    },
    lottieContainer: {
        position: "absolute",
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },
    label: {
        alignSelf: "center",
        fontSize: wp("4%"),
        fontWeight: "600",
        color: "#6B7280",
    },
    knob: {
        position: "absolute",
        left: 4,
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: "#8B5CF6", // purple knob
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SwipeButton;
