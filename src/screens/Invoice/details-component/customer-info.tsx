import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, TouchableOpacity } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { CustomerMetaModel } from '@/src/types/customer/customer-type';
import { OrderBasicInfo } from '@/src/types/order/order-type';
import { openDaialler, openEmailClient, openMessageBox } from '@/src/utils/utils';
import Skeleton from '@/components/ui/skeleton';


type CustomerInfoProps = {
    customerData: CustomerMetaModel;
    loading: boolean
}
const CustomerInfo = (props: CustomerInfoProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    return (
        <Card style={[globalStyles.cardShadowEffect]}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-start items-star gap-2'>
                        <Feather name="user" size={wp('7%')} color={'#8B5CF6'} />
                        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Billing Information</Text>

                    </View>
                    {props?.loading ? (
                        <Skeleton style={{ width: wp('88%'), height: hp('25%') }} />
                    ) : (
                        <View className='flex flex-col' style={{ gap: hp('2%') }}>
                            <View>
                                <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>{props?.customerData?.name}</Text>
                            </View>
                            <View className='flex flex-row justify-between items-center'>
                                <View className='flex flex-row gap-2'>
                                    <Feather name="phone" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>{props?.customerData?.mobileNumber}</Text>
                                </View>
                                <View className='flex flex-row gap-4'>
                                    <TouchableOpacity onPress={() => openDaialler(props?.customerData?.mobileNumber)}>
                                        <Feather name="phone" size={wp('5%')} color={'#8B5CF6'} />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => openMessageBox(props?.customerData?.mobileNumber, `Hi ${props?.customerData?.name ?? ""} Hope you are doing good.`)}>
                                        <Feather name="message-square" size={wp('5%')} color={'#8B5CF6'} />
                                    </TouchableOpacity>
                                </View>

                            </View>
                            <View className='flex flex-row justify-between items-center'>
                                <View className='flex flex-row gap-2'>
                                    <Feather name="mail" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                                    <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>{props?.customerData?.email}</Text>
                                </View>
                                <View className='flex flex-row gap-4'>
                                    <TouchableOpacity onPress={()=>openEmailClient(props?.customerData?.email)}>
                                        <Feather name="mail" size={wp('5%')} color={'#8B5CF6'} />
                                    </TouchableOpacity>
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

export default CustomerInfo;