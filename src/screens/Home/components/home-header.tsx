import GradientCard from '@/src/utils/gradient-card';
import { View, Text } from 'react-native'
import { ThemeToggleContext, StyleContext } from '@/src/providers/theme/global-style-provider';
import { useContext } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useUserStore } from '@/src/store/user/user-store';
import { scaleFont } from '@/src/styles/global';
import { heightPercentageToDP as hp, widthPercentageToDP as wp } from 'react-native-responsive-screen';

const HomeHeader = () => {
    const globalStyles = useContext(StyleContext);
    const { isDark } = useContext(ThemeToggleContext);
    const { userDetails } = useUserStore()
    return (
        <GradientCard
            colors={isDark
                ? ["#0D3B8F", "#1372F0"]  // Dark mode: deep navy → vibrant blue
                : ["#1372F0", "#6FADFF"]  // Light mode: vibrant blue → soft sky blue
            }
        >
            <View className="flex flex-col p-4 gap-5">
                {/* Welcome Centered */}
                <View className="flex flex-row justify-center items-center">
                    <Text
                        style={[
                            globalStyles.headingText,
                            globalStyles.whiteTextColor,
                            { textAlign: "center" },
                        ]}
                    >
                        Welcome {userDetails?.userAuthInfo?.username || "User"} !
                    </Text>
                </View>

                <View className="flex flex-row justify-between items-center mt-1">
                    <View className="flex flex-col gap-2">
                        <Text
                            style={[
                                globalStyles.subHeadingText,
                                { color: "#FFFFFFB2" },
                            ]}
                        >
                            Total Balance
                        </Text>
                        <Text style={[globalStyles.headingText, globalStyles.whiteTextColor, { fontSize: scaleFont(40) }]}>
                            $ {userDetails?.userAuthInfo?.totalBalance || 0}
                        </Text>
                    </View>
                    <View className='flex flex-col gap-2'>
                        <View className='flex flex-row justify-between items-center'>
                            <Feather name="trending-up" size={wp('8%')} color="rgba(255,255,255,0.2)" />
                            <Text style={[globalStyles.smallText, { color: "#FFFFFFB2" }]}>+ 5.00%</Text>
                        </View>
                        <View>
                            <Text style={[globalStyles.smallText, { color: "#FFFFFFB2" }]}>Since last month</Text>
                        </View>

                    </View>
                </View>
            </View>

        </GradientCard>
    )
};

export default HomeHeader