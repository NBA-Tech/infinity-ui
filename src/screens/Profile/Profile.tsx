import React, { useContext } from 'react';
import { View, Text, ImageBackground, Image, StyleSheet, ScrollView } from 'react-native';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/src/components/header';
import Background from '../../assets/images/Background.png';
import { Card } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
    amountContainer: {
        padding: wp('5%'),
        marginTop: hp('5%'),
        marginBottom: hp('2%')
    },
    logoContainer: {
        position: 'absolute',
        bottom: -hp('6%'),
        left: '50%',
        transform: [{ translateX: -wp('12.5%') }],

    },
    logo: {
        width: wp('25%'),
        height: wp('25%'),
        borderRadius: wp('12.5%'),
        borderWidth: 3,
        borderColor: '#fff',
    }
})
const Profile = () => {
    const globalStyles = useContext(StyleContext);
    const options = [
        {
            label: "Business Information",
            icon: <Feather name="briefcase" size={wp('6%')} color={'#000'} />,
            onPress: () => { }
        },
        {
            label: "Services & Packages",
            icon: <Feather name="package" size={wp('6%')} color={'#000'} />,
            onPress: () => { }
        },
        {
            label: "Terms & Conditions",
            icon: <Feather name="file-text" size={wp('6%')} color={'#000'} />,
            onPress: () => { }
        },
        {
            label: "Privacy Policy",
            icon: <Feather name="lock" size={wp('6%')} color={'#000'} />,
            onPress: () => { }
        },
        {
            label: "Logout",
            icon: <Feather name="log-out" size={wp('6%')} color={'#000'} />,
            onPress: () => { }
        }

    ]

    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                <View className="flex flex-col">
                    <ImageBackground
                        source={Background}
                        resizeMode="cover"
                        style={{
                            width: '100%',
                            position: 'relative',
                        }}
                    >
                        {/* Total Amount stays where it is */}
                        <View style={styles.amountContainer}>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.subHeadingText]}>
                                Total Amount
                            </Text>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.subHeadingText]}>
                                $0.00
                            </Text>
                        </View>

                        {/* Profile image bottom-center & overflowing */}
                        <View
                            style={styles.logoContainer}
                        >
                            <Image
                                source={Background}
                                style={styles.logo}
                            />
                        </View>
                    </ImageBackground>
                    <View>
                        <View className='flex flex-col justify-center items-center' style={{ marginTop: hp('6%'), marginVertical: hp('2%') }}>
                            <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>Hello sopi</Text>
                            <Text style={[globalStyles.normalTextColor, globalStyles.normalText]}>Track your growth, manage funds, and update your info.</Text>

                            <Card style={[globalStyles.cardShadowEffect, { marginTop: hp('1%'), width: wp('80%') }]} >
                                <View className='flex flex-row justify-between items-center' style={{ padding: wp('2%') }}>
                                    <View className='flex flex-col justify-center items-center'>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Income</Text>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>$0</Text>
                                    </View>
                                    <Divider orientation='vertical' style={{ height: hp('4%'), marginHorizontal: wp('5%') }} />
                                    <View className='flex flex-col justify-center items-center'>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Income</Text>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>$0</Text>
                                    </View>
                                    <Divider orientation='vertical' style={{ height: hp('4%'), marginHorizontal: wp('5%') }} />
                                    <View className='flex flex-col justify-center items-center'>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>Income</Text>
                                        <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>$0</Text>
                                    </View>
                                </View>
                            </Card>
                        </View>
                        <View className='flex flex-col'>
                            {options.map((option, index) => (
                                <Card style={[globalStyles.cardShadowEffect, { width: wp('98%'), marginVertical: hp('0.5%') }]} className='self-center' key={index}>
                                    <View className='flex flex-row justify-between items-center p-3'>
                                        <View className='flex flex-row justify-start items-center gap-2'>
                                            {option.icon}
                                            <Text style={[globalStyles.normalTextColor, globalStyles.sideHeading]}>{option.label}</Text>

                                        </View>
                                        <Feather name="chevron-right" size={wp('6%')} color={'#000'} />

                                    </View>
                                </Card>
                            ))

                            }

                        </View>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default Profile;
