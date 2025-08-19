// globalStyle.js
import { StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';


const scaleFont = (size:string) => {
  const scaledWidth = wp(size);
  const scaledHeight = hp(size);
  return scaledWidth > scaledHeight ? scaledWidth : scaledHeight;
};


const createGlobalStyle = (isDark = false) => StyleSheet.create({
  //color styles
  purpleTextColor:{
    color:"#8B5CF6"
  },
  normalTextColor:{
    color:"#4B5563"
  },

  //text styles
  headingText:{
    fontSize:scaleFont("3.5%"),
    fontFamily:"Poppins-Bold"
  },
  subHeadingText:{
    fontSize:scaleFont("2.5%"),
    fontFamily:"Poppins-Bold"
  },
  labelText:{
    fontSize:scaleFont("2%"),
    fontFamily:"Inter-Medium"
  },
  buttonText:{
    fontSize:scaleFont("2.5%"),
    fontFamily:"Poppins-SemiBold"
  },
  underscoreText:{
    fontSize:scaleFont("2%"),
    fontFamily:"Inter-Medium",
    textDecorationLine:"underline"
  },

  //background
  purpleBackground:{
    backgroundColor:"#8B5CF6",
    borderRadius:wp("2%")
  }

})

export const lightTheme = createGlobalStyle(false);
export const darkTheme = createGlobalStyle(true);