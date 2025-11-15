import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { useContext } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { useNavigation } from "@react-navigation/native";


const QuickActions = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const navigation = useNavigation()

    const quickActionsList = [
        { label: "Create Customer", icon: "user-plus", color: "#8B5CF6", onPress: () => navigation.navigate("CreateCustomer") },
        { label: "Create Service", icon: "settings", color: "#3B82F6", onPress: () => navigation.navigate("Services") },
        { label: "Create Order", icon: "shopping-cart", color: "#F97316", onPress: () => navigation.navigate("CreateOrder") },
        { label: "Create Invoice", icon: "file-text", color: "#22C55E", onPress: () => navigation.navigate("CreateInvoice") },
        { label: "Create Quote", icon: "tag", color: "#EF4444", onPress: () => navigation.navigate("CreateQuotation") },
    ];

    return (
        <View className="flex flex-col gap-3 p-3">
            {/* Header */}
            <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>
                Quick Actions
            </Text>

            {/* Horizontal Scrollable Actions */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: hp("1%") }}
            >
                {quickActionsList.map((item, index) => (
                    <TouchableOpacity
                        key={index}
                        activeOpacity={0.8}
                        onPress={item.onPress}
                        style={{
                            width: wp("25%"),
                            marginRight: wp("4%"),
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        {/* Icon Container */}
                        <View
                            style={{
                                backgroundColor: item.color,
                                padding: wp("4%"),
                                borderRadius: wp("3%"),
                                justifyContent: "center",
                                alignItems: "center",
                            }}
                        >
                            <Feather name={item.icon} size={wp("6%")} color="#FFFFFF" />
                        </View>

                        {/* Label */}
                        <Text
                            numberOfLines={2}
                            style={[
                                globalStyles.smallText,
                                globalStyles.themeTextColor,
                                {
                                    marginTop: hp("0.8%"),
                                    textAlign: "center",
                                    width: wp("30%"),
                                },
                            ]}
                        >
                            {item.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
        </View>
    );
};

export default QuickActions;
