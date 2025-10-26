import { PackageModel, ServiceModel } from "@/src/types/offering/offering-type";
import GradientCard from "@/src/utils/gradient-card";
import { useContext, useEffect, useState } from "react";
import { TouchableOpacity, View, Text, StyleSheet } from "react-native";
import { ThemeToggleContext, StyleContext } from "@/src/providers/theme/global-style-provider";
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from "react-native-responsive-screen";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import { OfferingInfo, OrderType } from "@/src/types/order/order-type";
import { ServiceInfo } from "@/src/types/order/order-type";
const styles = StyleSheet.create({
    packageContainer: {
        borderRadius: wp("2%"),
        borderWidth: wp("0.4%"),
        borderColor: "#E5E5E5",
        padding: wp("2%"),
        width: wp('50%'),
        height: hp('30%'),
        marginHorizontal: wp("2%"),
    }
})

type PackageComponentProps = {
    pkg: PackageModel;
    serviceData: ServiceModel[]
    isSelected: boolean;
    handleCalculatePrice: (serviceInfo: any) => number;
    handleCheckboxChange: (value: any, stateKeyMap: Record<string, string>) => void
    handleTotalPriceCharges: (offerInfo: OfferingInfo) => void
}
export const PackageComponent = ({ pkg, isSelected, serviceData, handleCalculatePrice, handleCheckboxChange, handleTotalPriceCharges }: PackageComponentProps) => {
    const globalStyles = useContext(StyleContext);
    const [selected, setSelected] = useState(isSelected);
    const price = pkg?.calculatedPrice ? handleCalculatePrice(pkg?.serviceList) : pkg?.price

    const handlePress = () => {
        let updateValue = {}
        if (selected) {
            updateValue = { orderType: null, packageId: null, services: [] as ServiceInfo[] }
        } else {
            updateValue = { orderType: OrderType.PACKAGE, packageId: pkg.id, packagePrice: price, packageName: pkg.packageName, services: pkg?.serviceList, isCompleted: false }
        }

        handleCheckboxChange(updateValue, { parentKey: "offeringInfo", childKey: "" });

        setSelected((prev) => !prev);
        handleTotalPriceCharges(updateValue as OfferingInfo);
    };

    useEffect(() => {
        setSelected(isSelected)
    }, [isSelected])

    return (
        <TouchableOpacity
            activeOpacity={0.9}
            onPress={handlePress}
            style={{
                ...styles.packageContainer,
                borderWidth: selected ? 2 : 1,
                borderColor: selected ? "#8B5CF6" : "#E5E7EB",
            }}
        >
            <View className="flex flex-col items-center justify-start">
                {/* Icon */}
                <GradientCard
                    colors={selected ? ["#7C3AED", "#A78BFA"] : ["#9CA3AF", "#9CA3AF"]}
                    style={{
                        padding: wp("2%"),
                        minWidth: wp("12%"),
                        minHeight: wp("12%"),
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 8,
                        marginBottom: 8,
                    }}
                >
                    <MaterialCommunityIcons
                        name={pkg?.icon ?? "format-text"}
                        size={wp("5%")}
                        color="white"
                    />
                </GradientCard>

                {/* Package name & description */}
                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>
                    {pkg?.packageName}
                </Text>
                <Text
                    style={[
                        globalStyles.normalTextColor,
                        globalStyles.smallText,
                        { flexWrap: "wrap", textAlign: "center", marginBottom: 4 },
                    ]}
                >
                    {pkg?.description}
                </Text>

                {/* Price */}
                <Text
                    style={[
                        globalStyles.normalTextColor,
                        globalStyles.subHeadingText,
                        { color: "green", marginBottom: 8 },
                    ]}
                >
                    Rs. {price}
                </Text>

                {/* Service List */}
                {pkg?.serviceList && (
                    <View className="flex flex-col items-start justify-start gap-1 w-full">
                        {pkg.serviceList.slice(0, 5).map((service, index) => (
                            <View
                                key={index}
                                className="flex flex-row items-center justify-between"
                                style={{ width: "100%" }}
                            >
                                <View className="flex flex-row items-center gap-2">
                                    <Feather
                                        name="check-circle"
                                        size={wp("3%")}
                                        color={selected ? "#8B5CF6" : "#06B6D4"}
                                    />
                                    <Text
                                        style={[globalStyles.normalTextColor, globalStyles.smallText]}
                                    >
                                        {service.name}
                                    </Text>
                                </View>
                                <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>
                                    x{service.value}
                                </Text>
                            </View>
                        ))}

                        {pkg.serviceList.length > 5 && (
                            <Text
                                style={[
                                    globalStyles.normalTextColor,
                                    globalStyles.smallText,
                                    { marginTop: 4 },
                                ]}
                            >
                                + {pkg.serviceList.length - 5} more service
                                {pkg.serviceList.length - 5 > 1 ? "s" : ""}
                            </Text>
                        )}
                    </View>
                )}
            </View>
        </TouchableOpacity>

    )
}