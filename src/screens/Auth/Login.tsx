import React, { useContext } from 'react';
import { StyleContext } from '@/src/providers/theme/global-style-provider';
import { View, StyleSheet, Text } from 'react-native';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
    loginContainer: {
        borderTopLeftRadius: wp("10%"),
        paddingBottom: hp("2%"),
    },
    forgotPasswordContainer:{
        alignItems: 'flex-end',
        marginVertical: hp("1.5%")
    }
})

const Login = () => {
    const globalStyles = useContext(StyleContext);
    const formFields = [
        {
            label: 'Email',
            type: 'email',
            placeholder: 'Eg :YJy0g@example.com',
            icon: "mail"
        },
        {
            label: 'Password',
            type: 'password',
            placeholder: '********',
            icon: "lock"
        },
    ]

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
                                type={field?.type}
                                placeholder={field?.placeholder}
                                keyboardType={
                                    field?.type === "number" ? "numeric" :
                                        field?.type === "email" ? "email-address" :
                                            "default"
                                }
                                secureTextEntry={field?.type === "password"}
                            />
                            {field?.type === 'password' && (
                                <InputSlot>
                                    <Feather name={'eye'} size={wp('5%')} color="#000" />
                                </InputSlot>
                            )}
                        </Input>
                    </FormControl>
                ))}
                <View  style={styles.forgotPasswordContainer}>
                    <Text style={[globalStyles.underscoreText]}>Forgot Password?</Text>
                </View>
                <View style={{ marginVertical: hp("3%") }}>
                    <Button size="lg" variant="solid" action="primary" style={globalStyles.purpleBackground}>
                        <ButtonText style={globalStyles.buttonText}>Login</ButtonText>
                    </Button>
                    <View className='flex-row justify-center items-center'>
                        <Text style={[globalStyles.normalTextColor, { marginVertical: hp("2%") }]}>────── OR ──────</Text>
                    </View>
                    <Button size="lg" variant="solid" action="primary" style={{ backgroundColor: "#DB4437", borderRadius: wp('2%') }}>
                        <FontAwesome name="google" size={wp('5%')} color="#fff" />
                        <ButtonText style={globalStyles.buttonText}>Sign In with Google</ButtonText>
                    </Button>
                    <View className='flex-row justify-center items-center' style={{ marginTop: hp("2%") }}>
                        <Text style={[globalStyles.labelText]}>Don't have an account? </Text>
                        <Text style={[globalStyles.underscoreText]}>Sign Up</Text>

                    </View>
                </View>
            </Card>
        </View>
    );
};

export default Login;