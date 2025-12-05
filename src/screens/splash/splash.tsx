// SplashScreen.tsx (updated)
import React, { useContext, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import LottieView from "lottie-react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";
import { useDataStore } from "@/src/providers/data-store/data-store-provider";
import { GLOBALSTATUS, NavigationProp } from "@/src/types/common";
import { Card } from "@/components/ui/card";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { Spinner } from "@/components/ui/spinner";
import { scaleFont } from "@/src/styles/global";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Keychain from "react-native-keychain";

const { width } = Dimensions.get("window");

const DUMMY_USERNAME = "infinity_dummy_user";
const DUMMY_PASSWORD = "infinity_dummy_token";

export default function SplashScreen() {
  const { isInitialized, getItem } = useDataStore();
  const navigation = useNavigation<NavigationProp>();
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);

  const [authInProgress, setAuthInProgress] = useState(true);
  const [authFailed, setAuthFailed] = useState(false);

  // 1) Ensure a protected credential exists (first-run).
  const ensureProtectedCredential = async () => {
    try {
      const hasCred = await Keychain.getGenericPassword();
      if (!hasCred) {
        // Create a credential protected by device auth (accessControl)
        await Keychain.setGenericPassword(DUMMY_USERNAME, DUMMY_PASSWORD, {
          accessControl: Keychain.ACCESS_CONTROL.BIOMETRY_ANY_OR_DEVICE_PASSCODE // iOS: requires biometric (or use DEVICE_PASSCODE_OR_BIOMETRICS)
          // For broader compatibility you can use ACCESS_CONTROL.DEVICE_PASSCODE_OR_BIOMETRICS on iOS.
          // Note: Android behavior is handled automatically but some flags are iOS-specific.
        });
      }
    } catch (e) {
      // Not fatal — we'll still try to prompt later
      console.warn("Keychain setup error:", e);
    }
  };

  // 2) Trigger authentication prompt (this uses OS-level prompt)
  const authenticateOnDevice = async (): Promise<boolean> => {
    setAuthInProgress(true);
    setAuthFailed(false);
    try {
      // This will show the device auth UI (biometrics / passcode)
      const creds = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: "Unlock Infinity CRM",
          subtitle: "Authenticate to continue",
          description: "",
          cancel: "Cancel",
        },
      } as any); // type loosened — react-native-keychain types vary across versions

      if (creds) {
        // creds.username & creds.password will be the stored dummy values.
        setAuthInProgress(false);
        setAuthFailed(false);
        return true;
      } else {
        // If no credentials returned, treat as failure
        setAuthInProgress(false);
        setAuthFailed(true);
        return false;
      }
    } catch (err) {
      // User canceled or failed auth
      console.warn("Auth error / canceled:", err);
      setAuthInProgress(false);
      setAuthFailed(true);
      return false;
    }
  };

  // navigation logic that depends on your data store
  const checkNavigation = async () => {
    // preserve original logic but only call after successful auth
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

  // main effect: ensure credential, then auth -> then navigation
  useEffect(() => {
    let mounted = true;
    (async () => {
      await ensureProtectedCredential();

      // Wait until data-store has initialized (so your original navigation decision can run after auth)
      // Polling / waiting for isInitialized:
      const waitForInit = async () => {
        if (!isInitialized) {
          // small delay loop; adjust as needed
          return new Promise<void>((resolve) => {
            const id = setInterval(() => {
              if (!mounted) { clearInterval(id); resolve(); }
              if (isInitialized) { clearInterval(id); resolve(); }
            }, 150);
          });
        }
      };
      await waitForInit();

      const ok = await authenticateOnDevice();
      if (ok) {
        await checkNavigation();
      } else {
        // stay on splash and show retry UI; you can optionally route to an "unlock help" screen
        await checkNavigation();
      }
    })();

    return () => {
      mounted = false;
    };
  }, [isInitialized]);

  const runDeviceAuthentication = async (): Promise<boolean> => {
    try {
      const result = await Keychain.getGenericPassword({
        authenticationPrompt: {
          title: "Unlock Infinity CRM",
          subtitle: "Authenticate to continue",
          cancel: "Cancel",
        }
      });
      return !!result;
    } catch (e) {
      return false;
    }
  };


  return (
    <View style={[globalStyles.appBackground]}>
      {/* Center Section */}
      <View style={styles.centerContainer}>
        <SafeAreaView edges={["top"]}>
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
        </SafeAreaView>

        <LottieView
          source={require("../../assets/animations/studio-photography.json")}
          autoPlay
          loop
          style={styles.lottie}
        />
      </View>

      <Card style={[globalStyles.cardShadowEffect, styles.infoCard]} className="rounded-3xl bg-white dark:bg-[#0E1628]">
        <View style={styles.titleContainer}>
          <Text style={[styles.textPrimary, { color: isDark ? "#9CC4FF" : "#182D53" }]}>Welcome</Text>
          <Text style={[styles.textSecondary, { color: isDark ? "#BFD7FF" : "#3A4C7A" }]}>to</Text>
          <Text style={[styles.textBrand, { color: isDark ? "#E3ECFF" : "#182D53" }]}>INFINITY CRM</Text>
          <Text style={[styles.textSecondary, { color: isDark ? "#9CC4FF" : "#3A4C7A" }]}>for</Text>
          <Text style={[styles.textHighlight]}>Photographers</Text>
        </View>

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

        <View style={styles.spinnerContainer}>
          {authInProgress ? (
            <Spinner size={"large"} color={isDark ? "#9CC4FF" : "#182D53"} />
          ) : authFailed ? (
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ marginBottom: 8, color: isDark ? "#FFD6E0" : "#FF2D6B" }}>
                Unlock required to continue
              </Text>
              <TouchableOpacity
                onPress={async () => {
                  setAuthInProgress(true);
                  setAuthFailed(false);

                  // Delay to allow native layer reset (important for Android)
                  await new Promise(resolve => setTimeout(resolve, 150));

                  const ok = await runDeviceAuthentication();  // new wrapper function
                  if (ok) {
                    checkNavigation();
                  } else {
                    setAuthInProgress(false);
                    setAuthFailed(true);
                  }
                }}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 8,
                  borderRadius: 8,
                  backgroundColor: isDark ? "#26344F" : "#EFEFF4",
                }}
              >
                <Text style={{ color: isDark ? "#C7D2FE" : "#182D53" }}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <Spinner size={"large"} color={isDark ? "#9CC4FF" : "#182D53"} />
          )}
        </View>
      </Card>
    </View>
  );
}

