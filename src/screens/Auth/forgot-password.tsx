import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CustomFieldsComponent } from '@/src/components/fields-component';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { FormFields } from '@/src/types/common';
import { patchState } from '@/src/utils/utils';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Text, View, StyleSheet, TextInput, TouchableOpacity } from 'react-native'
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import Modal from 'react-native-modal';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { checkEmailExistsAPI, getOtpAPI, resetPasswordAPI } from '@/src/api/auth/auth-api-service';
import { AuthModel } from '@/src/types/auth/auth-type';
import { OtpInput } from 'react-native-otp-entry';
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
        password: "",
        confirmPassword: "",
    });
    const [errors, setErrors] = useState({});
    const [otp, setOtp] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [apiOtp, setApiOtp] = useState("");
    const [isVerified, setIsVerified] = useState(false);
    const showToast = useToastMessage();

    const forgotPasswordFields: FormFields = useMemo(() => ({
        email: {
            parentKey: "email",
            key: "email",
            label: "Email",
            placeholder: "Eg :YJy0g@example.com",
            icon: <Feather name="mail" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "text",
            style: "w-full",
            isRequired: true,
            isDisabled: isVerified,
            value: forgotPasswordDetails?.email,
            onChange: (value: string) => {
                patchState("", "email", value, true, setForgotPasswordDetails, setErrors);
            }
        }
    }), [forgotPasswordDetails, isVerified])

    const forgotPasswordResetFields: FormFields = useMemo(() => ({
        password: {
            parentKey: "password",
            key: "password",
            label: "Password",
            placeholder: "Password",
            icon: <Feather name="lock" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "password",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: forgotPasswordDetails?.password,
            onChange: (value: string) => {
                patchState("", "password", value, true, setForgotPasswordDetails, setErrors);
            }
        },
        confirmPassword: {
            parentKey: "confirmPassword",
            key: "confirmPassword",
            label: "Confirm Password",
            placeholder: "Confirm Password",
            icon: <Feather name="lock" size={wp('5%')} color={isDark ? "#fff" : "#000"} />,
            type: "password",
            style: "w-full",
            isRequired: true,
            isDisabled: false,
            value: forgotPasswordDetails?.confirmPassword,
            onChange: (value: string) => {
                patchState("", "confirmPassword", value, true, setForgotPasswordDetails, setErrors);
            }
        }
    }), [forgotPasswordDetails])

    const handleResetPassword = async () => {
        if (forgotPasswordDetails?.password !== forgotPasswordDetails?.confirmPassword) {
            return showToast({
                type: "error",
                title: "Error",
                message: "Password and confirm password should be same"
            })
        }
        setLoading(true);
        const payload: AuthModel = {
            email: forgotPasswordDetails?.email,
            password: forgotPasswordDetails?.password,
            authType: 'EMAIL_PASSWORD'
        }
        const resetPassword = await resetPasswordAPI(payload);
        setLoading(false);
        if (!resetPassword?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: resetPassword?.message ?? "Something went wrong"
            })
        }
        showToast({
            type: "success",
            title: "Success",
            message: "Password reset successfully"
        })
        setCurrScreen("login");
    }

    const verifyOtp = () => {
        if (otp === apiOtp) {
            setIsVerified(true);
            setIsOpen(false);
        }
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
        const isEmailExists = await checkEmailExistsAPI(forgotPasswordDetails?.email);
        if (!isEmailExists?.success) {
            setLoading(false);
            return showToast({
                type: "error",
                title: "Error",
                message: isEmailExists?.message ?? "User not found"
            })
        }
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

                        <OtpInput
                            numberOfDigits={4}
                            onTextChange={(code: string) => setOtp(code)}
                            focusColor="#3B82F6"
                            autoFocus
                            theme={{
                                containerStyle: {
                                    width: wp("80%"),
                                    justifyContent: "space-between",
                                },
                                pinCodeContainerStyle: {
                                    width: wp("16%"),
                                    height: hp("7%"),
                                    borderRadius: wp("2%"),
                                    backgroundColor: isDark ? "#1A2238" : "#F5F7FB",
                                    borderWidth: 2,
                                    borderColor: isDark ? "#2E3A57" : "#E5E7EB",
                                },
                                pinCodeTextStyle: {
                                    color: isDark ? "#E2E8F0" : "#1E3A8A",
                                    fontSize: wp("6%"),
                                    textAlign: "center",
                                    fontFamily: "OpenSans-Regular",
                                },
                            }}
                        />
                    </View>
                    <View className='flex flex-row justify-between items-center'>
                        <Button size="lg" variant="solid" action="primary" style={[globalStyles.transparentBackground, { marginVertical: hp('3%') }]} onPress={() => setIsOpen(false)}>

                            <ButtonText style={globalStyles.buttonText}>Cancel</ButtonText>
                        </Button>
                        <Button size="lg" variant="solid" action="primary" style={[globalStyles.buttonColor, { marginVertical: hp('3%') }]} onPress={verifyOtp}>

                            <ButtonText style={globalStyles.buttonText}>Verify OTP</ButtonText>
                        </Button>
                    </View>
                </View>
            </Modal>
            <Card style={[styles.loginContainer, globalStyles.cardShadowEffect]}>
                <View style={{ paddingBottom: hp("20%") }}>
                    <CustomFieldsComponent infoFields={forgotPasswordFields} cardStyle={{ padding: hp("1%"), backgroundColor: globalStyles.appBackground.backgroundColor }} />
                    {isVerified && <CustomFieldsComponent infoFields={forgotPasswordResetFields} cardStyle={{ padding: hp("1%"), backgroundColor: globalStyles.appBackground.backgroundColor }} />

                    }
                    <Button
                        size="lg"
                        variant="solid"
                        action="primary"
                        style={globalStyles.buttonColor}
                        onPress={isVerified ? handleResetPassword : handleForgotPasswordPopUp}
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
                    <View className='flex-row justify-center items-center' style={{ marginTop: hp("1%") }}>
                        <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Remember your password? </Text>
                        <TouchableOpacity onPress={() => setCurrScreen('login')}>
                            <Text style={[globalStyles.underscoreText, globalStyles.themeTextColor]}>Sign In</Text>
                        </TouchableOpacity>

                    </View>
                </View>

            </Card>
        </View>
    )
}

export default ForgotPassword