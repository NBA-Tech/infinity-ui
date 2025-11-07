import React, { useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import GradientCard from '@/src/utils/gradient-card';
import { Image } from '@/components/ui/image';
import Logo from '../../assets/images/logo.png'
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Login from './login';
import Register from './register';
import OneTimePassword from './one-time-password';
import Background from '../../assets/images/Background.png'
import { Divider } from '@/components/ui/divider';
import { configureGoogleSignin } from '@/src/services/auth/auth-service';
import ForgotPassword from './forgot-password';
import LottieView from 'lottie-react-native';
const styles = StyleSheet.create({
    headingContainer: {
        marginVertical: hp("0.1%")
    },
    body: {
        flex: 1,
        justifyContent: "space-between"
    },
    mainAnimation: {
        width: wp("100%"),
        height: wp("80%"),
    },
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
            <View style={globalStyles.appBackground}>
                <View style={styles.body}>
                    {/* Header */}
                    <View style={styles.headingContainer}>
                        <View className='justify-center items-center'>
                            <LottieView
                                source={require('../../assets/animations/login.json')}
                                autoPlay
                                loop
                                style={styles.mainAnimation}
                            />
                        </View>


                    </View>

                    {/* Login Card - Aligned to bottom */}
                    <View style={{ flex: 1, justifyContent: 'flex-end' }}>
                        {currScreen === 'login' ? (
                            <Login setCurrScreen={setCurrScreen} />
                        ) : currScreen === 'register' ? (
                            <Register setCurrScreen={setCurrScreen} />
                        ) : (
                            <ForgotPassword setCurrScreen={setCurrScreen} />
                        )

                        }
                    </View>
                </View>
            </View>
        )
    }

    return (
        <SafeAreaView style={[globalStyles.appBackground]}>
            <UserAuth />


        </SafeAreaView>
    );
};

export default Authentication;