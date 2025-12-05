import React, { useContext, useRef, useState } from 'react';
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { View, StyleSheet, Text, TouchableOpacity, Platform } from 'react-native';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonSpinner, ButtonText } from '@/components/ui/button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { AuthResult, loginWithGoogle } from '@/src/services/auth/auth-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { AuthModel, AuthResponse } from '@/src/types/auth/auth-type';
import { loginUser } from '@/src/api/auth/auth-api-service';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@/src/types/common';
import { UserApiResponse } from '@/src/types/user/user-type';
import { useAuth } from '@/src/context/auth-context/auth-context';
import { generateRandomString, getPaddingBasedOS } from '@/src/utils/utils';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { SafeAreaView } from 'react-native-safe-area-context';
const styles = StyleSheet.create({
    loginContainer: {
        borderTopLeftRadius: wp("10%"),
        paddingBottom: hp("2%"),
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
    },
    circleContainer: {
        width: wp("14%"),
        height: wp("14%"),
        borderRadius: wp("7%"), // perfect circle
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.25,
        shadowRadius: 5,
        elevation: 5,
    },
})

const Login = ({ setCurrScreen }: any) => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const [loadingProvider, setLoadingProvider] = useState<"google" | "email" | null>(null);
    const showToast = useToastMessage();
    const navigation = useNavigation<NavigationProp>();
    const [showPassword, setShowPassword] = useState(false);
    const { login } = useAuth()
    const { getItem, setItem } = useDataStore();
    const userLoginRefs = useRef<Record<string, string>>({
        email: "",
        password: ""
    });
    const formFields = [
        {
            label: 'Email',
            key: 'email',
            type: 'email',
            placeholder: 'Eg: g8TtK@example.com',
            icon: "mail",
        },
        {
            label: 'Password',
            key: 'password',
            type: 'password',
            placeholder: 'Password',
            icon: "lock"
        },
    ]

    const handleLogin = async (payload: AuthModel) => {
        const loginResponse: UserApiResponse = await loginUser(payload);

        if (!loginResponse?.success) {
            setLoadingProvider(null);
            return showToast({
                type: "error",
                title: "Error",
                message: loginResponse?.message ?? "Something went wrong"
            })
        }
        else {
            showToast({
                type: "success",
                title: "Success",
                message: loginResponse?.message ?? "Successfully logged in"
            })
        }
        const isOnBoarded = loginResponse?.userInfo?.onboarded;
        await setItem("USERID", loginResponse?.userInfo?.userId);
        await setItem("CREATEDAT", new Date().toISOString());
        if (isOnBoarded) {
            //navigate to home
            await login()
            setLoadingProvider(null);

            navigation.navigate("AuthStack", { screen: "MainTabs" });

        }
        else {
            setLoadingProvider(null);
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: 'UserOnBoarding' }],
                })
            );
        }

    }

    const underDevelopment = () => showToast({ type: "warning", title: "Oops!!", message: "This feature is under development" });

    const handleGoogleLogin = async () => {
        setLoadingProvider("google")
        const authResults: AuthResult = await loginWithGoogle();
        if (authResults.error) {
            setLoadingProvider(null);
            return showToast({
                type: "error",
                title: "Error",
                message: authResults.error
            })
        }
        const payload: AuthModel = {
            username: authResults?.user?.displayName ?? "",
            email: authResults?.user?.email ?? "",
            firebaseIdToken: authResults.token,
            authType: "GOOGLE",
        }
        handleLogin(payload);

    }

    const handleEmailLogin = async () => {
        if (!userLoginRefs.current.email || !userLoginRefs.current.password) return showToast({ type: "error", title: "Error", message: "Please enter email and password" });
        setLoadingProvider("email");
        const payload: AuthModel = {
            email: userLoginRefs.current.email,
            password: userLoginRefs.current.password,
            authType: "EMAIL_PASSWORD",
        }
        handleLogin(payload);
    }

    return (
        <View>
            <KeyboardAwareScrollView
                enableOnAndroid={true}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Card style={[styles.loginContainer, globalStyles.cardShadowEffect]}>
                    {formFields.map((field, index) => (
                        <FormControl key={index} style={{ marginVertical: hp("1%") }}>
                            <FormControlLabel>
                                <FormControlLabelText style={[globalStyles.normalTextColor, globalStyles.normalBoldText]}>{field?.label}</FormControlLabelText>
                            </FormControlLabel>
                            <Input size='lg' variant='rounded'>
                                <InputSlot style={{ paddingLeft: wp('2%') }}>
                                    <Feather name={field?.icon} size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                                </InputSlot>
                                <InputField
                                    onChangeText={(text) => userLoginRefs.current[field?.key] = text}
                                    type={field.type === 'password' && showPassword ? "text" : field?.type}
                                    placeholder={field?.placeholder}
                                    keyboardType={
                                        field?.type === "number"
                                            ? "numeric"
                                            : field?.type === "email"
                                                ? "email-address"
                                                : field?.type === "password"
                                                    ? (showPassword ? "default" : "default") // keyboardType stays same
                                                    : "default"
                                    }
                                    secureTextEntry={field?.type === "password" && !showPassword}
                                />
                                {field?.type === 'password' && (
                                    <InputSlot onPress={() => setShowPassword(!showPassword)}>
                                        <Feather name={showPassword ? "eye" : "eye-off"} size={wp('5%')} color={isDark ? "#fff" : "#000"} />
                                    </InputSlot>
                                )}
                            </Input>
                        </FormControl>
                    ))}
                    <View style={styles.forgotPasswordContainer}>
                        <TouchableOpacity onPress={() => setCurrScreen("forgot")}>
                            <Text style={[globalStyles.underscoreText, globalStyles.themeTextColor, globalStyles.normalBoldText]}>Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginVertical: hp("1%") }}>
                        <Button size="lg" variant="solid" action="primary" style={globalStyles.buttonColor} onPress={handleEmailLogin} isDisabled={loadingProvider != null}>
                            {loadingProvider == "email" && (
                                <ButtonSpinner color={"#fff"} size={wp("4%")} />
                            )
                            }
                            <ButtonText style={globalStyles.buttonText}>Sign In</ButtonText>
                        </Button>
                        <View className='flex-row justify-center items-center'>
                            <Text style={[globalStyles.normalTextColor, { marginVertical: hp("1%") }]}>────── OR ──────</Text>
                        </View>
                        <View className='flex-row justify-center items-center gap-2'>
                            <TouchableOpacity style={[styles.circleContainer, { backgroundColor: "#fff" }]} onPress={handleGoogleLogin} disabled={loadingProvider != null}>
                                <FontAwesome name="google" size={wp('5%')} color="#DB4437" />
                            </TouchableOpacity>

                            {/* Facebook */}
                            <TouchableOpacity onPress={underDevelopment} disabled={loadingProvider != null}>
                                <View style={[styles.circleContainer, { backgroundColor: "#1877F2" }]}>
                                    <FontAwesome name="facebook" size={wp('5%')} color="#fff" />
                                </View>
                            </TouchableOpacity>

                            {/* Instagram */}
                            <TouchableOpacity onPress={underDevelopment} disabled={loadingProvider != null}>
                                <View style={[styles.circleContainer, { backgroundColor: "#E4405F", }]}>
                                    <FontAwesome name="instagram" size={wp('5%')} color="#fff" />
                                </View>
                            </TouchableOpacity>

                        </View>
                        <SafeAreaView edges={["bottom"]} style={{ paddingBottom: getPaddingBasedOS() }}>
                            <View className='flex-row justify-center items-center' style={{ marginTop: hp("1%") }}>
                                <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Don't have an account? </Text>
                                <TouchableOpacity onPress={() => setCurrScreen('register')}>
                                    <Text style={[globalStyles.underscoreText, globalStyles.themeTextColor]}>Sign Up</Text>
                                </TouchableOpacity>
                            </View>
                        </SafeAreaView>
                    </View>
                </Card>
            </KeyboardAwareScrollView>
        </View>
    );
};

export default Login;