import React, { useContext, useRef, useState } from "react";
import {
    View,
    Text,
    Dimensions,
    TouchableOpacity,
    FlatList as RNFlatList,
    StyleSheet,
} from "react-native";
import Animated, {
    useSharedValue,
    useAnimatedScrollHandler,
    runOnJS,
} from "react-native-reanimated";
import {
    heightPercentageToDP as hp,
    widthPercentageToDP as wp,
} from "react-native-responsive-screen";
import GradientCard from "@/src/utils/gradient-card";
import LottieView from "lottie-react-native";
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/src/types/common";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { ThemeToggleContext,StyleContext } from "@/src/providers/theme/global-style-provider";
const { width } = Dimensions.get("window");
const AnimatedFlatList = Animated.createAnimatedComponent(RNFlatList);

const slides = [
    {
        id: "1",
        topAnimation: require("../../assets/animations/rainbow_wave.json"),
        mainAnimation: require("../../assets/animations/business_analytics.json"),
        title: "Business Insights",
        description:
            "Track revenue and performance with analytics tailored for photographers.",
    },
    {
        id: "2",
        topAnimation: require("../../assets/animations/rainbow_wave.json"),
        mainAnimation: require("../../assets/animations/get_in_touch.json"),
        title: "Stay Connected",
        description:
            "Manage all your client communications in one place with reminders and follow-ups.",
    },
    {
        id: "3",
        topAnimation: require("../../assets/animations/rainbow_wave.json"),
        mainAnimation: require("../../assets/animations/invoice_template_preview.json"),
        title: "Invoices & Templates",
        description:
            "Send professional invoices and branded templates directly from the app.",
    },
    {
        id: "4",
        topAnimation: require("../../assets/animations/rainbow_wave.json"),
        mainAnimation: require("../../assets/animations/work_management.json"),
        title: "Project Management",
        description:
            "Plan shoots, track progress, and organize deliverables seamlessly.",
    },
];

const FeatureSlide = () => {
    const scrollX = useSharedValue(0);
    const flatListRef = useRef<RNFlatList>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const navigation = useNavigation<NavigationProp>();
    const { setItem } = useDataStore();
    const globalStyles=useContext(StyleContext);

    // Track scroll with Reanimated
    const scrollHandler = useAnimatedScrollHandler({
        onScroll: (event) => {
            const index = Math.round(event.contentOffset.x / width);
            runOnJS(setCurrentIndex)(index);
            scrollX.value = event.contentOffset.x;
        },
    });

    const renderItem = ({ item, index }: any) => (
        <View style={[styles.slide, { width }]}>
            <View style={globalStyles.appBackground} className="">
                <View style={styles.content}>

                    <LottieView
                        source={item.mainAnimation}
                        autoPlay
                        loop
                        style={styles.mainAnimation}
                    />

                    <Text style={[styles.title,globalStyles.themeTextColor]}>{item.title}</Text>
                    <Text style={[styles.description,globalStyles.greyTextColor]}>{item.description}</Text>
                </View>
            </View>
            {currentIndex < slides.length - 1 ? (
                <View style={[styles.continueButton,{backgroundColor:'transparent'}]}>
                    <Text style={[styles.continueText,globalStyles.blueTextColor]}>
                        {"Swipe Right ->"}
                    </Text>
                </View>
            ) : (
                <TouchableOpacity
                    style={[styles.continueButton,globalStyles.buttonColor]}
                    onPress={async () => {
                        if (currentIndex < slides.length - 1) {
                            flatListRef.current?.scrollToIndex({
                                index: currentIndex + 1,
                                animated: true,
                            });
                            setCurrentIndex(currentIndex + 1);
                        } else {
                            await setItem("IS_NEW_DEVICE", true);
                            navigation.replace("Authentication"); // use replace for auth flow
                        }
                    }}
                >
                    <Text style={[styles.continueText,globalStyles.whiteTextColor]}>
                        Register →
                    </Text>
                </TouchableOpacity>
            )
            }

        </View>
    );

    return (
        <View style={{ flex: 1 }}>
            <AnimatedFlatList
                ref={flatListRef}
                data={slides}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                onScroll={scrollHandler}
                scrollEventThrottle={16}
                getItemLayout={(_, index) => ({
                    length: width,
                    offset: width * index,
                    index,
                })}
            />


            {/* Pagination Dots */}
            <View style={styles.pagination}>
                {slides.map((_, i) => (
                    <View
                        key={i}
                        style={[
                            styles.dot,
                            i === currentIndex ? styles.activeDot : null,
                        ]}
                    />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    slide: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    gradientBackground: {
        flex: 1,
        width: width,
        alignItems: "center",
        paddingHorizontal: wp("6%"),
        borderRadius: 0,
    },
    content: {
        justifyContent: "center",
        alignItems: "center",
    },
    topAnimation: {
        width: wp("30%"),
        height: wp("10%"),
        marginBottom: hp("2%"),
    },
    mainAnimation: {
        width: wp("100%"),
        height: wp("100%"),
        marginBottom: hp("3%"),
    },
    title: {
        fontSize: wp("7%"),
        fontFamily: "OpenSans-Bold",
        textAlign: "center",
        marginBottom: hp("1%"),
    },
    description: {
        fontSize: wp("4%"),
        fontFamily: "OpenSans-Regular",
        textAlign: "center",
        lineHeight: hp("3%"),
        marginHorizontal: wp("6%"),
    },
    continueButton: {
        position: "absolute",
        bottom: hp("5%"),
        right: wp("6%"),
        paddingVertical: hp("1.5%"),
        paddingHorizontal: wp("5%"),
        borderRadius: wp("5%"),
    },
    continueText: {
        fontSize: wp("4%"),
        fontFamily: "OpenSans-Bold",
    },
    pagination: {
        position: "absolute",
        bottom: hp("2%"),
        flexDirection: "row",
        alignSelf: "center",
    },
    dot: {
        width: wp("2%"),
        height: wp("2%"),
        borderRadius: wp("1%"),
        backgroundColor: "#aaa",
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: "#fff",
        width: wp("5%"),
    },
});

export default FeatureSlide;
