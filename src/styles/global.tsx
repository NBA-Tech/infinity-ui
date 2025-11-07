// globalStyle.js
import { Dimensions, PixelRatio, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const BASE_WIDTH = 390;

export const scaleFont = (size: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const scaleLineHeight = (size: number) => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale * 1.4; // 1.4x is a good ratio for readability
  return Math.round(PixelRatio.roundToNearestPixel(newSize));
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
    darkBlueTextColor: { color: isDark ? "#E2E8F0" : "#142850" },
    buttonColor: { backgroundColor: "#2C426A" },

    // text styles (system fonts only)
    headingText: {
      fontSize: scaleFont(22),
      lineHeight: scaleLineHeight(22),
      fontWeight: 'bold',
      flexWrap: "wrap",
      flexShrink: 1,
    },
    heading2Text: {
      fontSize: scaleFont(18),
      lineHeight: scaleLineHeight(18),
      fontWeight: 'bold',
      flexWrap: "wrap",
      flexShrink: 1,
    },
    sideHeading: {
      fontSize: scaleFont(18),
      lineHeight: scaleLineHeight(18),
      fontWeight: 'bold',
      flexWrap: "wrap",
      flexShrink: 1,
    },
    heading3Text: {
      fontSize: scaleFont(16),
      lineHeight: scaleLineHeight(16),
      fontWeight: '600',
      flexWrap: "wrap",
      flexShrink: 1,
    },
    subHeadingText: {
      fontSize: scaleFont(17),
      lineHeight: scaleLineHeight(17),
      fontWeight: 'bold',
      flexWrap: "wrap",
      flexShrink: 1,
    },
    labelText: {
      fontSize: scaleFont(13),
      lineHeight: scaleLineHeight(13),
      fontWeight: '500',
      flexWrap: "wrap",
      flexShrink: 1,
    },
    normalText: {
      fontSize: scaleFont(14),
      lineHeight: scaleLineHeight(14),
      fontWeight: '400',
      flexWrap: "wrap",
      flexShrink: 1,
    },
    normalBoldText: {
      fontSize: scaleFont(14),
      lineHeight: scaleLineHeight(14),
      fontWeight: 'bold',
      flexWrap: "wrap",
      flexShrink: 1,
    },
    buttonText: {
      fontSize: scaleFont(17),
      lineHeight: scaleLineHeight(17),
      fontWeight: '600',
      color: "#fff",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    underscoreText: {
      fontSize: scaleFont(13),
      lineHeight: scaleLineHeight(13),
      fontWeight: '500',
      textDecorationLine: "underline",
      flexWrap: "wrap",
      flexShrink: 1,
    },
    smallText: {
      fontSize: scaleFont(12),
      lineHeight: scaleLineHeight(12),
      fontWeight: '400',
      flexWrap: "wrap",
      flexShrink: 1,
    },

    // background styles
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
    appBackground: {
      flex: 1,
      backgroundColor: isDark ? "#0E1628" : "#F5F7FB",
    },
    

    // effects
    cardShadowEffect: {
      borderRadius: wp('2%'),
      backgroundColor: isDark ? "#1A2238" : "#EEF3FF",
      shadowColor: isDark ? "#000" : "#182D53",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: isDark ? 0.3 : 0.15,
      shadowRadius: isDark ? 8 : 6,
      elevation: isDark ? 8 : 6,
      borderWidth: 1,
      borderColor: isDark ? '#1E1E28' : '#E5E7EB',
    },

    greyInputBox: {
      backgroundColor: isDark ? "#1F1F1F" : "#efefef",
      height: hp('5.2%'),
      borderRadius: wp('1%'),
      paddingHorizontal: wp('2%'),
      fontSize: scaleFont(14),
      color: isDark ? "#E5E7EB" : "#2a2a2a",
      width: wp('80%'),
    },

    // containers
    errorContainer: {
      marginHorizontal: wp('2%'),
      marginVertical: hp('2%'),
    },
  });

export const lightTheme = createGlobalStyle(false);
export const darkTheme = createGlobalStyle(true);
