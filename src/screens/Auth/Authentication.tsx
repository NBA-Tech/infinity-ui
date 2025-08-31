import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import GradientCard from '@/src/utils/gradient-gard';
import { Image } from '@/components/ui/image';
import Logo from '../../assets/images/logo.png'
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import UserOnBoarding from './user-on-boarding';
import Login from './login';
import Register from './register';
import OneTimePassword from './one-time-password';
import Background from '../../assets/images/Background.png'
import { Divider } from '@/components/ui/divider';
import { configureGoogleSignin } from '@/src/services/auth/auth-service';
const styles = StyleSheet.create({
    headingContainer: {
        marginVertical: hp("0.1%")
    },
    body: {
        flex: 1,
        justifyContent: "space-between"
    }
})



const Authentication = () => {
    const globalStyles = useContext(StyleContext);
    const [currScreen, setCurrScreen] = useState('login');

    useEffect(() => {
        configureGoogleSignin();
        return () => { 
        };
    }, []);


    const UserAuth = () => {
        return (
            <ImageBackground
                source={Background}
                resizeMode="cover"
                style={{ flex: 1 }}>
                <View style={styles.body}>
                    {/* Header */}
                    <View style={styles.headingContainer}>
                        <View className="justify-start items-start" style={{ padding: wp("5%"), marginTop: hp('5%') }}>
                            <Card size='xs' variant='ghost'>
                                <View className='flex justify-start items-start'>
                                    <Image size='lg' source={Logo} />
                                </View>
                            </Card>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.headingText, styles.headingContainer]}>
                                Welcome to Infinity ColorLab
                            </Text>
                            <Text style={[globalStyles.whiteTextColor, globalStyles.subHeadingText]}>
                                Sign In
                            </Text>
                            <Divider style={{ height: hp('0.5%') }} width={wp('20%')} />
                        </View>
                    </View>

                    {/* Login Card - Aligned to bottom */}
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        {currScreen === 'login' ? (
                            <Login setCurrScreen={setCurrScreen}/>
                        ) : (
                            <Register setCurrScreen={setCurrScreen}/>
                        )

                        }
                    </View>
                </View>
            </ImageBackground>
        )
    }

    return (
        <SafeAreaView style={[globalStyles.appBackground]}>
            <UserAuth />


        </SafeAreaView>
    );
};

export default Authentication;