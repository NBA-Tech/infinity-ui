import React, { useState, useContext } from "react";
import { View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import Background from "../../assets/images/Background.png";
import Logo from "../../assets/images/logo.png";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { PricingToggle } from "./PricingToggle";
import GradientCard from "@/src/utils/gradient-card";
import { Button, ButtonText } from "@/components/ui/button";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { SubscriptionModel, SubscriptionStatus } from "@/src/types/subscription/subscription-type-";
import { useToastMessage } from "@/src/components/toast/toast-message";
import { addOrUpdateSubscriptionDetailsAPI } from "@/src/api/subscription/subscription-api-service";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/src/types/common";
const Subscription = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [yearly, setYearly] = useState(false);
    const { getItem } = useDataStore();
    const showToast = useToastMessage()
    const navigation = useNavigation<NavigationProp>()


    const handlePayment = async () => {
        return true
    }


    const handleSubscription = async (subscription_type: string) => {
        let payload: SubscriptionModel = {
            userId: getItem("USERID"),
            startDate: new Date(),
            createdAt: new Date(),
        }
        if (!payload?.userId) {
            showToast({
                type: "error",
                title: "Error",
                message: "UserId not found please login again",
            })
            return
        }
        if (subscription_type == "paid") {
            const isPaid = await handlePayment()
            if (isPaid) {
                payload = {
                    ...payload,
                    endDate: yearly ? new Date(new Date().setFullYear(new Date().getFullYear() + 1)) : new Date(new Date().setDate(new Date().getDate() + 30)),
                    status: SubscriptionStatus.ACTIVE,
                    planDetails: {
                        planName: "Premium Plan",
                        planDescription: yearly ? "1 year premium plan" : "30 days premium plan",
                        durationInDays: yearly ? 365 : 30,
                        price: yearly ? 99 : 9
                    }
                }
            }
        }
        else if (subscription_type == "free") {
            payload = {
                ...payload,
                endDate: new Date(new Date().setDate(new Date().getDate() + 15)),
                status: SubscriptionStatus.TRIAL,
                planDetails: {
                    planName: "Free Trial",
                    planDescription: "15 days free trial",
                    durationInDays: 15,
                    price: 0
                }
            }
        }
        const updateSubscription = await addOrUpdateSubscriptionDetailsAPI(payload)
        if (!updateSubscription.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: updateSubscription.message ?? "Something went wrong"
            })
        }
        showToast({
            type: "success",
            title: "Success",
            message: updateSubscription.message ?? "Successfully subscribed"
        })
        navigation.reset({
            index: 0,
            routes: [{ name: "AuthStack", params: { screen: "MainTabs" } }],
        })
    }

    return (
        <ImageBackground source={Background} resizeMode="cover" style={{ flex: 1 }}>
            <View style={styles.container}>
                {/* Logo Section */}
                <Image source={Logo} style={styles.logo} />

                {/* Header */}
                <Text style={[globalStyles.whiteTextColor, globalStyles.headingText, styles.heading]}>
                    Upgrade to Premium
                </Text>
                <Text
                    style={[
                        globalStyles.whiteTextColor,
                        globalStyles.labelText,
                        styles.subHeading,
                    ]}
                >
                    Unlock exclusive features and benefits
                </Text>

                {/* Toggle */}
                <PricingToggle yearly={yearly} onChange={setYearly} />
                <View className="flex flex-row justify-between items-center gap-3">

                    {/* 🌸 Free Trial Card */}
                    <GradientCard
                        colors={["#C77DFF", "#E0AAFF", "#F8F9FF"]} // Soft lavender-pink-white gradient
                        style={styles.planCard}
                    >
                        <View className="w-full items-center mb-6">
                            <Text style={[globalStyles.heading2Text, { color: "#4B0082" }]}>
                                15 Days Free Trial
                            </Text>
                            <Text style={[globalStyles.labelText, { color: "#5A189A" }]}>
                                No credit card required
                            </Text>
                        </View>

                        <View className="w-full flex flex-col items-start gap-2" style={{ marginVertical: hp('2%') }}>
                            <Text style={[globalStyles.smallText, { color: "#4B0082" }]}>✅ Full feature access</Text>
                            <Text style={[globalStyles.smallText, { color: "#4B0082" }]}>✅ Ad-free experience</Text>
                            <Text style={[globalStyles.smallText, { color: "#4B0082" }]}>✅ Cancel anytime</Text>
                        </View>

                        <Button size="lg" variant="solid" action="primary" style={{ backgroundColor: "#7F00FF" }} onPress={() => handleSubscription("free")}>
                            <ButtonText style={[globalStyles.buttonText, { color: "#fff" }]}>Start Free Trial</ButtonText>
                        </Button>
                    </GradientCard>

                    {/* 💎 Paid Subscription Card */}
                    <GradientCard
                        colors={["#7F00FF", "#9D00FF", "#E100FF"]} // Rich violet-magenta gradient
                        style={styles.planCard}
                    >
                        <View className="w-full items-center mb-6">
                            <Text style={[globalStyles.heading2Text, globalStyles.whiteTextColor]}>
                                {yearly ? "$10 / Year" : "$1 / Month"}
                            </Text>
                            <Text style={[globalStyles.labelText, globalStyles.whiteTextColor]}>
                                {yearly
                                    ? "Billed annually"
                                    : "Billed monthly"}
                            </Text>
                        </View>

                        <View className="w-full flex flex-col items-start gap-2" style={{ marginVertical: hp('2%') }}>
                            <Text style={[globalStyles.smallText, globalStyles.whiteTextColor]}>✅ Ad-free experience</Text>
                            <Text style={[globalStyles.smallText, globalStyles.whiteTextColor]}>✅ Premium features unlocked</Text>
                            <Text style={[globalStyles.smallText, globalStyles.whiteTextColor]}>✅ Early updates & priority support</Text>
                            <Text style={[globalStyles.smallText, globalStyles.whiteTextColor]}>✅ Early updates & priority</Text>
                        </View>

                        <Button size="lg" variant="solid" action="primary" style={{ backgroundColor: "#fff" }} onPress={() => handleSubscription("paid")}>
                            <ButtonText style={[globalStyles.buttonText, { color: "#7F00FF" }]}>Purchase</ButtonText>
                        </Button>
                    </GradientCard>

                </View>



            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        paddingHorizontal: wp("6%"),
    },
    logo: {
        width: wp("28%"),
        height: wp("28%"),
        resizeMode: "contain",
        marginBottom: hp("2%"),
    },
    heading: {
        marginTop: hp("2%"),
    },
    subHeading: {
        textAlign: "center",
        marginBottom: hp("3%"),
        opacity: 0.9,
    },
    planCard: {
        width: wp('45%'),
        borderRadius: wp("4%"),
        paddingVertical: hp("2.5%"),
        paddingHorizontal: wp("4%"),
        marginTop: hp("4%"),
        shadowColor: "#E100FF",
        shadowOpacity: 0.4,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 6 },
        elevation: 6,
    },
    planPrice: {
        color: "#FFFFFF",
        fontSize: wp("6%"),
        fontWeight: "700",
        textAlign: "center",
    },
    planNote: {
        color: "rgba(255,255,255,0.9)",
        fontSize: wp("3.5%"),
        textAlign: "center",
        marginTop: hp("0.8%"),
    },
    features: {
        marginTop: hp("2%"),
        width: "100%",
    },
    featureText: {
        color: "#FFF",
        fontSize: wp("3.8%"),
        textAlign: "center",
        marginVertical: hp("0.3%"),
        opacity: 0.95,
    },
});

export default Subscription;
