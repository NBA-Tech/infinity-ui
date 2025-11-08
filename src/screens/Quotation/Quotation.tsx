import { Button, ButtonText } from '@/components/ui/button';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import GradientCard from '@/src/utils/gradient-card';
import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from 'react-native-vector-icons/Feather';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@/src/types/common';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { Card } from '@/components/ui/card';
import { scaleFont } from '@/src/styles/global';


const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
    }
})
const Quotation = () => {
    const globalStyles = useContext(StyleContext)
    const { isDark } = useContext(ThemeToggleContext)
    const navigation = useNavigation<NavigationProp>();

    const actionButtons = [
        {
            key: 'edit',
            label: 'Edit',
            icon: <Feather name="edit-2" size={wp('4%')} color="#fff" />,
            onPress: () => console.log('Edit Pressed'),
        },
        {
            key: 'makeOrder',
            label: 'Make Order',
            icon: <Feather name="shopping-cart" size={wp('4%')} color="#fff" />,
            onPress: () => console.log('Make Order Pressed'),
        },
        {
            key: 'call',
            label: 'Call',
            icon: <Feather name="phone" size={wp('4%')} color="#fff" />,
            onPress: () => console.log('Call Pressed'),
        },
        {
            key: 'share',
            label: 'Share',
            icon: <Feather name="share-2" size={wp('4%')} color="#fff" />,
            onPress: () => console.log('Share Pressed'),
        },
    ];

    const QuoteCardComponent = () => (
        <Card style={globalStyles.cardShadowEffect}>
            {/* Title */}
            <View className='flex flex-row justify-center items-center' style={{ marginBottom: hp('1.5%') }}>
                <Text style={[globalStyles.heading2Text,globalStyles.themeTextColor, { fontSize: scaleFont(18) }]}>Ajay's Shoot</Text>
            </View>

            {/* Client & Quote Info + Accept/Reject */}
            <View className='flex flex-row justify-between items-center' style={{ marginBottom: hp('1%') }}>
                <View>
                    <Text style={[globalStyles.normalText,globalStyles.themeTextColor, { fontSize: scaleFont(14) }]}>Client Name: Ajay</Text>
                    <Text style={[globalStyles.normalText,globalStyles.themeTextColor, { fontSize: scaleFont(14) }]}>Quote No: 12</Text>
                </View>

                <View className='flex flex-row items-center gap-2'>
                    {/* Accept Button */}
                    <Button
                        size="sm"
                        variant="solid"
                        action="primary"
                        style={{ backgroundColor: "#22C55E", paddingHorizontal: wp('2%'), paddingVertical: hp('0.8%'), borderRadius: 8 }}
                    >
                        <Feather name="check" size={wp('4%')} color="#fff" />
                        <ButtonText style={[globalStyles.whiteTextColor,{ fontSize: scaleFont(12)}]}>Accept</ButtonText>
                    </Button>

                    {/* Reject Button */}
                    <Button
                        size="sm"
                        variant="solid"
                        action="primary"
                        style={{ backgroundColor: "#EF4444", paddingHorizontal: wp('2%'), paddingVertical: hp('0.8%'), borderRadius: 8 }}
                    >
                        <Feather name="x" size={wp('4%')} color="#fff" />
                        <ButtonText style={[globalStyles.whiteTextColor,{ fontSize: scaleFont(12) }]}>Reject</ButtonText>
                    </Button>
                </View>
            </View>

            {/* Event Details Card */}
            <Card style={[globalStyles.cardShadowEffect, { padding: hp('1.5%'), borderRadius: 10, marginBottom: hp('1.5%') }]}>
                <View>
                    <View className='flex flex-row justify-between items-center' style={{ marginBottom: hp('0.8%') }}>
                        <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>Event Date</Text>
                        <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>12/12/2000</Text>
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>Amount</Text>
                        <Text style={[globalStyles.subHeadingText, globalStyles.themeTextColor]}>$2000</Text>
                    </View>
                </View>
            </Card>

            {/* Action Buttons */}
            <View className="flex flex-row justify-between items-center gap-1" style={{ marginTop: hp('1%') }}>
                {actionButtons.map((btn) => (
                    <Button
                        key={btn.key}
                        size="sm"
                        variant="solid"
                        action="primary"
                        style={{
                            backgroundColor: globalStyles.buttonColor.backgroundColor,
                        }}
                        onPress={btn.onPress}
                    >
                        {btn.icon}
                        <ButtonText style={[globalStyles.whiteTextColor,{ fontSize: scaleFont(12), marginLeft: wp('1%') }]}>
                            {btn.label}
                        </ButtonText>
                    </Button>
                ))}
            </View>
        </Card>

    )
    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <GradientCard
                colors={isDark
                    ? ["#0D3B8F", "#1372F0"]  // Dark mode: deep navy → vibrant blue
                    : ["#1372F0", "#6FADFF"]  // Light mode: vibrant blue → soft sky blue
                }
            >
                <View className="flex flex-col p-4 gap-5">
                    {/* Header */}
                    <View className="flex flex-row justify-center items-center mb-2">
                        <Text
                            style={[
                                globalStyles.headingText,
                                globalStyles.whiteTextColor,
                                { letterSpacing: 1, textTransform: 'uppercase' },
                            ]}
                        >
                            Quote
                        </Text>
                    </View>

                    {/* Stats Row */}
                    <View className="flex flex-row justify-between items-start">
                        {/* Total Customers */}
                        <View className="flex flex-col gap-2">
                            <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                Pending Quote
                            </Text>
                            <View
                                className="flex flex-row justify-center items-center rounded-full"
                                style={{
                                    backgroundColor: "rgba(255,255,255,0.15)",
                                    paddingVertical: hp('1%'),
                                    paddingHorizontal: wp('3%'),
                                }}
                            >
                                <Feather name="file" size={wp('5%')} color="#fff" />
                                <Text
                                    style={[globalStyles.headingText, globalStyles.whiteTextColor]}>
                                    2
                                </Text>
                            </View>
                        </View>

                        {/* Create Customers */}
                        <View className="flex flex-col gap-2">
                            <Text style={[globalStyles.subHeadingText, globalStyles.whiteTextColor]}>
                                Create Quote
                            </Text>
                            <Button
                                size="md"
                                variant="solid"
                                action="primary"
                                style={[
                                    globalStyles.buttonColor,
                                    {
                                        backgroundColor: "rgba(255,255,255,0.2)",
                                        borderColor: "rgba(255,255,255,0.3)",
                                        borderWidth: 1,
                                    },
                                ]}
                                onPress={() => navigation.navigate('CreateCustomer')}
                            >
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create</ButtonText>
                            </Button>
                        </View>
                    </View>
                </View>
            </GradientCard>
            <View style={{ marginHorizontal: wp('2%'), marginVertical: hp('1%') }}>
                <View style={{ backgroundColor: globalStyles.appBackground.backgroundColor }}>
                    {/* Customer Search is here */}
                    <View
                        className="flex flex-row items-center gap-3"
                    >
                        <Input
                            size="lg"
                            style={styles.inputContainer}
                            variant='rounded'
                        >
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Quote"
                            />

                        </Input>
                        <TouchableOpacity>
                            <MaterialCommunityIcons name="filter-outline" size={wp('8%')} color="#3B82F6" />
                        </TouchableOpacity>
                    </View>


                </View>
                <View style={{ marginVertical: hp('2%') }}>
                    <QuoteCardComponent />
                </View>
            </View>

        </SafeAreaView>
    );
};

export default Quotation;