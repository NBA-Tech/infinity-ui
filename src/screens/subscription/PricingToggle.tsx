import React, { useCallback } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import GradientCard from "@/src/utils/gradient-card";
type Props = {
  yearly: boolean;
  onChange: (v: boolean) => void;
};

export const PricingToggle = ({ yearly, onChange }: Props) => {
  const toggle = useCallback(() => onChange(!yearly), [yearly, onChange]);

  return (
    <View style={styles.container}>
      <View style={styles.toggleGroup}>
        {/* Monthly Button */}
        <TouchableOpacity onPress={() => onChange(false)} style={styles.buttonWrapper}>
          {!yearly ? (
            <GradientCard
              colors={["#A855F7", "#9333EA", "#7E22CE"]}
              style={styles.activeButton}
            >
              <Text style={styles.activeText}>Monthly</Text>
            </GradientCard>
          ) : (
            <View style={styles.inactiveButton}>
              <Text style={styles.inactiveText}>Monthly</Text>
            </View>
          )}
        </TouchableOpacity>

        {/* Yearly Button */}
        <TouchableOpacity onPress={() => onChange(true)} style={styles.buttonWrapper}>
          {yearly ? (
            <GradientCard
              colors={["#D946EF", "#C026D3", "#A21CAF"]}
              style={styles.activeButton}
            >
              <Text style={styles.activeText}>Yearly</Text>
            </GradientCard>
          ) : (
            <View style={styles.inactiveButton}>
              <Text style={styles.inactiveText}>Yearly</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Text style={styles.noteText}>💜 Save more with yearly</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
    marginTop: hp("4%"),
  },
  toggleGroup: {
    flexDirection: "row",
    width: wp("85%"),
    backgroundColor: "rgba(255,255,255,0.08)",
    borderRadius: wp("10%"),
    padding: wp("0.5%"),
  },
  buttonWrapper: {
    flex: 1,
  },
  activeButton: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: hp("1.8%"),
    borderRadius: wp("10%"),
  },
  inactiveButton: {
    flex: 1,
    paddingVertical: hp("1.8%"),
    borderRadius: wp("10%"),
    alignItems: "center",
    justifyContent: "center",
  },
  activeText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: wp("4%"),
    textAlign: "center",
    letterSpacing: 0.3,
  },
  inactiveText: {
    color: "rgba(255,255,255,0.6)",
    fontWeight: "500",
    fontSize: wp("4%"),
    textAlign: "center",
  },
  noteText: {
    marginTop: hp("1%"),
    fontSize: wp("3.5%"),
    color: "rgba(255,255,255,0.9)",
  },
});
