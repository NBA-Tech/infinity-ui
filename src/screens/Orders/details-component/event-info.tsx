import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { EventInfo } from '@/src/types/order/order-type';
import { formatDate, openAddressInMap } from '@/src/utils/utils';
import Skeleton from '@/components/ui/skeleton';
import { Divider } from '@/components/ui/divider';

type EventInfoProps = {
    eventData?: EventInfo;
    serviceLength?: number;
    isPackage: boolean;
    isLoading?: boolean
}
const EventInfoCard = (props: EventInfoProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    return (
        <Card style={[globalStyles.cardShadowEffect, { flex: 1 }]}>
            <View>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-start items-star gap-2'>
                        <Feather name="calendar" size={wp('7%')} color={'#8B5CF6'} />
                        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Event Information</Text>
                    </View>
                    {props?.isLoading ? (
                        <Skeleton height={hp('25%')} />
                    ) : (
                        <View className='flex flex-col' style={{ gap: hp('2%') }}>
                            <View>
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>{props?.eventData?.eventTitle}</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{props?.eventData?.eventType}</Text>
                            </View>

                            <View className='flex flex-row justify-between items-center'>
                                <View className='flex flex-row gap-2'>
                                    <Feather name="calendar" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                                    <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{formatDate(props?.eventData?.eventDate ?? "")}</Text>
                                </View>
                                <View className='flex flex-row gap-4'>
                                    <Feather name="clock" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                                    <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>{props?.eventData?.eventTime}</Text>
                                </View>

                            </View>
                            <View className='flex flex-row justify-start items-center gap-2' style={{ width: wp('60%') }}>
                                <Feather name="map-pin" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{props?.eventData?.eventLocation}</Text>
                                <TouchableOpacity onPress={()=>openAddressInMap(props?.eventData?.eventLocation)}>
                                <Feather name="external-link" size={wp('5%')} color={'#8B5CF6'} />
                                </TouchableOpacity>
                            </View>
                            <Divider />

                            <View className='flex flex-row justify-start items-center gap-3'>
                                <View className='flex flex-col items-center'>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>{props?.eventData?.numberOfHours}</Text>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Hours</Text>
                                </View>
                                <View className='flex flex-col items-center'>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>{props?.isPackage ? "1" : props?.serviceLength}</Text>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>{props?.isPackage ? "Package" : "Services"}</Text>
                                </View>
                            </View>
                        </View>

                    )

                    }

                </View>
            </View>
        </Card>
    );
};

export default EventInfoCard;