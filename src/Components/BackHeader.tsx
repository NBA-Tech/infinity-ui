import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/GlobalStyleProvider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';
import Feather from 'react-native-vector-icons/Feather';
import { Card } from '@/components/ui/card';
const BackHeader = ({ screenName }: { screenName: string }) => {
    const globalStyles = useContext(StyleContext);
    return (
        <SafeAreaView>
            <Card style={[globalStyles.cardShadowEffect,{marginBottom:hp('1%')}]}>
                <View className='flex flex-row justify-start items-center gap-3'>
                    <Feather name="arrow-left" size={wp('7%')} color={'#000'} />
                    <Text style={globalStyles.heading3Text}>{screenName}</Text>
                </View>
            </Card>
        </SafeAreaView>
    );
};

export default BackHeader;