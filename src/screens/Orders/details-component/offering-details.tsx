import React, { useContext, useEffect, useState } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { OfferingInfo, OrderModel, OrderType } from '@/src/types/order/order-type';
import { OfferingModel, ServiceInfo } from '@/src/types/offering/offering-type';
import { useOfferingStore } from '@/src/store/offering/offering-store';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { getOfferingListAPI } from '@/src/api/offering/offering-service';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { updateServiceCompletionStatus } from '@/src/api/order/order-api-service';
import { useConfetti } from '@/src/providers/confetti/confetti-provider';
const styles = StyleSheet.create({
    statusContainer: {
        padding: wp('2%'),
        borderRadius: wp('10%'),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
        borderWidth: 1,
        borderColor: '#000'
    },
    itemIconContainer: {
        padding: wp('2%'),
        borderRadius: wp('10%'),
        alignItems: 'center',
        backgroundColor: '#8B5CF6'
    },
    container: {
        borderWidth: 1,
        borderRadius: wp("2%"),
        overflow: "hidden",
    },
    headerRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        paddingVertical: hp("1%"),
        paddingHorizontal: wp("3%"),
    },
    headerText: {
        flex: 1,
        fontWeight: "600",
    },
    row: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        paddingHorizontal: 12,
    },
    cellService: {
        flex: 2, // wider column
        textAlign: "left",
    },
    cellPrice: {
        flex: 1,
        textAlign: "right",
        marginRight: wp("5%"),
    },
    cellStatus: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
})

