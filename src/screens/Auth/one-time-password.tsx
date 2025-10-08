import React, { useEffect, useState, useRef, useContext } from 'react';
import { View, Text, StyleSheet, TextInput, ImageBackground } from 'react-native';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { useRoute } from '@react-navigation/native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { WaveHandIcon } from '@/src/assets/Icons/SvgIcons';
import Background from '../../assets/images/Background.png'
import { useToastMessage } from '@/src/components/toast/toast-message';
import { AuthResponse } from '@/src/types/auth/auth-type';
import { registerUser } from '@/src/api/auth/auth-api-service';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
const styles = StyleSheet.create({
    otpBodyContainer: {
        flex: 1,
        alignItems: 'center', // Center card
        marginTop: hp('7%'),
    },
    cardContainer: {
        padding: hp('2%'),
        width: wp('85%'),
    },
    body: {
        flex: 1,
        marginVertical: hp('15%')
    },
    heading: {
        flexDirection: 'row',
        marginVertical: hp('2%'),
        gap: wp('2%'),
        alignItems: 'center',
    },
    subHeading: {
        marginBottom: hp('2%'),
        flexWrap: 'wrap',
        alignItems: 'flex-start',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',

    },
    otp: {
        width: wp('18%'),
        height: hp('8%'),
        borderRadius: wp('3%'),
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: wp('1%'),
        textAlign: 'center',
    },
    roundButton: {
        marginVertical: hp('2%'),
        borderRadius: wp('2%'),
    },
    resendOtpContainer: {
        marginTop: hp('2%'),
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    linkText: {
        color: '#6839eb',
        fontWeight: 'bold',
        fontFamily: "Gilroy-ExtraBold",
        marginLeft: wp('1%'),
        textDecorationLine: 'underline',
    }
});
const OneTimePassword = ({ navigation, route }: { navigation: any, route: any }) => {
    const { authData, otpCode } = route?.params || {};
    const [loading, setLoading] = useState(false);
    const [timer, setTimer] = useState(60);
    const numInputs = 4;
    const [otp, setOtp] = useState(Array(numInputs).fill(""));
    const inputRefs = useRef(Array(numInputs).fill(null));
    const { isDark, toggleTheme } = useContext(ThemeToggleContext);
    const globalStyle = useContext(StyleContext);
    const showToast = useToastMessage();
    const { setItem } = useDataStore();

    useEffect(() => {
        let interval = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    clearInterval(interval);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);

    }, [])

    const handleChange = (text: string, index: number) => {
        if (/^\d$/.test(text)) {
            const newOtp = [...otp];
            newOtp[index] = text;
            setOtp(newOtp);

            // Move focus to next input
            if (index < numInputs - 1) {
                inputRefs.current[index + 1]?.focus();
            }
        } else if (text === "") {
            const newOtp = [...otp];
            newOtp[index] = "";
            setOtp(newOtp);
        }
    };
    const handleSubmit = async () => {
        console.log(otpCode, otp.join(''))
        if (otpCode !== otp.join('')) {
            return showToast({ type: "error", title: "Error", message: "Invalid OTP" })
        }
        setLoading(true)
        const register: AuthResponse = await registerUser(authData);
        if (!register?.success) {
            setLoading(false)
            return showToast({ type: "error", title: "Error", message: register?.message ?? "Something went wrong" })
        } else {
            setLoading(false)
            showToast({ type: "success", title: "Success", message: register?.message ?? "Successfully registered" })
            await setItem("USERID", register?.userId);
            navigation.reset({
                index: 0,
                routes: [{ name: "UserOnBoarding" }],
            });

        }

    }


    return (
        <ImageBackground
            source={Background}
            resizeMode="cover"
            style={{ flex: 1 }}>
            <View style={styles.body}>
                <View style={styles.otpBodyContainer}>
                    <Card size="md" variant="filled" style={[globalStyle.cardShadowEffect]}>

                        <View style={styles.cardContainer}>
                            <View style={styles.heading}>
                                <WaveHandIcon />
                                <Text style={globalStyle.themeTextColor}>OTP Verification</Text>
                            </View>
                            <View style={styles.subHeading}>
                                <Text style={[globalStyle.labelText, globalStyle.themeTextColor]}>
                                    For verification, please enter the OTP sent to your email. If you haven’t received the code yet, please check your spam folder.
                                </Text>
                            </View>

                            <View style={styles.otpContainer}>
                                {otp.map((digit, index) => (
                                    <TextInput
                                        key={index}
                                        ref={inputRefs.current[index]}
                                        style={[globalStyle.greyInputBox, styles.otp]}
                                        keyboardType="number-pad"
                                        maxLength={1}
                                        value={digit}
                                        onChangeText={(text) => handleChange(text, index)}
                                        onKeyPress={({ nativeEvent }) => {
                                            if (nativeEvent.key === 'Backspace' && otp[index] === "" && index > 0) {
                                                inputRefs.current[index - 1]?.focus(); // move back
                                            }
                                        }}
                                    />
                                ))}
                            </View>

                            <Button size="lg" variant="solid" action="primary" style={[globalStyle.purpleBackground, { marginVertical: hp('3%') }]} onPress={handleSubmit} isDisabled={loading}>
                                {loading && <ButtonSpinner color={"#fff"} size={wp("4%")} />}

                                <ButtonText style={globalStyle.buttonText}>Verify OTP</ButtonText>
                            </Button>


                        </View>

                    </Card>
                </View>
            </View>
        </ImageBackground>
    );
};

export default OneTimePassword;