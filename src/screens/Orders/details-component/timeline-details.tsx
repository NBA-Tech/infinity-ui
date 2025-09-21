import React, { useContext } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";
import { StyleContext } from "@/src/providers/theme/global-style-provider";
import { Card } from "@/components/ui/card";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import Feather from "react-native-vector-icons/Feather";

const TimeLineDetails = () => {
  const globalStyles = useContext(StyleContext);

  const data = [
    {
      date: 1574342522000,
      data: [
        {
          title: "React Native Beautiful Timeline",
          subtitle: "Sed at justo eros. Phasellus.",
          date: 1574342522000,
        },
        {
          title: "React Native",
          subtitle: "Sed viverra. Nam sagittis.",
          date: 1574342501000,
        },
      ],
    },
    {
      date: 1574248261000,
      data: [
        {
          title: "Timeline",
          subtitle: "Morbi magna orci, consequat in.",
          date: 1574248261000,
        },
      ],
    },
    {
      date: 1574125621000,
      data: [
        {
          title: "Beauty Timeline",
          subtitle: "Nulla a eleifend urna. Morbi. Praesent.",
          date: 1574125621000,
        },
      ],
    },
  ];

  const renderTimelineItem = ({ item }: { item: any }) => {
    return (
      <View style={styles.itemRow}>
        {/* Left timeline line + dot */}
        <View style={styles.timelineColumn}>
          <View style={styles.dot} />
          <View style={styles.line} />
        </View>

        {/* Right content */}
        <View style={styles.contentColumn}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.subtitle}>{item.subtitle}</Text>
          <Text style={styles.date}>
            {new Date(item.date).toLocaleDateString()}{" "}
            {new Date(item.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <Card style={globalStyles.cardShadowEffect}>
      <View style={{ padding: wp("3%") }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerRow}>
            <Feather name="clock" size={wp("7%")} color={"#8B5CF6"} />
            <Text style={globalStyles.heading3Text}>Timeline Information</Text>
          </View>
        </View>

        {/* Timeline List */}
        <FlatList
          data={data.flatMap((d) => d.data)} // flatten nested array
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderTimelineItem}
          contentContainerStyle={{ paddingVertical: hp("1%") }}
        />
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: hp("1%"),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: wp("2%"),
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: hp("2%"),
  },
  timelineColumn: {
    width: wp("8%"),
    alignItems: "center",
  },
  dot: {
    width: wp("3.5%"),
    height: wp("3.5%"),
    borderRadius: wp("2%"),
    backgroundColor: "#8B5CF6",
    zIndex: 1,
  },
  line: {
    position: "absolute",
    top: wp("3.5%"),
    width: 2,
    bottom: -hp("2%"),
    backgroundColor: "#D1D5DB",
  },
  contentColumn: {
    flex: 1,
    paddingLeft: wp("2%"),
  },
  title: {
    fontSize: wp("4%"),
    fontWeight: "600",
    color: "#111827",
  },
  subtitle: {
    fontSize: wp("3.5%"),
    color: "#4B5563",
  },
  date: {
    marginTop: 2,
    fontSize: wp("3%"),
    color: "#9CA3AF",
  },
});

export default TimeLineDetails;