type OfferingDetailsProps = {
    orderId?: string
    offeringData?: OfferingInfo
    totalPrice?: number
    setOrderDetails: React.Dispatch<React.SetStateAction<OrderModel>>
}
const OfferingDetails = (props: OfferingDetailsProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const showToast = useToastMessage();
    const {triggerConfetti} = useConfetti();


    // const getServiceList = async () => {
    //     const userID = getItem("USERID");
    //     if (!userID) {
    //         showToast({
    //             type: "error",
    //             title: "Error",
    //             message: "UserID not found. Please logout and login again.",
    //         });
    //         return;
    //     }

    //     let offeringListData = getOfferingList();
    //     if (offeringListData.length <= 0) {
    //         const offeringData = await getOfferingListAPI(userID);
    //         if (!offeringData?.success) {
    //             showToast({
    //                 type: "error",
    //                 title: "Error",
    //                 message: offeringData?.message ?? "Something went wrong",
    //             });
    //             return;
    //         } else {
    //             const { packages, services } = offeringData.data;
    //             offeringListData = [...(packages ?? []), ...(services ?? [])];
    //         }
    //     }

    //     let servicesWithPrice: ServiceInfo[] = [];

    //     if (props?.offeringData?.orderType === OrderType.SERVICE) {
    //         servicesWithPrice = (props?.offeringData?.services ?? []).map(service => {
    //             const fullService = offeringListData.find(
    //                 (item: OfferingModel) => item.type === OrderType.SERVICE && item.id === service.id
    //             );

    //             return {
    //                 ...service,
    //                 price: fullService?.price ?? 0,
    //             };
    //         });
    //     } else if (props?.offeringData?.orderType === OrderType.PACKAGE) {
    //         const selectedPackage = offeringListData.find(
    //             (item: OfferingModel) =>
    //                 item.type === OrderType.PACKAGE && item.id === props?.offeringData?.packageId
    //         );

    //         servicesWithPrice = selectedPackage?.serviceList?.map(service => {
    //             const fullService = offeringListData.find(
    //                 (item: OfferingModel) => item.type === OrderType.SERVICE && item.id === service.id
    //             );

    //             return {
    //                 ...service, // id, name, value
    //                 price: fullService?.price ?? 0,
    //             };
    //         }) ?? [];
    //     }

    //     setServiceList(servicesWithPrice);
    //     // props?.setPackageData?.(offeringListData.filter((offering) => offering?.type == OrderType?.PACKAGE) as OfferingModel[]);
    //     // props?.setServiceData?.(offeringListData.filter((offering) => offering?.type == OrderType?.SERVICE) as OfferingModel[]);
    // };




    // useEffect(() => {
    //     console.log(props?.offeringData)
    //     getServiceList()
    // }, [props.offeringData])

    const handleStatusChange = async (item: ServiceInfo | OfferingInfo) => {
        if (!item) return;
        const updateStatusResponse = await updateServiceCompletionStatus(props?.orderId ?? '', props?.offeringData?.orderType === OrderType.PACKAGE ? item?.packageId ?? '' : item?.id ?? '', !item?.isCompleted ?? false, props?.offeringData?.orderType ?? OrderType.SERVICE)
        if (!updateStatusResponse?.success) {
            showToast({
                type: "error",
                title: "Error",
                message: updateStatusResponse?.message ?? "Something went wrong",
            });
            return;
        }
        props?.setOrderDetails((prev) => {
            if (!prev?.offeringInfo) return prev;

            // Case 1: Service order
            if (prev.offeringInfo.orderType === "SERVICE") {
                return {
                    ...prev,
                    offeringInfo: {
                        ...prev.offeringInfo,
                        services: prev.offeringInfo.services?.map((service) => {
                            if (service?.id === item?.id) {
                                return {
                                    ...service,
                                    isCompleted: !service?.isCompleted,
                                };
                            }
                            return service;
                        }),
                    },
                };
            }

            // Case 2: Package order
            if (prev.offeringInfo.orderType === "PACKAGE") {
                return {
                    ...prev,
                    offeringInfo: {
                        isCompleted: !prev.offeringInfo.isCompleted
                    },
                };
            }

            return prev;
        });
        triggerConfetti()


        // getServiceList();
    }
    return (
        <Card style={[globalStyles.cardShadowEffect, { flex: 1 }]}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="camera" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Service Information</Text>
                        </View>
                        <View style={[styles.statusContainer, { borderColor: isDark ? '#fff' : '#000' }]}>
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>{props?.offeringData?.orderType}</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Confirm Completion:</Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>*Note Click on the double tick to mark the servcie as delivered</Text>
                    </View>

                    <View style={{ flexDirection: "column", gap: 12 }}>
                        <View
                            style={[
                                styles.container,
                                {
                                    backgroundColor: isDark ? "#1E1E2A" : "#fff",
                                    borderColor: isDark ? "#4B5563" : "#E5E7EB",
                                    borderWidth: 1,
                                    borderRadius: 8,
                                    overflow: "hidden",
                                },
                            ]}
                        >
                            {/* Header */}
                            <View
                                style={[
                                    styles.row,
                                    { backgroundColor: isDark ? "#374151" : "#F3F4F6", borderBottomWidth: 1, borderBottomColor: isDark ? "#4B5563" : "#E5E7EB" },
                                ]}
                            >
                                <Text style={[styles.cellService, globalStyles.normalBoldText, { color: isDark ? "#fff" : "#111827" }]}>
                                    Service
                                </Text>
                                <Text style={[styles.cellPrice, globalStyles.normalBoldText, { color: isDark ? "#fff" : "#111827" }]}>
                                    Price
                                </Text>
                                <Text style={[styles.cellStatus, globalStyles.normalBoldText, { color: isDark ? "#fff" : "#111827" }]}>
                                    Status
                                </Text>
                            </View>

                            {/* Rows */}
                            <FlatList
                                data={props?.offeringData?.services}
                                keyExtractor={(item) => item.id}
                                renderItem={({ item }) => (
                                    <View
                                        style={[
                                            styles.row,
                                            { borderBottomWidth: 1, borderBottomColor: isDark ? "#4B5563" : "#E5E7EB" },
                                        ]}
                                    >
                                        <Text style={[styles.cellService, globalStyles.normalText, { color: isDark ? "#F3F4F6" : "#111827" }]}>
                                            {item.name} x{item.value}
                                        </Text>
                                        <Text style={[styles.cellPrice, globalStyles.normalText, { color: isDark ? "#F3F4F6" : "#111827" }]}>
                                            ${item.price}
                                        </Text>
                                        <TouchableOpacity style={styles.cellStatus} onPress={() => handleStatusChange(item)}>
                                            {item?.isCompleted ? (
                                                <MaterialCommunityIcons name="check-all" size={wp("5%")} color="#10B981" /> // green for done
                                            ) : (
                                                <MaterialCommunityIcons name="check-all" size={wp("5%")} color={isDark ? "#6B7280" : "#9CA3AF"} /> // grey for pending
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            />
                        </View>
                    </View>


                </View>

            </View>

        </Card>
    );
};

export default OfferingDetails;