import React,{useContext} from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '@/components/ui/card';
import GradientCard from '@/src/utils/GradientCard';
import {Image} from '@/components/ui/image';
import Logo from '../../assets/images/logo.png'
import { StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { heightPercentageToDP as hp,widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Register from './Register';

const styles=StyleSheet.create({
    headingContainer:{
        marginVertical:hp("0.5%")
    }
})
const Authentication = () => {
    const globalStyles=useContext(StyleContext);
    return (
        <SafeAreaView className="flex-1 bg-gray-100">
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.headingContainer}>
                    <View className="flex-1 justify-center items-center">
                        <GradientCard>
                            <Card size='md' variant='ghost'>
                                <View className='flex justify-center items-center'>
                                    <Image size='md' source={Logo} />
                                </View>
                            </Card>
                        </GradientCard>
                        <Text style={[globalStyles.purpleTextColor,globalStyles.headingText,styles.headingContainer]}>INFINITY COLORLAB</Text>
                        <Text style={[globalStyles.normalTextColor,globalStyles.subHeadingText]}>Create your account !</Text>
                        

                    </View>

                    <Register/>

                </View>
                <View className='justify-center items-center flex-row'>
                    <Text style={[globalStyles.normalTextColor,globalStyles.labelText]}>Already have an account? </Text>
                    <Text style={[globalStyles.purpleTextColor,globalStyles.underscoreText]}>Login</Text>

                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

export default Authentication;