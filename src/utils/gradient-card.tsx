import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { GradientCardProps } from "../types/common";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from "react-native-responsive-screen";

const styles = StyleSheet.create({
  flatCard: {
    overflow: "hidden",
    borderBottomLeftRadius:wp('3%'),
    borderBottomRightRadius:wp('3%')
  },
});

const GradientCard: React.FC<GradientCardProps> = ({
  children,
  className = "mb-1",
  colors = ["#3B82F6", "#8B5CF6", "#EC4899"],
  style = {},
}) => {
  return (
    <LinearGradient
      className={className}
      style={[styles.flatCard, style]}
      colors={colors}
      start={{ x: 0, y: 0 }} // top
      end={{ x: 0, y: 1 }}   // bottom (vertical)
    >
      {children}
    </LinearGradient>
  );
};

export default GradientCard;
