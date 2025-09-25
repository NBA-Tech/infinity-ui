import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonText } from '@/components/ui/button';

const styles = StyleSheet.create({
    statusContainer: {
        padding: wp('2%'),
        borderRadius: wp('10%'),
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
        borderWidth: 1,
        borderColor: '#000'
    }
})

const InvoiceDetails = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);

    const actionButtons = [
        {
            id: 1,
            label: 'Share',
            icon: <Feather name="share-2" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
        },
        {
            id: 2,
            label: 'Edit',
            icon: <Feather name="edit" size={wp('5%')} color={isDark ? '#fff' : '#000'} />,
        },
    ]
    return (
        <Card style={globalStyles.cardShadowEffect}>
            <View style={{ padding: wp('3%') }}>
                <View className='flex flex-col' style={{ gap: hp('2%') }}>
                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-row justify-start items-star gap-2'>
                            <Feather name="file-text" size={wp('7%')} color={'#8B5CF6'} />
                            <Text style={[globalStyles.heading3Text,globalStyles.themeTextColor]}>Invoices</Text>
                        </View>
                    </View>

                    <View className='flex flex-row justify-between items-center'>
                        <View className='flex flex-col'>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Invoice #1</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Invoice Date: 2023-01-01</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Price: $100</Text>
                        </View>
                        <View>
                            <Feather name="eye" size={wp('5%')} color={isDark ? '#fff' : '#000'} />
                        </View>
                    </View>

                    <View className='flex flex-row justify-between items-center' >
                        {actionButtons.map((action) => (
                            <Button size="sm" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                                {action.icon}
                                <ButtonText style={[globalStyles.buttonText, globalStyles.themeTextColor]}>{action.label}</ButtonText>
                            </Button>
                        ))
                        }
                    </View>

                </View>

            </View>
        </Card>
    );
};

export default InvoiceDetails;