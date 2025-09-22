import React, { act, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import Header from '@/src/components/header';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import GradientCard from '@/src/utils/gradient-gard';
import { Divider } from '@/components/ui/divider';
import { Input, InputField, InputSlot } from "@/components/ui/input";
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarBadge, AvatarFallbackText } from "@/components/ui/avatar"
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialDesign from 'react-native-vector-icons/MaterialCommunityIcons';
import { Fab, FabLabel, FabIcon } from "@/components/ui/fab"
import { Menu, MenuItem, MenuItemLabel } from "@/components/ui/menu"
import { Button, ButtonText } from '@/components/ui/button';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@/src/types/common';


const styles = StyleSheet.create({
    inputContainer: {
        width: wp('85%'),
        borderRadius: wp('2%'),
        backgroundColor: '#f0f0f0',
    },
    cardContainer: {
        borderRadius: wp('2%'),
    },
    cardContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    leftSection: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
    },
    details: {
        justifyContent: 'space-between',
    },
    detailRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: wp('1%'),
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        gap: wp('3%'),
    },
    status: {
        borderRadius: wp('1.5%'),
        backgroundColor: 'orange',
        padding: wp('1.5%')
    },
    createdOn: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        gap: wp('3%'),
    },
    actionButtons: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    }
})
const Customer = () => {
    const globalStyles = useContext(StyleContext);
    const navigation =useNavigation<NavigationProp>()


    const CustomerCardComponent = () => {
        return (
            <Card style={[styles.cardContainer, globalStyles.cardShadowEffect]}>
                <View>
                    <View style={styles.cardContent}>
                        {/* Left Side (Avatar + Details) */}
                        <View style={styles.leftSection}>
                            <Avatar style={{ backgroundColor: '#8B5CF6', transform: [{ scale: 1.2 }] }}>
                                <AvatarFallbackText style={globalStyles.whiteTextColor}>
                                    Arlene McCoy
                                </AvatarFallbackText>
                            </Avatar>

                            <View style={styles.details}>
                                <Text style={[globalStyles.heading3Text]}>Arlene McCoy</Text>

                                <View style={styles.detailRow}>
                                    <MaterialIcons name="event" size={wp('4%')} color="#6B7280" />
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Event Name : Wedding
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <MaterialIcons name="date-range" size={wp('4%')} color="#6B7280" />
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Event Date : 25/7/2023
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <MaterialIcons name="currency-rupee" size={wp('4%')} color="#6B7280" />
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Total Package : ₹ 2023
                                    </Text>
                                </View>

                                <View style={styles.detailRow}>
                                    <MaterialIcons name="currency-rupee" size={wp('4%')} color="#6B7280" />
                                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                                        Balance : ₹ 2023
                                    </Text>
                                </View>
                            </View>
                        </View>

                        <View style={styles.statusContainer}>
                            <View style={styles.status}>
                                <Text style={[globalStyles.whiteTextColor, globalStyles.labelText]}>
                                    Pending
                                </Text>
                            </View>
                            <Menu
                                placement="bottom"
                                offset={5}
                                trigger={({ ...triggerProps }) => {
                                    return (
                                        <Button {...triggerProps} variant="ghost" style={{ backgroundColor: 'transparent' }}>
                                            <MaterialDesign name="dots-vertical" size={wp('5%')} color="#000" />
                                        </Button>
                                    )
                                }}
                            >
                                <MenuItem key="Community" textValue="Edit" className='gap-2'>
                                    <Feather name="edit-2" size={wp('5%')} color="#3B82F6" />
                                    <MenuItemLabel style={globalStyles.labelText} >Edit</MenuItemLabel>
                                </MenuItem>
                                <MenuItem key="Plugins" textValue="Delete" className='gap-2'>
                                    <Feather name="trash-2" size={wp('5%')} color="#EF4444" />
                                    <MenuItemLabel style={globalStyles.labelText}>Delete</MenuItemLabel>
                                </MenuItem>
                            </Menu>
                        </View>


                    </View>
                    <View style={styles.createdOn}>
                        <Feather name="mail" size={wp('5%')} color="#6B7280" />
                        <Feather name="phone" size={wp('5%')} color="#6B7280" />

                    </View>
                </View>
            </Card>
        )
    }

    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />

            <View>
                <View className='bg-[#fff]' style={{ marginVertical: hp('1%') }}>
                    <View className='flex-row justify-between items-center'>
                        <View className='flex justify-start items-start' style={{ margin: wp("2%") }}>
                            <Text style={[globalStyles.heading2Text]}>Customers</Text>
                            <GradientCard style={{ width: wp('25%') }}>
                                <Divider style={{ height: hp('0.5%') }} width={wp('0%')} />
                            </GradientCard>
                            <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>8 customers found</Text>
                        </View>
                        <View>
                            <Button size="md" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginHorizontal: wp('2%') }]} onPress={() => navigation.navigate('CreateCustomer')}>
                                <Feather name="plus" size={wp('5%')} color="#fff" />
                                <ButtonText style={globalStyles.buttonText}>Create New</ButtonText>
                            </Button>
                        </View>
                    </View>
                    {/* Customer Search is here */}
                    <View
                        className="flex flex-row items-center gap-3"
                        style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}
                    >
                        <Input
                            size="lg"
                            style={styles.inputContainer}
                        >
                            <InputSlot>
                                <Feather name="search" size={wp('5%')} color="#000" />
                            </InputSlot>
                            <InputField
                                type="text"
                                placeholder="Search Customer"
                                style={{ flex: 1, backgroundColor: '#f0f0f0' }}
                            />

                        </Input>
                        <TouchableOpacity>
                            <Feather name="filter" size={wp('6%')} color="#8B5CF6" />
                        </TouchableOpacity>
                    </View>


                </View>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{ height: hp('60%') }}>
                    {Array(4).fill(0).map((_, index) => (
                        <View key={index} style={{ marginHorizontal: wp('3%'), marginVertical: hp('1%') }}>
                            <CustomerCardComponent />
                        </View>
                    ))

                    }
                </ScrollView>
                <Fab
                    size="lg"
                    placement="bottom right"
                    isHovered={false}
                    isDisabled={false}
                    isPressed={false}
                    style={{ backgroundColor: '#8B5CF6' }}
                >
                    <Feather name="plus" size={wp('6%')} color="#fff" />
                </Fab>
            </View>


        </SafeAreaView>
    );
};

export default Customer;