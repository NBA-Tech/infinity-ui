import React, { useContext, useState } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import GradientCard from "@/src/utils/gradient-card";
import { Card } from "@/components/ui/card";
import { GeneralCardModel } from "../types/home-type";
import { StyleContext } from "@/src/providers/theme/global-style-provider";
import Tooltip, { Placement } from "react-native-tooltip-2";
import Skeleton from "@/components/ui/skeleton";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";

export const StatInfo = ({
  item,
  isLoading,
  index,
}: {
  item: GeneralCardModel;
  isLoading: boolean;
  index: number;
}) => {
  const globalStyles = useContext(StyleContext);
  const [toolTipVisible, setToolTipVisible] = useState(false);

  if (isLoading) {
    return <Skeleton height={hp("18%")} width={wp("45%")} />;
  }

  const isNegative =
    item?.percentageOfChange &&
    (item?.percentageOfChange.includes("-") || item?.percentageOfChange.includes("↓"));

  return (
    <Card
      style={[
        {
          width: wp("96%"),
          paddingVertical: hp("2%"),
          paddingHorizontal: wp("4%"),
          borderRadius: wp('5%'),
          backgroundColor:globalStyles.cardShadowEffect.backgroundColor
        },
        globalStyles.borderCard,
      ]}
    >
      {/* Header Row - Icon + Tooltip */}
      <View className="flex flex-row justify-between items-start">
        {/* Icon */}
        <View
          style={{
            width: wp("10%"),
            height: wp("10%"),
            borderRadius: wp("2%"),
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#000",
          }}
        >
          {item.icon}
        </View>

        {/* Tooltip */}
        {item.tooltip && (
          <Tooltip
            isVisible={toolTipVisible}
            content={<Text style={globalStyles.normalText}>{item.tooltip}</Text>}
            placement={Placement.BOTTOM}
            onClose={() => setToolTipVisible(false)}
          >
            <TouchableOpacity onPress={() => setToolTipVisible(true)}>
              <Feather name="info" size={wp("5%")} color="#9CA3AF" />
            </TouchableOpacity>
          </Tooltip>
        )}
      </View>

      {/* Title */}
      <Text
        style={[
          globalStyles.subHeadingText,
          globalStyles.darkBlueTextColor,
          { marginTop: hp("1%"), textTransform: "uppercase", fontWeight: "600" },
        ]}
      >
        {item.label}
      </Text>

      {/* Amount Row */}
      <View className="flex flex-row justify-between items-center mt-1">
        <Text
          style={[
            globalStyles.themeTextColor,
            { fontSize: wp("7%"), fontWeight: "700" },
          ]}
        >
          {item.count}
        </Text>

        {/* Trend Badge */}
        {item?.isTrending && (
          <View
            className={`flex flex-row items-center px-2 py-1 rounded-lg ${
              isNegative ? "bg-red-50" : "bg-green-50"
            }`}
          >
            <Feather
              name={isNegative ? "arrow-down-right" : "arrow-up-right"}
              size={wp("3.8%")}
              color={isNegative ? "#EF4444" : "#22C55E"}
            />
            <Text
              style={[
                globalStyles.smallText,
                {
                  color: isNegative ? "#EF4444" : "#16A34A",
                  fontWeight: "600",
                  marginLeft: 4,
                },
              ]}
            >
              {item.percentageOfChange}
            </Text>
          </View>
        )}
      </View>
    </Card>
  );
};
