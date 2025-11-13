import React, { useState, useContext, useEffect } from "react";
import { View, Text, ImageBackground, Image, StyleSheet } from "react-native";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";

import Background from "../../assets/images/Background.png";
import Logo from "../../assets/images/logo.png";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { PricingToggle } from "./PricingToggle";
import GradientCard from "@/src/utils/gradient-card";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
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
import { SafeAreaView } from "react-native-safe-area-context";
import LottieView from "lottie-react-native";
import { Card } from "@/components/ui/card";
const Subscription = () => {
  const globalStyles = useContext(StyleContext);
  const { getItem } = useDataStore();
  const showToast = useToastMessage();
  const navigation = useNavigation<NavigationProp>();
  const { refetchSubscription } = useSubscription();
  const { userDetails, getUserDetailsUsingID } = useUserStore();
  const [loading, setLoading] = useState<String | null>(null);


  const generatePaymentPayload = async (planDetails: any): Promise<PaymentRequestModel> => {
    const payload: PaymentRequestModel = {
      linkId: generateRandomString(20),
      linkAmount: planDetails.price,
      linkCurrency: "INR",
      linkPurpose: planDetails.planDescription,
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
    console.log(payload)
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

  const handleSubscription = async (type: "FREE" | "PREMIUM_MONTHLY" | "PREMIUM_YEARLY") => {
    const userId = getItem("USERID");
    if (!userId) {
      return showToast({
        type: "error",
        title: "Error",
        message: "UserId not found, please login again.",
      });
    }
    setLoading(type);

    let payload: SubscriptionModel;
    try {


      if (type !== "FREE") {
        const paymentPayload = await generatePaymentPayload(PLAN_DETAILS?.premium[type]);
        const linkResponse = await generatePaymentLinkAPI(paymentPayload);
        if (!linkResponse.success) {
          return showToast({
            type: "error",
            title: "Error",
            message: linkResponse.message,
          });
        }
        setLoading(null);

        // ✅ Go to payment page and pass callback for subscription update
        return navigation.navigate("PaymentGateway", {
          paymentData: linkResponse.data,
          successCallBack: async () => {
            payload = {
              userId: userId,
              status: SubscriptionStatus.ACTIVE,
              planDetails: PLAN_DETAILS?.premium[type],
            };
            await updateSubscriptionDetails(payload);
          },
        });
      } else {
        payload = {
          userId: userId,
          status: SubscriptionStatus.ACTIVE,
          planDetails: PLAN_DETAILS?.FREE,
          isTrialUsed: true,
        };
        await updateSubscriptionDetails(payload);
        setLoading(null);
      }
    }
    finally{
      setLoading(null);
    }
  };

  useEffect(() => {
    const userId = getItem("USERID");
    // getUserDetailsUsingID(userId, showToast);
  }, []);

  return (
    <SafeAreaView style={globalStyles.appBackground}>
      <View style={{ marginVertical: hp('4%'), marginHorizontal: wp('2%') }}>
        <View className="flex flex-col">
          <View className="justify-center items-center">
            <Text
              style={[
                globalStyles.extraLargeText,
                globalStyles.blueTextColor,
                { textAlign: "center" },
              ]}
            >
              Get Premium
            </Text>

            <Text
              style={[
                globalStyles.normalText,
                globalStyles.greyTextColor,
                { textAlign: "center", width: "80%" },
              ]}
            >
              Unlock advanced features and insights with our Premium CRM Subscription
            </Text>
          </View>
          <View>
            <LottieView
              source={require('../../assets/animations/premium.json')}
              autoPlay
              loop
              style={styles.mainAnimation}
            />

          </View>
          <View style={{ gap: hp('2%') }}>
            {Object.values(PLAN_DETAILS.premium).map((plan, index) => (
              <Card style={globalStyles.cardShadowEffect}>
                <View className="flex flex-row justify-between items-center">
                  <View className="flex flex-col gap-3 m-3" style={{ width: wp('60%') }}>
                    <Text style={[globalStyles.headingText, globalStyles.themeTextColor]}>
                      {plan?.planName}
                    </Text>
                    <Text style={[globalStyles.heading3Text, globalStyles.blueTextColor]}>
                      {plan?.planDescription}
                    </Text>
                  </View>
                  <View>
                    <Button
                      size="lg"
                      variant="solid"
                      action="primary"
                      style={globalStyles.buttonColor}
                      onPress={() => handleSubscription(plan?.planId)}
                      isDisabled={loading != null}
                    >
                      {loading == plan?.planId && (
                        <ButtonSpinner color={"#fff"} size={wp("4%")} />
                      )}
                      <ButtonText style={globalStyles.buttonText}>
                        Buy
                      </ButtonText>
                    </Button>

                  </View>

                </View>

              </Card>

            ))}

          </View>
          <View style={{ marginVertical: hp('5%') }}>
            <Button
              size="lg"
              variant="solid"
              action="primary"
              style={globalStyles.buttonColor}
              onPress={() => handleSubscription("FREE")}
              isDisabled={loading != null}
            >
              {loading == "FREE" && (
                <ButtonSpinner color={"#fff"} size={wp("4%")} />
              )}
              <ButtonText style={globalStyles.buttonText}>
                Start 7 days free trial
              </ButtonText>
            </Button>

          </View>

        </View>

      </View>

      <View
        style={{
          position: "absolute",
          bottom: 20,
          width: "100%",
          alignItems: "center",
          paddingHorizontal: 20,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 12,
            color: "#6B7280", // neutral grey
            lineHeight: 18,
          }}
        >
          By purchasing, you agree to our{" "}
          <Text style={{ color: "#2563EB", fontWeight: "600" }}>
            Terms and Conditions
          </Text>{" "}
          and{" "}
          <Text style={{ color: "#2563EB", fontWeight: "600" }}>
            Privacy Policy
          </Text>
          . Learn how we use your data in our policies.
        </Text>
      </View>
    </SafeAreaView >

  );
};

const styles = StyleSheet.create({
  mainAnimation: {
    width: wp("100%"),
    height: wp("60%"),
  },

});

export default Subscription;
