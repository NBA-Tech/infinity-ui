import React,{useContext} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import GradientCard from '@/src/utils/GradientCard';
import {Image} from '@/components/ui/image';
import Logo from '../../assets/images/logo.png'
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';
import UserOnBoarding from './UserOnBoarding';

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
        <SafeAreaView className="flex-1 bg-gray-100">
            <View style={styles.body}>
                {/* Header */}
                <View style={styles.headingContainer}>
                    <View className="justify-center items-center">
                        <GradientCard>
                            <Card size='md' variant='ghost'>
                                <View className='flex justify-center items-center'>
                                    <Image size='xs' source={Logo} />
                                </View>
                            </Card>
                        </GradientCard>
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
