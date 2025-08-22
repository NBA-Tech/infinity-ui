import React,{useContext} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import GradientCard from '@/src/utils/GradientCard';
import {Image} from '@/components/ui/image';
import Logo from '../../assets/images/logo.png'
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import UserOnBoarding from './UserOnBoarding';
import Login from './Login';
import Register from './Register';
import OneTimePassword from './OneTimePassword';

const styles=StyleSheet.create({
    headingContainer:{
        marginVertical:hp("0.1%")
    },
    body:{
        flex:1,
        justifyContent:"space-between"
    }
})
const Authentication = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <View style={styles.body}>
                {/* Header */}
                <View style={styles.headingContainer}>
                    <View className="justify-center items-center">
                            <Card size='xs' variant='ghost'>
                                <View className='flex justify-center items-center'>
                                    <Image size='lg' source={Logo} />
                                </View>
                            </Card>
                        <Text style={[globalStyles.purpleTextColor, globalStyles.headingText, styles.headingContainer]}>
                            INFINITY COLORLAB
                        </Text>
                        <Text style={[globalStyles.normalTextColor, globalStyles.subHeadingText]}>
                            Create your account !
                        </Text>
                    </View>
                </View>

                {/* Onboarding Card */}
                <UserOnBoarding />

                {/* Footer */}
                {/* <View className='justify-center items-center flex-row mb-4'>
                    <Text style={[globalStyles.normalTextColor, globalStyles.labelText]}>
                        Already have an account? 
                    </Text>
                    <Text style={[globalStyles.purpleTextColor, globalStyles.underscoreText]}> Login</Text>
                </View> */}
            </View>
        </SafeAreaView>
    );
};

export default Authentication;