/* ---------------------------------------
 * RESPONSIVE STYLES (unchanged)
 * -------------------------------------- */
const styles = StyleSheet.create({
  centerContainer: {
    justifyContent: "flex-start",
    alignItems: "center",
    flex: 1,
  },
  logoCircle: {
    justifyContent: "center",
    alignItems: "center",
    borderRadius: hp("10%"),
    width: hp("20%"),
    height: hp("20%"),
    paddingBottom: hp("1.5%"),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 7,
    elevation: 7,
  },
  logoImage: {
    height: hp("7.2%"),
    width: hp("7.2%"),
  },
  lottie: {
    width: wp("90%"),
    height: hp("40%"),
  },
  infoCard: {
    borderTopLeftRadius: wp("8%"),
    borderTopRightRadius: wp("8%"),
    paddingHorizontal: wp("5%"),
    minHeight: hp("32%"),
    ...Platform.select({
      android: { elevation: 10 },
      ios: {
        shadowColor: "#000",
        shadowOpacity: 0.18,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
      },
    }),
  },
  titleContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  textPrimary: {
    fontSize: scaleFont(26),
    fontFamily: "OpenSans-Bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  textSecondary: {
    fontSize: scaleFont(22),
    fontFamily: "OpenSans-Bold",
    textTransform: "capitalize",
  },
  textBrand: {
    fontSize: scaleFont(30),
    fontFamily: "OpenSans-Bold",
    letterSpacing: 1,
  },
  textHighlight: {
    fontSize: scaleFont(32),
    fontFamily: "OpenSans-Bold",
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
