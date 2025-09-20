import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';
const CustomerInfo = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <Card style={globalStyles.cardShadowEffect}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{gap:hp('2%')}}>
                    <View className='flex flex-row justify-start items-star gap-2'>
                        <Feather name="user" size={wp('7%')} color={'#8B5CF6'} />
                        <Text style={globalStyles.heading3Text}>Customer Information</Text>

                    </View>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Ajay K</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row gap-2'>
                            <Feather name="phone" size={wp('5%')} color={'#000'} />
                            <Text style={globalStyles.labelText}>+91 1234567890</Text>
                        </View>
                        <View className='flex flex-row gap-4'>
                            <Feather name="phone" size={wp('5%')} color={'#8B5CF6'} />
                            <Feather name="message-square" size={wp('5%')} color={'#8B5CF6'} />
                        </View>

                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row gap-2'>
                            <Feather name="mail" size={wp('5%')} color={'#000'} />
                            <Text style={globalStyles.labelText}>QGf3o@example.com</Text>
                        </View>
                        <View className='flex flex-row gap-4'>
                            <Feather name="mail" size={wp('5%')} color={'#8B5CF6'} />
                        </View>

                    </View>
                    <Divider />
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Special Instrution</Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, quos.</Text>
                    </View>
                </View>

            </View>
        </Card>
    );
};

export default CustomerInfo;