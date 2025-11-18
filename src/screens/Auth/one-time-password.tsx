import React, { useState, useContext } from "react";
import { View, Text, StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { Card } from "@/components/ui/card";
import { Button, ButtonSpinner, ButtonText } from "@/components/ui/button";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { WaveHandIcon } from "@/src/assets/Icons/SvgIcons";
import { useToastMessage } from "@/src/components/toast/toast-message";
import { AuthResponse } from "@/src/types/auth/auth-type";
import { registerUser } from "@/src/api/auth/auth-api-service";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { OtpInput } from "react-native-otp-entry";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  cardContainer: {
    padding: hp("3%"),
    width: wp("85%"),
  },
  heading: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: hp("2%"),
    gap: wp("2%"),
  },
  subHeading: {
    marginBottom: hp("3%"),
  },
  otpContainer: {
    marginVertical: hp("2%"),
    justifyContent: "center",
    alignItems: "center",
  },
});

const OneTimePassword = ({ navigation, route }: { navigation: any; route: any }) => {
  const { authData, otpCode } = route?.params || {};
  const [loading, setLoading] = useState(false);
  const [enteredOtp, setEnteredOtp] = useState("");

  const { isDark } = useContext(ThemeToggleContext);
  const globalStyle = useContext(StyleContext);
  const showToast = useToastMessage();
  const { setItem } = useDataStore();

  const handleSubmit = async () => {
    if (enteredOtp.length < 4) {
      return showToast({ type: "error", title: "Error", message: "Please enter all 4 digits" });
    }
    if (otpCode !== enteredOtp) {
      return showToast({ type: "error", title: "Error", message: "Invalid OTP" });
    }

    setLoading(true);
    const register: AuthResponse = await registerUser(authData);
    if (!register?.success) {
      setLoading(false);
      return showToast({
        type: "error",
        title: "Error",
        message: register?.message ?? "Something went wrong",
      });
    }

    await setItem("USERID", register?.userId);
    showToast({
      type: "success",
      title: "Success",
      message: register?.message ?? "Successfully registered",
    });
    setLoading(false);
    navigation.reset({ index: 0, routes: [{ name: "UserOnBoarding" }] });
  };

  return (
    <View style={[styles.container, globalStyle.appBackground]}>
      <Card size="md" variant="filled" style={[globalStyle.cardShadowEffect]}>
        <View style={styles.cardContainer}>
          {/* Header */}
          <View style={styles.heading}>
            <WaveHandIcon />
            <Text style={[globalStyle.heading2Text, globalStyle.themeTextColor]}>
              OTP Verification
            </Text>
          </View>

          <View style={styles.subHeading}>
            <Text style={[globalStyle.labelText, globalStyle.greyTextColor]}>
              Enter the 4-digit OTP sent to your registered email.
            </Text>
          </View>

          {/* OTP Input */}
          <View style={styles.otpContainer}>
            <OtpInput
              numberOfDigits={4}
              onTextChange={(code: string) => setEnteredOtp(code)}
              focusColor="#3B82F6"
              autoFocus
              theme={{
                containerStyle: {
                  width: wp("80%"),
                  justifyContent: "space-between",
                },
                pinCodeContainerStyle: {
                  width: wp("16%"),
                  height: hp("7%"),
                  borderRadius: wp("2%"),
                  backgroundColor: isDark ? "#1A2238" : "#F5F7FB",
                  borderWidth: 2,
                  borderColor: isDark ? "#2E3A57" : "#E5E7EB",
                },
                pinCodeTextStyle: {
                  color: isDark ? "#E2E8F0" : "#1E3A8A",
                  fontSize: wp("6%"),
                  textAlign: "center",
                  fontFamily: "OpenSans-Regular",
                },
              }}
            />
          </View>

          {/* Verify Button */}
          <Button
            size="lg"
            variant="solid"
            action="primary"
            style={[globalStyle.buttonColor, { marginTop: hp("4%") }]}
            onPress={handleSubmit}
            isDisabled={loading}
          >
            {loading && <ButtonSpinner color="#fff" size={wp("4%")} />}
            <ButtonText style={globalStyle.buttonText}>Verify OTP</ButtonText>
          </Button>
        </View>
      </Card>
    </View>
  );
};

export default OneTimePassword;
