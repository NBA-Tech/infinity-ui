import React, { useContext, useRef, useState } from 'react';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import { AuthResult, loginWithGoogle } from '@/src/services/auth/auth-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { AuthModel, AuthResponse } from '@/src/types/auth/auth-type';
import { loginUser } from '@/src/api/auth/auth-api-service';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@/src/types/common';
import { UserApiResponse } from '@/src/types/user/user-type';
import { useAuth } from '@/src/context/auth-context/auth-context';
const styles = StyleSheet.create({
    loginContainer: {
        borderTopLeftRadius: wp("10%"),
        paddingBottom: hp("2%"),
    },
    forgotPasswordContainer: {
        alignItems: 'flex-end',
        marginVertical: hp("1.5%")
    }
})

const Login = ({ setCurrScreen }: any) => {
    const globalStyles = useContext(StyleContext);
    const [loadingProvider, setLoadingProvider] = useState<"google" | "email" | null>(null);
    const showToast = useToastMessage();
    const navigation = useNavigation<NavigationProp>();
    const [showPassword, setShowPassword] = useState(false);
    const {login}=useAuth()
    const { getItem,setItem } = useDataStore();
    const userLoginRefs = useRef<Record<string, string>>({
        email: "",
        password: ""
    });
    const formFields = [
        {
            label: 'Email',
            key: 'email',
            type: 'email',
            placeholder: 'Eg :YJy0g@example.com',
            icon: "mail",
        },
        {
            label: 'Password',
            key: 'password',
            type: 'password',
            placeholder: '********',
            icon: "lock"
        },
    ]

    const handleLogin = async (payload: AuthModel) => {
        const loginResponse: UserApiResponse = await loginUser(payload);

        if (!loginResponse?.success) {
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
        setLoadingProvider(null);
        const isOnBoarded = loginResponse?.userInfo?.onboarded;
        console.log(loginResponse);
        setItem("USERID", loginResponse?.userInfo?.userId);
        setItem("EXPIRESAT",new Date());
        if (isOnBoarded) {
            //navigate to home
            login()
            
        }
        else {
            navigation.navigate("useronboarding");
        }

    }

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
        if(!userLoginRefs.current.email || !userLoginRefs.current.password) return showToast({ type: "error", title: "Error", message: "Please enter email and password" });
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
            <Card style={[styles.loginContainer, globalStyles.cardShadowEffect]}>
                {formFields.map((field, index) => (
                    <FormControl key={index} style={{ marginVertical: hp("1%") }}>
                        <FormControlLabel>
                            <FormControlLabelText style={[globalStyles.normalTextColor, globalStyles.labelText]}>{field?.label}</FormControlLabelText>
                        </FormControlLabel>
                        <Input size='lg'>
                            <InputSlot style={{ paddingLeft: wp('2%') }}>
                                <Feather name={field?.icon} size={wp('5%')} color="#000" />
                            </InputSlot>
                            <InputField
                                onChangeText={(text) => userLoginRefs.current[field?.key] = text}
                                type={field?.type}
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
                                    <Feather name={showPassword ? "eye-off" : "eye"} size={wp('5%')} color="#000" />
                                </InputSlot>
                            )}
                        </Input>
                    </FormControl>
                ))}
                <View style={styles.forgotPasswordContainer}>
                    <Text style={[globalStyles.underscoreText]}>Forgot Password?</Text>
                </View>
                <View style={{ marginVertical: hp("3%") }}>
                    <Button size="lg" variant="solid" action="primary" style={globalStyles.purpleBackground} onPress={handleEmailLogin}>
                        <ButtonText style={globalStyles.buttonText}>Login</ButtonText>
                    </Button>
                    <View className='flex-row justify-center items-center'>
                        <Text style={[globalStyles.normalTextColor, { marginVertical: hp("2%") }]}>────── OR ──────</Text>
                    </View>
                    <Button size="lg" variant="solid" action="primary" style={{ backgroundColor: "#DB4437", borderRadius: wp('2%') }} onPress={handleGoogleLogin}>
                        <FontAwesome name="google" size={wp('5%')} color="#fff" />
                        <ButtonText style={globalStyles.buttonText}>Sign In with Google</ButtonText>
                    </Button>
                    <View className='flex-row justify-center items-center' style={{ marginTop: hp("2%") }}>
                        <Text style={[globalStyles.labelText]}>Don't have an account? </Text>
                        <TouchableOpacity onPress={() => setCurrScreen('signup')}>
                            <Text style={[globalStyles.underscoreText]}>Sign Up</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Card>
        </View>
    );
};

export default Login;