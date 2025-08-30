import { Card } from '@/components/ui/card';
import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Progress, ProgressFilledTrack } from '@/components/ui/progress';
import { Divider } from '@/components/ui/divider';
import { Button, ButtonText } from '@/components/ui/button';


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
const OrderCard = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <Card style={globalStyles.cardShadowEffect}>
            <View>
                <View>
                    <View className='flex flex-1 flex-row justify-between items-center'>
                        <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>Pre-Wedding PhotoShoot</Text>
                        <View style={styles.statusContainer}>
                            <Feather name="check-circle" size={wp('3%')} color="#fff" />
                            <Text style={[globalStyles.whiteTextColor, globalStyles.smallText]}>Completed</Text>
                        </View>
                    </View>
                    <View className='flex flex-1 flex-row justify-start items-center gap-3'>
                        <View className='flex flex-row gap-3'>
                            <Feather name="calendar" size={wp('3%')} color="#000" />
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>24/6/2000</Text>

                        </View>
                        <View className='flex flex-row gap-3'>
                            <Feather name="map" size={wp('3%')} color="#000" />
                            <Text style={[globalStyles.normalTextColor, globalStyles.smallText]}>Tamil Nadu, Coimbatore</Text>

                        </View>

                    </View>
                    <View>
                        <View className='flex flex-1 flex-row justify-between items-center' style={{ marginTop: hp('2%'), marginHorizontal: wp('5%') }}>
                            <View className='flex flex-col items-center'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Budget</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>₹10,00,000</Text>

                            </View>

                            <View className='flex flex-col items-center'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Progress</Text>
                                <Progress value={55} style={{ width: wp('30%') }}>
                                    <ProgressFilledTrack style={{ backgroundColor: '#4F46E5' }} />
                                </Progress>

                            </View>
                            <View className='flex flex-col items-center'>
                                <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Team</Text>
                                <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>2 Members</Text>

                            </View>

                        </View>

                    </View>
                    <Divider style={{ marginVertical: hp('2%') }} />

                    <View className='flex flex-1 flex-row justify-between items-center'>
                        <View>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>Type : Wedding</Text>
                        </View>
                        <View>
                            <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                                <Feather name="eye" size={wp("5%")} color="#000" />
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>View Details</ButtonText>
                            </Button>
                        </View>
                    </View>

                </View>
            </View>

        </Card>
    );
};

export default OrderCard;