import LottieView from "lottie-react-native";
import React, { useEffect } from "react";
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

const SWIPE_WIDTH = wp("90%");
const SWIPE_HEIGHT = hp("7%");
const KNOB_SIZE = SWIPE_HEIGHT - 8;

type SwipeButtonProps = {
    onConfirm: () => void;
    text?: string;
    isDisabled?: boolean;
    isReset?: boolean;
};

const SwipeButton: React.FC<SwipeButtonProps> = ({
    onConfirm,
    text = "Swipe to Confirm",
    isDisabled = false,
    isReset = false,
}) => {
    const translateX = useSharedValue(0);

    // Reset knob if parent sets isReset = true
    useEffect(() => {
        if (isReset) {
            translateX.value = withSpring(0);
        }
    }, [isReset]);

    const gestureHandler = useAnimatedGestureHandler({
        onStart: (_, ctx: any) => {
            if (isDisabled) return;
            ctx.startX = translateX.value;
        },
        onActive: (event, ctx: any) => {
            if (isDisabled) return;
            translateX.value = Math.min(
                Math.max(ctx.startX + event.translationX, 0),
                SWIPE_WIDTH - KNOB_SIZE - 8
            );
        },
        onEnd: () => {
            if (isDisabled) {
                translateX.value = withSpring(0);
                return;
            }

            if (translateX.value > SWIPE_WIDTH * 0.6) {
                translateX.value = withSpring(SWIPE_WIDTH - KNOB_SIZE - 8, {}, () => {
                    runOnJS(onConfirm)();
                });
            } else {
                translateX.value = withSpring(0);
            }
        },
    });

    const knobStyle = useAnimatedStyle(() => ({
        transform: [{ translateX: translateX.value }],
        opacity: isDisabled ? 0.5 : 1,
    }));

    const draggedStyle = useAnimatedStyle(() => ({
        width: translateX.value + KNOB_SIZE / 2 + 4,
    }));

    return (
        <View style={styles.container}>
            <View
                style={[
                    styles.swipeContainer,
                    { backgroundColor: isDisabled ? "#E5E7EB" : "#fff" },
                ]}
            >
                {/* Dragged portion */}
                <Animated.View
                    style={[
                        styles.dragged,
                        draggedStyle,
                        { backgroundColor: isDisabled ? "#9CA3AF" : "#22C55E" },
                    ]}
                />

                {/* Center text */}
                <Text
                    style={[
                        styles.label,
                        { color: isDisabled ? "#9CA3AF" : "#6B7280" },
                    ]}
                >
                    {text}
                </Text>

                {/* Knob */}
                <PanGestureHandler onGestureEvent={gestureHandler} enabled={!isDisabled}>
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
        borderRadius: SWIPE_HEIGHT / 2,
        justifyContent: "center",
        overflow: "hidden",
    },
    dragged: {
        position: "absolute",
        left: 0,
        height: SWIPE_HEIGHT,
        borderRadius: SWIPE_HEIGHT / 2,
    },
    label: {
        alignSelf: "center",
        fontSize: wp("4%"),
        fontWeight: "600",
    },
    knob: {
        position: "absolute",
        left: 4,
        width: KNOB_SIZE,
        height: KNOB_SIZE,
        borderRadius: KNOB_SIZE / 2,
        backgroundColor: "#8B5CF6",
        justifyContent: "center",
        alignItems: "center",
    },
});

export default SwipeButton;
