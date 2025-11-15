import { Card } from '@/components/ui/card';
import React, { useContext, useEffect } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Divider } from '@/components/ui/divider';
import { Button, ButtonText } from '@/components/ui/button';
import { OrderModel } from '@/src/types/order/order-type';
import { formatDate, getPercentageOfCompletion } from '@/src/utils/utils';
import { CustomerMetaModel } from '@/src/types/customer/customer-type';
import { GLOBALSTATUS } from '@/src/types/common';
const styles = StyleSheet.create({
    statusContainer: {
        padding: wp('3%'),
        borderRadius: wp('30%'),
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#065F46',
        gap: wp('1%')

    }

})

type OrderCardProps = {
    cardData: OrderModel
    customerMetaData: CustomerMetaModel
    actions: any
}
const OrderCard = (orderCardProps: OrderCardProps) => {
    const globalStyles = useContext(StyleContext);

    const options = [
        {
            label: 'View',
            onPress: () => orderCardProps?.actions?.view?.(orderCardProps?.cardData?.orderId),
            icon: <Feather name="eye" size={wp('5%')} color="#3B82F6" />,
        },
        {
            label: 'Edit',
            onPress: () => orderCardProps?.actions?.edit?.(orderCardProps?.cardData?.orderId),
            icon: <Feather name="edit-2" size={wp('5%')} color="#22C55E" />,
        },
        {
            label: 'Delete',
            onPress: () => orderCardProps?.actions?.delete?.(orderCardProps?.cardData?.orderId),
            icon: <Feather name="trash-2" size={wp('5%')} color="#EF4444" />,
        },
    ];


    return (
        <Card style={globalStyles.cardShadowEffect}>
            <View>
                <View>
                    <View className='flex flex-1 flex-row justify-between items-center'>
                        <Text style={[globalStyles.themeTextColor, globalStyles.subHeadingText, { width: wp('55%') }]} numberOfLines={1} ellipsizeMode='tail'>{orderCardProps?.cardData?.eventInfo?.eventTitle}</Text>
                        <View
                            style={[
                                styles.statusContainer,
                                {
                                    backgroundColor:
                                        GLOBALSTATUS[
                                            orderCardProps?.cardData?.status as keyof typeof GLOBALSTATUS
                                        ]?.color,
                                },
                            ]}
                        >

                            <Feather name={GLOBALSTATUS[orderCardProps?.cardData?.status as keyof typeof GLOBALSTATUS]?.icon} size={wp('3%')} color="#fff" />
                            <Text style={[globalStyles.whiteTextColor, globalStyles.smallText]}>{orderCardProps?.cardData?.status}</Text>
                        </View>
                    </View>
                    <View className='flex flex-1 flex-row justify-start items-center gap-3'>
                        <View className='flex flex-row gap-3'>
                            <Feather name="calendar" size={wp('3%')} color="#6B7280" />
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>{formatDate(orderCardProps?.cardData?.eventInfo?.eventDate)} : {orderCardProps?.cardData?.eventInfo?.eventTime}</Text>

                        </View>
                        <View className='flex flex-row gap-3'>
                            <Feather name="map" size={wp('3%')} color="#6B7280" />
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText, { width: wp('30%') }]} numberOfLines={1} ellipsizeMode='tail'>{orderCardProps?.cardData?.eventInfo?.eventLocation}</Text>

                        </View>

                    </View>
                    <View>
                        <View className='flex flex-row justify-between items-center' style={{ marginTop: hp('2%') }}>
                            <View className='flex flex-col items-center'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Budget</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>₹{orderCardProps?.cardData?.totalPrice || 0}</Text>

                            </View>

                            <View className='flex flex-col items-center' style={{ width: wp('30%') }}>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Progress</Text>
                                {getPercentageOfCompletion(orderCardProps?.cardData?.offeringInfo)?.hasDeliverable ? (
                                    <View style={{justifyContent: "center" }}>
                                        <Progress value={getPercentageOfCompletion(orderCardProps?.cardData?.offeringInfo)?.percentage} style={{ width: wp('30%') }}>
                                            <ProgressFilledTrack style={{ backgroundColor: '#4F46E5' }} />
                                        </Progress>
                                    </View>
                                ) : (
                                    <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>No deliverable yet</Text>
                                )
                                }
                            </View>
                            <View className='flex flex-col items-center'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Customer Name</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>{orderCardProps?.customerMetaData?.name}</Text>

                            </View>

                        </View>

                    </View>
                    <Divider style={{ marginVertical: hp('2%') }} />

                    <View className='flex flex-1 flex-row justify-between items-center'>
                        <View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText, { width: wp('30%') }]} numberOfLines={1} ellipsizeMode='tail'>Type : {orderCardProps?.cardData?.eventInfo?.eventType}</Text>
                        </View>
                        <View className='flex flex-row items-center justify-between gap-2'>
                            {options.map((opt) => (
                                <TouchableOpacity key={opt.label} onPress={opt.onPress} className='flex flex-row items-center gap-1'>
                                    {opt?.icon}
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>{opt.label}</Text>
                                </TouchableOpacity>
                            ))
                            }
                        </View>
                    </View>

                </View>
            </View>

        </Card >
    );
};

export default OrderCard;