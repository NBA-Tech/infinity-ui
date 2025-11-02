// globalStyle.js
import { Dimensions, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width } = Dimensions.get("window");
export const scaleFont = (size: string) => {
  const widthScaled = wp(size);
  const heightScaled = hp(size);
  // Weighted average (height gets slightly more weight)
  return (widthScaled * 0.4 + heightScaled * 0.6);
};

const createGlobalStyle = (isDark = false) =>
  StyleSheet.create({
    // color styles
    purpleTextColor: { color: "#8B5CF6" },
    normalTextColor: { color: isDark ? "#fff" : "#000" },
    whiteTextColor: { color: "#fff" },
    greyTextColor: { color: isDark ? "#9CA3AF" : "#6B7280" },
    blackTextColor: { color: "#000" },
    errorText: { color: '#FF4D4D' },
    themeTextColor: { color: isDark ? "#fff" : "#000" },

    // text styles
    headingText: {
      fontSize: scaleFont("4%"),
      fontFamily: "Poppins-Bold",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    heading2Text: {
      fontSize: scaleFont("3.2%"),
      fontFamily: "Poppins-Bold",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    sideHeading: {
      fontSize: scaleFont("2.5%"),
      fontFamily: "Poppins-Bold",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    heading3Text: {
      fontSize: scaleFont("2.3%"),
      fontFamily: "Poppins-SemiBold",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    subHeadingText: {
      fontSize: scaleFont("2.4%"),
      fontFamily: "Poppins-Bold",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    labelText: {
      fontSize: scaleFont("1.9%"),
      fontFamily: "Inter-Medium",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    normalText: {
      fontSize: scaleFont("2%"),
      fontFamily: "Inter-Regular",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    normalBoldText: {
      fontSize: scaleFont("2%"),
      fontFamily: "Poppins-Bold",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    buttonText: {
      fontSize: scaleFont("2%"),
      fontFamily: "Poppins-Regular",
      color: "#fff",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    underscoreText: {
      fontSize: scaleFont("1.9%"),
      fontFamily: "Inter-Medium",
      textDecorationLine: "underline",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    smallText: {
      fontSize: scaleFont("1.6%"),
      fontFamily: "Inter-Regular",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    


    // background
    purpleBackground: {
      backgroundColor: "#8B5CF6",
      borderRadius: wp("2%"),
      borderWidth: wp("0.5%"),
      borderColor: "#8B5CF6",
    },
    transparentBackground: {
      backgroundColor: isDark ? "#1E1E2A" : "#fff",
      borderRadius: wp("2%"),
      borderWidth: wp("0.5%"),
      borderColor: isDark ? "#374151" : "#d1d5db",
    },
    appBackground: { flex: 1, backgroundColor: isDark ? "#1E1E2A" : "#F3F4F6" },

    // effects
    cardShadowEffect: {
      borderRadius: wp('2%'),
      backgroundColor: isDark ? "#272932" : "#fff",

      // Shadow for iOS
      shadowColor: isDark ? '#000' : '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: isDark ? 8 : 6,

      // Elevation for Android
      elevation: isDark ? 8 : 6,

      // Optional: subtle border to make cards pop
      borderWidth: 1,
      borderColor: isDark ? '#1E1E28' : '#E5E7EB',

      // Optional: inner glow/highlight for depth
      // Only works if you wrap content in an extra View with semi-transparent overlay
      // Example:
      // overlayColor: isDark ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.03)'
    },

    greyInputBox: {
      backgroundColor: isDark ? "#1F1F1F" : "#efefef",
      height: hp('5.2%'),
      borderRadius: wp('1%'),
      paddingHorizontal: wp('2%'),
      fontSize: scaleFont("1.3%"),
      color: isDark ? "#E5E7EB" : "#2a2a2a",
      width: wp('80%'),
      fontFamily: "Inter-Regular",
    },

    // containers
    errorContainer: {
      marginHorizontal: wp('2%'),
      marginVertical: hp('2%'),
    },
  });

export const lightTheme = createGlobalStyle(false);
export const darkTheme = createGlobalStyle(true);
