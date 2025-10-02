import React, { useContext, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from "react-native-responsive-screen";
import { StyleContext } from "@/src/providers/theme/global-style-provider";
import { Card } from "@/components/ui/card";
import { CustomerModel } from "@/src/types/customer/customer-type";
import Skeleton from "@/components/ui/skeleton";


const styles = StyleSheet.create({
    cardContainer: {
        backgroundColor: "#fff",
        margin: wp('2%')
    },
    detailsContainer: {
        marginVertical: hp('2%'),
        gap: hp('2%')
    },
    scene: {
        flex: 1
    }
})

type GeneralInfoProps = {
    customerDetails: CustomerModel;
    paymentDetails: Record<string, any>;
    isLoading: boolean
}
export const GeneralInfo = (props: GeneralInfoProps) => {
    const globalStyles = useContext(StyleContext);
    return (
        <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
            <View className="flex flex-col">
                <View>
                    <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                        <View>
                            <View className="flex flex-row justify-start items-center gap-3" >
                                <Feather name="info" size={wp('6%')} color="#8B5CF6" />
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>General Info</Text>

                            </View>
                        </View>
                        {props?.isLoading ? (
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'flex-start' }}>
                                {Array.from({ length: 6 }).map((_, index) => (
                                    <Skeleton
                                        key={index}
                                        style={{
                                            width: wp('40%'),       // width of each item
                                            height: hp('7%'),      // height of each item
                                            marginRight: wp('2%'),  // horizontal spacing
                                            marginBottom: hp('2%'), // vertical spacing
                                        }}
                                    />
                                ))}
                            </View>

                        ) : (
                            <View style={styles.detailsContainer}>
                                {/* First Row */}
                                <View className="flex-row justify-between gap-4">
                                    {/* Customer Id */}
                                    <View className="flex-1">
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>
                                            Customer Id
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Feather name="user" size={wp("5%")} color="#8B5CF6" />
                                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText, { flexShrink: 1, flexWrap: "wrap" }]} numberOfLines={2}>
                                                #{props?.customerDetails?.customerID}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Customer Name */}
                                    <View className="flex-1">
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>
                                            Customer Name
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Feather name="user" size={wp("5%")} color="#10B981" />
                                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]} numberOfLines={2}>
                                                {props?.customerDetails?.customerBasicInfo?.firstName} {props?.customerDetails?.customerBasicInfo?.lastName}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* Second Row */}
                                <View className="flex-row justify-between gap-4 mt-4">
                                    {/* Phone Number */}
                                    <View className="flex-1">
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>
                                            Phone Number
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Feather name="phone" size={wp("5%")} color="#F59E0B" />
                                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]} numberOfLines={2}>
                                                {props?.customerDetails?.customerBasicInfo?.mobileNumber}
                                            </Text>
                                        </View>
                                    </View>

                                    {/* Email */}
                                    <View className="flex-1">
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>
                                            Email
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Feather name="mail" size={wp("5%")} color="#3B82F6" />
                                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]} numberOfLines={2}>
                                                {props?.customerDetails?.customerBasicInfo?.email}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )

                        }


                    </Card>

                    <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                        <View>
                            <View className="flex flex-row justify-start items-center gap-3" >
                                <Feather name="dollar-sign" size={wp('6%')} color="#8B5CF6" />
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Payment Details</Text>

                            </View>
                        </View>

                        <View className="flex-row justify-between gap-4" style={styles.detailsContainer}>
                            <View className="flex-1 flex-row justify-between gap-3">
                                {/* Total Quoted */}
                                <Card style={{ backgroundColor: "#ECFDF5" /* emerald-50 */ }}>
                                    <View className="items-center justify-center">
                                        <Text
                                            style={[
                                                globalStyles.normalTextColor,
                                                globalStyles.normalBoldText,
                                                { color: "#059669" }, // emerald-600
                                            ]}
                                        >
                                            Quoted
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Text
                                                style={[
                                                    globalStyles.normalTextColor,
                                                    globalStyles.labelText,
                                                    { color: "#059669" },
                                                ]}
                                            >
                                                {props?.isLoading ? "Loading..." : `₹ ${props?.paymentDetails?.totalAmount || 0}`}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>

                                {/* Total Received */}
                                <Card style={{ backgroundColor: "#EEF2FF" /* indigo-50 */ }}>
                                    <View className="items-center justify-center">
                                        <Text
                                            style={[
                                                globalStyles.normalTextColor,
                                                globalStyles.normalBoldText,
                                                { color: "#4F46E5" }, // indigo-600
                                            ]}
                                        >
                                            Received
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Text
                                                style={[
                                                    globalStyles.normalTextColor,
                                                    globalStyles.labelText,
                                                    { color: "#4F46E5" },
                                                ]}
                                            >
                                                {props?.isLoading ? "Loading..." : `₹ ${props?.paymentDetails?.totalPaid || 0}`}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>

                                {/* Balance */}
                                <Card style={{ backgroundColor: "#FFFBEB" /* amber-50 */ }}>
                                    <View className="items-center justify-center">
                                        <Text
                                            style={[
                                                globalStyles.normalTextColor,
                                                globalStyles.normalBoldText,
                                                { color: "#D97706" }, // amber-600
                                            ]}
                                        >
                                            Balance
                                        </Text>
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Text
                                                style={[
                                                    globalStyles.normalTextColor,
                                                    globalStyles.labelText,
                                                    { color: "#D97706" },
                                                ]}
                                            >
                                                ₹{Math.max(
                                                    (props?.paymentDetails?.totalAmount || 0) - (props?.paymentDetails?.totalPaid || 0),
                                                    0
                                                )}

                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            </View>
                        </View>

                    </Card>

                    <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                        <View>
                            <View className="flex flex-row justify-start items-center gap-3" >
                                <Feather name="map" size={wp('6%')} color="#8B5CF6" />
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Address Details</Text>

                            </View>
                        </View>

                        <View style={styles.detailsContainer}>
                            {/* First Row */}
                            <View className="flex-row justify-between gap-4">
                                {/* Customer Id */}
                                <View className="flex-1">
                                    <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>
                                        Address
                                    </Text>
                                    {props?.isLoading ? (
                                        <Skeleton width={wp('90%')} height={wp('10%')} />
                                    ) : (
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Feather name="map-pin" size={wp("5%")} color="#8B5CF6" />
                                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                                {props?.customerDetails?.customerBillingInfo?.street} {props?.customerDetails?.customerBillingInfo?.city} {props?.customerDetails?.customerBillingInfo?.state} {props?.customerDetails?.customerBillingInfo?.country} {props?.customerDetails?.customerBillingInfo?.zipCode}
                                            </Text>
                                        </View>
                                    )

                                    }

                                </View>

                            </View>
                        </View>
                    </Card>
                    <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                        <View>
                            <View className="flex flex-row justify-start items-center gap-3" >
                                <Feather name="edit" size={wp('6%')} color="#8B5CF6" />
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Notes</Text>

                            </View>
                        </View>

                        <View style={styles.detailsContainer}>
                            {/* First Row */}
                            <View className="flex-row justify-between gap-4">
                                {/* Customer Id */}
                                <View className="flex-1">
                                    <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>
                                        Notes
                                    </Text>
                                    {props?.isLoading ? (
                                        <Skeleton width={wp('90%')} height={wp('10%')} />
                                    ) : (
                                        <View className="flex-row items-center gap-2 mt-1">
                                            <Feather name="edit" size={wp("5%")} color="#8B5CF6" />
                                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                                {props?.customerDetails?.customerBasicInfo?.notes}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                            </View>
                        </View>
                    </Card>
                </View>

            </View>
        </ScrollView>
    )

};