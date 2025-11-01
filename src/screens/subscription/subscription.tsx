import React, { useState, useContext, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";
import { NavigationProp } from "@/src/types/common";
import { useSubscription } from "@/src/providers/subscription/subscription-context";
import { PaymentRequestModel } from "@/src/types/payment/payment-request-type";
import { generateRandomString } from "@/src/utils/utils";
import { useUserStore } from "@/src/store/user/user-store";
import { generatePaymentLinkAPI } from "@/src/api/payment/payment-api-service";
import { PLAN_DETAILS } from "@/src/constant/constants";
const Subscription = () => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);
  const [yearly, setYearly] = useState(false);
  const { getItem } = useDataStore();
  const showToast = useToastMessage();
  const navigation = useNavigation<NavigationProp>();
  const { refetchSubscription } = useSubscription();
  const { userDetails, getUserDetailsUsingID } = useUserStore();

  // ✅ Select plans dynamically
  const freePlan = PLAN_DETAILS.free;
  const paidPlan = yearly ? PLAN_DETAILS.premium.yearly : PLAN_DETAILS.premium.monthly;

  const generatePaymentPayload = async (): Promise<PaymentRequestModel> => {
    console.log(userDetails)
    const payload: PaymentRequestModel = {
      linkId: generateRandomString(20),
      linkAmount: paidPlan.price,
      linkCurrency: "INR",
      linkPurpose: paidPlan.planDescription,
      linkExpiryTime: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
      linkAutoReminders: true,
      linkPartialPayments: false,
      linkMinimumPartialAmount: 0,
      linkNotify: {
        send_email: true,
        send_sms: true,
      },
      linkMeta: {
        notify_url: "https://example.com/notify",
        return_url: "https://example.com/thankyou",
      },
      customerDetails: {
        customer_email: userDetails?.userAuthInfo?.email,
        customer_name: userDetails?.userAuthInfo?.username,
        customer_phone: userDetails?.userBusinessInfo?.businessPhoneNumber,
      },
    };
    return payload;
  };

  const updateSubscriptionDetails = async (payload: SubscriptionModel) => {
    const res = await addOrUpdateSubscriptionDetailsAPI(payload);
    if (!res.success) {
      return showToast({
        type: "error",
        title: "Error",
        message: res.message,
      });
    }
    showToast({
      type: "success",
      title: "Success",
      message: res.message,
    });
    refetchSubscription();
    navigation.reset({
      index: 0,
      routes: [{ name: "AuthStack", params: { screen: "MainTabs" } }],
    });
  };

  const handleSubscription = async (type: "free" | "paid") => {
    const userId = getItem("USERID");
    if (!userId) {
      return showToast({
        type: "error",
        title: "Error",
        message: "UserId not found, please login again.",
      });
    }

    let payload: SubscriptionModel;

    if (type === "paid") {
      const paymentPayload = await generatePaymentPayload();
      const linkResponse = await generatePaymentLinkAPI(paymentPayload);
      if (!linkResponse.success) {
        return showToast({
          type: "error",
          title: "Error",
          message: linkResponse.message,
        });
      }

      // ✅ Go to payment page and pass callback for subscription update
      return navigation.navigate("PaymentGateway", {
        paymentData: linkResponse.data,
        successCallBack: async () => {
          payload = {
            userId: userId,
            status: SubscriptionStatus.ACTIVE,
            planDetails: paidPlan,
          };
          await updateSubscriptionDetails(payload);
        },
      });
    } else {
      payload = {
        userId: userId,
        status: SubscriptionStatus.ACTIVE,
        planDetails: freePlan,
        isTrialUsed: true,
      };
      await updateSubscriptionDetails(payload);
    }
  };

  useEffect(() => {
    const userId = getItem("USERID");
    getUserDetailsUsingID(userId, showToast);
  }, []);

  return (
    <ImageBackground source={Background} resizeMode="cover" style={{ flex: 1 }}>
      <View style={styles.container}>
        <Image source={Logo} style={styles.logo} />

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

        <PricingToggle yearly={yearly} onChange={setYearly} />

        <View className="flex flex-row justify-between items-center gap-3">
          {/* 🆓 Free Plan Card */}
          <GradientCard colors={["#C77DFF", "#E0AAFF", "#F8F9FF"]} style={styles.planCard}>
            <View className="w-full items-center mb-6">
              <Text style={[globalStyles.heading2Text, { color: "#4B0082" }]}>
                {freePlan.planTitle}
              </Text>
              <Text style={[globalStyles.labelText, { color: "#5A189A" }]}>
                {freePlan.planDescription}
              </Text>
            </View>

            <View style={{ marginVertical: hp("2%") }}>
              {freePlan.featureList.map((f, i) => (
                <Text key={i} style={[globalStyles.smallText, { color: "#4B0082" }]}>
                  ✅ {f}
                </Text>
              ))}
            </View>

            <Button size="lg" style={{ backgroundColor: "#7F00FF" }} onPress={() => handleSubscription("free")}>
              <ButtonText style={[globalStyles.buttonText, { color: "#fff" }]}>
                Start Free Trial
              </ButtonText>
            </Button>
          </GradientCard>

          {/* 💎 Paid Plan Card */}
          <GradientCard colors={["#7F00FF", "#9D00FF", "#E100FF"]} style={styles.planCard}>
            <View className="w-full items-center mb-6">
              <Text style={[globalStyles.heading2Text, globalStyles.whiteTextColor]}>
                {paidPlan.planTitle}
              </Text>
              <Text style={[globalStyles.labelText, globalStyles.whiteTextColor]}>
                {paidPlan.planDescription}
              </Text>
            </View>

            <View style={{ marginVertical: hp("2%") }}>
              {paidPlan.featureList.map((f, i) => (
                <Text key={i} style={[globalStyles.smallText, globalStyles.whiteTextColor]}>
                  ✅ {f}
                </Text>
              ))}
            </View>

            <Button size="lg" style={{ backgroundColor: "#fff" }} onPress={() => handleSubscription("paid")}>
              <ButtonText style={[globalStyles.buttonText, { color: "#7F00FF" }]}>
                Purchase
              </ButtonText>
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
    width: wp("45%"),
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
});

export default Subscription;
