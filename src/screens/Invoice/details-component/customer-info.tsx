import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
import { CustomerMetaModel } from '@/src/types/customer/customer-type';
import { OrderBasicInfo } from '@/src/types/order/order-type';


type CustomerInfoProps = {
    customerData:CustomerMetaModel;
    orderBasicInfo?:OrderBasicInfo
}
const CustomerInfo = (props:CustomerInfoProps) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    return (
        <Card style={[globalStyles.cardShadowEffect]}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{gap:hp('2%')}}>
                    <View className='flex flex-row justify-start items-star gap-2'>
                        <Feather name="user" size={wp('7%')} color={'#8B5CF6'} />
                        <Text style={[globalStyles.heading3Text,globalStyles.themeTextColor]}>Customer Information</Text>

                    </View>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>asd</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row gap-2'>
                            <Feather name="phone" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                            <Text style={[globalStyles.labelText,globalStyles.themeTextColor]}>123123</Text>
                        </View>
                        <View className='flex flex-row gap-4'>
                            <Feather name="phone" size={wp('5%')} color={'#8B5CF6'} />
                            <Feather name="message-square" size={wp('5%')} color={'#8B5CF6'} />
                        </View>

                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row gap-2'>
                            <Feather name="mail" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                            <Text style={[globalStyles.labelText,globalStyles.themeTextColor]}>adasd</Text>
                        </View>
                        <View className='flex flex-row gap-4'>
                            <Feather name="mail" size={wp('5%')} color={'#8B5CF6'} />
                        </View>

                    </View>
                </View>

            </View>
        </Card>
    );
};

export default CustomerInfo;