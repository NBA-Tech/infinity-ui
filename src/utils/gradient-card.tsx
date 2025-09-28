import React from "react";
import LinearGradient from "react-native-linear-gradient";
import { GradientCardProps } from "../types/common";
import { StyleSheet } from "react-native";
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from "react-native-responsive-screen";


const styles = StyleSheet.create({
    roundedCard:{
        borderRadius: wp("2%"),
        overflow: "hidden",
    }
})
const GradientCard: React.FC<GradientCardProps> = ({
    children,
    className = "rounded-2xl mb-1",
    colors = ["#3B82F6", "#8B5CF6", "#EC4899"], 
    style={},
}) => {
    return (
        <LinearGradient
            className={className}
            style={[styles.roundedCard,style]}
            colors={colors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
        >
            {children}
        </LinearGradient>
    );
};

export default GradientCard; 
