import React, { useContext } from 'react';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import BackHeader from '@/src/components/back-header';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { Card } from '@/components/ui/card';
import { View, Text, StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonText } from '@/components/ui/button';
import CustomerInfo from './details-component/customer-info';
import EventInfo from './details-component/event-info';

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
const OrderDetails = () => {
    const globalStyles = useContext(StyleContext);

    const actionButtons = [
        {
            id: 1,
            label: 'Share',
            icon: <Feather name="share-2" size={wp('5%')} color={'#000'} />,
        },
        {
            id: 2,
            label: 'Invoice',
            icon: <Feather name="file" size={wp('5%')} color={'#000'} />,
        },
        {
            id: 3,
            label: 'Edit',
            icon: <Feather name="edit" size={wp('5%')} color={'#000'} />,
        }
    ]
    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <BackHeader>
                <View className='flex flex-col'>
                    <View className="flex flex-row justify-between items-center w-full">
                        {/* Left side */}
                        <View className="flex flex-row items-center gap-3">
                            <Feather name="arrow-left" size={wp('7%')} color={'#000'} />
                            <View className="flex flex-col">
                                <Text style={globalStyles.heading3Text}>Order Details</Text>
                                <Text style={[globalStyles.labelText, globalStyles.greyTextColor]}>
                                    Order #12345
                                </Text>
                            </View>
                        </View>

                        {/* Right side */}
                        <View className="flex items-center">
                            <View style={styles.statusContainer}>
                                <Text style={globalStyles.whiteTextColor}>Delivered</Text>
                            </View>
                        </View>
                    </View>
                    <View className='flex flex-row justify-between items-center' style={{ marginVertical: hp('2%') }}>
                        {actionButtons.map((action) => (
                            <Button size="lg" variant="solid" action="primary" style={globalStyles.transparentBackground}>
                                {action.icon}
                                <ButtonText style={[globalStyles.buttonText, globalStyles.blackTextColor]}>{action.label}</ButtonText>
                            </Button>
                        ))

                        }

                    </View>
                </View>
            </BackHeader>
            <View className='flex flex-col gap-3' style={{marginHorizontal:wp('5%')}}>
                <CustomerInfo/>
                <EventInfo/>
            </View>


        </SafeAreaView>

    );
};

export default OrderDetails;