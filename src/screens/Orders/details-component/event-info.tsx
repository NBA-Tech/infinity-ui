import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';

const EventInfo = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <Card style={globalStyles.cardShadowEffect}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-start items-star gap-2'>
                        <Feather name="user" size={wp('7%')} color={'#8B5CF6'} />
                        <Text style={globalStyles.heading3Text}>Event Information</Text>
                    </View>
                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Hello & World Wedding</Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Wedding</Text>
                    </View>

                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row gap-2'>
                            <Feather name="date" size={wp('5%')} color={'#000'} />
                            <Text style={globalStyles.labelText}>01/01/2023</Text>
                        </View>
                        <View className='flex flex-row gap-4'>
                            <Feather name="phone" size={wp('5%')} color={'#000'} />
                            <Text style={globalStyles.labelText}>10:20 AM</Text>
                        </View>

                    </View>
                    <View className='flex flex-row justify-start items-center gap-2'>
                        <Feather name="map-pin" size={wp('5%')} color={'#000'} />
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>No3 street, New York</Text>
                        <Feather name="external-link" size={wp('5%')} color={'#8B5CF6'} />
                    </View>

                    <View className='flex flex-row justify-start items-center gap-3'>
                        <View className='flex flex-col'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>8</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Hours</Text>
                        </View>
                        <View className='flex flex-col'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>8</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Hours</Text>
                        </View>
                    </View>


                </View>

            </View>
        </Card>
    );
};

export default EventInfo;