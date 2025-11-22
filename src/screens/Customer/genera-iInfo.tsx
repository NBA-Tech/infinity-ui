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
import { useUserStore } from "@/src/store/user/user-store";
import FontAwesome from "react-native-vector-icons/FontAwesome";

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
    const { userDetails } = useUserStore()
    return (
        <ScrollView style={styles.scene} showsVerticalScrollIndicator={false}>
            <View className="flex flex-col">
                <View>
                    <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                        <View>
                            <View className="flex flex-row justify-start items-center gap-3" >
                                <Feather name="info" size={wp('6%')} color="#3B82F6" />
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
                                            <Feather name="user" size={wp("5%")} color="#3B82F6" />
                                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText, { width: wp('40%') }]} numberOfLines={1}>
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
                                                {props?.customerDetails?.customerBasicInfo?.name}
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
                                <FontAwesome name="money" size={wp('6%')} color="#3B82F6" />
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Payment Details</Text>

                            </View>
                        </View>

                        <View
                            className="flex-row flex-wrap justify-between gap-4"
                            style={styles.detailsContainer}
                        >
                            {/* Each card will auto-wrap if not enough space */}
                            {[
                                {
                                    title: "Quoted",
                                    value: props?.isLoading
                                        ? "Loading..."
                                        : `${userDetails?.currencyIcon} ${props?.paymentDetails?.totalAmount || 0}`,
                                    bg: "#ECFDF5", // emerald-50
                                    color: "#059669", // emerald-600
                                },
                                {
                                    title: "Received",
                                    value: props?.isLoading
                                        ? "Loading..."
                                        : `${userDetails?.currencyIcon} ${props?.paymentDetails?.totalPaid || 0}`,
                                    bg: "#EEF2FF", // indigo-50
                                    color: "#4F46E5", // indigo-600
                                },
                                {
                                    title: "Balance",
                                    value: `₹${Math.max(
                                        (props?.paymentDetails?.totalAmount || 0) -
                                        (props?.paymentDetails?.totalPaid || 0),
                                        0
                                    )}`,
                                    bg: "#FFFBEB", // amber-50
                                    color: "#D97706", // amber-600
                                },
                            ].map((item, index) => (
                                <View
                                    key={index}
                                    className="flex-1 min-w-[30%]"
                                    style={{
                                        flexBasis: '30%',
                                        flexGrow: 1,
                                    }}
                                >
                                    <Card
                                        style={{
                                            backgroundColor: item.bg,
                                            flex: 1,
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            paddingVertical: 12,
                                            paddingHorizontal: 8,
                                        }}
                                    >
                                        <View className="items-center justify-center">
                                            <Text
                                                style={[
                                                    globalStyles.normalTextColor,
                                                    globalStyles.normalBoldText,
                                                    { color: item.color },
                                                ]}
                                            >
                                                {item.title}
                                            </Text>

                                            <View className="flex-row items-center gap-2 mt-1 flex-wrap justify-center">
                                                <Text
                                                    style={[
                                                        globalStyles.normalTextColor,
                                                        globalStyles.labelText,
                                                        { color: item.color },
                                                    ]}
                                                >
                                                    {item.value}
                                                </Text>
                                            </View>
                                        </View>
                                    </Card>
                                </View>
                            ))}
                        </View>


                    </Card>

                    <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                        <View>
                            <View className="flex flex-row justify-start items-center gap-3" >
                                <Feather name="map" size={wp('6%')} color="#3B82F6" />
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Address Details</Text>

                            </View>
                        </View>
                        {props?.customerDetails?.customerBillingInfo?.country && (
                            <View style={styles.detailsContainer}>
                                {/* First Row */}
                                <View className="flex-row justify-between gap-4">
                                    {/* Customer Id */}
                                    <View className="flex-1">
                                      
                                        {props?.isLoading ? (
                                            <Skeleton width={wp('90%')} height={wp('10%')} />
                                        ) : (
                                            <View className="flex-row items-center gap-2 mt-1">
                                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                                    {props?.customerDetails?.customerBillingInfo?.street} {props?.customerDetails?.customerBillingInfo?.city} {props?.customerDetails?.customerBillingInfo?.state} {props?.customerDetails?.customerBillingInfo?.country} {props?.customerDetails?.customerBillingInfo?.zipCode}
                                                </Text>
                                            </View>
                                        )

                                        }

                                    </View>

                                </View>
                            </View>
                        )

                        }

                    </Card>
                    <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                        <View>
                            <View className="flex flex-row justify-start items-center gap-3" >
                                <Feather name="edit" size={wp('6%')} color="#3B82F6" />
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Notes</Text>

                            </View>
                        </View>
                        {props?.customerDetails?.customerBasicInfo?.notes && (
                            <View style={styles.detailsContainer}>
                                {/* First Row */}
                                <View className="flex-row justify-between gap-4">
                                    {/* Customer Id */}
                                    <View className="flex-1">
                                        
                                        {props?.isLoading ? (
                                            <Skeleton width={wp('90%')} height={wp('10%')} />
                                        ) : (
                                            <View className="flex-row items-center gap-2 mt-1">
                                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                                    {props?.customerDetails?.customerBasicInfo?.notes}
                                                </Text>
                                            </View>
                                        )}
                                    </View>

                                </View>
                            </View>
                        )

                        }


                    </Card>
                </View>

            </View>
        </ScrollView>
    )

};