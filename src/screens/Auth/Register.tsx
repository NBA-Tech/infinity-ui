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
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { Input, InputField, InputSlot } from "@/components/ui/input";
import Feather from 'react-native-vector-icons/Feather';
import { Button, ButtonIcon, ButtonText } from '@/components/ui/button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const styles = StyleSheet.create({
    registerCardContainer: {
        margin: hp("2%")
    }

})
const Register = () => {
    const globalStyles = useContext(StyleContext);

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
            placeholder: 'Password',
            icon: "lock"
        },
        {
            label: 'Confirm Password',
            type: 'password',
            placeholder: 'Confirm Password',
            icon: "lock"
        },
    ]
    return (
        <View className='flex-1'>
            <Card style={styles.registerCardContainer}>
                {formFields.map((field, index) => (
                    <FormControl style={{ marginVertical: hp("1%") }}>
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

                        </Input>
                    </FormControl>
                ))

                }
                <Button size="lg" variant="solid" action="primary" style={globalStyles.purpleBackground}>
                    <ButtonText style={globalStyles.buttonText}>Register</ButtonText>
                </Button>
                <View className='flex-row justify-center items-center'>
                    <Text style={[globalStyles.normalTextColor, { marginVertical: hp("2%") }]}>────── OR ──────</Text>

                </View>
                <Button size="lg" variant="solid" action="primary" style={{ backgroundColor: "#DB4437",borderRadius:wp('2%') }}>
                        <FontAwesome name="google" size={wp('5%')} color="#fff" />
                    <ButtonText style={globalStyles.buttonText}>Sign Up with Google</ButtonText>
                </Button>

            </Card>
        </View>
    );
};

export default Register;