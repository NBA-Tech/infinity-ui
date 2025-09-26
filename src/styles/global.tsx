// globalStyle.js
import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const scaleFont = (size: string) => {
  const scaledWidth = wp(size);
  const scaledHeight = hp(size);
  return scaledWidth > scaledHeight ? scaledWidth : scaledHeight;
};

const createGlobalStyle = (isDark = false) =>
  StyleSheet.create({
    // color styles
    purpleTextColor: { color: "#8B5CF6" },
    normalTextColor: { color: isDark ? "#fff" : "#000" },
    whiteTextColor: { color: "#fff" },
    greyTextColor: { color: isDark ? "#9CA3AF" : "#d1d5db" },
    blackTextColor: { color: "#000" },
    errorText: { color: '#FF4D4D' },
    themeTextColor: { color: isDark ? "#fff" : "#000" },

    // text styles
    headingText: { fontSize: scaleFont("3.5%"), fontFamily: "Poppins-Bold" },
    heading2Text: { fontSize: scaleFont("3%"), fontFamily: "Poppins-Bold" },
    sideHeading: { fontSize: scaleFont("2.2%"), fontFamily: "Poppins-Bold" },
    heading3Text: { fontSize: scaleFont("2.3%"), fontFamily: "Poppins-SemiBold" },
    subHeadingText: { fontSize: scaleFont("2.5%"), fontFamily: "Poppins-Bold" },
    labelText: { fontSize: scaleFont("2%"), fontFamily: "Inter-Medium" },
    normalText: { fontSize: scaleFont("2%"), fontFamily: "Inter-Regular" },
    normalBoldText: { fontSize: scaleFont("1.8%"), fontFamily: "Poppins-Bold" },
    buttonText: { fontSize: scaleFont("2%"), fontFamily: "Poppins-Regular" },
    underscoreText: { fontSize: scaleFont("2%"), fontFamily: "Inter-Medium", textDecorationLine: "underline" },
    smallText: { fontSize: scaleFont("1.5%"), fontFamily: "Inter-Regular" },

    // background
    purpleBackground: { backgroundColor: "#8B5CF6", borderRadius: wp("2%") },
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
      fontSize: scaleFont("1.8%"),
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
