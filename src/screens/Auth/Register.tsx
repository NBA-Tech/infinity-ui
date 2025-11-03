import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
    FormControlError,
    FormControlErrorText,
} from "@/components/ui/form-control"
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/global-style-provider';
import { Input, InputField, InputSlot } from "@/components/ui/input";
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonIcon, ButtonSpinner, ButtonText } from '@/components/ui/button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { AuthResult, loginWithGoogle } from '@/src/services/auth/auth-service';
import { useToastMessage } from '@/src/components/toast/toast-message';
import { AuthModel, AuthResponse } from '@/src/types/auth/auth-type';
import { getOtpAPI, registerUser } from '@/src/api/auth/auth-api-service';
import { checkPasswordStrength, checkValidEmail } from '@/src/utils/utils';
import { useDataStore } from '@/src/providers/data-store/data-store-provider';
import { CommonActions, useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@/src/types/common';
const styles = StyleSheet.create({
    registerCardContainer: {
        borderTopLeftRadius: wp("8%"),
        borderRadius: wp('2%'),
    }

})

type FormKeys = "username" | "email" | "password" | "confirmPassword";

type Errors = {
    email: boolean;
    password: boolean;
    confirmPassword: boolean;
};

const Register = ({ setCurrScreen }: any) => {
    const globalStyles = useContext(StyleContext);
    const { isDark, toggleTheme } = useContext(ThemeToggleContext);
    const showToast = useToastMessage();
    const { setItem } = useDataStore();
    const navigation = useNavigation<NavigationProp>();

    const [loadingProvider, setLoadingProvider] = useState<"google" | "email" | null>();

    // 🔧 Fix 1: Strongly type the ref values
    const userRegisterRefs = useRef<Record<FormKeys, string>>({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState<Errors>({
        email: false,
        password: false,
        confirmPassword: false,
    });

    const [errorMessage, setErrorMessage] = useState("");
    const [showPassword, setShowPassword] = useState<Record<"password" | "confirmPassword", boolean>>({
        password: false,
        confirmPassword: false,
    });

    const formFields = useMemo(() => [
        {
            label: "Username",
            type: "text",
            placeholder: "Eg :John Doe",
            icon: "user",
            key: "username" as const,
        },
        {
            label: "Email",
            type: "email",
            placeholder: "Eg :YJy0g@example.com",
            icon: "mail",
            key: "email" as const,
        },
        {
            label: "Password",
            type: showPassword?.password ? "text" : "password",
            placeholder: "********",
            icon: "lock",
            key: "password" as const,
            isText: false
        },
        {
            label: "Confirm Password",
            type: showPassword?.confirmPassword ? "text" : "password",
            placeholder: "********",
            icon: "lock",
            key: "confirmPassword" as const,
        },
    ], [showPassword]);

    const validateInputs = (inputType: FormKeys) => {
        if (inputType === "email") {
            setErrors((prev) => ({
                ...prev,
                email: checkValidEmail(userRegisterRefs.current.email),
            }));
        } else if (inputType === "password") {
            const result = checkPasswordStrength(userRegisterRefs.current.password);
            setErrorMessage(result);
            setErrors((prev) => ({
                ...prev,
                password: result !== "Strong password",
            }));
        } else if (inputType === "confirmPassword") {
            setErrors((prev) => ({
                ...prev,
                confirmPassword:
                    userRegisterRefs.current.password !==
                    userRegisterRefs.current.confirmPassword,
            }));
        }
    };

    const handleRegister = async (payload: AuthModel) => {
        if (payload.authType === "EMAIL_PASSWORD") {
            const otpApiResponse = await getOtpAPI(payload.email);
            if (!otpApiResponse?.success) {
                return showToast({
                    type: "error",
                    title: "Error",
                    message: otpApiResponse?.message ?? "Something went wrong",
                });
            }
            showToast({
                type: "success",
                title: "Success",
                message: otpApiResponse?.message ?? "OTP sent successfully",
            })

            navigation.navigate("OneTimePassword", { authData: payload, otpCode: otpApiResponse?.data });
            return
        }
        const register: AuthResponse = await registerUser(payload);
        if (!register?.success) {
            return showToast({
                type: "error",
                title: "Error",
                message: register?.message ?? "Something went wrong",
            });
        } else {
            showToast({
                type: "success",
                title: "Success",
                message: register?.message ?? "Successfully registered",
            });
            await setItem("USERID", register?.userId);
        }

        navigation.dispatch(
            CommonActions.reset({
                index: 0,
                routes: [{ name: 'UserOnBoarding' }],
            })
        );
    };

    const handleEmailRegister = async () => {
        if (!userRegisterRefs.current.email || !userRegisterRefs.current.password || !userRegisterRefs.current.username) {
            setLoadingProvider(null);
            return showToast({ type: "error", title: "Error", message: "Please enter email and password" });
        }
        const hasError = Object.values(errors).some(Boolean);
        if(userRegisterRefs.current.password !== userRegisterRefs.current.confirmPassword){
            return showToast({
                type: "error",
                title: "Error",
                message: "Password and confirm password do not match",
            });
        }

        if (hasError) {
            return showToast({
                type: "warning",
                title: "Oops!",
                message: "Please resolve the errors",
            })
        }
        setLoadingProvider("email");
        const payload: AuthModel = {
            username: userRegisterRefs.current.username,
            email: userRegisterRefs.current.email,
            password: userRegisterRefs.current.password,
            authType: "EMAIL_PASSWORD",
        }
        await handleRegister(payload);
        setLoadingProvider(null);
    };

    const handleGoogleRegister = async () => {
        setLoadingProvider("google");
        const authResults: AuthResult = await loginWithGoogle();

        if (authResults.error) {
            setLoadingProvider(null);
            return showToast({
                type: "error",
                title: "Error",
                message: authResults.error,
            });
        }

        const payload: AuthModel = {
            username: authResults?.user?.displayName ?? "",
            email: authResults?.user?.email ?? "",
            firebaseIdToken: authResults.token,
            authType: "GOOGLE",
        };
        handleRegister(payload);
        setLoadingProvider(null);
    };

    return (
        <View>
            <Card style={[styles.registerCardContainer, globalStyles.cardShadowEffect]}>
                {formFields.map((field, index) => (
                    <FormControl
                        key={index}
                        style={{ marginVertical: hp("1%") }}
                        isInvalid={!!errors[field.key as keyof Errors]}
                    >
                        <FormControlLabel className="gap-2">
                            <FormControlLabelText
                                style={[globalStyles.normalTextColor, globalStyles.labelText]}
                            >
                                {field.label}
                            </FormControlLabelText>
                        </FormControlLabel>

                        <Input size="lg">
                            <InputSlot>
                                <Feather name={field.icon} size={wp("5%")} color={isDark ? "#fff" : "#000"} />
                            </InputSlot>

                            <InputField
                                type={field.type}
                                onChangeText={(text) => {
                                    userRegisterRefs.current[field.key] = text;
                                }}
                                onBlur={() => validateInputs(field.key)}
                                placeholder={field.placeholder}
                                keyboardType={field?.type}
                                secureTextEntry={
                                    field.key === "password" ? !showPassword.password :
                                        field.key === "confirmPassword" ? !showPassword.confirmPassword :
                                            false
                                }
                            />

                            {(field.key === "password" || field.key === "confirmPassword") && (
                                <InputSlot
                                    onPress={() =>
                                        setShowPassword((prev) => ({
                                            ...prev,
                                            [field.key]: !prev[field.key],
                                        }))
                                    }
                                >
                                    <Feather
                                        name={
                                            showPassword[field.key]
                                                ? "eye-off"
                                                : "eye"
                                        }
                                        size={wp("5%")}
                                        color={isDark ? "#fff" : "#000"}
                                    />
                                </InputSlot>
                            )}
                        </Input>

                        {errors[field.key as keyof Errors] && (
                            <FormControlError style={globalStyles.errorContainer}>
                                <Feather name="alert-triangle" size={20} color="#D32F2F" />
                                <FormControlErrorText style={globalStyles.errorText}>
                                    {field.type === "email"
                                        ? "Please enter valid email"
                                        : errorMessage}
                                </FormControlErrorText>
                            </FormControlError>
                        )}
                    </FormControl>
                ))}

                {/* buttons */}
                <View style={{ marginVertical: hp("3%") }}>
                    <Button
                        size="lg"
                        variant="solid"
                        action="primary"
                        style={globalStyles.purpleBackground}
                        onPress={handleEmailRegister}
                        isDisabled={loadingProvider != null}
                    >
                        {loadingProvider === "email" && (
                            <ButtonSpinner color={"#fff"} size={wp("4%")} />
                        )}
                        <FontAwesome name="envelope" size={wp("5%")} color="#fff" />
                        <ButtonText style={globalStyles.buttonText}>
                            {loadingProvider == "email"
                                ? "Signing Up...."
                                : "Sign Up"}
                        </ButtonText>
                    </Button>

                    <View className="flex-row justify-center items-center">
                        <Text
                            style={[
                                globalStyles.normalTextColor,
                                { marginVertical: hp("2%") },
                            ]}
                        >
                            ────── OR ──────
                        </Text>
                    </View>

                    <Button
                        size="lg"
                        variant="solid"
                        action="primary"
                        style={{ backgroundColor: "#DB4437", borderRadius: wp("2%") }}
                        onPress={handleGoogleRegister}
                        isDisabled={loadingProvider != null}
                    >
                        {loadingProvider === "google" && (
                            <ButtonSpinner color={"#fff"} size={wp("4%")} />
                        )}
                        <FontAwesome name="google" size={wp("5%")} color="#fff" />
                        <ButtonText style={globalStyles.buttonText}>
                            {loadingProvider === "google"
                                ? "Signing Up...."
                                : "Sign Up with Google"}
                        </ButtonText>
                    </Button>
                    <View className='flex-row justify-center items-center' style={{ marginTop: hp("2%") }}>
                        <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Already have an account? </Text>
                        <TouchableOpacity onPress={() => setCurrScreen('login')}>
                            <Text style={[globalStyles.underscoreText, globalStyles.themeTextColor]}>Sign In</Text>
                        </TouchableOpacity>

                    </View>
                </View>
            </Card>
        </View>
    );
};

export default Register;