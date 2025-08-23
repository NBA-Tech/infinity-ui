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
    purpleTextColor: {
      color: "#8B5CF6", // accent stays same
    },
    normalTextColor: {
      color: isDark ? "#E5E7EB" : "#4B5563", // gray-200 vs gray-600
    },
    whiteTextColor: {
      color: isDark ? "#000" : "#fff", // inverted
    },
    greyTextColor: {
      color: isDark ? "#9CA3AF" : "#d1d5db", // gray-400 vs gray-300
    },
    blackTextColor: {
      color: isDark ? "#fff" : "#000", // inverted
    },

    // text styles
    headingText: {
      fontSize: scaleFont("3.5%"),
      fontFamily: "Poppins-Bold",
    },
    heading2Text: {
      fontSize: scaleFont("3%"),
      fontFamily: "Poppins-Bold",
    },
    heading3Text: {
      fontSize: scaleFont("2.3%"),
      fontFamily: "Poppins-SemiBold",
    },
    subHeadingText: {
      fontSize: scaleFont("2.5%"),
      fontFamily: "Poppins-Bold",
    },
    labelText: {
      fontSize: scaleFont("2%"),
      fontFamily: "Inter-Medium",
    },
    buttonText: {
      fontSize: scaleFont("2%"),
      fontFamily: "Poppins-Regular",
      color: '#F9FAFB'
    },
    underscoreText: {
      fontSize: scaleFont("2%"),
      fontFamily: "Inter-Medium",
      textDecorationLine: "underline",
      color: isDark ? "#E5E7EB" : "#374151",
    },
    smallText:{
      fontSize: scaleFont("1.5%"),
      fontFamily: "Inter-Regular",
      color: isDark ? "#D1D5DB" : "#6B7280",
    },

    // background
    purpleBackground: {
      backgroundColor: "#8B5CF6",
      borderRadius: wp("2%"),
    },
    transparentBackground: {
      backgroundColor: isDark ? "#111827" : "#fff", // dark gray vs white
      borderRadius: wp("2%"),
      borderWidth: wp("0.5%"),
      borderColor: isDark ? "#374151" : "#d1d5db", // gray-700 vs gray-300
    },
    appBackground: {
      flex: 1,
      backgroundColor: isDark ? "#111827" : "#F3F4F6", // gray-900 vs gray-100
    },


    //effects
    cardShadowEffect: {
      borderRadius: wp('2%'),
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    greyInputBox: {
      backgroundColor: isDark ? "#1f1f1f" : '#efefef',
      height: hp('5%'),
      marginVertical: hp('1%'),
      borderRadius: wp('1%'),
      paddingHorizontal: wp('2%'),
      fontSize: scaleFont("2%"),
      color: isDark ? "#fff" : "#2a2a2a",
      width: wp('80%'),
      fontFamily: "Gilroy-normal",
    },

  });

export const lightTheme = createGlobalStyle(false);
export const darkTheme = createGlobalStyle(true);