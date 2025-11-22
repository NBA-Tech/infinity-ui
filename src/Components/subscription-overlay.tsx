import React, { ReactNode, useContext } from 'react';
import { View, StyleSheet, Text, Dimensions } from 'react-native';
import { BlurView } from '@react-native-community/blur';
import { useSubscription } from '../providers/subscription/subscription-context';
import { ThemeToggleContext, StyleContext } from '../providers/theme/global-style-provider';
import LottieView from 'lottie-react-native';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import { Button, ButtonText } from '@/components/ui/button';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '../types/common';
import Header from './header';
type Props = {
    children?: ReactNode;
};

const SubscriptionLockOverlay: React.FC<Props> = ({ children }) => {
    const { isLoading, isSubscribed } = useSubscription();
    const globalStyles = useContext(StyleContext);
    const navigation = useNavigation<NavigationProp>();

    // If subscribed, just render children
    if (isLoading) {
        return (
            <View className='flex flex-col items-center justify-center h-full'>
                <LottieView
                    source={require("../assets/animations/preparing-dasboard.json")}
                    autoPlay
                    loop={true}
                    style={{ width: wp('100%'), height: hp('50%') }}
                />
                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Hold On Preparing Your Dashboard...</Text>


            </View>
        )
    }
    if (isSubscribed) return <>{children}</>;

    // Otherwise show overlay
    return (
        <View style={globalStyles.appBackground}>
            <View className='flex flex-col items-center justify-center h-full'>
                <LottieView
                    source={require("../assets/animations/profile_lock.json")}
                    autoPlay
                    loop
                    style={{ width: wp('60%'), height: wp('60%') }}
                />
                <Text style={[globalStyles.heading3Text, globalStyles.themeTextColor]}>Oops! You are not subscribed.</Text>
                <Text style={[globalStyles.labelText, globalStyles.themeTextColor]}>Please subscribe to unlock this feature.</Text>
                <Button
                    size="lg"
                    variant="solid"
                    action="primary"
                    style={[globalStyles.buttonColor, { marginVertical: hp('2%') }]}
                >
                    <FontAwesome name="envelope" size={wp("5%")} color="#fff" />
                    <ButtonText style={globalStyles.buttonText} onPress={() => navigation.navigate("Subscription")}>
                        Subscribe
                    </ButtonText>
                </Button>
            </View>
        </View>
    );
};


export default SubscriptionLockOverlay;
