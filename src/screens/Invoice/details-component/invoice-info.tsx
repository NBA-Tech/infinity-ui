import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
const InvoiceInfo = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <Card style={[globalStyles.cardShadowEffect]}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-start items-star gap-2'>
                        <Feather name="file" size={wp('7%')} color={'#8B5CF6'} />
                        <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Invoice Information</Text>

                    </View>
                    <View className='flex flex-col gap-3'>
                        <View className='flex flex-row justify-between items-center'>
                            <View>
                                <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Event Name</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>hello</Text>
                            </View>
                            <View>
                                <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Invoice ID</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>#123123</Text>
                            </View>
                            <View>
                                <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Quotation ID</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>#123123</Text>
                            </View>

                        </View>
                         <View className='flex flex-row justify-between items-center'>
                            <View>
                                <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Invoice Date</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>12/09/2025</Text>
                            </View>
                            <View>
                                <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Payment Method</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>bank</Text>
                            </View>
                            <View>
                                <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Amount</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>$100</Text>
                            </View>

                        </View>

                    </View>

                </View>

            </View>
        </Card>
    );
};

export default InvoiceInfo;