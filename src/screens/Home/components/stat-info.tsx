import React, { useContext } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Card } from "@/components/ui/card";
import { StyleContext, ThemeToggleContext } from "@/src/providers/theme/global-style-provider";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const DashboardStats = () => {
  const globalStyles = useContext(StyleContext);
  const { isDark } = useContext(ThemeToggleContext);

  // Dynamic colors
  const leftCardBg = isDark ? "#1E293B" : "#EAF3FF";
  const rightBoxBg = isDark ? "rgba(239, 68, 68, 0.15)" : "#FBEAEA"; // soft red
  const rightBoxHeading = isDark ? "#F9FAFB" : "#111827";
  const rightBoxSub = isDark ? "#CBD5E1" : "#6B7280";

  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        width: wp("96%"),
        alignSelf: "center",
        marginTop: hp("2%"),
        marginBottom: hp("2%"),
      }}
    >
      {/* LEFT BIG CARD */}
      <Card
        style={{
          width: wp("58%"),
          paddingVertical: hp("2%"),
          paddingHorizontal: wp("4%"),
          borderRadius: wp("5%"),
          backgroundColor: leftCardBg,
        }}
      >
        {/* Receivables */}
        <Text style={[globalStyles.heading3Text, globalStyles.greyTextColor]}>
          Total Receivables
        </Text>
        <Text
          style={[
            globalStyles.heading2Text,
            globalStyles.darkBlueTextColor,
            { marginTop: hp("0.5%") },
          ]}
        >
          ₹30,000.00
        </Text>

        <View style={{ height: hp("2%") }} />

        {/* Payables */}
        <Text style={[globalStyles.heading3Text, globalStyles.greyTextColor]}>
          Total Payables
        </Text>
        <Text
          style={[
            globalStyles.heading2Text,
            globalStyles.darkBlueTextColor,
            { marginTop: hp("0.5%") },
          ]}
        >
          ₹0.00
        </Text>
      </Card>

      {/* RIGHT SIDE BOXES */}
      <View style={{ width: wp("36%"), justifyContent: "space-between" }}>
        {/* Overdue Invoices */}
        <TouchableOpacity>
          <Card
            style={{
              paddingVertical: hp("2%"),
              paddingHorizontal: wp("4%"),
              borderRadius: wp("5%"),
              backgroundColor: rightBoxBg,
            }}
          >
            <Text
              style={[
                globalStyles.heading2Text,
                { color: rightBoxHeading, marginBottom: hp("0.5%") },
              ]}
            >
              1
            </Text>
            <Text style={[globalStyles.smallText, { color: rightBoxSub }]}>
              Overdue Invoices
            </Text>
          </Card>
        </TouchableOpacity>

        {/* Overdue Bills */}
        <TouchableOpacity style={{ marginTop: hp("2%") }}>
          <Card
            style={{
              paddingVertical: hp("2%"),
              paddingHorizontal: wp("4%"),
              borderRadius: wp("5%"),
              backgroundColor: rightBoxBg,
            }}
          >
            <Text
              style={[
                globalStyles.heading2Text,
                { color: rightBoxHeading, marginBottom: hp("0.5%") },
              ]}
            >
              0
            </Text>
            <Text style={[globalStyles.smallText, { color: rightBoxSub }]}>
              Overdue Bills
            </Text>
          </Card>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default DashboardStats;
