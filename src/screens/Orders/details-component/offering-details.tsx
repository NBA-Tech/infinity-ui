import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Divider } from '@/components/ui/divider';

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
    }
})
const OfferingDetails = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <Card style={globalStyles.cardShadowEffect}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="user" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={globalStyles.heading3Text}>Event Information</Text>
                        </View>
                        <View style={styles.statusContainer}>
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>PACKAGE</Text>
                        </View>
                    </View>

                    <View>
                        <Text style={[globalStyles.normalTextColor, globalStyles.heading3Text]}>Premium Wedding Package</Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Package includes:</Text>
                    </View>

                    <View className='flex flex-col gap-3'>
                        {Array.from({ length: 3 }).map((_, index) => (
                            <View className='flex flex-row justify-between items-center' key={index}>
                                <View className='flex flex-row justify-start items-center gap-2'>
                                    <View style={styles.itemIconContainer}>
                                        <Feather name="check" size={wp('2%')} color={'#fff'} />
                                    </View>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Wedding Invitation</Text>

                                </View>
                                <View>
                                    <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>$100</Text>
                                </View>
                            </View>
                        ))
                        }
                        <Divider />
                        <View className='flex flex-row justify-between items-center'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Total:</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>$300</Text>
                        </View>
                    </View>

                </View>

            </View>

        </Card>
    );
};

export default OfferingDetails;