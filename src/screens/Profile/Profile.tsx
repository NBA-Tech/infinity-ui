import React, { useContext } from 'react';
import { View, Text } from 'react-native';
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import Header from '@/src/components/header';
const Profile = () => {
    const globalStyles = useContext(StyleContext);
    return (
        <SafeAreaView style={globalStyles.appBackground}>
            <Header />
            <View>
                <View>
                    
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Profile;