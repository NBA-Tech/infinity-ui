import React, { useContext, useEffect } from "react";
import { View, Text, Image, StyleSheet, Dimensions } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
} from "react-native-reanimated";
import LottieView from "lottie-react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { GLOBALSTATUS, NavigationProp } from "@/src/types/common";
import { Card } from "@/components/ui/card";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { Spinner } from '@/components/ui/spinner';

const { width } = Dimensions.get("window");

export default function SplashScreen() {
  const scale = useSharedValue(0.9);
  const rotate = useSharedValue(0);
  const { isInitialized, getItem } = useDataStore();
  const navigation = useNavigation<NavigationProp>();
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);


  /** -------------------------------
   *  NAVIGATION LOGIC
   *  -------------------------------- */
  useEffect(() => {
    const checkNavigation = async () => {
      if (!isInitialized) return;
      const isNewDevice = getItem("IS_NEW_DEVICE");
      // const isAuthenticated = getItem("isAuthenticated");
      const isAuthenticated = false;

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

  /** -------------------------------
   *  RENDER UI
   *  -------------------------------- */
  return (
    <View style={[styles.root, globalStyles.appBackground]}>
      <View style={styles.centerContainer}>
        {/* Brand Logo */}
        <Image
          source={require("../../assets/images/logo.png")}
          resizeMode="contain"
          style={{ height: hp("10%"), width: hp("18%") }}
        />

        {/* Brand Title */}
        <Text
          style={[
            globalStyles.headingText,
            {
              color: isDark ? "#E3ECFF" : "#182D53",
            },
          ]}
        >
          INFINITY COLORLAB
        </Text>

        {/* Sub Lottie */}
        <LottieView
          source={require("../../assets/animations/studio-photography.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      {/* Description Card */}
      <Card
        style={[
          styles.infoCard,
          {
            backgroundColor: isDark ? "#1A2238" : "#EEF3FF",
            shadowColor: isDark ? "#000" : "#182D53",
          },
        ]}
      >
        <View style={styles.cardContent}>
          <Text
            style={[
              globalStyles.headingText,
              { color: isDark ? "#E3ECFF" : "#182D53", fontSize: hp("2.6%") },
            ]}
          >
            Welcome to
          </Text>
          <Text
            style={[
              globalStyles.headingText,
              { color: isDark ? "#E3ECFF" : "#182D53", fontSize: hp("2.8%"), fontWeight: "700" },
            ]}
          >
            INFINITY CRM
          </Text>

          <View style={{ marginTop: hp("1.5%"), alignItems: "center" }}>
            <Text
              style={[
                globalStyles.normalText,
                {
                  color: isDark ? "#C7D2FE" : "#182D53",
                  width: wp("75%"),
                  lineHeight: hp("2.7%"),
                },
              ]}
            >
              A one-stop solution for photographers to manage leads, create quotations or invoices,
              and organize client data — all in one powerful app.
            </Text>
          </View>
        </View>
        <View className="flex flex-row justify-end">
          <Spinner size="large" color="grey" />;
        </View>
      </Card>
    </View>
  );
}

/** -------------------------------
 *  STYLES
 *  -------------------------------- */
const styles = StyleSheet.create({
  root: {
    flex: 1,
    justifyContent: "space-between",
  },
  centerContainer: {
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  lottie: {
    width: wp("100%"),
    height: hp("60%"),
  },
  infoCard: {
    paddingVertical: hp("2.5%"),
    borderTopLeftRadius: wp("8%"),
    borderTopRightRadius: wp("8%"),
    paddingHorizontal: wp("5%"),
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 6,
  },
  cardContent: {
    alignItems: "center",
  },
});
