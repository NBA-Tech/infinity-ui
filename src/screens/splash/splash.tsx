import React, { useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions, Platform } from "react-native";
import LottieView from "lottie-react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { GLOBALSTATUS, NavigationProp } from "@/src/types/common";
import { Card } from "@/components/ui/card";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { Spinner } from "@/components/ui/spinner";
import { scaleFont } from "@/src/styles/global";

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const { isInitialized, getItem } = useDataStore();
  const navigation = useNavigation<NavigationProp>();
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);

  useEffect(() => {
    const checkNavigation = async () => {
      if (!isInitialized) return;
      const isNewDevice = getItem("IS_NEW_DEVICE");
      const isAuthenticated = getItem("isAuthenticated");
      if (isAuthenticated) {
        navigation.replace("AuthStack");
      } else if (!isNewDevice) {
        navigation.replace("UnauthStack", { screen: "FeatureSlide" });
      } else {
        navigation.replace("UnauthStack", { screen: "Authentication" });
      }
    };
    const timer = setTimeout(checkNavigation, 3000);
    return () => clearTimeout(timer);
  }, [navigation, isInitialized]);

  return (
    <View style={[styles.root, globalStyles.appBackground]}>
      {/* Center Section */}
      <View style={styles.centerContainer}>
        {/* Circular Logo Section */}
        <View style={[styles.logoCircle, { backgroundColor: isDark ? "#1A2235" : "#FFFFFF" }]}>
          <Image
            source={require("../../assets/images/logo.png")}
            resizeMode="contain"
            style={styles.logoImage}
          />
          <Text
            style={[
              globalStyles.headingText,
              {
                color: isDark ? "#E3ECFF" : "#182D53",
                fontSize: scaleFont(13),
                marginTop: hp("0.8%"),
              },
            ]}
          >
            INFINITY COLORLAB
          </Text>
        </View>

        {/* Lottie Illustration */}
        <LottieView
          source={require("../../assets/animations/studio-photography.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* Info Card */}
      <Card
        style={[globalStyles.cardShadowEffect, styles.infoCard]}
        className="rounded-3xl bg-white dark:bg-[#0E1628] p-5 mx-4 my-6"
      >
        {/* Title Section */}
        <View style={styles.titleContainer}>
          <Text style={[styles.textPrimary, { color: isDark ? "#9CC4FF" : "#182D53" }]}>Welcome</Text>
          <Text style={[styles.textSecondary, { color: isDark ? "#BFD7FF" : "#3A4C7A" }]}>to</Text>
          <Text style={[styles.textBrand, { color: isDark ? "#E3ECFF" : "#182D53" }]}>INFINITY CRM</Text>
          <Text style={[styles.textSecondary, { color: isDark ? "#9CC4FF" : "#3A4C7A" }]}>for</Text>
          <Text style={[styles.textHighlight]}>Photographers</Text>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text
            style={[
              globalStyles.normalText,
              {
                color: isDark ? "#C7D2FE" : "#182D53",
                width: wp("80%"),
                lineHeight: hp("2.8%"),
                textAlign: "center",
              },
            ]}
          >
            A one-stop solution for all photographers to manage leads, create quotes or invoices,
            and maintain all client data in one place.
          </Text>
        </View>

        {/* Spinner */}
        <View style={styles.spinnerContainer}>
          <Spinner size={"large"} color={isDark ? "#9CC4FF" : "#182D53"} />
        </View>
      </Card>
    </View>
  );
}

/* ---------------------------------------
 * RESPONSIVE STYLES
 * -------------------------------------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
    paddingTop: hp("4%"),
  },
  logoCircle: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp("10%"),
    width: hp("18%"),
    height: hp("18%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 7,
    marginBottom: hp("2%"),
  },
  logoImage: {
    height: hp("8%"),
    width: hp("8%"),
  },
  lottie: {
    width: wp("90%"),
    height: hp("40%"),
  },
  infoCard: {
    paddingVertical: hp("3%"),
    borderTopLeftRadius: wp("8%"),
    borderTopRightRadius: wp("8%"),
    paddingHorizontal: wp("5%"),
    marginBottom: hp("1.5%"),
    ...Platform.select({
      android: { elevation: 8 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 3 },
      },
    }),
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: hp("2%"),
  },
  textPrimary: {
    fontSize: scaleFont(26),
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  textSecondary: {
    fontSize: scaleFont(22),
    fontWeight: "600",
    textTransform: "capitalize",
  },
  textBrand: {
    fontSize: scaleFont(30),
    fontWeight: "800",
    letterSpacing: 1,
  },
  textHighlight: {
    fontSize: scaleFont(32),
    fontWeight: "900",
    color: "#FF2D6B",
    letterSpacing: 1.1,
  },
  descriptionContainer: {
    alignItems: "center",
    marginVertical: hp("1%"),
  },
  spinnerContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
});
