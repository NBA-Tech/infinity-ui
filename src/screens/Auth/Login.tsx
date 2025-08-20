import React, { useContext } from 'react';
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { View, StyleSheet,Text } from 'react-native';
import { Card } from '@/components/ui/card';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import { FormControl, FormControlLabel, FormControlLabelText } from '@/components/ui/form-control';
import { Input, InputField, InputSlot } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';

const styles = StyleSheet.create({
    loginContainer: {
        margin: hp("2%")
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
            placeholder: 'Password',
            icon: "lock"
        },
    ]

    return (
        <View className='flex-1'>
            <Card style={styles.loginContainer}>
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
                    <ButtonText style={globalStyles.buttonText}>Login</ButtonText>
                </Button>
                <View className='flex-row justify-center items-center'>
                    <Text style={[globalStyles.normalTextColor, { marginVertical: hp("2%") }]}>────── OR ──────</Text>

                </View>
                <Button size="lg" variant="solid" action="primary" style={{ backgroundColor: "#DB4437", borderRadius: wp('2%') }}>
                    <FontAwesome name="google" size={wp('5%')} color="#fff" />
                    <ButtonText style={globalStyles.buttonText}>Sign In with Google</ButtonText>
                </Button>


            </Card>

        </View>
    );
};

export default Login;