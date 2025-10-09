import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { FormFields } from '@/src/types/common';
import { patchState } from '@/src/utils/utils';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Text, View, StyleSheet, TextInput } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { getOtpAPI } from '@/src/api/auth/auth-api-service';
const styles = StyleSheet.create({
    loginContainer: {
        borderTopLeftRadius: wp("10%"),
        paddingBottom: hp("2%"),
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginVertical: hp("1.5%")
    },
    otpBodyContainer: {
        flex: 1,
        alignItems: 'center', // Center card
        marginTop: hp('7%'),
    },
    cardContainer: {
        padding: hp('2%'),
        width: wp('90%'),
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
})
const ForgotPassword = ({ setCurrScreen }: any) => {
    const globalStyles = useContext(StyleContext);
    const numInputs = 4;
    const { isDark } = useContext(ThemeToggleContext);
    const [forgotPasswordDetails, setForgotPasswordDetails] = useState({
        email: "",
        password: ""
    });
    const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState(Array(numInputs).fill(""));
    const inputRefs = useRef(Array(numInputs).fill(null));
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiOtp, setApiOtp] = useState("");
    const showToast = useToastMessage();

    const forgotPasswordFields: FormFields = useMemo(() => ({
        email: {
            parentKey: "email",
            key: "email",
            label: "Email",
            placeholder: "Eg :YJy0g@example.com",
            icon: <Feather name="mail" size={wp('5%')} color="#8B5CF6" />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: forgotPasswordDetails?.email,
            onChange: (value: string) => {
                patchState("", "email", value, true, setForgotPasswordDetails, setErrors);
            }
        }
    }), [forgotPasswordDetails])

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

    const verifyOtp=()=>{
        console.log("otp",otp,apiOtp)
    }


    const handleForgotPasswordPopUp = async () => {
        if (!forgotPasswordDetails?.email) {
            return showToast({
                type: "error",
                title: "Error",
                message: "Please enter email"
            })
        }
        setLoading(true);
        const sendOtp = await getOtpAPI(forgotPasswordDetails?.email);
        if (!sendOtp?.success) {
            setLoading(false);
            return showToast({
                type: "error",
                title: "Error",
                message: sendOtp?.message ?? "Something went wrong"
            })
        }
        setApiOtp(sendOtp?.data);
        setLoading(false);
        setIsOpen(true);
    }
    return (
        <View>
            <Modal
                isVisible={isOpen}
                onBackdropPress={() => { return }}
                onBackButtonPress={() => { return }}
            >
                <View style={[styles.cardContainer, { backgroundColor: isDark ? '#000' : '#fff', padding: wp('5%'), borderRadius: wp('3%') }]}>
                    <View style={styles.heading}>
                        <Text style={[globalStyles.themeTextColor, globalStyles.heading2Text]}>OTP Verification</Text>
                    </View>
                    <View style={styles.subHeading}>
                        <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>
                            For verification, please enter the OTP sent to your email. If you haven’t received the code yet, please check your spam folder.
                        </Text>
                    </View>
                    <View style={styles.otpContainer}>
                        {otp.map((digit, index) => (
                            <TextInput
                                key={index}
                                ref={inputRefs.current[index]}
                                style={[globalStyles.greyInputBox, styles.otp]}
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
                    <View className='flex flex-row justify-between items-center'>
                        <Button size="lg" variant="solid" action="primary" style={[globalStyles.transparentBackground, { marginVertical: hp('3%') }]}>

                            <ButtonText style={globalStyles.buttonText}>Cancel</ButtonText>
                        </Button>
                        <Button size="lg" variant="solid" action="primary" style={[globalStyles.purpleBackground, { marginVertical: hp('3%') }]} onPress={verifyOtp}>

                            <ButtonText style={globalStyles.buttonText}>Verify OTP</ButtonText>
                        </Button>
                    </View>
                </View>
            </Modal>
            <Card style={[styles.loginContainer, globalStyles.cardShadowEffect]}>
                <View style={{ paddingBottom: hp("20%") }}>
                    <CustomFieldsComponent infoFields={forgotPasswordFields} cardStyle={{ padding: hp("1%") }} />
                    <Button
                        size="lg"
                        variant="solid"
                        action="primary"
                        style={globalStyles.purpleBackground}
                        onPress={handleForgotPasswordPopUp}
                        isDisabled={loading}
                    >
                        {loading && (
                            <ButtonSpinner color={"#fff"} size={wp("4%")} />
                        )
                        }
                        <Feather name="lock" size={wp("5%")} color="white" />
                        <ButtonText style={globalStyles.buttonText}>
                            Reset Password
                        </ButtonText>
                    </Button>
                </View>
            </Card>
        </View>
    )
}

export default ForgotPassword