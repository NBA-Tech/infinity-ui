import React, { useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import {
    FormControl,
    FormControlLabel,
    FormControlLabelText,
    FormControlHelper,
    FormControlHelperText,
} from "@/components/ui/form-control"
import { StyleContext, ThemeToggleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { Input, InputField, InputSlot } from "@/components/ui/input";
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
    registerCardContainer: {
        borderTopLeftRadius: wp("8%"),
        borderRadius: wp('2%'),
    }

})
const Register = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark, toggleTheme } = useContext(ThemeToggleContext);

    const formFields = [
        {
            label: 'Username',
            type: 'text',
            placeholder: 'Eg :John Doe',
            icon: "user"
        },
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
        {
            label: 'Confirm Password',
            type: 'password',
            placeholder: '********',
            icon: "lock"
        },
    ]
    return (
        <View>
            <Card style={[styles.registerCardContainer,globalStyles.cardShadowEffect]}>
                {formFields.map((field, index) => (
                    <FormControl key={index} style={{ marginVertical: hp("1%") }}>
                        <FormControlLabel className='gap-2'>
                            <FormControlLabelText style={[globalStyles.normalTextColor, globalStyles.labelText]}>{field?.label}</FormControlLabelText>

                        </FormControlLabel>
                        <Input size='lg'>
                            <InputSlot>
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
                            )

                            }
                        </Input>
                    </FormControl>
                ))

                }
                <View style={{ marginVertical: hp("3%") }}>
                    <Button size="lg" variant="solid" action="primary" style={globalStyles.purpleBackground}>
                        <ButtonText style={globalStyles.buttonText}>Register</ButtonText>
                    </Button>
                    <View className='flex-row justify-center items-center'>
                        <Text style={[globalStyles.normalTextColor, { marginVertical: hp("2%") }]}>────── OR ──────</Text>

                    </View>
                    <Button size="lg" variant="solid" action="primary" style={{ backgroundColor: "#DB4437", borderRadius: wp('2%') }}>
                        <FontAwesome name="google" size={wp('5%')} color="#fff" />
                        <ButtonText style={globalStyles.buttonText}>Sign Up with Google</ButtonText>
                    </Button>
                </View>

            </Card>
        </View>
    );
};

export default Register;